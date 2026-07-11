import { db } from "../config/dbConfig";
import { ResultSetHeader, RowDataPacket } from "mysql2";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/envConfig";

type RegistracijaPodaci = {
  ime: string;
  prezime: string;
  korisnicko_ime: string;
  email: string;
  lozinka: string;
};

interface KorisnikRed extends RowDataPacket {
    id: number;
    ime: string;
    prezime: string;
    korisnicko_ime: string;
    email: string;
    lozinka_hash: string;
}

export const registrujKorisnika = async (podaci: RegistracijaPodaci) => {
  
    const { ime, prezime, korisnicko_ime, email, lozinka } = podaci;

    if (!ime || !prezime || !korisnicko_ime || !email || !lozinka) {
        throw new Error("Sva polja su obavezna");
    }

    const lozinkaHash = await bcrypt.hash(lozinka, 10);
    const [rezultat] = await db.query<ResultSetHeader>(
        "INSERT INTO Korisnik (ime, prezime, korisnicko_ime, email, lozinka_hash) VALUES (?, ?, ?, ?, ?)",
        [ime.trim(), prezime.trim(), korisnicko_ime.trim(), email.trim(), lozinkaHash]
    );

    return { 
        id: rezultat.insertId,
        ime: ime.trim(),
        prezime: prezime.trim(),
        korisnicko_ime: korisnicko_ime.trim(),
        email: email.trim()
    };

};

export const prijaviKorisnika = async (email: string, lozinka: string) => {
    
    if (!email || !lozinka) {
        throw new Error("Email i lozinka su obavezni");
    }

    const [korisnici] = await db.query<KorisnikRed[]>("SELECT * FROM Korisnik WHERE email = ?", [email.trim()]);

    const korisnik = korisnici[0];

    if (!korisnik) {
        throw new Error("Neispravan email ili lozinka");
    }

    const validnaLozinka = await bcrypt.compare(lozinka, korisnik.lozinka_hash);
    
    if (!validnaLozinka) {
        throw new Error("Neispravan email ili lozinka");
    }

    const token = jwt.sign(
        { 
            id: korisnik.id, 
            email: korisnik.email 
        },
        JWT_SECRET,
        { 
            expiresIn: "1h"
        }
    );

    return {
        token,
        korisnik: {
            id: korisnik.id,
            ime: korisnik.ime,
            prezime: korisnik.prezime,
            korisnicko_ime: korisnik.korisnicko_ime,
            email: korisnik.email
        }
    };

};

