import { Router } from "express";
import { autentifikacija } from "../middlewares/authMiddleware";
import { cleanupFajlovaKomentara } from "../middlewares/fileCleanupMiddleware";
import { 
    dodavanjeKomentaraController, 
    dobavljanjeKomentaraZaPosaoController,
    izmjenaKomentaraController,
    brisanjeKomentaraController
} from "../controllers/komentarController";

const router = Router();

router.post("/:posaoId", autentifikacija, dodavanjeKomentaraController);
router.get("/:posaoId", autentifikacija, dobavljanjeKomentaraZaPosaoController);
router.patch("/:komentarId", autentifikacija, izmjenaKomentaraController);
router.delete("/:komentarId", autentifikacija, cleanupFajlovaKomentara, brisanjeKomentaraController);

export default router;
