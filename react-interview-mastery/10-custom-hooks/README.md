# Custom Hooks

Custom hooks are the primary mechanism for extracting and reusing stateful logic between components without resorting to older patterns like higher-order components or render props. This topic covers what actually qualifies as a custom hook (a function prefixed with `use` that calls other hooks internally), the Rules of Hooks and why React enforces them (hooks rely on a stable call order between renders), and works through fully implemented, realistic custom hooks — `useToggle`, `useFetch`, `useDebounce`, and `useLocalStorage`. It closes on a commonly misunderstood point: custom hooks share *logic*, not *state* — every component that calls the same custom hook gets its own completely independent instance of that hook's state.

## What's covered
- What makes a function a "custom hook" (calls other hooks, `use`-prefixed naming convention)
- The Rules of Hooks: only call at the top level, only from function components or other hooks
- Why the rules exist — hooks are matched across renders by call order, not by name
- Fully implemented custom hooks: `useToggle`, `useFetch`, `useDebounce`, `useLocalStorage`
- Sharing logic vs sharing state — each call site gets an independent instance

> Looking for your original notes on this? See `../SOURCE-MAP.md`.
