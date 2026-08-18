import { type NextFunction, type Request, type Response } from "express";
import z from "zod";

export function validateBody<T extends z.ZodTypeAny>(schema: T) {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        message: "Invalid request body",
        errors: result.error.issues.map((issue) => issue.message),
      });
    }

    req.body = result.data;
    next();
  };
}

export async function registerFailedLoginAttemp(user: {
  loginAttempts: number;
  lockUntil?: Date | null;
  save: () => Promise<unknown>;
}) {
  const nextAttemps = user.loginAttempts + 1;
  const LOGIN_MAX = 5;
  const LOGIN_LOCK_UNTIL = 15 * 60 * 1000;

  if (nextAttemps >= LOGIN_MAX) {
    user.loginAttempts = 0;
    user.lockUntil = new Date(Date.now() + LOGIN_LOCK_UNTIL);
  } else {
    user.loginAttempts = nextAttemps;
  }

  await user.save();
}

export async function clearFailedLoginAttempts(user: {
  loginAttempts: number;
  lockUntil?: Date | null;
  save: () => Promise<unknown>;
}) {
  if (user.loginAttempts === 0 && !user.lockUntil) {
    return;
  }

  user.loginAttempts = 0;
  user.lockUntil = null;
  await user.save();
}

export function isAccLocked(user: { lockUntil?: Date | null }) {
  return Boolean(user.lockUntil && user.lockUntil.getTime() > Date.now());
}
