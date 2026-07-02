import { Request, Response } from "express";
import { registrujKorisnika } from "../services/korisnikService";
import { prijaviKorisnika } from "../services/korisnikService";
import { uspjesanOdgovor, greskaOdgovor } from "../utils/apiResponse";

export const registracijaKorisnikaController = async (req: Request, res: Response) => {
    try {
        const korisnik = await registrujKorisnika(req.body);
    
        return uspjesanOdgovor(res, korisnik, "Korisnik uspješno registrovan.", 201);
    } catch (error: any) {
        console.error(error);
        
        if (error.code === "ER_DUP_ENTRY") {
            return greskaOdgovor(res, "Korisničko ime ili email već postoji", 400);
        } 
        
        return greskaOdgovor(res, error.message || "Greška pri registraciji korisnika", 400);
    }

};

export const prijavaKorisnikaController = async (req: Request, res: Response) => {
    try {
        const { email, lozinka } = req.body;
        const rezultat = await prijaviKorisnika(email, lozinka);
        return uspjesanOdgovor(res, rezultat, "Korisnik uspješno prijavljen.", 200);
    } catch (error: any) {
        console.error(error);
        return greskaOdgovor(res, error.message || "Greška pri prijavi korisnika", 400);
    }
};