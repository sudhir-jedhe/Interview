# Comparisons: Suspense & Code Splitting

### Route-level vs component-level code splitting

| Aspect | Route-level | Component-level |
|---|---|---|
| Granularity | One chunk per page/route | One chunk per heavy widget/feature |
| Typical win | Biggest bang for buck — most users only visit some routes | Smaller wins, targeted at specific heavy dependencies (editors, charts, maps) |
| Setup complexity | Usually just wrapping route elements in `React.lazy` | Requires identifying which specific components are "heavy enough" to bother |
| Common mistake | Not splitting at all, shipping one monolithic bundle | Splitting too aggressively (tiny components), adding request overhead without meaningful bundle savings |

Always do route-level splitting first — it's close to free with modern routers. Add component-level splitting only for specific, measurably heavy pieces (a rich text editor, a chart library) that aren't needed on initial render.

### Suspense fallback vs error boundary fallback

| Aspect | Suspense `fallback` | Error boundary fallback |
|---|---|---|
| Triggered by | A thrown promise (something not ready yet) | A thrown error (something went wrong) |
| Typical UI | Spinner, skeleton | Error message, retry button |
| Placement | Wraps the async subtree directly | Placed above the Suspense boundary to catch import/render failures |
| Common mistake | Using Suspense alone and assuming failed imports are handled | Forgetting Suspense entirely and letting a lazy component throw an unhandled "suspended" state as if it were an error |

They solve different problems and are typically used together: error boundary outside, Suspense inside, covering the "went wrong" and "not ready yet" cases respectively.

### Single shared Suspense boundary vs multiple nested boundaries

| Aspect | Single shared boundary | Multiple nested boundaries |
|---|---|---|
| Loading behavior | Everything waits for the slowest child, then reveals together | Each subtree reveals independently as soon as it's ready |
| Visual result | Clean, unified "whole section pops in" | Can feel more responsive, but risks layout shift as pieces arrive at different times |
| Complexity | Simpler to reason about and write | More boundaries to place and think through |
| Common mistake | Wrapping the entire app in one boundary, making a single slow widget block everything | Over-nesting boundaries around trivially fast components, adding no benefit and just complexity |

Use nested boundaries for genuinely independent, differently-paced sections (e.g., main content vs a comments panel); use one boundary for pieces that should visually appear as a single unit.

### `React.lazy` + Suspense vs framework-level code splitting (Next.js, etc.)

| Aspect | Manual `React.lazy` + Suspense | Framework-level (e.g., Next.js automatic route splitting) |
|---|---|---|
| Control | You explicitly choose split points | Often automatic per route/page out of the box |
| Data fetching integration | Not integrated — you still fetch data separately | Frameworks increasingly integrate Suspense with data loading (React Server Components, loaders) |
| Setup | Works in any React 18+ app with a bundler that supports dynamic `import()` | Tied to the framework's conventions and build pipeline |
| Common mistake | Manually re-implementing what the framework already does automatically for routes | Assuming the framework's data-Suspense integration generalizes to plain client-side `useEffect` fetching, which it doesn't |

If you're on a framework with built-in route-based splitting, don't hand-roll `React.lazy` for routes it already handles — reserve manual `React.lazy` for component-level splits the framework doesn't do for you.
