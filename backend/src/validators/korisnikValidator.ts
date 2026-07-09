import { z } from "zod";
import { obavezanTekst, obavezanEmail } from "../utils/validationHelper";

export const registracijaKorisnikaSchema = z.object(
    {
        ime: obavezanTekst("Ime je obavezno."),
        prezime: obavezanTekst("Prezime je obavezno."),
        korisnicko_ime: obavezanTekst("Korisničko ime je obavezno.").min(3, "Korisničko ime mora imati najmanje 3 karaktera."),
        email: obavezanEmail(),
        lozinka: obavezanTekst("Lozinka je obavezna.").min(6, "Lozinka mora imati najmanje 6 karaktera.")
    }
);

export const prijavaKorisnikaSchema = z.object(
    {
        email: obavezanEmail(),
        lozinka: obavezanTekst("Lozinka je obavezna.")
    }
);