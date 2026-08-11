import { z } from "zod";

import {
  APPLICATION_STATUSES,
  CURRENCY_CODES,
  EMPLOYMENT_TYPES,
  JOB_SOURCES,
  PRIORITIES,
  WORK_MODES,
} from "@/constants";

/** Treats "" and null as "not provided" so optional inputs stay optional. */
const emptyToUndefined = <T extends z.ZodTypeAny>(schema: T) =>
  z.preprocess((v) => {
    if (v === "" || v === null) return undefined;
    if (typeof v === "string") {
      const trimmed = v.trim();
      return trimmed === "" ? undefined : trimmed;
    }
    return v;
  }, schema.optional());

/**
 * Salary fields arrive from number inputs as strings. Anything non-numeric is
 * rejected loudly rather than silently coerced to 0.
 */
const salary = z.preprocess(
  (v) => {
    if (v === "" || v === null || v === undefined) return undefined;
    if (typeof v === "number") return Number.isFinite(v) ? v : Number.NaN;
    if (typeof v === "string") {
      const cleaned = v.replace(/[,\s_]/g, "");
      if (cleaned === "") return undefined;
      const parsed = Number(cleaned);
      return Number.isNaN(parsed) ? Number.NaN : parsed;
    }
    return v;
  },
  z
    .number({ error: "Enter a valid amount" })
    .min(0, "Salary cannot be negative")
    .max(1_000_000_000, "That salary looks too large")
    .optional(),
);

const dateField = z.preprocess((v) => {
  if (v === "" || v === null || v === undefined) return undefined;
  if (v instanceof Date) return v;
  if (typeof v === "string" || typeof v === "number") {
    const parsed = new Date(v);
    return Number.isNaN(parsed.getTime()) ? new Date("invalid") : parsed;
  }
  return v;
}, z.date({ error: "Enter a valid date" }).optional());

const urlField = emptyToUndefined(
  z
    .string()
    .max(2048, "Link is too long")
    .refine(
      (v) => {
        try {
          const url = new URL(v);
          return url.protocol === "http:" || url.protocol === "https:";
        } catch {
          return false;
        }
      },
      { message: "Enter a valid http(s) URL" },
    ),
);

/**
 * Skills accept either an array (programmatic callers) or a comma-separated
 * string (the form's tag input serialises to this).
 */
const skillsField = z.preprocess(
  (v) => {
    if (Array.isArray(v)) return v.map(String);
    if (typeof v === "string") {
      return v
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
    }
    return [];
  },
  z
    .array(z.string().min(1).max(60, "Skill names must be under 60 characters"))
    .max(40, "That's more than 40 skills — trim the list")
    .default([]),
);

const booleanField = z.preprocess((v) => {
  if (typeof v === "string") return v === "true" || v === "on";
  return v;
}, z.boolean().default(false));

export const applicationSchema = z
  .object({
    companyName: z
      .string()
      .trim()
      .min(1, "Company name is required")
      .max(120, "Company name is too long"),
    jobTitle: z
      .string()
      .trim()
      .min(1, "Job title is required")
      .max(140, "Job title is too long"),
    jobDescription: emptyToUndefined(
      z.string().max(20000, "Description is too long"),
    ),
    applicationLink: urlField,
    skillsAppliedFor: skillsField,

    currentSalary: salary,
    expectedSalary: salary,
    currency: z.enum(CURRENCY_CODES).default("INR"),

    employmentType: z.enum(EMPLOYMENT_TYPES).default("full_time"),
    location: emptyToUndefined(z.string().max(160, "Location is too long")),
    workMode: z.enum(WORK_MODES).default("remote"),

    dateApplied: dateField,
    interviewDate: dateField,
    status: z.enum(APPLICATION_STATUSES).default("applied"),
    priority: z.enum(PRIORITIES).default("medium"),
    favorite: booleanField,

    notes: emptyToUndefined(z.string().max(20000, "Notes are too long")),
    contactPerson: emptyToUndefined(z.string().max(120, "Name is too long")),
    contactEmail: emptyToUndefined(
      z.email({ error: "Enter a valid email address" }).max(160),
    ),
    contactPhone: emptyToUndefined(
      z
        .string()
        .max(32, "Phone number is too long")
        .regex(/^[+\d][\d\s()\-.]{4,}$/, "Enter a valid phone number"),
    ),
    jobSource: z.enum(JOB_SOURCES).default("other"),
    jobSourceOther: emptyToUndefined(
      z.string().max(120, "That's too long — try a shorter label"),
    ),
    resumeVersion: emptyToUndefined(z.string().max(120, "Label is too long")),
    coverLetterUsed: booleanField,
  })
  .refine(
    (data) =>
      !data.dateApplied || data.dateApplied.getTime() <= Date.now() + 86_400_000,
    { message: "Applied date cannot be in the future", path: ["dateApplied"] },
  )
  .refine(
    (data) =>
      !data.interviewDate ||
      !data.dateApplied ||
      data.interviewDate.getTime() >= data.dateApplied.getTime() - 86_400_000,
    {
      message: "Interview date should not be before the applied date",
      path: ["interviewDate"],
    },
  )
  .refine((data) => data.jobSource !== "other" || Boolean(data.jobSourceOther), {
    message: "Tell us where the job came from",
    path: ["jobSourceOther"],
  });

export type ApplicationInput = z.input<typeof applicationSchema>;
export type ApplicationValues = z.output<typeof applicationSchema>;

export const updateApplicationSchema = z.object({
  id: z.uuid("Invalid application id"),
  values: applicationSchema,
});

export const statusChangeSchema = z.object({
  id: z.uuid("Invalid application id"),
  status: z.enum(APPLICATION_STATUSES),
  note: z.string().max(500).optional(),
  interviewDate: dateField,
});

export const bulkStatusSchema = z.object({
  ids: z.array(z.uuid()).min(1, "Select at least one application"),
  status: z.enum(APPLICATION_STATUSES),
});

export const bulkDeleteSchema = z.object({
  ids: z.array(z.uuid()).min(1, "Select at least one application"),
});

export const idSchema = z.uuid("Invalid application id");

/** Row shape accepted by CSV/JSON import. Every field beyond the two required
 *  ones is optional so partial exports from other trackers still import. */
export const importRowSchema = applicationSchema;
