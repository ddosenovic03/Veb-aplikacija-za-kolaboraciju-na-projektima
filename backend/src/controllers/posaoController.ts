import { Request, Response } from 'express';
import { prijavaNaPosao } from '../services/posaoService';
import { azurirajProcenatPosla } from '../services/posaoService';

export const prijaviSeNaPosao = async (req: Request, res: Response) => {

    try {
        const posaoId = Number(req.params.posaoId);
        const { predlozeniRok } = req.body;

        if (!req.korisnik) {
            return res.status(401).json({ error: "Korisnik nije autorizovan." });
        }

        const angazman = await prijavaNaPosao(posaoId, req.korisnik.id, predlozeniRok);

        return res.status(201).json({ poruka: "Korisnik je uspešno prijavljen na posao.", angazman });
    } catch (greska: any) {
        console.error(greska);
        return res.status(400).json({ poruka: greska.message || "Došlo je do greške prilikom prijave na posao." });
    }
}; 

export const azurirajProcenat = async (req: Request, res: Response) => {

    try {
        const posaoId = Number(req.params.posaoId);
        const { procenat } = req.body;

        if (!req.korisnik) {
            return res.status(401).json({ error: "Korisnik nije autorizovan." });
        }

        const rezultat = await azurirajProcenatPosla(posaoId, req.korisnik.id, Number(procenat));

        return res.status(200).json({ poruka: "Procenat posla je uspešno ažuriran.", angazman: rezultat });
    } catch (greska: any) {
        console.error(greska);
        return res.status(400).json({ poruka: greska.message || "Došlo je do greške prilikom ažuriranja procenta posla." });
    }
};