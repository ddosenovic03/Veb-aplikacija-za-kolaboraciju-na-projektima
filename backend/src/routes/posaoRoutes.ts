import { Router } from "express";
import { autentifikacija } from "../middlewares/authMiddleware";
import { prijaviSeNaPosao, azurirajProcenat } from "../controllers/posaoController";

const router = Router();

router.post("/:posaoId/prijava", autentifikacija, prijaviSeNaPosao);
router.patch("/:posaoId/procenat", autentifikacija, azurirajProcenat);

export default router;