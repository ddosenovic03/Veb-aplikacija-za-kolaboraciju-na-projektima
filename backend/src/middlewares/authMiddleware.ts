import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

type JwtPayload = {
    id: number;
    email: string;
}; 

declare global {
    namespace Express {
        interface Request {
            korisnik?: JwtPayload;
        }
    }
}

export const autentifikacija = (req: Request, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({ poruka: "Nedostaje token!" });
        }

        const token = authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : authHeader;
        if (!token) {
            return res.status(401).json({ poruka: "Nedostaje token!" });
        }   

        const dekodiran = jwt.verify(token, process.env.JWT_SECRET as string);
        if (typeof dekodiran === "string") {
            return res.status(401).json({ poruka: "Neispravan token!" });
        }
        const dekodiranJwt = dekodiran as JwtPayload;

        req.korisnik = dekodiranJwt;
        next();
    } catch (greska) {
        return res.status(401).json({ poruka: "Nevažeći ili istekao token!" });
    }
};