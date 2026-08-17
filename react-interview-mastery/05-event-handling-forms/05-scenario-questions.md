# Scenario Questions — Event Handling & Forms

### 1. Multi-field registration form is becoming an unmanageable pile of `useState` calls and handlers

You're building a registration form with eight fields (name, email, password, confirm password, phone, address, city, zip), and the current implementation has eight separate `useState` calls and eight nearly-identical `onChange` handlers, making the file hard to maintain.

**Approach:** Consolidate into a single state object keyed by field name, and use one generic change handler driven by each input's `name` attribute:

```jsx
function RegistrationForm() {
  const [form, setForm] = React.useState({
    name: '', email: '', password: '', confirmPassword: '',
    phone: '', address: '', city: '', zip: '',
  });

  function handleChange(e) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    submitRegistration(form);
  }

  return (
    <form onSubmit={handleSubmit}>
      {Object.keys(form).map(field => (
        <input
          key={field}
          name={field}
          type={field.toLowerCase().includes('password') ? 'password' : 'text'}
          value={form[field]}
          onChange={handleChange}
          placeholder={field}
        />
      ))}
      <button type="submit">Register</button>
    </form>
  );
}
```

This scales to any number of text-like fields without adding new state variables or handlers — adding a field is just adding a key to the initial state object and an `<input name="...">`.

---

### 2. Search-as-you-type feature is hammering the backend with a request per keystroke

You're building a product search box that calls a search API on every keystroke, and the backend team reports request volume spiking heavily, with most requests being immediately superseded by the next one before their response even matters.

**Approach:** Debounce the search trigger so the API call only fires after the user pauses typing, using a `useEffect` whose cleanup cancels the pending timeout on every keystroke:

```jsx
function ProductSearch() {
  const [query, setQuery] = React.useState('');
  const [results, setResults] = React.useState([]);

  React.useEffect(() => {
    if (!query) {
      setResults([]);
      return;
    }
    const timeoutId = setTimeout(async () => {
      const data = await searchProducts(query);
      setResults(data);
    }, 300);
    return () => clearTimeout(timeoutId); // cancels the pending call on the next keystroke
  }, [query]);

  return (
    <>
      <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search products…" />
      <ul>{results.map(r => <li key={r.id}>{r.name}</li>)}</ul>
    </>
  );
}
```

Each keystroke schedules a new 300ms timeout and cancels the previous one via cleanup, so only a pause in typing actually triggers a network call — cutting request volume dramatically without adding an external debounce library.

---

### 3. Clicking a "Delete" button inside a clickable list-row also opens the row's detail view

You're building a list of items where clicking anywhere on a row navigates to its detail page, but each row also has a "Delete" icon button, and clicking Delete incorrectly also triggers the row's navigation.

**Approach:** The row's `onClick` and the delete button's `onClick` are both firing because the click event bubbles from the button up through the row. Stop it from propagating past the delete button:

```jsx
function ListRow({ item, onNavigate, onDelete }) {
  function handleDeleteClick(e) {
    e.stopPropagation(); // prevent the row's onClick from also firing
    onDelete(item.id);
  }

  return (
    <div className="row" onClick={() => onNavigate(item.id)}>
      <span>{item.name}</span>
      <button onClick={handleDeleteClick} aria-label="Delete">🗑</button>
    </div>
  );
}
```

`stopPropagation()` on the delete button's click event stops it from reaching the row's `onClick` handler, since React delegates and dispatches synthetic events by walking up the component tree — calling it at the innermost handler that "owns" the click prevents outer handlers from also treating it as a row click.

---

### 4. File upload form needs to read a selected file, but the input keeps warning about being uncontrolled/controlled

You're building a file upload form and initially tried to control the `<input type="file">` the same way as text inputs (`value={file}`), but React throws warnings and the browser refuses to set the input's value programmatically for security reasons.

**Approach:** File inputs are a case where you must use the uncontrolled pattern — read the selected file via `ref` or directly from the change event, and never attempt to set `value` on it:

```jsx
function AvatarUpload({ onUpload }) {
  const fileInputRef = React.useRef(null);
  const [preview, setPreview] = React.useState(null);

  function handleFileChange(e) {
    const file = e.target.files[0];
    if (!file) return;
    setPreview(URL.createObjectURL(file)); // local preview, derived state, not controlling the input itself
  }

  function handleSubmit(e) {
    e.preventDefault();
    const file = fileInputRef.current.files[0];
    if (file) onUpload(file);
  }

  return (
    <form onSubmit={handleSubmit}>
      <input type="file" ref={fileInputRef} accept="image/*" onChange={handleFileChange} />
      {preview && <img src={preview} alt="preview" width={100} />}
      <button type="submit">Upload</button>
    </form>
  );
}
```

The input itself stays uncontrolled (no `value` prop); React only reads from it via the `ref` or the change event's `e.target.files`, while any derived UI (like a preview) is tracked in separate, normal state.
