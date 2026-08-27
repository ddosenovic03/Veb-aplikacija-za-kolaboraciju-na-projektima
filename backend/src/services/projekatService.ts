import { db } from "../config/dbConfig";
import { RowDataPacket, ResultSetHeader } from "mysql2";
import { 
    provjeriClanstvoNaProjektu, 
    provjeriVlasnikaProjekta,
    provjeriPozivNaProjekat,
    provjeriPravoPregledaProjekta,
    provjeriPravoPozivanjaNaProjekat
} from "../utils/authorizationHelper";
import { mapProjekat, mapPozivZaProjekat, mapNapredakProjekta } from "../dto/projekatDto";
import { mapPosaoZaListu } from "../dto/posaoDto";
import { HttpGreska } from "../utils/requestHelper";

type KreiranjeProjektaPodaci = {
    naziv: string;
    opis? : string | undefined;
    vlasnik_id : number;  
};

const dobaviPozivZaOdgovor = async (projekatId: number, pozvaniKorisnikId: number) => {

    const [pozivi] = await db.query<RowDataPacket[]> (
        `
        SELECT
            c.id AS clanstvo_id,
            c.status,
            p.id AS projekat_id,
            p.naziv,
            p.opis,
            p.datum_kreiranja,
            v.id AS vlasnik_id,
            v.ime AS vlasnik_ime,
            v.prezime AS vlasnik_prezime,
            v.korisnicko_ime AS vlasnik_korisnicko_ime
        FROM ClanstvoNaProjektu c
        JOIN Projekat p ON c.projekat_id = p.id
        JOIN Korisnik v ON p.vlasnik_id = v.id
        WHERE c.projekat_id = ? AND c.korisnik_id = ?
        `,
        [projekatId, pozvaniKorisnikId]
    );

    if (pozivi.length === 0) {
        throw new Error("Poziv nije pronađen.");
    }

    return mapPozivZaProjekat(pozivi[0]);
};

export const kreirajProjekat = async (podaci: KreiranjeProjektaPodaci) => {
    
    const { naziv, opis, vlasnik_id } = podaci;

    if (!naziv || !naziv.trim()) {
        throw new Error("Naziv projekta je obavezan.");
    }

    const konekcija = await db.getConnection();

    try {
        await konekcija.beginTransaction();

        const [rezultatProjekat] = await konekcija.query<ResultSetHeader>(
            `
            INSERT INTO Projekat (naziv, opis, vlasnik_id)
            VALUES (?, ?, ?)
            `,
            [naziv.trim(), opis?.trim() || null, vlasnik_id]
        );

        const projekatId = rezultatProjekat.insertId;

        await konekcija.query<ResultSetHeader>(
            `
            INSERT INTO ClanstvoNaProjektu (korisnik_id, projekat_id, status) 
            VALUES (?, ?, 'prihvacen')
            `,
            [vlasnik_id, projekatId]
        );

        await konekcija.commit();

        return {
            id: projekatId,
            naziv: naziv.trim(),
            opis: opis?.trim() || null,
            vlasnik_id
        };
   
    } catch (greska) {
        await konekcija.rollback();
        throw greska;
    } finally {
        konekcija.release();
    };

};

export const pozoviKorisnikaNaProjekat = async (projekatId: number, korisnikId: number, email: string) => {
    
    await provjeriPravoPozivanjaNaProjekat(projekatId, korisnikId);

    if (!email || !email.trim()) {
        throw new Error("Email korisnika je obavezan.");
    }

    const [korisnici] = await db.query<RowDataPacket[]>(
        `
        SELECT * FROM Korisnik
        WHERE email = ?
        `,
        [email.trim()]
    );
    const pozvaniKorisnik = korisnici[0];

    if (!pozvaniKorisnik) {
        throw new Error("Korisnik sa datim emailom nije pronađen.");
    }

    const [postojecaClanstva] = await db.query<RowDataPacket[]>(
        `
        SELECT status FROM ClanstvoNaProjektu
        WHERE korisnik_id = ? AND projekat_id = ?
        `,
        [pozvaniKorisnik.id, projekatId]
    );
    const postojeceClanstvo = postojecaClanstva[0];

    if (postojeceClanstvo) {
        if (postojeceClanstvo.status === "prihvacen") {
            throw new Error("Korisnik je već član ovog projekta.");
        }

        if (postojeceClanstvo.status === "pozvan") {
            throw new Error("Korisnik je već pozvan na ovaj projekat.");
        }

        throw new Error("Korisnik je već imao poziv za ovaj projekat.");
    }

    await db.query<ResultSetHeader> (
        `
        INSERT INTO ClanstvoNaProjektu (korisnik_id, projekat_id, status)
        VALUES (?, ?, 'pozvan')
        `,
        [pozvaniKorisnik.id, projekatId]
    );

    return await dobaviPozivZaOdgovor(projekatId, pozvaniKorisnik.id);
};

