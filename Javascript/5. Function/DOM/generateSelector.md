Here's the complete implementation for the `generateSelector` function with the necessary details and a demonstration of its usage.

### Code Explanation:
- **Purpose**: To generate a CSS selector path from a DOM `target` element to a given `root` element.
- **Key Features**:
  1. **Traversing the DOM**: The function uses a `while` loop to move up the DOM tree from the `target` to the `root`.
  2. **Selector Generation**: The function generates unique selectors using:
     - **Tag names**.
     - **ID**: If an element has an ID, it directly appends `#id` to the selector.
     - **Classes**: If an element has classes, they are appended in `.class1.class2` format.
     - **Nth-child**: If there are sibling elements of the same tag, `:nth-child()` ensures uniqueness.
  3. **Error Handling**: Ensures valid `HTMLElement` inputs.

### Full Code
```javascript
function generateSelector(root, target) {
  if (!(target instanceof HTMLElement) || !(root instanceof HTMLElement)) {
    throw new Error("Invalid input: Both root and target must be HTMLElements.");
  }

  let element = target;
  const pathArray = [];

  while (element !== root) {
    let selector = element.tagName.toLowerCase();

    // Add ID if present
    if (element.id) {
      selector += `#${element.id}`;
      pathArray.unshift(selector);
      break; // ID ensures uniqueness, no need to traverse further
    }

    // Add classes if present
    if (element.className.trim()) {
      const classNames = element.className.trim().split(/\s+/).join(".");
      selector += `.${classNames}`;
    }

    // Add nth-child for siblings of the same type
    const siblings = Array.from(element.parentElement.children).filter(
      (sibling) => sibling.tagName === element.tagName
    );
    if (siblings.length > 1) {
      const index = siblings.indexOf(element) + 1; // nth-child is 1-based
      selector += `:nth-of-type(${index})`;
    }

    pathArray.unshift(selector); // Prepend to the path array
    element = element.parentElement;
  }

  pathArray.unshift(root.tagName.toLowerCase()); // Add the root tag
  return pathArray.join(" > ");
}

// Example Usage

// Test 1: A simple nested structure
const root = document.createElement("div");
const child1 = document.createElement("div");
const child2 = document.createElement("a");
child2.innerHTML = "Link";
child1.appendChild(child2);
root.appendChild(child1);

const selector1 = generateSelector(root, child2);
console.log(selector1); // div > div > a

// Test 2: Using nth-of-type
const section = document.createElement("section");
const ul = document.createElement("ul");
["Home", "Services", "Product"].forEach((text) => {
  const li = document.createElement("li");
  li.innerHTML = text;
  ul.appendChild(li);
});
section.appendChild(ul);

const targetLi = ul.children[2]; // "Product"
const selector2 = generateSelector(section, targetLi);
console.log(selector2); // section > ul > li:nth-of-type(3)
```

### Outputs:
#### Test 1:
```html
<div>
  <div>
    <a>Link</a>
  </div>
</div>
```
Selector: `div > div > a`

#### Test 2:
```html
<section>
  <ul>
    <li>Home</li>
    <li>Services</li>
    <li>Product</li>
  </ul>
</section>
```
Selector: `section > ul > li:nth-of-type(3)`

This implementation ensures accurate and unique CSS selectors for the target element based on its position and attributes in the DOM.