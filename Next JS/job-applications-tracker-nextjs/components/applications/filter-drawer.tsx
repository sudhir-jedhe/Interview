"use client";

import { SlidersHorizontal, Star, X } from "lucide-react";
import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";
import {
  APPLICATION_STATUSES,
  EMPLOYMENT_TYPES,
  EMPLOYMENT_TYPE_LABELS,
  JOB_SOURCES,
  JOB_SOURCE_LABELS,
  PRIORITIES,
  PRIORITY_LABELS,
  STATUS_META,
  WORK_MODES,
  WORK_MODE_LABELS,
} from "@/constants";
import { useApplicationFilters } from "@/hooks/use-application-filters";

/**
 * All filters in one panel. A sheet rather than a popover row: there are ten
 * dimensions, and on mobile a drawer is the only layout that fits them.
 */
export function FilterDrawer({
  companies,
  activeCount,
}: {
  companies: string[];
  activeCount: number;
}) {
  const [open, setOpen] = useState(false);
  const { get, setParam, toggleInParam, getList, clearAll } =
    useApplicationFilters();

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" className="w-full gap-2 sm:w-auto">
          <SlidersHorizontal className="size-4" aria-hidden />
          Filters
          {activeCount > 0 && (
            <Badge className="ml-0.5 h-5 min-w-5 px-1.5 tabular-nums">
              {activeCount}
            </Badge>
          )}
        </Button>
      </SheetTrigger>

      <SheetContent side="right" className="flex w-full flex-col sm:max-w-md">
        <SheetHeader className="border-b border-border">
          <SheetTitle>Filters</SheetTitle>
        </SheetHeader>

        <div className="flex-1 space-y-7 overflow-y-auto px-4 py-5">
          <FilterGroup label="Favorites only">
            <div className="flex items-center gap-3">
              <Switch
                id="filter-favorite"
                checked={get("favorite") === "true"}
                onCheckedChange={(checked) =>
                  setParam("favorite", checked ? "true" : null)
                }
              />
              <Label
                htmlFor="filter-favorite"
                className="flex items-center gap-1.5 text-sm font-normal"
              >
                <Star className="size-3.5 text-amber-500" aria-hidden />
                Show only starred applications
              </Label>
            </div>
          </FilterGroup>

          <CheckboxGroup
            label="Status"
            options={APPLICATION_STATUSES.map((s) => ({
              value: s,
              label: STATUS_META[s].label,
            }))}
            selected={getList("status")}
            onToggle={(value) => toggleInParam("status", value)}
            columns={1}
          />

          <CheckboxGroup
            label="Priority"
            options={PRIORITIES.map((p) => ({
              value: p,
              label: PRIORITY_LABELS[p],
            }))}
            selected={getList("priority")}
            onToggle={(value) => toggleInParam("priority", value)}
          />

          <CheckboxGroup
            label="Work mode"
            options={WORK_MODES.map((m) => ({
              value: m,
              label: WORK_MODE_LABELS[m],
            }))}
            selected={getList("workMode")}
            onToggle={(value) => toggleInParam("workMode", value)}
          />

          <CheckboxGroup
            label="Employment type"
            options={EMPLOYMENT_TYPES.map((t) => ({
              value: t,
              label: EMPLOYMENT_TYPE_LABELS[t],
            }))}
            selected={getList("employmentType")}
            onToggle={(value) => toggleInParam("employmentType", value)}
          />

          <CheckboxGroup
            label="Job source"
            options={JOB_SOURCES.map((s) => ({
              value: s,
              label: JOB_SOURCE_LABELS[s],
            }))}
            selected={getList("jobSource")}
            onToggle={(value) => toggleInParam("jobSource", value)}
          />

          {companies.length > 0 && (
            <CheckboxGroup
              label="Company"
              options={companies.map((c) => ({ value: c, label: c }))}
              selected={getList("company")}
              onToggle={(value) => toggleInParam("company", value)}
              columns={1}
              scroll
            />
          )}

          <FilterGroup label="Date applied">
            <div className="grid gap-3 min-[360px]:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="filter-from" className="text-xs">
                  From
                </Label>
                <Input
                  id="filter-from"
                  type="date"
                  value={get("from")}
                  onChange={(e) => setParam("from", e.target.value || null)}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="filter-to" className="text-xs">
                  To
                </Label>
                <Input
                  id="filter-to"
                  type="date"
                  value={get("to")}
                  onChange={(e) => setParam("to", e.target.value || null)}
                />
              </div>
            </div>
          </FilterGroup>

          <FilterGroup label="Expected salary">
            <div className="grid gap-3 min-[360px]:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="filter-min" className="text-xs">
                  Minimum
                </Label>
                <Input
                  id="filter-min"
                  type="number"
                  inputMode="numeric"
                  min={0}
                  placeholder="0"
                  value={get("minSalary")}
                  onChange={(e) => setParam("minSalary", e.target.value || null)}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="filter-max" className="text-xs">
                  Maximum
                </Label>
                <Input
                  id="filter-max"
                  type="number"
                  inputMode="numeric"
                  min={0}
                  placeholder="Any"
                  value={get("maxSalary")}
                  onChange={(e) => setParam("maxSalary", e.target.value || null)}
                />
              </div>
            </div>
          </FilterGroup>
        </div>

        <SheetFooter className="flex-row gap-2 border-t border-border">
          <Button
            variant="outline"
            onClick={clearAll}
            disabled={activeCount === 0}
            className="flex-1"
          >
            <X className="size-4" aria-hidden />
            Clear all
          </Button>
          <Button onClick={() => setOpen(false)} className="flex-1">
            Show results
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

function FilterGroup({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <fieldset className="space-y-3">
      <legend className="text-xs font-semibold text-muted-foreground uppercase">
        {label}
      </legend>
      {children}
    </fieldset>
  );
}

function CheckboxGroup({
  label,
  options,
  selected,
  onToggle,
  columns = 2,
  scroll = false,
}: {
  label: string;
  options: { value: string; label: string }[];
  selected: string[];
  onToggle: (value: string) => void;
  columns?: 1 | 2;
  scroll?: boolean;
}) {
  return (
    <FilterGroup label={label}>
      <div
        className={
          (columns === 2 ? "grid gap-x-3 gap-y-2.5 min-[360px]:grid-cols-2" : "space-y-2.5") +
          (scroll ? " max-h-52 overflow-y-auto pr-1" : "")
        }
      >
        {options.map((option) => {
          const id = `filter-${label}-${option.value}`.replace(/\s+/g, "-");
          return (
            <div key={option.value} className="flex items-center gap-2.5">
              <Checkbox
                id={id}
                checked={selected.includes(option.value)}
                onCheckedChange={() => onToggle(option.value)}
              />
              <Label
                htmlFor={id}
                className="min-w-0 truncate text-sm font-normal text-foreground"
              >
                {option.label}
              </Label>
            </div>
          );
        })}
      </div>
    </FilterGroup>
  );
}
