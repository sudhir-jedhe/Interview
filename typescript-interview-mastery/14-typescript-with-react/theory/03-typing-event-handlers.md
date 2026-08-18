# Typing Event Handlers

React wraps native DOM events in its own `SyntheticEvent` system, and `@types/react` ships specific generic event types for each DOM event category. Using the wrong one, or `any`, is one of the most common small mistakes in React + TS code — the types are easy to forget precisely because plain JavaScript React code never needed them.

## The core pattern

Every React event type is generic over the element it's attached to, so you always specify both the event kind and the target element type:

```tsx
function SearchInput() {
  const [value, setValue] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value); // e.target correctly typed as HTMLInputElement
  };

  return <input value={value} onChange={handleChange} />;
}
```

Without the `<HTMLInputElement>` generic, `e.target` would be typed too loosely (or you'd need a cast), and accessing `.value` wouldn't be properly typed against the actual input element's API.

## Common event types people forget

```tsx
// Change events — inputs, selects, textareas
const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {};
const onSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {};
const onTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {};

// Form submission
const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
};

// Mouse events
const onClick = (e: React.MouseEvent<HTMLButtonElement>) => {};
const onMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {};

// Keyboard events
const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
  if (e.key === "Enter") { /* ... */ }
};

// Focus events
const onBlur = (e: React.FocusEvent<HTMLInputElement>) => {};

// Clipboard, drag, touch events also exist:
// React.ClipboardEvent<T>, React.DragEvent<T>, React.TouchEvent<T>
```

The element type parameter (`HTMLInputElement`, `HTMLButtonElement`, etc.) should match the actual element the handler is attached to, since it determines what `e.currentTarget` and `e.target` are typed as.

## `target` vs. `currentTarget`

A frequent point of confusion, made worse without proper typing: `e.target` is the actual element that triggered the event (could be a child element in event bubbling), while `e.currentTarget` is the element the handler is *attached to* — always the one whose type matches the generic parameter you specified.

```tsx
function FormWrapper() {
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // e.currentTarget is reliably HTMLFormElement here
    const formData = new FormData(e.currentTarget);
    // e.target is typed as EventTarget (less specific) because in a form
    // submit, the actual originating target could technically be any
    // descendant, so React/TS won't narrow it for you automatically
  };

  return <form onSubmit={onSubmit}>{/* ... */}</form>;
}
```

Prefer `e.currentTarget` when you specifically want the element the handler was bound to (which is what you almost always want for reading form values), rather than `e.target`, which requires an unsafe cast to use reliably.

## Inline handlers and inferred types

When a handler is written inline as a JSX prop, TypeScript infers its parameter type contextually from the element's prop signature, so no explicit annotation is required:

```tsx
<input onChange={(e) => setValue(e.target.value)} />
// `e` is inferred as React.ChangeEvent<HTMLInputElement> automatically,
// because that's what the `input` element's `onChange` prop expects.
```

This is the same contextual typing mechanism covered in `12-type-inference-assertions` — the expected function type flows in from the JSX intrinsic element's prop definitions.
