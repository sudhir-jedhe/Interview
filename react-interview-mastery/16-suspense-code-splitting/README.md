# Suspense & Code Splitting

Shipping your entire app as one JavaScript bundle means users download code for routes and features they may never visit, which directly hurts initial load performance. This topic covers `React.lazy` and `Suspense` as the primary React-native mechanism for code splitting — deferring the download of a component's code until it's actually needed — and how to pair it with error boundaries for a complete loading/error UX. It also covers Suspense's broader, still-evolving role as a general-purpose "wait for something async" primitive in React 18, including data fetching, without pretending that story is fully settled or library-agnostic yet.

## What's covered
- Why code splitting matters for bundle size and initial load
- `React.lazy` for deferring component code
- `Suspense` and its `fallback` prop
- Lazy-loading routes vs lazy-loading individual components
- Error boundaries + Suspense working together
- Suspense for data fetching (concept-level, React 18's direction)

> Looking for your original notes on this? See `../SOURCE-MAP.md`.
