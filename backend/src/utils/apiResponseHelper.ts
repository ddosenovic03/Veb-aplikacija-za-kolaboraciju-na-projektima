import { Response } from "express";

export const uspjesanOdgovor = (res: Response, podaci: unknown, poruka = "Zahtev je uspešno obrađen.", status = 200) => {
    
    return res.status(status).json({
        uspjeh: true,
        poruka,
        podaci
    });
};

export const greskaOdgovor = (res: Response, poruka = "Došlo je do greške.", status = 400) => {

    return res.status(status).json({
        uspjeh: false,
        poruka
    });
};