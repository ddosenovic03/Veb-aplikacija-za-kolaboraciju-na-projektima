import { RowDataPacket } from "mysql2";
import { db } from "../config/db";

export const provjeriClanstvoNaProjektu = async (projekatId: number, korisnikId: number) => {
    
    const [clanstva] = await db.query<RowDataPacket[]>(
        "SELECT * FROM ClanstvoNaProjektu WHERE korisnik_id = ? AND projekat_id = ? AND status = 'prihvacen'", [korisnikId, projekatId]
    );

    if (clanstva.length === 0) {
        throw new Error("Korisnik nije član projekta.");
    }

    return clanstva;
};

export const provjeriVlasnikaProjekta = async (projekatId: number, korisnikId: number) => {

    const [projekti] = await db.query<RowDataPacket[]>(
        "SELECT id FROM Projekat WHERE id = ? AND vlasnik_id = ?", [projekatId, korisnikId]
    );

    if (projekti.length === 0) {
        throw new Error("Korisnik nije vlasnik projekta.");
    }
};

export const dobaviProjekatIdZaPosao = async (posaoId: number) => {

    const [poslovi] = await db.query<RowDataPacket[]>(
        "SELECT projekat_id FROM Posao WHERE id = ?", [posaoId]
    );

    const posao = poslovi[0];

    if (!posao) {
        throw new Error("Posao nije pronađen.");
    }

    return Number(posao.projekat_id);
};

export const dobaviProjekatIdZaKomentar = async (komentarId: number) => {

    const [komentari] = await db.query<RowDataPacket[]>(
        "SELECT p.projekat_id FROM Komentar k JOIN Posao p ON k.posao_id = p.id WHERE k.id = ?", [komentarId]
    );

    const komentar = komentari[0];

    if (!komentar) {
        throw new Error("Komentar nije pronađen.");
    }

    return Number(komentar.projekat_id);
};