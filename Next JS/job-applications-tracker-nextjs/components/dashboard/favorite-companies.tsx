import { Building2, Star } from "lucide-react";
import Link from "next/link";

import { CompanyLogo } from "@/components/shared/company-logo";
import { EmptyState } from "@/components/shared/empty-state";
import { SectionHeader } from "@/components/shared/page-header";
import { pluralize } from "@/lib/format";

export function FavoriteCompanies({
  companies,
}: {
  companies: { company: string; value: number; favorites: number }[];
}) {
  return (
    <section className="rounded-xl border border-border bg-card p-5 shadow-soft sm:p-6">
      <SectionHeader
        title="Top companies"
        description="Where you've applied most"
      />

      {companies.length === 0 ? (
        <EmptyState
          icon={Building2}
          size="sm"
          title="No companies yet"
          description="Companies appear here once you've logged an application."
        />
      ) : (
        <ul className="mt-5 space-y-1">
          {companies.map((entry) => (
            <li key={entry.company}>
              <Link
                href={`/applications?company=${encodeURIComponent(entry.company)}`}
                className="flex items-center gap-3 rounded-lg px-2 py-2 transition-colors hover:bg-accent"
              >
                <CompanyLogo companyName={entry.company} size="sm" />

                <span className="min-w-0 flex-1 truncate text-sm font-medium text-foreground">
                  {entry.company}
                </span>

                {entry.favorites > 0 && (
                  <span
                    className="inline-flex items-center gap-1 text-xs text-amber-500"
                    title={`${entry.favorites} favorited`}
                  >
                    <Star className="size-3 fill-current" aria-hidden />
                    {entry.favorites}
                  </span>
                )}

                <span className="tnum shrink-0 text-xs text-muted-foreground">
                  {entry.value} {pluralize(entry.value, "application")}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
