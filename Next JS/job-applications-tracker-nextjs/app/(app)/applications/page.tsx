import { Plus } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";

import { ApplicationTable } from "@/components/applications/application-table";
import { ExportMenu } from "@/components/applications/export-menu";
import { FilterDrawer } from "@/components/applications/filter-drawer";
import { SearchBar } from "@/components/applications/search-bar";
import { TablePagination } from "@/components/applications/table-pagination";
import { PageHeader } from "@/components/shared/page-header";
import { TableSkeleton } from "@/components/shared/loading-skeleton";
import { Button } from "@/components/ui/button";
import { getApplications, getCompanyNames } from "@/db/queries/applications";
import { countActiveFilters, parseSearchParams } from "@/lib/search-params";

export const metadata: Metadata = {
  title: "Applications",
  description:
    "Browse, search, and filter every job application you've tracked.",
  robots: { index: false, follow: false },
};
export const dynamic = "force-dynamic";

export default async function ApplicationsPage(
  props: PageProps<"/applications">,
) {
  const searchParams = await props.searchParams;
  const query = parseSearchParams(searchParams);
  const activeFilters = countActiveFilters(query);

  return (
    <div className="min-w-0 space-y-6">
      <PageHeader
        title="Applications"
        description="Search, filter and manage everything you've sent."
        actions={
          <Button asChild>
            <Link href="/applications/new">
              <Plus className="size-4" aria-hidden />
              New application
            </Link>
          </Button>
        }
      />

      <div className="flex min-w-0 flex-col gap-3 md:flex-row md:items-center">
        <SearchBar className="min-w-0 flex-1" />
        <div className="grid min-w-0 gap-2 min-[360px]:grid-cols-2 md:flex md:items-center">
          <Suspense fallback={null}>
            <FiltersSlot activeFilters={activeFilters} />
          </Suspense>
          <ExportMenu filters={query} />
        </div>
      </div>

      {/* Keyed on the serialised query so a filter change shows the skeleton
          again instead of holding the previous page's rows. */}
      <Suspense key={JSON.stringify(searchParams)} fallback={<TableSkeleton />}>
        <ResultsSlot query={query} hasFilters={activeFilters > 0} />
      </Suspense>
    </div>
  );
}

async function FiltersSlot({ activeFilters }: { activeFilters: number }) {
  const companies = await getCompanyNames();
  return <FilterDrawer companies={companies} activeCount={activeFilters} />;
}

async function ResultsSlot({
  query,
  hasFilters,
}: {
  query: ReturnType<typeof parseSearchParams>;
  hasFilters: boolean;
}) {
  const result = await getApplications(query);

  return (
    <div className="min-w-0 space-y-4">
      <ApplicationTable applications={result.items} hasFilters={hasFilters} />
      {result.total > 0 && (
        <TablePagination
          page={result.page}
          pageCount={result.pageCount}
          pageSize={result.pageSize}
          total={result.total}
        />
      )}
    </div>
  );
}
