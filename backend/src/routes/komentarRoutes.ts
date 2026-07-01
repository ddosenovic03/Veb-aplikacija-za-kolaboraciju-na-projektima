import { Router } from "express";
import { autentifikacija } from "../middlewares/authMiddleware";
import { dodavanjeKomentaraController, dobavljanjeKomentaraZaPosaoController } from "../controllers/komentarController";

const router = Router();

router.post("/:posaoId", autentifikacija, dodavanjeKomentaraController);
router.get("/:posaoId", autentifikacija, dobavljanjeKomentaraZaPosaoController);

export default router;