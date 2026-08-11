"use server";

import { and, eq, inArray, ne, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";

import { db } from "@/db";
import { applicationStatusHistory, applications } from "@/db/schema";
import type { NewApplicationRow } from "@/db/schema";
import { toApplication } from "@/lib/mappers";
import { getCurrentUserId } from "@/lib/session";
import {
  type ApplicationValues,
  applicationSchema,
  bulkDeleteSchema,
  bulkStatusSchema,
  idSchema,
  statusChangeSchema,
  updateApplicationSchema,
} from "@/schemas/application";
import type { ActionResult, Application } from "@/types";

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

/** Every page that renders application data. Kept in one place so a mutation
 *  can't accidentally leave a stale view behind. */
const AFFECTED_PATHS = [
  "/dashboard",
  "/applications",
  "/board",
  "/analytics",
  "/calendar",
] as const;

function revalidateAll(id?: string) {
  for (const path of AFFECTED_PATHS) revalidatePath(path);
  if (id) revalidatePath(`/applications/${id}`);
}

function fail(error: string): ActionResult<never> {
  return { success: false, error };
}

function fromZodError(error: z.ZodError): ActionResult<never> {
  // Build the field map by hand: `flattenError`'s generic collapses to `{}`
  // for schemas carrying top-level refinements, which most of ours do.
  const fieldErrors: Record<string, string[]> = {};
  const formErrors: string[] = [];

  for (const issue of error.issues) {
    const key = issue.path.map(String).join(".");
    if (!key) {
      formErrors.push(issue.message);
      continue;
    }
    (fieldErrors[key] ??= []).push(issue.message);
  }

  return {
    success: false,
    error:
      formErrors[0] ??
      Object.values(fieldErrors)[0]?.[0] ??
      "Please check the highlighted fields",
    fieldErrors,
  };
}

/** Maps validated form values onto the DB row shape. */
function toRow(values: ApplicationValues, userId: string): NewApplicationRow {
  return {
    userId,
    companyName: values.companyName,
    jobTitle: values.jobTitle,
    jobDescription: values.jobDescription ?? null,
    applicationLink: values.applicationLink ?? null,
    skillsAppliedFor: values.skillsAppliedFor ?? [],
    currentSalary:
      values.currentSalary !== undefined ? String(values.currentSalary) : null,
    expectedSalary:
      values.expectedSalary !== undefined
        ? String(values.expectedSalary)
        : null,
    currency: values.currency,
    employmentType: values.employmentType,
    location: values.location ?? null,
    workMode: values.workMode,
    dateApplied: values.dateApplied ?? new Date(),
    interviewDate: values.interviewDate ?? null,
    status: values.status,
    priority: values.priority,
    favorite: values.favorite,
    notes: values.notes ?? null,
    contactPerson: values.contactPerson ?? null,
    contactEmail: values.contactEmail ?? null,
    contactPhone: values.contactPhone ?? null,
    jobSource: values.jobSource,
    jobSourceOther:
      values.jobSource === "other" ? (values.jobSourceOther ?? null) : null,
    resumeVersion: values.resumeVersion ?? null,
    coverLetterUsed: values.coverLetterUsed,
  };
}

function describe(error: unknown, fallback: string) {
  if (process.env.NODE_ENV !== "production") console.error(fallback, error);
  return fallback;
}

/* ------------------------------------------------------------------ */
/* Create / update / delete                                            */
/* ------------------------------------------------------------------ */

export async function createApplication(
  input: unknown,
): Promise<ActionResult<Application>> {
  const parsed = applicationSchema.safeParse(input);
  if (!parsed.success) return fromZodError(parsed.error);

  try {
    const userId = await getCurrentUserId();
    const created = await db.transaction(async (tx) => {
      const [row] = await tx
        .insert(applications)
        .values(toRow(parsed.data, userId))
        .returning();

      // Seed the timeline so every application has a visible origin point.
      await tx.insert(applicationStatusHistory).values({
        applicationId: row.id,
        oldStatus: null,
        newStatus: row.status,
        note: "Application created",
        changedAt: row.createdAt,
      });

      return row;
    });

    revalidateAll(created.id);
    return { success: true, data: toApplication(created) };
  } catch (error) {
    return fail(describe(error, "Could not save the application"));
  }
}

export async function updateApplication(
  id: string,
  input: unknown,
): Promise<ActionResult<Application>> {
  const parsed = updateApplicationSchema.safeParse({ id, values: input });
  if (!parsed.success) return fromZodError(parsed.error);

  try {
    const userId = await getCurrentUserId();
    const updated = await db.transaction(async (tx) => {
      const [existing] = await tx
        .select({ status: applications.status })
        .from(applications)
        .where(
          and(
            eq(applications.id, parsed.data.id),
            eq(applications.userId, userId),
          ),
        )
        .limit(1);

      if (!existing) return null;

      // Ownership never changes on update — drop it from the SET payload.
      const { userId: _userId, ...values } = toRow(parsed.data.values, userId);

      const [row] = await tx
        .update(applications)
        .set(values)
        .where(eq(applications.id, parsed.data.id))
        .returning();

      // Only record history when the status actually moved.
      if (existing.status !== row.status) {
        await tx.insert(applicationStatusHistory).values({
          applicationId: row.id,
          oldStatus: existing.status,
          newStatus: row.status,
        });
      }

      return row;
    });

    if (!updated) return fail("That application no longer exists");

    revalidateAll(updated.id);
    return { success: true, data: toApplication(updated) };
  } catch (error) {
    return fail(describe(error, "Could not update the application"));
  }
}

export async function deleteApplication(id: string): Promise<ActionResult> {
  const parsed = idSchema.safeParse(id);
  if (!parsed.success) return fail("Invalid application id");

  try {
    const userId = await getCurrentUserId();
    const [deleted] = await db
      .delete(applications)
      .where(
        and(eq(applications.id, parsed.data), eq(applications.userId, userId)),
      )
      .returning({ id: applications.id });

    if (!deleted) return fail("That application no longer exists");

    revalidateAll();
    return { success: true, data: undefined };
  } catch (error) {
    return fail(describe(error, "Could not delete the application"));
  }
}

/**
 * Copies an application as a fresh "applied" draft. The clone deliberately
 * resets the pipeline (status, interview date, favorite) — you're re-applying,
 * not duplicating history.
 */
export async function duplicateApplication(
  id: string,
): Promise<ActionResult<Application>> {
  const parsed = idSchema.safeParse(id);
  if (!parsed.success) return fail("Invalid application id");

  try {
    const userId = await getCurrentUserId();
    const created = await db.transaction(async (tx) => {
      const [source] = await tx
        .select()
        .from(applications)
        .where(
          and(
            eq(applications.id, parsed.data),
            eq(applications.userId, userId),
          ),
        )
        .limit(1);

      if (!source) return null;

      // Drop the identity/audit columns so the insert generates fresh ones.
      const {
        id: _id,
        createdAt: _createdAt,
        updatedAt: _updatedAt,
        ...rest
      } = source;

      const [row] = await tx
        .insert(applications)
        .values({
          ...rest,
          jobTitle: `${source.jobTitle} (Copy)`,
          status: "applied",
          interviewDate: null,
          favorite: false,
          dateApplied: new Date(),
        })
        .returning();

      await tx.insert(applicationStatusHistory).values({
        applicationId: row.id,
        oldStatus: null,
        newStatus: "applied",
        note: `Duplicated from ${source.companyName} — ${source.jobTitle}`,
      });

      return row;
    });

    if (!created) return fail("That application no longer exists");

    revalidateAll();
    return { success: true, data: toApplication(created) };
  } catch (error) {
    return fail(describe(error, "Could not duplicate the application"));
  }
}

/* ------------------------------------------------------------------ */
/* Status & flags                                                      */
/* ------------------------------------------------------------------ */

export async function changeStatus(
  id: string,
  status: unknown,
  note?: string,
  interviewDate?: unknown,
): Promise<ActionResult<Application>> {
  const parsed = statusChangeSchema.safeParse({
    id,
    status,
    note,
    interviewDate,
  });
  if (!parsed.success) return fromZodError(parsed.error);

  try {
    const userId = await getCurrentUserId();
    const updated = await db.transaction(async (tx) => {
      const [existing] = await tx
        .select({ status: applications.status })
        .from(applications)
        .where(
          and(
            eq(applications.id, parsed.data.id),
            eq(applications.userId, userId),
          ),
        )
        .limit(1);

      if (!existing) return null;
      if (
        existing.status === parsed.data.status &&
        parsed.data.interviewDate === undefined
      ) {
        const [unchanged] = await tx
          .select()
          .from(applications)
          .where(eq(applications.id, parsed.data.id))
          .limit(1);
        return unchanged;
      }

      const [row] = await tx
        .update(applications)
        .set({
          status: parsed.data.status,
          ...(parsed.data.interviewDate !== undefined && {
            interviewDate: parsed.data.interviewDate,
          }),
        })
        .where(eq(applications.id, parsed.data.id))
        .returning();

      await tx.insert(applicationStatusHistory).values({
        applicationId: row.id,
        oldStatus: existing.status,
        newStatus: parsed.data.status,
        note: parsed.data.note ?? null,
      });

      return row;
    });

    if (!updated) return fail("That application no longer exists");

    revalidateAll(updated.id);
    return { success: true, data: toApplication(updated) };
  } catch (error) {
    return fail(describe(error, "Could not update the status"));
  }
}

export async function toggleFavorite(
  id: string,
): Promise<ActionResult<{ favorite: boolean }>> {
  const parsed = idSchema.safeParse(id);
  if (!parsed.success) return fail("Invalid application id");

  try {
    const userId = await getCurrentUserId();
    // Flip in SQL so concurrent toggles can't read-then-write a stale value.
    const [row] = await db
      .update(applications)
      .set({ favorite: sql`not ${applications.favorite}` })
      .where(
        and(eq(applications.id, parsed.data), eq(applications.userId, userId)),
      )
      .returning({ favorite: applications.favorite });

    if (!row) return fail("That application no longer exists");

    revalidateAll(parsed.data);
    return { success: true, data: { favorite: row.favorite } };
  } catch (error) {
    return fail(describe(error, "Could not update the favorite"));
  }
}

/* ------------------------------------------------------------------ */
/* Bulk operations                                                     */
/* ------------------------------------------------------------------ */

export async function bulkDelete(ids: string[]): Promise<ActionResult<number>> {
  const parsed = bulkDeleteSchema.safeParse({ ids });
  if (!parsed.success) return fromZodError(parsed.error);

  try {
    const userId = await getCurrentUserId();
    const deleted = await db
      .delete(applications)
      .where(
        and(
          inArray(applications.id, parsed.data.ids),
          eq(applications.userId, userId),
        ),
      )
      .returning({ id: applications.id });

    revalidateAll();
    return { success: true, data: deleted.length };
  } catch (error) {
    return fail(describe(error, "Could not delete the selected applications"));
  }
}

export async function bulkUpdateStatus(
  ids: string[],
  status: unknown,
): Promise<ActionResult<number>> {
  const parsed = bulkStatusSchema.safeParse({ ids, status });
  if (!parsed.success) return fromZodError(parsed.error);

  try {
    const userId = await getCurrentUserId();
    const changed = await db.transaction(async (tx) => {
      // Read first so history captures the true `oldStatus` per row, and skip
      // rows already on the target status.
      const existing = await tx
        .select({ id: applications.id, status: applications.status })
        .from(applications)
        .where(
          and(
            inArray(applications.id, parsed.data.ids),
            eq(applications.userId, userId),
            ne(applications.status, parsed.data.status),
          ),
        );

      if (!existing.length) return 0;

      await tx
        .update(applications)
        .set({ status: parsed.data.status })
        .where(
          inArray(
            applications.id,
            existing.map((r) => r.id),
          ),
        );

      await tx.insert(applicationStatusHistory).values(
        existing.map((row) => ({
          applicationId: row.id,
          oldStatus: row.status,
          newStatus: parsed.data.status,
          note: "Bulk status update",
        })),
      );

      return existing.length;
    });

    revalidateAll();
    return { success: true, data: changed };
  } catch (error) {
    return fail(describe(error, "Could not update the selected applications"));
  }
}

/**
 * Re-inserts a deleted application, preserving its original id so any open link
 * keeps working. Backs the "Undo delete" toast.
 */
export async function restoreApplication(
  snapshot: unknown,
): Promise<ActionResult<Application>> {
  const envelope = z
    .object({ id: z.uuid(), createdAt: z.coerce.date().optional() })
    .safeParse(snapshot);
  const values = applicationSchema.safeParse(snapshot);
  if (!envelope.success || !values.success)
    return fail("Could not restore — the snapshot was invalid");

  try {
    const userId = await getCurrentUserId();
    const [row] = await db
      .insert(applications)
      .values({
        ...toRow(values.data, userId),
        id: envelope.data.id,
        createdAt: envelope.data.createdAt ?? new Date(),
      })
      .onConflictDoNothing()
      .returning();

    if (!row) return fail("That application already exists");

    await db.insert(applicationStatusHistory).values({
      applicationId: row.id,
      oldStatus: null,
      newStatus: row.status,
      note: "Restored after delete",
    });

    revalidateAll(row.id);
    return { success: true, data: toApplication(row) };
  } catch (error) {
    return fail(describe(error, "Could not restore the application"));
  }
}
