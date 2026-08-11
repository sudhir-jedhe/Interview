import { ArrowRight, Inbox } from "lucide-react";
import Link from "next/link";

import { ApplicationCard } from "@/components/applications/application-card";
import { EmptyState } from "@/components/shared/empty-state";
import { SectionHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import type { Application } from "@/types";

export function RecentApplications({
  applications,
}: {
  applications: Application[];
}) {
  return (
    <section className="rounded-xl border border-border bg-card p-5 shadow-soft sm:p-6">
      <SectionHeader
        title="Recent applications"
        description="The latest roles you've applied for"
        actions={
          <Button asChild variant="ghost" size="sm">
            <Link href="/applications">
              View all
              <ArrowRight className="size-3.5" aria-hidden />
            </Link>
          </Button>
        }
      />

      {applications.length === 0 ? (
        <EmptyState
          icon={Inbox}
          size="sm"
          title="No applications yet"
          description="Add your first application and it'll show up here."
          action={
            <Button asChild size="sm">
              <Link href="/applications/new">Add application</Link>
            </Button>
          }
        />
      ) : (
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {applications.map((application) => (
            <ApplicationCard
              key={application.id}
              application={application}
              compact
            />
          ))}
        </div>
      )}
    </section>
  );
}
