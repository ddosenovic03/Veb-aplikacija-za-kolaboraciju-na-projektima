import { z } from "zod";
import { HttpGreska } from "./requestHelper";

const formatDatuma = /^\d{4}-\d{2}-\d{2}$/;

const validanKalendarskiDatum = (vrijednost: string) => {

    if (!formatDatuma.test(vrijednost)) {
        return true;
    }

    const godina = Number(vrijednost.slice(0, 4));
    const mjesec = Number(vrijednost.slice(5, 7));
    const dan = Number(vrijednost.slice(8, 10));
    const datum = new Date(0);

    datum.setUTCFullYear(godina, mjesec - 1, dan);

    return datum.getUTCFullYear() === godina
        && datum.getUTCMonth() === mjesec - 1
        && datum.getUTCDate() === dan;
};

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
            .regex(formatDatuma, porukaFormat)
            .refine(validanKalendarskiDatum, { message: porukaValidnost });
};

export const opcioniDatum = (porukaFormat = "Datum mora biti u formatu YYYY-MM-DD", porukaValidnost = "Datum nije validan.") => {

    return z.string({ error: "Datum mora biti tekst." })
        .trim()
        .regex(formatDatuma, porukaFormat)
        .refine(validanKalendarskiDatum, { message: porukaValidnost })
        .optional();
};

export const obavezanUrl = (porukaObavezno = "URL je obavezan.", porukaFormat = "URL nije validan.") => {

    return z.string({ error: (issue) => issue.input === undefined ? porukaObavezno : "URL mora biti tekst." })
        .trim().min(1, porukaObavezno).pipe(z.url({ error: porukaFormat }));
};

export const obavezanBroj = (porukaObavezno: string, porukaTip = "Vrednost mora biti broj.") => {

    return z.preprocess((vrijednost, context) => {

        if (vrijednost === undefined || vrijednost === null
            || (typeof vrijednost === "string" && vrijednost.trim().length === 0)) {
            context.addIssue({ code: "custom", message: porukaObavezno });

            return z.NEVER;
        }

        if (typeof vrijednost === "string") {
            return vrijednost.trim();
        }

        return typeof vrijednost === "number" ? vrijednost : Number.NaN;
    }, z.coerce.number({ error: (issue) => issue.input === undefined ? porukaObavezno : porukaTip }));
};
