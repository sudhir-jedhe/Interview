## `useEffect` & Lifecycle

`useEffect` lets a function component synchronize with something outside React's rendering model — a subscription, a DOM API, a network request, a timer. This topic covers the exact timing of when effects run relative to render and commit, how the dependency array controls re-running, cleanup functions and when they fire, the stale closure trap that catches almost everyone at some point, the classic bugs (missing deps, infinite loops from unstable object/array deps), the narrower `useLayoutEffect` variant, and — importantly — the modern mental model of effects as a synchronization tool rather than a direct replacement for class lifecycle methods like `componentDidMount`.

**What's covered:**
- `useEffect` mechanics: runs after render/commit
- Dependency array semantics — no array, empty array, array with deps
- Cleanup functions and when they run
- The stale closure problem inside effects
- Common bugs: missing dependencies, infinite loops from recreated object/array deps
- `useEffect` vs. `useLayoutEffect`
- Effects as synchronization, not class-lifecycle replacements

> Looking for your original notes on this? See `../SOURCE-MAP.md`.
