import { Request, Response } from 'express';
import { dodajKomentar, dobaviKomentareZaPosao } from '../services/komentarService';
import { uspjesanOdgovor, greskaOdgovor } from '../utils/apiResponse';

export const dodavanjeKomentaraController = async (req: Request, res: Response) => {

    try {
        const posaoId = Number(req.params.posaoId);
        const { sadrzaj } = req.body;
        const { vidljivost } = req.body;

        if (!req.korisnik) {
            return greskaOdgovor(res, "Korisnik nije autorizovan.", 401);
        }

        const komentar = await dodajKomentar(posaoId, req.korisnik.id, sadrzaj, vidljivost || "javni");

        return uspjesanOdgovor(res, komentar, "Komentar uspešno dodat.", 201);

    } catch (error: any) {
        return greskaOdgovor(res, error.message || "Došlo je do greške prilikom dodavanja komentara.", 500);
    }
};

export const dobavljanjeKomentaraZaPosaoController = async (req: Request, res: Response) => {

    try {
        const posaoId = Number(req.params.posaoId);

        if (!req.korisnik) {
            return greskaOdgovor(res, "Korisnik nije autorizovan.", 401);
        }

        const komentari = await dobaviKomentareZaPosao(posaoId, req.korisnik.id);

        return uspjesanOdgovor(res, komentari, "Komentari uspešno dobavljeni.", 200);
    } catch (error: any) {
        console.error(error);
        return greskaOdgovor(res, error.message || "Došlo je do greške prilikom dobavljanja komentara.", 500);
    }
};