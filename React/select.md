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
