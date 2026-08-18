# Typing `useRef`: DOM Nodes vs. Mutable Values

`useRef` serves two genuinely different purposes in React — holding a reference to a DOM node, and holding a mutable value that persists across renders without causing re-renders — and they're typed differently enough that mixing up the patterns causes real compile errors.

## DOM node refs: the `null` initial value pattern

```tsx
function TextInput() {
  const inputRef = useRef<HTMLInputElement>(null);

  const focus = () => {
    inputRef.current?.focus(); // must optional-chain: current might still be null
  };

  return (
    <>
      <input ref={inputRef} />
      <button onClick={focus}>Focus</button>
    </>
  );
}
```

Always initialize DOM refs with `null` and type them as `useRef<HTMLInputElement>(null)`. React sets `.current` to the actual DOM node after mount and back to `null` on unmount, so the ref's type is inferred as `HTMLInputElement | null` — this correctly forces every access to `.current` to handle the null case (via `?.` or an explicit check), because the element genuinely isn't there yet during the first render before the ref is attached, or after unmount.

**A common mistake:** passing a non-null initial value or asserting the type as non-nullable to avoid the optional chaining:

```tsx
// Avoid: lies about current always being present
const inputRef = useRef<HTMLInputElement>(null!);
inputRef.current.focus(); // compiles, but crashes if called before mount
```

This is the same class of risk as the `!` non-null assertion operator covered in `12-type-inference-assertions` — it silences the compiler without providing any real guarantee, and `inputRef.current` genuinely can be `null` at various points in the component's lifecycle.

## Mutable value refs: for values, not DOM nodes

```tsx
function StopwatchTimer() {
  const intervalRef = useRef<number | null>(null);

  const start = () => {
    intervalRef.current = window.setInterval(() => {
      console.log("tick");
    }, 1000);
  };

  const stop = () => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  return (
    <>
      <button onClick={start}>Start</button>
      <button onClick={stop}>Stop</button>
    </>
  );
}
```

Here, `useRef<number | null>(null)` holds a plain mutable value (an interval ID), not a DOM node — the ref is never attached via a JSX `ref={...}` prop. Unlike DOM refs, you're free to reassign `.current` directly and as often as you like; React never touches this ref itself.

## Why the type signature differs based on initial value

`useRef`'s overloads change behavior based on what you pass:

```tsx
useRef<T>(initialValue: T): MutableRefObject<T>;         // current: T, always mutable
useRef<T>(initialValue: T | null): RefObject<T>;         // current: T | null, read-only .current in the type (React sets it)
useRef<T = undefined>(): MutableRefObject<T | undefined>; // no initial value at all
```

Calling `useRef<HTMLInputElement>(null)` matches the second overload, producing a `RefObject<HTMLInputElement>` whose `.current` is `HTMLInputElement | null` and is treated as read-only in the type system (since React itself manages assignment for DOM refs) — you're not supposed to manually set `.current` for a ref that's passed to a JSX `ref` prop. Calling `useRef<number | null>(null)` where `null` is being used as a genuine "empty" state value (not a DOM-attachment placeholder) instead lands on the mutable pattern shown above, because you're deliberately treating `null` as part of your own value's type, not as React's DOM-attachment lifecycle signal — the practical difference in usage is whether you ever assign `.current` yourself, which for DOM refs you should not.

## Interview framing

The key distinction to articulate: a DOM ref's `null` represents "not yet mounted / already unmounted," managed entirely by React, and should always be handled with `?.` or an explicit guard. A mutable value ref's type (including any `null` in it) is *your* domain model, assigned and read directly by your own code, with no React lifecycle semantics attached to it.
