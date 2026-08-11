export const APP_NAME = "HireLoop";
export const APP_DESCRIPTION =
  "Organize applications, track interview rounds, and never lose sight of where you stand with every employer.";

/* ------------------------------------------------------------------ */
/* Status                                                              */
/* ------------------------------------------------------------------ */

export const APPLICATION_STATUSES = [
  "applied",
  "application_viewed",
  "assessment_scheduled",
  "assessment_completed",
  "interview_scheduled",
  "technical_interview",
  "machine_coding_round",
  "system_design_round",
  "manager_round",
  "hr_interview",
  "final_interview",
  "offer_received",
  "offer_accepted",
  "offer_declined",
  "rejected",
  "withdrawn",
  "ghosted",
] as const;

export type ApplicationStatus = (typeof APPLICATION_STATUSES)[number];

/**
 * Tone drives the badge/chart colour. Kept to five semantic buckets so the UI
 * never turns into a rainbow: neutral → progressing → success → danger → dormant.
 */
export type StatusTone =
  | "neutral"
  | "progress"
  | "success"
  | "danger"
  | "dormant";

type StatusMeta = {
  label: string;
  tone: StatusTone;
  /** Roughly how far along the pipeline this status sits (0–100). */
  stage: number;
  /** Which Kanban column this status collapses into. */
  column: KanbanColumnId;
};

export const STATUS_META: Record<ApplicationStatus, StatusMeta> = {
  applied: { label: "Applied", tone: "neutral", stage: 10, column: "applied" },
  application_viewed: {
    label: "Application Viewed",
    tone: "neutral",
    stage: 18,
    column: "applied",
  },
  assessment_scheduled: {
    label: "Assessment Scheduled",
    tone: "progress",
    stage: 28,
    column: "interview",
  },
  assessment_completed: {
    label: "Assessment Completed",
    tone: "progress",
    stage: 36,
    column: "interview",
  },
  interview_scheduled: {
    label: "Interview Scheduled",
    tone: "progress",
    stage: 44,
    column: "interview",
  },
  technical_interview: {
    label: "Technical Interview",
    tone: "progress",
    stage: 52,
    column: "interview",
  },
  machine_coding_round: {
    label: "Machine Coding Round",
    tone: "progress",
    stage: 58,
    column: "interview",
  },
  system_design_round: {
    label: "System Design Round",
    tone: "progress",
    stage: 64,
    column: "interview",
  },
  manager_round: {
    label: "Manager Round",
    tone: "progress",
    stage: 72,
    column: "interview",
  },
  hr_interview: {
    label: "HR Interview",
    tone: "progress",
    stage: 78,
    column: "interview",
  },
  final_interview: {
    label: "Final Interview",
    tone: "progress",
    stage: 85,
    column: "interview",
  },
  offer_received: {
    label: "Offer Received",
    tone: "success",
    stage: 92,
    column: "offer",
  },
  offer_accepted: {
    label: "Offer Accepted",
    tone: "success",
    stage: 100,
    column: "offer",
  },
  offer_declined: {
    label: "Offer Declined",
    tone: "dormant",
    stage: 100,
    column: "offer",
  },
  rejected: {
    label: "Rejected",
    tone: "danger",
    stage: 100,
    column: "rejected",
  },
  withdrawn: {
    label: "Withdrawn",
    tone: "dormant",
    stage: 100,
    column: "rejected",
  },
  ghosted: {
    label: "Ghosted",
    tone: "dormant",
    stage: 100,
    column: "rejected",
  },
};

/** Statuses that mean the application is still live. */
export const ACTIVE_STATUSES = APPLICATION_STATUSES.filter(
  (s) => STATUS_META[s].stage < 92,
);

/** Statuses that count as "reached an interview stage". */
export const INTERVIEW_STAGE_STATUSES: ApplicationStatus[] = [
  "assessment_scheduled",
  "assessment_completed",
  "interview_scheduled",
  "technical_interview",
  "machine_coding_round",
  "system_design_round",
  "manager_round",
  "hr_interview",
  "final_interview",
];

