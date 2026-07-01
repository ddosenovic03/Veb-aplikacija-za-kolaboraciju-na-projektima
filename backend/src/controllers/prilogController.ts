import { Request, Response } from 'express';
import { dodajPrilog, dobaviPrilogeZaKomentar } from '../services/prilogService';

export const dodavanjePrilogaController = async (req: Request, res: Response) => {
    
    try {
        const komentarId = Number(req.params.komentarId);
        const { tip, url } = req.body;

        if (!req.korisnik) {
            return res.status(401).json({ greska: "Korisnik nije autentifikovan." });
        }
        
        const prilog = await dodajPrilog(komentarId, req.korisnik.id, tip, url);

        return res.status(201).json({ poruka: "Prilog uspješno dodan.", prilog });
    } catch (error: any) {
        return res.status(500).json({ greska: error.message });
    }
};

export const dobavljanjePrilogaZaKomentarController = async (req: Request, res: Response) => {

    try {
        const komentarId = Number(req.params.komentarId);

        if (!req.korisnik) {
            return res.status(401).json({ greska: "Korisnik nije autentifikovan." });
        }

        const prilozi = await dobaviPrilogeZaKomentar(komentarId, req.korisnik.id);

        return res.status(200).json({ prilozi });
    } catch (error: any) {
        console.error(error);
        return res.status(500).json({ greska: error.message });
    }
};