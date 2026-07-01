import { RowDataPacket } from "mysql2";
import { db } from "../config/db";

export const provjeriClanstvoNaProjektu = async (korisnikId: Number, projekatId: Number) => {
    
    const [clanstva] = await db.query<RowDataPacket[]>(
        "SELECT * FROM ClanstvoNaProjektu WHERE korisnik_id = ? AND projekat_id = ? AND status = 'prihvacen'", [korisnikId, projekatId]
    );

    if (clanstva.length === 0) {
        throw new Error("Korisnik nije član projekta.");
    }

    return clanstva;
};