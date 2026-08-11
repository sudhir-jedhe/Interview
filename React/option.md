<https://react.dev/reference/react-dom/components/option>

Here is the recreated and cleanly formatted reference guide for the built-in React `<option>` component, based on the official documentation.

# The `<option>` Component

The built-in browser `<option>` component allows you to render individual choices inside a `<select>` drop-down box.

```jsx
<select>
  <option value="someOption">Some option</option>
  <option value="otherOption">Other option</option>
</select>

```

---

## Props Reference

The `<option>` component supports all standard HTML element props. Additionally, it specifically supports:

* **`value`** *(string | number)*: The value that will be submitted with the parent `<select>` in a form if this specific option is chosen by the user.
* **`disabled`** *(boolean)*: If `true`, the option cannot be selected by the user and will appear dimmed in the drop-down menu.
* **`label`** *(string)*: Specifies a shorter or alternate meaning for the option. If not specified, the browser will display the text content nested inside the `<option>` tags.

---

## ⚠️ Important Caveats

In standard HTML, you would use the `selected` attribute directly on an `<option>` to set it as the default choice. **React does not support the `selected` attribute on `<option>`.**

Instead, you manage the selected state at the parent `<select>` level:

* **For uncontrolled inputs:** Pass the option's value to the parent `<select defaultValue="...">`.
* **For controlled inputs:** Pass the option's value to the parent `<select value="...">`.

---

## Usage Guide

### Displaying a select box with options

To create a drop-down menu, render a `<select>` element and nest a list of `<option>` components inside it. Give each `<option>` a `value` representing the underlying data that should be submitted when that option is picked.

```jsx
export default function FruitPicker() {
  return (
    <label>
      Pick a fruit:
      <select name="selectedFruit" defaultValue="banana">
        <option value="apple">Apple</option>
        <option value="banana">Banana</option>
        <option value="orange">Orange</option>
      </select>
    </label>
  );
}

```

*(In the example above, "Banana" will be selected by default because its `value` matches the `defaultValue` of the parent `<select>`)*.
