In JavaScript, ARIA (Accessible Rich Internet Applications) attributes play a crucial role in enhancing the accessibility of web applications. These attributes help make dynamic content and complex user interface elements accessible to people with disabilities, particularly those who rely on assistive technologies like screen readers.

## **What are ARIA Attributes?**

ARIA attributes are a set of special attributes added to HTML elements that provide additional information about the behavior, structure, or state of user interface elements. These attributes are designed to improve accessibility and allow screen readers and other assistive technologies to interpret and communicate the purpose or functionality of elements that might not be natively accessible (e.g., dynamic content, custom widgets, complex controls).

### **Key ARIA Attributes and Their Importance**

**1. aria-label**
Purpose: Provides an accessible name for an element, used when the element does not have visible text content.
Example: Useful for custom buttons or icons that are visually represented but don’t have text.

```html
<button aria-label="Close">X</button>
```

Importance: Allows screen readers to announce the purpose of the button to users, making it accessible for those who cannot see the icon.
**2. aria-labelledby**
Purpose: Associates an element with another element that provides a label for it. It points to the ID of another element that describes the current one.
Example:

```html
<h1 id="header">Main Header</h1>
<div aria-labelledby="header">This content relates to the main header.</div>
```

Importance: Helps screen readers identify and communicate the context or label of an element, ensuring users understand its role.
**3. aria-describedby**
Purpose: Links an element to another that provides a description, usually for more detailed or supplementary information.
Example:

```html
<button aria-describedby="info">Submit</button>
<span id="info">Press this button to submit the form.</span>
```

Importance: Gives screen readers extra context, improving the user experience for those who require more information about a UI element.
**4. aria-hidden**
Purpose: Indicates whether an element is hidden from accessibility tools (e.g., screen readers). A value of true makes the element invisible to assistive technology.
Example:

```html
<div aria-hidden="true">This content is hidden from screen readers.</div>
```

Importance: It allows developers to hide content from screen readers without visually hiding it from sighted users, which is helpful when there is content that is visually present but irrelevant or redundant to screen reader users.
**5. aria-live**
Purpose: Provides information to assistive technologies about dynamic content changes. It informs screen readers when content updates dynamically (e.g., in chat applications, live sports scores).
Example:

```html
<div aria-live="polite">New comment posted.</div>
```

Importance: Ensures users with screen readers are notified of changes in real-time without requiring them to manually refresh the page or focus on a specific area.

**6. aria-role**
Purpose: Specifies the role or type of an element (e.g., button, dialog, navigation) to convey the element's purpose to assistive technologies.
Example:

```html
<div role="button" aria-label="Close" onclick="closeWindow()">X</div>
```

Importance: Enhances accessibility by informing assistive technologies about the role of an element, especially when it is a custom component and not a standard HTML element.
**7. aria-expanded**
Purpose: Indicates the current state of an expandable element, such as a menu or accordion.
Example:

```html
<button aria-expanded="false" onclick="toggleMenu()">Menu</button>
```

Importance: Provides feedback on whether the content inside the menu is expanded or collapsed, improving interaction for users with disabilities.
**7. aria-checked**
Purpose: Specifies the current state of a checkbox or switch (checked, unchecked, indeterminate).
Example:

```html
<div role="checkbox" aria-checked="true" onclick="toggleCheck()">
  Agree to terms
</div>
```

Importance: Tells screen readers the state of the checkbox or switch, ensuring users know whether it is selected or not.
**8. aria-selected**
Purpose: Indicates the selection state of an item, commonly used in lists, tabs, or other selectable items.
Example:

```html
<div role="tab" aria-selected="true">Tab 1</div>
<div role="tab" aria-selected="false">Tab 2</div>
```

Importance: Helps screen readers understand which item is currently selected, improving navigation for users relying on keyboard or other assistive technologies.
**9. aria-invalid**
Purpose: Marks form elements as having invalid input. It can be used in conjunction with form validation to notify users when an input is incorrect.
Example:

```html
<input type="text" aria-invalid="true" value="Incorrect Value" />
```

Importance: Informs screen reader users that a field is invalid, helping them understand errors and how to correct them.

### **Importance of ARIA in JavaScript Usage:**

**Improved Accessibility:** ARIA ensures that web applications and dynamic content are accessible to users with disabilities, especially those using assistive technologies like screen readers or braille devices.

**Enhancing Dynamic Interactions:** Many modern web applications use JavaScript to create dynamic content. ARIA attributes help screen readers understand the purpose of these dynamic elements (e.g., when content changes or when user interaction is required).

