import { Router } from "express";
import { autentifikacija } from "../middlewares/authMiddleware";
import { dodavanjeKomentara } from "../controllers/komentarController";

const router = Router();

router.post("/:posaoId", autentifikacija, dodavanjeKomentara);

export default router;