export const OFFER_STATUSES: ApplicationStatus[] = [
  "offer_received",
  "offer_accepted",
  "offer_declined",
];

export const CLOSED_STATUSES: ApplicationStatus[] = [
  "offer_accepted",
  "offer_declined",
  "rejected",
  "withdrawn",
  "ghosted",
];

/* ------------------------------------------------------------------ */
/* Kanban                                                              */
/* ------------------------------------------------------------------ */

export const KANBAN_COLUMNS = [
  {
    id: "applied",
    label: "Applied",
    /** Status assigned when a card is dropped into this column. */
    defaultStatus: "applied",
    tone: "neutral",
  },
  {
    id: "interview",
    label: "Interview",
    defaultStatus: "interview_scheduled",
    tone: "progress",
  },
  {
    id: "offer",
    label: "Offer",
    defaultStatus: "offer_received",
    tone: "success",
  },
  {
    id: "rejected",
    label: "Rejected",
    defaultStatus: "rejected",
    tone: "danger",
  },
] as const satisfies readonly {
  id: string;
  label: string;
  defaultStatus: ApplicationStatus;
  tone: StatusTone;
}[];

export type KanbanColumnId = (typeof KANBAN_COLUMNS)[number]["id"];

/* ------------------------------------------------------------------ */
/* Enums                                                               */
/* ------------------------------------------------------------------ */

export const WORK_MODES = ["remote", "hybrid", "onsite"] as const;
export type WorkMode = (typeof WORK_MODES)[number];
export const WORK_MODE_LABELS: Record<WorkMode, string> = {
  remote: "Remote",
  hybrid: "Hybrid",
  onsite: "Onsite",
};

export const EMPLOYMENT_TYPES = [
  "full_time",
  "part_time",
  "contract",
  "internship",
  "freelance",
] as const;
export type EmploymentType = (typeof EMPLOYMENT_TYPES)[number];
export const EMPLOYMENT_TYPE_LABELS: Record<EmploymentType, string> = {
  full_time: "Full Time",
  part_time: "Part Time",
  contract: "Contract",
  internship: "Internship",
  freelance: "Freelance",
};

export const JOB_SOURCES = [
  "linkedin",
  "indeed",
  "naukri",
  "foundit",
  "wellfound",
  "referral",
  "company_website",
  "other",
] as const;
export type JobSource = (typeof JOB_SOURCES)[number];
export const JOB_SOURCE_LABELS: Record<JobSource, string> = {
  linkedin: "LinkedIn",
  indeed: "Indeed",
  naukri: "Naukri",
  foundit: "Foundit",
  wellfound: "Wellfound",
  referral: "Referral",
  company_website: "Company Website",
  other: "Other",
};

export const PRIORITIES = ["low", "medium", "high"] as const;
export type Priority = (typeof PRIORITIES)[number];
export const PRIORITY_LABELS: Record<Priority, string> = {
  low: "Low",
  medium: "Medium",
  high: "High",
};

export const CURRENCIES = [
  { code: "INR", symbol: "₹", label: "Indian Rupee" },
  { code: "USD", symbol: "$", label: "US Dollar" },
  { code: "EUR", symbol: "€", label: "Euro" },
  { code: "GBP", symbol: "£", label: "British Pound" },
  { code: "CAD", symbol: "CA$", label: "Canadian Dollar" },
  { code: "AUD", symbol: "A$", label: "Australian Dollar" },
  { code: "SGD", symbol: "S$", label: "Singapore Dollar" },
  { code: "AED", symbol: "AED", label: "UAE Dirham" },
] as const;

export const CURRENCY_CODES = CURRENCIES.map((c) => c.code) as unknown as [
  string,
  ...string[],
];

export const DEFAULT_CURRENCY = "INR";

/* ------------------------------------------------------------------ */
/* Preferences (client-side, localStorage)                             */
/* ------------------------------------------------------------------ */

export const STORAGE_KEYS = {
  currency: "hireloop:currency",
  monthlyGoal: "hireloop:monthly-goal",
  draft: "hireloop:application-draft",
  columns: "hireloop:table-columns",
} as const;

