import "server-only";

import {
  and,
  asc,
  count,
  desc,
  eq,
  gte,
  ilike,
  inArray,
  isNotNull,
  lte,
  or,
  type SQL,
  sql,
} from "drizzle-orm";

import { db } from "@/db";
import { applicationStatusHistory, applications } from "@/db/schema";
import { toApplication, toApplications } from "@/lib/mappers";
import { getCurrentUserId } from "@/lib/session";
import type {
  Application,
  ApplicationQuery,
  ApplicationWithHistory,
  CalendarEvent,
  Paginated,
} from "@/types";

const SORT_COLUMNS = {
  companyName: applications.companyName,
  jobTitle: applications.jobTitle,
  dateApplied: applications.dateApplied,
  interviewDate: applications.interviewDate,
  expectedSalary: applications.expectedSalary,
  status: applications.status,
  priority: applications.priority,
  createdAt: applications.createdAt,
} as const;

/** Builds the shared WHERE clause used by both the page read and its count. */
function buildFilters(query: ApplicationQuery, userId: string): SQL {
  const clauses: (SQL | undefined)[] = [eq(applications.userId, userId)];

  if (query.query?.trim()) {
    const term = `%${query.query.trim()}%`;
    clauses.push(
      or(
        ilike(applications.companyName, term),
        ilike(applications.jobTitle, term),
        ilike(applications.jobDescription, term),
        ilike(applications.notes, term),
        ilike(applications.location, term),
        // array_to_string lets a single ILIKE cover every skill tag.
        sql`array_to_string(${applications.skillsAppliedFor}, ' ') ILIKE ${term}`,
      ),
    );
  }

  if (query.status?.length) clauses.push(inArray(applications.status, query.status));
  if (query.company?.length)
    clauses.push(inArray(applications.companyName, query.company));
  if (query.workMode?.length)
    clauses.push(inArray(applications.workMode, query.workMode));
  if (query.employmentType?.length)
    clauses.push(inArray(applications.employmentType, query.employmentType));
  if (query.jobSource?.length)
    clauses.push(inArray(applications.jobSource, query.jobSource));
  if (query.priority?.length)
    clauses.push(inArray(applications.priority, query.priority));
  if (query.favorite) clauses.push(eq(applications.favorite, true));
  if (query.from) clauses.push(gte(applications.dateApplied, query.from));
  if (query.to) clauses.push(lte(applications.dateApplied, query.to));
  if (query.minSalary !== undefined)
    clauses.push(gte(applications.expectedSalary, String(query.minSalary)));
  if (query.maxSalary !== undefined)
    clauses.push(lte(applications.expectedSalary, String(query.maxSalary)));

  return and(...(clauses.filter(Boolean) as SQL[]))!;
}

export async function getApplications(
  query: ApplicationQuery = {},
): Promise<Paginated<Application>> {
  const userId = await getCurrentUserId();
  const page = Math.max(1, query.page ?? 1);
  const pageSize = Math.min(200, Math.max(1, query.pageSize ?? 25));
  const where = buildFilters(query, userId);

  const sortColumn = SORT_COLUMNS[query.sort ?? "dateApplied"];
  const direction = query.direction === "asc" ? asc : desc;

  const [items, [totals]] = await Promise.all([
    db
      .select()
      .from(applications)
      .where(where)
      // Secondary key keeps pagination stable when the sort column ties.
      .orderBy(direction(sortColumn), desc(applications.createdAt))
      .limit(pageSize)
      .offset((page - 1) * pageSize),
    db.select({ value: count() }).from(applications).where(where),
  ]);

  const total = totals?.value ?? 0;

  return {
    items: toApplications(items),
    total,
    page,
    pageSize,
    pageCount: Math.max(1, Math.ceil(total / pageSize)),
  };
}

/** Unpaginated read for views that need the whole set (Kanban, calendar, export). */
export async function getAllApplications(
  query: ApplicationQuery = {},
): Promise<Application[]> {
  const userId = await getCurrentUserId();
  const rows = await db
    .select()
    .from(applications)
    .where(buildFilters(query, userId))
    .orderBy(desc(applications.dateApplied));
  return toApplications(rows);
}

/** Postgres rejects a malformed uuid at parse time, so screen it in JS first. */
const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function getApplicationById(
  id: string,
): Promise<ApplicationWithHistory | null> {
  // A junk id in the URL is a 404, not a 500.
  if (!UUID_RE.test(id)) return null;

  const userId = await getCurrentUserId();
  const [row] = await db
    .select()
    .from(applications)
    .where(and(eq(applications.id, id), eq(applications.userId, userId)))
    .limit(1);

  if (!row) return null;

  const history = await db
    .select()
    .from(applicationStatusHistory)
    .where(eq(applicationStatusHistory.applicationId, id))
    .orderBy(asc(applicationStatusHistory.changedAt));

  return { ...toApplication(row), statusHistory: history };
}

