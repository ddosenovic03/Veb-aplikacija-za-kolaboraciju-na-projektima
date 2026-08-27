import dotenv from "dotenv";

dotenv.config();

export const zahtijevajEnv = (naziv: string) => {

    const vrijednost = process.env[naziv];

    if (!vrijednost) {
        throw new Error(`Nedostaje environment varijabla: ${naziv}`);
    }

    return vrijednost;
};

const jwtSecret = zahtijevajEnv("JWT_SECRET").trim();

if (jwtSecret.length < 32 || jwtSecret === "replace_with_a_long_random_secret") {
    throw new Error("JWT_SECRET mora biti vlastita tajna dužine najmanje 32 karaktera.");
}

export const JWT_SECRET = jwtSecret;
