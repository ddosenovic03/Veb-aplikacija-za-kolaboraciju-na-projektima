import { ResultSetHeader, RowDataPacket } from "mysql2";
import { db } from "../config/dbConfig";
import { 
    provjeriPravoDodavanjaPrilogaNaKomentar,
    provjeriPravoPrikazaPrilogaZaKomentar,
    provjeriPravoBrisanjaPriloga
} from "../utils/authorizationHelper";
import { mapPrilog } from "../dto/prilogDto";
import fs from "fs/promises";
import path from "path";

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
        throw new Error("Prilog ne postoji.");
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
        "INSERT INTO Prilog (komentar_id, tip, url_linka) VALUES (?, ?, ?)", [komentarId, tip, url.trim()]
    );

    return await dobaviPrilogZaOdgovor(rezultat.insertId);
};

export const dobaviPrilogeZaKomentar = async (komentarId: number, korisnikId: number) => {
    
    await provjeriPravoPrikazaPrilogaZaKomentar(komentarId, korisnikId);

    const [prilozi] = await db.query<RowDataPacket[]>(
        "SELECT * FROM Prilog WHERE komentar_id = ? ORDER BY datum_kreiranja ASC", [komentarId]
    );

    return prilozi.map(mapPrilog);
};

export const obrisiPrilog = async (prilogId: number, korisnikId: number) => {

    const prilog = await provjeriPravoBrisanjaPriloga(prilogId, korisnikId);

    await db.query<ResultSetHeader> (
        `
        DELETE FROM Prilog
        WHERE id = ?
        `,
        [prilogId]
    );

    if (prilog?.tip === "fajl" && prilog?.putanja_fajla) {
        const apsolutnaPutanja = path.join(process.cwd(), prilog.putanja_fajla);

        try {
            await fs.unlink(apsolutnaPutanja);
        } catch {
            // Ako fajl fizicki ne postoji, DB zapis je vec obrisan.
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
    const [rezultat] = await db.query<ResultSetHeader> (
        `
        INSERT INTO Prilog (komentar_id, tip, putanja_fajla, url_linka)
        VALUES (?, 'fajl', ?, NULL)
        `,
        [komentarId, putanjaFajla]
    );

    return await dobaviPrilogZaOdgovor(rezultat.insertId);
};