export type UserRole = "USER" | "ADMIN";

export type JwtPayload = {
  userId: string;
  role: UserRole;
};
