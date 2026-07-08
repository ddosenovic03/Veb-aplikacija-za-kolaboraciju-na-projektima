import { Request } from "express";

export class HttpGreska extends Error {
    
    status: number;

    constructor(poruka: string, status: number) {
        super(poruka);
        this.status = status;
    }
};

export const provjeriAutentifikacijuKorisnika = (req: Request) => {

    if (!req.korisnik) {
        throw new HttpGreska("Korisnik nije autentifikovan.", 401);
    }
    
    return req.korisnik;
};

export const provjeriId = (req: Request, nazivParametra: string, nazivEntiteta: string) => {

    const id = Number(req.params[nazivParametra]);

    if (!Number.isInteger(id) || id <= 0) {
        throw new HttpGreska(`ID ${nazivEntiteta} nije validan.`, 400);
    }

    return id;
};

export const statusGreske = (error: unknown, podrazumijevaniStatus = 400) => {

    if (error instanceof HttpGreska) {
        return error.status;
    }

    return podrazumijevaniStatus;
};

export const porukaGreske = (error: unknown, podrazumijevanaPoruka = "Došlo je do greške.") => {

    if (error instanceof HttpGreska) {
        return error.message;
    }

    return podrazumijevanaPoruka;
};

