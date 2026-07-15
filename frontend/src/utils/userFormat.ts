import type { 
    ClanProjekta,
    KratakKorisnik,
    PozivZaProjekat
} from "../types/projekat";

export const formatirajKorisnika = (korisnik?: KratakKorisnik | null) => {

    if (!korisnik) return "Nepoznat korisnik";

    const punoIme = [korisnik.ime, korisnik.prezime].filter(Boolean).join(" ");

    if (punoIme && korisnik.korisnicko_ime) return `${punoIme} (@${korisnik.korisnicko_ime})`;
    if (punoIme) return punoIme;
    if (korisnik.korisnicko_ime) return `@${korisnik.korisnicko_ime}`;
    if (korisnik.email) return korisnik.email;

    return "Nepoznat korisnik";
};

export const formatirajClana = (clan: ClanProjekta) => {

    if (clan.korisnik) return formatirajKorisnika(clan.korisnik);

    return formatirajKorisnika({
        id: clan.id ?? clan.korisnik_id,
        ime: clan.ime,
        prezime: clan.prezime,
        korisnicko_ime: clan.korisnicko_ime,
        email: clan.email
    });
};

export const formatirajPozvanogKorisnika = (poziv: PozivZaProjekat) => {

    if (poziv.korisnik) return formatirajKorisnika(poziv.korisnik);

    return formatirajKorisnika({
        id: poziv.korisnik_id,
        ime: poziv.ime,
        prezime: poziv.prezime,
        korisnicko_ime: poziv.korisnicko_ime,
        email: poziv.email
    });
};