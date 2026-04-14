import { Request, Response } from "express";
import { registracija } from "../services/korisnikService";
import { login } from "../services/korisnikService";

// REGISTRACIJA KORISNIKA
export const registracijaHandler = async (req: Request, res: Response) => {
    try {
        const korisnik = await registracija(req.body);
    
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
export const loginHandler = async (req: Request, res: Response) => {
    try {
        const { email, lozinka } = req.body;
        const rezultat = await login(email, lozinka);
        res.json(rezultat);
    } catch (greska: any) {
        console.error(greska);
        res.status(400).json({ poruka: greska.message || "Greška pri prijavi korisnika" });
    }
};