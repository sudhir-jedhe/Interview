import "dotenv/config";
import express from "express";
import cors from "cors";
import { recommendRouter } from "./routes/recommended.routes";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/recommend", recommendRouter);

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`Backend is running on port, ${PORT}`);
});
