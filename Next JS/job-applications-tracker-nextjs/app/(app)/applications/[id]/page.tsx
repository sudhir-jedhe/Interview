import {
  ArrowLeft,
  Briefcase,
  Building2,
  CalendarClock,
  CalendarDays,
  ExternalLink,
  FileText,
  Mail,
  MapPin,
  NotebookPen,
  Phone,
  Sparkles,
  TrendingUp,
  UserRound,
} from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { DetailActions } from "@/components/applications/detail-actions";
import { SalaryPanel } from "@/components/applications/salary-panel";
import { CompanyLogo } from "@/components/shared/company-logo";
import { DetailField } from "@/components/shared/detail-field";
import { DetailPanel } from "@/components/shared/detail-panel";
import { FavoriteButton } from "@/components/shared/favorite-button";
import { Markdown } from "@/components/shared/markdown";
import { PriorityBadge } from "@/components/shared/priority-badge";
import { StatusBadge } from "@/components/shared/status-badge";
import { Timeline } from "@/components/shared/timeline";
import { Badge } from "@/components/ui/badge";
import {
  EMPLOYMENT_TYPE_LABELS,
  JOB_SOURCE_LABELS,
  WORK_MODE_LABELS,
} from "@/constants";
import { getApplicationById } from "@/db/queries/applications";
import { formatDate, formatDateTime } from "@/lib/format";

export const dynamic = "force-dynamic";

export async function generateMetadata(
  props: PageProps<"/applications/[id]">,
): Promise<Metadata> {
  const { id } = await props.params;
  const application = await getApplicationById(id);
  if (!application)
    return { title: "Application not found", robots: { index: false, follow: false } };
  return {
    title: `${application.jobTitle} · ${application.companyName}`,
    description: `Application to ${application.companyName} — ${application.jobTitle}`,
    robots: { index: false, follow: false },
  };
}

