# Components & Props

## Function components

A React function component is just a function that takes `props` and returns JSX (or `null`). That's the whole contract:

```jsx
function Greeting(props) {
  return <h1>Hello, {props.name}!</h1>;
}

// usage
<Greeting name="Ada" />
```

React calls this function on every render, passing a new `props` object each time. Destructuring in the signature is the idiomatic style:

```jsx
function Greeting({ name }) {
  return <h1>Hello, {name}!</h1>;
}
```

## Props are read-only

Props flow one direction: parent to child. A component must never mutate its own `props` object — React relies on this immutability contract to know when it's safe to bail out of re-rendering (e.g. with `React.memo`, covered elsewhere). Mutating props directly doesn't trigger a re-render anyway, since React only reacts to `setState`/`useState` calls, so it just produces silent bugs:

```jsx
// Wrong — never do this
function Bad(props) {
  props.items.push('new'); // mutates the parent's array in place
  return <ul>{props.items.map(i => <li key={i}>{i}</li>)}</ul>;
}
```

If a child needs to change something driven by a prop, it should call a callback passed down as a prop (e.g. `onChange`), letting the *owner* of that state update it — this is "lifting state up," covered in the state topic.

## `props.children`

Anything nested between a component's opening and closing tags is passed as the special `children` prop. This is what makes components composable containers rather than fixed templates:

```jsx
function Card({ children }) {
  return <div className="card">{children}</div>;
}

<Card>
  <h2>Title</h2>
  <p>Body text</p>
</Card>
```

`children` can be a single element, a string, an array of elements, or even a function (the "render props" pattern, covered elsewhere). This is the backbone of layout components like `Modal`, `Card`, `Layout` — they don't need to know what's inside them.

## Prop drilling

When data needs to reach a deeply nested component, and every intermediate component has to accept and forward a prop it doesn't itself use, that's prop drilling:

```jsx
function App() {
  const [user, setUser] = React.useState({ name: 'Ada' });
  return <Page user={user} />;
}
function Page({ user }) {
  return <Sidebar user={user} />; // Page doesn't use `user`, just forwards it
}
function Sidebar({ user }) {
  return <Avatar user={user} />; // same here
}
function Avatar({ user }) {
  return <img src={user.avatarUrl} alt={user.name} />;
}
```

It's not *wrong*, but it becomes a maintenance burden as the tree grows: every intermediate component's signature is coupled to data it doesn't care about, and moving/renaming that data means touching every layer. Common fixes: `Context` for cross-cutting data (theme, auth, locale), composition (passing already-built elements down via `children` instead of raw data), or a state management library for genuinely global app state.

## Default props

Provide fallback values via destructuring defaults (the standard function-component idiom — the old static `defaultProps` field on the component is legacy and deprecated for function components):

```jsx
function Button({ label = 'Submit', variant = 'primary' }) {
  return <button className={`btn btn-${variant}`}>{label}</button>;
}
```

## Controlled vs. presentational thinking

"Presentational" (or "dumb") components only render based on props and don't own business logic or state beyond trivial UI-local state (like a hover flag); "controlled" (or "container") components own state/data-fetching and pass values + callbacks down. This isn't an official React API distinction, but a design heuristic: keeping presentational components free of side effects makes them trivially reusable and testable.

```jsx
// Presentational — pure function of props
function TextInput({ value, onChange, placeholder }) {
  return <input value={value} onChange={onChange} placeholder={placeholder} />;
}

// Controlling — owns the state
function SearchBox() {
  const [query, setQuery] = React.useState('');
  return <TextInput value={query} onChange={e => setQuery(e.target.value)} placeholder="Search…" />;
}
```

## PropTypes vs. TypeScript (brief)

`PropTypes` does runtime prop validation with console warnings in development — useful in plain JavaScript codebases but adds zero compile-time safety and no editor autocomplete. TypeScript validates prop shapes at compile time and gives IDE autocomplete, which is why most modern codebases prefer it over `PropTypes` when using a typed setup. TypeScript-specific typing patterns for props have their own dedicated repo/topic.
