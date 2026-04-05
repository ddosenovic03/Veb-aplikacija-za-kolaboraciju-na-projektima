import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT || 3333);

app.use(cors());
app.use(express.json());

app.get("/", (_req, res) => {
  res.send("Pozdrav!");
});

app.listen(PORT, "127.0.0.1", () => {
  console.log(`Server pokrenut na http://localhost:${PORT}`);
});