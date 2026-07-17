import { db } from "../config/dbConfig";
import { RowDataPacket, ResultSetHeader } from "mysql2";
import { 
    provjeriPravoDodavanjaKomentaraNaPosao,
    provjeriPravoPrikazaPosla,
    provjeriPravoIzmjeneKomentara,
    provjeriPravoBrisanjaKomentara
} from "../utils/authorizationHelper";
import { mapKomentar } from "../dto/komentarDto";

export const dobaviKomentarZaOdgovor = async (komentarId: number) => {

    const [komentari] = await db.query<RowDataPacket[]> (
        `
        SELECT
            k.id,
            k.sadrzaj,
            k.vidljivost,
            k.datum_kreiranja,
            k.posao_id,
            k.korisnik_id AS autor_id,
            ko.ime AS autor_ime,
            ko.prezime AS autor_prezime,
            ko.korisnicko_ime AS autor_korisnicko_ime
        FROM Komentar k
        JOIN Korisnik ko ON k.korisnik_id = ko.id
        WHERE k.id = ?
        `,
        [komentarId]
    );

    if (komentari.length === 0) {
        throw new Error("Komentar ne postoji.");
    }

    return mapKomentar(komentari[0]);
};

export const dodajKomentar = async (posaoId: number, korisnikId: number, sadrzaj: string, vidljivost: "javni" | "privatni") => {

    await provjeriPravoDodavanjaKomentaraNaPosao(posaoId, korisnikId);

    if (!sadrzaj || !sadrzaj.trim()) {
        throw new Error("Sadržaj komentara je obavezan.");
    }

    if (vidljivost !== "javni" && vidljivost !== "privatni") {
        throw new Error("Vidljivost komentara nije validna.");
    }

    const [rezultat] = await db.query<ResultSetHeader>(
        `
        INSERT INTO Komentar (sadrzaj, posao_id, korisnik_id, vidljivost)
        VALUES (?, ?, ?, ?)
        `,
        [sadrzaj.trim(), posaoId, korisnikId, vidljivost]
    );

    return await dobaviKomentarZaOdgovor(rezultat.insertId);
};

export const dobaviKomentareZaPosao = async (posaoId: number, korisnikId: number) => {  

    const posao = await provjeriPravoPrikazaPosla(posaoId, korisnikId);

    const [komentari] = await db.query<RowDataPacket[]>(
        `
        SELECT 
            k.id,
            k.sadrzaj,
            k.vidljivost,
            k.datum_kreiranja,
            k.posao_id,
            k.korisnik_id AS autor_id,
            ko.ime AS autor_ime,
            ko.prezime AS autor_prezime,
            ko.korisnicko_ime AS autor_korisnicko_ime
        FROM Komentar k
        JOIN Korisnik ko ON k.korisnik_id = ko.id
        WHERE k.posao_id = ?
        AND (k.vidljivost = 'javni' OR k.korisnik_id = ? OR ? = ?)
        ORDER BY k.datum_kreiranja DESC
        `,
        [posaoId, korisnikId, korisnikId, posao?.projekat_vlasnik_id]
    );

    return komentari.map(mapKomentar);
};

export const izmijeniKomentar = async (komentarId: number, korisnikId: number, sadrzaj?: string, vidljivost?: "javni" | "privatni") => {

    await provjeriPravoIzmjeneKomentara(komentarId, korisnikId);

    const poljaZaIzmjenu: string[] = [];
    const vrijednosti: unknown[] = [];

    if (sadrzaj !== undefined) {
        if (!sadrzaj.trim()) {
            throw new Error("Sadržaj komentara ne sme biti prazan.");
        }

        poljaZaIzmjenu.push("sadrzaj = ?");
        vrijednosti.push(sadrzaj.trim());
    }

    if (vidljivost !== undefined) {
        if (vidljivost !== "javni" && vidljivost !== "privatni") {
            throw new Error("Vidljivost komentara nije validna.");
        }

        poljaZaIzmjenu.push("vidljivost = ?");
        vrijednosti.push(vidljivost)
    }

    if (poljaZaIzmjenu.length === 0) {
        throw new Error("Nema podataka za izmenu komentara.");
    }

    vrijednosti.push(komentarId);

    await db.query<ResultSetHeader> (
        `
        UPDATE Komentar
        SET ${poljaZaIzmjenu.join(", ")}
        WHERE id = ?
        `,
        vrijednosti
    );

    return await dobaviKomentarZaOdgovor(komentarId);
};

export const obrisiKomentar = async (komentarId: number, korisnikId: number) => {

    const komentar = await provjeriPravoBrisanjaKomentara(komentarId, korisnikId);

    await db.query<ResultSetHeader> (
        `
        DELETE FROM Komentar
        WHERE id = ?
        `,
        [komentarId]
    );

    return {
        id: komentar?.id,
        posao_id: komentar?.posao_id,
        sadrzaj: komentar?.sadrzaj
    };
};
