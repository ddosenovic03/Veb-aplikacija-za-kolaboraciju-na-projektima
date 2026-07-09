import { Request, Response } from 'express';
import { 
    dodajKomentar, 
    dobaviKomentareZaPosao,
    izmijeniKomentar,
    obrisiKomentar 
} from '../services/komentarService';
import { uspjesanOdgovor, greskaOdgovor } from '../utils/apiResponse';
import { 
    provjeriAutentifikacijuKorisnika, 
    provjeriId,
    statusGreske,
    porukaGreske 
} from '../utils/requestHelper';
import { validirajPodatke } from '../utils/validationHelper';
import { 
    dodavanjeKomentaraSchema,
    izmjenaKomentaraSchema
} from '../validators/komentarValidator';

export const dodavanjeKomentaraController = async (req: Request, res: Response) => {

    try {
        const korisnikId = provjeriAutentifikacijuKorisnika(req).id;
        const posaoId = provjeriId(req, "posaoId", "posla");
        const podaci = validirajPodatke(dodavanjeKomentaraSchema, req.body);
        const komentar = await dodajKomentar(posaoId, korisnikId, podaci.sadrzaj, podaci.vidljivost);

        return uspjesanOdgovor(res, komentar, "Komentar uspešno dodan.", 201);
    } catch (error: any) {
        console.error(error);
        return greskaOdgovor(res, porukaGreske(error, error.message), statusGreske(error));
    }
};

export const dobavljanjeKomentaraZaPosaoController = async (req: Request, res: Response) => {

    try {
        const korisnikId = provjeriAutentifikacijuKorisnika(req).id;
        const posaoId = provjeriId(req, "posaoId", "posla");
        const komentari = await dobaviKomentareZaPosao(posaoId, korisnikId);

        return uspjesanOdgovor(res, komentari, "Komentari uspešno dobavljeni.", 200);
    } catch (error: any) {
        console.error(error);
        return greskaOdgovor(res, porukaGreske(error, error.message), statusGreske(error));
    }
};

export const izmjenaKomentaraController = async (req: Request, res: Response) => {

    try {
        const korisnikId = provjeriAutentifikacijuKorisnika(req).id;
        const komentarId = provjeriId(req, "komentarId", "komentara");
        const podaci = validirajPodatke(izmjenaKomentaraSchema, req.body);
        const komentar = await izmijeniKomentar(komentarId, korisnikId, podaci.sadrzaj, podaci.vidljivost);

        return uspjesanOdgovor(res, komentar, "Komentar je uspešno izmenjen.", 200);
    } catch (error: any) {
        console.error(error);
        return greskaOdgovor(res, porukaGreske(error, error.message), statusGreske(error));
    }
};

export const brisanjeKomentaraController = async (req: Request, res: Response) => {

    try {
        const korisnikId = provjeriAutentifikacijuKorisnika(req).id;
        const komentarId = provjeriId(req, "komentarId", "komentara");
        const komentar = await obrisiKomentar(komentarId, korisnikId);

        return uspjesanOdgovor(res, komentar, "Komentar je uspešno obrisan.", 200);
    } catch (error: any) {
        console.error(error);
        return greskaOdgovor(res, porukaGreske(error, error.message), statusGreske(error));
    }
};