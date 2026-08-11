CREATE TABLE "application_status_history" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"application_id" uuid NOT NULL,
	"old_status" text,
	"new_status" text NOT NULL,
	"note" text,
	"changed_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "applications" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"company_name" text NOT NULL,
	"job_title" text NOT NULL,
	"job_description" text,
	"application_link" text,
	"skills_applied_for" text[] DEFAULT ARRAY[]::text[] NOT NULL,
	"current_salary" numeric(14, 2),
	"expected_salary" numeric(14, 2),
	"currency" text DEFAULT 'INR' NOT NULL,
	"employment_type" text DEFAULT 'full_time' NOT NULL,
	"location" text,
	"work_mode" text DEFAULT 'remote' NOT NULL,
	"date_applied" timestamp with time zone DEFAULT now() NOT NULL,
	"interview_date" timestamp with time zone,
	"status" text DEFAULT 'applied' NOT NULL,
	"priority" text DEFAULT 'medium' NOT NULL,
	"favorite" boolean DEFAULT false NOT NULL,
	"notes" text,
	"contact_person" text,
	"contact_email" text,
	"contact_phone" text,
	"job_source" text DEFAULT 'other' NOT NULL,
	"resume_version" text,
	"cover_letter_used" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "application_status_history" ADD CONSTRAINT "application_status_history_application_id_applications_id_fk" FOREIGN KEY ("application_id") REFERENCES "public"."applications"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "status_history_application_id_idx" ON "application_status_history" USING btree ("application_id");--> statement-breakpoint
CREATE INDEX "status_history_changed_at_idx" ON "application_status_history" USING btree ("changed_at" DESC NULLS LAST);--> statement-breakpoint
CREATE INDEX "applications_company_name_idx" ON "applications" USING btree ("company_name");--> statement-breakpoint
CREATE INDEX "applications_status_idx" ON "applications" USING btree ("status");--> statement-breakpoint
CREATE INDEX "applications_date_applied_idx" ON "applications" USING btree ("date_applied" DESC NULLS LAST);--> statement-breakpoint
CREATE INDEX "applications_expected_salary_idx" ON "applications" USING btree ("expected_salary");--> statement-breakpoint
CREATE INDEX "applications_favorite_idx" ON "applications" USING btree ("favorite");--> statement-breakpoint
CREATE INDEX "applications_priority_idx" ON "applications" USING btree ("priority");--> statement-breakpoint
CREATE INDEX "applications_created_at_idx" ON "applications" USING btree ("created_at" DESC NULLS LAST);--> statement-breakpoint
CREATE INDEX "applications_interview_date_idx" ON "applications" USING btree ("interview_date");--> statement-breakpoint
CREATE INDEX "applications_status_interview_date_idx" ON "applications" USING btree ("status","interview_date");