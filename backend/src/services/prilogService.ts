import { ResultSetHeader, RowDataPacket } from "mysql2";
import { db } from "../config/db";
import { provjeriClanstvoNaProjektu } from "../utils/authorization";

export const dodajPrilog = async (komentarId: Number, korisnikId: Number, tip: string, url: string) => {
    
    if (!tip) {
        throw new Error("Tip priloga je obavezan.");
    }

    if (!url) {
        throw new Error("URL priloga je obavezan.");
    }

    const [komentari] = await db.query<RowDataPacket[]>(
        "SELECT k.id, p.projekat_id FROM Komentar k JOIN Posao p ON k.posao_id = p.id WHERE k.id = ?", [komentarId]
    );

    const komentar = komentari[0];

    if (!komentar) {
        throw new Error("Komentar ne postoji.");
    }

    await provjeriClanstvoNaProjektu(korisnikId, komentar.projekat_id);

    const [rezultat] = await db.query<ResultSetHeader>(
        "INSERT INTO Prilog (komentar_id, tip, url_linka) VALUES (?, ?, ?)", [komentarId, tip, url]
    );

    return {
        id: rezultat.insertId,
        komentar_id: komentarId,
        tip,
        url
    }
};