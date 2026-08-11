/**
 * The most likely cause of a route-level error in this app is a missing or
 * unreachable DATABASE_URL, so callers can point the user there first rather
 * than showing a bare stack trace.
 */
export function isDatabaseConnectionError(message: string): boolean {
  return /database_url|connect|econnrefused|password|timeout/i.test(message);
}
