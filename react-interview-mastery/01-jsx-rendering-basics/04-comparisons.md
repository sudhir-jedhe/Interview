# Comparisons — JSX & Rendering Basics

### `&&` vs. Ternary for conditional rendering

| Aspect | `condition && <X />` | `condition ? <X /> : <Y />` |
|---|---|---|
| Use case | Render something or nothing | Render one of two alternatives |
| Falsy pitfall | Renders `0`/`NaN` literally if condition isn't a real boolean | No falsy-value pitfall — both branches are explicit |
| Readability | Very terse for single-branch cases | Clearer when there's a real "else" |

Use `&&` only when the condition is guaranteed to be a boolean (e.g. `items.length > 0`, not `items.length`). The most common mistake is `count && <Badge />`, which renders `0` on screen when `count` is `0`.

### Fragment (`<>`) vs. wrapping `<div>`

| Aspect | `<>...</>` / `Fragment` | `<div>...</div>` |
|---|---|---|
| DOM output | No extra node added | Adds a real DOM element |
| Styling impact | None — can't be targeted by CSS/flex/grid | Can affect layout (flex/grid children, CSS selectors) |
| Keys | Needs `React.Fragment key={...}` explicit form when in a list | `key` works directly on the div |

Use Fragments when you only need to satisfy "single root" and don't want layout side effects; use a `div` when you actually need a styling/layout hook. The common mistake is wrapping list items in `<>` without realizing you can't attach a `key` to the shorthand syntax — you must use `<React.Fragment key={...}>`.

### `key={index}` vs. `key={stableId}`

| Aspect | Index as key | Stable unique id as key |
|---|---|---|
| Correctness when list is static/append-only | Safe | Safe |
| Correctness when list is reordered/filtered/prepended | Breaks — state/DOM gets attached to the wrong item | Correct — identity follows the data |
| Performance | Slightly cheaper to compute (no id needed) | Requires each item to have a stable id |

Use index keys only for lists that never reorder, insert, or delete in the middle. The most common mistake is defaulting to `.map((item, i) => <Row key={i} />)` out of habit for lists that are filterable or sortable, causing uncontrolled inputs and animations to desync from their data.

### Classic `createElement` runtime vs. automatic `jsx` runtime

| Aspect | Classic (`React.createElement`) | Automatic (`jsx-runtime`, React 17+) |
|---|---|---|
| Import requirement | Must `import React from 'react'` in every JSX file | No React import needed just to use JSX |
| Output | `React.createElement(type, props, ...children)` | `jsx(type, { ...props, children })` (optimized `jsxs` for static children arrays) |
| Config | Default in older setups | Requires `"jsx": "react-jsx"` (TS) or Babel preset config |

Use the automatic runtime for any modern project (Create React App, Vite, Next.js all default to it) — less boilerplate, slightly smaller bundles. The common mistake is assuming you can drop the `React` import while still on an older bundler/tsconfig that hasn't been switched to `react-jsx`, causing a "React is not defined" build error.
