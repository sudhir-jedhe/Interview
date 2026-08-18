import { Router } from "express";
import { recommendedMovies } from "../controllers/recommended.controller";

export const recommendRouter = Router();

recommendRouter.post("/", recommendedMovies);
