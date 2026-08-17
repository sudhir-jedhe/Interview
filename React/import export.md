In modern JavaScript and React, **`import`** and **`export`** (introduced in ES6) are used to share code—like components, functions, or variables—across different files. This module system keeps your code organized, reusable, and maintainable.

There are two primary ways to export and import code: **Named Exports** and **Default Exports**.

---

## 1. Default Exports

You can only have **one** default export per file. It is typically used when a file is designed to do exactly one main thing (like exporting a single React component).

### Exporting

You use the `export default` keywords.

```javascript
// Button.jsx
export default function Button() {
  return <button>Click me</button>;
}

```

### Importing

When importing a default export, you **do not use curly braces**. Because there is only one default export in the file, you can name it whatever you want when you import it (though keeping the original name is best practice).

```javascript
// App.jsx
import Button from './Button'; 
// You could also do: import MyCustomButton from './Button';

function App() {
  return <Button />;
}

```

---

## 2. Named Exports

You can have **multiple** named exports in a single file. This is perfect for utility files, custom hooks, or files containing several small components.

### Exporting

You use the `export` keyword directly in front of the variable or function declaration.

```javascript
// mathUtils.js
export const add = (a, b) => a + b;
export const subtract = (a, b) => a - b;
export const PI = 3.14159;

```

### Importing

When importing named exports, you **must use curly braces `{}**`, and the names inside the braces must **exactly match** the exported names.

```javascript
// App.jsx
import { add, subtract, PI } from './mathUtils';

console.log(add(2, 3)); // 5

```

---

## 3. Advanced Import / Export Syntax

### Aliasing (Renaming) Named Imports

If a named import conflicts with a variable already in your file, you can rename it using the `as` keyword.

```javascript
import { add as addNumbers } from './mathUtils';

console.log(addNumbers(5, 5));

```

### Importing Everything as an Object

If a file has dozens of named exports (like an icon library or utility file), you can import them all at once into a single object namespace using `* as`.

```javascript
import * as MathTools from './mathUtils';

console.log(MathTools.PI);
console.log(MathTools.subtract(10, 2));

```

### Combining Default and Named Exports

A single file can contain both one default export and multiple named exports.

```javascript
// userAPI.js
export const fetchUsers = () => { ... }; // Named
export const deleteUser = () => { ... }; // Named

export default function apiConfig() { ... } // Default

```

You can import them together in one line:

```javascript
import apiConfig, { fetchUsers, deleteUser } from './userAPI';

```

---

## Quick Comparison Summary

| Feature            | Default Export                   | Named Export                        |
| ------------------ | -------------------------------- | ----------------------------------- |
| **Syntax**         | `export default Name`            | `export const Name`                 |
| **Import Syntax**  | `import Name from './file'`      | `import { Name } from './file'`     |
| **Limit per file** | Strictly **One**                 | **Multiple** (Unlimited)            |
| **Renaming**       | Can name it anything upon import | Must use `as` keyword to rename     |
| **Best Use Case**  | Main React Components            | Utility functions, Constants, Hooks |