**Custom Components:** JavaScript often creates custom UI components (e.g., buttons, sliders, dialogs) that are not natively accessible. By adding ARIA attributes, these custom elements can behave like standard HTML elements, making them accessible to assistive technologies.

**Compliance with Accessibility Standards:** Many accessibility guidelines (such as WCAG – Web Content Accessibility Guidelines) require the use of ARIA attributes to ensure that web content is accessible to all users, including those with visual, auditory, and motor disabilities.

**Conclusion:**
ARIA attributes are essential for creating accessible web applications, particularly those with dynamic or interactive content. By incorporating ARIA into HTML and JavaScript, developers can ensure that all users, regardless of their abilities, have an equal opportunity to access and interact with content. These attributes allow developers to provide more context, communicate changes, and describe user interface elements in ways that assistive technologies can interpret.

### 1. **What is ARIA?**

ARIA (Accessible Rich Internet Applications) is a set of attributes that provide additional accessibility information to assistive technologies like screen readers. It helps make dynamic web content, such as interactive elements or elements that change after page load, more accessible for people with disabilities. ARIA attributes can be used in conjunction with HTML to provide accessibility features when native HTML elements cannot provide the needed functionality.

#### Key ARIA Attributes:

- `role`: Defines the role of an element (e.g., `button`, `dialog`, `navigation`).
- `aria-label`: Provides an accessible name for an element that doesn't have visible text (e.g., icons).
- `aria-hidden`: Hides content from screen readers, typically used for decorative elements.
- `aria-live`: Indicates that an element’s content will change dynamically and the screen reader should notify the user when the content updates.

### 2. **Why is ARIA Important?**

ARIA is important because it:

- **Improves accessibility**: It allows web developers to add extra information to assistive technologies, enabling users with disabilities to interact with web applications effectively.
- **Enables dynamic content accessibility**: It provides ways to make dynamic content, such as single-page applications (SPAs), accessible to users with disabilities.
- **Assists with complex widgets**: It helps provide accessibility for more complex UI components like sliders, modals, and carousels that do not have native HTML elements for accessibility.

### 3. **How to Ensure Forms are Accessible**

When creating forms, it's essential to make sure they are accessible to all users, including those using screen readers or keyboard navigation. Here's how you can ensure forms are accessible:

- **Use `<label>` elements correctly**: Every input field should have a corresponding `<label>` element to describe its purpose. Use the `for` attribute in the label to associate it with the input element.

  ```html
  <label for="email">Email:</label>
  <input type="email" id="email" name="email" />
  ```

- **Provide clear instructions and error messages**: Use `aria-describedby` to associate help text or error messages with form fields.

  ```html
  <input type="text" id="username" aria-describedby="username-help" />
  <small id="username-help"
    >Your username must be between 5-10 characters.</small
  >
  ```

- **Use `<fieldset>` and `<legend>` for grouped inputs**: For forms with multiple related inputs (e.g., radio buttons), use `<fieldset>` and `<legend>` to group and label them.

  ```html
  <fieldset>
    <legend>Choose your gender</legend>
    <input type="radio" name="gender" value="male" /> Male
    <input type="radio" name="gender" value="female" /> Female
  </fieldset>
  ```

- **Ensure proper tab navigation**: Ensure that users can navigate through form fields using the `Tab` key, and the order is logical.

### 4. **Common Accessibility Issues**

Some common accessibility issues include:

- **Missing or incorrect alternative text for images**: Every image should have descriptive alt text.
- **Low color contrast**: Ensure that there is enough contrast between text and background to make content readable for users with visual impairments.
- **Lack of keyboard navigation**: Ensure all interactive elements can be accessed and controlled using a keyboard.
- **Non-semantic HTML**: Using generic elements like `<div>` and `<span>` without proper roles or semantic elements like `<header>`, `<footer>`, `<article>`, etc.
- **Dynamic content not announced**: For dynamic updates (e.g., AJAX content), ensure ARIA live regions are used to notify users of changes.

### 5. **How to Make Images Accessible**

To make images accessible:

- **Use `alt` attributes**: Provide descriptive alt text that explains the image’s content or function. If the image is purely decorative, use an empty `alt=""` to tell screen readers to ignore it.

  ```html
  <img src="logo.png" alt="Company Logo" />
  ```

