import { Router } from 'express';
import { autentifikacija } from '../middlewares/authMiddleware';
import { 
    kreiranjeProjekta,
    pozivanjeKorisnikaNaProjekatController,
    prihvatanjePozivaNaProjekatController,
    odbijanjePozivaNaProjekatController,
    kreiranjePosla,
    dobavljanjePoslovaZaProjekatController,
    dobavljanjeMojihProjekataController,
    dobavljanjeDetaljaProjektaController,
    dobavljanjePozivaKorisnikaNaProjekteController,
    dobavljanjeClanovaProjektaController,
    dobavljanjePozvanihKorisnikaNaProjekatController,
    dobavljanjeNapretkaProjektaController
} from '../controllers/projekatController';

const router = Router();

router.post("/", autentifikacija, kreiranjeProjekta);
router.get("/moji", autentifikacija, dobavljanjeMojihProjekataController);
router.get("/pozivi", autentifikacija, dobavljanjePozivaKorisnikaNaProjekteController);

router.get("/:projekatId", autentifikacija, dobavljanjeDetaljaProjektaController);
router.post("/:projekatId/pozovi", autentifikacija, pozivanjeKorisnikaNaProjekatController);
router.patch("/:projekatId/prihvati", autentifikacija, prihvatanjePozivaNaProjekatController);
router.patch("/:projekatId/odbij", autentifikacija, odbijanjePozivaNaProjekatController);
router.post("/:projekatId/poslovi", autentifikacija, kreiranjePosla);
router.get("/:projekatId/poslovi", autentifikacija, dobavljanjePoslovaZaProjekatController);
router.get("/:projekatId/clanovi", autentifikacija, dobavljanjeClanovaProjektaController);
router.get("/:projekatId/pozivi", autentifikacija, dobavljanjePozvanihKorisnikaNaProjekatController);
router.get("/:projekatId/napredak", autentifikacija, dobavljanjeNapretkaProjektaController);

export default router;