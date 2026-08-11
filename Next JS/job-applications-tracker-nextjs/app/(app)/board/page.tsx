import { Plus } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";

import { KanbanBoard } from "@/components/board/kanban-board";
import { PageHeader } from "@/components/shared/page-header";
import { TableSkeleton } from "@/components/shared/loading-skeleton";
import { Button } from "@/components/ui/button";
import { getAllApplications } from "@/db/queries/applications";

export const metadata: Metadata = {
  title: "Board",
  description:
    "Drag your applications through Applied, Interview, Offer, and Rejected.",
  robots: { index: false, follow: false },
};
export const dynamic = "force-dynamic";

export default function BoardPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Board"
        description="Drag an application between columns to move it through your pipeline."
        actions={
          <Button asChild>
            <Link href="/applications/new">
              <Plus className="size-4" aria-hidden />
              New application
            </Link>
          </Button>
        }
      />

      <Suspense fallback={<TableSkeleton rows={6} />}>
        <BoardContent />
      </Suspense>
    </div>
  );
}

async function BoardContent() {
  const applications = await getAllApplications();
  return <KanbanBoard applications={applications} />;
}
