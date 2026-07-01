import { Router } from 'express';
import { autentifikacija } from '../middlewares/authMiddleware';
import { dodavanjePrilogaController } from '../controllers/prilogController';

const router = Router();

router.post("/:komentarId", autentifikacija, dodavanjePrilogaController);

export default router;