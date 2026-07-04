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

export const kreiranjePosla = async (req: Request, res: Response) => {

    try {
        const projekatId = Number(req.params.projekatId);
        const { naziv, opis, rok } = req.body;

        if (!req.korisnik) {
            return greskaOdgovor(res, "Korisnik nije autentifikovan.", 401);
        }

        if (Number.isNaN(projekatId)) {
            return greskaOdgovor(res, "ID nije validan.", 400);
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

export const prijavaNaPosaoController = async (req: Request, res: Response) => {

    try {
        const posaoId = Number(req.params.posaoId);
        const { predlozeniRok } = req.body;

        if (!req.korisnik) {
            return greskaOdgovor(res, "Korisnik nije autorizovan.", 401);
        }

        if (Number.isNaN(posaoId)) {
            return greskaOdgovor(res, "ID nije validan.", 400);
        }

        const angazman = await prijaviSeNaPosao(posaoId, req.korisnik.id, predlozeniRok);

        return uspjesanOdgovor(res, angazman, "Korisnik je uspešno prijavljen na posao.", 201);
    } catch (error: any) {
        console.error(error);
        return greskaOdgovor(res, error.message || "Došlo je do greške prilikom prijave na posao.", 400);
    }
}; 

export const azuriranjeProcentaPoslaController = async (req: Request, res: Response) => {

    try {
        const posaoId = Number(req.params.posaoId);
        const { procenat } = req.body;

        if (!req.korisnik) {
            return greskaOdgovor(res, "Korisnik nije autorizovan.", 401);
        }

        if (Number.isNaN(posaoId)) {
            return greskaOdgovor(res, "ID nije validan.", 400);
        }

        const rezultat = await azurirajProcenatPosla(posaoId, req.korisnik.id, Number(procenat));

        return uspjesanOdgovor(res, rezultat, "Procenat posla je uspešno ažuriran.", 200);
    } catch (error: any) {
        console.error(error);
        return greskaOdgovor(res, error.message || "Došlo je do greške prilikom ažuriranja procenta posla.", 400);
    }
};

export const dobavljanjeDetaljaPoslaController = async (req: Request, res: Response) => {

    try {
        const posaoId = Number(req.params.posaoId);

        if (!req.korisnik) {
            return greskaOdgovor(res, "Korisnik nije autorizovan.", 401);
        }

        if (Number.isNaN(posaoId)) {
            return greskaOdgovor(res, "ID nije validan.", 400);
        }

        const rezultat = await dobaviDetaljePosla(posaoId, req.korisnik.id);

        return uspjesanOdgovor(res, rezultat, "Detalji posla su uspešno dobavljeni.", 200);
    } catch (error: any) {
        console.error(error);
        return greskaOdgovor(res, error.message || "Došlo je do greške prilikom prikazivanja detalja posla.", 400);
    }
};

export const dobavljanjeMojihPoslovaController = async (req: Request, res: Response) => {

    try {
        if (!req.korisnik) {
            return greskaOdgovor(res, "Korisnik nije autorizovan.", 401);
        }

        const poslovi = await dobaviMojePoslove(req.korisnik.id);

        return uspjesanOdgovor(res, poslovi, "Moji poslovi su uspešno dobavljeni.", 200);
    } catch (error: any) {
        console.error(error);
        return greskaOdgovor(res, error.message || "Došlo je do greške prilikom dobavljanja mojih poslova.", 400);
    }
};

export const dobavljanjeKreiranihPoslovaController = async (req: Request, res: Response) => {

    try {
        if (!req.korisnik) {
            return greskaOdgovor(res, "Korisnik nije autorizovan.", 401);
        }

        const poslovi = await dobaviKreiranePoslove(req.korisnik.id);

        return uspjesanOdgovor(res, poslovi, "Kreirani poslovi su uspešno dobavljeni.", 200);
    } catch (error: any) {
        console.error(error);
        return greskaOdgovor(res, error.message || "Došlo je do greške prilikom dobavljanja kreiranih poslova.", 400);
    }
};

export const izmjenaPosla = async (req: Request, res: Response) => {

    try {
        const posaoId = Number(req.params.posaoId);
        const { naziv, opis, rok } = req.body;

        if (!req.korisnik) {
            return greskaOdgovor(res, "Korisnik nije autorizovan.", 401);
        }

        if (Number.isNaN(posaoId)) {
            return greskaOdgovor(res, "ID nije validan.", 400);
        }

        const posao = await izmijeniPosao(posaoId, req.korisnik.id, naziv, opis, rok);

        return uspjesanOdgovor(res, posao, "Posao je uspešno izmenjen.", 200);
    } catch (error: any) {
        console.error(error);
        return greskaOdgovor(res, error.message || "Došlo je do greške prilikom izmene posla.", 400);
    }
};  

export const brisanjePosla = async (req: Request, res: Response) => {

    try {
        const posaoId = Number(req.params.posaoId);

        if (!req.korisnik) {
            return greskaOdgovor(res, "Korisnik nije autorizovan.", 401);
        }

        if (Number.isNaN(posaoId)) {
            return greskaOdgovor(res, "ID nije validan.", 400);
        }

        const posao = await obrisiPosao(posaoId, req.korisnik.id);

        return uspjesanOdgovor(res, posao, "Posao je uspešno obrisan.", 200);
    } catch (error: any) {
        console.error(error);
        return greskaOdgovor(res, error.message || "Došlo je do greške prilikom brisanja posla.", 400);
    }
};