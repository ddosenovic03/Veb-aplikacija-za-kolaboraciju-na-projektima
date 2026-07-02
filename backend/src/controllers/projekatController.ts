import { Request, Response } from 'express';
import { 
    kreirajProjekat,
    pozoviKorisnikaNaProjekat,
    odgovoriNaPozivZaProjekat,
    kreirajPosao,
    dobaviPosloveZaProjekat,
    dobaviMojeProjekte,
    dobaviDetaljeProjekta,
    dobaviPoziveKorisnikaZaProjekat
} from '../services/projekatService';
import { uspjesanOdgovor, greskaOdgovor } from '../utils/apiResponse';

export const kreiranjeProjekta = async (req: Request, res: Response) => {
    try {
        const { naziv, opis } = req.body;

        if (!req.korisnik) {
            return greskaOdgovor(res, "Korisnik nije autentifikovan.", 401);
        }

        const projekat = await kreirajProjekat({
            naziv,
            opis,
            vlasnik_id: req.korisnik.id
        });

        return uspjesanOdgovor(res, projekat, "Projekat je uspješno kreiran.", 201);
    } catch (error: any) {
        return greskaOdgovor(res, error.message || "Došlo je do greške prilikom kreiranja projekta.", 400);
    }
};

export const pozivanjeKorisnikaNaProjekatController = async (req: Request, res: Response) => {
    try {
        const projekatId = Number(req.params.projekatId);
        const { email } = req.body;

        if (!req.korisnik) {
            return greskaOdgovor(res, "Korisnik nije autentifikovan.", 401);
        }

        const rezultat = await pozoviKorisnikaNaProjekat(projekatId, req.korisnik.id, email);

        return uspjesanOdgovor(res, rezultat, "Korisnik uspešno pozvan na projekat.", 201);
    } catch (error: any) {
        console.error(error);
        return greskaOdgovor(res, error.message || "Došlo je do greške prilikom pozivanja korisnika na projekat.", 400);
    }
};

export const prihvatanjePozivaNaProjekatController = async (req: Request, res: Response) => {

    try {
        const projekatId = Number(req.params.projekatId);

        if (!req.korisnik) {
            return greskaOdgovor(res, "Korisnik nije autentifikovan.", 401);
        }

        const rezultat = await odgovoriNaPozivZaProjekat(projekatId, req.korisnik.id, "prihvacen");

        return uspjesanOdgovor(res, rezultat, "Poziv prihvaćen.", 200);
    } catch (error: any) {
        console.error(error);
        return greskaOdgovor(res, error.message || "Došlo je do greške prilikom prihvatanja poziva.", 400);
    }
};

export const odbijanjePozivaNaProjekatController = async (req: Request, res: Response) => {

    try {
        const projekatId = Number(req.params.projekatId);

        if (!req.korisnik) {
            return greskaOdgovor(res, "Korisnik nije autentifikovan.", 401);
        }

        const rezultat = await odgovoriNaPozivZaProjekat(projekatId, req.korisnik.id, "odbijen");

        return uspjesanOdgovor(res, rezultat, "Poziv odbijen.", 200);

    } catch (error: any) {
        console.error(error);
        return greskaOdgovor(res, error.message || "Došlo je do greške prilikom odbijanja poziva.", 400);
    }
};

export const kreiranjePosla = async (req: Request, res: Response) => {

    try {
        const projekatId = Number(req.params.projekatId);
        const { naziv, opis, rok } = req.body;

        if (!req.korisnik) {
            return greskaOdgovor(res, "Korisnik nije autentifikovan.", 401);
        }

        const posao = await kreirajPosao(
            projekatId,
            req.korisnik.id,
            naziv,
            opis,
            rok
        );

        return uspjesanOdgovor(res, posao, "Posao uspešno kreiran.", 201);
    } catch (error: any) {
        console.error(error);
        return greskaOdgovor(res, error.message || "Došlo je do greške prilikom kreiranja posla.", 400);
    }
};

export const dobavljanjePoslovaZaProjekatController = async (req: Request, res: Response) => {

    try {
        const projekatId = Number(req.params.projekatId);

        if (!req.korisnik) {
            return greskaOdgovor(res, "Korisnik nije autentifikovan.", 401);
        }

        const poslovi = await dobaviPosloveZaProjekat(projekatId, req.korisnik.id);

        return uspjesanOdgovor(res, poslovi, "Poslovi uspešno dohvaćeni.", 200);
    } catch (error: any) {
        console.error(error);
        return greskaOdgovor(res, error.message || "Došlo je do greške prilikom prikaza poslova za projekat.", 400);
    }
};

export const dobavljanjeMojihProjekataController = async (req: Request, res: Response) => {
    try {
        if (!req.korisnik) {
            return greskaOdgovor(res, "Korisnik nije autentifikovan.", 401);
        }

        const projekti = await dobaviMojeProjekte(req.korisnik.id);

        return uspjesanOdgovor(res, projekti, "Moji projekti uspešno dohvaćeni.", 200);
    } catch (error: any) {
        console.error(error);
        return greskaOdgovor(res, error.message || "Došlo je do greške prilikom prikaza mojih projekata.", 400);
    }
};

export const dobavljanjeDetaljaProjektaController = async (req: Request, res: Response) => {
    try {
        const projekatId = Number(req.params.projekatId);

        if (!req.korisnik) {
            return greskaOdgovor(res, "Korisnik nije autentifikovan.", 401);
        }

        const projekat = await dobaviDetaljeProjekta(projekatId, req.korisnik.id);

        return uspjesanOdgovor(res, projekat, "Detalji projekta uspešno dohvaćeni.", 200);
    } catch (error: any) {
        console.error(error);
        return greskaOdgovor(res, error.message || "Došlo je do greške prilikom prikaza detalja projekta.", 400);
    }
};

export const dobavljanjePozivaKorisnikaZaProjekatController = async (req: Request, res: Response) => {

    try {
        if (!req.korisnik) {
            return greskaOdgovor(res, "Korisnik nije autentifikovan.", 401);
        }

        const pozivi = await dobaviPoziveKorisnikaZaProjekat(req.korisnik.id);

        return uspjesanOdgovor(res, pozivi, "Pozivi uspešno dohvaćeni.", 200);
    } catch (error: any) {
        console.error(error);
        return greskaOdgovor(res, error.message || "Došlo je do greške prilikom prikaza poziva za projekat.", 400);
    }
};