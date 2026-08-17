## JSX & Rendering Basics

JSX is the syntax extension that lets you write UI markup inside JavaScript, which Babel/TypeScript compiles down to plain function calls that build up a tree of React elements. This topic covers how that compilation works, how React reconciles those element trees against the real DOM using the Virtual DOM, and the practical rules that fall out of it — single-root elements, expressions vs. statements, list rendering, conditional rendering, and update batching. Understanding this layer is foundational: almost every "why doesn't my UI update" bug traces back to a misunderstanding of how JSX becomes elements and how React decides what to re-render.

**What's covered:**
- JSX-to-`React.createElement`/`jsx-runtime` compilation
- Expressions vs. statements inside JSX (`{}`)
- The Virtual DOM and reconciliation, at a high level
- Why JSX needs a single root element (or Fragment)
- Rendering lists of elements and the `key` prop
- Conditional rendering patterns: `&&`, ternary, early return
- How React batches DOM updates

> Looking for your original notes on this? See `../SOURCE-MAP.md`.