export const DEFAULT_MONTHLY_GOAL = 20;

export const PAGE_SIZES = [10, 25, 50, 100] as const;

/* ------------------------------------------------------------------ */
/* Landing page content                                                */
/* ------------------------------------------------------------------ */

export const LANDING_FEATURES = [
  {
    icon: "Table2",
    title: "A table that keeps up",
    description:
      "Sort, filter across ten dimensions, change status inline, and act on a hundred rows at once. Search spans company, title, skills, description and notes.",
  },
  {
    icon: "KanbanSquare",
    title: "Drag through your pipeline",
    description:
      "A four-column board where dropping a card updates its status. Seventeen granular statuses collapse into the four that matter at a glance.",
  },
  {
    icon: "TrendingUp",
    title: "Honest conversion rates",
    description:
      "Interview and offer rates are computed from full status history, so an application rejected after a final round still counts as having got there.",
  },
  {
    icon: "CalendarDays",
    title: "Never miss a round",
    description:
      "Interview dates land on a month calendar and surface as a reminder banner when something falls within the next seven days.",
  },
  {
    icon: "Command",
    title: "Built for the keyboard",
    description:
      "⌘K searches everything. N starts a new application. G then D, A, B, N, C or S jumps between sections without touching the mouse.",
  },
  {
    icon: "Download",
    title: "Your data, portable",
    description:
      "CSV and JSON in both directions. Exports respect your active filters, and imports match headers loosely so an existing spreadsheet just works.",
  },
] as const;

export const LANDING_STATS = [
  { value: "17", label: "Pipeline statuses", hint: "From applied to accepted" },
  { value: "10", label: "Filter dimensions", hint: "Combine any of them" },
  { value: "100%", label: "Your own database", hint: "Neon PostgreSQL" },
  { value: "1", label: "Sign-in step", hint: "Google or GitHub" },
] as const;

export const LANDING_FUNNEL = [
  { label: "Applied", pct: 100, count: 34 },
  { label: "Reached an interview", pct: 41.2, count: 14 },
  { label: "Received an offer", pct: 11.8, count: 4 },
  { label: "Accepted an offer", pct: 2.9, count: 1 },
] as const;

export const LANDING_VALUE_POINTS = [
  {
    icon: "BarChart3",
    text: "Conversion funnel from applied through to accepted",
  },
  { icon: "Search", text: "Which job sources actually lead to interviews" },
  {
    icon: "TrendingUp",
    text: "Current versus expected salary, company by company",
  },
] as const;

/* ------------------------------------------------------------------ */
/* Calendar                                                             */
/* ------------------------------------------------------------------ */

export const CALENDAR_WEEKDAYS = [
  "Mon",
  "Tue",
  "Wed",
  "Thu",
  "Fri",
  "Sat",
  "Sun",
] as const;

/* ------------------------------------------------------------------ */
/* Status select grouping                                              */
/* ------------------------------------------------------------------ */

export const STATUS_SELECT_GROUPS: {
  label: string;
  statuses: ApplicationStatus[];
}[] = [
  { label: "Early", statuses: ["applied", "application_viewed"] },
  {
    label: "Assessment",
    statuses: ["assessment_scheduled", "assessment_completed"],
  },
  {
    label: "Interviews",
    statuses: [
      "interview_scheduled",
      "technical_interview",
      "machine_coding_round",
      "system_design_round",
      "manager_round",
      "hr_interview",
      "final_interview",
    ],
  },
  {
    label: "Outcome",
    statuses: [
      "offer_received",
      "offer_accepted",
      "offer_declined",
      "rejected",
      "withdrawn",
      "ghosted",
    ],
  },
];

/* ------------------------------------------------------------------ */
/* Applications table                                                  */
/* ------------------------------------------------------------------ */

export const SORTABLE_COLUMNS = [
  "companyName",
  "jobTitle",
  "dateApplied",
  "interviewDate",
  "expectedSalary",
  "status",
  "priority",
] as const;
