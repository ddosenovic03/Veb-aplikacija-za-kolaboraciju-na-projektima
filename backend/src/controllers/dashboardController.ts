import { Request, Response } from "express";
import { dobaviDashboardStatistiku } from "../services/dashboardService";
import { uspjesanOdgovor, greskaOdgovor } from "../utils/apiResponseHelper";
import { 
    provjeriAutentifikacijuKorisnika,
    statusGreske,
    porukaGreske 
} from '../utils/requestHelper';

export const dobavljanjeDashboardStatistikeController = async (req: Request, res: Response) => {

    try {
        const korisnikId = provjeriAutentifikacijuKorisnika(req).id;
        const statistika = await dobaviDashboardStatistiku(korisnikId);

        return uspjesanOdgovor(res, statistika, "Statistika uspješno dobavljena.", 200);
    } catch (error: any) {
        console.error(error);
        return greskaOdgovor(res, porukaGreske(error, error.message), statusGreske(error));
    }
};