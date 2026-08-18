# A custom hook returning a correctly-typed tuple

```tsx
// Snippet: `as const` keeps [boolean, () => void] as a tuple, not (boolean | (() => void))[]
function useToggle(initial = false) {
  const [value, setValue] = useState(initial);
  const toggle = () => setValue((v) => !v);
  return [value, toggle] as const;
}

function Accordion() {
  const [isExpanded, toggleExpanded] = useToggle();
  return <button onClick={toggleExpanded}>{isExpanded ? "Collapse" : "Expand"}</button>;
}
```
