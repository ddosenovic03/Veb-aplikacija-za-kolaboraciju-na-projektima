import fs from "fs/promises";
import path from "path";

const folderPriloga = path.resolve(process.cwd(), "uploads", "prilozi");

export const obrisiFajloveSaDiska = async (putanje: Array<string | null | undefined>) => {
    for (const putanja of putanje) {
        if (!putanja) continue;

        const apsolutnaPutanja = path.resolve(process.cwd(), putanja);
        const relativnaPutanja = path.relative(folderPriloga, apsolutnaPutanja);

        if (relativnaPutanja.startsWith("..") || path.isAbsolute(relativnaPutanja)) {
            continue;
        }

        try {
            await fs.unlink(apsolutnaPutanja);
        } catch {
            // Fajl je možda već obrisan; DB operacija ostaje uspješna.
        }
    }
};
