import { Router } from 'express';
import { autentifikacija } from '../middlewares/authMiddleware';
import { dodavanjePrilogaController, dobavljanjePrilogaZaKomentarController } from '../controllers/prilogController';

const router = Router();

router.post("/:komentarId", autentifikacija, dodavanjePrilogaController);
router.get("/:komentarId", autentifikacija, dobavljanjePrilogaZaKomentarController);

export default router;