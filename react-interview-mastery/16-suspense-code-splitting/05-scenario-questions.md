# Scenario Questions: Suspense & Code Splitting

### 1. Initial load is slow because of a rarely-used rich text editor
You're building a CMS. The article editor page bundles a large WYSIWYG library that's only needed when a user clicks "Edit," but it's currently imported at the top of the file, so it ships with every page load, including the read-only article view.

**Approach:** Split the editor out with `React.lazy`, loaded only when the user actually enters edit mode, and wrap it in `Suspense` with an error boundary for failed chunk loads (e.g., a stale deploy where the chunk hash no longer exists).
```jsx
const RichTextEditor = React.lazy(() => import("./RichTextEditor"));

function ArticlePage({ article }) {
  const [editing, setEditing] = useState(false);

  return (
    <div>
      <ArticleView article={article} />
      <button onClick={() => setEditing(true)}>Edit</button>
      {editing && (
        <ErrorBoundary fallback={<EditorLoadError onRetry={() => setEditing(false)} />}>
          <Suspense fallback={<p>Loading editor...</p>}>
            <RichTextEditor initialContent={article.body} />
          </Suspense>
        </ErrorBoundary>
      )}
    </div>
  );
}
```
This keeps the read-only view's bundle lean; the editor's weight is only paid by users who actually edit.

---

### 2. Users on slow connections see a jarring blank screen during route transitions
Your app is a single-page app with lazily-loaded routes. Users report that clicking a nav link causes the whole screen to go blank for a moment before the new page pops in, which feels broken rather than "loading."

**Approach:** The blank screen is the Suspense fallback rendering `null` or an under-designed fallback, and possibly a boundary placed too high (wrapping the whole app, wiping out the still-valid old page instead of transitioning gracefully). Two fixes: give the fallback real skeleton UI instead of a blank/spinner-only state, and consider `useTransition` (React 18) to keep the old route visible while the new one loads instead of unmounting immediately.
```jsx
const Settings = React.lazy(() => import("./routes/Settings"));

function AppRoutes() {
  const [isPending, startTransition] = useTransition();
  const [route, setRoute] = useState("home");

  function navigate(next) {
    startTransition(() => setRoute(next));
  }

  return (
    <div style={{ opacity: isPending ? 0.6 : 1 }}>
      <Suspense fallback={<PageSkeleton />}>
        {route === "home" && <Home />}
        {route === "settings" && <Settings />}
      </Suspense>
    </div>
  );
}
```
`startTransition` marks the route change as non-urgent, so React keeps showing the current page (dimmed via `isPending`) instead of immediately unmounting it for the fallback, avoiding the jarring blank-screen flash.

---

### 3. A third-party charting library is huge and only used on one admin report
The main bundle includes a charting library (~300KB gzipped) that's only rendered on a single infrequently-visited admin analytics page, inflating load time for every user including ones who never see a chart.

**Approach:** Lazy-load the chart component specifically, not the whole admin page (if the admin page has other lightweight content worth showing immediately), and add a skeleton fallback matching the chart's dimensions to avoid layout shift.
```jsx
const RevenueChart = React.lazy(() => import("./charts/RevenueChart"));

function AdminAnalytics({ data }) {
  return (
    <div>
      <h1>Analytics</h1>
      <SummaryStats data={data} />
      <ErrorBoundary fallback={<p>Chart failed to load.</p>}>
        <Suspense fallback={<ChartSkeleton height={400} />}>
          <RevenueChart data={data} />
        </Suspense>
      </ErrorBoundary>
    </div>
  );
}
```
`SummaryStats` renders immediately since it doesn't depend on the heavy library; only the chart itself is deferred and isolated, keeping the rest of the page responsive.

---

### 4. A deploy breaks lazy-loaded chunks for users with old tabs open
After a new deploy, users who had the app open in a browser tab before the deploy get a hard crash when they navigate to a lazily-loaded route, because the old chunk filename (with its content hash) no longer exists on the server.

**Approach:** This is a chunk-loading error, not a "not ready yet" state, so it needs an error boundary above the Suspense boundary. The recovery action should be a hard reload (to fetch the new app shell and asset manifest), not just "try again," since the client-side module reference is permanently broken.
```jsx
class ChunkErrorBoundary extends React.Component {
  state = { failed: false };

  static getDerivedStateFromError(error) {
    return { failed: true };
  }

  render() {
    if (this.state.failed) {
      return (
        <div>
          <p>A new version of the app is available.</p>
          <button onClick={() => window.location.reload()}>Reload</button>
        </div>
      );
    }
    return this.props.children;
  }
}

function AppRoutes() {
  return (
    <ChunkErrorBoundary>
      <Suspense fallback={<PageSkeleton />}>
        <Router />
      </Suspense>
    </ChunkErrorBoundary>
  );
}
```
A full reload gets the user a fresh `index.html` with correct chunk references, resolving the mismatch that a component-level retry can't fix.

---

### 5. Product wants a "data is ready, then reveal" feel for a dashboard, not a spinner-then-pop
Design wants dashboard widgets to load in gracefully rather than showing spinners that pop away abruptly, and wants slow widgets to not block fast ones from appearing.

**Approach:** Give each independently-loading widget its own nested Suspense boundary so fast widgets appear as soon as they're ready without waiting on slow ones, and use skeleton placeholders sized like the real content instead of centered spinners to reduce layout shift.
```jsx
const RevenueWidget = React.lazy(() => import("./widgets/Revenue"));
const TrafficWidget = React.lazy(() => import("./widgets/Traffic"));
const ChurnWidget = React.lazy(() => import("./widgets/Churn"));

function Dashboard() {
  return (
    <div className="grid">
      <Suspense fallback={<WidgetSkeleton />}>
        <RevenueWidget />
      </Suspense>
      <Suspense fallback={<WidgetSkeleton />}>
        <TrafficWidget />
      </Suspense>
      <Suspense fallback={<WidgetSkeleton />}>
        <ChurnWidget />
      </Suspense>
    </div>
  );
}
```
Each widget suspends and resolves independently, matching the "reveal as ready, don't block on the slowest" requirement — a single shared boundary here would have made every widget wait for the slowest one.
