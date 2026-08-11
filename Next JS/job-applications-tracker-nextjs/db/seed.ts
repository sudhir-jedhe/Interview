import "dotenv/config";

import { randomUUID } from "node:crypto";

import { hashPassword } from "better-auth/crypto";
import { eq, inArray } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import { buildSampleApplications } from "../lib/sample-data";
import { account, applicationStatusHistory, applications, user } from "./schema";
import * as schema from "./schema";

/**
 * The one account that ships with sample data — everyone else who signs in
 * with Google/GitHub starts with an empty tracker. Uses the same
 * NEXT_PUBLIC_DEMO_EMAIL/PASSWORD the "Try the demo" button on /login signs
 * in with, so re-running this script is what keeps that button working.
 */
async function ensureDemoUser(
  db: ReturnType<typeof drizzle<typeof schema>>,
): Promise<string> {
  const email = process.env.NEXT_PUBLIC_DEMO_EMAIL;
  const password = process.env.NEXT_PUBLIC_DEMO_PASSWORD;
  if (!email || !password) {
    console.error(
      "NEXT_PUBLIC_DEMO_EMAIL and NEXT_PUBLIC_DEMO_PASSWORD must be set to seed the demo account.",
    );
    process.exit(1);
  }

  const [existing] = await db
    .select({ id: user.id })
    .from(user)
    .where(eq(user.email, email))
    .limit(1);

  if (existing) return existing.id;

  const id = randomUUID();
  await db.insert(user).values({
    id,
    name: "Demo User",
    email,
    emailVerified: true,
  });
  await db.insert(account).values({
    id: randomUUID(),
    userId: id,
    providerId: "credential",
    accountId: id,
    password: await hashPassword(password),
  });

  return id;
}

async function main() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    console.error("DATABASE_URL is not set. Add it to .env.local first.");
    process.exit(1);
  }

  const client = postgres(url, { max: 1, prepare: false });
  const db = drizzle(client, { schema, casing: "snake_case" });

  console.log("Ensuring demo user…");
  const demoUserId = await ensureDemoUser(db);

  console.log("Clearing the demo user's existing data…");
  await db
    .delete(applicationStatusHistory)
    .where(
      inArray(
        applicationStatusHistory.applicationId,
        db
          .select({ id: applications.id })
          .from(applications)
          .where(eq(applications.userId, demoUserId)),
      ),
    );
  await db.delete(applications).where(eq(applications.userId, demoUserId));

  const { rows, history } = buildSampleApplications();

  console.log(`Inserting ${rows.length} applications…`);
  const inserted = await db
    .insert(applications)
    .values(rows.map((row) => ({ ...row, userId: demoUserId })))
    .returning({ id: applications.id });

  const historyRows = inserted.flatMap((row, index) =>
    history[index].map((entry) => ({ ...entry, applicationId: row.id })),
  );

  console.log(`Inserting ${historyRows.length} status history entries…`);
  await db.insert(applicationStatusHistory).values(historyRows);

  console.log("Seed complete.");
  await client.end();
}

main().catch((error) => {
  console.error("Seed failed:", error);
  process.exit(1);
});
