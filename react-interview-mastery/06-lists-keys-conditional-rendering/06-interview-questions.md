# Interview Questions: Lists, Keys & Conditional Rendering

**Q: Why does React require a `key` prop when rendering lists?**

React's reconciler needs a stable way to match elements between the previous render and the new one so it can decide whether to update, move, or destroy-and-recreate a DOM node and its associated component state. Without keys, React falls back to matching children by position, which produces wrong results whenever the list's order or membership changes. Keys give React an identity independent of position.

---

**Q: Why is using the array index as a key considered an anti-pattern?**

Because the index is a property of *position*, not of the *item*. If the list is reordered, filtered, or has items inserted/removed anywhere but the end, items shift indices, and React — matching purely by key — will reuse a component instance (and its state, and its DOM node) for a different logical item than before. This shows up as state (like an open edit box, checked checkbox, or typed input) appearing to "belong" to the wrong row after the list changes.

---

**Q: Does a key need to be globally unique across the whole application?**

No — only unique among its immediate siblings in a given `.map()`/list. React compares keys within one parent's children list, not across the entire component tree, so the same key value can be reused in a completely different list elsewhere without any conflict.

---

**Q: What's a real scenario where index-as-key causes a visible bug?**

A todo list where each row has a "click to edit" state stored via `useState` inside the row component, keyed by index. Editing row 2, then deleting row 0, shifts every subsequent item up by one index. React reuses the component instance at index 2 (which still thinks it's in edit mode) but now renders it with the data for what used to be row 3 — so the edit UI appears to jump to the wrong item's data.

---

**Q: Why does `{count && <Badge/>}` sometimes render a stray `0` on the page?**

`&&` returns its left operand when that operand is falsy. `0` is falsy, so `0 && <Badge/>` evaluates to `0`, not `false`. JSX treats numbers as renderable content, so React prints `0` as a text node. Only `false`, `null`, and `undefined` are treated as "render nothing." The fix is to force a boolean, e.g. `count > 0 && <Badge/>` or `Boolean(count) && <Badge/>`.

---

**Q: What values does JSX render as nothing versus as visible content?**

`false`, `null`, `undefined`, and `true` render as nothing. Numbers (including `0` and `NaN`), strings (including `''` renders as nothing visually but is technically an empty text node), and objects/arrays of valid React nodes render as content. This asymmetry — `true`/`false` behave differently from `0`/`1` — is exactly what makes the `count && <X/>` pattern dangerous when `count` can be zero.

---

**Q: How do you conditionally render one of three or more UI states cleanly?**

Prefer early returns over nested ternaries for readability:

```jsx
function Status({ state }) {
  if (state === 'loading') return <Spinner />;
  if (state === 'error') return <ErrorMessage />;
  return <DataView />;
}
```

Nested ternaries (`a ? x : b ? y : z`) work but become hard to read past two branches, and are a common source of misplaced-parenthesis bugs.

---

**Q: If a component is conditionally rendered with `{show && <Timer/>}`, does the timer's internal state persist when `show` toggles off and back on?**

No. Conditional rendering with `&&` or a ternary fully unmounts the component when the condition is false, which discards all of its state (`useState`, `useRef`) and runs any `useEffect` cleanup. When it renders again, it's a completely fresh mount with initial state. To preserve state across visibility toggles, either lift the state to a parent that stays mounted, or hide with CSS (`display: none`) instead of unmounting.

---

**Q: What's wrong with this code, and what does it render?**

```jsx
{items.map((item) => {
  <li key={item.id}>{item.name}</li>;
})}
```

Nothing renders — an empty list. The arrow function uses a block body (`{ ... }`) without a `return` statement, so it implicitly returns `undefined` for every item. `.map()` produces an array of `undefined`s, and React renders each `undefined` as nothing. The fix is either an explicit `return` or converting to an implicit-return arrow: `items.map(item => <li key={item.id}>{item.name}</li>)`.

---

**Q: Can two `.map()` calls in different parts of the same component reuse the same key values?**

Yes, as long as they're not siblings under the exact same parent. React's key-matching is scoped to each parent's own children, so keys in one list don't need to avoid collisions with keys in an unrelated list, even within the same component.

---

**Q: When, if ever, is index-as-key acceptable?**

When the list is static — never reordered, filtered, or has items inserted/removed except possibly appended at the end — and the list items have no internal state that could get mismatched. Even then, it's safer default to a stable id if one exists, since "the list will never change" is a claim that often stops being true as an app evolves.

---

**Q: How would you render a list where you need to output multiple sibling elements per item without adding a wrapping `<div>`?**

Use a keyed `React.Fragment` (the shorthand `<>...</>` cannot take a `key`, so you need the full `React.Fragment` syntax when mapping):

```jsx
{entries.map((e) => (
  <React.Fragment key={e.id}>
    <dt>{e.term}</dt>
    <dd>{e.definition}</dd>
  </React.Fragment>
))}
```
