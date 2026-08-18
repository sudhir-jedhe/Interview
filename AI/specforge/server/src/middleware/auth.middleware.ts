import { NextFunction, Request, Response } from "express";
import { verifyAuthToken } from "../lib/jwt.js";

declare module "express-serve-static-core" {
  interface Request {
    auth?: {
      userId: string;
      email: string;
    };
  }
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const token = req.cookies?.token;

  if (!token || typeof token !== "string") {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  try {
    const payload = verifyAuthToken(token);
    req.auth = {
      userId: payload.userId,
      email: payload.email,
    };
    next();
  } catch {
    res.status(401).json({ error: "Unauthorized" });
  }
}
