# Problem 2: Fix a Custom Hook That Loses Tuple Typing

## The setup

A teammate wrote a `usePagination` hook meant to be used like `useState`, returning `[page, nextPage, prevPage]`. It compiles, but consumers are getting confusing type errors trying to call `nextPage()`.

```tsx
function usePagination(initialPage = 1) {
  const [page, setPage] = useState(initialPage);

  const nextPage = () => setPage((p) => p + 1);
  const prevPage = () => setPage((p) => Math.max(1, p - 1));

  return [page, nextPage, prevPage];
}

function ResultsList() {
  const [page, nextPage, prevPage] = usePagination();

  return (
    <div>
      <button onClick={prevPage}>Prev</button>
      <span>Page {page}</span>
      <button onClick={nextPage}>Next</button>
    </div>
  );
}
```

## Your task

1. Explain exactly what TypeScript infers for `page`, `nextPage`, and `prevPage` in `ResultsList`, and why the `onClick` bindings fail to compile.
2. Fix `usePagination` so destructured consumers get accurate types with no type errors.

## Reference solution

**Diagnosis:** `return [page, nextPage, prevPage];` is a plain array literal with no positional type information — TypeScript applies best-common-type inference across all three elements and produces a single union type shared by every position: `(number | (() => void))[]`. After destructuring in `ResultsList`, `page`, `nextPage`, and `prevPage` are *all* individually typed as `number | (() => void)`, regardless of which one is actually the number and which are actually functions. `onClick={prevPage}` fails because `prevPage`'s type includes `number`, which isn't a valid `onClick` handler — TypeScript can't be sure at that point whether `prevPage` holds the number or a function, since the array's element type erased that distinction entirely.

**Fix — `as const`:**

```tsx
function usePagination(initialPage = 1) {
  const [page, setPage] = useState(initialPage);

  const nextPage = () => setPage((p) => p + 1);
  const prevPage = () => setPage((p) => Math.max(1, p - 1));

  return [page, nextPage, prevPage] as const;
}
```

`as const` converts the returned array literal into a fixed-length `readonly [number, () => void, () => void]` tuple, preserving each position's specific type. After this change, `ResultsList`'s destructuring correctly infers `page: number`, `nextPage: () => void`, `prevPage: () => void`, and both `onClick` bindings compile without error.

**Alternative fix — explicit return type annotation:**

```tsx
function usePagination(initialPage = 1): [number, () => void, () => void] {
  const [page, setPage] = useState(initialPage);
  const nextPage = () => setPage((p) => p + 1);
  const prevPage = () => setPage((p) => Math.max(1, p - 1));
  return [page, nextPage, prevPage];
}
```

This also works, because the explicit tuple return type contextually types the returned array literal. It's more verbose to keep in sync if the hook's return shape changes, but is worth knowing as an equally valid alternative to `as const` — some teams prefer it because the tuple shape is visible directly in the function signature without needing to read the `return` statement.

## Takeaway

Any custom hook that returns a positional array (mimicking `useState`'s `[value, setValue]` convention) needs either `as const` on the returned array literal or an explicit tuple return-type annotation — without one of these, the hook silently degrades from a typed tuple into an untyped, order-agnostic union array, and the type error only surfaces later, at the *consuming* component, often looking unrelated to the actual root cause in the hook itself.
