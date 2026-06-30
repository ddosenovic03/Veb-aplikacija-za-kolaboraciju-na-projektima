import { Router } from 'express';
import { autentifikacija } from '../middlewares/authMiddleware';
import { 
    kreiranjeProjekta,
    pozivanjeKorisnika,
    prihvatanjePoziva,
    odbijanjePoziva,
    kreiranjePosla,
    prikazPoslovaZaProjekat,
    prikazMojihProjekata
} from '../controllers/projekatController';

const router = Router();

router.post("/", autentifikacija, kreiranjeProjekta);
router.get("/moji", autentifikacija, prikazMojihProjekata);
router.post("/:projekatId/pozovi", autentifikacija, pozivanjeKorisnika);
router.patch("/:projekatId/prihvati", autentifikacija, prihvatanjePoziva);
router.patch("/:projekatId/odbij", autentifikacija, odbijanjePoziva);
router.post("/:projekatId/poslovi", autentifikacija, kreiranjePosla);
router.get("/:projekatId/poslovi", autentifikacija, prikazPoslovaZaProjekat);

export default router;