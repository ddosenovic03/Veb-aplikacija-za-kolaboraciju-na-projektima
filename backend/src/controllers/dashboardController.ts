import { Request, Response } from "express";
import { dobaviDashboardStatistiku } from "../services/dashboardService";
import { uspjesanOdgovor, greskaOdgovor } from "../utils/apiResponse";

export const dobavljanjeDashboardStatistikeController = async (req: Request, res: Response) => {

    try {
        if (!req.korisnik) {
            return greskaOdgovor(res, "Korisnik nije autentifikovan.", 401);
        }

        const statistika = await dobaviDashboardStatistiku(req.korisnik.id);

        return uspjesanOdgovor(res, statistika, "Statistika uspješno dobavljena.", 200);
    } catch (error: any) {
        console.error(error);
        return greskaOdgovor(res, error.message || "Došlo je do greške prilikom dobavljanja statistike.", 400);
    }
};