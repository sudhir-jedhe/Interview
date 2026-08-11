"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PAGE_SIZES } from "@/constants";
import { useApplicationFilters } from "@/hooks/use-application-filters";
import type { Paginated } from "@/types";

export function TablePagination({
  page,
  pageCount,
  pageSize,
  total,
}: Pick<Paginated<unknown>, "page" | "pageCount" | "pageSize" | "total">) {
  const { setParam } = useApplicationFilters();

  const first = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const last = Math.min(page * pageSize, total);

  return (
    <div className="flex flex-col-reverse items-stretch justify-between gap-3 sm:flex-row sm:items-center">
      <p className="tnum text-xs text-muted-foreground">
        {total === 0
          ? "No applications"
          : `${first}–${last} of ${total} applications`}
      </p>

      <div className="flex w-full flex-col items-stretch gap-3 min-[420px]:w-auto min-[420px]:flex-row min-[420px]:items-center min-[420px]:gap-4">
        <div className="flex items-center justify-between gap-2 min-[420px]:justify-start">
          <label
            htmlFor="page-size"
            className="text-xs whitespace-nowrap text-muted-foreground"
          >
            Rows
          </label>
          <Select
            value={String(pageSize)}
            onValueChange={(value) => setParam("pageSize", value)}
          >
            <SelectTrigger id="page-size" size="sm" className="w-[4.5rem]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PAGE_SIZES.map((size) => (
                <SelectItem key={size} value={String(size)}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center justify-center gap-1.5">
          <Button
            variant="outline"
            size="icon-sm"
            aria-label="Previous page"
            disabled={page <= 1}
            onClick={() => setParam("page", String(page - 1))}
          >
            <ChevronLeft className="size-4" aria-hidden />
          </Button>

          <span className="tnum px-1 text-xs whitespace-nowrap text-muted-foreground">
            Page {page} of {pageCount}
          </span>

          <Button
            variant="outline"
            size="icon-sm"
            aria-label="Next page"
            disabled={page >= pageCount}
            onClick={() => setParam("page", String(page + 1))}
          >
            <ChevronRight className="size-4" aria-hidden />
          </Button>
        </div>
      </div>
    </div>
  );
}
