import { NextFunction, Request, Response } from "express";
import multer from "multer";
import { greskaOdgovor } from "../utils/apiResponseHelper";
import { statusGreske } from "../utils/requestHelper";

export const notFoundHandler = (req: Request, res: Response, _next: NextFunction) => {

    return greskaOdgovor(res, `Ruta ${req.originalUrl} ne postoji.`, 404);
};

export const globalErrorHandler = (error: unknown, _req: Request, res: Response, _next: NextFunction) => {

    console.error(error);

    if (error instanceof multer.MulterError) {
        if (error.code === "LIMIT_FILE_SIZE") {
            return greskaOdgovor(res, "Fajl ne sme biti veći od 5MB.", 400);
        }

        return greskaOdgovor(res, "Greška prilikom upload-a fajla.", 400); 
    }

    if (error instanceof Error) {
        return greskaOdgovor(res, error.message, statusGreske(error));
    }

    return greskaOdgovor(res, "Došlo je do neočekivane greške.", 500);
};
