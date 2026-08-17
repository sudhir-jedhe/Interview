# Snippets: Suspense & Code Splitting

### 1. Basic lazy component with Suspense fallback
```jsx
const Profile = React.lazy(() => import("./Profile"));

function App() {
  return (
    <Suspense fallback={<p>Loading profile...</p>}>
      <Profile />
    </Suspense>
  );
}
```

### 2. Lazy-loading a module with named exports
```jsx
// Chart.js exports `export function Chart() {...}` (named, not default)
const Chart = React.lazy(() =>
  import("./Chart").then((mod) => ({ default: mod.Chart }))
);

function Report() {
  return (
    <Suspense fallback={<p>Loading chart...</p>}>
      <Chart />
    </Suspense>
  );
}
```

### 3. Route-level code splitting
```jsx
const Home = React.lazy(() => import("./routes/Home"));
const About = React.lazy(() => import("./routes/About"));

function AppRoutes() {
  return (
    <Suspense fallback={<PageSpinner />}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </Suspense>
  );
}
```

### 4. Multiple lazy components under one shared boundary
```jsx
const Sidebar = React.lazy(() => import("./Sidebar"));
const MainContent = React.lazy(() => import("./MainContent"));

function Layout() {
  return (
    <Suspense fallback={<p>Loading page...</p>}>
      <Sidebar />
      <MainContent />
    </Suspense>
  );
}
```

### 5. Conditionally rendering a lazy modal (loaded only on demand)
```jsx
const SettingsModal = React.lazy(() => import("./SettingsModal"));

function Toolbar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button onClick={() => setOpen(true)}>Settings</button>
      {open && (
        <Suspense fallback={<p>Loading...</p>}>
          <SettingsModal onClose={() => setOpen(false)} />
        </Suspense>
      )}
    </>
  );
}
```

### 6. Error boundary wrapping Suspense to catch failed chunk loads
```jsx
class ErrorBoundary extends React.Component {
  state = { hasError: false };
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  render() {
    if (this.state.hasError) {
      return (
        <p>
          Something failed to load.{" "}
          <button onClick={() => this.setState({ hasError: false })}>Retry</button>
        </p>
      );
    }
    return this.props.children;
  }
}

const Widget = React.lazy(() => import("./Widget"));

function App() {
  return (
    <ErrorBoundary>
      <Suspense fallback={<p>Loading...</p>}>
        <Widget />
      </Suspense>
    </ErrorBoundary>
  );
}
```

### 7. Nested Suspense boundaries for staggered loading
```jsx
const Comments = React.lazy(() => import("./Comments"));

function Article({ post }) {
  return (
    <Suspense fallback={<ArticleSkeleton />}>
      <ArticleBody post={post} />
      {/* Comments has its own inner boundary so slow comments
          don't block the article body from appearing */}
      <Suspense fallback={<p>Loading comments...</p>}>
        <Comments postId={post.id} />
      </Suspense>
    </Suspense>
  );
}
```
