<https://react.dev/reference/react-dom/components/select>

Here is the recreated and cleanly formatted reference guide for the built-in React `<select>` component, based on the official documentation.

# The `<select>` Component

The built-in browser `<select>` component allows you to render a drop-down menu (select box) containing a list of options.

```jsx
<select>
  <option value="someOption">Some option</option>
  <option value="otherOption">Other option</option>
</select>

```

---

## Props Reference

The `<select>` component supports all standard HTML element props.

### Controlled Select Props

To make a select box **controlled** (managed by React state), use these props. When using `value`, you **must** also provide an `onChange` handler.

* **`value`** *(string | array of strings)*: Controls which option is currently selected. If `multiple={true}`, this must be an array of strings. Every value string must match the `value` of a nested `<option>`.
* **`onChange`** *(function)*: Required for controlled selects. Fires immediately when the user picks a different option, behaving like the browser `input` event.

### Uncontrolled Select Props

To let the DOM manage the select box's state, use this prop to set the *initial* value only:

* **`defaultValue`** *(string | array of strings)*: Specifies the initially selected option(s). Use an array if `multiple={true}`.

### Other Notable Props

* **`multiple`** *(boolean)*: If `true`, the browser allows multiple options to be selected at once.
* **`children`**: Accepts `<option>`, `<optgroup>`, and `<datalist>` components. Custom components can be passed if they eventually render these tags.
* **`name`** *(string)*: Specifies the name used to identify the select box data when submitting a form.
* **`size`** *(number)*: For `multiple={true}` selects, specifies the preferred number of options visible at once.
* **`disabled`** *(boolean)*: If `true`, the select box is not interactive and appears dimmed.

---

## ⚠️ Important Caveats

1. **No `selected` attribute:** Unlike standard HTML, React **does not support** the `selected` attribute on individual `<option>` tags. You must use `defaultValue` (uncontrolled) or `value` (controlled) on the parent `<select>` element instead.
2. **Controlled State:** If a `<select>` receives a `value` prop, it is treated as controlled. It cannot be both controlled and uncontrolled, nor can it switch between the two over its lifecycle.
3. **Synchronous Updates:** Every controlled select requires an `onChange` event handler that synchronously updates the state to match the user's selection.

---

## Usage Guide

### 1. Displaying a Select Box with a Label

Always associate your `<select>` with a `<label>` for accessibility. You can nest it, or use the `htmlFor` attribute combined with `useId`. Give each `<option>` a `value` that will be submitted with the form.

```jsx
import { useId } from 'react';

export default function FruitPicker() {
  const fruitSelectId = useId();

  return (
    <>
      {/* Nested label (Preferred) */}
      <label>
        Pick a fruit:
        <select name="selectedFruit" defaultValue="orange">
          <option value="apple">Apple</option>
          <option value="banana">Banana</option>
          <option value="orange">Orange</option>
        </select>
      </label>

      {/* Linked via ID */}
      <label htmlFor={fruitSelectId}>Pick a fruit:</label>
      <select id={fruitSelectId} name="selectedFruit">
        <option value="apple">Apple</option>
      </select>
    </>
  );
}

```

### 2. Enabling Multiple Selection

Pass `multiple={true}` to allow users to select more than one option. If you provide a `defaultValue`, it **must** be an array.

```jsx
export default function VegetablePicker() {
  return (
    <label>
      Pick all your favorite vegetables:
      <select
        name="selectedVegetables"
        multiple={true}
        defaultValue={['corn', 'tomato']}
      >
        <option value="cucumber">Cucumber</option>
        <option value="corn">Corn</option>
        <option value="tomato">Tomato</option>
      </select>
    </label>
  );
}

```

### 3. Reading the Value on Form Submit (Uncontrolled)

Wrap your select box in a `<form>`. You can read the selected values inside your `onSubmit` handler using `FormData`.

> **Pitfall:** `Object.fromEntries(formData.entries())` will **drop** values if a `multiple` select has more than one option chosen. Instead, use `formData.getAll('yourSelectName')` or parse the entries directly.

```jsx
export default function EditPost() {
  function handleSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    
    // For single select:
    console.log(formData.get('selectedFruit')); 
    
    // For multiple select (returns an array of selected values):
    console.log(formData.getAll('selectedVegetables')); 
  }

  return (
    <form onSubmit={handleSubmit}>
      <select name="selectedFruit">
        <option value="apple">Apple</option>
      </select>
      
      <select name="selectedVegetables" multiple={true}>
        <option value="corn">Corn</option>
        <option value="tomato">Tomato</option>
      </select>
      
      <button type="submit">Submit</button>
    </form>
  );
}

```

