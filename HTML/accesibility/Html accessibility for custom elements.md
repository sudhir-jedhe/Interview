Making custom elements (Web Components) accessible requires manually replicating the semantic information, keyboard behavior, and state updates that native HTML elements provide by default.

### 1. Semantics and ARIA

Custom HTML tags like `<custom-toggle>` have no implicit semantic meaning in the browser's accessibility tree.

* **Host Element Roles**: Use `role` on the host or its internal focusable target to communicate what the control is (e.g., `role="button"`, `role="switch"`, `role="dialog"`).
* **ARIA States & Properties**: Manage dynamic states explicitly (e.g., `aria-expanded`, `aria-checked`, `aria-disabled`).
* **Accessible Name**: Ensure the element has a label, either through internal text, an associated native `<label>`, `aria-label`, or `aria-labelledby`.

### 2. ElementInternals and `aria*` Properties

Modern browsers support `ElementInternals`, allowing you to attach default ARIA attributes directly to the custom element's definition without cluttering the outer DOM markup:

```javascript
class CustomCheckbox extends HTMLElement {
  constructor() {
    super();
    this.internals = this.attachInternals();
    this.internals.role = 'checkbox';
    this.internals.ariaChecked = 'false';
  }

  static get observedAttributes() {
    return ['checked'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'checked') {
      const isChecked = newValue !== null;
      this.internals.ariaChecked = isChecked ? 'true' : 'false';
    }
  }
}
customElements.define('custom-checkbox', CustomCheckbox);

```

### 3. Keyboard Navigation and Focus Management

Screen readers and keyboard-only users rely on consistent keyboard interactions:

* **Tab Sequence**: Add `tabindex="0"` to make an interactive custom element reachable via the `Tab` key. Use `tabindex="-1"` if it should be programmatically focusable only (e.g., items in a roving tabindex setup).
* **Standard Key Bindings**:
* **Buttons / Toggles**: Activate on `Enter` and `Space`. Prevent standard scrolling behavior on `Space` when pressed.
* **Menus / Dropdowns / Tabs**: Support Arrow keys (`ArrowUp`, `ArrowDown`, `ArrowLeft`, `ArrowRight`), `Home`, and `End`.
* **Modals / Popovers**: Dismiss on `Escape` and trap focus within the dialog while active.

* **Focus Delegation**: If using Shadow DOM, you can set `delegatesFocus: true` when calling `attachShadow`. When the host element receives focus, focus is automatically transferred to the first focusable child inside the shadow root.

```javascript
this.attachShadow({ mode: 'open', delegatesFocus: true });

```

### 4. Shadow DOM and Accessibility Tree Boundaries

Shadow boundaries isolate DOM nodes, which creates specific accessibility challenges:

* **Cross-Root ARIA References**: Standard ID-referencing attributes like `aria-labelledby`, `aria-describedby`, and `aria-controls` historically failed across shadow root boundaries. If a label exists outside the shadow tree, prefer using `<slot>` elements or `ElementInternals.ariaLabelledByElements` where supported.
* **Form-Associated Custom Elements (FACE)**: By setting `static formAssociated = true`, custom elements can participate directly in native `<form>` submission, validation, and standard form labeling.

```javascript
class CustomInput extends HTMLElement {
  static formAssociated = true;

  constructor() {
    super();
    this.internals = this.attachInternals();
  }

  // Links custom control directly with an outer <label for="...">
  formDisabledCallback(disabled) {
    this.internals.ariaDisabled = disabled ? 'true' : 'false';
  }
}

```

### 5. Managing Live Changes

* **Live Regions**: When custom components update asynchronously (like an alert banner or a live search dropdown), declare `aria-live="polite"` or `aria-live="assertive"` so screen readers announce changes without requiring user focus.
* **Slot Changes**: Listen to the `slotchange` event on internal `<slot>` elements if dynamic slot content impacts the element’s accessible name or child count.
