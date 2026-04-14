import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { db } from "./config/db";

import korisnikRoutes from "./routes/korisnikRoutes";

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT || 3333);

app.use(cors());
app.use(express.json());

app.get("/", (_req, res) => {
  res.send("Pozdrav!");
});

app.get("/api/test-db", async (_req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM Korisnik");
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Greška pri testiranju baze podataka" });
  }
});

app.listen(PORT, "127.0.0.1", () => {
  console.log(`Server pokrenut na http://localhost:${PORT}`);
});


app.use("/api/korisnici", korisnikRoutes);