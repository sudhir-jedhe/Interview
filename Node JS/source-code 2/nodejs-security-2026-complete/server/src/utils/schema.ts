import z from "zod";

export const registerSchema = z
  .object({
    name: z.string().trim().min(2).max(50),
    email: z.string().trim().toLowerCase().email().max(100),
    password: z.string().min(6).max(100),
  })
  .strict();

export const loginSchema = z
  .object({
    email: z.string().trim().toLowerCase().email().max(100),
    password: z.string().min(1).max(100),
  })
  .strict();

export const userIdParamsSchema = z
  .object({
    id: z.string().regex(/^[a-f\d]{24}$/i, "Invalid user id"),
  })
  .strict();

export const listUsersQuerySchema = z
  .object({
    role: z.enum(["user", "admin"]).optional(),
    email: z.string().trim().toLowerCase().email().optional(),
    name: z.string().trim().min(2).max(50).optional(),
  })
  .strict();
