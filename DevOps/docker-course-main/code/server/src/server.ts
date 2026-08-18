import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import productRouter from "./routes/productRoutes.js";

dotenv.config();

const app = express();
const port = Number(process.env.PORT) || 5000;
const mongoUri = process.env.MONGODB_URI || "";

app.use(cors());
app.use(express.json());

app.get("/", (_req: Request, res: Response) => {
  res.send("MERN demo backend is running");
});

app.get("/api/health", (_req: Request, res: Response) => {
  res.json({
    ok: true,
    message: "Server is healthy",
  });
});

app.use("/api/products", productRouter);

const startServer = async () => {
  try {
    if (!mongoUri) {
      throw new Error("MONGODB_URI is missing in .env");
    }

    await mongoose.connect(mongoUri);

    app.listen(port, () => {
      console.log(`Server running on http://localhost:${port}`);
    });
  } catch (error) {
    console.error("Failed to start server");
    console.error(error);
    process.exit(1);
  }
};

startServer();
