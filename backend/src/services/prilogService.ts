import { ResultSetHeader, RowDataPacket } from "mysql2";
import { db } from "../config/dbConfig";
import { 
    provjeriPravoDodavanjaPrilogaNaKomentar,
    provjeriPravoPrikazaPrilogaZaKomentar,
    provjeriPravoPrikazaPriloga,
    provjeriPravoBrisanjaPriloga
} from "../utils/authorizationHelper";
import { mapPrilog } from "../dto/prilogDto";
import fs from "fs/promises";
import path from "path";
import { HttpGreska } from "../utils/requestHelper";

const dobaviPrilogZaOdgovor = async (prilogId: number) => {
    const [prilozi] = await db.query<RowDataPacket[]>(
        `
        SELECT
            id,
            komentar_id,
            tip,
            putanja_fajla,
            url_linka,
            datum_kreiranja
        FROM Prilog
        WHERE id = ?
        `,
        [prilogId]
    );

    if (prilozi.length === 0) {
        throw new HttpGreska("Prilog ne postoji.", 404);
    }

    return mapPrilog(prilozi[0]);
};

export const dodajPrilog = async (komentarId: number, korisnikId: number, tip: string, url: string) => {
    await provjeriPravoDodavanjaPrilogaNaKomentar(komentarId, korisnikId);

    if (!tip) {
        throw new Error("Tip priloga je obavezan.");
    }

    if (!url || !url.trim()) {
        throw new Error("URL priloga je obavezan.");
    }

    const [rezultat] = await db.query<ResultSetHeader>(
        "INSERT INTO Prilog (komentar_id, tip, url_linka) VALUES (?, ?, ?)",
        [komentarId, tip, url.trim()]
    );

    return await dobaviPrilogZaOdgovor(rezultat.insertId);
};

export const dobaviPrilogeZaKomentar = async (komentarId: number, korisnikId: number) => {
    await provjeriPravoPrikazaPrilogaZaKomentar(komentarId, korisnikId);

    const [prilozi] = await db.query<RowDataPacket[]>(
        "SELECT * FROM Prilog WHERE komentar_id = ? ORDER BY datum_kreiranja ASC",
        [komentarId]
    );

    return prilozi.map(mapPrilog);
};

export const dobaviFajlPriloga = async (prilogId: number, korisnikId: number) => {
    const prilog = await provjeriPravoPrikazaPriloga(prilogId, korisnikId);

    if (prilog.tip !== "fajl" || !prilog.putanja_fajla) {
        throw new HttpGreska("Fajl prilog ne postoji.", 404);
    }

    const folderPriloga = path.resolve(process.cwd(), "uploads", "prilozi");
    const apsolutnaPutanja = path.resolve(process.cwd(), prilog.putanja_fajla);
    const relativnaPutanja = path.relative(folderPriloga, apsolutnaPutanja);

    if (relativnaPutanja.startsWith("..") || path.isAbsolute(relativnaPutanja)) {
        throw new HttpGreska("Putanja fajla nije validna.", 404);
    }

    try {
        const statistika = await fs.stat(apsolutnaPutanja);

        if (!statistika.isFile()) {
            throw new HttpGreska("Fajl prilog ne postoji.", 404);
        }
    } catch (error) {
        if (error instanceof HttpGreska) {
            throw error;
        }

        throw new HttpGreska("Fajl prilog ne postoji.", 404);
    }

    return apsolutnaPutanja;
};

export const obrisiPrilog = async (prilogId: number, korisnikId: number) => {
    const prilog = await provjeriPravoBrisanjaPriloga(prilogId, korisnikId);

    await db.query<ResultSetHeader>(
        `
        DELETE FROM Prilog
        WHERE id = ?
        `,
        [prilogId]
    );

    if (prilog?.tip === "fajl" && prilog?.putanja_fajla) {
        const apsolutnaPutanja = path.resolve(process.cwd(), prilog.putanja_fajla);

        try {
            await fs.unlink(apsolutnaPutanja);
        } catch {
            // Ako fajl fizički ne postoji, DB zapis je već obrisan.
        }
    }

    return mapPrilog(prilog);
};

export const dodajFajlPrilog = async (komentarId: number, korisnikId: number, fajl?: Express.Multer.File) => {
    await provjeriPravoDodavanjaPrilogaNaKomentar(komentarId, korisnikId);

    if (!fajl) {
        throw new Error("Fajl je obavezan.");
    }

    const putanjaFajla = path.join("uploads", "prilozi", fajl.filename).replace(/\\/g, "/");
    const [rezultat] = await db.query<ResultSetHeader>(
        `
        INSERT INTO Prilog (komentar_id, tip, putanja_fajla, url_linka)
        VALUES (?, 'fajl', ?, NULL)
        `,
        [komentarId, putanjaFajla]
    );

    return await dobaviPrilogZaOdgovor(rezultat.insertId);
};