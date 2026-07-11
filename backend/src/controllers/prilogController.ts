import { Request, Response } from 'express';
import { 
    dodajPrilog,
    dodajFajlPrilog, 
    dobaviPrilogeZaKomentar,
    obrisiPrilog 
} from '../services/prilogService';
import { uspjesanOdgovor, greskaOdgovor } from '../utils/apiResponseHelper';
import { 
    provjeriAutentifikacijuKorisnika, 
    provjeriId,
    statusGreske,
    porukaGreske 
} from '../utils/requestHelper';
import { validirajPodatke } from '../utils/validationHelper';
import { 
    dodavanjePrilogaSchema,
    dodavanjeFajlPrilogaSchema 
} from '../validators/prilogValidator';

export const dodavanjePrilogaController = async (req: Request, res: Response) => {
    
    try {
        const korisnikId = provjeriAutentifikacijuKorisnika(req).id;
        const komentarId = provjeriId(req, "komentarId", "komentara");
        const podaci = validirajPodatke(dodavanjePrilogaSchema, req.body);
        const prilog = await dodajPrilog(komentarId, korisnikId, podaci.tip, podaci.url);

        return uspjesanOdgovor(res, prilog, "Prilog uspešno dodan.", 201);
    } catch (error: any) {
        return greskaOdgovor(res, porukaGreske(error, error.message), statusGreske(error));
    }
};

export const dodavanjeFajlPrilogaController = async (req: Request, res: Response) => {

    try {
        const korisnikId = provjeriAutentifikacijuKorisnika(req).id;
        const komentarId = provjeriId(req, "komentarId", "komentara");
        const podaci = validirajPodatke(dodavanjeFajlPrilogaSchema, { fajl: req.file });
        const prilog = await dodajFajlPrilog(komentarId, korisnikId, podaci.fajl);

        return uspjesanOdgovor(res, prilog, "Prilog uspešno dodan.", 201);
    } catch (error: any) {
        return greskaOdgovor(res, porukaGreske(error, error.message), statusGreske(error));
    }
};

export const dobavljanjePrilogaZaKomentarController = async (req: Request, res: Response) => {

    try {
        const korisnikId = provjeriAutentifikacijuKorisnika(req).id;
        const komentarId = provjeriId(req, "komentarId", "komentara");
        const prilozi = await dobaviPrilogeZaKomentar(komentarId, korisnikId);

        return uspjesanOdgovor(res, prilozi, "Prilozi uspešno dobavljeni.", 200);
    } catch (error: any) {
        console.error(error);
        return greskaOdgovor(res, porukaGreske(error, error.message), statusGreske(error));
    }
};

export const brisanjePrilogaController = async (req: Request, res: Response) => {

    try {
        const korisnikId = provjeriAutentifikacijuKorisnika(req).id;
        const prilogId = provjeriId(req, "prilogId", "priloga");
        const prilog = await obrisiPrilog(prilogId, korisnikId);

        return uspjesanOdgovor(res, prilog, "Prilog uspešno obrisan.", 200);
    } catch (error: any) {
        console.error(error);
        return greskaOdgovor(res, porukaGreske(error, error.message), statusGreske(error));
    }
};