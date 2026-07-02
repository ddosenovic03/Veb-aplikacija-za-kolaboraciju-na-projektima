import { Request, Response } from 'express';
import { dodajPrilog, dobaviPrilogeZaKomentar } from '../services/prilogService';
import { uspjesanOdgovor, greskaOdgovor } from '../utils/apiResponse';

export const dodavanjePrilogaController = async (req: Request, res: Response) => {
    
    try {
        const komentarId = Number(req.params.komentarId);
        const { tip, url } = req.body;

        if (!req.korisnik) {
            return greskaOdgovor(res, "Korisnik nije autentifikovan.", 401);
        }
        
        const prilog = await dodajPrilog(komentarId, req.korisnik.id, tip, url);

        return uspjesanOdgovor(res, prilog, "Prilog uspješno dodan.", 201);
    } catch (error: any) {
        return greskaOdgovor(res, error.message || "Došlo je do greške prilikom dodavanja priloga.", 500);
    }
};

export const dobavljanjePrilogaZaKomentarController = async (req: Request, res: Response) => {

    try {
        const komentarId = Number(req.params.komentarId);

        if (!req.korisnik) {
            return greskaOdgovor(res, "Korisnik nije autentifikovan.", 401);
        }

        const prilozi = await dobaviPrilogeZaKomentar(komentarId, req.korisnik.id);

        return uspjesanOdgovor(res, prilozi, "Prilozi uspješno dobavljeni.", 200);
    } catch (error: any) {
        console.error(error);
        return greskaOdgovor(res, error.message || "Došlo je do greške prilikom dobavljanja priloga.", 500);
    }
};