import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(1, "name is required"),
  email: z.string().email("valid email is needed"),
  password: z.string().min(6, "password is required"),
});

export const loginSchema = z.object({
  email: z.string().email("valid email is needed"),
  password: z.string().min(6, "password is required"),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
