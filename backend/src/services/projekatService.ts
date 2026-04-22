import { db } from "../config/db";
import { ResultSetHeader } from "mysql2";

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