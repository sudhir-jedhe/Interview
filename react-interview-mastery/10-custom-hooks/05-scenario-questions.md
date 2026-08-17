# Scenario Questions: Custom Hooks

### Scenario 1: Five different components each implement their own ad-hoc "loading/error/data" fetch logic, with inconsistent bugs

You're doing a code review and find five components each with their own copy-pasted `useState` + `useEffect` fetch logic — some missing cleanup on unmount, some missing error handling, one with a race condition when the URL prop changes quickly.

**Approach:** Extract a single `useFetch` custom hook that centralizes the correct, once-vetted logic (loading/error/data state, cancellation on unmount or URL change), and have every component delegate to it instead of reimplementing:

```jsx
function useFetch(url) {
  const [state, setState] = useState({ data: null, loading: true, error: null });

  useEffect(() => {
    const controller = new AbortController();
    setState({ data: null, loading: true, error: null });

    fetch(url, { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => setState({ data, loading: false, error: null }))
      .catch((error) => {
        if (error.name !== 'AbortError') {
          setState({ data: null, loading: false, error });
        }
      });

    return () => controller.abort();
  }, [url]);

  return state;
}

function UserProfile({ userId }) {
  const { data: user, loading, error } = useFetch(`/api/users/${userId}`);
  if (loading) return <Spinner />;
  if (error) return <ErrorMessage error={error} />;
  return <p>{user.name}</p>;
}
```

Now a bug fix (e.g., handling non-2xx responses) is made once, in one place, and every consumer benefits automatically — this is the core value proposition of extracting custom hooks: correctness and consistency, not just line-count reduction.

---

### Scenario 2: A search input triggers a network request on every keystroke, overwhelming the backend

You're building a live search feature. Currently, every keystroke in the search box immediately fires a request via `useFetch(`/api/search?q=${query}`)`, and the backend team is asking you to throttle it — support says search feels "laggy" under load, and the API bill has spiked.

**Approach:** Introduce a `useDebounce` hook between the raw input state and the value that actually drives the fetch, so requests only fire after the user pauses typing:

```jsx
function useDebounce(value, delay = 300) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return debounced;
}

function SearchPage() {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 300);
  const { data: results, loading } = useFetch(
    debouncedQuery ? `/api/search?q=${debouncedQuery}` : null
  );

  return (
    <div>
      <input value={query} onChange={(e) => setQuery(e.target.value)} />
      {loading && <Spinner />}
      <ResultsList results={results ?? []} />
    </div>
  );
}
```

The input itself (`query`) stays instantly responsive to typing since it's a separate, undebounced state; only the value driving the network request is delayed. This composes two independently-testable hooks (`useDebounce`, `useFetch`) rather than baking debounce logic directly into the fetch hook, keeping each one focused and reusable elsewhere.

---

### Scenario 3: A user preference (dark mode) needs to persist across page reloads, but the current implementation resets on refresh

You're building a dark mode toggle. It currently uses plain `useState(false)`, which means every page reload resets the user back to light mode, frustrating users who explicitly chose dark mode.

**Approach:** Swap the plain `useState` for a `useLocalStorage` custom hook with the same API shape, so the rest of the component's logic doesn't need to change at all:

```jsx
function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const stored = window.localStorage.getItem(key);
      return stored !== null ? JSON.parse(stored) : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // storage might be full or unavailable (e.g. private browsing) — fail silently
    }
  }, [key, value]);

  return [value, setValue];
}

function ThemeToggle() {
  const [isDarkMode, setIsDarkMode] = useLocalStorage('darkMode', false);
  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode);
  }, [isDarkMode]);

  return (
    <button onClick={() => setIsDarkMode((d) => !d)}>
      {isDarkMode ? 'Switch to light' : 'Switch to dark'}
    </button>
  );
}
```

Because `useLocalStorage` mirrors `useState`'s `[value, setValue]` return shape, swapping it in was a one-line change at the call site. Worth flagging to the team: if dark mode needs to be read by multiple independent components (e.g., both a settings page and a header toggle) and stay in sync live within the same tab, `useLocalStorage` alone won't do that (each call has independent in-memory state) — that would call for lifting the state into Context instead.

---

### Scenario 4: A junior engineer's custom hook crashes the app with "Rendered fewer hooks than expected"

A teammate wrote this hook and it throws intermittently:

```jsx
function useValidatedField(value, isRequired) {
  if (isRequired) {
    const [touched, setTouched] = useState(false);
    return { touched, setTouched, isValid: !isRequired || value.length > 0 };
  }
  return { isValid: true };
}
```

They're confused because it works fine when `isRequired` never changes for a given field, but crashes when a form conditionally makes a field required based on another field's value.

**Approach:** Explain the root cause directly: the `useState` call is inside an `if`, so the number of hooks called varies between renders based on `isRequired` — a direct Rule of Hooks violation. Fix it by always calling `useState` unconditionally, and only *using* the conditional logic in what you do with its result:

```jsx
function useValidatedField(value, isRequired) {
  const [touched, setTouched] = useState(false); // always called, every render
  const isValid = !isRequired || value.length > 0;
  return { touched, setTouched, isValid };
}
```

This is a good moment to also recommend the team enable `eslint-plugin-react-hooks`'s `rules-of-hooks` rule in CI if it isn't already — it would have caught this exact conditional-hook-call pattern at write time, before it ever became a runtime crash reported by users.
