"use server";

import { and, desc, eq, ilike, or, sql } from "drizzle-orm";

import { db } from "@/db";
import { applications } from "@/db/schema";
import { toApplications } from "@/lib/mappers";
import { getCurrentUserId } from "@/lib/session";
import type { Application } from "@/types";

/**
 * Global search across company, title, skills, description and notes.
 * Backs the ⌘K palette, so it stays deliberately small and fast.
 */
export async function searchApplications(
  term: string,
  limit = 8,
): Promise<Application[]> {
  const trimmed = term.trim();
  if (trimmed.length < 2) return [];

  const pattern = `%${trimmed}%`;

  try {
    const userId = await getCurrentUserId();
    const rows = await db
      .select()
      .from(applications)
      .where(
        and(
          eq(applications.userId, userId),
          or(
            ilike(applications.companyName, pattern),
            ilike(applications.jobTitle, pattern),
            ilike(applications.jobDescription, pattern),
            ilike(applications.notes, pattern),
            ilike(applications.location, pattern),
            sql`array_to_string(${applications.skillsAppliedFor}, ' ') ILIKE ${pattern}`,
          ),
        ),
      )
      // Rank exact-ish company/title hits above description and note matches.
      .orderBy(
        sql`case
          when ${applications.companyName} ILIKE ${`${trimmed}%`} then 0
          when ${applications.jobTitle} ILIKE ${`${trimmed}%`} then 1
          when ${applications.companyName} ILIKE ${pattern} then 2
          when ${applications.jobTitle} ILIKE ${pattern} then 3
          else 4
        end`,
        desc(applications.dateApplied),
      )
      .limit(limit);

    return toApplications(rows);
  } catch {
    // A failed search should quietly show "no results", not break the palette.
    return [];
  }
}
