"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  Banknote,
  Briefcase,
  CalendarClock,
  FileText,
  Loader2,
  NotebookPen,
  Star,
  UserRound,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { type Resolver, useForm } from "react-hook-form";
import { toast } from "sonner";

import { createApplication, updateApplication } from "@/actions/applications";
import { FieldRow, FormSection } from "@/components/applications/form-section";
import { SkillsInput } from "@/components/applications/skills-input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  APPLICATION_STATUSES,
  CURRENCIES,
  EMPLOYMENT_TYPES,
  EMPLOYMENT_TYPE_LABELS,
  JOB_SOURCES,
  JOB_SOURCE_LABELS,
  PRIORITIES,
  PRIORITY_LABELS,
  STATUS_META,
  STORAGE_KEYS,
  WORK_MODES,
  WORK_MODE_LABELS,
} from "@/constants";
import { useDefaultCurrency } from "@/hooks/use-preferences";
import { toDateInputValue, toDateTimeLocalValue } from "@/lib/format";
import { applicationSchema } from "@/schemas/application";
import type { Application } from "@/types";

/** The form works in strings (what inputs give us); Zod coerces on submit. */
type FormValues = {
  companyName: string;
  jobTitle: string;
  jobDescription: string;
  applicationLink: string;
  skillsAppliedFor: string[];
  currentSalary: string;
  expectedSalary: string;
  currency: string;
  employmentType: string;
  location: string;
  workMode: string;
  dateApplied: string;
  interviewDate: string;
  status: string;
  priority: string;
  favorite: boolean;
  notes: string;
  contactPerson: string;
  contactEmail: string;
  contactPhone: string;
  jobSource: string;
  jobSourceOther: string;
  resumeVersion: string;
  coverLetterUsed: boolean;
};

function toFormValues(
  application: Application | undefined,
  fallbackCurrency: string,
): FormValues {
  return {
    companyName: application?.companyName ?? "",
    jobTitle: application?.jobTitle ?? "",
    jobDescription: application?.jobDescription ?? "",
    applicationLink: application?.applicationLink ?? "",
    skillsAppliedFor: application?.skillsAppliedFor ?? [],
    currentSalary: application?.currentSalary?.toString() ?? "",
    expectedSalary: application?.expectedSalary?.toString() ?? "",
    currency: application?.currency ?? fallbackCurrency,
    employmentType: application?.employmentType ?? "full_time",
    location: application?.location ?? "",
    workMode: application?.workMode ?? "remote",
    dateApplied: toDateInputValue(application?.dateApplied ?? new Date()),
    interviewDate: toDateTimeLocalValue(application?.interviewDate),
    status: application?.status ?? "applied",
    priority: application?.priority ?? "medium",
    favorite: application?.favorite ?? false,
    notes: application?.notes ?? "",
    contactPerson: application?.contactPerson ?? "",
    contactEmail: application?.contactEmail ?? "",
    contactPhone: application?.contactPhone ?? "",
    jobSource: application?.jobSource ?? "other",
    jobSourceOther: application?.jobSourceOther ?? "",
    resumeVersion: application?.resumeVersion ?? "",
    coverLetterUsed: application?.coverLetterUsed ?? false,
  };
}

