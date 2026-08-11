"use client";

import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  startOfMonth,
  startOfWeek,
  subMonths,
} from "date-fns";
import { useMemo, useReducer } from "react";

import type { CalendarEvent } from "@/types";

type State = {
  cursor: Date;
  selected: Date | null;
};

type Action =
  | { type: "PREV_MONTH" }
  | { type: "NEXT_MONTH" }
  | { type: "TODAY" }
  | { type: "SELECT"; day: Date };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "PREV_MONTH":
      return { ...state, cursor: subMonths(state.cursor, 1) };
    case "NEXT_MONTH":
      return { ...state, cursor: addMonths(state.cursor, 1) };
    case "TODAY": {
      const now = new Date();
      return { cursor: startOfMonth(now), selected: now };
    }
    case "SELECT":
      return { ...state, selected: action.day };
    default:
      return state;
  }
}

function initState(): State {
  return { cursor: startOfMonth(new Date()), selected: new Date() };
}

/**
 * Month grid of applied and interview dates. The month is client state rather
 * than a URL param because the server already sends a generous window of
 * events — paging months shouldn't cost a round trip.
 */
export function useCalendarView(events: CalendarEvent[]) {
  const [{ cursor, selected }, dispatch] = useReducer(reducer, undefined, initState);

  const days = useMemo(() => {
    const start = startOfWeek(startOfMonth(cursor), { weekStartsOn: 1 });
    const end = endOfWeek(endOfMonth(cursor), { weekStartsOn: 1 });
    return eachDayOfInterval({ start, end });
  }, [cursor]);

  const eventsByDay = useMemo(() => {
    const map = new Map<string, CalendarEvent[]>();
    for (const event of events) {
      const key = format(new Date(event.date), "yyyy-MM-dd");
      const list = map.get(key);
      if (list) list.push(event);
      else map.set(key, [event]);
    }
    return map;
  }, [events]);

  const selectedEvents = selected
    ? (eventsByDay.get(format(selected, "yyyy-MM-dd")) ?? [])
    : [];

  return {
    cursor,
    selected,
    days,
    eventsByDay,
    selectedEvents,
    goPrevMonth: () => dispatch({ type: "PREV_MONTH" }),
    goNextMonth: () => dispatch({ type: "NEXT_MONTH" }),
    goToday: () => dispatch({ type: "TODAY" }),
    selectDay: (day: Date) => dispatch({ type: "SELECT", day }),
  };
}
