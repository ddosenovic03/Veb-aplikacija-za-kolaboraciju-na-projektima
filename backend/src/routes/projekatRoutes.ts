import { Router } from 'express';
import { autentifikacija } from '../middlewares/authMiddleware';
import { 
    kreiranjeProjektaController,
    pozivanjeKorisnikaNaProjekatController,
    prihvatanjePozivaNaProjekatController,
    odbijanjePozivaNaProjekatController,
    dobavljanjePoslovaZaProjekatController,
    dobavljanjeMojihProjekataController,
    dobavljanjeDetaljaProjektaController,
    dobavljanjePozivaKorisnikaNaProjekteController,
    dobavljanjeClanovaProjektaController,
    dobavljanjePozvanihKorisnikaNaProjekatController,
    dobavljanjeNapretkaProjektaController,
    izmjenaProjektaController,
    brisanjeProjektaController
} from '../controllers/projekatController';
import { kreiranjePoslaController } from '../controllers/posaoController';

const router = Router();

router.post("/", autentifikacija, kreiranjeProjektaController);
router.get("/moji", autentifikacija, dobavljanjeMojihProjekataController);
router.get("/pozivi", autentifikacija, dobavljanjePozivaKorisnikaNaProjekteController);

router.get("/:projekatId", autentifikacija, dobavljanjeDetaljaProjektaController);
router.post("/:projekatId/pozovi", autentifikacija, pozivanjeKorisnikaNaProjekatController);
router.patch("/:projekatId/prihvati", autentifikacija, prihvatanjePozivaNaProjekatController);
router.patch("/:projekatId/odbij", autentifikacija, odbijanjePozivaNaProjekatController);
router.get("/:projekatId/poslovi", autentifikacija, dobavljanjePoslovaZaProjekatController);
router.post("/:projekatId/poslovi", autentifikacija, kreiranjePoslaController);
router.get("/:projekatId/clanovi", autentifikacija, dobavljanjeClanovaProjektaController);
router.get("/:projekatId/pozivi", autentifikacija, dobavljanjePozvanihKorisnikaNaProjekatController);
router.get("/:projekatId/napredak", autentifikacija, dobavljanjeNapretkaProjektaController);
router.patch("/:projekatId", autentifikacija, izmjenaProjektaController);
router.delete("/:projekatId", autentifikacija, brisanjeProjektaController);

export default router;