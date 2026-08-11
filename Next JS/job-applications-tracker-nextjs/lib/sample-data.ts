import type { ApplicationStatus, EmploymentType, JobSource, Priority, WorkMode } from "@/constants";
import type { NewApplicationRow } from "@/db/schema";

type HistorySeed = {
  oldStatus: ApplicationStatus | null;
  newStatus: ApplicationStatus;
  note?: string | null;
  changedAt: Date;
};

/**
 * Deterministic PRNG (mulberry32). A fixed seed means "Reset sample data"
 * produces the same tracker every time, which makes screenshots and manual
 * QA reproducible.
 */
function createRandom(seed: number) {
  let state = seed;
  return () => {
    state |= 0;
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const COMPANIES: {
  name: string;
  titles: string[];
  location: string;
  band: [number, number];
}[] = [
  { name: "Google", titles: ["Senior Frontend Engineer", "Staff Software Engineer"], location: "Bengaluru, India", band: [4800000, 7200000] },
  { name: "Microsoft", titles: ["Senior SDE", "Principal Engineer"], location: "Hyderabad, India", band: [4200000, 6600000] },
  { name: "Amazon", titles: ["SDE III", "Frontend Engineer II"], location: "Bengaluru, India", band: [3800000, 6000000] },
  { name: "Netflix", titles: ["Senior UI Engineer"], location: "Remote", band: [7000000, 9500000] },
  { name: "Meta", titles: ["Software Engineer, Product", "Senior Product Engineer"], location: "London, UK", band: [5500000, 8000000] },
  { name: "Adobe", titles: ["Computer Scientist II", "Senior Experience Engineer"], location: "Noida, India", band: [3400000, 5200000] },
  { name: "Atlassian", titles: ["Senior Frontend Engineer", "Principal Engineer"], location: "Remote", band: [4500000, 6800000] },
  { name: "Uber", titles: ["Senior Software Engineer"], location: "Bengaluru, India", band: [4000000, 6200000] },
  { name: "Airbnb", titles: ["Senior Frontend Engineer"], location: "Remote", band: [6000000, 8500000] },
  { name: "Stripe", titles: ["Full Stack Engineer", "Senior Product Engineer"], location: "Remote", band: [6500000, 9000000] },
  { name: "Vercel", titles: ["Senior Software Engineer, Next.js"], location: "Remote", band: [6800000, 9200000] },
  { name: "GitHub", titles: ["Senior Software Engineer, Copilot"], location: "Remote", band: [6200000, 8600000] },
  { name: "OpenAI", titles: ["Member of Technical Staff, Frontend"], location: "Remote", band: [8000000, 12000000] },
  { name: "Cloudflare", titles: ["Systems Engineer", "Senior Frontend Engineer"], location: "Remote", band: [5000000, 7400000] },
];

const SKILL_POOL = [
  ["React", "TypeScript", "Next.js", "GraphQL"],
  ["Node.js", "PostgreSQL", "AWS", "Docker"],
  ["React", "Redux", "Jest", "Playwright"],
  ["TypeScript", "System Design", "Kubernetes"],
  ["Next.js", "Tailwind CSS", "tRPC", "Prisma"],
  ["Go", "gRPC", "Distributed Systems"],
  ["React Native", "TypeScript", "Expo"],
  ["Python", "FastAPI", "LLMs", "RAG"],
];

const RESUME_VERSIONS = [
  "resume-v4-frontend.pdf",
  "resume-v4-fullstack.pdf",
  "resume-v3-platform.pdf",
  "resume-v5-senior.pdf",
];

const CONTACTS = [
  { person: "Priya Sharma", email: "priya.sharma@example.com", phone: "+91 98200 41122" },
  { person: "Daniel Okafor", email: "d.okafor@example.com", phone: "+44 7700 900312" },
  { person: "Meera Nair", email: "meera.nair@example.com", phone: "+91 99001 23456" },
  { person: "Alex Chen", email: "alex.chen@example.com", phone: "+1 415 555 0142" },
  { person: "Sofia Duarte", email: "sofia.duarte@example.com", phone: "+351 912 345 678" },
];

const SOURCES: JobSource[] = [
  "linkedin", "linkedin", "referral", "company_website",
  "wellfound", "indeed", "naukri", "foundit", "other",
];

const WORK_MODES_POOL: WorkMode[] = ["remote", "remote", "hybrid", "onsite"];
const EMPLOYMENT_POOL: EmploymentType[] = [
  "full_time", "full_time", "full_time", "contract",
];
const PRIORITY_POOL: Priority[] = ["high", "medium", "medium", "low"];

/**
 * Realistic pipelines. Each is an ordered path an application actually walks,
 * so the generated timelines and funnel percentages hold together.
 */
const PIPELINES: ApplicationStatus[][] = [
  ["applied"],
  ["applied", "application_viewed"],
  ["applied", "application_viewed", "ghosted"],
  ["applied", "rejected"],
  ["applied", "application_viewed", "assessment_scheduled", "assessment_completed", "rejected"],
  ["applied", "application_viewed", "interview_scheduled", "technical_interview", "rejected"],
  ["applied", "application_viewed", "assessment_scheduled", "assessment_completed", "technical_interview", "machine_coding_round", "hr_interview", "offer_received"],
  ["applied", "application_viewed", "interview_scheduled", "technical_interview", "system_design_round", "manager_round", "hr_interview", "offer_received", "offer_accepted"],
  ["applied", "application_viewed", "interview_scheduled", "technical_interview", "system_design_round", "final_interview", "offer_received", "offer_declined"],
  ["applied", "application_viewed", "interview_scheduled", "technical_interview"],
  ["applied", "application_viewed", "assessment_scheduled"],
  ["applied", "withdrawn"],
];

const NOTES_TEMPLATES = [
  `### Round 1 — Screen\n\nSpoke with the recruiter for ~30 minutes. Team is building the **design systems** platform.\n\n- Comp band confirmed, matches expectations\n- Loop is 4 rounds over two weeks\n\n> Prep focus: rendering performance and accessibility.`,
  `Referred internally. Recruiter said the panel cares most about **system design** depth.\n\n- [x] Recruiter screen\n- [ ] Technical round\n- [ ] Manager round`,
  `Applied via the careers page. JD leans heavily on \`Next.js\` App Router and streaming.\n\nWorth revisiting the RSC caching notes before any call.`,
  `No response after the follow-up email. Marking as ghosted for now — will re-apply next quarter if a new req opens.`,
  `Strong conversation with the hiring manager. Team owns the checkout surface end to end.\n\n**Open question:** on-call expectations.`,
  `Take-home was a small dashboard with real-time updates. Submitted in ~4 hours.\n\n- Used optimistic updates for the mutation path\n- Added tests for the reducer`,
];

function pick<T>(rand: () => number, items: readonly T[]): T {
  return items[Math.floor(rand() * items.length)];
}

function daysAgo(days: number, hour = 10) {
  const date = new Date();
  date.setDate(date.getDate() - days);
  date.setHours(hour, 0, 0, 0);
  return date;
}

function daysAhead(days: number, hour = 15) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  date.setHours(hour, 30, 0, 0);
  return date;
}

/**
 * Builds a coherent demo tracker: ~34 applications spread across the last nine
 * months, with matching status history and a few interviews in the near future
 * so the dashboard's reminder and calendar widgets have something to show.
 */
type SampleRow = Omit<NewApplicationRow, "userId">;

export function buildSampleApplications(): {
  rows: SampleRow[];
  history: HistorySeed[][];
} {
  const rand = createRandom(20260722);
  const rows: SampleRow[] = [];
  const history: HistorySeed[][] = [];

  const total = 34;

  for (let i = 0; i < total; i++) {
    const company = COMPANIES[i % COMPANIES.length];
    const pipeline = PIPELINES[Math.floor(rand() * PIPELINES.length)];
    const finalStatus = pipeline[pipeline.length - 1];

    // Spread applications across ~9 months, newest first.
    const appliedDaysAgo = Math.floor(4 + (i / total) * 260 + rand() * 12);
    const dateApplied = daysAgo(appliedDaysAgo, 9 + Math.floor(rand() * 8));

    const expected = Math.round(
      (company.band[0] + rand() * (company.band[1] - company.band[0])) / 50000,
    ) * 50000;
    const current = Math.round((expected * (0.62 + rand() * 0.18)) / 50000) * 50000;

    // Live interview stages get a date in the near future; concluded ones keep
    // the date of their last interview round.
    const isLiveInterview = [
      "interview_scheduled",
      "technical_interview",
      "machine_coding_round",
      "system_design_round",
      "manager_round",
      "hr_interview",
      "final_interview",
      "assessment_scheduled",
    ].includes(finalStatus);

    const touchedInterview = pipeline.some((s) => s.includes("interview") || s.includes("assessment"));

    let interviewDate: Date | null = null;
    if (isLiveInterview && i < 8) {
      interviewDate = daysAhead(1 + Math.floor(rand() * 12));
    } else if (touchedInterview) {
      interviewDate = daysAgo(Math.max(1, appliedDaysAgo - 12), 14);
    }

    const contact = rand() > 0.45 ? pick(rand, CONTACTS) : null;

    rows.push({
      companyName: company.name,
      jobTitle: pick(rand, company.titles),
      jobDescription: `We're looking for an engineer to own high-impact surfaces end to end — from interface architecture through performance, accessibility and rollout. You'll work closely with design and product, and set the technical direction for the team.\n\nWhat you'll do:\n• Ship user-facing features with a high bar for craft\n• Improve rendering performance and Core Web Vitals\n• Mentor engineers and raise the review bar`,
      applicationLink: `https://careers.example.com/${company.name.toLowerCase()}/${1000 + i}`,
      skillsAppliedFor: pick(rand, SKILL_POOL),
      currentSalary: String(current),
      expectedSalary: String(expected),
      currency: "INR",
      employmentType: pick(rand, EMPLOYMENT_POOL),
      location: company.location,
      workMode: company.location === "Remote" ? "remote" : pick(rand, WORK_MODES_POOL),
      dateApplied,
      interviewDate,
      status: finalStatus,
      priority: pick(rand, PRIORITY_POOL),
      favorite: rand() > 0.76,
      notes: rand() > 0.4 ? pick(rand, NOTES_TEMPLATES) : null,
      contactPerson: contact?.person ?? null,
      contactEmail: contact?.email ?? null,
      contactPhone: contact?.phone ?? null,
      jobSource: pick(rand, SOURCES),
      resumeVersion: pick(rand, RESUME_VERSIONS),
      coverLetterUsed: rand() > 0.55,
      createdAt: dateApplied,
      updatedAt: dateApplied,
    });

    // Walk the pipeline forward in time, from the applied date to now.
    const span = Math.max(1, appliedDaysAgo - 2);
    const step = span / Math.max(1, pipeline.length);
    history.push(
      pipeline.map((status, index) => ({
        oldStatus: index === 0 ? null : pipeline[index - 1],
        newStatus: status,
        note: index === 0 ? "Application created" : null,
        changedAt: daysAgo(Math.round(appliedDaysAgo - step * index), 11),
      })),
    );
  }

  return { rows, history };
}
