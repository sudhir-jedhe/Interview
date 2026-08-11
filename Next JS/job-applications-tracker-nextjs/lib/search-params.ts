import {
  APPLICATION_STATUSES,
  type ApplicationStatus,
  EMPLOYMENT_TYPES,
  type EmploymentType,
  JOB_SOURCES,
  type JobSource,
  PRIORITIES,
  type Priority,
  WORK_MODES,
  type WorkMode,
} from "@/constants";
import type { ApplicationQuery, ApplicationSortKey, SortDirection } from "@/types";

export type RawSearchParams = Record<string, string | string[] | undefined>;

function list(value: string | string[] | undefined): string[] {
  if (!value) return [];
  const parts = Array.isArray(value) ? value : value.split(",");
  return parts.map((v) => v.trim()).filter(Boolean);
}

/** Keeps only values that are members of the given enum. */
function only<T extends string>(values: string[], allowed: readonly T[]): T[] {
  return values.filter((v): v is T => (allowed as readonly string[]).includes(v));
}

function num(value: string | string[] | undefined): number | undefined {
  const raw = Array.isArray(value) ? value[0] : value;
  if (!raw) return undefined;
  const parsed = Number(raw);
  return Number.isFinite(parsed) ? parsed : undefined;
}

function date(value: string | string[] | undefined): Date | undefined {
  const raw = Array.isArray(value) ? value[0] : value;
  if (!raw) return undefined;
  const parsed = new Date(raw);
  return Number.isNaN(parsed.getTime()) ? undefined : parsed;
}

function str(value: string | string[] | undefined): string | undefined {
  const raw = Array.isArray(value) ? value[0] : value;
  return raw?.trim() || undefined;
}

const SORT_KEYS: ApplicationSortKey[] = [
  "companyName",
  "jobTitle",
  "dateApplied",
  "interviewDate",
  "expectedSalary",
  "status",
  "priority",
  "createdAt",
];

/**
 * The URL is the single source of truth for the list view — filters, sort and
 * page all round-trip through it, so any view is linkable and shareable.
 * Unknown or malformed values are dropped rather than throwing.
 */
export function parseSearchParams(params: RawSearchParams): ApplicationQuery {
  const sortRaw = str(params.sort) as ApplicationSortKey | undefined;
  const dirRaw = str(params.dir);

  const to = date(params.to);
  // A bare `to=2026-01-31` parses to midnight; extend it so the whole day is
  // included, which is what a user picking a range expects.
  if (to) to.setHours(23, 59, 59, 999);

  return {
    query: str(params.q),
    status: only(list(params.status), APPLICATION_STATUSES) as ApplicationStatus[],
    company: list(params.company),
    workMode: only(list(params.workMode), WORK_MODES) as WorkMode[],
    employmentType: only(
      list(params.employmentType),
      EMPLOYMENT_TYPES,
    ) as EmploymentType[],
    jobSource: only(list(params.jobSource), JOB_SOURCES) as JobSource[],
    priority: only(list(params.priority), PRIORITIES) as Priority[],
    favorite: str(params.favorite) === "true",
    from: date(params.from),
    to,
    minSalary: num(params.minSalary),
    maxSalary: num(params.maxSalary),
    page: Math.max(1, num(params.page) ?? 1),
    pageSize: Math.min(200, Math.max(1, num(params.pageSize) ?? 25)),
    sort: sortRaw && SORT_KEYS.includes(sortRaw) ? sortRaw : "dateApplied",
    direction: (dirRaw === "asc" ? "asc" : "desc") as SortDirection,
  };
}

/** Number of filters in play — drives the "clear filters" affordance. */
export function countActiveFilters(query: ApplicationQuery): number {
  let count = 0;
  if (query.query) count++;
  if (query.status?.length) count++;
  if (query.company?.length) count++;
  if (query.workMode?.length) count++;
  if (query.employmentType?.length) count++;
  if (query.jobSource?.length) count++;
  if (query.priority?.length) count++;
  if (query.favorite) count++;
  if (query.from || query.to) count++;
  if (query.minSalary !== undefined || query.maxSalary !== undefined) count++;
  return count;
}
