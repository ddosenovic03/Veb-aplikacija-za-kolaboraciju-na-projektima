import { db } from "../config/db";
import { RowDataPacket, ResultSetHeader } from "mysql2";
import { provjeriClanstvoNaProjektu } from "../utils/authorization";

export const dodajKomentar = async (posaoId: Number, korisnikId: Number, sadrzaj: string, vidljivost: "javni" | "privatni") => {

    if (!sadrzaj) {
        throw new Error("Sadržaj komentara je obavezan.");
    }

    const [poslovi] = await db.query<RowDataPacket[]>(
        "SELECT * FROM Posao WHERE id = ?", [posaoId]
    )

    const posao = poslovi[0];

    if (!posao) {
        throw new Error("Posao nije pronađen.");
    }
    
    await provjeriClanstvoNaProjektu(korisnikId, posao.projekat_id);

    const [rezultat] = await db.query<ResultSetHeader>(
        `
        INSERT INTO Komentar (sadrzaj, posao_id, korisnik_id, vidljivost)
        VALUES (?, ?, ?, ?)
        `,
        [sadrzaj, posaoId, korisnikId, vidljivost]
    );

    return {
        id: rezultat.insertId,
        sadrzaj,
        posao_id: posaoId,
        korisnik_id: korisnikId,
        vidljivost
    };
};

export const dobaviKomentareZaPosao = async (posaoId: number, korisnikId: number) => {  

    const [poslovi] = await db.query<RowDataPacket[]>(
        `
        SELECT p.*, pr.vlasnik_id
        FROM Posao p
        JOIN Projekat pr ON p.projekat_id = pr.id
        WHERE p.id = ?
        `,
        [posaoId]
    )

    const posao = poslovi[0];

    if (!posao) {
        throw new Error("Posao nije pronađen.");
    }

    await provjeriClanstvoNaProjektu(korisnikId, posao.projekat_id);

    const [komentari] = await db.query<RowDataPacket[]>(
        `
        SELECT 
            k.id,
            k.sadrzaj,
            k.vidljivost,
            k.datum_kreiranja,
            k.korisnik_id,
            ko.ime,
            ko.prezime,
            ko.korisnicko_ime
        FROM Komentar k
        JOIN Korisnik ko ON k.korisnik_id = ko.id
        WHERE k.posao_id = ?
        AND (k.vidljivost = 'javni' OR k.korisnik_id = ? OR ? = ?)
        ORDER BY k.datum_kreiranja ASC
        `,
        [posaoId, korisnikId, korisnikId, posao.kreator_id]
    );

    return komentari;
};