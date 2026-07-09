import { Request, Response } from 'express';
import { 
    kreirajProjekat,
    pozoviKorisnikaNaProjekat,
    odgovoriNaPozivZaProjekat,
    dobaviPosloveZaProjekat,
    dobaviMojeProjekte,
    dobaviDetaljeProjekta,
    dobaviPoziveKorisnikaNaProjekte,
    dobaviClanoveProjekta,
    dobaviPozvaneKorisnikeNaProjekat,
    dobaviNapredakProjekta,
    izmijeniProjekat,
    obrisiProjekat
} from '../services/projekatService';
import { uspjesanOdgovor, greskaOdgovor } from '../utils/apiResponse';
import { 
    provjeriAutentifikacijuKorisnika, 
    provjeriId,
    statusGreske,
    porukaGreske 
} from '../utils/requestHelper';
import { validirajPodatke } from '../utils/validationHelper';
import { 
    kreiranjeProjektaSchema,
    izmjenaProjektaSchema,
    pozivanjeKorisnikaNaProjekatSchema,
    odgovorNaPozivSchema 
} from '../validators/projekatValidator';

export const kreiranjeProjekta = async (req: Request, res: Response) => {
    try {
        const korisnikId = provjeriAutentifikacijuKorisnika(req).id;
        const podaci = validirajPodatke(kreiranjeProjektaSchema, req.body);
        const projekat = await kreirajProjekat(
            {
                naziv: podaci.naziv,
                opis: podaci.opis,
                vlasnik_id: korisnikId
            }
        );

        return uspjesanOdgovor(res, projekat, "Projekat je uspješno kreiran.", 201);
    } catch (error: any) {
        console.log(error);
        return greskaOdgovor(res, porukaGreske(error, error.message), statusGreske(error));
    }
};

export const pozivanjeKorisnikaNaProjekatController = async (req: Request, res: Response) => {
    try {
        const korisnikId = provjeriAutentifikacijuKorisnika(req).id;
        const projekatId = provjeriId(req, "projekatId", "projekta");
        const podaci = validirajPodatke(pozivanjeKorisnikaNaProjekatSchema, req.body);
        const rezultat = await pozoviKorisnikaNaProjekat(projekatId, korisnikId, podaci.email);

        return uspjesanOdgovor(res, rezultat, "Korisnik uspešno pozvan na projekat.", 201);
    } catch (error: any) {
        console.error(error);
        return greskaOdgovor(res, porukaGreske(error, error.message), statusGreske(error));
    }
};

export const prihvatanjePozivaNaProjekatController = async (req: Request, res: Response) => {

    try {
        const korisnikId = provjeriAutentifikacijuKorisnika(req).id;
        const projekatId = provjeriId(req, "projekatId", "projekta");
        const podaci = validirajPodatke(odgovorNaPozivSchema, req.body);
        const rezultat = await odgovoriNaPozivZaProjekat(projekatId, korisnikId, podaci.status);

        return uspjesanOdgovor(res, rezultat, "Poziv prihvaćen.", 200);
    } catch (error: any) {
        console.error(error);
        return greskaOdgovor(res, porukaGreske(error, error.message), statusGreske(error));
    }
};

export const odbijanjePozivaNaProjekatController = async (req: Request, res: Response) => {

    try {
        const korisnikId = provjeriAutentifikacijuKorisnika(req).id;
        const projekatId = provjeriId(req, "projekatId", "projekta");
        const podaci = validirajPodatke(odgovorNaPozivSchema, req.body);
        const rezultat = await odgovoriNaPozivZaProjekat(projekatId, korisnikId, podaci.status);

        return uspjesanOdgovor(res, rezultat, "Poziv odbijen.", 200);
    } catch (error: any) {
        console.error(error);
        return greskaOdgovor(res, porukaGreske(error, error.message), statusGreske(error));
    }
};

export const dobavljanjePoslovaZaProjekatController = async (req: Request, res: Response) => {

    try {
        const korisnikId = provjeriAutentifikacijuKorisnika(req).id;
        const projekatId = provjeriId(req, "projekatId", "projekta");

        const poslovi = await dobaviPosloveZaProjekat(projekatId, korisnikId);

        return uspjesanOdgovor(res, poslovi, "Poslovi uspešno dobavljeni.", 200);
    } catch (error: any) {
        console.error(error);
        return greskaOdgovor(res, porukaGreske(error, error.message), statusGreske(error));
    }
};

