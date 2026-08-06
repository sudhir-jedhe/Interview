To transform an HTML element into a nested JSON structure, where the HTML attributes and children are recursively mapped into the JSON format, we can use the following approach. The function `HTMLtoJSON` will take an HTML node, extract its attributes, process its children, and then build a JSON object representing the structure of the HTML element.

Let's break down the process:

1. **Getting all attributes**: We use the helper function `getAllAttributes` to loop through the attributes of an element and build an object where the attribute names are keys and their values are the corresponding attribute values.
   
2. **Recursively processing children**: If the node has child elements (i.e., it has child nodes that are elements), we recursively call `HTMLtoJSON` on each child node to transform them into their respective JSON representations. If the node has no child elements (e.g., text nodes), we store its `innerText`.

3. **Combining results**: For each node, we store its type (i.e., the tag name), its attributes (if any), and its children (if any).

### Code Implementation:

```javascript
// Helper function to get all attributes of the node as key-value pairs
const getAllAttributes = (node) => {
  let obj = {};
  for (let att, i = 0, atts = node.attributes, n = atts.length; i < n; i++) {
    att = atts[i];
    obj[att.nodeName] = att.nodeValue;
  }
  return obj;
};

// Main function to convert HTML to JSON
const HTMLtoJSON = (node) => {
  // Create an object to store the output
  const output = {};
  
  // Get the node name (tag type)
  const type = node.localName;
  
  // Set the default children to innerText if there are no child elements
  let children = node.innerText;
  
  // If the node has child elements, recursively process them
  if (node.children.length > 0) {
    children = [];
    for (let child of node.children) {
      children.push(HTMLtoJSON(child)); // Recursively call HTMLtoJSON for each child
    }
  }
  
  // Get all attributes of the current node
  const props = getAllAttributes(node);
  
  // If there are any attributes, add them to the output
  if (Object.keys(props).length) {
    output['props'] = props;
  }
  
  // Store the type of the node and its children (text or elements)
  output['children'] = children;
  output['type'] = type;
  
  return output;
};

// Example usage with a sample HTML element
const node = document.getElementById("foo");
console.log(HTMLtoJSON(node));
```

### **Explanation:**

1. **getAllAttributes**: This helper function iterates through the node's attributes and builds an object where each attribute is a key, and the value is the attribute's value. This is useful for storing properties like `id`, `class`, etc.

2. **HTMLtoJSON**:
   - First, we determine the **node type** using `node.localName`, which gives the tag name of the element (e.g., `div`, `h1`, `p`).
   - We then check if the node has any **child elements** (using `node.children.length`). If it does, we recursively call `HTMLtoJSON` on each child element. If the node has no children, we just store the node's **innerText**.
   - We retrieve **all attributes** of the node using `getAllAttributes` and store them in `props`.
   - Finally, we construct the output JSON object with the `type` (tag name), `props` (attributes), and `children` (either text or recursively processed child nodes).

### **Example Output:**

Given the following HTML structure:

```html
<div id="foo">
  <h1>Hello</h1>
  <p class="bar">
    <span>World!</span>
  </p>
</div>
```

And the following JavaScript code:

```javascript
const node = document.getElementById("foo");
console.log(HTMLtoJSON(node));
```

The output will be:

```json
{
  "props": {
    "id": "foo"
  },
  "children": [
    {
      "children": "Hello",
      "type": "h1"
    },
    {
      "props": {
        "class": "bar"
      },
      "children": [
        {
          "children": "World!",
          "type": "span"
        }
      ],
      "type": "p"
    }
  ],
  "type": "div"
}
```

### **Output Breakdown:**

1. **`div`**: This is the root element, and it has an `id` attribute with the value `"foo"`. It has two children: an `h1` and a `p` element.
   
2. **`h1`**: The `h1` element contains the text `"Hello"`. It doesn't have any attributes.

3. **`p`**: The `p` element has a `class` attribute with the value `"bar"`. It contains one child: a `span` element.

4. **`span`**: The `span` element contains the text `"World!"`.

### **Notes:**

- **Handling Empty Elements**: If an element has no text content and no child elements, it will return an empty string for `children`.
  
- **Text Nodes**: Text nodes are stored as `children` directly, while element nodes are recursively processed to include their attributes and children.

This implementation works recursively to handle deeply nested HTML structures, transforming them into a structured JSON representation.