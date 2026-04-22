import { Router } from "express";
import { autentifikacija } from "../middlewares/authMiddleware";
import { prijaviSeNaPosao } from "../controllers/posaoController";

const router = Router();

router.post("/:posaoId/prijava", autentifikacija, prijaviSeNaPosao);

export default router;