export const odgovoriNaPozivZaProjekat = async (projekatId: number, korisnikId: number, status: "prihvacen" | "odbijen") => {
    
    if (status !== "prihvacen" && status !== "odbijen") {
        throw new Error("Status odgovora na poziv nije validan.");
    }

    await provjeriPozivNaProjekat(projekatId, korisnikId);
    await db.query(
        `
        UPDATE ClanstvoNaProjektu
        SET status = ?
        WHERE projekat_id = ? AND korisnik_id = ?
        `,
        [status, projekatId, korisnikId]
    );

    return await dobaviPozivZaOdgovor(projekatId, korisnikId);
};

export const dobaviPosloveZaProjekat = async (projekatId: number, korisnikId: number) => {

    await provjeriPravoPregledaProjekta(projekatId, korisnikId);
    
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
            COUNT(a.id) AS broj_angazovanih,
            COALESCE(ROUND(AVG(a.procenat), 2), 0) AS procenat_posla
        FROM Posao p
        JOIN Korisnik k ON p.kreator_id = k.id
        LEFT JOIN AngazmanNaPoslu a ON p.id = a.posao_id
        WHERE p.projekat_id = ?
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
        ORDER BY p.datum_kreiranja DESC
        `,
        [projekatId]
    );
    
    return poslovi.map(mapPosaoZaListu);
};

export const dobaviMojeProjekte = async (korisnikId: number) => {
    
    const [projekti] = await db.query<RowDataPacket[]>(
        `
        SELECT 
            p.id, 
            p.naziv, 
            p.opis, 
            p.datum_kreiranja, 
            p.vlasnik_id, 
            COUNT(DISTINCT c2.korisnik_id) AS broj_clanova,
            COUNT(DISTINCT po.id) AS broj_poslova,
            COALESCE(ROUND(AVG(procenti_poslova.procenat_posla), 2), 0) AS procenat_projekta
        FROM Projekat p
        JOIN ClanstvoNaProjektu c ON c.projekat_id = p.id
        LEFT JOIN ClanstvoNaProjektu c2 ON c2.projekat_id = p.id AND c2.status = 'prihvacen'
        LEFT JOIN Posao po ON po.projekat_id = p.id
        LEFT JOIN (
            SELECT
                posao_id,
                AVG(procenat) AS procenat_posla
            FROM AngazmanNaPoslu
            GROUP BY posao_id
        ) procenti_poslova ON procenti_poslova.posao_id = po.id
        WHERE c.korisnik_id = ? AND c.status = 'prihvacen'
        GROUP BY
            p.id,
            p.naziv,
            p.opis,
            p.datum_kreiranja,
            p.vlasnik_id
        ORDER BY p.datum_kreiranja DESC 
        `,
        [korisnikId]
    );

    return projekti.map(mapProjekat);
};

export const dobaviDetaljeProjekta = async (projekatId: number, korisnikId: number) => {
    
    await provjeriPravoPregledaProjekta(projekatId, korisnikId);

    const [projekti] = await db.query<RowDataPacket[]>(
        `
        SELECT
            p.id,
            p.naziv,
            p.opis,
            p.datum_kreiranja,
            p.vlasnik_id,
            v.ime AS vlasnik_ime,
            v.prezime AS vlasnik_prezime,
            v.korisnicko_ime AS vlasnik_korisnicko_ime,
            COUNT(DISTINCT c.korisnik_id) AS broj_clanova,
            COUNT(DISTINCT po.id) AS broj_poslova,
            COALESCE(ROUND(AVG(procenti_poslova.procenat_posla), 2), 0) AS procenat_projekta
        FROM Projekat p
        JOIN Korisnik v ON p.vlasnik_id = v.id
        LEFT JOIN ClanstvoNaProjektu c ON c.projekat_id = p.id AND c.status = 'prihvacen'
        LEFT JOIN Posao po ON po.projekat_id = p.id
        LEFT JOIN (
            SELECT
                posao_id,
                AVG(procenat) AS procenat_posla
            FROM AngazmanNaPoslu
            GROUP BY posao_id
        ) procenti_poslova ON procenti_poslova.posao_id = po.id
        WHERE p.id = ?
        GROUP BY
            p.id,
            p.naziv,
            p.opis,
            p.datum_kreiranja,
            p.vlasnik_id,
            v.ime,
            v.prezime,
            v.korisnicko_ime
        `,
        [projekatId]
    );

    if (projekti.length === 0) {
        throw new HttpGreska("Projekat nije pronađen.", 404);
    }

    return mapProjekat(projekti[0]);
};

export const dobaviPoziveKorisnikaNaProjekte = async (korisnikId: number) => {
    
    const [pozivi] = await db.query<RowDataPacket[]>(
        `
        SELECT
            c.id as clanstvo_id,
            c.status,
            p.id as projekat_id,
            p.naziv,
            p.opis,
            p.datum_kreiranja,
            v.id as vlasnik_id,
            v.ime as vlasnik_ime,
            v.prezime as vlasnik_prezime,
            v.korisnicko_ime as vlasnik_korisnicko_ime
        FROM ClanstvoNaProjektu c
        JOIN Projekat p ON c.projekat_id = p.id
        JOIN Korisnik v ON p.vlasnik_id = v.id
        WHERE c.korisnik_id = ? AND c.status = 'pozvan'
        ORDER BY p.datum_kreiranja DESC
        `, [korisnikId]
    );

    return pozivi.map(mapPozivZaProjekat);
};

export const dobaviClanoveProjekta = async (projekatId: number, korisnikId: number) => {

    await provjeriClanstvoNaProjektu(projekatId, korisnikId);

    const [clanovi] = await db.query<RowDataPacket[]>(
        `
        SELECT
            k.id,
            k.ime,
            k.prezime,
            k.korisnicko_ime,
            k.email,
            c.status,
            c.projekat_id,
            CASE
                WHEN p.vlasnik_id = k.id THEN 'vlasnik'
                ELSE 'clan'
            END AS uloga
        FROM ClanstvoNaProjektu c
        JOIN Korisnik k ON c.korisnik_id = k.id
        JOIN Projekat p ON c.projekat_id = p.id
        WHERE c.projekat_id = ? AND c.status = 'prihvacen'
        ORDER BY uloga DESC, k.ime ASC
        `,
        [projekatId]
    );

    return clanovi;
};

export const dobaviPozvaneKorisnikeNaProjekat = async (projekatId : number, korisnikId: number) => {

    await provjeriPravoPozivanjaNaProjekat(projekatId, korisnikId);

    const [pozivi] = await db.query<RowDataPacket[]>(
        `
        SELECT
            k.id,
            k.ime,
            k.prezime,
            k.korisnicko_ime,
            k.email,
            c.id AS clanstvo_id,
            c.status,
            c.projekat_id
        FROM ClanstvoNaProjektu c
        JOIN Korisnik k ON c.korisnik_id = k.id
        WHERE c.projekat_id = ? AND c.status = 'pozvan'
        ORDER BY k.ime ASC
        `,
        [projekatId]
    );

    return pozivi;
};

export const dobaviNapredakProjekta = async (projekatId: number, korisnikId: number) => {

    await provjeriPravoPregledaProjekta(projekatId, korisnikId);

    const [redovi] = await db.query<RowDataPacket[]>(
        `
        SELECT
            COALESCE(ROUND(AVG(poslovi_procenat.procenat_posla), 2), 0) AS procenat_projekta,
            SUM(CASE WHEN COALESCE(poslovi_procenat.procenat_posla, 0) = 0 THEN 1 ELSE 0 END) AS broj_nezapocetih,
            SUM(CASE WHEN COALESCE(poslovi_procenat.procenat_posla, 0) > 0 
                AND COALESCE(poslovi_procenat.procenat_posla, 0) < 100 THEN 1 ELSE 0 END) AS broj_u_toku,
            SUM(CASE WHEN COALESCE(poslovi_procenat.procenat_posla, 0) = 100 THEN 1 ELSE 0 END) AS broj_zavrsenih,
            COUNT(p.id) AS ukupan_broj_poslova
        FROM Posao p
        LEFT JOIN (
            SELECT
                posao_id,
                AVG(procenat) as procenat_posla
            FROM AngazmanNaPoslu
            GROUP BY posao_id
        ) poslovi_procenat ON poslovi_procenat.posao_id = p.id
        WHERE p.projekat_id = ?   
        `,
        [projekatId]
    );

    return mapNapredakProjekta(redovi[0]);
};

export const izmijeniProjekat = async (projekatId: number, korisnikId: number, naziv?: string, opis?: string) => {

    await provjeriVlasnikaProjekta(projekatId, korisnikId);

    const poljaZaIzmjenu: string[] = [];
    const vrijednosti: unknown[] = [];

    if (naziv !== undefined) {
        if (!naziv.trim()) {
            throw new Error("Naziv projekta ne sme biti prazan.");
        }

        poljaZaIzmjenu.push("naziv = ?");
        vrijednosti.push(naziv.trim());
    }

    if (opis !== undefined) {
        poljaZaIzmjenu.push("opis = ?");
        vrijednosti.push(opis.trim() || null);
    }

    if (poljaZaIzmjenu.length === 0) {
        throw new Error("Nema podataka za izmenu projekta.");
    }

    vrijednosti.push(projekatId);

    await db.query(
        `
        UPDATE Projekat
        SET ${poljaZaIzmjenu.join(", ")}
        WHERE id = ?
        `,
        vrijednosti
    );

    return await dobaviDetaljeProjekta(projekatId, korisnikId);
};

export const obrisiProjekat = async (projekatId: number, korisnikId: number) => {

    const projekat = await provjeriVlasnikaProjekta(projekatId, korisnikId);

    await db.query(
        `
        DELETE FROM Projekat
        WHERE id = ?
        `,
        [projekatId]
    );

    return {
        id: projekat?.id,
        naziv: projekat?.naziv
    };
};
