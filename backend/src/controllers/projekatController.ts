import { Request, Response } from 'express';
import { kreirajProjekat } from '../services/projekatService';
import { pozoviKorisnikaNaProjekat } from '../services/projekatService';
import { odgovoriNaPoziv } from '../services/projekatService';

export const kreiranjeProjekta = async (req: Request, res: Response) => {
    try {
        const { naziv, opis } = req.body;

        if (!req.korisnik) {
            return res.status(401).json({ poruka: "Korisnik nije autentifikovan." });
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
            return res.status(401).json({ poruka: "Korisnik nije autentifikovan." });
        }

        const rezultat = await pozoviKorisnikaNaProjekat(projekatId, req.korisnik.id, email);

        return res.status(201).json({ poruka: "Korisnik uspešno pozvan na projekat.", rezultat });
    } catch (greska: any) {
        console.error(greska);
        return res.status(400).json({ poruka: greska.message || "Došlo je do greške prilikom pozivanja korisnika na projekat." });
    }
};

export const prihvatanjePoziva = async (req: Request, res: Response) => {

    try {
        const projekatId = Number(req.params.projekatId);

        if (!req.korisnik) {
            return res.status(401).json({ poruka: "Korisnik nije autentifikovan." });
        }

        const rezultat = await odgovoriNaPoziv(projekatId, req.korisnik.id, "prihvacen");

        return res.status(200).json({ poruka: "Poziv prihvaćen.", clanstvo: rezultat });
    } catch (greska: any) {
        console.error(greska);
        return res.status(400).json({ poruka: greska.message || "Došlo je do greške prilikom prihvatanja poziva." });
    }
};

export const odbijanjePoziva = async (req: Request, res: Response) => {

    try {
        const projekatId = Number(req.params.projekatId);

        if (!req.korisnik) {
            return res.status(401).json({ poruka: "Korisnik nije autentifikovan." });
        }

        const rezultat = await odgovoriNaPoziv(projekatId, req.korisnik.id, "odbijen");

        return res.status(200).json({ poruka: "Poziv odbijen.", clanstvo: rezultat });

    } catch (greska: any) {
        console.error(greska);
        return res.status(400).json({ poruka: greska.message || "Došlo je do greške prilikom odbijanja poziva." }); 
    }
};