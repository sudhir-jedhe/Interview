import { Request, Response } from "express";
import {
  getRecommendations,
  getStructuredRecommendations,
} from "../services/langchain.service";

export async function recommendedMovies(req: Request, res: Response) {
  try {
    const {
      userPrompt = "Suggest movies for a rainy night",
      genre = "thriller",
      mood = "relaxed",
      count = 2,
    } = req.body;

    const result = await getStructuredRecommendations({
      userPrompt,
      genre,
      mood,
      count: Number(count),
    });

    res.json(result);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Something goes wrong" });
  }
}