export const dobavljanjeMojihProjekataController = async (req: Request, res: Response) => {
    try {
        const korisnikId = provjeriAutentifikacijuKorisnika(req).id;
        const projekti = await dobaviMojeProjekte(korisnikId);

        return uspjesanOdgovor(res, projekti, "Moji projekti uspešno dobavljeni.", 200);
    } catch (error: any) {
        console.error(error);
        return greskaOdgovor(res, porukaGreske(error, error.message), statusGreske(error));
    }
};

export const dobavljanjeDetaljaProjektaController = async (req: Request, res: Response) => {
    try {
        const korisnikId = provjeriAutentifikacijuKorisnika(req).id;
        const projekatId = provjeriId(req, "projekatId", "projekta");

        const projekat = await dobaviDetaljeProjekta(projekatId, korisnikId);

        return uspjesanOdgovor(res, projekat, "Detalji projekta uspešno dobavljeni.", 200);
    } catch (error: any) {
        console.error(error);
        return greskaOdgovor(res, porukaGreske(error, error.message), statusGreske(error));
    }
};

export const dobavljanjePozivaKorisnikaNaProjekteController = async (req: Request, res: Response) => {

    try {
        const korisnikId = provjeriAutentifikacijuKorisnika(req).id;
        const pozivi = await dobaviPoziveKorisnikaNaProjekte(korisnikId);

        return uspjesanOdgovor(res, pozivi, "Pozivi na projekat uspešno dobavljeni.", 200);
    } catch (error: any) {
        console.error(error);
        return greskaOdgovor(res, porukaGreske(error, error.message), statusGreske(error));
    }
};

export const dobavljanjeClanovaProjektaController = async (req: Request, res: Response) => {
    
    try {
        const korisnikId = provjeriAutentifikacijuKorisnika(req).id;
        const projekatId = provjeriId(req, "projekatId", "projekta");

        const clanovi = await dobaviClanoveProjekta(projekatId, korisnikId);

        return uspjesanOdgovor(res, clanovi, "Članovi uspešno dobavljeni.", 200);
    } catch (error: any) {
        console.error(error);
        return greskaOdgovor(res, porukaGreske(error, error.message), statusGreske(error));
    }
};

export const dobavljanjePozvanihKorisnikaNaProjekatController = async (req: Request, res: Response) => {

    try {
        const korisnikId = provjeriAutentifikacijuKorisnika(req).id;
        const projekatId = provjeriId(req, "projekatId", "projekta");
        
        const pozivi = await dobaviPozvaneKorisnikeNaProjekat(projekatId, korisnikId);

        return uspjesanOdgovor(res, pozivi, "Pozivi uspešno dobavljeni.", 200);
    } catch (error: any) {
        console.error(error);
        return greskaOdgovor(res, porukaGreske(error, error.message), statusGreske(error));
    }
};

export const dobavljanjeNapretkaProjektaController = async (req: Request, res: Response) => {

    try {
        const korisnikId = provjeriAutentifikacijuKorisnika(req).id;
        const projekatId = provjeriId(req, "projekatId", "projekta");

        const napredak = await dobaviNapredakProjekta(projekatId, korisnikId);

        return uspjesanOdgovor(res, napredak, "Napredak projekta uspešno dobavljen.", 200);
    } catch (error: any) {
        console.error(error);
        return greskaOdgovor(res, porukaGreske(error, error.message), statusGreske(error));
    }
};

export const izmjenaProjekta = async (req: Request, res: Response) => {

    try {
        const korisnikId = provjeriAutentifikacijuKorisnika(req).id;
        const projekatId = provjeriId(req, "projekatId", "projekta");
        const podaci = validirajPodatke(izmjenaProjektaSchema, req.body);
        const projekat = await izmijeniProjekat(projekatId, korisnikId, podaci.naziv, podaci.opis);

        return uspjesanOdgovor(res, projekat, "Projekat je uspešno izmenjen.", 200);
    } catch (error: any) {
        console.error(error);
        return greskaOdgovor(res, porukaGreske(error, error.message), statusGreske(error));
    }
};

export const brisanjeProjekta = async (req: Request, res: Response) => {

    try {
        const korisnikId = provjeriAutentifikacijuKorisnika(req).id;
        const projekatId = provjeriId(req, "projekatId", "projekta");

        const rezultat = await obrisiProjekat(projekatId, korisnikId);

        return uspjesanOdgovor(res, rezultat, "Projekat je uspešno obrisan.", 200);
    } catch (error: any) {
        console.error(error);
        return greskaOdgovor(res, porukaGreske(error, error.message), statusGreske(error));
    }
};