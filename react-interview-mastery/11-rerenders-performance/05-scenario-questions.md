# Scenario Questions

### 1. You're building a dashboard with a live-updating "notifications" counter in the header. Every time a notification arrives (every few seconds via websocket), the entire page — including a large, expensive `<ReportChart>` component — visibly re-renders and stutters. How do you fix it?

**Approach:** The root cause is almost certainly that the notification state lives in a top-level provider/component that also renders `ReportChart` as a child, so every state update cascades down. Two complementary fixes:

```jsx
// 1. Isolate the fast-changing state into its own component so only it re-renders.
function NotificationBadge() {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const sub = subscribeToNotifications(() => setCount(c => c + 1));
    return () => sub.unsubscribe();
  }, []);
  return <span className="badge">{count}</span>;
}

function Header() {
  return (
    <header>
      <Logo />
      <NotificationBadge /> {/* only this re-renders on new notifications */}
    </header>
  );
}

// 2. If ReportChart must stay a sibling under a shared re-rendering ancestor, memoize it.
const ReportChart = React.memo(function ReportChart({ data }) {
  /* expensive render */
  return <canvas ref={/* ... */} />;
});
```

Verify with the Profiler that `ReportChart` no longer shows up in the commit triggered by a notification. If `ReportChart`'s props include inline objects/arrays from the parent, stabilize those with `useMemo` too — otherwise `memo` won't help.

---

### 2. Product wants an editable table with 5,000 rows. Currently it's `data.map(row => <TableRow ... />)` and the browser tab freezes on load and scroll is janky. What do you do?

**Approach:** 5,000 real DOM rows is the actual problem, not re-render logic. Reach for virtualization:

```jsx
import { FixedSizeList as List } from 'react-window';

function BigTable({ rows }) {
  const Row = ({ index, style }) => (
    <div style={style} className="table-row">
      {rows[index].name} — {rows[index].value}
    </div>
  );
  return (
    <List height={600} width="100%" itemCount={rows.length} itemSize={35}>
      {Row}
    </List>
  );
}
```

Only the ~20 rows visible in the 600px viewport (plus overscan) mount at once; scrolling swaps content instead of growing the DOM. If rows are editable, keep the "is this row being edited" state either in the row data itself (keyed by row id) or in a `Set` of editing IDs at the parent level — not in local component state, since virtualized rows unmount/remount as they scroll out and back into the buffer.

---

### 3. A teammate wrapped every single component in the app with `React.memo` "for performance," and now a form with dependent fields (selecting a country doesn't update the city dropdown) is broken. What's going on and how do you fix it?

**Approach:** This is the classic `memo` shallow-comparison trap combined with over-application. The city dropdown probably receives a `cities` array or an `onSelect` callback computed inline in the parent:

```jsx
// Before (broken): new array reference every render, but that's not even the bug here —
// the actual bug is usually a *missing* dependency somewhere, or memo on a component
// that legitimately needs to reflect prop changes it's not detecting.
const CityDropdown = React.memo(function CityDropdown({ cities, value, onChange }) {
  return (
    <select value={value} onChange={e => onChange(e.target.value)}>
      {cities.map(c => <option key={c}>{c}</option>)}
    </select>
  );
});
```

Diagnosis: if `cities` is derived synchronously from `country` in the parent (`const cities = COUNTRY_CITIES[country]`), a new array is created each render, so a naive custom comparator or a bug in how `memo`'s default comparison interacts with it isn't the actual cause — `memo`'s default is correct here and *would* re-render since the array reference always differs. The likely real bug is a teammate passing a **custom `arePropsEqual`** to `memo` that only compares `value`, not `cities`. Fix: remove the faulty custom comparator, or better, remove `memo` from components that aren't leaf/list-row components with genuinely stable props — blanket `memo` usage adds comparison overhead everywhere and creates exactly this class of stale-prop bug when someone "helpfully" narrows the comparator.

---

### 4. Users report that a checkout form's "Apply Coupon" button becomes unresponsive-feeling — clicking it causes a visible ~300ms freeze — only when the cart has 50+ line items. How do you diagnose and fix this?

**Approach:** Record the click in the React DevTools Profiler to see which components render during that commit and how long each takes. Likely finding: the coupon click updates a single piece of state (e.g., `discount`) at the top of the page, and because the 50+ cart line items aren't memoized, all of them re-render and recompute derived values (formatting, tax calc) even though none of their props actually changed.

```jsx
// Before: every CartLine re-renders when discount changes, even though CartLine
// doesn't use discount at all.
function CartLine({ item }) {
  const formatted = formatCurrency(item.price * item.qty); // recomputed every time
  return <li>{item.name}: {formatted}</li>;
}

// After: memoize the row so it only re-renders when its own item changes.
const CartLine = React.memo(function CartLine({ item }) {
  const formatted = useMemo(() => formatCurrency(item.price * item.qty), [item]);
  return <li>{item.name}: {formatted}</li>;
});
```

Also move `discount`/coupon state so it doesn't live in a component that's an ancestor of the cart list unless necessary — e.g., keep the order summary (which needs `discount`) as a sibling, not a wrapper, of the cart list. Confirm the fix by re-profiling: the commit triggered by "Apply Coupon" should now only show the order summary re-rendering, not all 50 `CartLine`s.
