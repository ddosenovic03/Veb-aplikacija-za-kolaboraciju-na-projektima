import type { KratakKorisnik, Projekat } from "./projekat";

export type PosaoZaListu = {
    id: number;
    naziv: string;
    opis?: string | null;
    rok?: string;
    datum_kreiranja?: string;

    projekat_id?: number;
    projekat_naziv?: string;
    projekat?: Projekat;

    kreator_id?: number;
    kreator?: KratakKorisnik | null;
    kreator_ime?: string;
    kreator_prezime?: string;
    kreator_korisnicko_ime?: string;
    kreator_email?: string;

    broj_angazovanih?: number;
    procenat_posla?: number;
    procenat?: number;
    moj_procenat?: number;
    predlozeni_rok?: string;
    status?: string;
};

export type AngazovaniKorisnik = {
    id?: number;
    korisnik_id?: number;

    ime?: string;
    prezime?: string;
    korisnicko_ime?: string;
    email?: string;

    korisnik?: KratakKorisnik;

    procenat?: number;
    moj_procenat?: number;
    predlozeni_rok?: string | null;
    datum_prijave?: string;
};

export type PosaoDetalji = PosaoZaListu & {
    angazovani?: AngazovaniKorisnik[];
    angazmani?: AngazovaniKorisnik[];
};

export type KreiranjePoslaRequest = {
    naziv: string;
    opis?: string;
    rok: string;
};

export type IzmjenaPoslaRequest = {
    naziv?: string;
    opis?: string;
    rok?: string;
};

export type PrijavaNaPosaoRequest = {
    predlozeni_rok?: string;
};

export type AzuriranjeProcentaPoslaRequest = {
    procenat: number;
};