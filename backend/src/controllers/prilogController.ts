import { Request, Response } from 'express';
import { dodajPrilog } from '../services/prilogService';

export const dodavanjePrilogaController = async (req: Request, res: Response) => {
    
    try {
        const komentarId = Number(req.params.komentarId);
        const { tip, url } = req.body;

        if (!req.korisnik) {
            return res.status(401).json({ greska: "Korisnik nije autentifikovan." });
        }
        console.log("Korisnik ID:", req.korisnik.id, "Komentar ID:", komentarId, "Tip:", tip, "URL:", url);
        const prilog = await dodajPrilog(komentarId, req.korisnik.id, tip, url);

        return res.status(201).json({ poruka: "Prilog uspješno dodan.", prilog });
    } catch (error: any) {
        return res.status(500).json({ greska: error.message });
    }
};