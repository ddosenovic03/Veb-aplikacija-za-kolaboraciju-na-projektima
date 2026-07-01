import { Request, Response } from 'express';
import { dodajKomentar, dobaviKomentareZaPosao } from '../services/komentarService';

export const dodavanjeKomentaraController = async (req: Request, res: Response) => {

    try {
        const posaoId = Number(req.params.posaoId);
        const { sadrzaj } = req.body;
        const { vidljivost } = req.body;

        if (!req.korisnik) {
            return res.status(401).json({ error: "Korisnik nije autorizovan" });
        }

        const komentar = await dodajKomentar(posaoId, req.korisnik.id, sadrzaj, vidljivost || "javni");

        return res.status(201).json({ poruka: "Komentar uspešno dodat.", komentar });

    } catch (error: any) {
        return res.status(500).json({ greska: error.message });
    }
};

export const dobavljanjeKomentaraZaPosaoController = async (req: Request, res: Response) => {

    try {
        const posaoId = Number(req.params.posaoId);

        if (!req.korisnik) {
            return res.status(401).json({ greska: "Korisnik nije autorizovan" });
        }

        const komentari = await dobaviKomentareZaPosao(posaoId, req.korisnik.id);

        return res.status(200).json({ komentari });
    } catch (error: any) {
        console.error(error);
        return res.status(500).json({ greska: error.message });
    }
};