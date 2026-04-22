import { db } from "../config/db";
import { RowDataPacket, ResultSetHeader } from "mysql2";

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

export const pozoviKorisnikaNaProjekat=  async (projekatId: number, korisnikId: number, email: string) => {
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

export const odgovoriNaPoziv = async (projekatId: number, korisnikId: number, status: "prihvacen" | "odbijen") => {
    
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