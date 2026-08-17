# Comparisons: useRef & DOM Access

### useRef vs useState

| Aspect | `useRef` | `useState` |
|---|---|---|
| Triggers re-render on change | No | Yes |
| Value available immediately after mutation | Yes (synchronous) | No — reflects the update only after next render (with the well-known caveats around batching) |
| Best for | DOM node handles, mutable bookkeeping not shown in UI (timers, previous values, instance flags) | Any value that should drive what's rendered |

Use `useState` for anything that should visibly change the UI. Use `useRef` for values the component needs to remember but that shouldn't cause a re-render by themselves. The most common mistake is using `useRef` for a value that actually needs to appear on screen, then being confused why the UI doesn't update after `.current` changes.

### useRef vs plain module-level/instance variable

| Aspect | `useRef` | Plain variable declared in component body |
|---|---|---|
| Persists across renders | Yes — same object reference for the component instance's lifetime | No — reinitialized to its initial value on every render |
| Shared across multiple instances of the component | No — each component instance gets its own ref | N/A (module-level variables would be shared and are almost never what you want) |

A `let` or `const` declared inside the function body is recreated fresh every render — it cannot hold onto a value between renders. `useRef` is the mechanism React provides specifically to persist a mutable value across renders for one component instance. The most common mistake is trying to track "did I already fetch this" with a plain variable inside the function body, which resets every render and never actually prevents anything.

### forwardRef + ref (raw DOM access) vs useImperativeHandle (custom API)

| Aspect | `forwardRef` alone | `forwardRef` + `useImperativeHandle` |
|---|---|---|
| What the parent's `ref.current` becomes | The actual underlying DOM node | Whatever object the handle factory returns |
| Encapsulation | Parent can call any DOM method/property — no restriction | Component controls exactly what's exposed (e.g., only `focus`/`clear`) |
| Best for | Simple cases — just need to focus/measure/scroll a real element | Component wants to hide internal DOM structure and expose a curated imperative API |

Use plain `forwardRef` when exposing the raw node is fine and there's no encapsulation concern. Use `useImperativeHandle` when the component wraps multiple internal DOM nodes and you want to expose only specific behavior, not the whole implementation detail. The most common mistake is overusing `useImperativeHandle` for things that should just be props (e.g., exposing a `setValue` method instead of making the component a normal controlled component).
