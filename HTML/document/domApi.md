



/*************************User Implement DOM API ************************ */

/**
 * For more programming concepts, questions, tips, and tutorials, visit:
 *
 * https://bit.ly/devtools-yt
 * https://code.devtools.tech
 * https://devtools.tech
 *
 * Author: Yomesh Gupta (https://yomeshgupta.com)
 */

/**
 * Question: Implement the following code so that when interviewer calls vDocument.render()
 * then following HTML structure should be printed.
 *
 * const vDocument = new VDocument();
 * const body = vDocument.createElement("body");
 * const div = vDocument.createElement("div");
 *
 * div.innerHTML = "Hello, I am a div!";
 *
 * body.appendChild(div);
 * vDocument.appendChild(body);
 *
 * vDocument.render();
 *
 * Output:
 * <html>
 * 	<body>
 *		<div>
 * 			Hello, I am a div!
 * 		</div>
 * 	<body>
 * </html>
 *
 * To understand the solution, visit: https://www.youtube.com/watch?v=CAzMsXUe2I0
 */

// Solution
const INDENT_SIZE = 4;
const getSpaces = (length) => {
    return new Array(length).fill(" ").join("");
    ///     return " ".repeat(length);
};

class Node {
    constructor(name) {
        this.name = name;
        this.innerHTML = "";
        this.children = [];
    }
    appendChild(node) {
        this.children.push(node);
    }
}

class VDocument extends Node {
    constructor() {
        super("html");
    }

    createElement(nodeName) {
        return new Node(nodeName);
    }
    render() {
        function printTree(currentNode, currentLevel) {
            // calculating the prefix spaces for current level
            const spaces = getSpaces(currentLevel * INDENT_SIZE);

            let output = "";

            // opening tag
            output += `${spaces}<${currentNode.name}>\n`;

            // innerHTML handling
            if (currentNode.innerHTML) {
                output += `${spaces}${getSpaces(INDENT_SIZE)}${
                    currentNode.innerHTML
                }\n`;
            }

            // loop for children
            for (let i = 0; i < currentNode.children.length; i++) {
                output += printTree(currentNode.children[i], currentLevel + 1);
            }

            // closing tag
            output += `${spaces}</${currentNode.name}>\n`;

            return output;
        }

        console.log(printTree(this, 0));
    }
}

const vDocument = new VDocument();
const body = vDocument.createElement("body");
const div = vDocument.createElement("div");

div.innerHTML = "Hello, I am a div!";
body.appendChild(div);

// Dynamic Insertion by the interviewer
/*
	const div1 = vDocument.createElement("div");
	const div2 = vDocument.createElement("div");
	div1.innerHTML = "Hello, I am a div 1!";
	div2.innerHTML = "Hello, I am a div 2!";
	div.appendChild(div1);
	body.appendChild(div2);
*/

vDocument.appendChild(body);

vDocument.render();



### Code Breakdown and Expected Output

This code implements a custom virtual DOM tree (`VDocument`) which mimics the structure and functionality of a simple HTML document structure. It allows for creating nodes, appending them, and rendering the entire structure in a hierarchical way.

Let's go step by step to understand the process and generate the expected output.

---

### Code Steps:

1. **Creating `VDocument` Class**: 
   - The `VDocument` class inherits from the `Node` class.
   - It represents the root `html` element in the virtual DOM structure.

2. **Creating `Node` Class**:
   - The `Node` class represents an individual element (like `div`, `body`, etc.).
   - Each node has:
     - `name`: The tag name (e.g., `div`, `body`, etc.).
     - `innerHTML`: A string for the content inside the element.
     - `children`: An array to hold any child nodes.

3. **`createElement` Method**:
   - This method in `VDocument` creates a new `Node` (essentially an HTML element) with a given tag name.

4. **`appendChild` Method**:
   - This method adds a child node to the current node's `children` array.

5. **`render` Method**:
   - The `render` method recursively prints the virtual DOM tree starting from the `html` node.
   - It prints each node with the correct indentation and structure.
   
   - **Indentation**:
     - The `getSpaces` function is used to handle indentation, making the printed output visually aligned.

6. **Dynamic Insertion** (Commented in the code):
   - The dynamic insertion part would add two more `div` elements inside the main `div`, which isn't printed by the current code but can be uncommented to expand the structure.

---

### Code Execution:

```javascript
const vDocument = new VDocument();              // Creates <html> as root
const body = vDocument.createElement("body");   // Creates <body>
const div = vDocument.createElement("div");    // Creates <div>

div.innerHTML = "Hello, I am a div!";           // Sets innerHTML for div
body.appendChild(div);                          // Appends div to body

// Dynamic Insertion by the interviewer
const div1 = vDocument.createElement("div");   // Creates another <div>
const div2 = vDocument.createElement("div");   // Creates another <div>
div1.innerHTML = "Hello, I am a div 1!";        // Sets innerHTML for div1
div2.innerHTML = "Hello, I am a div 2!";        // Sets innerHTML for div2
div.appendChild(div1);                          // Appends div1 to div
body.appendChild(div2);                         // Appends div2 to body

vDocument.appendChild(body);                    // Appends body to the root (html)

vDocument.render();                             // Renders the final structure
```

### Expected Output:

After calling `vDocument.render()`, the expected output will be:

```
<html>
    <body>
        <div>
            Hello, I am a div!
            <div>
                Hello, I am a div 1!
            </div>
        </div>
        <div>
            Hello, I am a div 2!
        </div>
    </body>
</html>
```

### Explanation:
- The root element `<html>` contains the `<body>`.
- Inside the `<body>`, there are two `div` elements.
  - The first `div` contains another `div` (nested).
  - The second `div` is appended directly to the `body`.
- Each element is correctly indented to represent the hierarchical structure of the DOM.

### Conclusion:
The provided solution successfully constructs and renders a virtual DOM tree, allowing the interviewer to test dynamic insertion and rendering of hierarchical elements.