# Output-Based Questions: Suspense & Code Splitting

### 1. What renders on first paint?
```jsx
const Heavy = React.lazy(() => import("./Heavy"));

function App() {
  console.log("App render");
  return (
    <Suspense fallback={<p>Fallback</p>}>
      <Heavy />
    </Suspense>
  );
}
```
**Answer:** `"App render"` logs, then "Fallback" is shown, then once `Heavy`'s chunk downloads, `Heavy` replaces it.

**Why:** `React.lazy` throws a promise the first time `Heavy` is rendered because the module isn't loaded yet. Suspense catches that thrown promise and renders `fallback` instead, then re-renders the subtree once the promise resolves. `App` itself renders normally since the suspension happens inside `Heavy`, below the boundary.

---

### 2. Does the fallback show again on the second render?
```jsx
const Heavy = React.lazy(() => import("./Heavy"));

function App() {
  const [count, setCount] = useState(0);
  return (
    <div>
      <button onClick={() => setCount(count + 1)}>{count}</button>
      <Suspense fallback={<p>Fallback</p>}>
        <Heavy />
      </Suspense>
    </div>
  );
}
```
**Answer:** No — after the initial load, clicking the button just re-renders `count`; `Heavy` stays mounted and "Fallback" does not reappear.

**Why:** Once a lazy module has been imported, the browser/module cache holds the resolved module, so subsequent renders of `Heavy` don't suspend again — they render synchronously like any other component. Suspense only triggers while the promise is pending.

---

### 3. What happens if the dynamic import fails (e.g., 404 on the chunk)?
```jsx
const Broken = React.lazy(() => import("./DoesNotExist"));

function App() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <Broken />
    </Suspense>
  );
}
```
**Answer:** The app crashes with an unhandled error (React unmounts the tree and, in development, shows the red error overlay) — nothing gracefully catches it.

**Why:** `Suspense` only handles the "pending" state of a thrown promise; it has no error-handling behavior. A rejected import is a thrown error, which needs an error boundary above the `Suspense` to be caught and given a fallback UI. Without one, it propagates up as an uncaught render error.

---

### 4. How many network requests for the chunk happen here?
```jsx
const Modal = React.lazy(() => import("./Modal"));

function App() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button onClick={() => setOpen(true)}>Open</button>
      <button onClick={() => setOpen(false)}>Close</button>
      {open && (
        <Suspense fallback={<p>Loading...</p>}>
          <Modal />
        </Suspense>
      )}
    </>
  );
}
// User opens, closes, and reopens the modal.
```
**Answer:** One network request total, on the first open.

**Why:** Dynamic `import()` is cached by the module system after the first successful resolution — calling it again (e.g., unmounting and remounting `Modal`) reuses the already-resolved module rather than re-fetching the chunk over the network.

---

### 5. What shows while BOTH children are loading vs just one?
```jsx
const A = React.lazy(() => import("./A")); // resolves in 100ms
const B = React.lazy(() => import("./B")); // resolves in 500ms

function App() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <A />
      <B />
    </Suspense>
  );
}
```
**Answer:** "Loading..." shows for the full 500ms — `A` does not appear at 100ms on its own; both `A` and `B` appear together once `B` also resolves.

**Why:** A single shared Suspense boundary treats its entire subtree as one unit — it stays on the fallback until every suspending descendant is ready, then reveals them together. To have `A` appear independently at 100ms, it would need its own nested Suspense boundary.

---

### 6. Is `SettingsPage` code downloaded when the app first loads?
```jsx
const SettingsPage = React.lazy(() => import("./SettingsPage"));

function App() {
  const [route, setRoute] = useState("home");
  return (
    <Suspense fallback={<p>Loading...</p>}>
      {route === "home" && <Home />}
      {route === "settings" && <SettingsPage />}
    </Suspense>
  );
}
```
**Answer:** No — the `SettingsPage` chunk is only fetched once `route` becomes `"settings"` and `<SettingsPage />` actually renders for the first time.

**Why:** `React.lazy`'s dynamic `import()` only executes when the lazy component is rendered, not when it's merely referenced/defined at module scope. The bundler still creates a separate chunk file for it at build time, but the browser doesn't request it until render actually needs it.

---

### 7. What does the fallback prop receive — a rendered value or something else?
```jsx
function App() {
  console.log(typeof (<p>Loading...</p>));
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <LazyThing />
    </Suspense>
  );
}
```
**Answer:** `"object"` — JSX always compiles to a plain object (a React element), whether or not it's used as a Suspense fallback.

**Why:** This is a trick question about JSX itself, not Suspense specifically: `<p>Loading...</p>` is just `React.createElement('p', null, 'Loading...')`, an ordinary object describing what to render. Suspense treats `fallback` like any other prop — there's no special runtime type for it.
