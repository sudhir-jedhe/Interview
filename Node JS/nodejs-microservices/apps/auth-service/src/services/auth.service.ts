import { AppError, signToken } from "shared";
import { createUser, findByEmail, findById } from "../repositories/user.repo";
import { LoginInput, RegisterInput } from "../schemas/auth.schemas";
import bcrypt from "bcryptjs";
import { convertToPublicUser } from "../utils/auth.utils";

export async function register(input: RegisterInput) {
  const existing = await findByEmail(input.email);

  if (existing) {
    throw new AppError(409, "Email already registered");
  }

  const passwordHash = await bcrypt.hash(input.password, 10);
  const user = await createUser({
    name: input.name,
    email: input.email,
    passwordHash,
    role: "USER",
  });

  return convertToPublicUser(user);
}

export async function login(input: LoginInput) {
  const user = await findByEmail(input.email);

  if (!user) {
    throw new AppError(401, "Invalid email or password");
  }

  const valid = await bcrypt.compare(input.password, user.password_hash);

  if (!valid) {
    throw new AppError(401, "Invalid email or password");
  }

  const token = signToken({ userId: user.id, role: user.role });

  return {
    token,
    user: convertToPublicUser(user),
  };
}

export async function getMe(userId: string) {
  const user = await findById(userId);

  if (!user) {
    throw new AppError(404, "User not found");
  }

  return convertToPublicUser(user);
}
