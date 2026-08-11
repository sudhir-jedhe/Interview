const baseUrl =
  process.env.NEXT_PUBLIC_APP_URL ?? "https://hireloop.yogeshchavan.dev";

export async function GET() {
  const body = `User-Agent: *
Allow: /
Disallow: /dashboard
Disallow: /applications
Disallow: /board
Disallow: /calendar
Disallow: /analytics
Disallow: /settings
Content-Signal: ai-train=no, search=yes, ai-input=no

Sitemap: ${baseUrl}/sitemap.xml
`;

  return new Response(body, {
    headers: { "Content-Type": "text/plain" },
  });
}
