import { type Request } from "express";

export type AuthTokenPayload = {
  userId: string;
  role: string;
  type: "access" | "refresh";
};

export type AuthenticatedRequest = Request & {
  authUser?: {
    userId: string;
    role: String;
  };
};
