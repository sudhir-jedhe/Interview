# Interview Questions: Custom Hooks

**Q: What makes a function a "custom hook" rather than just a regular JavaScript function?**

Two things: it calls one or more other hooks internally (built-in ones like `useState`/`useEffect`, or other custom hooks), and it's named starting with `use` by convention. The `use` prefix isn't enforced by the JavaScript runtime, but React's ESLint plugin relies on it to know which functions should be checked against the Rules of Hooks — naming it without the `use` prefix means the linter won't catch violations inside it.

---

**Q: What are the Rules of Hooks?**

Only call hooks at the top level of a function component or custom hook — never inside loops, conditionals, or nested functions. And only call hooks from React function components or other custom hooks — never from plain utility functions, class components, or outside the render flow.

---

**Q: Why do the Rules of Hooks exist? What breaks if you violate them?**

React matches hook calls between renders purely by **call order** — internally it walks a linked list of "hook slots" in the exact sequence they're called, matching the first call this render to the first call last render, and so on, with no other identifier involved. If a hook call is conditionally skipped on some renders, every subsequent hook call shifts to the wrong slot, and React ends up returning stale or mismatched state for those hooks — corrupting component state silently, or throwing an explicit "Rendered fewer/more hooks than expected" error.

---

**Q: If two different components call the same custom hook, do they share state?**

No — each call site gets its own, fully independent instance of whatever state the hook manages internally. Custom hooks let you reuse *logic* (the code defining how state behaves), not the state itself. If two components need to observe and mutate the exact same value, you need Context or an external store, not a custom hook alone.

---

**Q: Write a `useToggle` hook and explain each part.**

```jsx
function useToggle(initialValue = false) {
  const [value, setValue] = useState(initialValue);
  const toggle = useCallback(() => setValue((v) => !v), []);
  return [value, toggle];
}
```

`useState` holds the boolean. `toggle` is wrapped in `useCallback` with an empty dependency array so it's referentially stable across renders — useful if it's passed to a `React.memo`-wrapped child or used as an effect dependency elsewhere. It uses the functional updater form (`v => !v`) rather than closing over `value` directly, so `toggle` never needs `value` in its own dependency array and stays correct even without recreation.

---

**Q: How would you implement a `useDebounce` hook, and what's the key mechanism that makes it work?**

```jsx
function useDebounce(value, delay = 300) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return debounced;
}
```

The key mechanism is the cleanup function: every time `value` changes, the effect reruns, and before it does, React calls the *previous* effect's cleanup — clearing the previously scheduled timeout. So if `value` changes again before the delay elapses, the stale, pending update is cancelled, and only a value that's remained stable for the full `delay` ever actually gets set.

---

**Q: What's the purpose of `AbortController` in a `useFetch` custom hook, and what happens without it?**

It lets you cancel an in-flight `fetch` request when it's no longer needed — typically when the component unmounts or the URL/query changes before the previous request resolves. Without cancellation, a slower, earlier request can resolve *after* a later one and overwrite fresher data with stale data (a race condition), or attempt to call `setState` on an unmounted component, which is at best wasted work and at worst a symptom of a memory-management bug.

```jsx
useEffect(() => {
  const controller = new AbortController();
  fetch(url, { signal: controller.signal }).then(/* ... */);
  return () => controller.abort();
}, [url]);
```

---

**Q: Can a custom hook call another custom hook? Give an example.**

Yes — composing custom hooks is a normal and encouraged pattern. For example, a `useDebouncedFetch` hook can be built by combining `useDebounce` and `useFetch`:

```jsx
function useDebouncedFetch(url, delay = 300) {
  const debouncedUrl = useDebounce(url, delay);
  return useFetch(debouncedUrl);
}
```

As long as every hook involved still follows the Rules of Hooks (called unconditionally, at the top level), nesting custom hooks inside other custom hooks is exactly how complex reusable logic is typically built up from simpler pieces.

---

**Q: Why can't you call a hook inside a callback like `onClick` or inside a `.map()` callback?**

Both violate "only call hooks at the top level" — a hook called inside an event handler runs outside of React's render flow entirely (there's no render happening when the click fires), so there's no "hook slot" for React to match it against. A hook called inside `.map()` would be called a variable number of times depending on array length, which breaks the fixed call-order requirement the same way a conditional does.

---

**Q: What is `eslint-plugin-react-hooks` and why is it considered close to mandatory in React codebases?**

It's the official ESLint plugin that enforces the Rules of Hooks (`rules-of-hooks`) and flags incomplete/incorrect dependency arrays in `useEffect`/`useMemo`/`useCallback` (`exhaustive-deps`) at write time, rather than letting these bugs surface later as runtime crashes or subtle stale-state bugs. Because both classes of bugs are easy to introduce accidentally and hard to spot in review just by reading code, most teams treat this plugin as effectively mandatory rather than optional tooling.

---

**Q: When would you choose to write a custom hook instead of just inlining the logic directly in the component?**

When the same stateful logic (or a variant of it) is needed in more than one component, or when a single component's logic is complex enough that extracting it improves readability and testability, even if there's currently only one consumer. A useful heuristic: if you're copy-pasting a `useState` + `useEffect` combination between components, or a component's body has grown hard to scan because of interleaved unrelated concerns, that's usually a sign a custom hook extraction is overdue.
