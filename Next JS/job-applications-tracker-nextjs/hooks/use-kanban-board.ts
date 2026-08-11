"use client";

import {
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import { useMemo, useOptimistic, useState, useTransition } from "react";
import { toast } from "sonner";

import { changeStatus } from "@/actions/applications";
import { KANBAN_COLUMNS, type KanbanColumnId } from "@/constants";
import { columnDefaultStatus, statusColumn, statusLabel } from "@/lib/status";
import type { Application } from "@/types";

/**
 * Optimistic drag state for the kanban board. Dropping a card into a column
 * assigns that column's representative status — the 17 statuses collapse
 * into 4 buckets, and a card already in the right bucket keeps its more
 * specific status.
 */
export function useKanbanBoard(applications: Application[]) {
  const [, startTransition] = useTransition();
  const [dragging, setDragging] = useState<Application | null>(null);
  const [interviewPrompt, setInterviewPrompt] = useState<{
    id: string;
    companyName: string;
  } | null>(null);

  const [optimistic, applyOptimistic] = useOptimistic(
    applications,
    (current, update: { id: string; column: KanbanColumnId }) =>
      current.map((app) =>
        app.id === update.id
          ? { ...app, status: columnDefaultStatus(update.column) }
          : app,
      ),
  );

  const grouped = useMemo(() => {
    const groups = Object.fromEntries(
      KANBAN_COLUMNS.map((c) => [c.id, [] as Application[]]),
    ) as Record<KanbanColumnId, Application[]>;

    for (const app of optimistic) groups[statusColumn(app.status)].push(app);
    return groups;
  }, [optimistic]);

  const sensors = useSensors(
    // A small activation distance keeps clicking a card from starting a drag.
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor),
  );

  function handleDragStart(event: DragStartEvent) {
    setDragging(optimistic.find((app) => app.id === event.active.id) ?? null);
  }

  function handleDragEnd(event: DragEndEvent) {
    setDragging(null);

    const id = String(event.active.id);
    const target = event.over?.id as KanbanColumnId | undefined;
    if (!target) return;

    const application = optimistic.find((app) => app.id === id);
    if (!application) return;

    // Already in this column — don't downgrade a specific status (say,
    // "System Design Round") to the column's generic one.
    if (statusColumn(application.status) === target) return;

    // Interview needs a date to be worth anything on the calendar/reminder
    // banner — collect it before committing the move instead of after.
    if (target === "interview") {
      setInterviewPrompt({ id, companyName: application.companyName });
      return;
    }

    const nextStatus = columnDefaultStatus(target);

    startTransition(async () => {
      applyOptimistic({ id, column: target });
      const result = await changeStatus(id, nextStatus);
      if (result.success) {
        toast.success(`${application.companyName} → ${statusLabel(nextStatus)}`);
      } else {
        toast.error(result.error);
      }
    });
  }

  function confirmInterviewDate(interviewDate: Date) {
    if (!interviewPrompt) return;
    const { id, companyName } = interviewPrompt;
    const nextStatus = columnDefaultStatus("interview");
    setInterviewPrompt(null);

    startTransition(async () => {
      applyOptimistic({ id, column: "interview" });
      const result = await changeStatus(id, nextStatus, undefined, interviewDate);
      if (result.success) {
        toast.success(`${companyName} → ${statusLabel(nextStatus)}`);
      } else {
        toast.error(result.error);
      }
    });
  }

  return {
    dragging,
    grouped,
    sensors,
    handleDragStart,
    handleDragEnd,
    cancelDrag: () => setDragging(null),
    interviewPrompt,
    confirmInterviewDate,
    cancelInterviewPrompt: () => setInterviewPrompt(null),
  };
}
