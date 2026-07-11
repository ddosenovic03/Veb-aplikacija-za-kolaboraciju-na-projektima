import { RowDataPacket } from "mysql2";
import { db } from "../config/dbConfig";

export const dobaviDashboardStatistiku = async (korisnikId: number) => {

    const [projekti] = await db.query<RowDataPacket[]>(
        `
        SELECT COUNT(*) AS broj_projekata
        FROM ClanstvoNaProjektu
        WHERE korisnik_id = ? AND status = 'prihvacen'
        `,
        [korisnikId]
    );
    const projekat: any = projekti[0];

    const [mojiPoslovi] = await db.query<RowDataPacket[]>(
        `
        SELECT COUNT(*) AS broj_mojih_poslova
        FROM AngazmanNaPoslu
        WHERE korisnik_id = ?
        `,
        [korisnikId]
    );
    const mojPosao: any = mojiPoslovi[0];

    const [pozivi] = await db.query<RowDataPacket[]>(
        `
        SELECT COUNT(*) AS broj_poziva
        FROM ClanstvoNaProjektu
        WHERE korisnik_id = ? AND status = 'pozvan'  
        `,
        [korisnikId]
    );
    const poziv: any = pozivi[0];

    const [komentari] = await db.query<RowDataPacket[]>(
        `
        SELECT COUNT(*) AS broj_komentara
        FROM Komentar
        WHERE korisnik_id = ?  
        `,
        [korisnikId]
    );
    const komentar: any = komentari[0];

    return {
        broj_projekata: Number(projekat.broj_projekata),
        broj_mojih_poslova: Number(mojPosao.broj_mojih_poslova),
        broj_poziva: Number(poziv.broj_poziva),
        broj_komentara: Number(komentar.broj_komentara)
    };
};