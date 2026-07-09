import { z } from "zod";
import { 
    obavezanBroj, 
    obavezanDatum,
    obavezanTekst,
    opcioniDatum,
    opcioniTekst
} from "../utils/validationHelper";

export const kreiranjePoslaSchema = z.object(
    {
        naziv: obavezanTekst("Naziv posla je obavezan."),
        opis: opcioniTekst(),
        rok: obavezanDatum("Rok posla je obavezan.")
    }
);

export const izmjenaPoslaSchema = z.object(
    {
        naziv: obavezanTekst("Naziv posla ne sme biti prazan.").optional(),
        opis: opcioniTekst(),
        rok: opcioniDatum()
    }
).strict().refine(
    (podaci) => podaci.naziv !== undefined || podaci.opis !== undefined || podaci.rok !== undefined, { message: "Nema podataka za izmenu posla." }
);

export const prijavaNaPosaoSchema = z.object(
    {
        predlozeni_rok: opcioniDatum()
    }
);

export const azuriranjeProcentaPoslaSchema = z.object(
    {
        procenat: obavezanBroj("Procenat je obavezan.").min(0, "Procenat ne može biti manji od 0.").max(100, "Procenat ne može biti veći od 100.")
    }
);