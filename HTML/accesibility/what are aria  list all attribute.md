**ARIA (Accessible Rich Internet Applications)** is a set of roles, states, and properties defined by the W3C to make web content and dynamic user interface controls accessible to assistive technologies like screen readers.

While **roles** define what an element is (e.g., `role="button"`), **ARIA attributes** (states and properties) describe its status, relationships, and characteristics.

---

### Widget Attributes

Attributes that define the state and behavior of interactive UI components:

* **`aria-autocomplete`**: Indicates whether user input completion suggestions are provided (`inline`, `list`, `both`, `none`).
* **`aria-checked`**: Indicates the current "checked" state of checkboxes, radio buttons, or switches (`true`, `false`, `mixed`).
* **`aria-disabled`**: Indicates that the element is perceivable but disabled/inactive (`true`, `false`).
* **`aria-expanded`**: Indicates whether a collapsible section or popup is open or closed (`true`, `false`).
* **`aria-haspopup`**: Indicates that the element triggers a popup menu, listbox, tree, grid, or dialog.
* **`aria-hidden`**: Hides an element and all its children from the accessibility tree (`true`, `false`).
* **`aria-invalid`**: Indicates that the entered value does not conform to expected formats or rules (`grammar`, `spelling`, `true`, `false`).
* **`aria-label`**: Defines a direct string that labels the current element.
* **`aria-level`**: Defines the hierarchical level of an element (e.g., heading levels, tree items).
* **`aria-modal`**: Indicates whether an element is modal when displayed, preventing interaction with content outside it (`true`, `false`).
* **`aria-multiline`**: Indicates whether a text box accepts multiple lines of input (`true`, `false`).
* **`aria-multiselectable`**: Indicates whether multiple items can be selected at once (`true`, `false`).
* **`aria-orientation`**: Defines whether the element is horizontal or vertical (`horizontal`, `vertical`).
* **`aria-placeholder`**: Defines a short hint intended to help the user with data entry.
* **`aria-pressed`**: Indicates the current toggle state of a toggle button (`true`, `false`, `mixed`).
* **`aria-readonly`**: Indicates that the element is not editable, though it may still be focusable (`true`, `false`).
* **`aria-required`**: Indicates that user input is required before form submission (`true`, `false`).
* **`aria-selected`**: Indicates the current selected state of items like tabs or listbox options (`true`, `false`).
* **`aria-sort`**: Indicates whether items in a table or grid are sorted in ascending or descending order.
* **`aria-valuemax`**: Defines the maximum allowed value for range widgets (sliders, progress bars).
* **`aria-valuemin`**: Defines the minimum allowed value for range widgets.
* **`aria-valuenow`**: Defines the current numeric value for range widgets.
* **`aria-valuetext`**: Defines a human-readable text alternative to `aria-valuenow` (e.g., "$30" or "Low").

---

### Live Region Attributes

Attributes used to notify screen readers of dynamic content updates without losing focus:

* **`aria-atomic`**: Indicates whether assistive technologies will present all, or only parts of, the changed region (`true`, `false`).
* **`aria-busy`**: Indicates that an element is being modified (e.g., loading data), asking screen readers to hold off until updates finish (`true`, `false`).
* **`aria-live`**: Sets how aggressively assistive technologies announce dynamic updates (`off`, `polite`, `assertive`).
* **`aria-relevant`**: Specifies what types of changes inside a live region are announced (`additions`, `removals`, `text`, `all`).

---

### Relationship Attributes

Attributes that describe relationships between distinct DOM elements:

* **`aria-activedescendant`**: Identifies the currently active descendant element within a composite widget (managing focus without moving DOM focus).
* **`aria-colcount`**: Defines the total number of columns in a table, grid, or treegrid.
* **`aria-colindex`**: Defines an element's column position within the total number of columns.
* **`aria-colindextext`**: Provides a human-readable text alternative to `aria-colindex`.
* **`aria-colspan`**: Defines the number of columns spanned by a cell or gridcell.
* **`aria-controls`**: Identifies the element(s) whose contents or presence are controlled by the current element.
* **`aria-describedby`**: References the element(s) that describe the current element (useful for help text or error messages).
* **`aria-description`**: Defines a string value that directly describes the element.
* **`aria-details`**: References an element that provides detailed, extended information about the object.
* **`aria-errormessage`**: References the element that contains the error message for an invalid form field.
* **`aria-flowto`**: Identifies the next element in an alternate reading order.
* **`aria-labelledby`**: References the element(s) that label the current element.
* **`aria-owns`**: Defines a parent-child relationship between elements that are separate in the DOM structure.
* **`aria-posinset`**: Defines the element's position within a set (e.g., item 3 of 10).
* **`aria-rowcount`**: Defines the total number of rows in a table, grid, or treegrid.
* **`aria-rowindex`**: Defines an element's row position within the total number of rows.
* **`aria-rowindextext`**: Provides a human-readable text alternative to `aria-rowindex`.
* **`aria-rowspan`**: Defines the number of rows spanned by a cell or gridcell.
* **`aria-setsize`**: Defines the total number of items in a set (works alongside `aria-posinset`).

---

### Drag-and-Drop & Deprecated Attributes

* **`aria-braillelabel`**: Defines a specific braille string alternative to standard labels for refreshable braille displays.
* **`aria-brailleroledescription`**: Defines a specific braille role description for braille displays.
* **`aria-current`**: Indicates the element representing the current item within a container or set (e.g., `page`, `step`, `location`, `date`, `time`, `true`).
* **`aria-keyshortcuts`**: Lists the keyboard shortcuts defined on the element.
* **`aria-roledescription`**: Defines a human-readable, author-provided label for the element's role (use sparingly).
* **`aria-grabbed`**: *(Deprecated in ARIA 1.1)* Indicated an element's grabbed state in drag-and-drop.
* **`aria-dropeffect`**: *(Deprecated in ARIA 1.1)* Indicated what drop operations were allowed.
