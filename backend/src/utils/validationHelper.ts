import { unknown, z } from "zod";
import { HttpGreska } from "./requestHelper";

export const validirajPodatke = <T> (schema: z.ZodType<T>, podaci: unknown): T => {
    
    const rezultat = schema.safeParse(podaci);

    if (!rezultat.success) {
        const poruka = rezultat.error.issues.map((issue) => issue.message).join(" ");
        
        throw new HttpGreska(poruka, 400);
    }

    return rezultat.data;
};

export const obavezanTekst = (porukaObavezno: string) => {

    return z.string({ error: (issue) => issue.input === undefined ? porukaObavezno : "Vrednost mora biti tekst." })
        .trim().min(1, porukaObavezno);
};

export const opcioniTekst = () => {

    return z.string({ error: "Vrednost mora biti tekst." })
        .trim().optional();
};

export const obavezanEmail = (porukaObavezno = "Email je obavezan.", porukaFormat = "Email mora sadržati @.") => {

    return z.string({ error: (issue) => issue.input === undefined ? porukaObavezno : "Email mora biti tekst." })
        .trim().pipe(z.email({ error: porukaFormat }));
};

export const obavezanDatum = (
    porukaObavezno = "Datum je obavezan.", 
    porukaFormat = "Datum mora biti u formatu YYYY-MM-DD", 
    porukaValidnost = "Datum nije validan.") => {
        
        return z.string({ error: (issue) => issue.input === undefined ? porukaObavezno : "Datum mora biti tekst." })
            .trim()
            .min(1, porukaObavezno)
            .regex(/^\d{4}-\d{2}-\d{2}$/, porukaFormat)
            .refine((vrijednost) => !Number.isNaN(Date.parse(vrijednost)), { message: porukaValidnost });
};

export const opcioniDatum = (porukaFormat = "Datum mora biti u formatu YYYY-MM-DD", porukaValidnost = "Datum nije validan.") => {

    return z.string({ error: "Datum mora biti tekst." })
        .trim()
        .regex(/^\d{4}-\d{2}-\d{2}$/, porukaFormat)
        .refine((vrijednost) => !Number.isNaN(Date.parse(vrijednost)), { message: porukaValidnost })
        .optional();
};

export const obavezanUrl = (porukaObavezno = "URL je obavezan.", porukaFormat = "URL nije validan.") => {

    return z.string({ error: (issue) => issue.input === undefined ? porukaObavezno : "URL mora biti tekst." })
        .trim().min(1, porukaObavezno).pipe(z.url({ error: porukaFormat }));
};

export const obavezanBroj = (porukaObavezno: string, porukaTip = "Vrednost mora biti broj.") => {

    return z.coerce.number({ error: (issue) => issue.input === undefined ? porukaObavezno : porukaTip });
};
