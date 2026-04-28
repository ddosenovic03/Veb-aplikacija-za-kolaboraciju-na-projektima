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

export const azurirajProcenatPosla = async (posaoId: number, korisnikId: number, procenat: number) => {

    if (procenat < 0 || procenat > 100) {
        throw new Error("Procenat mora biti između 0 i 100.");
    }

    const [angazmani] = await db.query<RowDataPacket[]>(
        `
        SELECT * FROM AngazmanNaPoslu
        WHERE korisnik_id = ? AND posao_id = ?
        `,
        [korisnikId, posaoId]
    );

    if (angazmani.length === 0) {
        throw new Error("Korisnik nije prijavljen na ovaj posao.");
    }

    await db.query(
        `
        UPDATE AngazmanNaPoslu
        SET procenat = ?
        WHERE korisnik_id = ? AND posao_id = ?
        `,
        [procenat, korisnikId, posaoId]
    );

    return {
        posaoId: posaoId,
        korisnikId: korisnikId,
        procenat: procenat,
        status: procenat === 0 ? "prijavljen" : procenat === 100 ? "zavrsen" : "u toku"
    }
};