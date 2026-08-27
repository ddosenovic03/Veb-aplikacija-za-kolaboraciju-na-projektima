import { NextFunction, Request, Response } from "express";
import { RowDataPacket } from "mysql2";
import { db } from "../config/dbConfig";
import { obrisiFajloveSaDiska } from "../utils/fileCleanupHelper";

const registrujCleanup = async (
    req: Request,
    res: Response,
    next: NextFunction,
    nazivParametra: string,
    upit: string
) => {
    const id = Number(req.params[nazivParametra]);

    if (!Number.isInteger(id) || id <= 0) {
        return next();
    }

    try {
        const [redovi] = await db.query<RowDataPacket[]>(upit, [id]);
        const putanje = redovi.map((red) => red.putanja_fajla as string | null);

        res.on("finish", () => {
            if (res.statusCode >= 200 && res.statusCode < 300) {
                void obrisiFajloveSaDiska(putanje);
            }
        });

        return next();
    } catch (error) {
        return next(error);
    }
};

export const cleanupFajlovaKomentara = (req: Request, res: Response, next: NextFunction) => {
    return registrujCleanup(
        req,
        res,
        next,
        "komentarId",
        `
        SELECT putanja_fajla
        FROM Prilog
        WHERE komentar_id = ?
          AND tip = 'fajl'
          AND putanja_fajla IS NOT NULL
        `
    );
};

export const cleanupFajlovaPosla = (req: Request, res: Response, next: NextFunction) => {
    return registrujCleanup(
        req,
        res,
        next,
        "posaoId",
        `
        SELECT pl.putanja_fajla
        FROM Prilog pl
        JOIN Komentar k ON pl.komentar_id = k.id
        WHERE k.posao_id = ?
          AND pl.tip = 'fajl'
          AND pl.putanja_fajla IS NOT NULL
        `
    );
};

export const cleanupFajlovaProjekta = (req: Request, res: Response, next: NextFunction) => {
    return registrujCleanup(
        req,
        res,
        next,
        "projekatId",
        `
        SELECT pl.putanja_fajla
        FROM Prilog pl
        JOIN Komentar k ON pl.komentar_id = k.id
        JOIN Posao p ON k.posao_id = p.id
        WHERE p.projekat_id = ?
          AND pl.tip = 'fajl'
          AND pl.putanja_fajla IS NOT NULL
        `
    );
};
