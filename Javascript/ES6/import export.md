ES6 (ECMAScript 2016 / ES2015) introduced native JavaScript modules using the `import` and `export` statements. Modules help organize code into reusable, isolated files with their own scope.

Here is a complete breakdown of how to use ES6 modules, including **Named**, **Default**, **Dynamic**, and **Re-export** patterns.

---

## 1. Quick Syntax Overview

| Module Pattern       | Export Syntax                  | Import Syntax                                    |
| -------------------- | ------------------------------ | ------------------------------------------------ |
| **Named Export**     | `export const name = 'Alice';` | `import { name } from './file.js';`              |
| **Default Export**   | `export default function() {}` | `import myFunc from './file.js';`                |
| **Alias (Renaming)** | `export { name as userName };` | `import { name as aliasName } from './file.js';` |
| **Namespace (All)**  | N/A                            | `import * as Utils from './file.js';`            |
| **Dynamic Import**   | N/A                            | `const module = await import('./file.js');`      |

---

## 2. Named Exports & Imports

Named exports allow you to export multiple variables, functions, or classes from a single file. When importing them, **you must use the exact same name inside curly braces `{}**`.

### `mathUtils.js` (Exporting)

```javascript
// Inline named exports
export const PI = 3.14159;

export function add(a, b) {
  return a + b;
}

export class Calculator {
  // ...
}

// Or grouped at the bottom:
// export { PI, add, Calculator };

```

### `app.js` (Importing)

```javascript
// Import specific named exports using curly braces
import { PI, add } from './mathUtils.js';

console.log(PI);        // 3.14159
console.log(add(2, 3)); // 5

```

### Renaming Named Imports/Exports (`as`)

If there is a name collision, you can alias properties using the `as` keyword:

```javascript
import { add as sumNumbers } from './mathUtils.js';

console.log(sumNumbers(10, 20)); // 30

```

### Importing Everything as an Object (`* as`)

```javascript
import * as MathUtils from './mathUtils.js';

console.log(MathUtils.PI);
console.log(MathUtils.add(5, 5));

```

---

## 3. Default Exports & Imports

A file can have **at most one default export**. Default exports do **not** use curly braces `{}` when imported, and you can name the imported value whatever you want.

### `User.js` (Exporting)

```javascript
export default class User {
  constructor(name) {
    this.name = name;
  }
}

```

### `app.js` (Importing)

```javascript
// No curly braces required; name can be anything (e.g., Person or User)
import Person from './User.js';

const user = new Person('Alice');

```

---

## 4. Combining Named and Default Exports

A single file can export both one default item and multiple named items.

### `logger.js`

```javascript
// Default export
export default function log(message) {
  console.log(`[LOG]: ${message}`);
}

// Named exports
export const VERSION = '1.0.0';
export function warn(message) {
  console.warn(`[WARN]: ${message}`);
}

```

### `app.js`

```javascript
import log, { VERSION, warn } from './logger.js';

log('System ready'); // Default
warn('Low memory');  // Named

```

---

## 5. Re-exporting / Aggregating Modules (`index.js` pattern)

In larger applications, you can use an `index.js` file to collect exports from multiple sub-modules and export them from a central point.

### `components/index.js`

```javascript
// Re-export named exports from child files
export { Button } from './Button.js';
export { Card } from './Card.js';

// Re-export a default export as a named export
export { default as Header } from './Header.js';

// Re-export everything from a file
export * from './Modal.js';

```

### `app.js`

```javascript
// Clean import from the barrel file
import { Button, Card, Header } from './components/index.js';

```

---

## 6. Dynamic Imports (`import()`)

Static `import` statements must be placed at the top of a file. If you need to load a module conditionally or lazily on demand (e.g., code splitting), use the dynamic `import()` function, which returns a **Promise**.

```javascript
async function loadAnalytics() {
  if (userHasConsented) {
    // Dynamic import returns a promise
    const analytics = await import('./analytics.js');
    analytics.init();
  }
}

// Or with Promise .then() syntax:
import('./analytics.js').then((module) => {
  module.init();
});

```

---

## 7. How to Enable ES6 Modules in HTML and Node.js

### In the Browser (HTML)

Add `type="module"` to your `<script>` tag:

```html
<script type="module" src="app.js"></script>

```

* Modules automatically run in **Strict Mode** (`'use strict'`).
* Modules are deferred by default (loaded asynchronously).

### In Node.js

Set `"type": "module"` in your project's `package.json`:

```json
{
  "name": "my-app",
  "type": "module"
}

```

*(Alternatively, use the `.mjs` file extension for ES6 module files in Node.js).*

Explain the differences between CommonJS require/module.exports and ES6 import/export modules.

