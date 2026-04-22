import { db } from "../config/db";
import { RowDataPacket, ResultSetHeader } from "mysql2";

export const prijavaNaPosao = async (posaoId: number, korisnikId: number, predlozeniRok?: string) => {

    const [poslovi] = await db.query<RowDataPacket[]>(
        `
        SELECT * FROM Posao
        WHERE id = ?
        `,
        [posaoId]
    );

    const posao = poslovi[0];

    if (!posao) {
        throw new Error("Posao nije pronađen");
    }

    const [clanstva] = await db.query<RowDataPacket[]>(
        `
        SELECT * FROM ClanstvoNaProjektu
        WHERE korisnik_id = ? AND projekat_id = ? AND status = 'prihvacen'
        `,
        [korisnikId, posao.projekat_id]
    );

    if (clanstva.length === 0) {
        throw new Error("Korisnik nije član projekta.");
    }

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
        posaoId: posaoId,
        korisnikId: korisnikId,
        predlozeniRok: predlozeniRok || null,
        procenat: 0
    }
};