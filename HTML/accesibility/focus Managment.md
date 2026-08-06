**Focus management in a Single Page Application (SPA)** is crucial for accessibility and usability. In SPAs, content is dynamically loaded without a page refresh, which can cause issues with focus. When content changes (such as opening a modal, navigating to a new view, or loading new content), you need to ensure that focus is placed appropriately to help users, especially those using screen readers or navigating via keyboard.

Here's how **focus management** works in an SPA and best practices to implement it:

### **Why Focus Management is Important in SPAs**
- **Keyboard Users**: Users who rely on the keyboard for navigation need clear, predictable focus behavior. Without proper management, they might get lost or struggle to interact with dynamically loaded content.
- **Screen Reader Users**: Screen readers announce elements that are in focus. If focus is not managed properly, screen reader users may miss important updates.
- **Consistency**: Users expect consistent behavior when interacting with your application. Losing focus or having focus jump unpredictably can frustrate users.

### **Best Practices for Focus Management in SPAs**

1. **Maintain Focus When Navigating Between Views or Components**
   - When navigating between different sections or pages in an SPA, it’s important to manage focus on the first interactive element of the new view or component.
   - **Example**: After navigating to a new page or section, the focus should be set to the top of the new page or to the first element (e.g., the first link, button, or form field).

2. **Focus on Modals and Dialogs**
   - When opening a modal or dialog, you should move focus into the modal (preferably to the first focusable element like the close button or the first input field).
   - Ensure the focus remains trapped inside the modal until it’s closed to prevent users from accidentally tabbing to elements behind it.
   - When the modal is closed, the focus should return to the element that triggered it.

3. **Use `focus()` and `tabindex`**
   - Use the `focus()` method to programmatically set focus to an element, such as a button or input field, after a state change or view update.
   - You can also use `tabindex` to control the order of focusable elements.
   
4. **Focus on Dynamic Content Changes**
   - When content is dynamically updated (such as an alert, toast message, or a new section being displayed), make sure that focus is shifted to the new content so that users are aware of it.
   - **Example**: If an error message appears, focus should be set to the message, so screen reader users will be notified of the error.

5. **Use ARIA Roles and Properties**
   - Use ARIA (Accessible Rich Internet Applications) roles and properties like `aria-live`, `aria-hidden`, `aria-expanded`, etc., to convey changes in content or UI state.
   - **Example**: For an error message, you could use `aria-live="assertive"` to make sure that screen readers announce the error immediately when it appears.

6. **Trap Focus in Modals or Pop-ups**
   - When opening a modal or pop-up, prevent focus from escaping by keeping it trapped within the modal using JavaScript.
   - **Example**: When the modal is open, make sure the focus remains on the modal's content (using a `focus-trap` library or custom JavaScript) and doesn’t shift to other parts of the page.

---

### **Example Code: Focus Management in SPA**

#### **1. Focus Management on Navigation Change**

When navigating between views, use JavaScript to ensure focus is placed on a meaningful element in the new view:

```javascript
function handlePageChange(newPageId) {
  // Focus on the first element of the new page
  const firstFocusableElement = document.querySelector(`#${newPageId} .first-focusable-element`);
  if (firstFocusableElement) {
    firstFocusableElement.focus();
  }
}
```

Call this function whenever the page or view changes to move the focus to the top of the new page or a specific element.

---

#### **2. Focus Management for Modals**

Here’s how to ensure focus is managed properly when opening and closing a modal:

```javascript
function openModal(modalId) {
  const modal = document.getElementById(modalId);
  const firstFocusableElement = modal.querySelector('button, input, select, a');
  const closeButton = modal.querySelector('.close-button');

  // Focus on the first element inside the modal
  if (firstFocusableElement) {
    firstFocusableElement.focus();
  }

  // Trap focus within the modal
  document.addEventListener('keydown', trapFocus);

  // Close modal logic
  closeButton.addEventListener('click', () => closeModal(modalId));
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  modal.style.display = 'none'; // Hide the modal

  // Focus back to the element that triggered the modal
  const triggerElement = document.getElementById('modal-trigger');
  triggerElement.focus();

  // Remove focus trap
  document.removeEventListener('keydown', trapFocus);
}

