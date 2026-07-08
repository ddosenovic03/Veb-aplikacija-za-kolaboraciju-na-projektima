import { Request, Response } from "express";
import { registrujKorisnika } from "../services/korisnikService";
import { prijaviKorisnika } from "../services/korisnikService";
import { uspjesanOdgovor, greskaOdgovor } from "../utils/apiResponse";
import { 
    statusGreske,
    porukaGreske 
} from '../utils/requestHelper';

export const registracijaKorisnikaController = async (req: Request, res: Response) => {
    try {
        const korisnik = await registrujKorisnika(req.body);
    
        return uspjesanOdgovor(res, korisnik, "Korisnik uspješno registrovan.", 201);
    } catch (error: any) {
        console.error(error);
        return greskaOdgovor(res, porukaGreske(error, error.message), statusGreske(error));
    }
};

export const prijavaKorisnikaController = async (req: Request, res: Response) => {
    try {
        const { email, lozinka } = req.body;
        const rezultat = await prijaviKorisnika(email, lozinka);

        return uspjesanOdgovor(res, rezultat, "Korisnik uspješno prijavljen.", 200);
    } catch (error: any) {
        console.error(error);
        return greskaOdgovor(res, porukaGreske(error, error.message), statusGreske(error));
    }
};