export default async function ApplicationDetailPage(
  props: PageProps<"/applications/[id]">,
) {
  const { id } = await props.params;
  const application = await getApplicationById(id);

  if (!application) notFound();

  return (
    <div className="space-y-6">
      <Link
        href="/applications"
        className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-3.5" aria-hidden />
        Applications
      </Link>

      {/* Header */}
      <header className="rounded-xl border border-border bg-card p-4 shadow-soft min-[380px]:p-5 sm:p-6">
        <div className="flex min-w-0 flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
          <div className="flex min-w-0 flex-col gap-4 min-[420px]:flex-row">
            <CompanyLogo companyName={application.companyName} size="xl" />

            <div className="min-w-0 space-y-2">
              <div className="flex min-w-0 items-start gap-2">
                <h1 className="min-w-0 text-xl leading-tight font-semibold break-words text-foreground sm:text-2xl">
                  {application.jobTitle}
                </h1>
                <FavoriteButton
                  id={application.id}
                  favorite={application.favorite}
                />
              </div>

              <p className="flex min-w-0 items-center gap-1.5 text-sm text-muted-foreground">
                <Building2 className="size-3.5 shrink-0" aria-hidden />
                <span className="truncate">{application.companyName}</span>
              </p>

              <div className="flex flex-wrap items-center gap-2 pt-1">
                <StatusBadge status={application.status} />
                <PriorityBadge priority={application.priority} />
                <Badge variant="outline" className="font-normal">
                  {WORK_MODE_LABELS[application.workMode]}
                </Badge>
                <Badge variant="outline" className="font-normal">
                  {EMPLOYMENT_TYPE_LABELS[application.employmentType]}
                </Badge>
              </div>
            </div>
          </div>

          <DetailActions application={application} />
        </div>
      </header>

      <div className="grid min-w-0 gap-6 xl:grid-cols-[minmax(0,1fr)_22rem]">
        {/* Main column */}
        <div className="space-y-6">
          <DetailPanel title="Overview" icon={Briefcase}>
            <dl className="grid gap-x-6 gap-y-4 sm:grid-cols-2">
              <DetailField label="Date applied" icon={CalendarDays}>
                {formatDate(application.dateApplied)}
              </DetailField>
              <DetailField label="Interview date" icon={CalendarClock}>
                {application.interviewDate
                  ? formatDateTime(application.interviewDate)
                  : "Not scheduled"}
              </DetailField>
              <DetailField label="Location" icon={MapPin}>
                {application.location ?? "Not specified"}
              </DetailField>
              <DetailField label="Job source" icon={Sparkles}>
                {application.jobSource === "other" && application.jobSourceOther
                  ? application.jobSourceOther
                  : JOB_SOURCE_LABELS[application.jobSource]}
              </DetailField>
            </dl>

            {application.skillsAppliedFor.length > 0 && (
              <div className="mt-6 space-y-2">
                <p className="text-xs font-medium text-muted-foreground uppercase">
                  Skills applied for
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {application.skillsAppliedFor.map((skill) => (
                    <Badge key={skill} variant="outline" className="font-normal">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {application.applicationLink && (
              <a
                href={application.applicationLink}
                target="_blank"
                rel="noopener noreferrer"
                  className="mt-6 inline-flex max-w-full items-center gap-1.5 text-sm font-medium break-all text-primary hover:underline"
              >
                <ExternalLink className="size-3.5" aria-hidden />
                Open the job posting
              </a>
            )}
          </DetailPanel>

          {application.jobDescription && (
            <DetailPanel title="Job description" icon={FileText}>
              <p className="text-sm leading-relaxed whitespace-pre-line text-muted-foreground">
                {application.jobDescription}
              </p>
            </DetailPanel>
          )}

          <DetailPanel title="Notes" icon={NotebookPen}>
            {application.notes ? (
              <Markdown content={application.notes} />
            ) : (
              <p className="text-sm text-muted-foreground">
                No notes yet.{" "}
                <Link
                  href={`/applications/${application.id}/edit`}
                  className="font-medium text-primary hover:underline"
                >
                  Add some
                </Link>{" "}
                — Markdown is supported.
              </p>
            )}
          </DetailPanel>

          <DetailPanel title="Status timeline" icon={TrendingUp}>
            <Timeline entries={application.statusHistory} />
          </DetailPanel>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <SalaryPanel application={application} />

          <DetailPanel title="Contact" icon={UserRound}>
            {application.contactPerson ||
            application.contactEmail ||
            application.contactPhone ? (
              <dl className="space-y-4">
                {application.contactPerson && (
                  <DetailField label="Person" icon={UserRound}>
                    {application.contactPerson}
                  </DetailField>
                )}
                {application.contactEmail && (
                  <DetailField label="Email" icon={Mail}>
                    <a
                      href={`mailto:${application.contactEmail}`}
                      className="break-all text-primary hover:underline"
                    >
                      {application.contactEmail}
                    </a>
                  </DetailField>
                )}
                {application.contactPhone && (
                  <DetailField label="Phone" icon={Phone}>
                    <a
                      href={`tel:${application.contactPhone.replace(/\s/g, "")}`}
                      className="text-primary hover:underline"
                    >
                      {application.contactPhone}
                    </a>
                  </DetailField>
                )}
              </dl>
            ) : (
              <p className="text-sm text-muted-foreground">
                No contact recorded for this application.
              </p>
            )}
          </DetailPanel>

          <DetailPanel title="Documents" icon={FileText}>
            <dl className="space-y-4">
              <DetailField label="Resume version" icon={FileText}>
                {application.resumeVersion ?? "Not recorded"}
              </DetailField>
              <DetailField label="Cover letter" icon={NotebookPen}>
                {application.coverLetterUsed ? "Sent" : "Not sent"}
              </DetailField>
            </dl>
          </DetailPanel>

          <DetailPanel title="Record" icon={CalendarDays}>
            <dl className="space-y-4">
              <DetailField label="Created" icon={CalendarDays}>
                {formatDateTime(application.createdAt)}
              </DetailField>
              <DetailField label="Last updated" icon={CalendarClock}>
                {formatDateTime(application.updatedAt)}
              </DetailField>
            </dl>
          </DetailPanel>
        </div>
      </div>
    </div>
  );
}
