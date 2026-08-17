# Output-Based Questions — Event Handling & Forms

### 1. What does typing "hi" into the input show?

```jsx
function Input() {
  const [value, setValue] = React.useState('');
  return <input value={value} />;
}
```

**Answer:** Nothing types — the input appears frozen/unresponsive, and React logs a console warning about providing a `value` prop without an `onChange` handler.

**Why:** This is a controlled input with no way to update the state backing it — `value` is fixed at `''` forever since there's no `onChange` to call `setValue`. Every keystroke the browser tries to apply gets immediately overridden back to the current React state on the next render, so the field looks unresponsive to typing.

---

### 2. What logs three seconds after clicking, if the button was clicked when `count` was `2`?

```jsx
function DelayedLog() {
  const [count, setCount] = React.useState(0);
  function handleClick() {
    setTimeout(() => {
      console.log('count at click time:', count);
    }, 3000);
  }
  return (
    <>
      <button onClick={handleClick}>Schedule log</button>
      <button onClick={() => setCount(c => c + 1)}>{count}</button>
    </>
  );
}
```

**Answer:** `count at click time: 2` — even if the user clicks the increment button several more times during those three seconds, changing the displayed count to 5, 6, etc.

**Why:** `handleClick` is a closure created during the render where `count` was `2`; the `setTimeout` callback captures that same closure. Even though `count` state has since changed (causing new renders with new closures for new `handleClick` calls), the *specific* timeout scheduled from that click keeps referencing the `count` value from its own render, unaffected by later state changes.

---

### 3. What happens when the form is submitted by pressing Enter inside the text field?

```jsx
function SearchForm() {
  function handleClick() {
    console.log('searching...');
  }
  return (
    <form>
      <input type="text" />
      <button onClick={handleClick}>Search</button>
    </form>
  );
}
```

**Answer:** Pressing Enter inside the input triggers a full page reload/navigation, and `"searching..."` never logs from that action (it only logs if the button is explicitly clicked with a mouse/keyboard-activated click).

**Why:** The button has no explicit `type` attribute, so inside a `<form>` it defaults to `type="submit"`, meaning clicking it *does* also submit the form — but the handler here is attached to `onClick`, not `onSubmit`, and nothing calls `preventDefault()`. Pressing Enter in a text field submits the form directly (bypassing the button's `onClick` entirely) and triggers the browser's default full-page reload since there's no `onSubmit` handler to intercept it.

---

### 4. What's logged when the inner button is clicked?

```jsx
function App() {
  function handleOuterClick() {
    console.log('outer clicked');
  }
  function handleInnerClick(e) {
    e.stopPropagation();
    console.log('inner clicked');
  }
  return (
    <div onClick={handleOuterClick}>
      <button onClick={handleInnerClick}>Click me</button>
    </div>
  );
}
```

**Answer:** Only `inner clicked` logs — `outer clicked` does not.

**Why:** `event.stopPropagation()` on the synthetic event stops the event from propagating to other React-registered handlers further up the component tree, including the outer `div`'s `onClick`. Even though React internally delegates listeners at the root, from the perspective of application code this behaves exactly like normal DOM bubbling being stopped — the outer handler simply never fires.

---

### 5. Given the same JSX, does a `console.log` inside a raw `document.addEventListener('click', ...)` attached on the outer div still fire?

```jsx
function App() {
  const divRef = React.useRef(null);
  React.useEffect(() => {
    divRef.current.addEventListener('click', () => console.log('native listener fired'));
  }, []);

  function handleInnerClick(e) {
    e.stopPropagation();
  }

  return (
    <div ref={divRef}>
      <button onClick={handleInnerClick}>Click me</button>
    </div>
  );
}
```

**Answer:** Yes, `native listener fired` still logs when the button is clicked, even though `stopPropagation()` was called in the React handler.

**Why:** `event.stopPropagation()` on a React SyntheticEvent stops propagation through React's synthetic event system (delegated from the root), but the actual native DOM click event still bubbles through the real DOM tree the normal way before/independent of React's delegated dispatch. A listener attached directly via `addEventListener` on an actual DOM ancestor sees the native bubbling event regardless of what React's synthetic `stopPropagation` did.

---

### 6. What value does `console.log(e.target.value)` show if this input's value is bound to `form.email` but the handler reads `form.email` directly instead of `e.target.value`?

```jsx
function EmailForm() {
  const [form, setForm] = React.useState({ email: '' });
  function handleChange(e) {
    setForm(prev => ({ ...prev, email: form.email + e.target.value.slice(-1) }));
  }
  return <input value={form.email} onChange={handleChange} />;
}
```

**Answer:** Typing normally (not pasting) appears to work correctly by coincidence for single-character insertions at the end, but this breaks (produces garbled/duplicated text) the moment the user edits in the middle of the string, deletes characters, or pastes multi-character text.

**Why:** The handler mixes a stale closure value (`form.email`, captured at render time) with the live `e.target.value`, reconstructing the new value manually instead of just using `e.target.value` directly. `e.target.value` already reflects the DOM input's full current value after the keystroke — there's no reason to reconstruct it from old state, and doing so is fragile and incorrect for anything beyond appending one character at the end.

---

### 7. What happens if `handleSubmit` is attached to the button's `onClick` instead of the form's `onSubmit`, and the user submits by pressing Enter?

```jsx
function Form() {
  const [value, setValue] = React.useState('');
  function handleClick(e) {
    e.preventDefault();
    console.log('submitted:', value);
  }
  return (
    <form>
      <input value={value} onChange={e => setValue(e.target.value)} />
      <button type="submit" onClick={handleClick}>Save</button>
    </form>
  );
}
```

**Answer:** Clicking "Save" logs `submitted: <value>` correctly, but pressing Enter while focused in the input submits the form via the browser's default mechanism (full page reload/navigation), completely bypassing `handleClick` and its `preventDefault()`.

**Why:** `e.preventDefault()` inside a click handler only cancels the default action of *that specific click event* (the button's default submit behavior triggered by the click). It has no effect on a *different* triggering path — pressing Enter in a text field submits the form directly via its own `submit` event, which isn't intercepted because no `onSubmit` handler exists on the `<form>` itself. This is exactly why `onSubmit` on the form, not `onClick` on the button, is the correct place to handle submission.
