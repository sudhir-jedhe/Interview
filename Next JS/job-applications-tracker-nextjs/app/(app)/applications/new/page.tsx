import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { ApplicationForm } from "@/components/applications/application-form";
import { PageHeader } from "@/components/shared/page-header";

export const metadata: Metadata = {
  title: "New application",
  description: "Add a new job application to your tracker.",
  robots: { index: false, follow: false },
};

export default function NewApplicationPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <PageHeader
        title="New application"
        description="Log a role you've applied for. Only the company and job title are required — fill in the rest as you learn it."
        eyebrow={
          <Link
            href="/applications"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-3.5" aria-hidden />
            Applications
          </Link>
        }
      />

      <ApplicationForm />
    </div>
  );
}
