# Data Fetching Patterns

Fetching data in React components looks trivial until you hit race conditions, memory leaks from setting state after unmount, and duplicated network requests across siblings. This topic covers the manual `useEffect` fetch pattern end to end — including the parts most tutorials skip, like aborting stale requests and handling params that change quickly — and then explains why the ecosystem largely moved to libraries like React Query and SWR. The goal is to understand the underlying problem well enough that you could explain what those libraries buy you, not just how to call their hooks.

## What's covered
- The classic `useEffect` + `fetch`/`axios` pattern and its lifecycle pitfalls
- Race conditions when props/params change faster than requests resolve
- `AbortController` for cancelling in-flight requests on cleanup
- Hand-rolled loading/error/data state management
- Why React Query/SWR exist: caching, dedup, stale-while-revalidate, refetch-on-focus
- Waterfalls vs parallel fetching
- The concept of optimistic updates

> Looking for your original notes on this? See `../SOURCE-MAP.md`.
