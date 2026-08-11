import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Only allows same-app relative paths through. Rejects protocol-relative
 * (`//evil.com`) and backslash (`/\evil.com`) tricks that browsers/routers
 * can still resolve to an external origin, so untrusted redirect params
 * (e.g. `?redirect=`) can't be used to send a signed-in user off-site.
 */
export function safeRedirect(path: string | null, fallback = "/dashboard") {
  if (path && /^\/(?!\/|\\)[\w\-.+/@]*(?:\?[\w\-.+/=&%@]*)?$/.test(path)) {
    return path;
  }
  return fallback;
}
