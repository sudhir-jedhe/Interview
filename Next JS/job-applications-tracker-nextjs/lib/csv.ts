import type { Application } from "@/types";

export const CSV_COLUMNS = [
  "companyName",
  "jobTitle",
  "status",
  "priority",
  "dateApplied",
  "interviewDate",
  "location",
  "workMode",
  "employmentType",
  "jobSource",
  "currency",
  "currentSalary",
  "expectedSalary",
  "skillsAppliedFor",
  "applicationLink",
  "contactPerson",
  "contactEmail",
  "contactPhone",
  "resumeVersion",
  "coverLetterUsed",
  "favorite",
  "jobDescription",
  "notes",
] as const;

function escapeCell(value: unknown): string {
  if (value === null || value === undefined) return "";
  let str =
    value instanceof Date
      ? value.toISOString()
      : Array.isArray(value)
        ? value.join("; ")
        : String(value);
  // A leading =, +, -, or @ makes Excel/Sheets/Numbers read the cell as a
  // formula instead of text. Prefix with a quote-escaped apostrophe so it's
  // always treated literally — this is what the value would look like if
  // typed straight into a spreadsheet cell.
  if (/^[=+\-@]/.test(str)) str = `'${str}`;
  // Quote whenever the value could break the row, and double any inner quotes.
  return /[",\n\r]/.test(str) ? `"${str.replace(/"/g, '""')}"` : str;
}

export function applicationsToCsv(applications: Application[]): string {
  const header = CSV_COLUMNS.join(",");
  const rows = applications.map((app) =>
    CSV_COLUMNS.map((col) => escapeCell(app[col as keyof Application])).join(
      ",",
    ),
  );
  return [header, ...rows].join("\n");
}

export function applicationsToJson(applications: Application[]): string {
  return JSON.stringify(applications, null, 2);
}

export function downloadFile(
  content: string,
  filename: string,
  mime: string,
): void {
  const blob = new Blob([content], { type: `${mime};charset=utf-8` });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}
