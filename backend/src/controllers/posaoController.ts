import { Request, Response } from 'express';
import { 
    kreirajPosao,
    prijaviSeNaPosao,
    azurirajProcenatPosla,
    dobaviDetaljePosla,
    dobaviMojePoslove,
    dobaviKreiranePoslove,
    izmijeniPosao,
    obrisiPosao
} from '../services/posaoService';
import { uspjesanOdgovor, greskaOdgovor } from '../utils/apiResponseHelper';
import { 
    provjeriAutentifikacijuKorisnika, 
    provjeriId,
    statusGreske,
    porukaGreske 
} from '../utils/requestHelper';
import { validirajPodatke } from '../utils/validationHelper';
import { 
    kreiranjePoslaSchema,
    izmjenaPoslaSchema,
    prijavaNaPosaoSchema,
    azuriranjeProcentaPoslaSchema 
} from '../validators/posaoValidator';

export const kreiranjePoslaController = async (req: Request, res: Response) => {

    try {
        const korisnikId = provjeriAutentifikacijuKorisnika(req).id;
        const projekatId = provjeriId(req, "projekatId", "projekta");
        const podaci = validirajPodatke(kreiranjePoslaSchema, req.body);
        const posao = await kreirajPosao(projekatId, korisnikId, podaci.naziv, podaci.opis, podaci.rok);

        return uspjesanOdgovor(res, posao, "Posao uspešno kreiran.", 201);
    } catch (error: any) {
        console.error(error);
        return greskaOdgovor(res, porukaGreske(error, error.message), statusGreske(error));
    }
};

export const prijavaNaPosaoController = async (req: Request, res: Response) => {

    try {
        const korisnikId = provjeriAutentifikacijuKorisnika(req).id;
        const posaoId = provjeriId(req, "posaoId", "posla");
        const podaci = validirajPodatke(prijavaNaPosaoSchema, req.body);
        const angazman = await prijaviSeNaPosao(posaoId, korisnikId, podaci.predlozeni_rok);

        return uspjesanOdgovor(res, angazman, "Korisnik je uspešno prijavljen na posao.", 201);
    } catch (error: any) {
        console.error(error);
        return greskaOdgovor(res, porukaGreske(error, error.message), statusGreske(error));
    }
}; 

export const azuriranjeProcentaPoslaController = async (req: Request, res: Response) => {

    try {
        const korisnikId = provjeriAutentifikacijuKorisnika(req).id;
        const posaoId = provjeriId(req, "posaoId", "posla");
        const podaci = validirajPodatke(azuriranjeProcentaPoslaSchema, req.body);
        const rezultat = await azurirajProcenatPosla(posaoId, korisnikId, podaci.procenat);

        return uspjesanOdgovor(res, rezultat, "Procenat posla je uspešno ažuriran.", 200);
    } catch (error: any) {
        console.error(error);
        return greskaOdgovor(res, porukaGreske(error, error.message), statusGreske(error));
    }
};

export const dobavljanjeDetaljaPoslaController = async (req: Request, res: Response) => {

    try {
        const korisnikId = provjeriAutentifikacijuKorisnika(req).id;
        const posaoId = provjeriId(req, "posaoId", "posla");
        const rezultat = await dobaviDetaljePosla(posaoId, korisnikId);

        return uspjesanOdgovor(res, rezultat, "Detalji posla su uspešno dobavljeni.", 200);
    } catch (error: any) {
        console.error(error);
        return greskaOdgovor(res, porukaGreske(error, error.message), statusGreske(error));
    }
};

export const dobavljanjeMojihPoslovaController = async (req: Request, res: Response) => {

    try {
        const korisnikId = provjeriAutentifikacijuKorisnika(req).id;
        const poslovi = await dobaviMojePoslove(korisnikId);

        return uspjesanOdgovor(res, poslovi, "Moji poslovi su uspešno dobavljeni.", 200);
    } catch (error: any) {
        console.error(error);
        return greskaOdgovor(res, porukaGreske(error, error.message), statusGreske(error));
    }
};

export const dobavljanjeKreiranihPoslovaController = async (req: Request, res: Response) => {

    try {
        const korisnikId = provjeriAutentifikacijuKorisnika(req).id;
        const poslovi = await dobaviKreiranePoslove(korisnikId);

        return uspjesanOdgovor(res, poslovi, "Kreirani poslovi su uspešno dobavljeni.", 200);
    } catch (error: any) {
        console.error(error);
        return greskaOdgovor(res, porukaGreske(error, error.message), statusGreske(error));
    }
};

export const izmjenaPoslaController = async (req: Request, res: Response) => {

    try {
        const korisnikId = provjeriAutentifikacijuKorisnika(req).id;
        const posaoId = provjeriId(req, "posaoId", "posla");
        const podaci = validirajPodatke(izmjenaPoslaSchema, req.body);
        const posao = await izmijeniPosao(posaoId, korisnikId, podaci.naziv, podaci.opis, podaci.rok);

        return uspjesanOdgovor(res, posao, "Posao je uspešno izmenjen.", 200);
    } catch (error: any) {
        console.error(error);
        return greskaOdgovor(res, porukaGreske(error, error.message), statusGreske(error));
    }
};  

export const brisanjePoslaController = async (req: Request, res: Response) => {

    try {
        const korisnikId = provjeriAutentifikacijuKorisnika(req).id;
        const posaoId = provjeriId(req, "posaoId", "posla");
        const posao = await obrisiPosao(posaoId, korisnikId);

        return uspjesanOdgovor(res, posao, "Posao je uspešno obrisan.", 200);
    } catch (error: any) {
        console.error(error);
        return greskaOdgovor(res, porukaGreske(error, error.message), statusGreske(error));
    }
};