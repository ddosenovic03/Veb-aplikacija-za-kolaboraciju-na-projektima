import { Request, Response } from 'express';
import { kreirajProjekat } from '../services/projekatService';
import { pozoviKorisnikaNaProjekat } from '../services/projekatService';

export const kreiranjeProjekta = async (req: Request, res: Response) => {
    try {
        const { naziv, opis } = req.body;

        if (!req.korisnik) {
            return res.status(401).json({ poruka: "Niste autentifikovani." });
        }

        const projekat = await kreirajProjekat({
            naziv,
            opis,
            vlasnik_id: req.korisnik.id
        });

        return res.status(201).json({ poruka : "Projekat uspešno kreiran.", projekat });
    } catch (greska: any) {
        console.error(greska);
        return res.status(400).json({ poruka: greska.message || "Došlo je do greške prilikom kreiranja projekta." });
    }
};

export const pozivanjeKorisnika = async (req: Request, res: Response) => {
    try {
        const projekatId = Number(req.params.projekatId);
        const { email } = req.body;

        if (!req.korisnik) {
            return res.status(401).json({ poruka: "Niste autentifikovani." });
        }

        const rezultat = await pozoviKorisnikaNaProjekat(projekatId, req.korisnik.id, email);

        return res.status(201).json({ poruka: "Korisnik uspešno pozvan na projekat.", rezultat });
    } catch (greska: any) {
        console.error(greska);
        return res.status(400).json({ poruka: greska.message || "Došlo je do greške prilikom pozivanja korisnika na projekat." });
    }
};