function trapFocus(event) {
  const modal = document.querySelector('.modal');
  const focusableElements = modal.querySelectorAll('button, input, select, a');
  const firstFocusableElement = focusableElements[0];
  const lastFocusableElement = focusableElements[focusableElements.length - 1];

  if (event.key === 'Tab') {
    if (event.shiftKey) { // Shift + Tab
      if (document.activeElement === firstFocusableElement) {
        lastFocusableElement.focus();
        event.preventDefault();
      }
    } else { // Tab
      if (document.activeElement === lastFocusableElement) {
        firstFocusableElement.focus();
        event.preventDefault();
      }
    }
  }

  // Close the modal on Escape
  if (event.key === 'Escape') {
    closeModal(modal.id);
  }
}
```

In this example:
- The modal is shown and focus is moved to the first focusable element inside the modal.
- The `trapFocus` function ensures that focus remains inside the modal while it's open. If the user presses `Tab`, the focus loops through the modal’s elements.
- When the modal is closed, focus returns to the element that triggered it (e.g., a button or link).

---

### **Tools and Libraries for Focus Management**
There are libraries available that help simplify focus management in SPAs:
- **Focus Trap**: A library to trap focus inside a modal, preventing users from tabbing outside it.
  - GitHub: [focus-trap](https://github.com/focus-trap/focus-trap)
- **React Focus Lock** (if you use React): A simple React library for trapping focus within a modal or any element.
  - GitHub: [react-focus-lock](https://github.com/theKashey/react-focus-lock)

---

### **Conclusion**

Proper **focus management** in SPAs is essential to ensure a smooth, accessible, and usable experience for all users. By using methods like `focus()`, managing focus during navigation or modals, and utilizing ARIA attributes, you can ensure that your SPA is not only visually functional but also accessible for keyboard and screen reader users. Focus management is key to ensuring accessibility compliance and providing a positive experience for all users, especially those with disabilities.


# Focus Management in React Accessibility (A11Y)

**Focus Management** means controlling where keyboard focus goes before, during, and after UI interactions so keyboard-only users and screen-reader users don't get lost.

This is one of the most important WCAG accessibility topics and is frequently asked in React interviews.

***

# Why Focus Management Matters

Imagine:

```text
User Opens Modal
↓
Modal Appears
↓
Focus stays behind modal
```

The user now has no idea where they are.

Good accessibility requires:

✅ Predictable focus

✅ Visible focus indicators

✅ Focus trapped where appropriate

✅ Focus restored when UI closes

***

# 1. Auto-Focus After Component Renders

### Scenario

Focus first input when form opens.

```jsx
import { useEffect, useRef } from "react";

function LoginForm() {
  const emailRef = useRef(null);

  useEffect(() => {
    emailRef.current?.focus();
  }, []);

  return (
    <>
      <input
        ref={emailRef}
        placeholder="Email"
      />

      <input
        placeholder="Password"
      />
    </>
  );
}
```

***

# 2. Focus After Modal Opens

### Problem

```text
Open Modal
↓
Focus remains on background button
```

### Solution

Move focus inside modal.

```jsx
function Modal({ open }) {
  const closeButtonRef =
    useRef(null);

  useEffect(() => {
    if (open) {
      closeButtonRef.current?.focus();
    }
  }, [open]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
    >
      <h2>
        Delete User
      </h2>

      <button
        ref={closeButtonRef}
      >
        Close
      </button>
    </div>
  );
}
```

***

# 3. Restore Focus After Modal Closes

### Expected Behavior

```text
Open Modal
↓
Focus goes inside Modal
↓
Close Modal
↓
Focus returns to Open Button
```

### Example

```jsx
function App() {
  const [open, setOpen] =
    React.useState(false);

  const openButtonRef =
    React.useRef(null);

  return (
    <>
      <button
        ref={openButtonRef}
        onClick={() =>
          setOpen(true)
        }
      >
        Open Modal
      </button>

      {open && (
        <Modal
          onClose={() => {
            setOpen(false);

            openButtonRef.current?.focus();
          }}
        />
      )}
    </>
  );
}
```

***

# 4. Focus Trap in Modal

Users should not tab outside the modal.

### Bad

```text
TAB
↓
Button Inside Modal