- **For complex images (e.g., charts, graphs)**: Use detailed descriptions or link to a page with more information. You can use `aria-describedby` to link to longer descriptions.

  ```html
  <img
    src="graph.png"
    alt="Sales growth over the past year"
    aria-describedby="graph-description"
  />
  <p id="graph-description">
    This chart shows a 20% increase in sales from Q1 to Q4...
  </p>
  ```

- **Avoid relying on images alone**: Don’t use images as the sole way to convey important information; provide alternative text or text descriptions.

### 6. **What Are Screen Readers and How Do They Work?**

A **screen reader** is a software application that reads aloud the content of a webpage or app for users who are blind or visually impaired. It interprets the text, images (with alt text), and elements on a webpage and converts them into speech or Braille output.

**How they work:**

- Screen readers rely on the structure of the HTML document (e.g., headings, landmarks, buttons) and ARIA attributes to interpret the page.
- Users navigate through the content using keyboard shortcuts (e.g., `Tab` to move between links, `Arrow keys` to move through text).
- Screen readers also announce form fields, links, images (with alt text), and any changes in content or errors.

### 7. **Difference Between `role="button"` and `<button>` Element**

- **`<button>` Element**:
  - Native HTML element specifically designed to create clickable buttons.
  - Automatically has accessibility features like focus management, keyboard navigation, and screen reader support.

  ```html
  <button>Submit</button>
  ```

- **`role="button"`**:
  - ARIA role used to define an element as a button when it is not a native button element (e.g., a `<div>` or `<span>`).
  - You need to manually handle functionality (e.g., keyboard navigation, click events) when using `role="button"`.
  ```html
  <div role="button" tabindex="0" onclick="alert('Clicked!')">Click Me</div>
  ```

**Key Differences**:

- `<button>` is more semantic and has built-in accessibility features, while `role="button"` is typically used on non-interactive elements (like `<div>` or `<span>`).
- `role="button"` may require additional ARIA attributes and JavaScript to ensure full accessibility.

### 8. **How to Test Web Page Accessibility**

Testing web accessibility involves checking if your website can be used by people with disabilities. Here are some ways to test accessibility:

- **Manual Testing**:
  - Use keyboard navigation: Test if you can navigate through your website without a mouse (use `Tab`, `Shift + Tab`, `Enter`, `Space`, etc.).
  - Screen reader testing: Use screen readers (e.g., NVDA, JAWS, or VoiceOver) to check if the content is properly announced.
  - Check contrast: Ensure there is sufficient contrast between text and background using tools like the **WebAIM Color Contrast Checker**.

- **Automated Tools**:
  - **WAVE** (Web Accessibility Evaluation Tool): An extension that checks for accessibility issues directly in the browser.
  - **axe**: A widely used accessibility testing tool that integrates with Chrome DevTools for live testing.
  - **Lighthouse**: An automated tool by Google to audit accessibility, performance, and SEO, built into Chrome DevTools.
  - **Accessibility Insights**: A tool for identifying accessibility issues with automated and guided testing.

- **User Testing**: Test your website with real users who have disabilities. This can provide feedback on any issues that automated tools might miss.

### Conclusion

Accessibility is a critical aspect of web development, and ARIA plays an essential role in improving accessibility for dynamic content. Ensuring that forms, images, and interactive elements are accessible can significantly improve the user experience for people with disabilities. By using ARIA attributes, providing alternative text for images, ensuring proper HTML semantics, and testing with screen readers and automated tools, you can make your web pages more inclusive and usable for all users.

ARIA (Accessible Rich Internet Applications) provides a variety of attributes to enhance web accessibility, especially for dynamic content. Below is a more detailed list of commonly used ARIA attributes and their uses:

### 1. **`role`**

- **Purpose**: Defines the role of an element (e.g., button, navigation, dialog, etc.).
- **Usage**: Use `role` to inform assistive technologies about the type of element, especially when you're using non-semantic HTML elements like `<div>` or `<span>`.

```html
<div role="button" onclick="submitForm()">Submit</div>
```

### 2. **`aria-label`**

- **Purpose**: Provides a short, descriptive label for an element.
- **Usage**: Use `aria-label` when an element doesn't have a visible text label, such as an icon button.

```html
<button aria-label="Close" onclick="closeModal()">X</button>
```

### 3. **`aria-labelledby`**

- **Purpose**: Specifies the ID of an element that labels the current element.
- **Usage**: Use `aria-labelledby` when you want an element to be described by another element's text content (e.g., a heading for a form or dialog).

