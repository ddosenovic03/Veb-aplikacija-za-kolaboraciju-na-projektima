import { Router } from "express";
import { autentifikacija } from "../middlewares/authMiddleware";
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
router.delete("/:komentarId", autentifikacija, brisanjeKomentaraController);

export default router;