export function ApplicationForm({
  application,
}: {
  application?: Application;
}) {
  const router = useRouter();
  const isEdit = Boolean(application);
  const [currency, , currencyHydrated] = useDefaultCurrency();
  const [submitting, setSubmitting] = useState(false);
  const restoredDraft = useRef(false);

  // The resolver validates the string-shaped form values against the same Zod
  // schema the server uses, so inline errors match server errors exactly. The
  // cast is needed because Zod's `preprocess` makes the schema's *input* type
  // wider than the form's; the parsed output is re-derived server-side anyway,
  // which is the boundary that actually matters.
  const form = useForm<FormValues>({
    resolver: zodResolver(applicationSchema) as unknown as Resolver<FormValues>,
    defaultValues: toFormValues(application, "INR"),
    mode: "onBlur",
  });
  const jobSource = form.watch("jobSource");

  // Adopt the saved default currency once localStorage has been read, but only
  // for new applications and only if the user hasn't touched the field.
  useEffect(() => {
    if (!currencyHydrated || isEdit) return;
    if (form.formState.dirtyFields.currency) return;
    form.setValue("currency", currency);
  }, [currency, currencyHydrated, isEdit, form]);

  /* ---------------- Draft autosave (new applications only) ---------------- */

  useEffect(() => {
    if (isEdit || restoredDraft.current) return;
    restoredDraft.current = true;

    try {
      const stored = window.localStorage.getItem(STORAGE_KEYS.draft);
      if (!stored) return;
      const draft = JSON.parse(stored) as Partial<FormValues>;
      if (!draft.companyName && !draft.jobTitle) return;

      form.reset({ ...toFormValues(undefined, currency), ...draft });
      toast.info("Restored your unsaved draft", {
        action: {
          label: "Discard",
          onClick: () => {
            window.localStorage.removeItem(STORAGE_KEYS.draft);
            form.reset(toFormValues(undefined, currency));
          },
        },
      });
    } catch {
      window.localStorage.removeItem(STORAGE_KEYS.draft);
    }
    // Runs once on mount; `currency` is only a seed for the reset baseline.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit]);

  useEffect(() => {
    if (isEdit) return;

    const subscription = form.watch((values) => {
      // Only persist once there's something worth recovering.
      if (!values.companyName && !values.jobTitle) return;
      try {
        window.localStorage.setItem(STORAGE_KEYS.draft, JSON.stringify(values));
      } catch {
        // Storage full or unavailable — drafts are best-effort.
      }
    });

    return () => subscription.unsubscribe();
  }, [form, isEdit]);

  /* ------------------------------- Submit ------------------------------- */

  async function onSubmit(values: FormValues) {
    setSubmitting(true);

    const result = isEdit
      ? await updateApplication(application!.id, values)
      : await createApplication(values);

    if (!result.success) {
      // Surface server-side field errors on the matching inputs.
      if (result.fieldErrors) {
        for (const [field, messages] of Object.entries(result.fieldErrors)) {
          form.setError(field as keyof FormValues, {
            type: "server",
            message: messages[0],
          });
        }
      }
      toast.error(result.error);
      setSubmitting(false);
      return;
    }

    if (!isEdit) window.localStorage.removeItem(STORAGE_KEYS.draft);

    toast.success(isEdit ? "Application updated" : "Application saved");
    router.push(`/applications/${result.data.id}`);
    // Deliberately not clearing `submitting`: the button stays disabled
    // through the navigation so a double-click can't create two rows.
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormSection
          title="Job information"
          description="What the role is and where you found it."
          icon={Briefcase}
        >
          <FieldRow>
            <FormField
              control={form.control}
              name="companyName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Stripe"
                      autoComplete="organization"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="jobTitle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Job title</FormLabel>
                  <FormControl>
                    <Input placeholder="Senior Frontend Engineer" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </FieldRow>

          <FormField
            control={form.control}
            name="applicationLink"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Application link</FormLabel>
                <FormControl>
                  <Input
                    type="url"
                    inputMode="url"
                    placeholder="https://careers.example.com/roles/1234"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  The job posting or your application confirmation page.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="skillsAppliedFor"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Skills applied for</FormLabel>
                <FormControl>
                  <SkillsInput value={field.value} onChange={field.onChange} />
                </FormControl>
                <FormDescription>
                  Press Enter or comma to add each skill.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="jobDescription"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Job description</FormLabel>
                <FormControl>
                  <Textarea
                    rows={6}
                    placeholder="Paste the parts of the posting worth remembering…"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </FormSection>

        <FormSection
          title="Company & placement"
          description="Where the role sits and how it's structured."
          icon={UserRound}
        >
          <FieldRow>
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <FormControl>
                    <Input placeholder="Bengaluru, India" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <SelectField
              form={form}
              name="workMode"
              label="Work mode"
              options={WORK_MODES.map((m) => ({
                value: m,
                label: WORK_MODE_LABELS[m],
              }))}
            />
          </FieldRow>

          <FieldRow>
            <SelectField
              form={form}
              name="employmentType"
              label="Employment type"
              options={EMPLOYMENT_TYPES.map((t) => ({
                value: t,
                label: EMPLOYMENT_TYPE_LABELS[t],
              }))}
            />

            <SelectField
              form={form}
              name="jobSource"
              label="Job source"
              options={JOB_SOURCES.map((s) => ({
                value: s,
                label: JOB_SOURCE_LABELS[s],
              }))}
            />
          </FieldRow>

          {jobSource === "other" && (
            <FormField
              control={form.control}
              name="jobSourceOther"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Specify job source</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g. Twitter, university job board"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
        </FormSection>

        <FormSection
          title="Salary"
          description="Used for the comparison charts and averages."
          icon={Banknote}
        >
          <FieldRow className="min-[720px]:grid-cols-3">
            <FormField
              control={form.control}
              name="currentSalary"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Current salary</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      inputMode="numeric"
                      min={0}
                      step={1000}
                      placeholder="1800000"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="expectedSalary"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Expected salary</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      inputMode="numeric"
                      min={0}
                      step={1000}
                      placeholder="2800000"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <SelectField
              form={form}
              name="currency"
              label="Currency"
              options={CURRENCIES.map((c) => ({
                value: c.code,
                label: `${c.symbol} ${c.code}`,
              }))}
            />
          </FieldRow>
        </FormSection>

        <FormSection
          title="Pipeline"
          description="Where this application stands right now."
          icon={CalendarClock}
        >
          <FieldRow>
            <FormField
              control={form.control}
              name="dateApplied"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date applied</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="interviewDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Interview date</FormLabel>
                  <FormControl>
                    <Input type="datetime-local" {...field} />
                  </FormControl>
                  <FormDescription>
                    Shows up on your calendar and reminder banner.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </FieldRow>

          <FieldRow>
            <SelectField
              form={form}
              name="status"
              label="Status"
              options={APPLICATION_STATUSES.map((s) => ({
                value: s,
                label: STATUS_META[s].label,
              }))}
            />

            <SelectField
              form={form}
              name="priority"
              label="Priority"
              options={PRIORITIES.map((p) => ({
                value: p,
                label: PRIORITY_LABELS[p],
              }))}
            />
          </FieldRow>

          <FormField
            control={form.control}
            name="favorite"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center gap-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormLabel className="flex items-center gap-1.5 font-normal">
                  <Star className="size-3.5 text-amber-500" aria-hidden />
                  Mark as a favorite
                </FormLabel>
              </FormItem>
            )}
          />
        </FormSection>

        <FormSection
          title="Contact"
          description="Your recruiter or referrer for this role."
          icon={UserRound}
        >
          <FormField
            control={form.control}
            name="contactPerson"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Contact person</FormLabel>
                <FormControl>
                  <Input
                    placeholder="John Doe"
                    autoComplete="name"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FieldRow>
            <FormField
              control={form.control}
              name="contactEmail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contact email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      inputMode="email"
                      placeholder="johndoe@example.com"
                      autoComplete="email"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="contactPhone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contact phone</FormLabel>
                  <FormControl>
                    <Input
                      type="tel"
                      inputMode="tel"
                      placeholder="+91 12345 67890"
                      autoComplete="tel"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </FieldRow>
        </FormSection>

        <FormSection
          title="Documents"
          description="Which version of your materials you sent."
          icon={FileText}
        >
          <FormField
            control={form.control}
            name="resumeVersion"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Resume version</FormLabel>
                <FormControl>
                  <Input placeholder="resume-v4-frontend.pdf" {...field} />
                </FormControl>
                <FormDescription>
                  A label so you know which resume this company saw.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="coverLetterUsed"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center gap-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormLabel className="font-normal">
                  I sent a cover letter with this application
                </FormLabel>
              </FormItem>
            )}
          />
        </FormSection>

        <FormSection
          title="Notes"
          description="Markdown is supported — headings, lists, links and code."
          icon={NotebookPen}
        >
          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="sr-only">Notes</FormLabel>
                <FormControl>
                  <Textarea
                    rows={10}
                    placeholder={
                      "### Recruiter screen\n\n- Comp band confirmed\n- Loop is 4 rounds\n\n> Prep: system design"
                    }
                    className="font-mono text-[0.8125rem]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </FormSection>

        <div className="sticky bottom-24 z-10 flex flex-col-reverse gap-3 rounded-xl border border-border bg-card/95 p-3 shadow-lift backdrop-blur-sm min-[420px]:flex-row min-[420px]:items-center min-[420px]:justify-end sm:p-4 lg:bottom-4">
          <Button
            type="button"
            variant="ghost"
            onClick={() => router.back()}
            disabled={submitting}
            className="w-full min-[420px]:w-auto"
          >
            Cancel
          </Button>
          <Button type="submit" disabled={submitting} className="w-full min-[420px]:w-auto">
            {submitting && (
              <Loader2 className="size-4 animate-spin" aria-hidden />
            )}
            {isEdit ? "Save changes" : "Save application"}
          </Button>
        </div>
      </form>
    </Form>
  );
}

/* ------------------------------------------------------------------ */

type SelectFieldProps = {
  form: ReturnType<typeof useForm<FormValues>>;
  name: keyof FormValues;
  label: string;
  options: { value: string; label: string }[];
};

function SelectField({ form, name, label, options }: SelectFieldProps) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <Select
            value={String(field.value ?? "")}
            onValueChange={field.onChange}
          >
            <FormControl>
              <SelectTrigger className="w-full">
                <SelectValue placeholder={`Select ${label.toLowerCase()}`} />
              </SelectTrigger>
            </FormControl>
            <SelectContent className="max-h-72">
              {options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
