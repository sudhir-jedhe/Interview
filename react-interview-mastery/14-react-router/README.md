# React Router

React Router is the standard client-side routing library for React SPAs, mapping URL paths to component trees without full page reloads by intercepting navigation and swapping rendered content via the History API. This topic covers the core building blocks (`Route`, `Routes`, `Link`, `useNavigate`, `useParams`, `useLocation`, `useSearchParams`), nested/layout routes for shared UI shells, the protected-route pattern for auth-gated pages, dynamic route matching, programmatic navigation, and a brief look at modern data-loading via loader functions — plus why SPA routing needs to hijack link clicks in the first place instead of letting the browser do its default full-page-navigation thing.

## What's covered
- Core APIs: `Route`, `Routes`, `Link` vs `<a>`, `useNavigate`, `useParams`, `useLocation`, `useSearchParams`
- Nested routes and layout routes
- Protected/private route pattern with a worked auth-check example
- Dynamic route matching
- Programmatic navigation
- Loader functions concept (modern data loading)
- Client-side routing vs full page reload, and why SPA routing intercepts link clicks

> Looking for your original notes on this? See `../SOURCE-MAP.md`.
