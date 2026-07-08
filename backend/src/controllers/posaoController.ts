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
import { uspjesanOdgovor, greskaOdgovor } from '../utils/apiResponse';
import { 
    provjeriAutentifikacijuKorisnika, 
    provjeriId,
    statusGreske,
    porukaGreske 
} from '../utils/requestHelper';

export const kreiranjePosla = async (req: Request, res: Response) => {

    try {
        const korisnikId = provjeriAutentifikacijuKorisnika(req).id;
        const projekatId = provjeriId(req, "projekatId", "projekta");
        const { naziv, opis, rok } = req.body;
        const posao = await kreirajPosao(projekatId, korisnikId, naziv, opis, rok);

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
        const { predlozeniRok } = req.body;
        const angazman = await prijaviSeNaPosao(posaoId, korisnikId, predlozeniRok);

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
        const { procenat } = req.body;
        const rezultat = await azurirajProcenatPosla(posaoId, korisnikId, Number(procenat));

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

export const izmjenaPosla = async (req: Request, res: Response) => {

    try {
        const korisnikId = provjeriAutentifikacijuKorisnika(req).id;
        const posaoId = provjeriId(req, "posaoId", "posla");
        const { naziv, opis, rok } = req.body;
        const posao = await izmijeniPosao(posaoId, korisnikId, naziv, opis, rok);

        return uspjesanOdgovor(res, posao, "Posao je uspešno izmenjen.", 200);
    } catch (error: any) {
        console.error(error);
        return greskaOdgovor(res, porukaGreske(error, error.message), statusGreske(error));
    }
};  

export const brisanjePosla = async (req: Request, res: Response) => {

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