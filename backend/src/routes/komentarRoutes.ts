import { Router } from "express";
import { autentifikacija } from "../middlewares/authMiddleware";
import { dodavanjeKomentara, dohvatiKomentare } from "../controllers/komentarController";

const router = Router();

router.post("/:posaoId", autentifikacija, dodavanjeKomentara);
router.get("/:posaoId", autentifikacija, dohvatiKomentare);

export default router;