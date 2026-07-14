import { createContext, useContext, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { prijavaKorisnika, registracijaKorisnika } from "../api/korisnikApi";
import type { 
    Korisnik,
    PrijavaKorisnikaRequest,
    RegistracijaKorisnikaRequest 
} from "../types/korisnik";
import { KORISNIK_STORAGE_KEY, TOKEN_STORAGE_KEY } from "../utils/authStorage";

type AuthContextValue = {
    korisnik: Korisnik | null;
    token: string | null;
    jePrijavljen: boolean;
    prijava: (podaci: PrijavaKorisnikaRequest) => Promise<void>;
    registracija: (podaci: RegistracijaKorisnikaRequest) => Promise<void>;
    odjava: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const ucitajKorisnikaIzStorage = () => {

    const sacuvaniKorisnik = localStorage.getItem(KORISNIK_STORAGE_KEY);

    if (!sacuvaniKorisnik) {
        return null;
    }

    try {
        return JSON.parse(sacuvaniKorisnik) as Korisnik;
    } catch {
        localStorage.removeItem(KORISNIK_STORAGE_KEY);
        return null;
    }
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    
    const [token, setToken] = useState<string | null>(() => localStorage.getItem(TOKEN_STORAGE_KEY));
    const [korisnik, setKorisnik] = useState<Korisnik | null>(() => ucitajKorisnikaIzStorage());
    const prijava = async (podaci: PrijavaKorisnikaRequest) => {

        const rezultat = await prijavaKorisnika(podaci);

        localStorage.setItem(TOKEN_STORAGE_KEY, rezultat.token);
        localStorage.setItem(KORISNIK_STORAGE_KEY, JSON.stringify(rezultat.korisnik));

        setToken(rezultat.token);
        setKorisnik(rezultat.korisnik);
    }
    const registracija = async (podaci: RegistracijaKorisnikaRequest) => { await registracijaKorisnika(podaci); };
    const odjava = () => {

        localStorage.removeItem(TOKEN_STORAGE_KEY);
        localStorage.removeItem(KORISNIK_STORAGE_KEY);
        setToken(null);
        setKorisnik(null);
    };
    const value = useMemo(() => ({ korisnik, token, jePrijavljen: Boolean(token && korisnik), prijava, registracija, odjava} ), [korisnik, token]);

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {

    const context = useContext(AuthContext);

    if (!context) {
        throw new Error("useAuth mora biti korišćen unutar AuthProvider komponente.");
    }

    return context;
};