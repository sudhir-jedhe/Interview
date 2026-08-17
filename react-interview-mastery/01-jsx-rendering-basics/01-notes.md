# JSX & Rendering Basics

## JSX is not HTML

JSX looks like HTML but it's syntactic sugar over function calls. When you write:

```jsx
const el = <h1 className="title">Hello</h1>;
```

Babel (or the TypeScript compiler) transforms it into either the classic form:

```jsx
const el = React.createElement('h1', { className: 'title' }, 'Hello');
```

or, with the modern automatic JSX runtime (React 17+), into a call to `jsx` imported automatically from `react/jsx-runtime`:

```jsx
import { jsx as _jsx } from 'react/jsx-runtime';
const el = _jsx('h1', { className: 'title', children: 'Hello' });
```

Either way, the result is a plain JavaScript object — a **React element** — describing what should be on screen: a type (string tag or component function), props, and children. It is not a DOM node. React elements are cheap, immutable descriptions; the actual DOM nodes are created and updated by React internally.

This is why `class` becomes `className` and `for` becomes `htmlFor` in JSX — they're just object property names being passed to `createElement`, not real HTML attributes.

## Expressions vs. statements

Inside `{}` in JSX you can only use **expressions** (things that produce a value), never statements. `if`, `for`, and variable declarations don't work directly:

```jsx
// Broken — if is a statement
function Bad({ loggedIn }) {
  return <div>{ if (loggedIn) { 'Hi' } }</div>; // SyntaxError
}

// Fine — ternary is an expression
function Good({ loggedIn }) {
  return <div>{loggedIn ? 'Hi' : 'Please log in'}</div>;
}
```

If you need statement-level logic, pull it out above the `return`.

## Single root element

Every JSX expression must resolve to a single element, because `createElement`/`jsx` returns one object, not an array. This fails:

```jsx
// Error: Adjacent JSX elements must be wrapped in an enclosing tag
return (
  <h1>Title</h1>
  <p>Body</p>
);
```

Wrap with a real DOM element or a `Fragment` (`<>...</>`) when you don't want an extra DOM wrapper:

```jsx
return (
  <>
    <h1>Title</h1>
    <p>Body</p>
  </>
);
```

## The Virtual DOM and reconciliation, briefly

Each render produces a new tree of React elements — the "virtual DOM." React diffs this new tree against the previous one (reconciliation) and computes the minimal set of real DOM mutations needed, then applies them in a commit phase. Key heuristics: elements of a different type at the same position cause a full subtree teardown/rebuild; elements of the same type get their props patched in place; siblings in a list are matched by `key`, not by position, so an unstable or missing `key` causes React to misattribute state to the wrong item (a very common source of "why did my input lose focus / show the wrong value" bugs).

```jsx
// Bad: index as key when list order can change
{items.map((item, i) => <Row key={i} {...item} />)}

// Good: stable identity
{items.map((item) => <Row key={item.id} {...item} />)}
```

## Rendering lists and conditionals

Lists are just `.map()` returning an array of elements — JSX handles arrays of elements fine (unlike a single root). Conditional rendering has three idiomatic forms:

```jsx
{isLoading && <Spinner />}                 // render-or-nothing
{isError ? <ErrorBanner /> : <Content />}  // render-one-of-two
if (!user) return <LoginPrompt />;          // early return, outside JSX
```

Watch the `&&` trap: if the left side is `0` (a falsy number, not `false`), React renders the literal `0` on screen instead of nothing.

```jsx
{items.length && <List items={items} />} // renders "0" when items is empty!
{items.length > 0 && <List items={items} />} // correct
```

## Batching

React batches multiple state updates that occur within the same synchronous event handler (and, since React 18, inside promises, timeouts, and native event handlers too — "automatic batching") into a single re-render for performance, rather than re-rendering after every `setState` call.

```jsx
function handleClick() {
  setCount(c => c + 1);
  setFlag(f => !f);
  // Only one re-render happens, after both updates are applied.
}
```
