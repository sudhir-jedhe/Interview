# `useEffect` & Lifecycle

## Basic mechanics

`useEffect(fn, deps)` schedules `fn` to run *after* React commits the render's output to the DOM — not during render. This matters: effects can safely read the actual DOM, and they never block the browser from painting (unlike `useLayoutEffect`, covered below).

```jsx
function Example() {
  console.log('1: render');
  React.useEffect(() => {
    console.log('3: effect, after paint');
  });
  console.log('2: still rendering');
  return <div>hi</div>;
}
// Order: "1: render", "2: still rendering", (React commits to DOM), "3: effect"
```

## The dependency array controls when it re-runs

Three forms, and they mean very different things:

```jsx
useEffect(() => { /* ... */ });            // no array: runs after EVERY render
useEffect(() => { /* ... */ }, []);         // empty array: runs once, after initial mount only
useEffect(() => { /* ... */ }, [id]);       // runs after mount, and again whenever `id` changes
```

The dependency array isn't an optimization hint you can freely omit values from — it's how React knows *when the effect's captured values might be stale* and needs to re-run to pick up new ones. Every reactive value the effect body reads (props, state, functions/objects defined in the component) generally belongs in the array; lying about the dependencies is the single most common source of `useEffect` bugs.

## Cleanup functions

If the effect function returns a function, React treats that as cleanup and calls it: right before the effect re-runs (due to a dependency changing), and when the component unmounts.

```jsx
function ChatRoom({ roomId }) {
  React.useEffect(() => {
    const connection = createConnection(roomId);
    connection.connect();
    return () => connection.disconnect(); // cleanup
  }, [roomId]);
  return <div>Connected to {roomId}</div>;
}
```

Sequence when `roomId` changes from `'a'` to `'b'`: cleanup for `'a'` runs first (disconnect), then the effect body runs again with the new `roomId` (connect to `'b'`). This "clean up before re-running" pattern is why effects are described as synchronizing state, not one-time setup — each run should leave things exactly as if it were the only run.

## Stale closures inside effects

An effect closes over the props/state values from the render in which it was created. If the dependency array doesn't include something the effect uses, the effect keeps referencing the *old* value indefinitely — even after that value has changed in later renders — because React doesn't re-run the effect to "refresh" the closure.

```jsx
// Bug: interval always logs the count from the FIRST render (0), forever
function BuggyCounter() {
  const [count, setCount] = React.useState(0);
  React.useEffect(() => {
    const id = setInterval(() => {
      console.log(count); // stale closure — always 0
    }, 1000);
    return () => clearInterval(id);
  }, []); // missing `count` dependency
  return <button onClick={() => setCount(c => c + 1)}>{count}</button>;
}

// Fixed: use functional update so the interval doesn't need `count` as a dependency
function FixedCounter() {
  const [count, setCount] = React.useState(0);
  React.useEffect(() => {
    const id = setInterval(() => {
      setCount(c => c + 1); // reads latest state via the updater, no stale value needed
    }, 1000);
    return () => clearInterval(id);
  }, []);
  return <div>{count}</div>;
}
```

## Common bugs

**Missing dependencies** — silences a real bug rather than fixing it; the ESLint `react-hooks/exhaustive-deps` rule exists specifically to catch this.

**Infinite loops from unstable object/array/function dependencies** — a new object literal or inline function is a *new reference* on every render, so if it's in the dependency array (or the effect itself updates state that recreates it), the effect re-runs every render, potentially triggering a state update that causes another render, forever:

```jsx
// Bug: `options` is a new object every render -> effect re-runs every render
function Bad({ userId }) {
  const options = { userId, cache: true }; // new reference each render
  React.useEffect(() => {
    fetchUser(options).then(/* ... */);
  }, [options]); // "changes" every render
}

// Fixed: depend on the primitive values the effect actually needs
function Good({ userId }) {
  React.useEffect(() => {
    fetchUser({ userId, cache: true }).then(/* ... */);
  }, [userId]); // only re-runs when userId actually changes
}
```

## `useEffect` vs. `useLayoutEffect`

`useLayoutEffect` has the identical API but runs synchronously *before* the browser paints, right after DOM mutations are applied — useful when you need to measure the DOM (`getBoundingClientRect`) and synchronously adjust something before the user sees a flicker. It blocks painting, so it should be reserved for cases where visual consistency requires it; `useEffect` is the right default for everything else (data fetching, subscriptions, logging).

## Effects as synchronization, not lifecycle replacement

It's tempting to map `useEffect(fn, [])` to `componentDidMount` and the cleanup to `componentWillUnmount`, but that framing leads to bugs. The more accurate mental model: an effect describes how to *synchronize* the component with some external system given its current props/state, and the dependency array says which values that synchronization depends on. Thinking in terms of "when does this run" (lifecycle) encourages omitting dependencies to control timing; thinking in terms of "what does this depend on" (synchronization) leads to correct dependency arrays and fewer stale-closure bugs.
