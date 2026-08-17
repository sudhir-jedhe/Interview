# useMemo & useCallback

`useMemo` and `useCallback` are React's built-in memoization hooks — `useMemo` caches the result of an expensive computation between renders, and `useCallback` caches a function reference so it doesn't change identity on every render. This topic covers why referential equality matters at all (it's the difference between `React.memo` and effect dependency arrays working correctly or firing on every render), when memoization is actually worth the added complexity versus premature optimization that just adds noise, and the classic dependency-array bugs that make memoized values silently stale. It also nails down the precise relationship between `useCallback(fn, deps)` and `useMemo(() => fn, deps)` — they're the same thing under the hood.

## What's covered
- `useMemo` for caching expensive computed values between renders
- `useCallback` for caching function references between renders
- Why referential (`===`) equality matters for `React.memo` and `useEffect` dependency arrays
- Real cost/benefit: when memoization pays for itself vs when it's premature optimization
- Classic dependency-array bugs — stale values, missing deps, over-memoizing
- `useMemo(() => fn, [])` vs `useCallback(fn, [])` — identical results, different intent

> Looking for your original notes on this? See `../SOURCE-MAP.md`.
