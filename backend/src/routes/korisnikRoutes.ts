import { Router } from "express";
import { registracijaHandler } from "../controllers/korisnikController";

const router = Router();

router.post("/registracija", registracijaHandler);

export default router;