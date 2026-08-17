# Scenario Questions

### 1. You're building a dashboard with five independent widgets (weather, stock ticker, news, calendar, todo list). Currently one buggy widget crashing takes down the entire dashboard with a blank white screen. How do you architect this to be resilient?

**Approach:** Wrap each widget individually in its own error boundary, plus keep one global boundary at the app root as a last resort for anything outside the widget grid (routing errors, layout bugs).

```jsx
function Widget({ title, children }) {
  return (
    <ErrorBoundary
      fallback={
        <div className="widget-error">
          <p>{title} couldn't load.</p>
        </div>
      }
    >
      <section>
        <h2>{title}</h2>
        {children}
      </section>
    </ErrorBoundary>
  );
}

function Dashboard() {
  return (
    <div className="grid">
      <Widget title="Weather"><WeatherWidget /></Widget>
      <Widget title="Stocks"><StockTicker /></Widget>
      <Widget title="News"><NewsFeed /></Widget>
      <Widget title="Calendar"><CalendarWidget /></Widget>
      <Widget title="Todo"><TodoList /></Widget>
    </div>
  );
}
```

Now a crash in `StockTicker` shows "Stocks couldn't load" in that one grid cell while the other four widgets keep working — the failure is contained to exactly the section that failed.

---

### 2. QA reports that when a network request fails inside a `useEffect`, the app doesn't show any error — it just silently shows a stale/empty state, and no error boundary catches it. Why, and how do you fix it?

**Approach:** Error boundaries never catch errors from async code — a rejected promise inside `useEffect` happens outside React's render call stack, so `getDerivedStateFromError`/`componentDidCatch` simply never see it. Fix by catching the rejection explicitly and turning it into React state, which *will* trigger a normal re-render (and can even be re-thrown during render to let a boundary handle it uniformly):

```jsx
function UserProfile({ userId }) {
  const [state, setState] = useState({ status: 'loading', data: null, error: null });

  useEffect(() => {
    let cancelled = false;
    setState({ status: 'loading', data: null, error: null });
    fetchUser(userId)
      .then(data => { if (!cancelled) setState({ status: 'success', data, error: null }); })
      .catch(error => { if (!cancelled) setState({ status: 'error', data: null, error }); });
    return () => { cancelled = true; };
  }, [userId]);

  if (state.status === 'error') {
    // re-throw during render so the nearest error boundary handles it uniformly
    throw state.error;
  }
  if (state.status === 'loading') return <Spinner />;
  return <h1>{state.data.name}</h1>;
}
```

This "throw during render" trick is exactly what `react-error-boundary`'s `useErrorHandler` does under the hood — it bridges an async error into React's synchronous render phase so an existing error boundary can catch and display it consistently with render-time errors.

---

### 3. Your app has a global error boundary showing "Something went wrong, please refresh," but users are hitting it for a transient, recoverable issue (a flaky third-party script failing to load), and refreshing the whole page is a bad experience for what should be a quick retry. How do you improve this?

**Approach:** Give the boundary a reset mechanism instead of forcing a full page reload, and scope the boundary tighter around just the flaky dependency if possible:

```jsx
import { ErrorBoundary } from 'react-error-boundary';

function ThirdPartyWidgetFallback({ error, resetErrorBoundary }) {
  return (
    <div>
      <p>This widget failed to load: {error.message}</p>
      <button onClick={resetErrorBoundary}>Retry</button>
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary
      FallbackComponent={ThirdPartyWidgetFallback}
      onReset={() => {
        // clear whatever bad state caused the failure before remounting children
        clearThirdPartyScriptCache();
      }}
    >
      <ThirdPartyEmbed />
    </ErrorBoundary>
  );
}
```

Scoping the boundary around just `ThirdPartyEmbed` (rather than the whole app) means a transient failure there no longer takes down unrelated parts of the page, and `resetErrorBoundary` re-mounts just that subtree for a quick retry without a full page refresh.

---

### 4. A senior engineer asks you to add error handling around a `<button onClick={handleCheckout}>` where `handleCheckout` can throw if payment validation fails. A junior engineer suggests wrapping the button in an `<ErrorBoundary>`. Why won't that work, and what should you do instead?

**Approach:** Explain that error boundaries don't catch event handler errors at all — the click handler executes outside any render/commit call stack the boundary could intercept, so wrapping the button changes nothing. Handle it with a local `try/catch` and turn the failure into UI state directly:

```jsx
function CheckoutButton() {
  const [error, setError] = useState(null);

  function handleCheckout() {
    try {
      validatePayment(); // may throw
      submitOrder();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div>
      <button onClick={handleCheckout}>Checkout</button>
      {error && <p className="error-text">{error}</p>}
    </div>
  );
}
```

This is the correct pattern for expected, user-facing failures (validation errors) — surface them as regular UI state, not by trying to route them through an error boundary that structurally can't see them.
