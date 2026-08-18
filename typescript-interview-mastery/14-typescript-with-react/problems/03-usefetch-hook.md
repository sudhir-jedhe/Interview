# Problem 3: Type a `useFetch<T>` Custom Hook

## The setup

You need a reusable data-fetching hook usable across the app for any endpoint and response shape, returning `{ data: T | null, loading: boolean, error: string | null }`, and correctly handling request cancellation when the component unmounts or the URL changes mid-flight (to avoid setting state on an unmounted component or overwriting newer data with a stale response).

## Your task

Implement `useFetch<T>(url: string)` with:
1. A correctly-typed generic return object.
2. Proper handling of the loading/data/error state transitions.
3. Cleanup that prevents a stale response from overwriting newer state.

## Reference solution

```tsx
interface UseFetchResult<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

function useFetch<T>(url: string): UseFetchResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    setLoading(true);
    setError(null);

    fetch(url)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Request failed with status ${res.status}`);
        }
        return res.json() as Promise<T>;
      })
      .then((json) => {
        if (!cancelled) {
          setData(json);
          setLoading(false);
        }
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Unknown error");
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [url]);

  return { data, loading, error };
}
```

Usage:

```tsx
interface Invoice {
  id: string;
  amountDue: number;
}

function InvoiceView({ invoiceId }: { invoiceId: string }) {
  const { data, loading, error } = useFetch<Invoice>(`/api/invoices/${invoiceId}`);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!data) return <p>No invoice found.</p>;

  return <p>Due: ${data.amountDue.toFixed(2)}</p>;
}
```

## Key design decisions worth explaining

**Object return, not tuple:** three logically independent, differently-typed values (`data`, `loading`, `error`) read better with named object destructuring than positional tuple destructuring — there's no natural "primary pair" the way `[value, setValue]` has for `useState`, so an object avoids consumers having to remember argument order.

**`res.json() as Promise<T>` is a deliberate, narrow assertion, not validation:** the hook trusts the caller's `T` the same way `JSON.parse`'s return type is always `any` by default — there's no runtime proof the response actually matches `T`. This is an acceptable, common trade-off for a generic fetch hook (validating every possible `T` would require a schema per call site), but it's worth being explicit in review that this hook provides *type convenience*, not *runtime validation* — matching the caution raised about unchecked assertions in `12-type-inference-assertions`.

**The `cancelled` flag prevents two real bugs:** without it, if the component unmounts before the fetch resolves, calling `setData`/`setError` on an unmounted component logs a React warning (or in older React versions, could cause a memory leak). More subtly, if `url` changes before the *previous* fetch resolves (e.g., a user rapidly switching between two invoice IDs), an out-of-order response could arrive and overwrite the newer request's in-flight state with stale data — the `cancelled` flag set by each effect's own cleanup function ensures only the most recent fetch's result is ever applied.

**`error instanceof Error ? err.message : "Unknown error"`:** this narrows the `catch` variable (typed `unknown` under `useUnknownInCatchVariables`, part of `strict: true` — see `13-tsconfig-strict-mode`) before accessing `.message`, since JavaScript allows throwing non-`Error` values and assuming otherwise is a common source of `"Cannot read properties of undefined (reading 'message')"` errors inside catch blocks.
