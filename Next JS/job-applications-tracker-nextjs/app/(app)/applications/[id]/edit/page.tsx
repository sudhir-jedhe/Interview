import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { ApplicationForm } from "@/components/applications/application-form";
import { PageHeader } from "@/components/shared/page-header";
import { getApplicationById } from "@/db/queries/applications";

export const dynamic = "force-dynamic";

export async function generateMetadata(
  props: PageProps<"/applications/[id]/edit">,
): Promise<Metadata> {
  const { id } = await props.params;
  const application = await getApplicationById(id);
  return {
    title: application ? `Edit ${application.jobTitle}` : "Edit application",
    description: application
      ? `Edit your application to ${application.companyName}.`
      : "Edit a job application.",
    robots: { index: false, follow: false },
  };
}

export default async function EditApplicationPage(
  props: PageProps<"/applications/[id]/edit">,
) {
  const { id } = await props.params;
  const application = await getApplicationById(id);

  if (!application) notFound();

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <PageHeader
        title="Edit application"
        description={`${application.jobTitle} at ${application.companyName}`}
        eyebrow={
          <Link
            href={`/applications/${application.id}`}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-3.5" aria-hidden />
            Back to application
          </Link>
        }
      />

      <ApplicationForm application={application} />
    </div>
  );
}