TAB
↓
Background Navigation
```

### Good

```text
TAB
↓
Modal Controls Only
```

Production libraries:

```bash
focus-trap-react
react-focus-lock
```

Example:

```jsx
import FocusLock from "react-focus-lock";

<FocusLock>
  <Modal />
</FocusLock>
```

***

# 5. Focus After Pagination

When table data changes:

```text
Page 1
↓
Click Next
↓
Page 2
↓
Focus Lost
```

### Solution

```jsx
const firstRowRef =
  useRef(null);

useEffect(() => {
  firstRowRef.current?.focus();
}, [page]);
```

```jsx
<td
  ref={
    index === 0
      ? firstRowRef
      : null
  }
  tabIndex={0}
>
  {employee.name}
</td>
```

***

# 6. Focus After Form Validation Error

### Move Focus to First Error

```jsx
const emailRef = useRef();

const handleSubmit = () => {
  if (!email) {
    emailRef.current.focus();

    return;
  }
};
```

```jsx
<input
  ref={emailRef}
  aria-invalid={true}
/>
```

***

# 7. Skip Navigation Link

Useful for screen-reader and keyboard users.

```jsx
#main-content
  Skip to Content
</a>

<main id="main-content">
  ...
</main>
```

### Keyboard Flow

```text
TAB
↓
Skip To Content
↓
ENTER
↓
Main Content
```

***

# 8. Focus Management in Tabs

### Move Focus to Active Tab

```jsx
<button
  role="tab"
  aria-selected={true}
  tabIndex={0}
>
  Profile
</button>

<button
  role="tab"
  aria-selected={false}
  tabIndex={-1}
>
  Settings
</button>
```

Only current tab:

```jsx
tabIndex={0}
```

receives keyboard focus.

***

# 9. Roving Tab Index Pattern

Used in:

* Tabs
* Menus
* Tree Views
* Grids

### Example

```jsx
const activeIndex = 0;

items.map((item, index) => (
  <button
    tabIndex={
      index === activeIndex
        ? 0
        : -1
    }
  >
    {item}
  </button>
));
```

Only one item is in tab order.

***

# 10. Focus with Tree View

```jsx
<ul role="tree">
  <li
    role="treeitem"
    tabIndex={0}
  >
    Frontend
  </li>

  <li
    role="treeitem"
    tabIndex={-1}
  >
    Backend
  </li>
</ul>
```

Arrow keys move focus.

***

# 11. Live Region + Focus

After saving:

```jsx
<div role="status">
  Saved Successfully
</div>
```

Screen readers hear the update without moving focus.

***

# Common Focus Management Mistakes

## ❌ Using Divs Without Focusability

```jsx
<div onClick={handleClick}>
```

Not keyboard accessible.

### ✅

```jsx
<button
  onClick={handleClick}
>
```

***

## ❌ Losing Focus After Render

```text
Sort Table
↓
Focus Disappears
```

### ✅

Move focus back:

```jsx
sortButtonRef.current.focus();
```

***

## ❌ Hiding Focus Indicators

```css
*:focus {
  outline: none;
}
```

Avoid this.

### ✅

```css
:focus {
  outline: 3px solid blue;
}
```

***

# React Hooks Commonly Used

```jsx
useRef()
useEffect()
```

Example:

```jsx
const inputRef = useRef();

useEffect(() => {
  inputRef.current?.focus();
}, []);
```

***

# Interview Cheat Sheet

### When to Manage Focus

✅ Modal opens

✅ Modal closes

✅ Form validation fails

✅ Pagination changes

✅ Sorting changes

✅ Tab switch

✅ Tree view navigation

✅ Dynamic content loads

✅ Error message appears

***

### Senior React Interview Answer

> Focus management ensures keyboard and screen-reader users always know where they are in the UI. In React, it is typically implemented using `useRef()` and `useEffect()` to programmatically move focus after UI changes such as opening dialogs, changing pages, switching tabs, or displaying validation errors. Good focus management includes restoring focus when dialogs close, trapping focus inside modals, maintaining visible focus indicators, and ensuring focus moves predictably after dynamic updates to meet WCAG accessibility requirements.
