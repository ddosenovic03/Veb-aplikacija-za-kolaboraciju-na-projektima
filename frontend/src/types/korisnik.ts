export type Korisnik = {
    id: number;
    ime: string;
    prezime: string;
    korisnicko_ime: string;
    email: string;
};

export type RegistracijaKorisnikaRequest = {
    ime: string;
    prezime: string;
    korisnicko_ime: string;
    email: string;
    lozinka: string;
};

export type PrijavaKorisnikaRequest = {
    email: string;
    lozinka: string;
};

export type PrijavaKorisnikaResponse = {
    token: string;
    korisnik: Korisnik;
};