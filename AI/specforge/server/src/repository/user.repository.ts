import { pool } from "../db/pool.js";

export type User = {
  id: string;
  googleId: string;
  email: string;
  name: string;
  avatarUrl: string | null;
  createdAt: Date;
};

type UserRow = {
  id: string;
  google_id: string;
  email: string;
  name: string;
  avatar_url: string | null;
  created_at: Date;
};

function mapUserRow(row: UserRow): User {
  return {
    id: row.id,
    googleId: row.google_id,
    email: row.email,
    name: row.name,
    avatarUrl: row.avatar_url,
    createdAt: row.created_at,
  };
}

export async function findUserByGoogleId(
  googleId: string,
): Promise<User | null> {
  const result = await pool.query<UserRow>(
    `SELECT id, google_id, email, name, avatar_url, created_at
     FROM users
     WHERE google_id = $1`,
    [googleId],
  );

  const row = result.rows[0];
  return row ? mapUserRow(row) : null;
}

export async function findUserById(userId: string): Promise<User | null> {
  const result = await pool.query<UserRow>(
    `SELECT id, google_id, email, name, avatar_url, created_at
     FROM users
     WHERE id = $1`,
    [userId],
  );

  const row = result.rows[0];
  return row ? mapUserRow(row) : null;
}

export async function findOrCreateGoogleUser(input: {
  googleId: string;
  email: string;
  name: string;
  avatarUrl?: string;
}): Promise<User> {
  const existing = await findUserByGoogleId(input.googleId);
  if (existing) {
    return existing;
  }

  const result = await pool.query<UserRow>(
    `INSERT INTO users (google_id, email, name, avatar_url)
     VALUES ($1, $2, $3, $4)
     RETURNING id, google_id, email, name, avatar_url, created_at`,
    [input.googleId, input.email, input.name, input.avatarUrl ?? null],
  );

  const row = result.rows[0];
  if (!row) {
    throw new Error("Failed to create user");
  }

  return mapUserRow(row);
}
