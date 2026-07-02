import { ResultSetHeader, RowDataPacket } from "mysql2";
import { db } from "../config/db";
import { provjeriClanstvoNaProjektu, dobaviProjekatIdZaKomentar } from "../utils/authorization";
import { izvuciYoutubeVideoId } from "../utils/youtube";

export const dodajPrilog = async (komentarId: Number, korisnikId: Number, tip: string, url: string) => {
    
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

    await provjeriClanstvoNaProjektu(korisnikId, projekatId);

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

export const dobaviPrilogeZaKomentar = async (komentarId: Number, korisnikId: Number) => {
    
    const projekatId = await dobaviProjekatIdZaKomentar(komentarId);

    const [komentari] = await db.query<RowDataPacket[]>(
        "SELECT k.id, p.projekat_id FROM Komentar k JOIN Posao p ON k.posao_id = p.id WHERE k.id = ?", [komentarId]
    );
    const komentar = komentari[0];

    if (!komentar) {
        throw new Error("Komentar ne postoji.");
    }

    await provjeriClanstvoNaProjektu(korisnikId, projekatId);

    const [prilozi] = await db.query<RowDataPacket[]>(
        "SELECT * FROM Prilog WHERE komentar_id = ? ORDER BY datum_kreiranja ASC", [komentarId]
    );

    return prilozi.map((prilog: any) => {
        const youtubeVideoId = prilog.tip === "link" && prilog.url_linka ? izvuciYoutubeVideoId(prilog.url_linka) : null;

        return {
            ...prilog,
            je_youtube: youtubeVideoId !== null,
            youtube_video_id: youtubeVideoId
        }
    });
};