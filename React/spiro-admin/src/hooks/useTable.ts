/**
 * useTable — search, filter, sort and paginate, in one hook.
 *
 * Two design decisions worth stating:
 *
 *   1. It works on data you already have. Server-side tables need the SAME
 *      state shape, so `state` is exposed for you to feed into a query key.
 *      The local pipeline is then simply skipped.
 *
 *   2. Every stage is memoised SEPARATELY. Filtering 9,000 batteries then
 *      sorting them is expensive; typing one character in the search box must
 *      not re-sort a list whose sort key did not change.
 */

import { useCallback, useMemo, useRef, useState } from 'react';
import { usePreference, useSessionState } from './useStoredState';

export type SortDir = 'asc' | 'desc';

export interface ColumnFilter {
  key: string;
  value: string;
}

export interface TableState {
  search: string;
  sortBy: string | null;
  sortDir: SortDir;
  page: number;
  pageSize: number;
  filters: ColumnFilter[];
}

export interface UseTableOptions<T> {
  /** Fields the free-text search box looks at. */
  searchKeys?: (keyof T)[];
  initialSortBy?: string | null;
  initialSortDir?: SortDir;
  pageSize?: number;
  /** Skip local processing — the server already did it. */
  manual?: boolean;
  /** Which field identifies a row, for selection. Defaults to `id`. */
  rowIdKey?: string;
  /**
   * Give the table an id and the user's COLUMN PREFERENCES persist under it.
   * Without one, hiding a column lasts until the next navigation — which is
   * exactly long enough to be annoying and not long enough to be useful.
   */
  tableId?: string;
}

const compare = (a: unknown, b: unknown): number => {
  // Nulls sink in both directions: absent is not "smallest".
  if (a == null && b == null) return 0;
  if (a == null) return 1;
  if (b == null) return -1;

  if (typeof a === 'number' && typeof b === 'number') return a - b;
  if (typeof a === 'boolean' && typeof b === 'boolean') return Number(a) - Number(b);

  return String(a).localeCompare(String(b), undefined, { numeric: true });
};

