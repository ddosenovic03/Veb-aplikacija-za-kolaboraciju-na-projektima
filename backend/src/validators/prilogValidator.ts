import { z } from "zod";
import { obavezanUrl } from "../utils/validationHelper";

export const dodavanjePrilogaSchema = z.object({
    tip: z.enum(["link"], { message: "Trenutno je podržano samo dodavanje link priloga." }),
    url: obavezanUrl("URL priloga je obavezan.", "URL priloga nije validan.")
});

const dozvoljeniTipoviFajlova = [
    "image/jpeg",
    "image/png",
    "image/webp",
    "application/pdf",
    "text/plain",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
];

export const dodavanjeFajlPrilogaSchema = z.object(
    {
        fajl: z
            .custom<Express.Multer.File>((fajl) => 
                {
                    return fajl !== undefined && fajl !== null;
                },
                {
                    message: "Fajl je obavezan."
                }
            )
            .refine((fajl) => dozvoljeniTipoviFajlova.includes(fajl.mimetype), 
                {
                    message: "Tip fajla nije dozvoljen."
                }
            )
            .refine((fajl) => fajl.size <= 5 * 1024 * 1024, 
                {
                    message: "Fajl ne sme biti veći od 5MB."
                }
            )
    }
);