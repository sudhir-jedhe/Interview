import type { Request, Response, NextFunction } from "express";
import * as authservice from "../services/auth.service";
import { AppError, successResponse } from "shared";

export async function register(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const user = await authservice.register(req.body);
    successResponse(res, { user }, 201);
  } catch (error) {
    next(error);
  }
}

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await authservice.login(req.body);
    successResponse(res, result);
  } catch (error) {
    next(error);
  }
}

export async function getMe(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.header("x-user-id");
    if (!userId) {
      throw new AppError(401, "Missing x-user-id header");
    }

    const user = await authservice.getMe(userId);
    successResponse(res, { user });
  } catch (error) {
    next(error);
  }
}
