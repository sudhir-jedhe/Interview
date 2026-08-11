"use server";

import { getAllApplications } from "@/db/queries/applications";
import { applicationsToCsv, applicationsToJson } from "@/lib/csv";
import type { ActionResult, ApplicationQuery } from "@/types";

/* ------------------------------------------------------------------ */
/* Export                                                              */
/* ------------------------------------------------------------------ */

export async function exportApplicationsCsv(
  filters: ApplicationQuery = {},
): Promise<ActionResult<string>> {
  try {
    const items = await getAllApplications(filters);
    return { success: true, data: applicationsToCsv(items) };
  } catch {
    return { success: false, error: "Could not export applications" };
  }
}

export async function exportApplicationsJson(
  filters: ApplicationQuery = {},
): Promise<ActionResult<string>> {
  try {
    const items = await getAllApplications(filters);
    return { success: true, data: applicationsToJson(items) };
  } catch {
    return { success: false, error: "Could not export applications" };
  }
}
