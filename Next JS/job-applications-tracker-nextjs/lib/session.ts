import "server-only";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { cache } from "react";

import { auth } from "@/lib/auth";

/**
 * The signed-in user's id. Proxy only checks for a cookie's presence, so a
 * revoked or expired session still reaches this point — send it back to
 * /login instead of surfacing a crash. Wrapped in `cache()` so the several
 * queries a single page fires only pay for one session lookup.
 */
export const getCurrentUserId = cache(async (): Promise<string> => {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login");
  return session.user.id;
});