```html
<h2 id="form-title">Contact Us</h2>
<form aria-labelledby="form-title">
  <!-- form fields -->
</form>
```

### 4. **`aria-describedby`**

- **Purpose**: Identifies the IDs of elements that describe the current element, typically used for providing additional information, instructions, or error messages.
- **Usage**: Useful for forms or complex UI components where additional explanations are needed.

```html
<input type="text" id="email" aria-describedby="email-help" />
<span id="email-help">Please enter a valid email address</span>
```

### 5. **`aria-hidden`**

- **Purpose**: Hides an element from the accessibility tree, meaning screen readers will ignore it.
- **Usage**: Useful for decorative content that doesn't add value to the page.

```html
<div aria-hidden="true">This is decorative text</div>
```

### 6. **`aria-live`**

- **Purpose**: Tells assistive technologies how to handle live regions (content that can change dynamically).
- **Usage**: Use for notifications, alerts, or other content that updates after the page has loaded.

```html
<div aria-live="polite">New message received</div>
```

### 7. **`aria-expanded`**

- **Purpose**: Indicates whether a collapsible element (such as a dropdown or accordion) is expanded or collapsed.
- **Usage**: Use for accordion-style components, dropdowns, or other expandable/collapsible elements.

```html
<button aria-expanded="false" onclick="toggleMenu()">Menu</button>
```

### 8. **`aria-controls`**

- **Purpose**: Identifies the elements that are controlled by the current element (e.g., a button controlling a collapsible section).
- **Usage**: Use when you want to associate a control (like a button) with the element it manipulates.

```html
<button aria-controls="menu" aria-expanded="false">Menu</button>
<div id="menu">Menu content</div>
```

### 9. **`aria-checked`**

- **Purpose**: Indicates the current state of a checkbox or toggle button (whether it’s checked or unchecked).
- **Usage**: Use for custom checkboxes or toggle buttons.

```html
<div role="checkbox" aria-checked="false" onclick="toggleCheckbox()">
  Accept Terms
</div>
```

### 10. **`aria-selected`**

- **Purpose**: Indicates the current selection in a group of items (e.g., in a list, tab, or menu).
- **Usage**: Use when you have multiple selectable items and you want to indicate the selected state.

```html
<div role="listitem" aria-selected="true">Item 1</div>
<div role="listitem" aria-selected="false">Item 2</div>
```

### 11. **`aria-required`**

- **Purpose**: Specifies that user input is required on the element before submitting the form.
- **Usage**: Use for input fields that are required.

```html
<input type="text" aria-required="true" />
```

### 12. **`aria-invalid`**

- **Purpose**: Indicates whether the value of an input is valid or invalid.
- **Usage**: Use when validating form inputs.

```html
<input type="text" aria-invalid="true" />
```

### 13. **`aria-live`**

- **Purpose**: Indicates how screen readers should notify users when dynamic content changes.
- **Usage**: Set `aria-live` to `assertive` or `polite` to control how updates are announced.

```html
<div aria-live="assertive">Important alert: Action required</div>
```

### 14. **`aria-role`**

- **Purpose**: Defines the type of an element, allowing it to be understood by assistive technologies. For example, `role="alert"` informs screen readers that an alert box has been triggered.
- **Usage**: Applied to an element to convey the type of content it represents.

```html
<div role="alert">This is an important alert</div>
```

### 15. **`aria-haspopup`**

- **Purpose**: Indicates that the element has a popup (e.g., a dropdown, modal, or dialog) that can be triggered.
- **Usage**: Use when an element opens a secondary window or menu (e.g., a dropdown).

```html
<button aria-haspopup="true" onclick="toggleDropdown()">Dropdown</button>
```

### 16. **`aria-dropeffect`**

- **Purpose**: Specifies the type of effect when a drag operation is performed, like "move" or "copy."
- **Usage**: Used in drag-and-drop interfaces to specify what happens when a drag action completes.

```html
<div role="application" aria-dropeffect="move">
  <!-- Droppable content -->
</div>
```

### 17. **`aria-sort`**

- **Purpose**: Indicates the current sorting order of a table column.
- **Usage**: Helps users with assistive technologies know how the table is sorted.

```html
<th aria-sort="ascending">Name</th>
```

### 18. **`aria-posinset`**

- **Purpose**: Specifies the position of an item within a set (e.g., in a list or carousel).
- **Usage**: Useful for navigating through a group of elements to indicate the order.

```html
<div role="listitem" aria-posinset="1" aria-setsize="3">Item 1</div>
```

