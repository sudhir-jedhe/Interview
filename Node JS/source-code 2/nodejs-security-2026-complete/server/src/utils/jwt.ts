import jwt from "jsonwebtoken";
import crypto from "node:crypto";

export function createAccessToken(userId: string, role: string) {
  return jwt.sign(
    {
      userId,
      role,
      type: "access",
    },
    process.env.ACCESS_TOKEN_SECRET || "access_secret",
    {
      expiresIn: "15m",
    },
  );
}

export function createRefreshToken(userId: string, role: string) {
  return jwt.sign(
    {
      userId,
      role,
      type: "refresh",
    },
    process.env.REFRESH_TOKEN_SECRET || "refresh_secret",
    {
      expiresIn: "7d",
    },
  );
}

export function createCsrfToken() {
  return crypto.randomBytes(32).toString("hex");
}