export function useTable<T extends Record<string, unknown>>(
  rows: T[],
  options: UseTableOptions<T> = {}
) {
  const {
    searchKeys = [],
    initialSortBy = null,
    initialSortDir = 'asc',
    pageSize: initialPageSize = 25,
    manual = false,
    rowIdKey = 'id',
    tableId,
  } = options;

  /**
   * Where you are in the table is SESSION state, not a preference.
   *
   * Page 4 of the battery list, sorted by SOH, filtered to Pune, is exactly
   * where you want to land when you come back from a detail screen — and
   * exactly what you do NOT want to inherit tomorrow morning, or in a second
   * tab you opened to look at something else. sessionStorage is per-tab and
   * dies with it, which is precisely that lifetime.
   */
  const key = tableId ?? 'default';

  const [search, setSearchRaw] = useSessionState(`table:${key}:search`, '');
  const [sortBy, setSortBy] = useSessionState<string | null>(`table:${key}:sortBy`, initialSortBy);
  const [sortDir, setSortDir] = useSessionState<SortDir>(`table:${key}:sortDir`, initialSortDir);
  const [page, setPage] = useSessionState(`table:${key}:page`, 1);
  const [pageSize, setPageSize] = useSessionState(`table:${key}:pageSize`, initialPageSize);
  const [filters, setFilters] = useSessionState<ColumnFilter[]>(`table:${key}:filters`, []);
  const [selected, setSelected] = useState<ReadonlySet<string>>(() => new Set());

  // Which columns you want IS a preference — it is about you, not about
  // this visit — so it lives in localStorage and is shared across tabs.
  //
  // Stored as an ARRAY, not a Set: a Set JSON-serialises to `{}` and the
  // preference silently disappears on the next reload.
  const [hiddenList, setHiddenList] = usePreference<string[]>(`cols:${key}`, []);
  const hiddenColumns = useMemo<ReadonlySet<string>>(() => new Set(hiddenList), [hiddenList]);

  /** Any change other than the page itself must return to page 1. */
  const setSearch = useCallback(
    (value: string) => {
      setSearchRaw(value);
      setPage(1);
    },
    [setSearchRaw, setPage]
  );

  const setFilter = useCallback(
    (column: string, value: string) => {
      setFilters((current) => {
        const rest = current.filter((f) => f.key !== column);
        return value ? [...rest, { key: column, value }] : rest;
      });
      setPage(1);
    },
    [setFilters, setPage]
  );

  const clearFilters = useCallback(() => {
    setFilters([]);
    setSearchRaw('');
    setPage(1);
  }, [setFilters, setSearchRaw, setPage]);

  /**
   * Click a header: asc -> desc -> unsorted. The third state matters — it is
   * how a user gets back to the server's natural order.
   *
   * Computed from the CURRENT values rather than by nesting one state
   * updater inside another. The nested version worked by mutating a local
   * from inside an updater, which React is free to run twice — and a
   * tri-state toggle that occasionally skips a state is maddening to debug.
   */
  const toggleSort = useCallback(
    (column: string) => {
      if (sortBy !== column) {
        setSortBy(column);
        setSortDir('asc');
      } else if (sortDir === 'asc') {
        setSortDir('desc');
      } else {
        setSortBy(null);
        setSortDir('asc');
      }
      setPage(1);
    },
    [sortBy, sortDir, setSortBy, setSortDir, setPage]
  );

  /* ---- the pipeline, each stage memoised on its own inputs ---- */

  const searched = useMemo(() => {
    if (manual || !search.trim() || searchKeys.length === 0) return rows;

    const needle = search.trim().toLowerCase();
    return rows.filter((row) =>
      searchKeys.some((key) => String(row[key] ?? '').toLowerCase().includes(needle))
    );
  }, [rows, search, searchKeys, manual]);

  const filtered = useMemo(() => {
    if (manual || filters.length === 0) return searched;

    // CONTAINS, not equals. The same filter state backs two controls — a
    // dropdown of exact values and a free-text box — and a value picked from
    // the dropdown trivially contains itself, so one rule serves both.
    return searched.filter((row) =>
      filters.every((f) =>
        String(row[f.key] ?? '')
          .toLowerCase()
          .includes(f.value.toLowerCase())
      )
    );
  }, [searched, filters, manual]);

  const sorted = useMemo(() => {
    if (manual || !sortBy) return filtered;

    const dir = sortDir === 'desc' ? -1 : 1;
    // Copy first: sort mutates, and mutating props is a rendering bug.
    return [...filtered].sort((a, b) => compare(a[sortBy], b[sortBy]) * dir);
  }, [filtered, sortBy, sortDir, manual]);

  // `toggleAllVisible` must see the CURRENT page without taking `paged` as a
  // dependency — that would make the callback change identity every render
  // and defeat the memoisation it exists to provide.
  const visibleIdsRef = useRef<string[]>([]);

  const total = sorted.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  const paged = useMemo(() => {
    if (manual) return sorted;
    const start = (page - 1) * pageSize;
    return sorted.slice(start, start + pageSize);
  }, [sorted, page, pageSize, manual]);

  /* ---- selection ----
   *
   * Selection is by ROW ID, not by index or by object identity. Indices go
   * stale the moment you sort; object identity breaks the moment the data
   * refetches. An id survives both, which is what lets you tick four bikes,
   * change the filter, and still send the command to those four.
   */

  const toggleRow = useCallback((id: string) => {
    setSelected((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const toggleAllVisible = useCallback(() => {
    setSelected((current) => {
      const ids = visibleIdsRef.current;
      const everySelected = ids.length > 0 && ids.every((id) => current.has(id));
      const next = new Set(current);
      // Clear only the visible ones — a selection made on page 1 must
      // survive "select all" on page 2.
      if (everySelected) for (const id of ids) next.delete(id);
      else for (const id of ids) next.add(id);
      return next;
    });
  }, []);

  const clearSelection = useCallback(() => setSelected(new Set()), []);

  const toggleColumn = useCallback(
    (key: string) => {
      setHiddenList((current) =>
        current.includes(key) ? current.filter((k) => k !== key) : [...current, key]
      );
    },
    [setHiddenList]
  );

  const showAllColumns = useCallback(() => setHiddenList([]), [setHiddenList]);

  /** Drop the columns the user has hidden, preserving declaration order. */
  const visibleColumns = useCallback(
    <C extends { key: string }>(columns: C[]) => columns.filter((c) => !hiddenColumns.has(c.key)),
    [hiddenColumns]
  );

  /**
   * Distinct values for a column, for its header filter.
   *
   * Computed from `searched` rather than `rows`, so the options narrow as
   * you type in the search box but do NOT narrow to the single value you
   * just filtered by — which would make the filter impossible to widen again.
   */
  const distinctValues = useCallback(
    (key: string): string[] => {
      const values = new Set<string>();
      for (const row of searched) {
        const value = row[key];
        if (value === null || value === undefined || value === '') continue;
        values.add(String(value));
        if (values.size > 200) break;
      }
      return [...values].sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
    },
    [searched]
  );

  visibleIdsRef.current = paged.map((row) => String(row[rowIdKey] ?? ''));

  const state: TableState = { search, sortBy, sortDir, page, pageSize, filters };

  return {
    rows: paged,
    /** The rows the current selection refers to, in table order. */
    selectedRows: sorted.filter((row) => selected.has(String(row[rowIdKey] ?? ''))),
    /** Everything matching the filters, ignoring pagination — for export. */
    allMatchingRows: sorted,

    state,
    search,
    setSearch,
    sortBy,
    sortDir,
    toggleSort,
    filters,
    setFilter,
    clearFilters,

    page,
    setPage,
    pageSize,
    setPageSize,
    total,
    totalPages,
    hasPrevious: page > 1,
    hasNext: page < totalPages,
    next: useCallback(() => setPage((p) => p + 1), [setPage]),
    previous: useCallback(() => setPage((p) => Math.max(1, p - 1)), [setPage]),

    selected,
    selectedCount: selected.size,
    toggleRow,
    toggleAllVisible,
    clearSelection,

    hiddenColumns,
    toggleColumn,
    showAllColumns,
    visibleColumns,
    distinctValues,

    isFiltered: search.trim() !== '' || filters.length > 0,
  };
}
