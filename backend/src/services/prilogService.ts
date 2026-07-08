import { ResultSetHeader, RowDataPacket } from "mysql2";
import { db } from "../config/db";
import { provjeriClanstvoNaProjektu, dobaviProjekatIdZaKomentar } from "../utils/authorizationHelper";
import { mapPrilog } from "../dto/prilogDto";

export const dodajPrilog = async (komentarId: number, korisnikId: number, tip: string, url: string) => {
    
    const projekatId = await dobaviProjekatIdZaKomentar(komentarId);

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

    await provjeriClanstvoNaProjektu(projekatId, korisnikId);

    const [rezultat] = await db.query<ResultSetHeader>(
        "INSERT INTO Prilog (komentar_id, tip, url_linka) VALUES (?, ?, ?)", [komentarId, tip, url]
    );
    const prilog = await db.query<ResultSetHeader>(
        "SELECT * FROM Prilog WHERE id = ?", [rezultat.insertId]
    );

    return mapPrilog(prilog);
};

export const dobaviPrilogeZaKomentar = async (komentarId: number, korisnikId: number) => {
    
    const projekatId = await dobaviProjekatIdZaKomentar(komentarId);

    const [komentari] = await db.query<RowDataPacket[]>(
        "SELECT k.id, p.projekat_id FROM Komentar k JOIN Posao p ON k.posao_id = p.id WHERE k.id = ?", [komentarId]
    );
    const komentar = komentari[0];

    if (!komentar) {
        throw new Error("Komentar ne postoji.");
    }

    await provjeriClanstvoNaProjektu(projekatId, korisnikId);

    const [prilozi] = await db.query<RowDataPacket[]>(
        "SELECT * FROM Prilog WHERE komentar_id = ? ORDER BY datum_kreiranja ASC", [komentarId]
    );

    return prilozi.map(mapPrilog);
};