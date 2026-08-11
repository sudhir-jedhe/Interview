"use client";

import { format, isSameDay, isSameMonth, isToday } from "date-fns";
import { CalendarDays, ChevronLeft, ChevronRight, Send } from "lucide-react";
import Link from "next/link";

import { EmptyState } from "@/components/shared/empty-state";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { CALENDAR_WEEKDAYS } from "@/constants";
import { useCalendarView } from "@/hooks/use-calendar-view";
import { formatDateTime } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { CalendarEvent } from "@/types";

/**
 * Month grid of applied and interview dates. The month is client state rather
 * than a URL param because the server already sends a generous window of
 * events — paging months shouldn't cost a round trip.
 */
export function CalendarView({ events }: { events: CalendarEvent[] }) {
  const {
    cursor,
    selected,
    days,
    eventsByDay,
    selectedEvents,
    goPrevMonth,
    goNextMonth,
    goToday,
    selectDay,
  } = useCalendarView(events);

  return (
    <div className="grid min-w-0 gap-6 xl:grid-cols-[minmax(0,1fr)_20rem]">
      <div className="min-w-0 overflow-hidden rounded-xl border border-border bg-card shadow-soft">
        <header className="flex flex-col gap-3 border-b border-border px-3 py-3.5 min-[420px]:flex-row min-[420px]:items-center min-[420px]:justify-between sm:px-4">
          <h2 className="text-sm font-semibold text-foreground">
            {format(cursor, "MMMM yyyy")}
          </h2>

          <div className="flex items-center gap-1.5 min-[420px]:justify-end">
            <Button
              variant="outline"
              size="icon-sm"
              aria-label="Previous month"
              onClick={goPrevMonth}
            >
              <ChevronLeft className="size-4" aria-hidden />
            </Button>
            <Button variant="outline" size="sm" onClick={goToday}>
              Today
            </Button>
            <Button
              variant="outline"
              size="icon-sm"
              aria-label="Next month"
              onClick={goNextMonth}
            >
              <ChevronRight className="size-4" aria-hidden />
            </Button>
          </div>
        </header>

        <div className="grid grid-cols-7 border-b border-border bg-muted/40">
          {CALENDAR_WEEKDAYS.map((day) => (
            <div
              key={day}
              className="px-1 py-2 text-center text-[0.625rem] font-medium text-muted-foreground uppercase sm:px-2 sm:text-[0.6875rem]"
            >
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7">
          {days.map((day) => {
            const key = format(day, "yyyy-MM-dd");
            const dayEvents = eventsByDay.get(key) ?? [];
            const outside = !isSameMonth(day, cursor);
            const isSelected = selected && isSameDay(day, selected);

            return (
              <button
                key={key}
                type="button"
                onClick={() => selectDay(day)}
                aria-label={`${format(day, "d MMMM yyyy")}, ${dayEvents.length} events`}
                aria-current={isToday(day) ? "date" : undefined}
                className={cn(
                  "relative flex min-h-14 flex-col gap-1 border-r border-b border-border p-1 text-left transition-colors last:border-r-0 min-[380px]:min-h-16 min-[420px]:min-h-20 min-[420px]:p-1.5 sm:min-h-24",
                  outside && "bg-muted/30",
                  isSelected ? "bg-primary/[0.07]" : "hover:bg-accent/60",
                )}
              >
                <span
                  className={cn(
                    "tnum inline-flex size-5 shrink-0 items-center justify-center rounded-md text-[0.6875rem] min-[420px]:size-6 min-[420px]:text-xs",
                    outside ? "text-muted-foreground/50" : "text-foreground",
                    isToday(day) && "bg-primary font-semibold text-primary-foreground",
                  )}
                >
                  {format(day, "d")}
                </span>

                <div className="hidden min-w-0 space-y-0.5 min-[420px]:block">
                  {dayEvents.slice(0, 2).map((event) => (
                    <span
                      key={event.id}
                      className={cn(
                        "block truncate rounded px-1 py-0.5 text-[0.625rem] leading-tight",
                        event.type === "interview"
                          ? "bg-[var(--chart-2)]/15 text-foreground"
                          : "bg-[var(--chart-1)]/15 text-foreground",
                      )}
                    >
                      {event.companyName}
                    </span>
                  ))}
                  {dayEvents.length > 2 && (
                    <span className="block px-1 text-[0.625rem] text-muted-foreground">
                      +{dayEvents.length - 2} more
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        <div className="flex flex-wrap items-center gap-4 px-3 py-3 sm:px-4">
          <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <span
              aria-hidden
              className="size-2.5 rounded-[3px] bg-[var(--chart-1)]"
            />
            Applied
          </span>
          <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <span
              aria-hidden
              className="size-2.5 rounded-[3px] bg-[var(--chart-2)]"
            />
            Interview
          </span>
        </div>
      </div>

      {/* Day detail */}
      <aside className="min-w-0 rounded-xl border border-border bg-card p-5 shadow-soft">
        <h2 className="text-sm font-semibold text-foreground">
          {selected ? format(selected, "EEEE, d MMMM") : "Select a day"}
        </h2>

        {selectedEvents.length === 0 ? (
          <EmptyState
            icon={CalendarDays}
            size="sm"
            title="Nothing on this day"
            description="Pick another date, or add an interview date to an application."
          />
        ) : (
          <ul className="mt-5 space-y-2">
            {selectedEvents.map((event) => (
              <li key={event.id}>
                <Link
                  href={`/applications/${event.applicationId}`}
                  className="block rounded-lg border border-border p-3 transition-colors hover:border-foreground/12 hover:bg-accent"
                >
                  <div className="flex items-center gap-1.5">
                    {event.type === "interview" ? (
                      <CalendarDays
                        className="size-3.5 text-[var(--chart-2)]"
                        aria-hidden
                      />
                    ) : (
                      <Send className="size-3.5 text-[var(--chart-1)]" aria-hidden />
                    )}
                    <span className="text-xs font-medium text-muted-foreground">
                      {event.type === "interview" ? "Interview" : "Applied"}
                    </span>
                  </div>

                  <p className="mt-1.5 truncate text-sm font-medium text-foreground">
                    {event.jobTitle}
                  </p>
                  <p className="truncate text-xs text-muted-foreground">
                    {event.companyName}
                    <span className="mx-1.5" aria-hidden>
                      ·
                    </span>
                    {formatDateTime(event.date)}
                  </p>

                  <StatusBadge
                    status={event.status}
                    size="sm"
                    showDot={false}
                    className="mt-2"
                  />
                </Link>
              </li>
            ))}
          </ul>
        )}
      </aside>
    </div>
  );
}