### 19. **`aria-setsize`**

- **Purpose**: Specifies the total number of items in a set, like in a list or carousel.
- **Usage**: Used with `aria-posinset` to create a complete context for the user.

```html
<div role="listitem" aria-posinset="1" aria-setsize="5">Item 1</div>
```

### 20. **`aria-live`**

- **Purpose**: Tells screen readers how to handle updates to dynamic content.
- **Usage**: Useful for live regions that update dynamically, such as chat messages.

```html
<div aria-live="polite">Live region updates</div>
```

### 21. **`aria-orientation`**

- **Purpose**: Specifies the orientation of a user interface component, such as a list, slider, or toolbar.
- **Usage**: Helps screen readers understand the layout and interaction model.

```html
<div role="list" aria-orientation="vertical">
  <div role="listitem">Item 1</div>
  <div role="listitem">Item 2</div>
</div>
```

### Conclusion

ARIA attributes are essential for improving web accessibility, especially for dynamic and complex content. They help provide context to assistive technologies, ensuring that users with disabilities can interact with and understand web pages effectively. By using the right ARIA attributes for elements, you can create a more inclusive web experience for all users.

To make common UI elements like dropdowns, popups, modals, accordions, and inputs accessible using ARIA, you can implement the following practices with proper ARIA attributes. This will ensure that users with disabilities can interact with these elements using assistive technologies like screen readers.

### 1. **Accessible Dropdown**

A dropdown is a menu that expands or collapses when clicked. Here’s how to make it accessible:

```html
<button aria-haspopup="true" aria-expanded="false" onclick="toggleDropdown()">
  Menu
</button>
<div id="dropdown" role="menu" aria-labelledby="menu-button" hidden>
  <a href="#" role="menuitem">Item 1</a>
  <a href="#" role="menuitem">Item 2</a>
  <a href="#" role="menuitem">Item 3</a>
</div>

<script>
  function toggleDropdown() {
    const dropdown = document.getElementById("dropdown");
    const button = document.querySelector("[aria-haspopup]");
    const isExpanded = dropdown.hidden;

    dropdown.hidden = !isExpanded;
    button.setAttribute("aria-expanded", !isExpanded);
  }
</script>
```

- **`aria-haspopup="true"`** indicates that the button triggers a menu.
- **`aria-expanded="false"`** denotes that the menu is initially collapsed.
- **`role="menu"`** is used to define the menu container.
- **`role="menuitem"`** defines each item in the menu.

### 2. **Accessible Popup**

A popup (like a tooltip or alert) should be accessible so users can focus on it and navigate it easily.

```html
<button aria-haspopup="dialog" onclick="openPopup()">Open Popup</button>

<div id="popup" role="dialog" aria-labelledby="popup-title" aria-hidden="true">
  <h2 id="popup-title">Popup Title</h2>
  <p>This is a popup with accessible ARIA attributes.</p>
  <button onclick="closePopup()">Close</button>
</div>

<script>
  function openPopup() {
    const popup = document.getElementById("popup");
    popup.setAttribute("aria-hidden", "false");
    popup.setAttribute("tabindex", "-1");
    popup.focus();
  }

  function closePopup() {
    const popup = document.getElementById("popup");
    popup.setAttribute("aria-hidden", "true");
  }
</script>
```

- **`aria-haspopup="dialog"`** indicates that the button opens a dialog (popup).
- **`role="dialog"`** identifies the popup as a dialog.
- **`aria-labelledby="popup-title"`** links the popup to its title.
- **`aria-hidden="true/false"`** toggles the visibility of the popup.
- **`tabindex="-1"`** makes the popup focusable when it is opened.

### 3. **Accessible Modal**

A modal is a type of popup that often requires user interaction before they can return to the main content. It's important to focus the modal when opened.

```html
<button aria-controls="modal" aria-expanded="false" onclick="openModal()">
  Open Modal
</button>

<div
  id="modal"
  role="dialog"
  aria-labelledby="modal-title"
  aria-hidden="true"
  aria-modal="true"
>
  <h2 id="modal-title">Modal Title</h2>
  <p>This is a modal. Press Escape to close.</p>
  <button onclick="closeModal()">Close</button>
</div>

<script>
  function openModal() {
    const modal = document.getElementById("modal");
    modal.setAttribute("aria-hidden", "false");
    modal.setAttribute("aria-expanded", "true");
    modal.focus();
  }

  function closeModal() {
    const modal = document.getElementById("modal");
    modal.setAttribute("aria-hidden", "true");
  }

  // Close modal on Escape key
  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
      closeModal();
    }
  });
</script>
```

