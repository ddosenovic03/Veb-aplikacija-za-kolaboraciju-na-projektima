import { Router } from "express";
import { registracijaKorisnikaController } from "../controllers/korisnikController";
import { prijavaKorisnikaController } from "../controllers/korisnikController";

const router = Router();

router.post("/registracija", registracijaKorisnikaController);
router.post("/login", prijavaKorisnikaController);

export default router;