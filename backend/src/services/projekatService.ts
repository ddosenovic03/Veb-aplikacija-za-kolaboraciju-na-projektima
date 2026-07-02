import { db } from "../config/db";
import { RowDataPacket, ResultSetHeader } from "mysql2";
import { provjeriClanstvoNaProjektu } from "../utils/authorization";

type KreiranjeProjektaPodaci = {
    naziv: string;
    opis? : string;
    vlasnik_id : number;  
};

export const kreirajProjekat = async (podaci: KreiranjeProjektaPodaci) => {
    const { naziv, opis, vlasnik_id } = podaci;

    if (!naziv) {
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
            [naziv, opis || null, vlasnik_id]
        );

        const projekatId = rezultatProjekat.insertId;

        await konekcija.query(
            `
            INSERT INTO ClanstvoNaProjektu (korisnik_id, projekat_id, status) 
            VALUES (?, ?, 'prihvacen')
            `,
            [vlasnik_id, projekatId]
        );

        await konekcija.commit();

        return {
            id: projekatId,
            naziv,
            opis: opis || null,
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
    if (!email) {
        throw new Error("Email korisnika je obavezan.");
    }

    const [projekti] = await db.query<RowDataPacket[]>(
        `
        SELECT * FROM Projekat
        WHERE id = ? AND vlasnik_id = ?
        `,
        [projekatId, korisnikId]
    );

    const projekat = projekti[0];

    if (!projekat) {
        throw new Error("Projekat nije pronađen ili nemate pravo pristupa.");
    }

    const [korisnici] = await db.query<RowDataPacket[]>(
        `
        SELECT * FROM Korisnik
        WHERE email = ?
        `,
        [email]
    );

    const korisnik = korisnici[0];

    if (!korisnik) {
        throw new Error("Korisnik sa datim emailom nije pronađen.");
    }

    const [postojecaClanstva] = await db.query<RowDataPacket[]>(
        `
        SELECT * FROM ClanstvoNaProjektu
        WHERE korisnik_id = ? AND projekat_id = ?
        `,
        [korisnik.id, projekatId]
    );

    if (postojecaClanstva.length > 0) {
        throw new Error("Korisnik je već član ovog projekta.");
    }

    const [rezultat] = await db.query<ResultSetHeader>(
        `
        INSERT INTO ClanstvoNaProjektu (korisnik_id, projekat_id, status)
        VALUES (?, ?, 'pozvan')
        `,
        [korisnik.id, projekatId]
    );

    return {
        id: rezultat.insertId,
        korisnik_id: korisnik.id,
        projekat_id: projekatId,
        status: 'pozvan'
    };
};

export const odgovoriNaPozivZaProjekat = async (projekatId: number, korisnikId: number, status: "prihvacen" | "odbijen") => {
    
    const [clanstva] = await db.query<RowDataPacket[]>(
        `
        SELECT * FROM ClanstvoNaProjektu
        WHERE projekat_id = ? AND korisnik_id = ?
        `,
        [projekatId, korisnikId]
    );

    const clanstvo = clanstva[0];

    if (!clanstvo) {
        throw new Error("Poziv za ovaj projekat ne postoji.");
    }

    if (clanstvo.status !== 'pozvan') {
        throw new Error("Na ovaj poziv je već odgovoreno.");
    }

    await db.query(
        `
        UPDATE ClanstvoNaProjektu
        SET status = ?
        WHERE projekat_id = ? AND korisnik_id = ?
        `,
        [status, projekatId, korisnikId]
    );

    return {
        projekat_id: projekatId,
        korisnik_id: korisnikId,
        status
    };
};

export const kreirajPosao = async (projekatId: number, korisnikId: number, naziv: string, opis: string | undefined, rok: string) => {

    if (!naziv || !rok) {
        throw new Error("Naziv posla i rok su obavezni.");
    }

    await provjeriClanstvoNaProjektu(korisnikId, projekatId);

    const konekcija = await db.getConnection();

    try {
        await konekcija.beginTransaction();

        const [rezultat] = await konekcija.query<ResultSetHeader>(
            `
            INSERT INTO Posao (naziv, opis, rok, projekat_id, kreator_id)
            VALUES (?, ?, ?, ?, ?)
            `,
            [naziv, opis || null, rok, projekatId, korisnikId]
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

        return {
            id: posaoId,
            naziv,
            opis: opis || null,
            rok,
            projekat_id: projekatId,
            kreator_id: korisnikId,
            angazman: {
                korisnik_id: korisnikId,
                procenat: 0,
                predlozeni_rok: rok
            }
        };
    } catch (greska) {
        await konekcija.rollback();
        throw greska;
    } finally {
        konekcija.release();
    }
};

export const dobaviPosloveZaProjekat = async (projekatId: number, korisnikId: number) => {

    await provjeriClanstvoNaProjektu(korisnikId, projekatId);

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
            COUNT (a.id) AS broj_angazovanih,
            COALESCE(ROUND(AVG(a.procenat), 2), 0) AS procenat_izvrsenosti
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

    return poslovi.map((posao: any) => {

        const procenat = Number(posao.procenat_izvrsenosti);

        return {
            ...posao,
            status:
                procenat === 0
                    ? "nije započet"
                    : procenat === 100
                    ? "završen"
                    : "u toku"
        }
    });
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

    return projekti.map((projekat: any) => {
        const procenat = Number(projekat.procenat_projekta);

        return {
            ...projekat,
            status: procenat === 0 ? "nije_zapocet" : procenat === 100 ? "zavrsen" : "u_toku"
        }
    });
};

export const dobaviDetaljeProjekta = async (projekatId: number, korisnikId: number) => {
    
    await provjeriClanstvoNaProjektu(korisnikId, projekatId);

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

    const projekat = projekti[0];

    if (!projekat) {
        throw new Error("Projekat nije pronađen.");
    }

    const procenat = Number(projekat.procenat_projekta);

    return {
        id: projekat.id,
        naziv: projekat.naziv,
        opis: projekat.opis,
        datum_kreiranja: projekat.datum_kreiranja,
        broj_clanova: projekat.broj_clanova,
        broj_poslova: projekat.broj_poslova,
        procenat_projekta: procenat,
        status: procenat === 0 ? "nije_zapocet" : procenat === 100 ? "zavrsen" : "u_toku",
        vlasnik: {
            id: projekat.vlasnik_id,
            ime: projekat.vlasnik_ime,
            prezime: projekat.vlasnik_prezime,
            korisnicko_ime: projekat.vlasnik_korisnicko_ime
        }
    };
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

    return pozivi.map((poziv: any) => ({
        clanstvo_id: poziv.clanstvo_id,
        status: poziv.status,
        projekat: {
            id: poziv.projekat_id,
            naziv: poziv.naziv,
            opis: poziv.opis,
            datum_kreiranja: poziv.datum_kreiranja,
        },
        vlasnik: {
            id: poziv.vlasnik_id,
            ime: poziv.vlasnik_ime,
            prezime: poziv.vlasnik_prezime,
            korisnicko_ime: poziv.vlasnik_korisnicko_ime
        }
    }));
};

export const dobaviClanoveProjekta = async (projekatId: number, korisnikId: number) => {

    await provjeriClanstvoNaProjektu(korisnikId, projekatId);

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

    await provjeriClanstvoNaProjektu(korisnikId, projekatId);

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

    await provjeriClanstvoNaProjektu(korisnikId, projekatId);

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

    const napredak: any = redovi[0];

    return {
        procenat_projekta: Number(napredak.procenat_projekta),
        ukupan_broj_poslova: Number(napredak.ukupan_broj_poslova),
        broj_nezapocetih: Number(napredak.broj_nezapocetih),
        broj_u_toku: Number(napredak.broj_u_toku),
        broj_zavrsenih: Number(napredak.broj_zavrsenih) 
    };
};