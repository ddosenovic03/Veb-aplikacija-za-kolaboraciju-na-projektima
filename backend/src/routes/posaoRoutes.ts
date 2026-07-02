import { Router } from "express";
import { autentifikacija } from "../middlewares/authMiddleware";
import { 
    prijavaNaPosaoController, 
    azuriranjeProcentaPoslaController, 
    dobavljanjeDetaljaPoslaController,
    dobavljanjeMojihPoslovaController,
    dobavljanjeKreiranihPoslovaController 
} from "../controllers/posaoController";

const router = Router();

router.get("/moji", autentifikacija, dobavljanjeMojihPoslovaController);
router.get("/kreirani", autentifikacija, dobavljanjeKreiranihPoslovaController);

router.post("/:posaoId/prijava", autentifikacija, prijavaNaPosaoController);
router.patch("/:posaoId/procenat", autentifikacija, azuriranjeProcentaPoslaController);
router.get("/:posaoId", autentifikacija, dobavljanjeDetaljaPoslaController);

export default router;