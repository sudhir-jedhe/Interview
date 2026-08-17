# Scenario Questions: Design Patterns & Anti-Patterns

### 1. A settings page passes the same five props through four component layers
You inherit a settings page where `theme`, `locale`, `currentUser`, and two callback props are threaded through `SettingsPage` → `SettingsLayout` → `SettingsSection` → `SettingsField`, even though only `SettingsField` actually uses most of them. Adding a new setting means touching all four files.

**Approach:** Identify which props are cross-cutting concerns (theme, locale, currentUser — good candidates for context) versus which are genuinely specific to a particular field (a callback tied to one specific setting, better passed directly or via composition). Move the cross-cutting ones to context, and restructure the layout components to accept `children` instead of forwarding unrelated props.
```jsx
const SettingsContext = createContext();

function SettingsPage({ user }) {
  return (
    <SettingsContext.Provider value={{ theme: user.theme, locale: user.locale, user }}>
      <SettingsLayout>
        <SettingsSection title="Notifications">
          <SettingsField name="emailAlerts" />
        </SettingsSection>
      </SettingsLayout>
    </SettingsContext.Provider>
  );
}

function SettingsLayout({ children }) {
  return <div className="settings-layout">{children}</div>; // no prop knowledge needed
}

function SettingsField({ name }) {
  const { theme, user } = useContext(SettingsContext);
  // reads what it needs directly, no drilling
  return <div className={theme}>...</div>;
}
```
Now adding a new setting only touches the leaf component and doesn't require editing the layout/section components' prop signatures at all.

---

### 2. A list of draggable cards loses input focus and shows wrong data after reordering
You're building a Kanban-style board where cards can be dragged to reorder within a column. Users report that after dragging, the wrong card sometimes appears "selected," and any inline edit text they'd typed jumps to a different card.

**Approach:** This is the index-as-key bug. The list is almost certainly keyed by array index, so reordering the underlying array doesn't correspond to reordering the rendered DOM nodes/component instances correctly — React reuses instances by position, not identity. Fix by keying on each card's actual stable ID.
```jsx
// Before
{cards.map((card, i) => <Card key={i} card={card} />)}

// After
{cards.map((card) => <Card key={card.id} card={card} />)}
```
With `key={card.id}`, React correctly tracks which component instance corresponds to which card across reorders, so local state (selection, in-progress edits) stays attached to the right card instead of "sticking" to a DOM position.

---

### 3. A 900-line `Dashboard.jsx` file is hard to review and slow to change
The component fetches data for four separate widgets, manages a dozen `useState` calls, computes several derived values, and renders a huge JSX tree — every PR touching any one widget has a large, risky diff because everything lives in one file.

**Approach:** Split by responsibility: extract each widget's data-fetching into its own custom hook, extract each widget's JSX into its own component, and keep `Dashboard` as a thin composition layer.
```jsx
// Before: everything inline in Dashboard
function Dashboard() {
  const [revenue, setRevenue] = useState(null);
  const [traffic, setTraffic] = useState(null);
  // ...10 more state variables, 4 useEffects, huge JSX
}

// After
function useRevenueData() {
  const [revenue, setRevenue] = useState(null);
  useEffect(() => { fetchRevenue().then(setRevenue); }, []);
  return revenue;
}

function RevenueWidget() {
  const revenue = useRevenueData();
  if (!revenue) return <WidgetSkeleton />;
  return <RevenueChart data={revenue} />;
}

function Dashboard() {
  return (
    <div className="grid">
      <RevenueWidget />
      <TrafficWidget />
      <ChurnWidget />
      <SupportWidget />
    </div>
  );
}
```
Each widget is now independently testable, independently reviewable, and a PR touching `RevenueWidget` no longer risks the other three.

---

### 4. Every product card on a listing page fetches its own review summary, tanking performance
A product listing page renders 40 `ProductCard` components, and each one independently calls `/api/reviews/summary?productId=X` in its own `useEffect`, firing 40 simultaneous requests on page load.

**Approach:** Lift the fetch to the parent (batch-fetch all summaries in one request if the API supports it) or introduce a shared cache/dedup layer so identical concurrent requests collapse into one, then pass the relevant summary down as a prop.
```jsx
// Before: each card fetches independently
function ProductCard({ product }) {
  const [summary, setSummary] = useState(null);
  useEffect(() => {
    fetch(`/api/reviews/summary?productId=${product.id}`).then((r) => r.json()).then(setSummary);
  }, [product.id]);
  // ...
}

// After: parent fetches once, in bulk
function ProductList({ products }) {
  const [summaries, setSummaries] = useState({});

  useEffect(() => {
    const ids = products.map((p) => p.id).join(",");
    fetch(`/api/reviews/summary?productIds=${ids}`)
      .then((r) => r.json())
      .then((data) => setSummaries(Object.fromEntries(data.map((s) => [s.productId, s]))));
  }, [products]);

  return (
    <div className="grid">
      {products.map((p) => (
        <ProductCard key={p.id} product={p} summary={summaries[p.id]} />
      ))}
    </div>
  );
}

function ProductCard({ product, summary }) {
  return (
    <div>
      <h3>{product.name}</h3>
      {summary ? <StarRating value={summary.avgRating} /> : <RatingSkeleton />}
    </div>
  );
}
```
This turns 40 requests into 1, and `ProductCard` becomes a pure, testable presentational component with no fetching logic of its own.

---

### 5. A form's derived "is valid" state gets out of sync after a bug report
A signup form uses `useEffect` to compute `isFormValid` whenever any field changes, storing it in its own state variable. QA reports that after fixing a validation rule, the submit button is sometimes enabled for a split second on invalid data before flipping back to disabled.

**Approach:** The root cause is storing a derivable value (`isFormValid`) in its own state instead of computing it during render — the effect-based sync always lags one render behind the fields that actually changed, creating the flash QA saw. Remove the effect and compute validity directly in the render body.
```jsx
// Before
const [isFormValid, setIsFormValid] = useState(false);
useEffect(() => {
  setIsFormValid(email.includes("@") && password.length >= 8);
}, [email, password]);

// After
const isFormValid = email.includes("@") && password.length >= 8;
```
Since `isFormValid` is now computed fresh every render from the current `email`/`password` values, there's no intermediate render where it reflects stale field values — the flash disappears because there's no longer a separate state variable that can be out of sync with its inputs, and one fewer render cycle happens on every keystroke.
