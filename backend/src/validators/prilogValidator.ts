import { z } from "zod";
import { obavezanUrl } from "../utils/validationHelper";

export const dodavanjePrilogaSchema = z.object(
    {
        tip: z.enum(["link"], { message: "Trenutno je podržano samo dodavanje link priloga." }),
        url: obavezanUrl("URL priloga je obavezan.", "URL priloga nije validan.")
    }
);