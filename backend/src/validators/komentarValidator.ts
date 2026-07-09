import { z } from "zod";
import { obavezanTekst } from "../utils/validationHelper";

export const dodavanjeKomentaraSchema = z.object(
    {
        sadrzaj: obavezanTekst("Sadržaj komentara je obavezan."),
        vidljivost: z.enum(["javni", "privatni"]).optional().default("javni")
    }
);

export const izmjenaKomentaraSchema = z.object(
    {
        sadrzaj: obavezanTekst("Sadržaj komentara ne sme biti prazan.").optional(),
        vidljivost: z.enum(["javni", "privatni"]).optional()
    }
).strict().refine(
    (podaci) => podaci.sadrzaj !== undefined || podaci.vidljivost !== undefined, { message: "Nema podataka za izmenu komentara." }
);