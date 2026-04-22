import { Router } from 'express';
import { kreiranjeProjekta } from '../controllers/projekatController';
import { autentifikacija } from '../middlewares/authMiddleware';
import { pozivanjeKorisnika } from '../controllers/projekatController';

const router = Router();

router.post("/", autentifikacija, kreiranjeProjekta);
router.post("/:projekatId/pozovi", autentifikacija, pozivanjeKorisnika);

export default router;