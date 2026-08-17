# Interview Questions — State & `useState`

**Q: What does `useState` return, and how does the returned pair typically get used?**
It returns a two-element array: the current state value and a setter function to update it. The standard idiom is array destructuring with descriptive names: `const [count, setCount] = useState(0)`. Calling the setter schedules a re-render of the component with the new value; the state itself persists across re-renders of the same component instance.

**Q: Why does the argument passed to `useState` only matter on the first render?**
Because React uses it purely as the seed value for that component instance's state slot when it's created (mounted). On every subsequent render, React returns whatever the current value of that state slot is and ignores the argument entirely — even if the argument expression evaluates to something different on a later render (e.g., a changed prop being passed in).

**Q: Why are state updates described as asynchronous, and what does that mean practically?**
Calling the setter doesn't synchronously update the variable in the current function's closure — it schedules an update that React applies before the next render. Practically, this means code immediately after a `setState` call in the same function still sees the old value, and multiple `setState` calls to the same piece of state in one handler using the direct (non-functional) form all read the same stale closure value rather than compounding.

**Q: What problem does the functional updater form (`setX(prev => ...)`) solve?**
It guarantees the update function receives the true latest pending state rather than a value frozen in a stale closure. This matters whenever you call the setter multiple times in the same tick, or from a callback (like a timeout or a promise) that might run after other updates have already been scheduled — using `prev => prev + 1` instead of `count + 1` avoids lost updates in both cases.

**Q: Why must state updates for arrays/objects always create a new reference instead of mutating in place?**
React's default change detection compares the new state to the old state by reference (`Object.is`), not by deep value comparison. Mutating an array/object in place (`.push()`, `.sort()`, direct property assignment) keeps the same reference, so even if you call the setter afterward, React may conclude nothing changed and skip re-rendering. Always derive a new array/object — spread syntax, `.map()`, `.filter()`, object spread — so the reference itself signals the change.

**Q: What's the difference between `useState(expensiveFn())` and `useState(() => expensiveFn())`?**
The first form calls `expensiveFn()` on every single render (because JavaScript evaluates function arguments before the call happens), even though React only uses the result on the first render — wasting the computation on every subsequent render. The second, "lazy initializer" form passes a function instead, and React only invokes it once, during the initial mount, which is the correct pattern for expensive initial-state computation.

**Q: What is "lifting state up," and when should you do it?**
It's moving state from a component up to its closest common ancestor with any sibling(s) that need to read or react to that same state, then passing the value and update callbacks back down as props. Do it as soon as two or more components need to share or stay synchronized on the same piece of data — keeping state local otherwise, to avoid unnecessary re-renders of unrelated parts of the tree.

**Q: If you call `setCount(5)` when `count` is already `5`, does the component re-render?**
No, by default React bails out of re-rendering if the new state is reference-equal (`Object.is`) to the current state — this applies to primitives naturally (`5 === 5`) and is a built-in optimization to avoid redundant render work. Note this bailout doesn't apply to objects/arrays unless the reference itself is literally unchanged.

**Q: Does React guarantee that multiple `setState` calls in the same event handler will each cause a separate re-render?**
No — React batches multiple state updates that occur within the same synchronous block of work (an event handler, and since React 18, also timeouts/promises/native listeners) into a single re-render for efficiency, rather than re-rendering after each individual `setState` call.

**Q: How would you reset a component's entire state when a prop like a record `id` changes, without manually resetting every `useState` field?**
Give the component a `key` prop tied to that id. When the `key` changes, React treats it as an entirely new component instance — unmounting the old one (discarding all its state) and mounting a fresh one that re-runs its `useState` initializers from scratch, rather than trying to reconcile/preserve the previous instance's state.

```jsx
<UserProfileForm key={selectedUserId} userId={selectedUserId} />
```

**Q: Can `useState` be called conditionally, e.g., inside an `if` block?**
No — hooks must be called in the exact same order on every render, so `useState` (like all hooks) must be called unconditionally at the top level of the component, never inside conditions, loops, or nested functions. Calling it conditionally breaks React's internal mapping of hook calls to state slots between renders, causing state to become misaligned or React to throw an error.
