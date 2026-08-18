# A DOM ref used to imperatively focus an input

```tsx
// Snippet: useRef<HTMLInputElement>(null) + optional chaining on .current
function AutoFocusInput() {
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    ref.current?.focus();
  }, []);

  return <input ref={ref} placeholder="Focused on mount" />;
}
```
