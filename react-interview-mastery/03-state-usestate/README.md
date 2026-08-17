## State & `useState`

`useState` is the primitive hook for giving a function component its own local, persistent, re-render-triggering data. This topic digs into the mechanics that trip people up in interviews and in real bugs: why state updates are asynchronous and batched, why you can't read the "new" value immediately after calling the setter, why state must always be treated as immutable (never mutate arrays/objects in place), how functional updates (`setX(prev => ...)`) solve stale-closure problems, lazy initialization for expensive initial values, and the "lifting state up" pattern for sharing state between sibling components. These are the exact mechanics interviewers probe with "what does this log" questions.

**What's covered:**
- `useState` mechanics: initial value, setter, re-renders
- Functional updates (`setX(prev => ...)`) and why they matter
- State updates are asynchronous and batched
- Why you can't rely on reading state right after calling the setter
- State immutability — never mutate arrays/objects directly
- Lazy initial state: `useState(() => expensiveInit())`
- Lifting state up to share state between components

> Looking for your original notes on this? See `../SOURCE-MAP.md`.
