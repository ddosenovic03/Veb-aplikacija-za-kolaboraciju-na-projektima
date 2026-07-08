import { Request, Response } from 'express';
import { dodajPrilog, dobaviPrilogeZaKomentar } from '../services/prilogService';
import { uspjesanOdgovor, greskaOdgovor } from '../utils/apiResponse';
import { 
    provjeriAutentifikacijuKorisnika, 
    provjeriId,
    statusGreske,
    porukaGreske 
} from '../utils/requestHelper';

export const dodavanjePrilogaController = async (req: Request, res: Response) => {
    
    try {
        const korisnikId = provjeriAutentifikacijuKorisnika(req).id;
        const komentarId = provjeriId(req, "komentarId", "komentara");
        const { tip, url } = req.body;
        const prilog = await dodajPrilog(komentarId, korisnikId, tip, url);

        return uspjesanOdgovor(res, prilog, "Prilog uspješno dodan.", 201);
    } catch (error: any) {
        return greskaOdgovor(res, porukaGreske(error, error.message), statusGreske(error));
    }
};

export const dobavljanjePrilogaZaKomentarController = async (req: Request, res: Response) => {

    try {
        const korisnikId = provjeriAutentifikacijuKorisnika(req).id;
        const komentarId = provjeriId(req, "komentarId", "komentara");
        const prilozi = await dobaviPrilogeZaKomentar(komentarId, korisnikId);

        return uspjesanOdgovor(res, prilozi, "Prilozi uspješno dobavljeni.", 200);
    } catch (error: any) {
        console.error(error);
        return greskaOdgovor(res, porukaGreske(error, error.message), statusGreske(error));
    }
};