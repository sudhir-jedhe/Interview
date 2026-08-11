"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo, useTransition } from "react";

/**
 * Reads and writes the list view's filter state through the URL. Every setter
 * resets `page` — changing a filter while on page 4 of the old result set would
 * otherwise land you on an empty page.
 */
export function useApplicationFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [pending, startTransition] = useTransition();

  const params = useMemo(
    () => new URLSearchParams(searchParams.toString()),
    [searchParams],
  );

  const push = useCallback(
    (next: URLSearchParams) => {
      const query = next.toString();
      startTransition(() => {
        router.push(query ? `${pathname}?${query}` : pathname, { scroll: false });
      });
    },
    [pathname, router],
  );

  const setParam = useCallback(
    (key: string, value: string | string[] | null | undefined) => {
      const next = new URLSearchParams(params.toString());

      if (value === null || value === undefined || value === "" ||
          (Array.isArray(value) && value.length === 0)) {
        next.delete(key);
      } else if (Array.isArray(value)) {
        next.set(key, value.join(","));
      } else {
        next.set(key, value);
      }

      if (key !== "page") next.delete("page");
      push(next);
    },
    [params, push],
  );

  const toggleInParam = useCallback(
    (key: string, value: string) => {
      const current = (params.get(key) ?? "").split(",").filter(Boolean);
      const next = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value];
      setParam(key, next);
    },
    [params, setParam],
  );

  const getList = useCallback(
    (key: string) => (params.get(key) ?? "").split(",").filter(Boolean),
    [params],
  );

  const clearAll = useCallback(() => {
    // Sort and page size are view preferences, not filters — keep them.
    const next = new URLSearchParams();
    for (const key of ["sort", "dir", "pageSize"]) {
      const value = params.get(key);
      if (value) next.set(key, value);
    }
    push(next);
  }, [params, push]);

  const setSort = useCallback(
    (key: string) => {
      const next = new URLSearchParams(params.toString());
      const currentSort = params.get("sort") ?? "dateApplied";
      const currentDir = params.get("dir") ?? "desc";

      // Same column toggles direction; a new column starts descending.
      next.set("sort", key);
      next.set(
        "dir",
        currentSort === key && currentDir === "desc" ? "asc" : "desc",
      );
      next.delete("page");
      push(next);
    },
    [params, push],
  );

  return {
    params,
    pending,
    setParam,
    toggleInParam,
    getList,
    clearAll,
    setSort,
    get: (key: string) => params.get(key) ?? "",
    sort: params.get("sort") ?? "dateApplied",
    direction: params.get("dir") ?? "desc",
  };
}
