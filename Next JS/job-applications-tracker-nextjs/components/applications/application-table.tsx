"use client";

import {
  type ColumnDef,
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  Columns3,
  FileSearch,
  Inbox,
} from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

import { ApplicationCard } from "@/components/applications/application-card";
import { BulkActionsBar } from "@/components/applications/bulk-actions-bar";
import { RowActions } from "@/components/applications/row-actions";
import { CompanyLogo } from "@/components/shared/company-logo";
import { EmptyState } from "@/components/shared/empty-state";
import { FavoriteButton } from "@/components/shared/favorite-button";
import { PriorityBadge } from "@/components/shared/priority-badge";
import { StatusSelect } from "@/components/shared/status-select";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { SORTABLE_COLUMNS, STORAGE_KEYS, WORK_MODE_LABELS } from "@/constants";
import { useApplicationFilters } from "@/hooks/use-application-filters";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { formatCompactMoney, formatDate } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { Application } from "@/types";

const SORTABLE = new Set<string>(SORTABLE_COLUMNS);

export function ApplicationTable({
  applications,
  hasFilters,
}: {
  applications: Application[];
  hasFilters: boolean;
}) {
  const { sort, direction, setSort } = useApplicationFilters();
  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});

  // Column visibility is a durable per-device preference.
  const [columnVisibility, setColumnVisibility] =
    useLocalStorage<VisibilityState>(STORAGE_KEYS.columns, {
      interviewDate: false,
      jobSource: false,
    });

  const columns = useMemo<ColumnDef<Application>[]>(
    () => [
      {
        id: "select",
        enableHiding: false,
        header: ({ table }) => (
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && "indeterminate")
            }
            onCheckedChange={(value) =>
              table.toggleAllPageRowsSelected(Boolean(value))
            }
            aria-label="Select all rows"
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(Boolean(value))}
            aria-label={`Select ${row.original.jobTitle}`}
          />
        ),
      },
      {
        id: "jobTitle",
        accessorKey: "jobTitle",
        header: "Role",
        enableHiding: false,
        cell: ({ row }) => {
          const app = row.original;
          return (
            <div className="flex min-w-0 items-center gap-3">
              <CompanyLogo companyName={app.companyName} size="md" />
              <div className="min-w-0">
                <Link
                  href={`/applications/${app.id}`}
                  className="block truncate text-sm font-medium text-foreground hover:underline"
                >
                  {app.jobTitle}
                </Link>
                <p className="truncate text-xs text-muted-foreground">
                  {app.companyName}
                </p>
              </div>
            </div>
          );
        },
      },
      {
        id: "status",
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => (
          <StatusSelect
            id={row.original.id}
            status={row.original.status}
            align="start"
          />
        ),
      },
      {
        id: "priority",
        accessorKey: "priority",
        header: "Priority",
        cell: ({ row }) => <PriorityBadge priority={row.original.priority} />,
      },
      {
        id: "dateApplied",
        accessorKey: "dateApplied",
        header: "Applied",
        cell: ({ row }) => (
          <span className="text-sm whitespace-nowrap text-muted-foreground">
            {formatDate(row.original.dateApplied)}
          </span>
        ),
      },
      {
        id: "interviewDate",
        accessorKey: "interviewDate",
        header: "Interview",
        cell: ({ row }) => (
          <span className="text-sm whitespace-nowrap text-muted-foreground">
            {formatDate(row.original.interviewDate)}
          </span>
        ),
      },
      {
        id: "expectedSalary",
        accessorKey: "expectedSalary",
        header: "Expected",
        cell: ({ row }) => (
          <span className="tnum text-sm whitespace-nowrap text-foreground">
            {formatCompactMoney(
              row.original.expectedSalary,
              row.original.currency,
            )}
          </span>
        ),
      },
      {
        id: "location",
        accessorKey: "location",
        header: "Location",
        cell: ({ row }) => (
          <span className="block max-w-40 truncate text-sm text-muted-foreground">
            {row.original.location ?? "—"}
            <span className="text-muted-foreground/70">
              {" · "}
              {WORK_MODE_LABELS[row.original.workMode]}
            </span>
          </span>
        ),
      },
      {
        id: "jobSource",
        accessorKey: "jobSource",
        header: "Source",
        cell: ({ row }) => (
          <span className="text-sm text-muted-foreground capitalize">
            {row.original.jobSource === "other" && row.original.jobSourceOther
              ? row.original.jobSourceOther
              : row.original.jobSource.replace(/_/g, " ")}
          </span>
        ),
      },
      {
        id: "favorite",
        header: "",
        enableHiding: false,
        cell: ({ row }) => (
          <FavoriteButton
            id={row.original.id}
            favorite={row.original.favorite}
            size="sm"
          />
        ),
      },
      {
        id: "actions",
        header: "",
        enableHiding: false,
        cell: ({ row }) => <RowActions application={row.original} />,
      },
    ],
    [],
  );

  const table = useReactTable({
    data: applications,
    columns,
    getCoreRowModel: getCoreRowModel(),
    // Sorting, filtering and pagination all happen in SQL — the table is a
    // renderer here, not a data engine.
    manualSorting: true,
    manualFiltering: true,
    manualPagination: true,
    getRowId: (row) => row.id,
    state: { rowSelection, columnVisibility },
    onRowSelectionChange: setRowSelection,
    onColumnVisibilityChange: setColumnVisibility,
  });

  const selectedIds = Object.keys(rowSelection).filter((id) => rowSelection[id]);

  if (applications.length === 0) {
    return hasFilters ? (
      <EmptyState
        icon={FileSearch}
        title="No matches"
        description="No applications match these filters. Try widening the date range or clearing a filter."
        className="rounded-xl border border-border bg-card shadow-soft"
      />
    ) : (
      <EmptyState
        icon={Inbox}
        title="No applications yet"
        description="Track your first application and this table will fill up with everything you've sent."
        action={
          <Button asChild>
            <Link href="/applications/new">Add your first application</Link>
          </Button>
        }
        className="rounded-xl border border-border bg-card shadow-soft"
      />
    );
  }

  return (
    <>
      <div className="flex flex-col gap-3 min-[420px]:flex-row min-[420px]:items-center min-[420px]:justify-between">
        <p className="text-xs text-muted-foreground">
          {selectedIds.length > 0
            ? `${selectedIds.length} of ${applications.length} selected`
            : `Showing ${applications.length} on this page`}
        </p>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="w-full min-[420px]:w-auto">
              <Columns3 className="size-4" aria-hidden />
              Columns
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-44">
            <DropdownMenuLabel className="text-xs text-muted-foreground">
              Visible columns
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  checked={column.getIsVisible()}
                  onCheckedChange={(value) => column.toggleVisibility(!!value)}
                  onSelect={(event) => event.preventDefault()}
                  className="capitalize"
                >
                  {String(column.columnDef.header || column.id)}
                </DropdownMenuCheckboxItem>
              ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Desktop: real table with a sticky header. */}
      <div className="hidden overflow-hidden rounded-xl border border-border bg-card shadow-soft lg:block">
        <div className="max-h-[calc(100dvh-20rem)] overflow-auto">
          <Table className="min-w-[58rem]">
            <TableHeader className="sticky top-0 z-10 bg-card/95 backdrop-blur-sm">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id} className="hover:bg-transparent">
                  {headerGroup.headers.map((header) => {
                    const id = header.column.id;
                    const sortable = SORTABLE.has(id);
                    const active = sort === id;

                    return (
                      <TableHead
                        key={header.id}
                        aria-sort={
                          active
                            ? direction === "asc"
                              ? "ascending"
                              : "descending"
                            : undefined
                        }
                        className="h-11 border-b border-border text-xs font-medium whitespace-nowrap"
                      >
                        {header.isPlaceholder ? null : sortable ? (
                          <button
                            type="button"
                            onClick={() => setSort(id)}
                            className={cn(
                              "-mx-1.5 inline-flex items-center gap-1.5 rounded px-1.5 py-1 transition-colors hover:text-foreground",
                              active ? "text-foreground" : "text-muted-foreground",
                            )}
                          >
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext(),
                            )}
                            {active ? (
                              direction === "asc" ? (
                                <ArrowUp className="size-3" aria-hidden />
                              ) : (
                                <ArrowDown className="size-3" aria-hidden />
                              )
                            ) : (
                              <ArrowUpDown
                                className="size-3 opacity-40"
                                aria-hidden
                              />
                            )}
                          </button>
                        ) : (
                          flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )
                        )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>

            <TableBody>
              {table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="group"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="py-2.5">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Mobile: the table collapses to cards. */}
      <div className="grid min-w-0 gap-3 lg:hidden">
        {applications.map((application) => (
          <ApplicationCard
            key={application.id}
            application={application}
            showActions
          />
        ))}
      </div>

      <BulkActionsBar
        selectedIds={selectedIds}
        onClear={() => setRowSelection({})}
      />
    </>
  );
}
