import type { Request, Response } from "express";
import { fail } from "../utils/envelope";

export function notFound(req: Request, res: Response) {
  res.status(404).json(fail(`Route not found ${req.method}`));
}
