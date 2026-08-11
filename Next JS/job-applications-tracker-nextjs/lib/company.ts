/**
 * Maps well-known employer names to their primary domain so we can pull a
 * favicon for it. Anything unmapped falls back to initials, which is why the
 * list can stay short and honest rather than pretending to be exhaustive.
 */
const KNOWN_DOMAINS: Record<string, string> = {
  google: "google.com",
  alphabet: "google.com",
  microsoft: "microsoft.com",
  amazon: "amazon.com",
  aws: "aws.amazon.com",
  netflix: "netflix.com",
  meta: "meta.com",
  facebook: "meta.com",
  adobe: "adobe.com",
  atlassian: "atlassian.com",
  uber: "uber.com",
  airbnb: "airbnb.com",
  stripe: "stripe.com",
  vercel: "vercel.com",
  github: "github.com",
  openai: "openai.com",
  anthropic: "anthropic.com",
  cloudflare: "cloudflare.com",
  apple: "apple.com",
  spotify: "spotify.com",
  shopify: "shopify.com",
  linear: "linear.app",
  notion: "notion.so",
  figma: "figma.com",
  datadog: "datadoghq.com",
  razorpay: "razorpay.com",
  zerodha: "zerodha.com",
  swiggy: "swiggy.com",
  zomato: "zomato.com",
  flipkart: "flipkart.com",
  paytm: "paytm.com",
  freshworks: "freshworks.com",
  zoho: "zoho.com",
  infosys: "infosys.com",
  tcs: "tcs.com",
  wipro: "wipro.com",
};

export function companyDomain(companyName: string): string | null {
  const key = companyName.trim().toLowerCase();
  if (KNOWN_DOMAINS[key]) return KNOWN_DOMAINS[key];

  // "Stripe Inc." / "Adobe Systems" → try the first significant word.
  const first = key.split(/[\s,.()]+/).filter(Boolean)[0];
  return first && KNOWN_DOMAINS[first] ? KNOWN_DOMAINS[first] : null;
}

export function companyLogoUrl(companyName: string): string | null {
  const domain = companyDomain(companyName);
  // Clearbit's logo API was discontinued, so we fall back to Google's public
  // favicon service, which needs no API key and resolves any domain.
  return domain
    ? `https://www.google.com/s2/favicons?domain=${domain}&sz=128`
    : null;
}

/**
 * Deterministic accent per company so the initials fallback keeps a stable
 * colour across renders and pages.
 */
const ACCENTS = [
  "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400",
  "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  "bg-rose-500/10 text-rose-600 dark:text-rose-400",
  "bg-sky-500/10 text-sky-600 dark:text-sky-400",
  "bg-violet-500/10 text-violet-600 dark:text-violet-400",
];

export function companyAccent(companyName: string) {
  let hash = 0;
  for (let i = 0; i < companyName.length; i++) {
    hash = (hash * 31 + companyName.charCodeAt(i)) >>> 0;
  }
  return ACCENTS[hash % ACCENTS.length];
}
