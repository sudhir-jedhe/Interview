import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import * as schema from "./schema";

type Db = ReturnType<typeof drizzle<typeof schema>>;

declare global {
  // Reused across hot reloads in dev so we don't leak a pool per rebuild.
  var __hireloopDb: { client: postgres.Sql; db: Db } | undefined;
}

function connect(): Db {
  if (globalThis.__hireloopDb) return globalThis.__hireloopDb.db;

  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error(
      "DATABASE_URL is not set. Copy .env.example to .env.local and add your Neon connection string.",
    );
  }

  const client = postgres(url, {
    max: process.env.NODE_ENV === "production" ? 5 : 2,
    idle_timeout: 20,
    connect_timeout: 15,
    prepare: false, // Neon's pooled endpoint doesn't support prepared statements.
  });

  const db = drizzle(client, { schema, casing: "snake_case" });
  globalThis.__hireloopDb = { client, db };
  return db;
}

/**
 * Lazy proxy so importing this module never opens a connection. Modules that
 * only need types (or run at build time without a DB) stay safe.
 */
export const db = new Proxy({} as Db, {
  get(_target, prop) {
    const real = connect() as unknown as Record<string | symbol, unknown>;
    const value = real[prop];
    return typeof value === "function" ? value.bind(real) : value;
  },
});

export { schema };
export const isDatabaseConfigured = () => Boolean(process.env.DATABASE_URL);
