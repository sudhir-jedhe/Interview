import { getSessionCookie } from "better-auth/cookies";
import { NextRequest, NextResponse } from "next/server";
import { NodeHtmlMarkdown } from "node-html-markdown";

// Non-content elements the landing page renders (theme script, analytics,
// icons) that add noise without adding anything an agent would want.
const nhm = new NodeHtmlMarkdown({
  ignore: ["script", "style", "svg", "noscript"],
});

// Rough token estimate (chars/4) — good enough for the `x-*-tokens` hint
// headers, no need for a real tokenizer here.
function estimateTokens(text: string) {
  return Math.ceil(text.length / 4);
}

export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === "/") {
    const accept = request.headers.get("accept") ?? "";
    if (!accept.includes("text/markdown")) return NextResponse.next();

    // Re-fetch the same URL asking for HTML; that request's Accept header
    // won't match the branch above, so this can't recurse.
    const htmlResponse = await fetch(request.url, {
      headers: { accept: "text/html" },
    });
    const html = await htmlResponse.text();
    const markdown = nhm.translate(html);

    return new Response(markdown, {
      status: htmlResponse.status,
      headers: {
        "content-type": "text/markdown; charset=utf-8",
        "x-markdown-tokens": String(estimateTokens(markdown)),
        "x-original-tokens": String(estimateTokens(html)),
      },
    });
  }

  // Cookie presence only — no DB round trip. Good enough for a redirect;
  // routes that need the real session still call `auth.api.getSession`.
  const hasSession = Boolean(getSessionCookie(request));

  if (pathname === "/login") {
    if (hasSession)
      return NextResponse.redirect(new URL("/dashboard", request.url));
    return NextResponse.next();
  }

  if (!hasSession) {
    const url = new URL("/login", request.url);
    url.searchParams.set("redirect", pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/login",
    "/dashboard/:path*",
    "/applications/:path*",
    "/board/:path*",
    "/analytics/:path*",
    "/calendar/:path*",
    "/settings/:path*",
  ],
};
