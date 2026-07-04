import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { db } from "./config/db";
import { autentifikacija } from "./middlewares/authMiddleware";

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

app.get("/", (_req, res) => {
  res.send("Pozdrav!");
});
app.get("/api/zasticeni", autentifikacija, (req, res) => {
  res.json({ poruka: "Pristup dozvoljen!", korisnik: req.korisnik });
}); 

app.use("/api/korisnici", korisnikRoutes);
app.use("/api/projekti", projekatRoutes);
app.use("/api/poslovi", posaoRoutes);
app.use("/api/komentari", komentarRoutes);
app.use("/api/prilozi", prilogRoutes);
app.use("/api/dashboard", dashboardRoutes);

app.listen(PORT, "127.0.0.1", () => {
  console.log(`Server pokrenut na http://localhost:${PORT}`);
});