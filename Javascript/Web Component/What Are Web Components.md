## **What Are Web Components?**

Web Components are a set of web platform APIs that allow you to create reusable, encapsulated custom elements (components) that can be used across web applications or websites. They enable developers to build modular, maintainable, and reusable pieces of UI with their own custom behavior, style, and structure, while avoiding the interference of global styles or scripts.

Web Components are based on four main technologies:

**Custom Elements:** Defines custom HTML elements with custom behavior.
**Shadow DOM:** Provides encapsulation for the component's structure and style, preventing external CSS from affecting the component and vice versa.
**HTML Templates:** Provides a way to define HTML markup that is not rendered immediately, but can be used later to create elements dynamically.
**ES Modules:** Used to organize code into modular files (optional but commonly used with Web Components).

### **Key Features of Web Components:**

**Encapsulation**: Web components are self-contained and can be used independently, without affecting the rest of the page.
**Reusability**: Once created, they can be reused in different projects or parts of a project.
**Interoperability**: They work with any JavaScript framework or library, and also with vanilla JavaScript.
**Declarative Syntax**: Components are used with regular HTML tags, which makes them simple to use and integrate.

### **How to Create Web Components**

Web Components consist of Custom Elements, Shadow DOM, and HTML Templates. Let’s go step by step in creating one.

**1. Define a Custom Element**
To create a custom element, you use the customElements.define() method, where you provide a name for your element (which must contain a hyphen, e.g., <my-component>) and a class that defines its behavior.

**2. Use Shadow DOM for Encapsulation**
The Shadow DOM allows you to create a hidden DOM tree inside your custom element. This isolated tree can have its own styles, scripts, and content, which won't be affected by the global styles or scripts of the main page.

**3. HTML Templates**
The `<template>` tag allows you to define HTML that is not rendered until you specifically use it.

**Example of Creating a Web Component**
Here’s a step-by-step guide to creating a simple Web Component that displays a user profile with encapsulated styling and behavior.

**Step 1: Create a Basic Web Component**
Create an HTML template for the content and styles.
Use Shadow DOM to encapsulate styles and HTML.
Define a custom element using JavaScript.

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Web Component Example</title>
  </head>
  <body>
    <!-- Use the custom element -->
    <user-profile
      name="John Doe"
      bio="Web developer and tech enthusiast"
    ></user-profile>

    <script>
      // Define the user profile component
      class UserProfile extends HTMLElement {
        constructor() {
          super();

          // Attach shadow DOM to the custom element
          const shadow = this.attachShadow({ mode: "open" });

          // Create a template for the profile
          const template = document.createElement("template");
          template.innerHTML = `
        <style>
          div {
            background-color: #f4f4f4;
            border: 1px solid #ddd;
            padding: 16px;
            border-radius: 8px;
            font-family: Arial, sans-serif;
          }
          h2 {
            color: #333;
          }
          p {
            font-size: 14px;
            color: #555;
          }
        </style>
        <div>
          <h2></h2>
          <p></p>
        </div>
      `;

          // Append the template content to the shadow DOM
          shadow.appendChild(template.content.cloneNode(true));
        }

        // Lifecycle method: Called when the element is added to the DOM
        connectedCallback() {
          // Set the name and bio text from attributes
          this.shadowRoot.querySelector("h2").textContent =
            this.getAttribute("name");
          this.shadowRoot.querySelector("p").textContent =
            this.getAttribute("bio");
        }
      }

      // Register the custom element with a name
      customElements.define("user-profile", UserProfile);
    </script>
  </body>
</html>
```

Breakdown of the Code:
`UserProfile Class:` This class defines the behavior of the custom element. It extends the built-in HTMLElement class.

`constructor():` Inside the constructor, we attach a shadow DOM (this.attachShadow({ mode: 'open' })). Then we define an HTML template containing styles and the structure for the component. This template is then appended to the shadow DOM.

`connectedCallback():` This lifecycle method is called when the element is added to the DOM. Here, we grab the values of the name and bio attributes from the element and set them inside the component.

`customElements.define('user-profile', UserProfile):` Registers the custom element with the name user-profile. After this, you can use <user-profile> in your HTML just like any regular HTML element.

**Step 2: Using the Web Component**
You can now use your custom element in any HTML file by simply referencing it:

```html
<user-profile name="Jane Doe" bio="Designer and artist"></user-profile>
```

The component will render with the specified name and bio inside a styled box, and it will be isolated from the global styles of the page.

**Benefits of Using Web Components:**
`Encapsulation`: With Shadow DOM, styles and behavior are encapsulated within the component, preventing them from being affected by external CSS.
`Reusability`: Once you create a component, you can reuse it in other projects or within the same application.
`Modularity`: Web Components help you organize your application into modular pieces, each handling its own functionality.
`Interoperability`: Web Components can be used with any front-end framework (React, Vue, Angular, etc.) or with vanilla JavaScript. They are browser-native and framework-agnostic.
`More Complex Use Case`: Adding Interactivity
You can also add interactive behavior to Web Components. Here's an example of how to create a simple counter inside a custom button:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Interactive Web Component</title>
  </head>
  <body>
    <counter-button></counter-button>

    <script>
      class CounterButton extends HTMLElement {
        constructor() {
          super();
          const shadow = this.attachShadow({ mode: "open" });

          // Creating the template
          const template = document.createElement("template");
          template.innerHTML = `
        <style>
          button {
            font-size: 16px;
            padding: 10px;
            cursor: pointer;
            background-color: #007BFF;
            color: white;
            border: none;
            border-radius: 5px;
          }
        </style>
        <button>Clicked 0 times</button>
      `;

          shadow.appendChild(template.content.cloneNode(true));

          // Initialize counter value
          this.counter = 0;

          // Bind click event to update counter
          this.shadowRoot
            .querySelector("button")
            .addEventListener("click", () => {
              this.counter++;
              this.shadowRoot.querySelector("button").textContent =
                `Clicked ${this.counter} times`;
            });
        }
      }

      customElements.define("counter-button", CounterButton);
    </script>
  </body>
</html>
```

