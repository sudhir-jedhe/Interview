# Snippets — Event Handling & Forms

```jsx
// 1. Basic SyntheticEvent usage — same shape as a native event
function ClickLogger() {
  function handleClick(event) {
    console.log(event.type, event.target.tagName);
  }
  return <button onClick={handleClick}>Log click</button>;
}
```

```jsx
// 2. Controlled input — React state is the single source of truth
function ControlledInput() {
  const [value, setValue] = React.useState('');
  return (
    <input value={value} onChange={e => setValue(e.target.value)} placeholder="Type here" />
  );
}
```

```jsx
// 3. Uncontrolled input read via ref on submit
function UncontrolledForm() {
  const nameRef = React.useRef(null);
  function handleSubmit(e) {
    e.preventDefault();
    alert(`Hello, ${nameRef.current.value}`);
  }
  return (
    <form onSubmit={handleSubmit}>
      <input ref={nameRef} defaultValue="" />
      <button type="submit">Submit</button>
    </form>
  );
}
```

```jsx
// 4. One handler for multiple named fields via the `name` attribute
function AddressForm() {
  const [form, setForm] = React.useState({ street: '', city: '', zip: '' });
  function handleChange(e) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  }
  return (
    <>
      <input name="street" value={form.street} onChange={handleChange} />
      <input name="city" value={form.city} onChange={handleChange} />
      <input name="zip" value={form.zip} onChange={handleChange} />
    </>
  );
}
```

```jsx
// 5. preventDefault on submit to stop the browser's full-page reload
function SubscribeForm() {
  const [email, setEmail] = React.useState('');
  function handleSubmit(e) {
    e.preventDefault();
    console.log('subscribing:', email);
  }
  return (
    <form onSubmit={handleSubmit}>
      <input value={email} onChange={e => setEmail(e.target.value)} />
      <button type="submit">Subscribe</button>
    </form>
  );
}
```

```jsx
// 6. Debouncing an input handler via useEffect cleanup
function DebouncedSearch({ onSearch }) {
  const [query, setQuery] = React.useState('');
  React.useEffect(() => {
    const id = setTimeout(() => onSearch(query), 300);
    return () => clearTimeout(id);
  }, [query, onSearch]);
  return <input value={query} onChange={e => setQuery(e.target.value)} />;
}
```

```jsx
// 7. Checkbox and select handled through the same generic pattern
function PreferencesForm() {
  const [prefs, setPrefs] = React.useState({ newsletter: false, plan: 'free' });
  function handleChange(e) {
    const { name, type, value, checked } = e.target;
    setPrefs(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  }
  return (
    <>
      <label>
        <input type="checkbox" name="newsletter" checked={prefs.newsletter} onChange={handleChange} />
        Subscribe to newsletter
      </label>
      <select name="plan" value={prefs.plan} onChange={handleChange}>
        <option value="free">Free</option>
        <option value="pro">Pro</option>
      </select>
    </>
  );
}
```
