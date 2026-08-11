const baseUrl =
  process.env.NEXT_PUBLIC_APP_URL ?? "https://hireloop.yogeshchavan.dev";

// better-auth's catch-all route is the only HTTP API HireLoop exposes;
// everything else (applications, board, analytics) is server actions, not
// a fetchable API surface. RFC 9727 linkset format.
export async function GET() {
  const body = {
    linkset: [
      {
        anchor: `${baseUrl}/api/auth`,
        "service-doc": [
          {
            href: "https://www.better-auth.com/docs",
            type: "text/html",
          },
        ],
      },
    ],
  };

  return new Response(JSON.stringify(body), {
    headers: { "Content-Type": "application/linkset+json" },
  });
}
