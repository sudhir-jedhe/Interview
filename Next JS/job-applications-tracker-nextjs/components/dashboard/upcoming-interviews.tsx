import { CalendarClock } from "lucide-react";
import Link from "next/link";

import { CompanyLogo } from "@/components/shared/company-logo";
import { EmptyState } from "@/components/shared/empty-state";
import { SectionHeader } from "@/components/shared/page-header";
import { StatusBadge } from "@/components/shared/status-badge";
import { formatFriendlyDate } from "@/lib/format";
import type { Application } from "@/types";

export function UpcomingInterviews({
  applications,
}: {
  applications: Application[];
}) {
  return (
    <section className="rounded-xl border border-border bg-card p-5 shadow-soft sm:p-6">
      <SectionHeader
        title="Upcoming interviews"
        description="Scheduled and still ahead of you"
      />

      {applications.length === 0 ? (
        <EmptyState
          icon={CalendarClock}
          size="sm"
          title="Nothing scheduled"
          description="Interviews you add a date to will appear here, newest first."
        />
      ) : (
        <ul className="mt-5 space-y-1">
          {applications.map((application) => (
            <li key={application.id}>
              <Link
                href={`/applications/${application.id}`}
                className="flex flex-col gap-2 rounded-lg px-2 py-2.5 transition-colors hover:bg-accent min-[420px]:flex-row min-[420px]:items-center min-[420px]:gap-3"
              >
                <CompanyLogo companyName={application.companyName} size="sm" />

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-foreground">
                    {application.jobTitle}
                  </p>
                  <p className="truncate text-xs text-muted-foreground">
                    {application.companyName}
                  </p>
                </div>

                <div className="w-full shrink-0 text-left min-[420px]:w-auto min-[420px]:text-right">
                  <p className="text-xs font-medium text-foreground">
                    {formatFriendlyDate(application.interviewDate)}
                  </p>
                  <StatusBadge
                    status={application.status}
                    size="sm"
                    showDot={false}
                    className="mt-1"
                  />
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
