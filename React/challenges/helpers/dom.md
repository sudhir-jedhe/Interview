Certainly! Below is the full code for the functions you've shared, along with examples of how to use them in an HTML document.

### Full Code:

```javascript
// Function to create an individual DOM element with given properties
export const createElement = (type = 'div', properties) => {
  const element = document.createElement(type);
  Object.entries(properties).forEach(([key, value]) => {
    if (typeof value === 'object') {
      Object.entries(value).forEach(([subKey, subValue]) => {
        element[key][subKey] = subValue;
      });
      return;
    }
    element[key] = value;
  });
  return element;
};

// Function to create a 1D fragment with m elements
export const create1DFragment = (m, { type = 'div', ...properties }) => {
  const fragment = document.createDocumentFragment();

  for (let i = 0; i < m; i++) {
    const element = createElement(type, { ...properties, dataset: { x: i } });
    fragment.appendChild(element);
  }

  return fragment;
};

// Function to create a 2D fragment with m rows and n columns
export const create2DFragment = (m, n, { type = 'div', ...properties }) => {
  const fragment = document.createDocumentFragment();

  for (let i = 0; i < m; i++) {
    const row = createElement('div'); // Create a row container
    for (let j = 0; j < n; j++) {
      const element = createElement(type, { ...properties, dataset: { x: i, y: j } });
      row.appendChild(element);
    }
    fragment.appendChild(row);
  }

  return fragment;
};

// Function to create a grid fragment with unique index for each element
export const createGridFragment = (m, n, { type = 'div', ...properties }) => {
  const fragment = document.createDocumentFragment();
  let idx = 0;
  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      const element = createElement(type, { ...properties, dataset: { x: i, y: j, idx } });
      fragment.appendChild(element);
      idx++;
    }
  }

  return fragment;
};
```

### Example HTML Document to Use These Functions:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Dynamic DOM Creation</title>
</head>
<body>

  <h1>1D Fragment Example</h1>
  <div id="oneDFragment"></div>

  <h1>2D Fragment Example</h1>
  <div id="twoDFragment"></div>

  <h1>Grid Fragment Example</h1>
  <div id="gridFragment"></div>

  <script type="module">
    // Import the functions
    import { create1DFragment, create2DFragment, createGridFragment } from './path-to-your-file.js';

    // Example 1: Creating a 1D fragment with 5 elements
    const oneDFragment = create1DFragment(5, { className: 'item', style: { margin: '5px', padding: '10px', backgroundColor: 'lightblue' } });
    document.getElementById('oneDFragment').appendChild(oneDFragment);

    // Example 2: Creating a 2D fragment with 3 rows and 4 columns
    const twoDFragment = create2DFragment(3, 4, { className: 'grid-item', style: { margin: '5px', padding: '10px', backgroundColor: 'lightgreen' } });
    document.getElementById('twoDFragment').appendChild(twoDFragment);

    // Example 3: Creating a grid fragment with 3 rows and 3 columns, with unique data-idx
    const gridFragment = createGridFragment(3, 3, { className: 'grid-item', style: { margin: '5px', padding: '10px', backgroundColor: 'lightcoral' } });
    document.getElementById('gridFragment').appendChild(gridFragment);
  </script>

</body>
</html>
```

### **Explanation of the Code:**

1. **`createElement` function**:
   - It creates a DOM element (`type`) and assigns properties to it (e.g., `textContent`, `style`, `dataset`).
   - If the property is an object (e.g., `style` or `dataset`), it applies the nested properties.

2. **`create1DFragment` function**:
   - Creates `m` elements in a single row. Each element has a `data-x` attribute based on its index.
   - The created elements are appended to a `DocumentFragment` to minimize direct manipulation of the DOM, making the operation more efficient.

3. **`create2DFragment` function**:
   - Creates `m` rows, each containing `n` elements. Each element gets a `data-x` and `data-y` attribute based on its position in the grid.
   - The rows are appended to the `DocumentFragment`.

4. **`createGridFragment` function**:
   - Creates a grid of `m` rows and `n` columns, but each element also gets a unique `data-idx` attribute, which represents its unique index across all rows and columns in the grid.

### **What Happens in the HTML Page:**

- **1D Fragment**: A set of 5 elements (each with a `data-x` attribute) is created and added to the DOM.
- **2D Fragment**: A 3x4 grid is created (3 rows and 4 columns), with each element having `data-x` and `data-y` attributes.
- **Grid Fragment**: A 3x3 grid is created, with each element having a unique `data-idx` attribute.

### **Styling**:

- Each element (`item` and `grid-item`) is given basic styling for margin, padding, and background color to visually distinguish them on the page.

### **Result**:

- When you open this HTML file in a browser, you'll see three sections:
  - A 1D fragment of 5 elements.
  - A 2D fragment of 3 rows and 4 columns.
  - A grid fragment of 3 rows and 3 columns, with unique index values for each cell.

You can experiment with the size of the fragments by modifying the `m` and `n` values in the JavaScript.