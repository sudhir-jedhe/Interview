```tsx
function useCounter(initial = 0) {
  const [count, setCount] = useState(initial);
  const increment = () => setCount((c) => c + 1);
  return [count, increment];
}

function Counter() {
  const [count, increment] = useCounter();
  return <button onClick={increment}>{count}</button>;
}
```

Does this compile?

**Answer:** No — `onClick={increment}` fails to compile, because `increment`'s inferred type is `number | (() => void)`, and that's not assignable to the `onClick` prop's expected function type. `{count}` inside JSX also has the wrong (union) type, though rendering a union that happens to include `number` doesn't error the same way.

**Why:** `useCounter` returns a plain array literal `[count, increment]` with no type annotation and no `as const`. TypeScript applies best-common-type inference to the array, producing `(number | (() => void))[]` — a single union type shared by every position, not a positional tuple. After destructuring, both `count` and `increment` are individually typed as `number | (() => void)`, discarding which one is actually the number and which is actually the function. `onClick` expects a function, and a value that's *possibly* a `number` doesn't satisfy that. The fix is `return [count, increment] as const;`, which locks each element to its own specific type and marks the return as a fixed-position readonly tuple, matching how `useState` itself is typed.
