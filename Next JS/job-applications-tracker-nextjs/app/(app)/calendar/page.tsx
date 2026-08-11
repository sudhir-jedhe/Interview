import { addMonths, endOfMonth, startOfMonth, subMonths } from "date-fns";
import { Plus } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";

import { CalendarView } from "@/components/calendar/calendar-view";
import { PageHeader } from "@/components/shared/page-header";
import { CardSkeleton } from "@/components/shared/loading-skeleton";
import { Button } from "@/components/ui/button";
import { getCalendarEvents } from "@/db/queries/applications";

export const metadata: Metadata = {
  title: "Calendar",
  description: "See upcoming interviews and deadlines on a month view.",
  robots: { index: false, follow: false },
};
export const dynamic = "force-dynamic";

export default function CalendarPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Calendar"
        description="Interview and application dates, month by month."
        actions={
          <Button asChild>
            <Link href="/applications/new">
              <Plus className="size-4" aria-hidden />
              New application
            </Link>
          </Button>
        }
      />

      <Suspense fallback={<CardSkeleton className="min-h-[32rem]" />}>
        <CalendarContent />
      </Suspense>
    </div>
  );
}

async function CalendarContent() {
  // Fetch a year either side of today so month navigation is instant — the
  // client component pages through this window without another round trip.
  const now = new Date();
  const events = await getCalendarEvents(
    startOfMonth(subMonths(now, 12)),
    endOfMonth(addMonths(now, 12)),
  );

  return <CalendarView events={events} />;
}
