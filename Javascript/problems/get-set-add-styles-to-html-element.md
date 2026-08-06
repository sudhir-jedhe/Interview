JavaScript provides powerful capabilities for manipulating the styles of HTML elements. Below are the key concepts and methods that allow you to **retrieve**, **set**, and **add styles** to elements in the DOM.

### **1. Retrieving Styles of an HTML Element**

To retrieve the computed styles of an element, the `getComputedStyle()` method is used. It returns a `CSSStyleDeclaration` object, which gives you access to the computed values of the CSS properties applied to an element.

#### **Example: Get a specific CSS property (like font-size)**

```javascript
const getStyle = (el, ruleName) => getComputedStyle(el)[ruleName];

// Usage
const fontSize = getStyle(document.querySelector("p"), "font-size");
console.log(fontSize); // Example output: '16px'
```

- `getComputedStyle(el)` retrieves the computed styles of the element `el`.
- The returned `CSSStyleDeclaration` object contains all the styles, and you can access individual properties by using their names (e.g., `'font-size'`).

---

### **2. Setting the Styles of an HTML Element**

To change the inline styles of an element, you can use the `HTMLElement.style` property. This property allows you to directly modify individual CSS properties.

#### **Example: Set a specific CSS property (like font-size)**

```javascript
const setStyle = (el, rule, val) => (el.style[rule] = val);

// Usage
setStyle(document.querySelector("p"), "font-size", "20px");
// The first <p> element on the page will now have a font-size of 20px
```

- `el.style[rule]` allows you to set a CSS property on the element.
- The property name should be written in camelCase for properties that are hyphenated in CSS (e.g., `font-size` becomes `fontSize` in JavaScript).

---

### **3. Adding Multiple Styles to an Element**

Instead of setting styles one by one, you can add multiple styles to an element at once using `Object.assign()` to merge a style object into the element's inline `style` property.

#### **Example: Add multiple styles to an element**

```javascript
const addStyles = (el, styles) => Object.assign(el.style, styles);

// Usage
addStyles(document.getElementById("my-element"), {
  background: "red",
  color: "#ffff00",
  fontSize: "3rem",
});
```

- `Object.assign(el.style, styles)` merges the `styles` object into the `style` property of the element `el`.
- This method is very useful when you want to apply multiple styles at once without having to manually assign each one individually.

---

### **Full Example: Retrieving, Setting, and Adding Styles**

Here is a practical example that shows how you can retrieve, modify, and add styles to elements.

#### **HTML:**

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Style Manipulation</title>
  </head>
  <body>
    <p id="paragraph">This is a paragraph with dynamic styling.</p>
    <div id="my-element">This element will have dynamic styles added.</div>

    <script src="styleManipulation.js"></script>
  </body>
</html>
```

#### **JavaScript (styleManipulation.js):**

```javascript
// Retrieve the current font size of the paragraph element
const getStyle = (el, ruleName) => getComputedStyle(el)[ruleName];

// Set the font size of the paragraph to 20px
const setStyle = (el, rule, val) => (el.style[rule] = val);

// Add multiple styles to an element
const addStyles = (el, styles) => Object.assign(el.style, styles);

// Use the functions
const paragraph = document.getElementById("paragraph");

// Retrieve and log the current font size of the paragraph
console.log(getStyle(paragraph, "font-size")); // Output: (e.g.) '16px'

// Set the font size of the paragraph to 20px
setStyle(paragraph, "font-size", "20px");

// Add multiple styles to the div element
addStyles(document.getElementById("my-element"), {
  background: "blue",
  color: "#fff",
  fontSize: "2rem",
  padding: "10px",
  borderRadius: "5px",
});
```

### **Explanation of the Code:**

1. **`getStyle()`** retrieves the current computed style of the specified property (`'font-size'`) for the `<p>` element.
2. **`setStyle()`** sets the `font-size` property of the `<p>` element to `'20px'`.
3. **`addStyles()`** applies multiple styles (background color, text color, font size, padding, and border radius) to the `div` with the ID `my-element`.

### **Bonus: Styling with Dynamic Behavior**

You can also use JavaScript to style elements dynamically in response to user actions, like mouse events. Here's an example where we change the style of a `div` when the mouse hovers over it:

```javascript
const dynamicStyle = (el) => {
  el.addEventListener("mouseenter", () => {
    el.style.backgroundColor = "orange";
    el.style.color = "black";
  });

  el.addEventListener("mouseleave", () => {
    el.style.backgroundColor = "";
    el.style.color = "";
  });
};

const dynamicDiv = document.getElementById("my-element");
dynamicStyle(dynamicDiv);
```

- **`mouseenter`** and **`mouseleave`** are used to detect when the mouse enters or leaves the `div`, dynamically changing its styles.

### **Conclusion**

JavaScript offers an easy way to manipulate styles dynamically through the `style` property, `getComputedStyle()`, and techniques like `Object.assign()` to apply multiple styles at once. These techniques are crucial for making interactive, responsive, and dynamic web applications.
