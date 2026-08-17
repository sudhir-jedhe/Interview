# Interview Questions — Event Handling & Forms

**Q: What is a `SyntheticEvent`, and why does React use it instead of exposing the native event directly?**
It's a cross-browser wrapper object React passes to event handlers instead of the raw browser `Event`, normalizing property names and behavior so handler code doesn't need browser-specific special cases. It exposes the same core interface as a native event (`target`, `preventDefault()`, `stopPropagation()`, etc.), plus access to the original via `event.nativeEvent` when needed.

**Q: Do you need to call `event.persist()` to read event properties inside an async callback like `setTimeout`?**
Not in modern React (17+) — synthetic events used to be pooled and their fields nulled out after the handler returned unless `persist()` was called, but that pooling was removed, so event properties remain accessible in async code without any extra step.

**Q: Why don't function components have `this`-binding issues with event handlers the way class components historically did?**
Function components have no `this` context at all — handlers are just regular functions (often defined inline or as local `const`s) that close over the component's props and state via normal JavaScript closures, not via a `this` reference that needs explicit binding. Class components needed `.bind(this)` in the constructor or arrow-function class fields specifically because regular class methods lose their `this` binding when passed as a callback (like `onClick={this.handleClick}`).

**Q: What's the difference between a controlled and an uncontrolled input?**
A controlled input's displayed value is driven entirely by React state — you pass `value` and update it via `onChange`, so state is the single source of truth and the DOM value always mirrors it. An uncontrolled input manages its own value internally in the DOM, and React only reads it on demand (typically via a `ref`) rather than tracking every keystroke in state.

**Q: When would you deliberately choose an uncontrolled input over a controlled one?**
For simple, low-interaction forms where you don't need live validation or derived UI per keystroke; when integrating a non-React widget that expects to manage its own DOM state; and for `<input type="file">`, which can't be controlled by React at all since browsers don't allow JavaScript to programmatically set a file input's value for security reasons.

**Q: How do you handle multiple form fields with a single change handler instead of writing one handler per field?**
Give each input a `name` attribute matching a key in one state object, and read `e.target.name`/`e.target.value` generically inside one handler to update just that key.

```jsx
function handleChange(e) {
  const { name, value } = e.target;
  setForm(prev => ({ ...prev, [name]: value }));
}
```

**Q: Why should form submission logic go on the form's `onSubmit` rather than a submit button's `onClick`?**
Because `onSubmit` fires regardless of whether the form was submitted by clicking a `type="submit"` button or by pressing Enter while focused in a text field, while `onClick` on the button only catches the click path — missing Enter-key submission entirely, which is a real accessibility/UX gap.

**Q: What does `event.preventDefault()` do in a form's `onSubmit` handler, and why is it almost always needed?**
It cancels the browser's default behavior for that submission, which is a full-page navigation/reload (submitting to the current URL or the form's `action`). In a React single-page app, you almost always want to handle submission with JavaScript (an API call, client-side routing) instead of letting the browser reload the page, so `preventDefault()` is standard in nearly every `onSubmit` handler.

**Q: How would you implement debouncing for a search input without an external library?**
Use `useEffect` keyed on the input value: schedule a `setTimeout` to perform the actual search, and return a cleanup function that clears that timeout. Because the cleanup runs before the effect re-runs on the next keystroke, each new keystroke cancels the previous pending call, so the actual search only fires once the user pauses typing for the debounce duration.

**Q: Where does React actually attach the native event listeners for things like `onClick`, and why does that matter?**
Rather than attaching a native listener to every individual DOM element with a handler, React attaches one listener per event type at the root container the app is rendered into (as of React 17+; earlier versions used `document`), and internally dispatches to the correct component handler by walking the React element tree. This event delegation is largely invisible to application code, but it means the native DOM event still bubbles through the real DOM tree independent of React's own synthetic dispatch — so `stopPropagation()` on a synthetic event stops other React handlers from firing, but doesn't stop a native listener attached directly to a DOM ancestor via `addEventListener`.

**Q: If you call `event.stopPropagation()` inside a React child's click handler, will a parent's native `document.addEventListener('click', ...)` listener still fire?**
Yes. `stopPropagation()` on a SyntheticEvent only stops propagation within React's own delegated event system (further React `onClick` handlers up the component tree) — it has no effect on native listeners attached directly to real DOM nodes, since the native click event bubbles through the actual DOM independently of React's synthetic dispatch mechanism.
