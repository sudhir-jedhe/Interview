# Modeling a reusable API client

You're building a thin wrapper around `fetch` that every feature team in the company will use to call internal REST endpoints. Every endpoint returns JSON shaped differently, and the wrapper needs to give callers a fully-typed response without the client having to write `as SomeType` at every call site, and without collapsing everything to `any`.

**Approach:** Make the client function generic over the expected response shape, with the type parameter supplied at the call site (either explicitly or inferred from a caller-provided parser). Keep the *request* shape (URL, method, body) non-generic, since those are structurally uniform across endpoints, and only parameterize the piece that actually varies — the response.

```typescript
interface RequestOptions {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  body?: unknown;
  headers?: Record<string, string>;
}

async function apiRequest<TResponse>(
  url: string,
  options: RequestOptions = {}
): Promise<TResponse> {
  const res = await fetch(url, {
    method: options.method ?? "GET",
    body: options.body ? JSON.stringify(options.body) : undefined,
    headers: { "Content-Type": "application/json", ...options.headers },
  });

  if (!res.ok) {
    throw new Error(`Request failed: ${res.status} ${res.statusText}`);
  }

  return (await res.json()) as TResponse;
}

interface Invoice {
  id: string;
  amountDue: number;
  currency: string;
}

async function loadInvoice(id: string): Promise<Invoice> {
  return apiRequest<Invoice>(`/api/invoices/${id}`);
}

async function createInvoice(payload: Omit<Invoice, "id">): Promise<Invoice> {
  return apiRequest<Invoice>("/api/invoices", { method: "POST", body: payload });
}
```

The single `apiRequest<TResponse>` function is now reused for every endpoint in the app, with each call site declaring exactly what shape it expects back. The `as TResponse` cast at the bottom is unavoidable — `fetch`'s `.json()` genuinely returns `any` because there's no way to verify a JSON payload's shape at compile time — but it's contained to one line in the whole codebase instead of being sprinkled at every call site. Teams that want runtime safety on top of this typically pair `apiRequest` with a schema validator (Zod, Valibot) that both validates the payload and derives `TResponse` from the schema, closing the gap between "the compiler trusts this cast" and "we've actually checked it."
