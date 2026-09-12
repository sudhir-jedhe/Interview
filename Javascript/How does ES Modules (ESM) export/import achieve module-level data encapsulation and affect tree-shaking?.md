ES Modules (ESM) provide a formal language-level module system defined by the ECMAScript specification. Unlike legacy CommonJS (CJS) or IIFE closures, ESM achieves encapsulation through **lexical module scope** and **immutable live bindings**, which in turn unlock **static dead-code elimination (tree-shaking)**.

---

### 1. Module-Level Data Encapsulation

Before ESM, JavaScript had only global and function scopes; modularity required wrapping code in Immediately Invoked Function Expressions (IIFEs) or assigning properties to `module.exports`. ESM establishes **Module Scope** as a first-class language boundary.

#### Module Scope & Private Top-Level Declarations

Every ESM file is evaluated in its own strict, isolated scope. Any `const`, `let`, `var`, or `function` declared at the top level is strictly private to that file unless explicitly prefixed with the `export` keyword.

```javascript
// counter.js

// 1. Private module-scoped variable (encapsulated state)
let internalCount = 0;

// 2. Private helper function
function logOperation(op) {
  console.log(`[Counter] Executed: ${op}, Current: ${internalCount}`);
}

// 3. Exposed Public API
export function increment() {
  internalCount++;
  logOperation('increment');
  return internalCount;
}

export function getCount() {
  return internalCount;
}

```

```javascript
// main.js
import { increment, getCount } from './counter.js';

increment(); // 1
console.log(getCount()); // 1

// Attempting to access private state:
console.log(internalCount); // ReferenceError: internalCount is not defined

```

#### Live Bindings vs. CommonJS Value Copying

A major difference between CommonJS and ESM is how exported data behaves:

* **CommonJS:** Copies or clones values onto an `exports` object at the moment of `require()`. If a primitive changes internally later, the consumer still holds the stale, copied primitive.
* **ESM (Live Bindings):** An `export` creates a read-only pointer (binding) to the actual variable in the module’s lexical environment.

```javascript
// counter.js
export let count = 0;
export function tick() { count++; }

// consumer.js
import { count, tick } from './counter.js';

console.log(count); // 0
tick();
console.log(count); // 1 (Consumer observes the updated value in real-time)

count = 10; 
// ❌ TypeError: Assignment to constant variable.
// Consumers have READ-ONLY access to imported bindings.

```

**Encapsulation guarantee:** External consumers cannot tamper with or mutate exported bindings directly; internal state can only be mutated through explicit methods exposed by the module.

---

### 2. How ESM Architecture Enables Tree-Shaking

**Tree-shaking** refers to dead-code elimination performed by bundlers (Rollup, Webpack, esbuild, Vite). It relies entirely on the **static nature of ESM**.

#### CommonJS vs. ESM Static Structure

In CommonJS, imports and exports are dynamic and can depend on runtime evaluation:

```javascript
// CommonJS is DYNAMIC (Impossible to reliably tree-shake)
let math;
if (condition) {
  math = require('./mathA');
} else {
  math = require('./mathB');
}
module.exports[dynamicKey] = () => {};

```

Because `require` can be conditional and export keys can be computed dynamically, static analyzers cannot determine what will actually be used without running the code.

In contrast, ESM is **completely static**:

1. `import` and `export` statements are only valid at the **top-level scope** (not inside `if`, `for`, or functions).
2. Module specifiers must be static string literals.
3. Import identifiers are fixed names.

```javascript
// math.js
export function add(a, b) { return a + b; }
export function subtract(a, b) { return a - b; }
export function multiply(a, b) { return a * b; }

```

```javascript
// app.js
import { add } from './math.js';

console.log(add(2, 3));

```

During the build phase (before any code runs), the bundler constructs an **Abstract Syntax Tree (AST)** for every file and maps the exact dependency graph:

```
[app.js] ---> requests { add } from [math.js]
              UNUSED exports: [ subtract, multiply ]

```

Because `subtract` and `multiply` are never referenced in the graph, the bundler marks them as dead code and drops them from the final bundle.

---

### 3. Obstacles to Tree-Shaking: Side Effects

The primary obstacle preventing a bundler from dropping unused code is **top-level side effects**.

If a module executes code at the top level when loaded (such as modifying prototypes, adding event listeners, or setting global variables), the bundler **cannot** drop it, even if none of its exports are imported.

```javascript
// analytics.js
export function trackEvent(name) { /* ... */ }

// Side effect executed on import:
window.__ANALYTICS_INITIALIZED__ = true;
document.addEventListener('click', () => console.log('clicked'));

```

If another file has:

```javascript
import { trackEvent } from './analytics.js';
// But never actually calls trackEvent()

```

The bundler must retain `analytics.js` in the output because removing it would alter the runtime behavior of the page (the event listener and global property would disappear).

#### Declaring Side Effects in `package.json`

To enable aggressive dead-code elimination, library authors inform bundlers that files are pure using the `"sideEffects"` flag:

```json
{
  "name": "my-library",
  "sideEffects": false
}

```

Or by exempting specific files (like CSS stylesheets):

```json
{
  "name": "my-library",
  "sideEffects": [
    "*.css",
    "./src/polyfills/**"
  ]
}

```

When `"sideEffects": false` is present, the bundler is allowed to omit the entire module if none of its exported bindings are actively referenced.

---

### Summary Comparison

| Dimension                | CommonJS (`require` / `module.exports`)                         | ES Modules (`import` / `export`)                     |
| ------------------------ | --------------------------------------------------------------- | ---------------------------------------------------- |
| **Parsing & Loading**    | Dynamic, synchronous, evaluated at runtime                      | Static, declarative, resolved during parsing/linking |
| **Scope Boundary**       | Wrapped in a function closure `(function(exports, require...))` | Native lexical module scope                          |
| **Export Mechanism**     | Copies/clones values onto an object                             | Read-only live bindings to original module variables |
| **Encapsulation Safety** | Properties on `module.exports` can be overwritten externally    | Imported bindings cannot be reassigned by consumers  |
| **Tree-Shaking Support** | Very limited (requires complex runtime heuristics)              | First-class and native (static graph traversal)      |
