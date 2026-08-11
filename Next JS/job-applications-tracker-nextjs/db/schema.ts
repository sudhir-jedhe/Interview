import { relations, sql } from "drizzle-orm";
import {
  boolean,
  index,
  numeric,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

import {
  APPLICATION_STATUSES,
  EMPLOYMENT_TYPES,
  JOB_SOURCES,
  PRIORITIES,
  WORK_MODES,
} from "@/constants";

/* ─── Better-Auth tables ──────────────────────────────────────────────── */

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").notNull().default(false),
  image: text("image"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const session = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
});

export const account = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at", {
    withTimezone: true,
  }),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at", {
    withTimezone: true,
  }),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export type User = typeof user.$inferSelect;

/**
 * A single job application, owned by the signed-in user who created it.
 */
export const applications = pgTable(
  "applications",
  {
    id: uuid("id").primaryKey().defaultRandom(),

    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),

    // Job
    companyName: text("company_name").notNull(),
    jobTitle: text("job_title").notNull(),
    jobDescription: text("job_description"),
    applicationLink: text("application_link"),
    skillsAppliedFor: text("skills_applied_for")
      .array()
      .notNull()
      .default(sql`ARRAY[]::text[]`),

    // Compensation. numeric keeps large salaries exact; the app reads them as
    // numbers via a mapper rather than trusting JS floats end-to-end.
    currentSalary: numeric("current_salary", { precision: 14, scale: 2 }),
    expectedSalary: numeric("expected_salary", { precision: 14, scale: 2 }),
    currency: text("currency").notNull().default("INR"),

    // Placement
    employmentType: text("employment_type", { enum: EMPLOYMENT_TYPES })
      .notNull()
      .default("full_time"),
    location: text("location"),
    workMode: text("work_mode", { enum: WORK_MODES }).notNull().default("remote"),

    // Pipeline
    dateApplied: timestamp("date_applied", { withTimezone: true })
      .notNull()
      .defaultNow(),
    interviewDate: timestamp("interview_date", { withTimezone: true }),
    status: text("status", { enum: APPLICATION_STATUSES })
      .notNull()
      .default("applied"),
    priority: text("priority", { enum: PRIORITIES }).notNull().default("medium"),
    favorite: boolean("favorite").notNull().default(false),

    // Context
    notes: text("notes"),
    contactPerson: text("contact_person"),
    contactEmail: text("contact_email"),
    contactPhone: text("contact_phone"),
    jobSource: text("job_source", { enum: JOB_SOURCES }).notNull().default("other"),
    jobSourceOther: text("job_source_other"),
    resumeVersion: text("resume_version"),
    coverLetterUsed: boolean("cover_letter_used").notNull().default(false),

    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    index("applications_user_id_idx").on(table.userId),
    index("applications_company_name_idx").on(table.companyName),
    index("applications_status_idx").on(table.status),
    index("applications_date_applied_idx").on(table.dateApplied.desc()),
    index("applications_expected_salary_idx").on(table.expectedSalary),
    index("applications_favorite_idx").on(table.favorite),
    index("applications_priority_idx").on(table.priority),
    index("applications_created_at_idx").on(table.createdAt.desc()),
    index("applications_interview_date_idx").on(table.interviewDate),
    // Drives the "upcoming interviews" and calendar reads, which always filter
    // on user and status first and then order by interview date.
    index("applications_user_status_interview_date_idx").on(
      table.userId,
      table.status,
      table.interviewDate,
    ),
  ],
);

/**
 * Append-only audit trail. One row per status transition, including the
 * synthetic "created" row written when an application is first inserted.
 */
export const applicationStatusHistory = pgTable(
  "application_status_history",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    applicationId: uuid("application_id")
      .notNull()
      .references(() => applications.id, { onDelete: "cascade" }),
    oldStatus: text("old_status", { enum: APPLICATION_STATUSES }),
    newStatus: text("new_status", { enum: APPLICATION_STATUSES }).notNull(),
    note: text("note"),
    changedAt: timestamp("changed_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("status_history_application_id_idx").on(table.applicationId),
    index("status_history_changed_at_idx").on(table.changedAt.desc()),
  ],
);

export const applicationsRelations = relations(applications, ({ one, many }) => ({
  user: one(user, {
    fields: [applications.userId],
    references: [user.id],
  }),
  statusHistory: many(applicationStatusHistory),
}));

export const statusHistoryRelations = relations(
  applicationStatusHistory,
  ({ one }) => ({
    application: one(applications, {
      fields: [applicationStatusHistory.applicationId],
      references: [applications.id],
    }),
  }),
);

export type ApplicationRow = typeof applications.$inferSelect;
export type NewApplicationRow = typeof applications.$inferInsert;
export type StatusHistoryRow = typeof applicationStatusHistory.$inferSelect;
