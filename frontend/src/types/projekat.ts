export type KratakKorisnik = {
    id?: number;
    ime?: string;
    prezime?: string;
    korisnicko_ime?: string;
    email?: string;
};

export type Projekat = {
    id: number;
    naziv: string;
    opis?: string | null;
    datum_kreiranja?: string;

    vlasnik_id?: number;
    vlasnik_ime?: string;
    vlasnik_prezime?: string;
    vlasnik_korisnicko_ime?: string;
    vlasnik?: KratakKorisnik | null;

    broj_clanova?: number;
    broj_poslova?: number;
    procenat?: number;
    status?: string;
};

export type KreiranjeProjektaRequest = {
    naziv: string;
    opis?: string;
};

export type IzmjenaProjektaRequest = {
    naziv: string;
    opis?: string;
};

export type PozivanjeKorisnikaRequest = {
    email: string;
};

export type ClanProjekta = {
    id?: number;
    korisnik_id?: number;
    ime?: string;
    prezime?: string;
    korisnicko_ime?: string;
    email?: string;
    uloga?: "vlasnik" | "clan";
    status?: string;
    korisnik?: KratakKorisnik;
};

export type PozivKorisnika = {
    id?: number;
    projekat_id?: number;
    status: string;

    naziv?: string;
    opis?: string | null;

    projekat_naziv?: string;
    projekat_opis?: string | null;

    projekat?: Projekat;
    vlasnik?: KratakKorisnik | null;
};

export type PozivZaProjekat = {
    id?: number;
    korisnik_id?: number;
    status: string;

    ime?: string;
    prezime?: string;
    korisnicko_ime?: string;
    email?: string;

    korisnik?: KratakKorisnik;
};

export type NapredakProjekta = {
    procenat: number;
    status?: string;
    broj_poslova?: number;
    broj_zavrsenih_poslova?: number;
};

