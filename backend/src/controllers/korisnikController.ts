import { Request, Response } from "express";
import { registrujKorisnika } from "../services/korisnikService";
import { prijaviKorisnika } from "../services/korisnikService";
import { uspjesanOdgovor, greskaOdgovor } from "../utils/apiResponse";
import { 
    statusGreske,
    porukaGreske 
} from '../utils/requestHelper';
import { validirajPodatke } from "../utils/validationHelper";
import { registracijaKorisnikaSchema, prijavaKorisnikaSchema } from "../validators/korisnikValidator";

export const registracijaKorisnikaController = async (req: Request, res: Response) => {
    try {
        const podaci = validirajPodatke(registracijaKorisnikaSchema, req.body);
        const korisnik = await registrujKorisnika(podaci);
    
        return uspjesanOdgovor(res, korisnik, "Korisnik uspješno registrovan.", 201);
    } catch (error: any) {
        console.error(error);
        return greskaOdgovor(res, porukaGreske(error, error.message), statusGreske(error));
    }
};

export const prijavaKorisnikaController = async (req: Request, res: Response) => {
    try {
        const podaci = validirajPodatke(prijavaKorisnikaSchema, req.body);
        const rezultat = await prijaviKorisnika(podaci.email, podaci.lozinka);

        return uspjesanOdgovor(res, rezultat, "Korisnik uspješno prijavljen.", 200);
    } catch (error: any) {
        console.error(error);
        return greskaOdgovor(res, porukaGreske(error, error.message), statusGreske(error));
    }
};