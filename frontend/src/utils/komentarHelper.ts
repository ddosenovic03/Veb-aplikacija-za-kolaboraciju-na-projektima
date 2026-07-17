import type { Komentar } from "../types/komentar";
import type { KratakKorisnik } from "../types/projekat";

export const dobaviAutoraKomentara = (komentar: Komentar): KratakKorisnik | null => {

    if (komentar.autor) return komentar.autor;
    if (komentar.autor_id || komentar.autor_ime || komentar.autor_prezime || komentar.autor_korisnicko_ime) 
        return {
            id: komentar.autor_id,
            ime: komentar.autor_ime,
            prezime: komentar.autor_prezime,
            korisnicko_ime: komentar.autor_korisnicko_ime,
            email: komentar.autor_email
        };
    
    return null;
};