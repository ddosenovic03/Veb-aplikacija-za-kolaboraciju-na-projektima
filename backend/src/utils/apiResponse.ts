import { Response } from "express";

export const uspjesanOdgovor = (res: Response, podaci: unknown, poruka = "Zahtjev je uspješno obradjen.", status = 200) => {
    
    res.status(status).json({
        uspjeh: true,
        poruka,
        podaci
    });
};

export const greskaOdgovor = (res: Response, poruka = "Došlo je do greške.", status = 400) => {

    res.status(status).json({
        uspjeh: false,
        poruka
    });
};