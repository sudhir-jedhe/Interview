<https://react.dev/reference/react-dom/components/textarea>

Here is the recreated and cleanly formatted reference guide for the built-in React `<textarea>` component, based on the official documentation.

# The `<textarea>` Component

The built-in browser `<textarea>` component allows you to render a multiline text input.

```jsx
<textarea name="postContent" />

```

---

## Props Reference

The `<textarea>` component supports all standard HTML element props.

### Controlled Text Area Props

To make a text area **controlled** (managed by React state), use these props. When using `value`, you **must** also provide an `onChange` handler.

* **`value`** *(string)*: Controls the exact text inside the text area.
* **`onChange`** *(function)*: Required for controlled text areas. Fires immediately on every user interaction (e.g., every keystroke) to synchronously update the state.

### Uncontrolled Text Area Props

To let the DOM manage the text area's state, use this prop to set the *initial* value only:

* **`defaultValue`** *(string)*: Specifies the initial text content for the text area.

### Other Notable Props

* **`rows`** *(number)*: Specifies the default height in average character heights. Defaults to 2.
* **`cols`** *(number)*: Specifies the default width in average character widths. Defaults to 20.
* **`wrap`** *(string)*: Either `'hard'`, `'soft'`, or `'off'`. Specifies how text should wrap when submitting a form.
* **`name`** *(string)*: Specifies the name used to identify the text area data when submitting a form.
* **`disabled`** *(boolean)*: If `true`, the text area is not interactive and appears dimmed.
* **`readOnly`** *(boolean)*: If `true`, the text area cannot be edited by the user, but remains focusable.

---

## ⚠️ Important Caveats

1. **No Children Allowed:** Unlike standard HTML, **you cannot pass text as children** to a React text area (e.g., `<textarea>Some text</textarea>` is invalid). You must use `defaultValue` or `value` instead.
2. **Controlled State:** If a `<textarea>` receives a `value` prop (even an empty string), it is treated as controlled.
3. **Consistency:** A text area cannot be both controlled and uncontrolled simultaneously, nor can it switch between the two over its lifecycle.
4. **Synchronous Updates:** Every controlled text area requires an `onChange` handler that *synchronously* updates the state to match `e.target.value`.

---

## Usage Guide

### 1. Displaying a Text Area with a Label

Always associate your `<textarea>` with a `<label>`. You can nest the text area inside the label, or link them using the `htmlFor` attribute combined with `useId`.

```jsx
import { useId } from 'react';

export default function Form() {
  const postTextAreaId = useId();
  
  return (
    <>
      <label htmlFor={postTextAreaId}>Write your post:</label>
      <textarea
        id={postTextAreaId}
        name="postContent"
        rows={4}
        cols={40}
      />
    </>
  );
}

```

### 2. Providing an Initial Value (Uncontrolled)

If you only need to populate the text area with starting text and let the browser handle edits, use `defaultValue`.

```jsx
export default function EditPost() {
  return (
    <label>
      Edit your post:
      <textarea
        name="postContent"
        defaultValue="I really enjoyed biking yesterday!"
        rows={4}
      />
    </label>
  );
}

```

### 3. Reading the Value on Form Submit

Wrap your text area in a `<form>` and give it a `name` attribute. You can extract the text area's content in the `onSubmit` handler using the native `FormData` API.

```jsx
export default function EditPost() {
  function handleSubmit(e) {
    e.preventDefault();

    const form = e.target;
    const formData = new FormData(form);

    // Convert to a plain object: { postContent: "..." }
    const formJson = Object.fromEntries(formData.entries());
    console.log(formJson);
  }

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Write your post:
        <textarea name="postContent" rows={4} />
      </label>
      <button type="submit">Save post</button>
    </form>
  );
}

```

### 4. Controlling a Text Area with State

If you need to update the UI instantly on every keystroke (like generating a live Markdown preview or showing a character count), use a controlled text area.

```jsx
import { useState } from 'react';

export default function NewPost() {
  // Initialize with an empty string, NOT null or undefined
  const [postContent, setPostContent] = useState(''); 

  return (
    <label>
      Write your post:
      <textarea
        value={postContent}
        onChange={e => setPostContent(e.target.value)}
        rows={4}
      />
    </label>
  );
}

```

---

## Troubleshooting

### "You provided a value prop... without an onChange handler"

If you provide `value={...}` but no `onChange`, React makes the text area read-only.

* **Fix A (Uncontrolled):** If you just wanted an initial value, change `value` to `defaultValue`.
* **Fix B (Controlled):** Add an `onChange={e => setState(e.target.value)}` handler.
* **Fix C (Intentional):** If it's supposed to be read-only, add the `readOnly={true}` prop to silence the warning.

### My text area caret jumps to the beginning on every keystroke

This happens if you do not update the state *synchronously* to the exact value of `e.target.value`.

* **Do not** update it asynchronously (e.g., inside a `setTimeout`).
* **Do not** force format it inside the `onChange` (e.g., `setPostContent(e.target.value.toUpperCase())`).
* Ensure the component isn't losing its `key` or re-mounting on every render (which happens if you define a component inside another component).

### "A component is changing an uncontrolled input to be controlled"

You cannot pass `value={undefined}` initially and later pass `value="some text"`.

* **Fix:** If your data comes from an API, initialize your state as `''` (empty string) instead of `null`/`undefined`, or fall back to an empty string in the JSX: `<textarea value={data ?? ''} />`.
