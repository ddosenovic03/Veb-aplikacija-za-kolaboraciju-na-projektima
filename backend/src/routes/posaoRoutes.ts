import { Router } from "express";
import { autentifikacija } from "../middlewares/authMiddleware";
import { prijavaNaPosaoController, azuriranjeProcentaPoslaController, prikazDetaljaPoslaController } from "../controllers/posaoController";

const router = Router();

router.post("/:posaoId/prijava", autentifikacija, prijavaNaPosaoController);
router.patch("/:posaoId/procenat", autentifikacija, azuriranjeProcentaPoslaController);
router.get("/:posaoId", autentifikacija, prikazDetaljaPoslaController);

export default router;