This example creates a counter-button component. Every time the button is clicked, it increments a counter and updates the text inside the button.

**Conclusion**
Web Components provide a powerful, standard way to build reusable, encapsulated components for the web. They allow developers to create custom elements that can be used in any context, regardless of the framework being used. They are especially useful for creating large, maintainable web applications with modular, reusable UI components.

**Web Components** are a suite of native browser APIs that allow developers to create custom, reusable, and encapsulated HTML tags. Unlike framework-specific components (like React, Vue, or Angular), Web Components are **framework-agnostic** and run directly in the browser using standard JavaScript, HTML, and CSS without third-party dependencies.

---

## The 3 Core Pillars of Web Components

Web Components are built on three fundamental standards:

### 1. Custom Elements

A set of JavaScript APIs that allow you to define new HTML tags (e.g., `<user-card>`) or extend existing ones.

- **Requirement:** Tag names **must contain a hyphen** (e.g., `<my-button>`, not `<button>`) to prevent collisions with future standard HTML tags.
- **Class Syntax:** Custom elements extend `HTMLElement`.

### 2. Shadow DOM

Provides DOM and CSS encapsulation. Styles defined inside a Shadow DOM do not "bleed out" to the rest of the page, and external global CSS rules cannot easily "bleed in" to break component styling.

- **Shadow Host:** The regular DOM node the shadow tree attaches to.
- **Shadow Root:** The root node of the shadow tree (`element.attachShadow({ mode: 'open' })`).

### 3. HTML Templates (`<template>`) and Slots (`<slot>`)

- **`<template>`:** Markup that is parsed by the browser but not rendered until cloned and appended via JavaScript.
- **`<slot>`:** Placeholders inside the Shadow DOM that allow consumer markup (from the "Light DOM") to be injected into specific positions within the component.

---

## Working Code Example

Here is a complete, standalone example of a custom `<user-badge>` component:

```javascript
// Define the Web Component Class
class UserBadge extends HTMLElement {
  constructor() {
    super();

    // 1. Attach a Shadow DOM root
    this.attachShadow({ mode: "open" });

    // 2. Define internal styles and template markup
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 8px 12px;
          border-radius: 20px;
          background-color: #f1f5f9;
          font-family: sans-serif;
        }
        .status {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background-color: #22c55e;
        }
        .name {
          font-weight: bold;
          color: #0f172a;
        }
      </style>

      <span class="status"></span>
      <span class="name">
        <slot>Anonymous User</slot> <!-- Fallback slot content -->
      </span>
    `;
  }
}

// 3. Register the custom element with the browser
customElements.define("user-badge", UserBadge);
```

### Usage in HTML:

```html
<!-- Default slot fallback used -->
<user-badge></user-badge>

<!-- Custom content projected into the slot -->
<user-badge>Alex Mercer</user-badge>
```

---

## Component Lifecycle Callbacks

Custom element classes inherit special lifecycle methods from `HTMLElement`:

| Callback                                                 | Triggered When...                                                                                      |
| -------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| **`constructor()`**                                      | The element is instantiated (`document.createElement` or parsed in HTML).                              |
| **`connectedCallback()`**                                | The element is connected/inserted into the document's DOM. Perfect for initial setup or fetching data. |
| **`disconnectedCallback()`**                             | The element is removed from the DOM. Useful for cleanup (event listeners, timers).                     |
| **`attributeChangedCallback(name, oldValue, newValue)`** | An observed attribute is added, removed, or modified.                                                  |
| **`adoptedCallback()`**                                  | The element is moved to a new document (e.g., inside an `<iframe>`).                                   |

### Observing Attributes Example:

```javascript
class StatusPill extends HTMLElement {
  // Specify which attributes to observe
  static get observedAttributes() {
    return ["type"];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === "type") {
      this.style.backgroundColor = newValue === "error" ? "#ef4444" : "#22c55e";
    }
  }
}
customElements.define("status-pill", StatusPill);
```

---

## When to Use Web Components vs. Framework Components

### Best Use Cases:

1. **Design Systems & UI Component Libraries:** Building unified components (buttons, modals, tooltips) that need to run across multiple teams using different frameworks (e.g., React, Angular, Rails, plain PHP).
2. **Micro-Frontends:** Integrating distinct sub-applications owned by different teams without CSS leakage or global scope collisions.
3. **Long-Term Longevity:** Code built with standard Web Components will continue running in browsers a decade from now without requiring dependency upgrades or framework migration build steps.

### Trade-Offs / Limitations:

- **Complex State Management:** Managing complex state flows across deep component hierarchies is more manual compared to React/Vue/Svelte.
- **Server-Side Rendering (SSR):** Historically challenging due to Shadow DOM needing client-side JS. However, modern browsers now support **Declarative Shadow DOM** (`<template shadowrootmode="open">`) to solve SSR hydration.
