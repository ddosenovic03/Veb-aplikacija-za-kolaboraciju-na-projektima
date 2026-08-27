import { Router } from 'express';
import { autentifikacija } from '../middlewares/authMiddleware';
import { 
    dodavanjePrilogaController,
    dodavanjeFajlPrilogaController, 
    dobavljanjePrilogaZaKomentarController,
    dobavljanjeFajlaPrilogaController,
    brisanjePrilogaController 
} from '../controllers/prilogController';
import { uploadPriloga } from '../config/uploadConfig';

const router = Router();

router.post("/:komentarId", autentifikacija, dodavanjePrilogaController);
router.post("/:komentarId/fajl", autentifikacija, uploadPriloga.single("fajl"), dodavanjeFajlPrilogaController);
router.get("/:prilogId/fajl", autentifikacija, dobavljanjeFajlaPrilogaController);
router.get("/:komentarId", autentifikacija, dobavljanjePrilogaZaKomentarController);
router.delete("/:prilogId", autentifikacija, brisanjePrilogaController);

export default router;