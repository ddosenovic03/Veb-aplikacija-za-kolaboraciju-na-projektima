import dotenv from "dotenv";

dotenv.config();

export const zahtijevajEnv = (naziv: string) => {

    const vrijednost = process.env[naziv];

    if (!vrijednost) {
        throw new Error(`Nedostaje environment varijabla: ${naziv}`);
    }

    return vrijednost;
};

export const JWT_SECRET = zahtijevajEnv("JWT_SECRET");