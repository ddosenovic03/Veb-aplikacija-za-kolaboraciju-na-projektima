import { Router } from 'express';
import { kreiranjeProjekta } from '../controllers/projekatController';
import { autentifikacija } from '../middlewares/authMiddleware';

const router = Router();

router.post("/", autentifikacija, kreiranjeProjekta);

export default router;