export async function getRecentApplications(limit = 6): Promise<Application[]> {
  const userId = await getCurrentUserId();
  const rows = await db
    .select()
    .from(applications)
    .where(eq(applications.userId, userId))
    .orderBy(desc(applications.createdAt))
    .limit(limit);
  return toApplications(rows);
}

export async function getUpcomingInterviews(limit = 5): Promise<Application[]> {
  const userId = await getCurrentUserId();
  const rows = await db
    .select()
    .from(applications)
    .where(
      and(
        eq(applications.userId, userId),
        isNotNull(applications.interviewDate),
        gte(applications.interviewDate, new Date()),
      ),
    )
    .orderBy(asc(applications.interviewDate))
    .limit(limit);
  return toApplications(rows);
}

/**
 * Interviews falling inside the next `days` days. Bounded in SQL so the
 * reminder banner is a pure render of what it's given — no clock reads during
 * rendering, which would make the component non-deterministic.
 */
export async function getInterviewsWithinDays(
  days = 7,
  limit = 10,
): Promise<Application[]> {
  const userId = await getCurrentUserId();
  const now = new Date();
  const until = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);

  const rows = await db
    .select()
    .from(applications)
    .where(
      and(
        eq(applications.userId, userId),
        isNotNull(applications.interviewDate),
        gte(applications.interviewDate, now),
        lte(applications.interviewDate, until),
      ),
    )
    .orderBy(asc(applications.interviewDate))
    .limit(limit);

  return toApplications(rows);
}

export async function getFavoriteApplications(limit = 6): Promise<Application[]> {
  const userId = await getCurrentUserId();
  const rows = await db
    .select()
    .from(applications)
    .where(and(eq(applications.userId, userId), eq(applications.favorite, true)))
    .orderBy(desc(applications.dateApplied))
    .limit(limit);
  return toApplications(rows);
}

/** Distinct company names, for the company filter's option list. */
export async function getCompanyNames(): Promise<string[]> {
  const userId = await getCurrentUserId();
  const rows = await db
    .selectDistinct({ name: applications.companyName })
    .from(applications)
    .where(eq(applications.userId, userId))
    .orderBy(asc(applications.companyName));
  return rows.map((r) => r.name);
}

export async function getApplicationsByIds(ids: string[]): Promise<Application[]> {
  if (!ids.length) return [];
  const userId = await getCurrentUserId();
  const rows = await db
    .select()
    .from(applications)
    .where(and(inArray(applications.id, ids), eq(applications.userId, userId)));
  return toApplications(rows);
}

/** Applied + interview dates within a month window, flattened for the calendar. */
export async function getCalendarEvents(
  from: Date,
  to: Date,
): Promise<CalendarEvent[]> {
  const userId = await getCurrentUserId();
  const rows = await db
    .select({
      id: applications.id,
      companyName: applications.companyName,
      jobTitle: applications.jobTitle,
      status: applications.status,
      dateApplied: applications.dateApplied,
      interviewDate: applications.interviewDate,
    })
    .from(applications)
    .where(
      and(
        eq(applications.userId, userId),
        or(
          and(
            gte(applications.dateApplied, from),
            lte(applications.dateApplied, to),
          ),
          and(
            gte(applications.interviewDate, from),
            lte(applications.interviewDate, to),
          ),
        ),
      ),
    );

  const events: CalendarEvent[] = [];
  for (const row of rows) {
    const base = {
      applicationId: row.id,
      companyName: row.companyName,
      jobTitle: row.jobTitle,
      status: row.status,
    };
    if (row.dateApplied >= from && row.dateApplied <= to) {
      events.push({
        ...base,
        id: `${row.id}:applied`,
        type: "applied",
        date: row.dateApplied,
      });
    }
    if (row.interviewDate && row.interviewDate >= from && row.interviewDate <= to) {
      events.push({
        ...base,
        id: `${row.id}:interview`,
        type: "interview",
        date: row.interviewDate,
      });
    }
  }

  return events.sort((a, b) => a.date.getTime() - b.date.getTime());
}

export async function getApplicationCount(): Promise<number> {
  const userId = await getCurrentUserId();
  const [row] = await db
    .select({ value: count() })
    .from(applications)
    .where(eq(applications.userId, userId));
  return row?.value ?? 0;
}
