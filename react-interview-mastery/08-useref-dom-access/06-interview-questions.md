# Interview Questions: useRef & DOM Access

**Q: What does `useRef` return, and how is it different from `useState`?**

`useRef(initialValue)` returns a plain mutable object `{ current: initialValue }` whose reference stays the same for the entire lifetime of the component. Mutating `.current` does not trigger a re-render, whereas calling a `useState` setter always schedules one (assuming the value actually changed). Use `useState` for anything that should show up in the rendered UI; use `useRef` for values the component needs to remember without that change itself causing a re-render.

---

**Q: When you attach `ref={myRef}` to a JSX element, when does `myRef.current` actually get set?**

After React commits the DOM changes for that render — specifically, before layout effects (`useLayoutEffect`) and `useEffect` run, but not during the render phase itself. This is why reading `ref.current` synchronously in the middle of the function body (during render) for a DOM ref is unreliable — it reflects the *previous* commit's value, not the current one. DOM access should happen in an effect or an event handler, both of which run after commit.

---

**Q: Why doesn't updating a ref cause the component to re-render?**

Because refs are explicitly designed as an escape hatch outside React's rendering model — mutating `.current` is a plain JavaScript object mutation that React's scheduler has no visibility into. `useState`/`useReducer` are the only APIs that tell React "something changed, please re-render"; `useRef` intentionally doesn't participate in that mechanism, which is exactly what makes it suitable for values you don't want to cause re-renders.

---

**Q: Give an example of using `useRef` for something other than DOM access.**

Tracking a previous prop or state value:

```jsx
function usePrevious(value) {
  const ref = useRef();
  useEffect(() => { ref.current = value; });
  return ref.current;
}
```

Also common: storing interval/timeout IDs so they can be cleared from a different handler, storing a "latest callback" to avoid stale closures in intervals/effects, and tracking whether a component has already mounted to skip an effect's first run.

---

**Q: Why can't you pass a `ref` prop directly to a custom function component the way you would to `<input ref={...}>`?**

React treats `ref` as a reserved, special prop for attaching to underlying DOM nodes or class component instances — it's stripped out before `props` reaches your function component, so `props.ref` is always `undefined` inside a plain function component. There's no default mechanism for a function component to say "attach this ref to one of my internal elements" without opting in explicitly.

---

**Q: What does `forwardRef` do, and when do you need it?**

`forwardRef` wraps a component and gives it access to the `ref` a parent attached, as a second argument to the render function (`(props, ref) => ...`), which the component can then attach to one of its own internal DOM nodes or forward further down. You need it any time a reusable custom component should let its parent get a ref to something inside it — for example, a design-system `<TextField>` that a form wants to call `.focus()` on.

```jsx
const TextField = forwardRef(function TextField(props, ref) {
  return <input ref={ref} {...props} />;
});
```

---

**Q: What is `useImperativeHandle` for, and how does it differ from just forwarding the ref directly?**

It customizes what value is exposed on `ref.current` for a `forwardRef` component — instead of exposing the raw DOM node, you supply a factory function returning whatever object (methods, curated data) you want the parent to see. It's used when you want to hide internal implementation details and expose a limited, intentional imperative API instead of the actual DOM structure.

```jsx
useImperativeHandle(ref, () => ({
  focus: () => inputRef.current.focus(),
}));
```

---

**Q: What's a stale-closure bug related to `useRef`, and how does `useRef` help fix it?**

`setInterval`/event listeners set up inside a `useEffect` with an empty dependency array capture the state/props values from that one render forever — if the callback reads `count` from that closure, it will always see the value `count` had when the effect first ran, even after `count` updates. Storing the "latest" value in a ref (updated on every render via a separate effect with no dependency array, or directly during render) and reading `ref.current` inside the interval callback lets the callback always see the current value without needing to recreate the interval every render.

---

**Q: Can `useRef` be used to skip an effect on a component's initial mount?**

Yes, a common pattern uses a ref as a boolean flag:

```jsx
function useSkipFirstEffect(callback, deps) {
  const isFirst = useRef(true);
  useEffect(() => {
    if (isFirst.current) {
      isFirst.current = false;
      return;
    }
    callback();
  }, deps);
}
```

This is a reasonable escape hatch, though frequently a sign the effect's actual dependency logic could be reconsidered — "run only after the first render" is sometimes solved more cleanly by restructuring what triggers the effect in the first place.

---

**Q: Does calling a ref callback function (`ref={(el) => {...}}`) behave differently from passing a ref object?**

Yes — a callback ref is invoked by React with the DOM node (or class instance) when it's attached, and called again with `null` when it's detached (unmount, or the ref itself changes identity between renders). This makes callback refs useful for tracking dynamic collections of elements (e.g., a list of item refs keyed by id) where a single ref object wouldn't work, since you need per-item ref slots.

---

**Q: Why is it generally discouraged to read or write DOM state via refs when the same thing could be expressed with props/state?**

Because it bypasses React's declarative model — the DOM becomes a second source of truth that has to be kept in sync manually, which is error-prone and hard to reason about compared to letting React derive the DOM from state. Refs for DOM access are meant for things React genuinely can't express declaratively (focus, scroll position, measuring layout, third-party imperative library integration), not as a general substitute for controlled state.
