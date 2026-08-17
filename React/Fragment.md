**`<Fragment>`** (frequently written using the shorthand syntax **`<>...</>`**) is a built-in React component that lets you group multiple elements together without adding an extra wrapper node (like a `<div>`) to the DOM.

---

## 1. Reference

### `<Fragment>...</Fragment>` or `<>...</>`

* **`children`**: The elements you want to group.
* **Canary Feature (Refs on Fragments):** In modern React canary releases, Fragments can accept a `ref` attribute. This allows you to interact with or measure underlying DOM nodes across a group of elements without needing an extra wrapper DOM element.

---

## 2. Usage Scenarios

### Returning multiple elements from a component

Every React component must return a single root element. If you have adjacent elements (like table rows, list items, or sibling tags), wrapping them in a Fragment satisfies React's rule without bloating your HTML.

```jsx
function TableRow() {
  return (
    <>
      <td>Sudhir</td>
      <td>Persistent Systems</td>
    </>
  );
}

```

### Grouping elements with text

You can use fragments to interleave text and elements cleanly without breaking CSS layout rules (such as flexbox or grid containers).

### Rendering a list of Fragments with `key`

If you need to render a list of items where each item produces multiple elements, you must use the explicit `<Fragment key="{id}">` syntax so you can pass a `key` prop (the short syntax `<>...</>` does not accept attributes or keys).

```jsx
function Glossary({ items }) {
  return items.map(item => (
    <Fragment key={item.id}>
      <dt>{item.term}</dt>
      <dd>{item.description}</dd>
    </Fragment>
  ));
}

```

### Advanced Canary Feature: Refs and DOM Interactivity

Because canary versions of React allow `ref` on Fragments, you can attach refs to groups of elements to perform operations like managing focus, scrolling a group into view, or observing visibility via an `IntersectionObserver` all without introducing unnecessary wrapper `div`s into your HTML markup.
