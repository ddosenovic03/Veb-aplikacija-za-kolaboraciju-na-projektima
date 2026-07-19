import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { 
    notFoundHandler, 
    globalErrorHandler 
} from "./middlewares/errorMiddleware";

import korisnikRoutes from "./routes/korisnikRoutes";
import projekatRoutes from "./routes/projekatRoutes";
import posaoRoutes from "./routes/posaoRoutes";
import komentarRoutes from "./routes/komentarRoutes";
import prilogRoutes from "./routes/prilogRoutes";
import dashboardRoutes from "./routes/dashboardRoutes";

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT || 3333);

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

app.use("/api/korisnici", korisnikRoutes);
app.use("/api/projekti", projekatRoutes);
app.use("/api/poslovi", posaoRoutes);
app.use("/api/komentari", komentarRoutes);
app.use("/api/prilozi", prilogRoutes);
app.use("/api/dashboard", dashboardRoutes);

app.use(notFoundHandler);
app.use(globalErrorHandler);

app.listen(PORT, () => {
  console.log(`Server pokrenut na portu ${PORT}`);
});