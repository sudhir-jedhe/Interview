# Notes: Design Patterns & Anti-Patterns

## Named patterns worth knowing

**Compound components** — a parent component implicitly shares state with its children via context, so the children can be composed flexibly while still coordinating (think `<Select>` / `<Select.Option>`, or `<Tabs>` / `<Tabs.Tab>`):

```jsx
function Tabs({ children, defaultIndex = 0 }) {
  const [active, setActive] = useState(defaultIndex);
  return (
    <TabsContext.Provider value={{ active, setActive }}>
      {children}
    </TabsContext.Provider>
  );
}
Tabs.Tab = function Tab({ index, children }) {
  const { active, setActive } = useContext(TabsContext);
  return (
    <button onClick={() => setActive(index)} aria-selected={active === index}>
      {children}
    </button>
  );
};
```

**Controlled vs uncontrolled components** — controlled means the value lives in React state and is set via `value`/`onChange`; uncontrolled means the DOM owns the value and you read it via a `ref` when needed. Controlled gives you validation-as-you-type and single-source-of-truth state; uncontrolled is simpler for basic forms and avoids re-rendering on every keystroke.

**Container/presentational** — separating data-fetching/logic ("container") from pure rendering ("presentational") components. This was more load-bearing before hooks, when logic reuse required class-component wrapper patterns; today custom hooks extract logic without forcing a component-splitting hierarchy, so this pattern shows up less as a strict rule and more as a general instinct ("keep display logic separate from data logic") than a named structural requirement.

## Anti-pattern: prop drilling instead of composition/context

Passing a prop through five layers of components that don't use it themselves, just to get it to a deeply nested consumer, couples every intermediate component to a prop it doesn't care about.

```jsx
// Before: theme drilled through Layout -> Header -> Nav -> UserMenu
function Layout({ theme }) {
  return <Header theme={theme} />;
}
function Header({ theme }) {
  return <Nav theme={theme} />;
}
function Nav({ theme }) {
  return <UserMenu theme={theme} />;
}

// After: context, or just composition (pass UserMenu as children)
const ThemeContext = createContext();
function Layout() {
  return <Header />; // no longer needs to know about theme
}
function UserMenu() {
  const theme = useContext(ThemeContext);
  return <div className={theme}>...</div>;
}
```

## Anti-pattern: deeply nested ternaries in JSX

```jsx
// Before
return status === "loading" ? <Spinner /> : status === "error" ? <ErrorMsg /> : status === "empty" ? <EmptyState /> : <List items={items} />;

// After
if (status === "loading") return <Spinner />;
if (status === "error") return <ErrorMsg />;
if (status === "empty") return <EmptyState />;
return <List items={items} />;
```
Nested ternaries are hard to scan and easy to get the precedence wrong on. Early returns or a small lookup object read far better.

## Anti-pattern: mutating state directly

```jsx
// Before — mutates the array in place, React doesn't see a change
function addItem(item) {
  items.push(item);
  setItems(items); // same reference, no re-render guaranteed
}

// After — new array, new reference
function addItem(item) {
  setItems([...items, item]);
}
```
React compares state by reference (`Object.is`) to decide whether to re-render. Mutating and passing back the same reference can silently fail to trigger updates, or cause bugs when parts of the app assumed the old array was immutable.

## Anti-pattern: array index as key

```jsx
// Before — breaks on reorder/insert/delete
{items.map((item, i) => <Item key={i} {...item} />)}

// After — stable identity tied to the data
{items.map((item) => <Item key={item.id} {...item} />)}
```
Index keys cause React to misattribute state to the wrong item when the list reorders (e.g., an input's local text ends up under the wrong row after a delete). Only acceptable for genuinely static, never-reordered lists.

## Anti-pattern: components doing too much

A component that fetches data, manages five pieces of unrelated state, computes derived values, and renders a huge JSX tree is hard to test and reuse. Extract data-fetching into a custom hook, break the JSX into smaller focused components, and keep each piece testable in isolation.

## Anti-pattern: useEffect for derivable values

```jsx
// Before — unnecessary effect + extra render
useEffect(() => {
  setFullName(`${firstName} ${lastName}`);
}, [firstName, lastName]);

// After — compute during render
const fullName = `${firstName} ${lastName}`;
```
If a value can be computed directly from existing props/state during render, an effect just adds a redundant render cycle and a chance for the value to be briefly stale.

## Anti-pattern: fetching in every component

Every sibling independently calling the same endpoint on mount duplicates network requests. Lift the fetch to a shared ancestor, use context, or use a caching data-fetching library so identical requests are deduped and shared.
