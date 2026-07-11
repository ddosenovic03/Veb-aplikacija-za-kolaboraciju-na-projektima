import { Router } from 'express';
import { autentifikacija } from '../middlewares/authMiddleware';
import { 
    dodavanjePrilogaController, 
    dobavljanjePrilogaZaKomentarController,
    brisanjePrilogaController 
} from '../controllers/prilogController';

const router = Router();

router.post("/:komentarId", autentifikacija, dodavanjePrilogaController);
router.get("/:komentarId", autentifikacija, dobavljanjePrilogaZaKomentarController);
router.delete("/:prilogId", autentifikacija, brisanjePrilogaController);

export default router;