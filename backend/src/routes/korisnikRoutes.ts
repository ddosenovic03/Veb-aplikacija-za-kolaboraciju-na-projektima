import { Router } from "express";
import { registracijaHandler } from "../controllers/korisnikController";
import { loginHandler } from "../controllers/korisnikController";

const router = Router();

router.post("/registracija", registracijaHandler);
router.post("/login", loginHandler);

export default router;