import type { KratakKorisnik } from "./projekat";

export type VidljivostKomentara = "javni" | "privatni";

export type Komentar = {
    id: number;
    sadrzaj: string;
    vidljivost: VidljivostKomentara;
    datum_kreiranja?: string;

    posao_id?: number;

    autor_id?: number;
    autor_ime?: string;
    autor_prezime?: string;
    autor_korisnicko_ime?: string;
    autor_email?: string;

    autor?: KratakKorisnik | null;
};

export type DodavanjeKomentaraRequest = {
    sadrzaj: string;
    vidljivost: VidljivostKomentara;
};

export type IzmjenaKomentaraRequest = {
    sadrzaj: string;
    vidljivost: VidljivostKomentara;
};