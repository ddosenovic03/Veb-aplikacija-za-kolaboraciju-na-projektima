import { db } from "../config/db";
import bcrypt from "bcrypt";

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

