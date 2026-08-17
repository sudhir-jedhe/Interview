# Scenario Questions

### 1. You inherit a codebase where every page component is wrapped like `withAuth(withTheme(withAnalytics(PageComponent)))`. A new engineer says the DevTools component tree is confusing and prop flow is hard to trace. How do you modernize this without a risky big-bang rewrite?

**Approach:** Migrate incrementally, one HOC at a time, starting with the least risky (analytics is a good first candidate since it's usually side-effect-only, not gating render).

```jsx
// Before: the analytics HOC injects nothing into render, just fires an effect
function withAnalytics(Wrapped) {
  return function WithAnalytics(props) {
    useEffect(() => { trackPageView(); }, []);
    return <Wrapped {...props} />;
  };
}

// After: extract to a hook, call it directly inside PageComponent (or a shared layout)
function useAnalytics() {
  useEffect(() => { trackPageView(); }, []);
}

function PageComponent(props) {
  useAnalytics();
  // ...rest of component, now one fewer wrapper in the tree
}
```

Repeat for `withTheme` (becomes `useTheme()` reading from context) and `withAuth` (becomes `useAuth()` plus an inline redirect/guard, or a `<ProtectedRoute>` wrapper at the routing layer instead of per-page). Do this page-by-page behind normal code review rather than a single sweeping refactor, since each HOC removal is independently testable and low-risk in isolation.

---

### 2. You're integrating a third-party charting library whose docs say "wrap your component with `withChartContext(YourComponent)` to receive the chart instance as a prop." A teammate wants to rewrite this as a hook before using it. What do you tell them?

**Approach:** Don't fight it — if the library only exposes a HOC (no exported hook), use it as documented rather than reverse-engineering an internal hook from library internals, which is fragile across library version upgrades.

```jsx
import { withChartContext } from 'third-party-charts';

function MyChartOverlay({ chartInstance }) {
  useEffect(() => {
    chartInstance.on('zoom', handleZoom);
    return () => chartInstance.off('zoom', handleZoom);
  }, [chartInstance]);
  return <div className="overlay" />;
}

export default withChartContext(MyChartOverlay);
```

If you want a hook-like ergonomic on your side, write a thin wrapper hook that consumes the prop the HOC injects, but keep the HOC boundary at the library integration point:

```jsx
function useChartInstance(chartInstance) {
  // just a pass-through convenience, still requires the HOC to supply chartInstance
  return chartInstance;
}
```

The key point: this is exactly the legitimate "library integration" case where a HOC remains the right call, because you don't control the library's internals and it hasn't shipped a hook API.

---

### 3. Your team built a `withPermission(requiredRole)(Component)` HOC that redirects unauthorized users. Two different pages need to check *two different* permissions before rendering, and nesting `withPermission('admin')(withPermission('billing')(Page))` feels wrong and the redirect logic fires twice, causing a flicker. How do you fix it?

**Approach:** Redesign as a single hook that accepts multiple required roles, so there's one gate, one redirect decision, and no wrapper stacking:

```jsx
// Before: two independent HOCs, each with its own redirect effect — races/double-redirects
function withPermission(role) {
  return function (Wrapped) {
    return function WithPermission(props) {
      const { roles } = useAuth();
      if (!roles.includes(role)) {
        useEffect(() => { navigate('/403'); }, []);
        return null;
      }
      return <Wrapped {...props} />;
    };
  };
}

// After: one hook, one decision
function useRequirePermissions(requiredRoles) {
  const { roles } = useAuth();
  const navigate = useNavigate();
  const allowed = requiredRoles.every(r => roles.includes(r));
  useEffect(() => {
    if (!allowed) navigate('/403');
  }, [allowed, navigate]);
  return allowed;
}

function BillingAdminPage() {
  const allowed = useRequirePermissions(['admin', 'billing']);
  if (!allowed) return null;
  return <PageContent />;
}
```

This collapses two wrapper layers (and two independent effects that could both fire a redirect) into a single explicit check with one redirect path, which also makes it trivial to test in isolation by mocking `useAuth`.

---

### 4. A component using the render-props pattern (`<MouseTracker>{(pos) => <Cursor {...pos}/>}</MouseTracker>`) is causing `Cursor` (a `memo`-wrapped, expensive-to-render SVG) to re-render on every single pixel of mouse movement, tanking frame rate. How do you fix this while keeping the render-props API?

**Approach:** The render-prop function itself is fine — the real issue is that `Cursor` receives a fresh position on every mouse-move event, which is legitimately supposed to update it. If the actual requirement is to throttle visual updates rather than track every pixel, throttle inside the provider:

```jsx
function MouseTracker({ children }) {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const frame = useRef(null);

  const handleMove = useCallback((e) => {
    if (frame.current) return; // drop events until next animation frame
    frame.current = requestAnimationFrame(() => {
      setPos({ x: e.clientX, y: e.clientY });
      frame.current = null;
    });
  }, []);

  return <div onMouseMove={handleMove}>{children(pos)}</div>;
}
```

This caps `setPos` (and therefore `Cursor`'s re-render) to once per animation frame (~60fps) instead of once per raw mousemove event (which can fire hundreds of times per second), fixing the perceived jank without changing the render-props contract consumers already depend on.
