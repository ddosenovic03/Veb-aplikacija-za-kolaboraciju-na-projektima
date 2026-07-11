import { db } from "../config/dbConfig";
import { RowDataPacket, ResultSetHeader } from "mysql2";
import { 
    provjeriPravoKreiranjaPoslaUProjektu,
    provjeriPravoPrijaveNaPosao,
    provjeriPravoPrikazaPosla,
    provjeriPravoAzuriranjaProcentaPosla,
    provjeriPravoIzmjenePosla,
    provjeriPravoBrisanjaPosla
} from "../utils/authorizationHelper";
import { mapPosaoZaListu, mapDetaljiPosla } from "../dto/posaoDto";

const dobaviPosaoZaListu = async (posaoId: number) => {

    const [poslovi] = await db.query<RowDataPacket[]> (
        `
        SELECT
            p.id,
            p.naziv,
            p.opis,
            p.rok,
            p.datum_kreiranja,
            p.projekat_id,
            pr.naziv AS projekat_naziv,
            p.kreator_id,
            k.ime AS kreator_ime,
            k.prezime AS kreator_prezime,
            k.korisnicko_ime AS kreator_korisnicko_ime,
            COALESCE(statistika_posla.broj_angazovanih, 0) AS broj_angazovanih,
            COALESCE(ROUND(statistika_posla.procenat_posla, 2), 0) AS procenat_posla
        FROM Posao p
        JOIN Projekat pr ON p.projekat_id = pr.id
        JOIN Korisnik k ON p.kreator_id = k.id
        LEFT JOIN (
            SELECT
                posao_id,
                COUNT(*) AS broj_angazovanih,
                AVG(procenat) AS procenat_posla
            FROM AngazmanNaPoslu
            GROUP BY posao_id
        ) statistika_posla ON statistika_posla.posao_id = p.id
        WHERE p.id = ?
        `,
        [posaoId]
    );

    if (poslovi.length === 0) {
        throw new Error("Posao nije pronađen.");
    }

    return mapPosaoZaListu(poslovi[0]);
};

export const kreirajPosao = async (projekatId: number, korisnikId: number, naziv: string, opis: string | undefined, rok: string) => {

    await provjeriPravoKreiranjaPoslaUProjektu(projekatId, korisnikId);

    if (!naziv || !naziv.trim()) {
        throw new Error("Naziv posla je obavezan.");
    }

    if (!rok) {
        throw new Error("Rok posla je obavezan.");
    }

    const konekcija = await db.getConnection();

    try {
        await konekcija.beginTransaction();

        const [rezultat] = await konekcija.query<ResultSetHeader>(
            `
            INSERT INTO Posao (naziv, opis, rok, projekat_id, kreator_id)
            VALUES (?, ?, ?, ?, ?)
            `,
            [naziv.trim(), opis?.trim() || null, rok, projekatId, korisnikId]
        );
        const posaoId = rezultat.insertId;

        await konekcija.query<ResultSetHeader>(
            `
            INSERT INTO AngazmanNaPoslu (posao_id, korisnik_id, predlozeni_rok, procenat)
            VALUES (?, ?, ?, 0)
            `,
            [posaoId, korisnikId, rok]
        );
        await konekcija.commit();

        return await dobaviDetaljePosla(posaoId, korisnikId);
    } catch (error) {
        await konekcija.rollback();
        throw error;
    } finally {
        konekcija.release();
    }
};

export const prijaviSeNaPosao = async (posaoId: number, korisnikId: number, predlozeniRok?: string) => {

    await provjeriPravoPrijaveNaPosao(posaoId, korisnikId);

    const [postojeciAngazmani] = await db.query<RowDataPacket[]>(
        `
        SELECT * FROM AngazmanNaPoslu
        WHERE korisnik_id = ? AND posao_id = ?
        `,
        [korisnikId, posaoId]
    );

    if (postojeciAngazmani.length > 0) {
        throw new Error("Korisnik je već prijavljen na ovaj posao.");
    }

    const [rezultat] = await db.query<ResultSetHeader>(
        `
        INSERT INTO AngazmanNaPoslu (korisnik_id, posao_id, predlozeni_rok, procenat)
        VALUES (?, ?, ?, 0)
        `,
        [korisnikId, posaoId, predlozeniRok || null]
    );

    return {
        id: rezultat.insertId,
        korisnik_id: korisnikId,
        posao_id: posaoId,
        predlozeni_rok: predlozeniRok || null,
        procenat: 0
    };
};

export const azurirajProcenatPosla = async (posaoId: number, korisnikId: number, procenat: number) => {

    if (!Number.isFinite(procenat) || procenat < 0 || procenat > 100) {
        throw new Error("Procenat mora biti između 0 i 100.");
    }

    const angazman = await provjeriPravoAzuriranjaProcentaPosla(posaoId, korisnikId);

    await db.query(
        `
        UPDATE AngazmanNaPoslu
        SET procenat = ?
        WHERE korisnik_id = ? AND posao_id = ?
        `,
        [procenat, korisnikId, posaoId]
    );

    return {
        id: angazman?.id,
        posao_id: angazman?.posao_id,
        korisnik_id: angazman?.korisnik_id 
    };
};

