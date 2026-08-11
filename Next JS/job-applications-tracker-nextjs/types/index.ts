import type {
  ApplicationStatus,
  EmploymentType,
  JobSource,
  KanbanColumnId,
  Priority,
  WorkMode,
} from "@/constants";
import type { StatusHistoryRow } from "@/db/schema";

/**
 * The application shape the UI works with. Differs from the raw DB row in that
 * `numeric` salary columns are surfaced as `number | null` rather than strings.
 */
export type Application = {
  id: string;
  companyName: string;
  jobTitle: string;
  jobDescription: string | null;
  applicationLink: string | null;
  skillsAppliedFor: string[];
  currentSalary: number | null;
  expectedSalary: number | null;
  currency: string;
  employmentType: EmploymentType;
  location: string | null;
  workMode: WorkMode;
  dateApplied: Date;
  interviewDate: Date | null;
  status: ApplicationStatus;
  priority: Priority;
  favorite: boolean;
  notes: string | null;
  contactPerson: string | null;
  contactEmail: string | null;
  contactPhone: string | null;
  jobSource: JobSource;
  jobSourceOther: string | null;
  resumeVersion: string | null;
  coverLetterUsed: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type StatusHistoryEntry = StatusHistoryRow;

export type ApplicationWithHistory = Application & {
  statusHistory: StatusHistoryEntry[];
};

/** Uniform return for every server action so callers never guess. */
export type ActionResult<T = void> =
  | { success: true; data: T }
  | { success: false; error: string; fieldErrors?: Record<string, string[]> };

export type SortDirection = "asc" | "desc";

export type ApplicationSortKey =
  | "companyName"
  | "jobTitle"
  | "dateApplied"
  | "interviewDate"
  | "expectedSalary"
  | "status"
  | "priority"
  | "createdAt";

export type ApplicationFilters = {
  query?: string;
  status?: ApplicationStatus[];
  company?: string[];
  workMode?: WorkMode[];
  employmentType?: EmploymentType[];
  jobSource?: JobSource[];
  priority?: Priority[];
  favorite?: boolean;
  from?: Date;
  to?: Date;
  minSalary?: number;
  maxSalary?: number;
};

export type ApplicationQuery = ApplicationFilters & {
  page?: number;
  pageSize?: number;
  sort?: ApplicationSortKey;
  direction?: SortDirection;
};

export type Paginated<T> = {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  pageCount: number;
};

/* ------------------------------------------------------------------ */
/* Analytics                                                           */
/* ------------------------------------------------------------------ */

export type DashboardStats = {
  total: number;
  byStatus: Record<ApplicationStatus, number>;
  avgCurrentSalary: number | null;
  avgExpectedSalary: number | null;
  thisWeek: number;
  thisMonth: number;
  /** Share of applications that reached at least one interview stage. */
  interviewRate: number;
  /** Share of applications that produced an offer. */
  offerRate: number;
  activeCount: number;
  primaryCurrency: string;
};

export type MonthlyPoint = {
  /** ISO `yyyy-MM` key. */
  month: string;
  label: string;
  applications: number;
  interviews: number;
  offers: number;
};

export type DistributionSlice = {
  key: string;
  label: string;
  value: number;
};

export type SalaryComparisonPoint = {
  company: string;
  current: number | null;
  expected: number | null;
};

export type ActivityEntry = StatusHistoryRow & {
  companyName: string;
  jobTitle: string;
};

export type CalendarEvent = {
  id: string;
  applicationId: string;
  type: "applied" | "interview";
  date: Date;
  companyName: string;
  jobTitle: string;
  status: ApplicationStatus;
};

export type KanbanGroups = Record<KanbanColumnId, Application[]>;
