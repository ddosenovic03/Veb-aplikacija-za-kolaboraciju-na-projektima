import type { KratakKorisnik } from "./projekat";

export type PosaoZaListu = {
    id: number;
    naziv: string;
    opis?: string | null;
    rok?: string;
    datum_kreiranja?: string;

    projekat_id?: number;
    projekat_naziv?: string;

    kreator_id?: number;
    kreator?: KratakKorisnik | null;
    kreator_ime?: string;
    kreator_prezime?: string;
    kreator_korisnicko_ime?: string;

    broj_angazovanih?: number;
    procenat_posla?: number;
    procenat?: number;
    status?: string;
};