export const dobaviDetaljePosla = async (posaoId: number, korisnikId: number) => {
    
    await provjeriPravoPrikazaPosla(posaoId, korisnikId);

    const [poslovi] = await db.query<RowDataPacket[]>(
        `
        SELECT
            p.id,
            p.naziv,
            p.opis,
            p.rok,
            p.datum_kreiranja,
            p.projekat_id,
            p.kreator_id,
            k.ime AS kreator_ime,
            k.prezime AS kreator_prezime,
            k.korisnicko_ime AS kreator_korisnicko_ime,
            COALESCE(ROUND(AVG(a.procenat), 2), 0) AS procenat_posla
        FROM Posao p
        JOIN Korisnik k ON p.kreator_id = k.id
        LEFT JOIN AngazmanNaPoslu a ON p.id = a.posao_id
        WHERE p.id = ?
        GROUP BY
            p.id,
            p.naziv,
            p.opis,
            p.rok,
            p.datum_kreiranja,
            p.projekat_id,
            p.kreator_id,
            k.ime,
            k.prezime,
            k.korisnicko_ime
        `,
        [posaoId]
    );

    if (poslovi.length === 0) {
        throw new Error("Posao nije pronađen.");
    }

    const [angazovani] = await db.query<RowDataPacket[]>(
        `
        SELECT 
            a.id AS angazman_id,
            a.korisnik_id,
            a.predlozeni_rok,
            a.procenat,
            a.datum_prijave,
            k.ime,
            k.prezime,
            k.korisnicko_ime
        FROM AngazmanNaPoslu a
        JOIN Korisnik k ON a.korisnik_id = k.id
        WHERE a.posao_id = ?
        ORDER BY a.datum_prijave ASC
        `,
        [posaoId]
    );

    return mapDetaljiPosla(poslovi[0], angazovani);
};

export const dobaviMojePoslove = async (korisnikId: number) => {

    const [poslovi] = await db.query<RowDataPacket[]>(
        `
        SELECT
            p.id,
            p.naziv,
            p.opis,
            p.rok,
            p.datum_kreiranja,
            p.projekat_id,
            pr.naziv AS projekat_naziv,
            p.kreator_id,
            k.ime AS kreator_ime,
            k.prezime AS kreator_prezime,
            k.korisnicko_ime AS kreator_korisnicko_ime,
            a.procenat AS moj_procenat,
            a.predlozeni_rok,
            COALESCE(statistika_posla.broj_angazovanih, 0) AS broj_angazovanih, 
            COALESCE(ROUND(statistika_posla.procenat_posla, 2), 0) AS procenat_posla
        FROM AngazmanNaPoslu a
        JOIN Posao p ON a.posao_id = p.id
        JOIN Korisnik k ON p.kreator_id = k.id
        JOIN Projekat pr ON p.projekat_id = pr.id
        LEFT JOIN (
            SELECT
                posao_id,
                AVG(procenat) as procenat_posla,
                COUNT(*) AS broj_angazovanih
            FROM AngazmanNaPoslu
            GROUP BY posao_id
        ) statistika_posla ON statistika_posla.posao_id = p.id
        WHERE a.korisnik_id = ?
        ORDER BY p.rok ASC
        `,
        [korisnikId]
    );

    return poslovi.map(mapPosaoZaListu);
};

export const dobaviKreiranePoslove = async (korisnikId: number) => {

    const [poslovi] = await db.query<RowDataPacket[]>(
        `
        SELECT
            p.id,
            p.naziv,
            p.opis,
            p.rok,
            p.datum_kreiranja,
            p.projekat_id,
            pr.naziv AS projekat_naziv,
            COUNT(a.id) AS broj_angazovanih,
            COALESCE(ROUND(AVG(a.procenat), 2), 0) AS procenat_posla
        FROM Posao p
        JOIN Projekat pr ON p.projekat_id = pr.id
        LEFT JOIN AngazmanNaPoslu a ON p.id = a.posao_id
        WHERE p.kreator_id = ?
        GROUP BY
            p.id,
            p.naziv,
            p.opis,
            p.rok,
            p.datum_kreiranja,
            p.projekat_id,
            pr.naziv
        ORDER BY p.datum_kreiranja DESC
        `,
        [korisnikId]
    );

    return poslovi.map(mapPosaoZaListu);
};

export const izmijeniPosao = async (posaoId: number, korisnikId: number, naziv?: string, opis?: string, rok?: string) => {

    await provjeriPravoIzmjenePosla(posaoId, korisnikId);

    const poljaZaIzmjenu: string[] = [];
    const vrijednosti: any[] = [];

    if (naziv !== undefined) {
        if (!naziv.trim()) {
            throw new Error("Naziv posla ne sme biti prazan.");
        }

        poljaZaIzmjenu.push("naziv = ?");
        vrijednosti.push(naziv);
    }

    if (opis !== undefined) {
        poljaZaIzmjenu.push("opis = ?");
        vrijednosti.push(opis);
    }

    if (rok !== undefined) {
        if (!rok) {
            throw new Error("Rok posla ne sme biti prazan.");
        }

        poljaZaIzmjenu.push("rok = ?");
        vrijednosti.push(rok);
    }

    if (poljaZaIzmjenu.length === 0) {
        throw new Error("Nema podataka za izmenu posla.");
    }

    vrijednosti.push(posaoId);

    await db.query<ResultSetHeader>(
        `
        UPDATE Posao
        SET ${poljaZaIzmjenu.join(", ")}
        WHERE id = ?
        `,
        vrijednosti
    );

    return await dobaviPosaoZaListu(posaoId);
};

export const obrisiPosao = async (posaoId: number, korisnikId: number) => {

    const posao = await provjeriPravoBrisanjaPosla(posaoId, korisnikId);

    await db.query<ResultSetHeader>(
        `
        DELETE FROM Posao
        WHERE id = ?
        `,
        [posaoId]
    );

    return {
        id: posaoId,
        naziv: posao?.naziv,
        projekat_id: posao?.projekat_id
    };
};