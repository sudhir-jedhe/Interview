# Event Handling & Forms

## SyntheticEvent

Handlers you attach in JSX (`onClick`, `onChange`, `onSubmit`, ...) don't receive the raw browser `Event` object — they receive a `SyntheticEvent`, a cross-browser wrapper that normalizes event properties and behavior so you don't have to special-case old browsers. It has the same interface as the native event (`target`, `currentTarget`, `preventDefault()`, `stopPropagation()`, etc.), and exposes the original via `event.nativeEvent` if you ever need it.

```jsx
function Button() {
  function handleClick(event) {
    console.log(event.type);        // "click"
    console.log(event.target);      // the DOM node clicked
    console.log(event.nativeEvent); // the underlying browser event
  }
  return <button onClick={handleClick}>Click</button>;
}
```

Since React 17+, synthetic events are no longer pooled/reused (older React versions nulled out event fields after the handler returned unless you called `event.persist()`), so you can safely read event properties asynchronously (e.g. inside a `setTimeout`) without needing `persist()`.

## No `this`, but closures still matter

Function components sidestep the classic class-component footgun of needing to `.bind(this)` or use arrow-function class fields to keep `this` correct in handlers — there's no `this` to lose track of. But handlers defined inside a function component are still closures over that render's props/state, which is the source of the same category of bugs seen in the state and effects topics:

```jsx
function Counter() {
  const [count, setCount] = React.useState(0);

  function handleClick() {
    setTimeout(() => {
      console.log(count); // whatever `count` was during THIS render, not necessarily current
    }, 3000);
  }

  return <button onClick={handleClick}>{count}</button>;
}
```

## Controlled vs. uncontrolled inputs

A **controlled** input's value is driven entirely by React state — the DOM element's `value` always mirrors state, and every keystroke goes through `onChange` to update that state:

```jsx
function ControlledInput() {
  const [value, setValue] = React.useState('');
  return <input value={value} onChange={e => setValue(e.target.value)} />;
}
```

An **uncontrolled** input manages its own value internally in the DOM; React only reads it on demand, typically via a `ref`:

```jsx
function UncontrolledInput() {
  const inputRef = React.useRef(null);
  function handleSubmit(e) {
    e.preventDefault();
    console.log(inputRef.current.value);
  }
  return (
    <form onSubmit={handleSubmit}>
      <input ref={inputRef} defaultValue="" />
      <button type="submit">Submit</button>
    </form>
  );
}
```

Controlled is the default recommendation for most forms — it makes validation, conditional disabling, and derived UI trivial since state is always the single source of truth. Uncontrolled is useful for simple/one-off forms, integrating non-React widgets, or file inputs (`<input type="file">` can't be controlled by React — its value is read-only from JS for security reasons).

## Handling multiple fields with one handler

A common pattern: give every input a `name` matching a key in a single state object, and use one generic `onChange`:

```jsx
function SignupForm() {
  const [form, setForm] = React.useState({ email: '', password: '' });

  function handleChange(e) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  }

  return (
    <>
      <input name="email" value={form.email} onChange={handleChange} />
      <input name="password" type="password" value={form.password} onChange={handleChange} />
    </>
  );
}
```

This scales to any number of fields without writing a new handler per input, as long as `name` matches the state key.

## Form submission and `preventDefault`

The browser's default behavior for a `<form>` submission is a full-page navigation/reload — almost never what you want in a React app. Call `event.preventDefault()` in the `onSubmit` handler to stop it:

```jsx
function LoginForm() {
  function handleSubmit(e) {
    e.preventDefault(); // stop the default page reload/navigation
    // ...submit logic
  }
  return (
    <form onSubmit={handleSubmit}>
      <input name="username" />
      <button type="submit">Log in</button>
    </form>
  );
}
```

Prefer attaching the handler to `onSubmit` on the `<form>` (triggered by pressing Enter in an input, or clicking a `type="submit"` button) rather than `onClick` on the button alone, so both interaction paths are covered.

## Debouncing input handlers

For expensive operations tied to typing (API calls, heavy filtering), debounce so the operation only fires after the user pauses:

```jsx
function SearchBox({ onSearch }) {
  const [query, setQuery] = React.useState('');

  React.useEffect(() => {
    const id = setTimeout(() => onSearch(query), 300);
    return () => clearTimeout(id); // cancels the pending call if query changes again quickly
  }, [query, onSearch]);

  return <input value={query} onChange={e => setQuery(e.target.value)} />;
}
```

The `useEffect` cleanup naturally implements debouncing here: every keystroke schedules a new timeout and cancels the previous one before it fires.

## Event delegation and `stopPropagation`

React doesn't attach a separate native listener to every DOM element with an `onClick` etc. — since React 17, it attaches one listener per event type at the root container the app is rendered into (previously it was on `document`), and dispatches synthetic events to the right component by walking the React tree. This is an internal optimization, but it has a visible consequence: `event.stopPropagation()` on a synthetic event stops the event from reaching other *React* handlers up the tree, but because delegation happens at the root, the underlying native event still bubbles through actual DOM ancestors before React's delegated listener even processes it — so a native (non-React) listener attached directly to a DOM ancestor via `addEventListener` can still see the event even if a React child called `stopPropagation()`.
