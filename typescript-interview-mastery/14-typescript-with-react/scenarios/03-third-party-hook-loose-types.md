# Scenario: A Third-Party Data Hook with Loosely-Typed Results

Your app uses a third-party data-fetching library whose hook is typed like this:

```tsx
declare function useQuery<T = unknown>(key: string, fetcher: () => Promise<T>): {
  data: T | undefined;
  isLoading: boolean;
  error: unknown;
};
```

A component consuming it does this, and it compiles, but crashes intermittently in production:

```tsx
interface Invoice {
  id: string;
  amountDue: number;
}

function InvoiceSummary({ invoiceId }: { invoiceId: string }) {
  const { data, isLoading } = useQuery(`invoice-${invoiceId}`, () =>
    fetch(`/api/invoices/${invoiceId}`).then((r) => r.json())
  );

  return <div>{isLoading ? "Loading..." : `Due: $${data.amountDue}`}</div>;
}
```

**Approach:**

There are two separate problems layered here. First, the call site never supplied the generic `T`, so `data`'s type defaults to `unknown | undefined`, meaning `data.amountDue` shouldn't even compile — if it *did* compile in the actual project, it's almost certainly because `strict`/`noImplicitAny`-adjacent checks are lax, or `data` is being accessed inside a context where TS silently widened something to `any`. Even fixing the generic doesn't fully solve the crash risk, because `isLoading` and "`data` is defined" are two different booleans that this code conflates — `data` can still be `undefined` even after `isLoading` becomes `false`, specifically on error.

```tsx
function InvoiceSummary({ invoiceId }: { invoiceId: string }) {
  const { data, isLoading, error } = useQuery<Invoice>(
    `invoice-${invoiceId}`,
    () => fetch(`/api/invoices/${invoiceId}`).then((r) => r.json())
  );

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Failed to load invoice.</div>;
  if (!data) return <div>No invoice found.</div>;

  return <div>Due: ${data.amountDue.toFixed(2)}</div>;
}
```

Supplying `useQuery<Invoice>(...)` explicitly fixes the first problem — `data` is now `Invoice | undefined`, and `data.amountDue` would correctly fail to compile until the `undefined` case is handled, matching what strict mode should have caught immediately (this is the same `strictNullChecks` protection covered in `13-tsconfig-strict-mode`, applied to a library's generic return type instead of your own function). The `if (!data) return ...` branch handles the genuinely distinct "finished loading, but nothing came back" case — a request that resolves successfully with an empty/null body, or an error state that this particular hook chooses to represent by leaving `data` undefined rather than throwing.

**Lesson:** a generic hook that defaults its type parameter to `unknown` is only as safe as the call site that supplies (or forgets to supply) the actual type — always pass the explicit generic for third-party data hooks rather than relying on inference from an untyped `fetcher` callback, and treat "loading finished" and "data present" as two separate booleans to check, not one.
