# Re-renders & Performance

React re-renders components far more often than most developers expect, and understanding *why* is the foundation of writing performant React. This topic covers the three triggers of a re-render (state change, parent re-render, context change), how `React.memo` can skip work but easily gets defeated by unstable prop references, and the everyday mistakes — inline object/array/function props, giant component trees, unkeyed lists — that quietly slow apps down. It also covers structural fixes: splitting components to narrow re-render scope and reaching for list virtualization when the DOM itself is the bottleneck.

## What's covered
- Why components re-render: state, parent re-renders, context changes
- The "everything re-renders by default" mental model and why it's usually fine
- `React.memo` and its shallow-comparison caveat
- Identifying unnecessary re-renders (Profiler concepts, not tool walkthroughs)
- Common performance mistakes: inline objects/arrays/functions as props, huge trees, missing/unstable keys
- List virtualization concept and `react-window`
- Splitting components to narrow re-render scope

> Looking for your original notes on this? See `../SOURCE-MAP.md`.