### 4. Controlling a Select Box with State

If you need to update the UI instantly when the selection changes, use a controlled select.

For standard selects, update the state with `e.target.value`. For `multiple={true}` selects, you must iterate over `e.target.selectedOptions` to extract the array of values.

```jsx
import { useState } from 'react';

export default function ControlledPicker() {
  const [selectedFruit, setSelectedFruit] = useState('orange');
  const [selectedVegs, setSelectedVegs] = useState(['corn', 'tomato']);

  return (
    <>
      {/* Controlled Single Select */}
      <select
        value={selectedFruit}
        onChange={e => setSelectedFruit(e.target.value)}
      >
        <option value="apple">Apple</option>
        <option value="banana">Banana</option>
        <option value="orange">Orange</option>
      </select>

      {/* Controlled Multiple Select */}
      <select
        multiple={true}
        value={selectedVegs}
        onChange={e => {
          // Extract an array of values from the selectedOptions NodeList
          const options = [...e.target.selectedOptions];
          const values = options.map(option => option.value);
          setSelectedVegs(values);
        }}
      >
        <option value="cucumber">Cucumber</option>
        <option value="corn">Corn</option>
        <option value="tomato">Tomato</option>
      </select>
    </>
  );
}

```

**`<select>`** is the built-in browser component that lets you render a drop-down select list box for users to choose one or multiple options.

In React, the `<select>` component handles value state and selection slightly differently than standard HTML, offering both uncontrolled and controlled paradigms.

---

## 1. Reference

### `<select>...</select>`

* **Key Attributes:**
* **`value`**: Pass this prop to make the select box **controlled**. Its value should match the `value` attribute of the selected `<option>`.
* **`defaultValue`**: Pass this prop to set the initially selected option for an **uncontrolled** select box.
* **`multiple`**: When set to `true`, allows users to select multiple options simultaneously (usually rendered as a scrolling list box instead of a dropdown).
* **`onChange`**: Callback fired when the user selects a new option.

---

## 2. Usage Scenarios

### Displaying a select box with options

In standard HTML, you select an option by adding a `selected` attribute to an `<option>`. In React, you generally manage selection via the `<select>` tag's `value` or `defaultValue` props instead of putting `selected` on individual options.

```jsx
function FruitSelect() {
  return (
    <select defaultValue="apple">
      <option value="apple">Apple</option>
      <option value="banana">Banana</option>
      <option value="orange">Orange</option>
    </select>
  );
}

```

### Providing a label for a select box

To ensure accessibility, always associate your `<select>` with a `<label>` using either the `htmlFor` / `id` attributes or by wrapping the select inside the label.

```jsx
<div>
  <label htmlFor="fruit-select">Choose a fruit:</label>
  <select id="fruit-select" defaultValue="apple">
    <option value="apple">Apple</option>
    <option value="banana">Banana</option>
  </select>
</div>

```

### Enabling multiple selection

By adding the `multiple` attribute, users can select more than one option (by holding Cmd/Ctrl). When `multiple={true}`, the state or form data should handle an array of selected values.

```jsx
<select multiple defaultValue={['apple', 'orange']}>
  <option value="apple">Apple</option>
  <option value="banana">Banana</option>
  <option value="orange">Orange</option>
</select>

```

### Reading the select box value when submitting a form

When used inside a native `<form>` leveraging React Actions or standard `FormData`, you give the `<select>` a `name` attribute, and React automatically extracts the selected value upon submission.

```jsx
async function handleSubmit(formData) {
  'use server';
  const selectedFruit = formData.get('fruit');
  console.log("User selected:", selectedFruit);
}

function Form() {
  return (
    <form action={handleSubmit}>
      <select name="fruit" defaultValue="banana">
        <option value="apple">Apple</option>
        <option value="banana">Banana</option>
      </select>
      <button type="submit">Submit</button>
    </form>
  );
}

```

### Controlling a select box with a state variable

To make the select box controlled, tie its `value` prop to a React `useState` variable and update it via `onChange`.

```jsx
import { useState } from 'react';

function ControlledSelect() {
  const [flavor, setFlavor] = useState('coconut');

  return (
    <form>
      <label>
        Pick your favorite flavor:
        <select value={flavor} onChange={(e) => setFlavor(e.target.value)}>
          <option value="grapefruit">Grapefruit</option>
          <option value="lime">Lime</option>
          <option value="coconut">Coconut</option>
          <option value="mango">Mango</option>
        </select>
      </label>
      <p>Selected: {flavor}</p>
    </form>
  );
}

```
