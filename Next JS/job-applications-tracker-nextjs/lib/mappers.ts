import type { ApplicationRow } from "@/db/schema";
import type { Application } from "@/types";

/** `numeric` columns come back from postgres as strings; normalise once, here. */
function toNumber(value: string | null): number | null {
  if (value === null) return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

export function toApplication(row: ApplicationRow): Application {
  const { userId: _userId, ...rest } = row;
  return {
    ...rest,
    currentSalary: toNumber(row.currentSalary),
    expectedSalary: toNumber(row.expectedSalary),
    skillsAppliedFor: row.skillsAppliedFor ?? [],
  };
}

export function toApplications(rows: ApplicationRow[]): Application[] {
  return rows.map(toApplication);
}
