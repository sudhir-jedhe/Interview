# useRef & DOM Access

`useRef` gives you a mutable box (`.current`) that survives across renders without triggering a re-render when it changes — a fundamentally different tool from `useState`. This topic covers the two main uses of `useRef`: attaching it to a JSX element to get direct DOM access (focusing an input, measuring an element, integrating a third-party library), and storing arbitrary mutable values across renders (previous-value tracking, interval/timeout IDs, render counts) without causing extra renders. It also covers `forwardRef`, needed to let a parent attach a ref through a custom component to one of its internal DOM nodes, and a brief look at `useImperativeHandle` for customizing what a ref exposes.

## What's covered
- `useRef` mechanics: mutable `.current`, no re-render on mutation
- Attaching a ref to a DOM element for direct access (focus, scroll, measure)
- Using `useRef` to store mutable values across renders (previous value, interval IDs, render counts)
- Why `useRef` mutations don't show up in the UI until something else triggers a render
- `forwardRef` and why plain function components don't accept `ref` as a prop by default
- `useImperativeHandle` for exposing a custom, restricted imperative API from a component

> Looking for your original notes on this? See `../SOURCE-MAP.md`.
