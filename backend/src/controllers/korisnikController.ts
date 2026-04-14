import { Request, Response } from "express";
import { registracija } from "../services/korisnikService";

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