The transition from CommonJS (CJS) to ES6 Modules (ESM) represents a major shift in JavaScript development. CommonJS was designed originally for server-side JavaScript (Node.js) and operates synchronously at runtime. ES6 Modules, introduced in ES2015, are the official native standard for both web browsers and modern Node.js environments.

---

## 1. Executive Summary Comparison

| Feature                     | CommonJS (CJS)                       | ES6 Modules (ESM)                         |
| --------------------------- | ------------------------------------ | ----------------------------------------- |
| **Syntax**                  | `require()` / `module.exports`       | `import` / `export`                       |
| **Loading Mechanism**       | **Synchronous / Runtime**            | **Asynchronous / Static (Parse Time)**    |
| **Imported Values**         | Value **Copies** (Primitives copied) | Live **Binding References**               |
| **Dynamic Imports**         | Native (`require(variable)`)         | Via `import()` Promise function           |
| **Environment Default**     | Legacy Node.js                       | Modern Browsers & Modern Node.js          |
| **Strict Mode**             | Opt-in (`'use strict'`)              | **Enabled automatically**                 |
| **Top-Level `this**`        | Points to `module.exports` (`{}`)    | `undefined`                               |
| **Global File Identifiers** | Has `__dirname` and `__filename`     | ❌ No `__dirname` (Uses `import.meta.url`) |

---

## 2. Core Differences Under the Hood

### A. Static vs. Dynamic Resolution

* **CommonJS is Dynamic (Runtime):**
`require()` is a standard synchronous JavaScript function execution. You can call `require()` anywhere inside code blocks, `if` statements, or loops dynamically at runtime.

```javascript
// ✅ Valid CommonJS
if (condition) {
  const feature = require('./feature.js');
}

```

* **ES6 Modules are Static (Parse Time):**
Static `import` statements must be declared at the top-level scope. The JavaScript engine parses module dependency trees **before executing any code**. This static structure enables powerful bundler optimizations like **Tree Shaking** (removing dead/unused code).

```javascript
// ❌ SyntaxError in ESM: Import statements cannot be inside blocks!
if (condition) {
  import feature from './feature.js'; 
}

// ✅ Valid ESM: Must use dynamic import() function for conditional loading
if (condition) {
  const feature = await import('./feature.js');
}

```

---

### B. Live Bindings vs. Value Copies

This is one of the most significant behavioral differences between the two systems:

* **CommonJS Copies Values:** When you require a variable in CJS, the exported value is **copied** at the moment of import. Subsequent mutations to that variable inside the exporting module do not update the importer's reference.

```javascript
// --- counter.js (CJS) ---
let count = 0;
function increment() { count++; }
module.exports = { count, increment };

// --- app.js (CJS) ---
const { count, increment } = require('./counter.js');
console.log(count); // 0
increment();
console.log(count); // 0 (Value copy was NOT updated!)

```

* **ES6 Modules Use Live Bindings:** Imported values in ESM act as **read-only live references** pointing directly to the memory location inside the exporting module. If the exporting module changes a variable, the change is reflected instantly across all importing modules.

```javascript
// --- counter.mjs (ESM) ---
export let count = 0;
export function increment() { count++; }

// --- app.mjs (ESM) ---
import { count, increment } from './counter.mjs';
console.log(count); // 0
increment();
console.log(count); // 1 (Live binding updated automatically!)

```

---

### C. Globals: `__dirname` and `__filename`

CommonJS modules automatically inject scoped global variables like `__dirname` (directory path) and `__filename` (file path). Native ES6 modules do not have these variables.

In modern ESM, you reproduce these paths using `import.meta.url` and the Node.js `url` module:

```javascript
// --- CommonJS ---
console.log(__dirname);
console.log(__filename);

// --- ES6 Modules (ESM) ---
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log(__dirname);

```

---

## 3. Interoperability in Node.js

Node.js supports both module systems side-by-side, but strictly enforces how they interact:

1. **ESM can import CJS:** An ES6 module can `import` a CommonJS module using default imports.

```javascript
import pkg from './commonjs-module.cjs'; // ✅ Allowed

```

1. **CJS CANNOT synchronously `require()` ESM:** CommonJS modules operate synchronously and cannot load an ES6 module directly using `require()`. They must use the asynchronous `import()` expression instead.

```javascript
// ❌ Throws ERR_REQUIRE_ESM
// const esmModule = require('./esm-module.mjs'); 

// ✅ Correct CJS approach:
async function loadESM() {
  const esmModule = await import('./esm-module.mjs');
}

```

---

## Summary Decision Rule

* **Use ES6 Modules (`import`/`export`)** for all new Web, Frontend (React, Vue, Svelte), and Modern Node.js projects (`"type": "module"` in `package.json`). It enables tree-shaking, static analysis, native browser compatibility, and standard JavaScript features like top-level `await`.
* **Maintain CommonJS (`require`)** primarily when maintaining legacy Node.js codebases or working with older npm packages built prior to ES2015 standards.
