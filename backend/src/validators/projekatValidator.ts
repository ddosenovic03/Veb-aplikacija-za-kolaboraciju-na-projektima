import { z } from "zod";
import { 
    obavezanTekst,
    obavezanEmail,
    opcioniTekst
} from "../utils/validationHelper";

export const kreiranjeProjektaSchema = z.object(
    {
        naziv: obavezanTekst("Naziv projekta je obavezan."),
        opis: opcioniTekst()
    }
);

export const izmjenaProjektaSchema = z.object(
    {
        naziv: obavezanTekst("Naziv projekta ne sme biti prazan.").optional(),
        opis: opcioniTekst()
    }
).strict().refine(  
    (podaci) => podaci.naziv !== undefined || podaci.opis !== undefined, { message: "Nema podataka za izmenu projekta." }
);

export const pozivanjeKorisnikaNaProjekatSchema = z.object(
    {
        email: obavezanEmail()
    }
);

export const odgovorNaPozivSchema = z.object(
    {
        status: z.enum(["prihvacen", "odbijen"], { message: "Status poziva nije validan." })
    }
);