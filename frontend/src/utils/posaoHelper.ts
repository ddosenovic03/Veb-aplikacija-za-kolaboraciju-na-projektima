import type { AngazovaniKorisnik, PosaoDetalji, PosaoZaListu } from "../types/posao";
import type { KratakKorisnik } from "../types/projekat";

export const dobaviProcenatPosla = (posao: PosaoZaListu | PosaoDetalji) => {

    return Number(posao.procenat_posla ?? posao.procenat ?? 0);
};

export const dobaviStatusPosla = (posao: PosaoZaListu | PosaoDetalji) => {

    const procenat = dobaviProcenatPosla(posao);

    if (procenat === 0) return "nije_zapocet";
    if (procenat === 100) return "zavrsen";
    return "u_toku";
};

export const dobaviKreatoraPosla = (posao: PosaoZaListu | PosaoDetalji): KratakKorisnik | null => {

    if (posao.kreator) return posao.kreator;
    if (posao.kreator_id || posao.kreator_ime || posao.kreator_prezime || posao.kreator_korisnicko_ime) return {
        id: posao.kreator_id,
        ime: posao.kreator_ime,
        prezime: posao.kreator_prezime,
        korisnicko_ime: posao.kreator_korisnicko_ime
    };

    return null;
};

export const dobaviAngazovane = (posao: PosaoDetalji) => {

    return posao.angazovani ?? posao.angazmani ?? [];
};

export const dobaviKorisnikaIzAngazmana = (angazman: AngazovaniKorisnik): KratakKorisnik => {

    if (angazman.korisnik) return angazman.korisnik;

    return {
        id: angazman.korisnik_id ?? angazman.id,
        ime: angazman.ime,
        prezime: angazman.prezime,
        korisnicko_ime: angazman.korisnicko_ime,
        email: angazman.email
    };
};