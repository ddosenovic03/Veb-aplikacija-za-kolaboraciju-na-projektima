import { Router } from "express";
import { autentifikacija } from "../middlewares/authMiddleware";
import { dobavljanjeDashboardStatistikeController } from "../controllers/dashboardController";

const router = Router();

router.get("/", autentifikacija, dobavljanjeDashboardStatistikeController);

export default router;