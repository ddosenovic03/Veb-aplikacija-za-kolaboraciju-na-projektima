import { Router } from "express";
import { autentifikacija } from "../middlewares/authMiddleware";
import { 
    kreiranjePosla,
    prijavaNaPosaoController, 
    azuriranjeProcentaPoslaController, 
    dobavljanjeDetaljaPoslaController,
    dobavljanjeMojihPoslovaController,
    dobavljanjeKreiranihPoslovaController,
    izmjenaPosla,
    brisanjePosla
} from "../controllers/posaoController";

const router = Router();

router.get("/moji", autentifikacija, dobavljanjeMojihPoslovaController);
router.get("/kreirani", autentifikacija, dobavljanjeKreiranihPoslovaController);

router.post("/:posaoId", autentifikacija, kreiranjePosla);
router.post("/:posaoId/prijava", autentifikacija, prijavaNaPosaoController);
router.patch("/:posaoId/procenat", autentifikacija, azuriranjeProcentaPoslaController);
router.get("/:posaoId", autentifikacija, dobavljanjeDetaljaPoslaController);
router.patch("/:posaoId", autentifikacija, izmjenaPosla);
router.delete("/:posaoId", autentifikacija, brisanjePosla);

export default router;