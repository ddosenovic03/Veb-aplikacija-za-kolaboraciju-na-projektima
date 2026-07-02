import { Request, Response } from 'express';
import { 
    prijaviSeNaPosao,
    azurirajProcenatPosla,
    prikaziDetaljePosla
} from '../services/posaoService';
import { uspjesanOdgovor, greskaOdgovor } from '../utils/apiResponse';

export const prijavaNaPosaoController = async (req: Request, res: Response) => {

    try {
        const posaoId = Number(req.params.posaoId);
        const { predlozeniRok } = req.body;

        if (!req.korisnik) {
            return greskaOdgovor(res, "Korisnik nije autorizovan.", 401);
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

        const rezultat = await azurirajProcenatPosla(posaoId, req.korisnik.id, Number(procenat));

        return uspjesanOdgovor(res, rezultat, "Procenat posla je uspešno ažuriran.", 200);
    } catch (error: any) {
        console.error(error);
        return greskaOdgovor(res, error.message || "Došlo je do greške prilikom ažuriranja procenta posla.", 400);
    }
};

export const prikazDetaljaPoslaController = async (req: Request, res: Response) => {

    try {
        const posaoId = Number(req.params.posaoId);

        if (!req.korisnik) {
            return greskaOdgovor(res, "Korisnik nije autorizovan.", 401);
        }

        const rezultat = await prikaziDetaljePosla(posaoId, req.korisnik.id);

        return uspjesanOdgovor(res, rezultat, "Detalji posla su uspešno dobavljeni.", 200);
    } catch (error: any) {
        console.error(error);
        return greskaOdgovor(res, error.message || "Došlo je do greške prilikom prikazivanja detalja posla.", 400);
    }
};