- **`aria-modal="true"`** indicates that the modal will trap focus and should be the main content.
- **`aria-labelledby="modal-title"`** links the modal to its title.
- **`aria-hidden="true/false"`** toggles visibility.
- **`aria-expanded="true/false"`** indicates whether the modal is expanded.

### 4. **Accessible Accordion**

An accordion consists of expandable/collapsible sections. It’s important to manage focus and state using ARIA.

```html
<button
  aria-expanded="false"
  aria-controls="section1"
  onclick="toggleAccordion()"
>
  Section 1
</button>
<div id="section1" role="region" aria-labelledby="section1" hidden>
  <p>This is the content of Section 1.</p>
</div>

<script>
  function toggleAccordion() {
    const section = document.getElementById("section1");
    const button = document.querySelector("[aria-expanded]");
    const isExpanded = section.hidden;

    section.hidden = !isExpanded;
    button.setAttribute("aria-expanded", !isExpanded);
  }
</script>
```

- **`aria-expanded="false"`** shows that the accordion section is initially collapsed.
- **`aria-controls="section1"`** indicates that the button controls the content.
- **`role="region"`** defines the section as a region for screen readers.

### 5. **Accessible Input Field**

Input fields should be labeled and indicate required status and validation errors.

```html
<label for="email">Email</label>
<input
  type="email"
  id="email"
  aria-required="true"
  aria-describedby="email-help"
/>

<span id="email-help">Please enter a valid email address.</span>

<script>
  document.getElementById("email").addEventListener("invalid", function () {
    this.setAttribute("aria-invalid", "true");
  });
</script>
```

- **`aria-required="true"`** indicates that the input is required.
- **`aria-describedby="email-help"`** associates additional help text with the input.
- **`aria-invalid="true"`** indicates that the input has an error, such as an invalid email.

### 6. **Accessible Tabs**

Tabs are a set of sections that can be navigated using keyboard shortcuts. Use ARIA roles to ensure they are accessible.

```html
<div role="tablist">
  <button role="tab" aria-selected="true" aria-controls="tab1">Tab 1</button>
  <button role="tab" aria-selected="false" aria-controls="tab2">Tab 2</button>
</div>

<div id="tab1" role="tabpanel" aria-labelledby="tab1">
  <p>This is the content of Tab 1.</p>
</div>
<div id="tab2" role="tabpanel" aria-labelledby="tab2" hidden>
  <p>This is the content of Tab 2.</p>
</div>

<script>
  const tabs = document.querySelectorAll('[role="tab"]');
  tabs.forEach((tab) => {
    tab.addEventListener("click", function () {
      const selectedTab = document.querySelector('[aria-selected="true"]');
      const selectedPanel = document.querySelector(
        '[aria-labelledby="' + selectedTab.id + '"]',
      );

      selectedTab.setAttribute("aria-selected", "false");
      selectedPanel.setAttribute("hidden", true);

      this.setAttribute("aria-selected", "true");
      const panelId = this.getAttribute("aria-controls");
      document.getElementById(panelId).removeAttribute("hidden");
    });
  });
</script>
```

- **`role="tablist"`** identifies the container of tabs.
- **`role="tab"`** defines each tab.
- **`role="tabpanel"`** defines the content associated with each tab.
- **`aria-selected="true/false"`** indicates the selected tab.
- **`aria-controls`** links the tab to the corresponding panel.

### 7. **Accessible Slider**

A slider allows users to select a value from a range. Use ARIA to make sure screen readers can navigate the slider.

```html
<label for="volume">Volume</label>
<input
  type="range"
  id="volume"
  min="0"
  max="100"
  value="50"
  aria-valuemin="0"
  aria-valuemax="100"
  aria-valuenow="50"
  aria-labelledby="volume"
/>
```

- **`aria-valuemin`**: Minimum value of the slider.
- **`aria-valuemax`**: Maximum value of the slider.
- **`aria-valuenow`**: Current value of the slider.
- **`aria-labelledby="volume"`** links the label to the slider.

---

### Conclusion

By using appropriate ARIA attributes like `aria-expanded`, `aria-hidden`, `aria-labelledby`, and others, you can enhance the accessibility of dynamic UI elements like dropdowns, modals, accordions, inputs, and sliders. Ensuring that your web applications are accessible to all users is a critical step in making the web more inclusive.
