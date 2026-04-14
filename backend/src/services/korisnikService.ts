import { db } from "../config/db";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";


// REGISTRACIJA KORISNIKA

type RegistracijaPodaci = {
  ime: string;
  prezime: string;
  korisnicko_ime: string;
  email: string;
  lozinka: string;
};

export const registracija = async (podaci: RegistracijaPodaci) => {
  const { ime, prezime, korisnicko_ime, email, lozinka } = podaci;

  if (!ime || !prezime || !korisnicko_ime || !email || !lozinka) {
    throw new Error("Sva polja su obavezna");
  }

  const lozinkaHash = await bcrypt.hash(lozinka, 10);

  const [ rezultat ] = await db.query(
    "INSERT INTO Korisnik (ime, prezime, korisnicko_ime, email, lozinka_hash) VALUES (?, ?, ?, ?, ?)",
    [ime, prezime, korisnicko_ime, email, lozinkaHash]
  );

  return { 
    id: (rezultat as any).insertId,
    ime,
    prezime,
    korisnicko_ime,
    email
  };

};

// LOGIN KORISNIKA
export const login = async (email: string, lozinka: string) => {
    if (!email || !lozinka) {
        throw new Error("Email i lozinka su obavezni");
    }

    const [rows]: any = await db.query("SELECT * FROM Korisnik WHERE email = ?", [email]);

    const korisnik = rows[0];

    if (!korisnik) {
        throw new Error("Neispravan email ili lozinka");
    }

    const validnaLozinka = await bcrypt.compare(lozinka, korisnik.lozinka_hash);
    
    if (!validnaLozinka) {
        throw new Error("Neispravan email ili lozinka");
    }

    const token = jwt.sign(
        { id: korisnik.id, email: korisnik.email },
        process.env.JWT_SECRET!,
        { expiresIn: "1h" }
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

