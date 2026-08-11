"use client";

import {
  DndContext,
  DragOverlay,
  pointerWithin,
  useDroppable,
} from "@dnd-kit/core";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { KanbanSquare } from "lucide-react";

import { ApplicationCard } from "@/components/applications/application-card";
import { InterviewDateDialog } from "@/components/board/interview-date-dialog";
import { EmptyState } from "@/components/shared/empty-state";
import { KANBAN_COLUMNS, type KanbanColumnId } from "@/constants";
import { useKanbanBoard } from "@/hooks/use-kanban-board";
import { TONE_DOT } from "@/lib/status";
import { cn } from "@/lib/utils";
import type { Application } from "@/types";

/**
 * Four-column pipeline board. Dropping a card into a column assigns that
 * column's representative status — the 17 statuses collapse into 4 buckets,
 * and a card already in the right bucket keeps its more specific status.
 */
export function KanbanBoard({ applications }: { applications: Application[] }) {
  const {
    dragging,
    grouped,
    sensors,
    handleDragStart,
    handleDragEnd,
    cancelDrag,
    interviewPrompt,
    confirmInterviewDate,
    cancelInterviewPrompt,
  } = useKanbanBoard(applications);

  if (!applications.length) {
    return (
      <EmptyState
        icon={KanbanSquare}
        title="Nothing on the board"
        description="Add an application and it'll appear in the Applied column, ready to drag through your pipeline."
        className="rounded-xl border border-border bg-card shadow-soft"
      />
    );
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={pointerWithin}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={cancelDrag}
      accessibility={{
        announcements: {
          onDragStart: ({ active }) => `Picked up application ${active.id}`,
          onDragOver: ({ over }) =>
            over ? `Over the ${over.id} column` : "Not over a column",
          onDragEnd: ({ over }) =>
            over ? `Dropped into the ${over.id} column` : "Drag cancelled",
          onDragCancel: () => "Drag cancelled",
        },
      }}
    >
      <div className="grid w-full min-w-0 grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {KANBAN_COLUMNS.map((column) => (
          <Column
            key={column.id}
            id={column.id}
            label={column.label}
            tone={column.tone}
            applications={grouped[column.id]}
          />
        ))}
      </div>

      <DragOverlay dropAnimation={{ duration: 180, easing: "ease-out" }}>
        {dragging && (
          <div className="w-[min(18rem,calc(100vw-2rem))] rotate-2 cursor-grabbing opacity-95">
            <ApplicationCard application={dragging} compact />
          </div>
        )}
      </DragOverlay>

      <InterviewDateDialog
        open={interviewPrompt !== null}
        companyName={interviewPrompt?.companyName}
        onConfirm={confirmInterviewDate}
        onCancel={cancelInterviewPrompt}
      />
    </DndContext>
  );
}

function Column({
  id,
  label,
  tone,
  applications,
}: {
  id: KanbanColumnId;
  label: string;
  tone: keyof typeof TONE_DOT;
  applications: Application[];
}) {
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <section
      ref={setNodeRef}
      aria-label={`${label} column, ${applications.length} applications`}
      className={cn(
        "flex min-h-64 min-w-0 flex-col rounded-xl border border-border bg-surface/60 p-3 transition-colors md:min-h-[24rem]",
        isOver && "border-primary/40 bg-primary/[0.05]",
      )}
    >
      <header className="flex min-w-0 items-center gap-2 px-1 pb-3">
        <span
          aria-hidden
          className={cn("size-2 shrink-0 rounded-full", TONE_DOT[tone])}
        />
        <h2 className="min-w-0 truncate text-sm font-semibold text-foreground">
          {label}
        </h2>
        <span className="tnum ml-auto rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
          {applications.length}
        </span>
      </header>

      <div className="min-w-0 flex-1 space-y-2.5">
        {applications.length === 0 ? (
          <p className="rounded-lg border border-dashed border-border px-3 py-8 text-center text-xs text-muted-foreground">
            Drop an application here
          </p>
        ) : (
          applications.map((application) => (
            <DraggableCard key={application.id} application={application} />
          ))
        )}
      </div>
    </section>
  );
}

function DraggableCard({ application }: { application: Application }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({ id: application.id });

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Translate.toString(transform) }}
      {...listeners}
      {...attributes}
      className={cn(
        "w-full min-w-0 max-w-full cursor-grab touch-none active:cursor-grabbing",
        // The original stays in place as a ghost while the overlay follows the
        // pointer — moving it would make the column jump under the cursor.
        isDragging && "opacity-40",
      )}
    >
      <ApplicationCard application={application} compact />
    </div>
  );
}
