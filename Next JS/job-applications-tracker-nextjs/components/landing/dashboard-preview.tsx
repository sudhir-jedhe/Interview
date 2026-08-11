import { Star } from "lucide-react";

import { cn } from "@/lib/utils";

const STATS = [
  { label: "Total", value: "34", hint: "12 still active" },
  { label: "This week", value: "6", hint: "Sent since Monday" },
  { label: "Interview rate", value: "41.2%", hint: "Reached a stage" },
  { label: "Offer rate", value: "11.8%", hint: "Converted" },
];

const ROWS = [
  {
    company: "Stripe",
    role: "Senior Product Engineer",
    status: "Offer Received",
    tone: "success",
  },
  {
    company: "Vercel",
    role: "Software Engineer, Next.js",
    status: "System Design",
    tone: "progress",
  },
  {
    company: "Linear",
    role: "Product Engineer",
    status: "Technical Interview",
    tone: "progress",
  },
  {
    company: "GitHub",
    role: "Senior Engineer, Copilot",
    status: "Applied",
    tone: "neutral",
  },
  {
    company: "Netflix",
    role: "Senior UI Engineer",
    status: "Rejected",
    tone: "danger",
  },
] as const;

const TONE: Record<string, string> = {
  success: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  progress: "bg-blue-50 text-blue-700 ring-blue-200",
  neutral: "bg-slate-100 text-slate-700 ring-slate-200",
  danger: "bg-red-50 text-red-700 ring-red-200",
};

// Bar heights for the trend sparkline, as percentages.
const TREND = [32, 48, 40, 62, 55, 78, 66, 90, 72, 85, 60, 96];

/**
 * A static, self-contained mock of the product. Rendered as real markup rather
 * than a screenshot so it stays crisp at any size and never goes stale against
 * the design tokens. Locked to the light palette — it's a picture of the app,
 * not a live surface.
 */
export function DashboardPreview() {
  return (
    <div
      aria-hidden
      className="pointer-events-none overflow-hidden rounded-xl border border-[#e5e7eb] bg-white text-[#111827] shadow-float select-none"
    >
      {/* Window chrome */}
      <div className="flex items-center gap-2 border-b border-[#e5e7eb] bg-[#fafafa] px-4 py-2.5">
        <span className="flex gap-1.5">
          <span className="size-2.5 rounded-full bg-[#e5e7eb]" />
          <span className="size-2.5 rounded-full bg-[#e5e7eb]" />
          <span className="size-2.5 rounded-full bg-[#e5e7eb]" />
        </span>
        <span className="ml-2 min-w-0 truncate rounded-md bg-white px-2.5 py-1 text-[0.625rem] text-[#6b7280] ring-1 ring-[#e5e7eb]">
          hireloop.yogeshchavan.dev/dashboard
        </span>
      </div>

      <div className="grid md:grid-cols-[11rem_1fr]">
        {/* Sidebar */}
        <div className="hidden space-y-1 border-r border-[#e5e7eb] bg-white p-3 md:block">
          <div className="mb-4 flex items-center gap-2 px-1">
            <span className="flex size-6 items-center justify-center rounded-md bg-[#2563eb]">
              <svg viewBox="0 0 24 24" className="size-3" fill="none">
                <path
                  d="M5 15.5v3M12 10v8.5M19 5.5v13"
                  stroke="white"
                  strokeWidth="2.6"
                  strokeLinecap="round"
                />
              </svg>
            </span>
            <span className="text-xs font-semibold">HireLoop</span>
          </div>

          {["Dashboard", "Applications", "Board", "Analytics", "Calendar"].map(
            (item, index) => (
              <div
                key={item}
                className={cn(
                  "rounded-md px-2.5 py-1.5 text-[0.6875rem]",
                  index === 0
                    ? "bg-[#f3f4f6] font-medium text-[#111827]"
                    : "text-[#6b7280]",
                )}
              >
                {item}
              </div>
            ),
          )}
        </div>

        {/* Body */}
        <div className="min-w-0 space-y-4 bg-[#fafafa] p-3 sm:p-4">
          <div className="grid grid-cols-2 gap-2.5 lg:grid-cols-4">
            {STATS.map((stat) => (
              <div
                key={stat.label}
                className="min-w-0 rounded-lg border border-[#e5e7eb] bg-white p-2.5"
              >
                <p className="text-[0.5625rem] text-[#6b7280] uppercase">
                  {stat.label}
                </p>
                <p className="mt-1 text-base leading-none font-semibold tabular-nums">
                  {stat.value}
                </p>
                <p className="mt-1 truncate text-[0.5625rem] text-[#6b7280]">
                  {stat.hint}
                </p>
              </div>
            ))}
          </div>

          {/* Trend */}
          <div className="rounded-lg border border-[#e5e7eb] bg-white p-3">
            <p className="text-[0.625rem] font-semibold">
              Applications over time
            </p>
            <div className="mt-3 flex h-16 items-end gap-1.5">
              {TREND.map((height, index) => (
                <div
                  key={index}
                  className="flex-1 rounded-t-[3px] bg-[#2563eb]"
                  style={{ height: `${height}%`, opacity: 0.35 + index * 0.05 }}
                />
              ))}
            </div>
          </div>

          {/* Table */}
          <div className="overflow-hidden rounded-lg border border-[#e5e7eb] bg-white">
            {ROWS.map((row, index) => (
              <div
                key={row.company}
                className={cn(
                  "flex items-center gap-2.5 px-3 py-2",
                  index > 0 && "border-t border-[#e5e7eb]",
                )}
              >
                <span className="flex size-5 shrink-0 items-center justify-center rounded bg-[#f3f4f6] text-[0.5rem] font-semibold text-[#6b7280]">
                  {row.company.slice(0, 2).toUpperCase()}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[0.625rem] font-medium">
                    {row.role}
                  </p>
                  <p className="truncate text-[0.5625rem] text-[#6b7280]">
                    {row.company}
                  </p>
                </div>
                <span
                  className={cn(
                    "hidden shrink-0 rounded-full px-1.5 py-0.5 text-[0.5rem] font-medium ring-1 ring-inset min-[420px]:inline-flex",
                    TONE[row.tone],
                  )}
                >
                  {row.status}
                </span>
                <Star
                  className={cn(
                    "size-3 shrink-0",
                    index < 2
                      ? "fill-amber-400 text-amber-400"
                      : "text-[#e5e7eb]",
                  )}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
