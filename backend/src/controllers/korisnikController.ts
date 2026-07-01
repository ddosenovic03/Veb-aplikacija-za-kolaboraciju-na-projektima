import { Request, Response } from "express";
import { registrujKorisnika } from "../services/korisnikService";
import { prijaviKorisnika } from "../services/korisnikService";

// REGISTRACIJA KORISNIKA
export const registracijaKorisnikaController = async (req: Request, res: Response) => {
    try {
        const korisnik = await registrujKorisnika(req.body);
    
        res.status(201).json({
            poruka : "Korisnik uspješno registrovan",
            korisnik
        });
    } catch (greska: any) {
        console.error(greska);
        
        if (greska.code === "ER_DUP_ENTRY") {
            return res.status(400).json({ error: "Korisničko ime ili email već postoji" });
        } 
        
        return res.status(400).json({ poruka: greska.message || "Greška pri registraciji korisnika" });
    }

};

// LOGIN KORISNIKA
export const prijavaKorisnikaController = async (req: Request, res: Response) => {
    try {
        const { email, lozinka } = req.body;
        const rezultat = await prijaviKorisnika(email, lozinka);
        res.json(rezultat);
    } catch (greska: any) {
        console.error(greska);
        res.status(400).json({ poruka: greska.message || "Greška pri prijavi korisnika" });
    }
};