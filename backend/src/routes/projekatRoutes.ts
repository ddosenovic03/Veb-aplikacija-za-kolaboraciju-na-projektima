import { Router } from 'express';
import { autentifikacija } from '../middlewares/authMiddleware';
import { 
    kreiranjeProjekta,
    pozivanjeKorisnika,
    prihvatanjePoziva,
    odbijanjePoziva 

} from '../controllers/projekatController';

const router = Router();

router.post("/", autentifikacija, kreiranjeProjekta);
router.post("/:projekatId/pozovi", autentifikacija, pozivanjeKorisnika);
router.patch("/:projekatId/prihvati", autentifikacija, prihvatanjePoziva);
router.patch("/:projekatId/odbij", autentifikacija, odbijanjePoziva);

export default router;