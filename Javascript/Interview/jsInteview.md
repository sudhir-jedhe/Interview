Here are detailed, interview-ready answers for the first core set of **JavaScript Theoretical Questions (Q1 to Q19)** from your screenshots.

---

### **Q1: What is the `object` type?**

In JavaScript, an `Object` is a non-primitive, complex data type used to store keyed collections of data and more complex entities.

- **Key Characteristics:** Objects are reference types stored as key-value pairs (where keys are Strings or Symbols).
- **Subtypes:** Standard built-in entities like Arrays, Functions, Dates, Maps, and Sets are all specialized subtypes of `Object`.

---

### **Q2: What is `typeof` operator?**

`typeof` is a unary operator that returns a string indicating the evaluation type of the operand.

- **Possible return values:** `"undefined"`, `"boolean"`, `"number"`, `"bigint"`, `"string"`, `"symbol"`, `"function"`, and `"object"`.
- **Notable Quirk:** `typeof null` returns `"object"`. This is a historic bug in JavaScript's initial implementation that was preserved for backward compatibility.

---

### **Q3: Explain arrays in JavaScript**

Arrays in JavaScript are ordered, list-like collections.

- **Under the Hood:** JavaScript arrays are actually specialized objects with integer key indexes and a dynamic `.length` property.
- **Characteristics:** Elements can be of mixed data types, and array sizes grow or shrink dynamically.
- **Core Methods:** Mutating (`push`, `pop`, `splice`) and functional/non-mutating (`map`, `filter`, `reduce`, `slice`).

---

### **Q4: Explain equality in JavaScript**

JavaScript offers three primary mechanisms to compare values:

1. **Abstract Equality (`==`):** Performs implicit type conversion (coercion) on operands of different types before comparing.
2. **Strict Equality (`===`):** Compares both value and type without coercion.
3. **`Object.is(a, b)`:** Compares if two values are identical, handling special edge cases (e.g., considers `NaN === NaN` to be `true`, and distinguishes `+0` from `-0`).

---

### **Q5: What is Scope in JavaScript?**

Scope determines the accessibility and visibility of variables, functions, and objects in a specific region of code.

- **Global Scope:** Accessible anywhere in the application.
- **Function (Local) Scope:** Variables declared inside a function body.
- **Block Scope:** Variables declared with `let` or `const` inside curly braces `{}` (e.g., `if`, `for`).
- **Lexical Scope:** Functions resolve variables using the scope where they were physically defined in the code, not where they are called.

---

### **Q6: What's the difference between Host objects and Native objects?**

- **Native Objects:** Standard objects defined entirely by the ECMAScript specification regardless of the environment (e.g., `Object`, `Array`, `Date`, `Math`, `Promise`).
- **Host Objects:** Objects provided by the host execution runtime environment (Browser or Node.js) to extend JS capabilities:
- _Browser Host Objects:_ `window`, `document`, `HTMLElement`, `fetch`.
- _Node.js Host Objects:_ `process`, `global`, `Buffer`, `fs`.

---

### **Q7: What's the difference between `throw Error('msg')` vs `throw new Error('msg')`?**

There is **no functional difference** in execution.

- When `Error('msg')` is invoked as a function without `new`, it internally creates and returns a `new Error('msg')` instance with identical stack traces and message properties.
- However, using `new Error('msg')` is considered standard best practice for object instantiation consistency.

---

### **Q8: Explain the same-origin policy with regards to JavaScript.**

The **Same-Origin Policy (SOP)** is a browser security mechanism that restricts scripts on one web page from accessing sensitive data on another web page.

- **Origin Definition:** Protocol + Domain + Port (e.g., `[https://example.com:443](https://example.com:443)`).
- **Impact:** Client-side scripts cannot make cross-origin `fetch`/`XMLHttpRequest` calls or read the DOM of an `<iframe>` unless the remote server explicitly permits it using **CORS** headers.

---

### **Q9: What is the difference between `==` and `===`?**

- `==` (Loose Equality): Converts operands to a common type before comparing (e.g., `'5' == 5` is `true`, `null == undefined` is `true`).
- `===` (Strict Equality): Compares both value and type without performing type conversion (e.g., `'5' === 5` is `false`).

---

### **Q10: Is there any way to force using strict mode in Node.js?**

Yes:

1. **CLI Flag:** Run Node with `--use_strict`: `node --use_strict app.js`.
2. **ES Modules:** Files using `.mjs` extensions or packages configured with `"type": "module"` in `package.json` execute in strict mode by default.
3. **Directive:** Place `"use strict";` at the top of individual JS files or functions.

---

### **Q11: Why would you use something like the `load` event? Does this event have disadvantages? Do you know any alternatives, and why would you use those?**

- **`load` Event:** Fires on `window` when the entire page has loaded, including external assets like images, stylesheets, and scripts.
- **Disadvantage:** It delays code execution until heavy assets finish downloading, delaying UI responsiveness.
- **Alternatives:**
- **`DOMContentLoaded`:** Fires as soon as the HTML document is fully parsed into the DOM tree, without waiting for stylesheets or images. Preferred for initializing DOM element bindings quickly.
- **`defer` / `async` script attributes:** Controls script downloading parallel to HTML parsing.

---

### **Q12: What is strict mode?**

Strict mode (`"use strict";`) is an ES5 feature that places JavaScript into a strict operating context. It prevents silent errors by throwing explicit exceptions, disables unsafe language constructs, and enables compiler optimizations.

---

### **Q13: What is Callback Hell and what is the main cause of it?**

- **Callback Hell (Pyramid of Doom):** A situation where multiple nested asynchronous callbacks make code hard to read, refactor, and maintain.
- **Main Cause:** Chaining dependent asynchronous actions by nesting anonymous callback functions directly within one another instead of using flat abstractions like Promises or `async/await`.

---

### **Q14: What does `use strict` do?**

1. Prevents implicit creation of global variables (throws `ReferenceError` on assignment to undeclared variables).
2. Throws errors on non-writable property assignments or deleting undeletable properties.
3. Sets `this` inside normal standalone functions to `undefined` instead of the global `window` object.
4. Prevents duplicate function parameter names (`function foo(a, a, b)`).

---

### **Q15: Explain event bubbling and how one may prevent it**

- **Event Bubbling:** When an event triggers on a DOM element, it executes handlers on that target element first, then bubbles upward through parent elements all the way to `document` and `window`.
- **Prevention:** Call `event.stopPropagation()` (or `event.stopImmediatePropagation()`) inside the event listener function.

---

### **Q16: What are some of the advantages/disadvantages of writing JavaScript code in a language that compiles to JavaScript?**

- **Advantages:**
- Static type checking (e.g., TypeScript) catches bugs at compile time.
- Access to modern language features prior to broad browser support.
- Enhanced IDE tooling, autocompletion, and refactoring utilities.

- **Disadvantages:**
- Requires a build/compilation step.
- Increased build pipeline setup and maintenance overhead.
- Debugging compiled code can require reliance on source maps.

---

### **Q17: What language constructions do you use for iterating over object properties and array items?**

- **Arrays:**
- `for...of` loop (iterates over array values directly).
- Array iteration methods (`.forEach()`, `.map()`, `.filter()`).
- Index loops (`for (let i = 0; i < arr.length; i++)`).

- **Objects:**
- `for...in` loop (iterates over enumerable string keys; requires `.hasOwnProperty()` guard).
- `Object.keys(obj)`, `Object.values(obj)`, or `Object.entries(obj)` combined with `for...of` or `.forEach()`.

---

### **Q18: Explain Values and Types in JavaScript**

JavaScript is dynamically typed: **variables do not have types; values have types.**

- **Primitives (Passed by value, immutable):** `Number`, `String`, `Boolean`, `Undefined`, `Null`, `Symbol`, `BigInt`.
- **Objects / Reference Types (Passed by reference, mutable):** `Object`, `Array`, `Function`, `Date`, etc.

---

### **Q19: Explain `Null` and `Undefined` in JavaScript**

- **`undefined`:** Indicates that a variable has been declared but has not yet been assigned a value, or a function missing an explicit return statement.
- **`null`:** Represents an intentional assignment of "no value" or an empty object reference.
- **Comparison:** `typeof undefined === 'undefined'`, `typeof null === 'object'`. `null == undefined` is `true`, but `null === undefined` is `false`.

---

Would you like to move on to the next set of **Theoretical Questions (Q20–Q40)** or jump into solving the **Code Challenges** next?

Here are the detailed, interview-ready answers for **JavaScript Theoretical Questions (Q20 to Q40)** from your screenshots.

---

### **Q20: Explain what is Linear (Sequential) Search and when may we use one?**

- **What it is:** A simple searching algorithm that checks every element in a collection sequentially from start to finish until the target value is found or the end is reached.
- **Time Complexity:** $O(n)$
- **When to use:**

1. On **unsorted** datasets (Binary Search cannot be used without sorting first).
2. On small datasets where overhead from complex algorithms isn't worth it.
3. Built-in JS methods like `.indexOf()`, `.includes()`, and `.find()` use linear search under the hood.

---

### **Q21: Why is it, in general, a good idea to leave the global scope of a website as-is and never touch it?**

1. **Name Collisions:** Declaring global variables (`var x = 1` or `window.x = 1`) risks overwriting existing scripts, third-party libraries, or analytics tools.
2. **Security Vulnerabilities:** Global variables are easily readable and modifiable via browser dev tools or malicious scripts (XSS).
3. **Hard to Debug & Test:** Global state introduces hidden dependencies and makes unit testing unreliable.

---

### **Q22: What is `let` keyword in JavaScript?**

Introduced in ES6, `let` declares block-scoped local variables.

- **Block-Scoped:** Visible only within the enclosing `{}` block.
- **No Re-declaration:** Cannot re-declare the same variable within the same scope level.
- **Temporal Dead Zone (TDZ):** Hoisted, but accessing it before its declaration line throws a `ReferenceError`.

---

### **Q23: Explain what is Binary Search**

- **What it is:** An efficient divide-and-conquer algorithm for finding an element in a **sorted** array. It repeatedly compares the target value to the middle element and cuts the search space in half each step.
- **Time Complexity:** $O(\log n)$
- **Prerequisite:** The input array **must be sorted**.

---

### **Q24: What is a Polyfill?**

A **polyfill** is a piece of code (typically client-side JavaScript) used to provide modern functionality on older browsers that do not natively support it.

- **Example:** Adding a manual implementation of `Array.prototype.includes` if `!Array.prototype.includes`.

---

### **Q25: What is the motivation for bringing `Symbol` to ES6?**

1. **Unique Object Keys:** `Symbol()` creates guaranteed unique primitive values, preventing property key collisions when extending objects or adding metadata.
2. **Hidden/Private Properties:** Properties keyed with Symbols are non-enumerable in `for...in` loops and `Object.keys()`.
3. **Well-Known Symbols:** Metaprogramming hooks like `Symbol.iterator` allow objects to define custom iteration behaviors.

---

### **Q26: What's the difference between using `let` and `var` to declare a variable in ES6?**

| Feature                    | `var`                            | `let`                                 |
| -------------------------- | -------------------------------- | ------------------------------------- |
| **Scope**                  | Function Scope                   | Block Scope (`{}`)                    |
| **Hoisting**               | Hoisted with default `undefined` | Hoisted into Temporal Dead Zone (TDZ) |
| **Re-declaration**         | Allowed in same scope            | Throws `SyntaxError`                  |
| **Global Window Property** | Creates property on `window`     | Does **not** attach to `window`       |

---

### **Q27: What is a generator in JS?**

A **Generator** is a special type of function (`function*`) that can be paused mid-execution and resumed later.

- Yielding values via `yield` produces an iterator object containing `{ value, done }`.
- **Example:**

```javascript
function* count() {
  yield 1;
  yield 2;
}
const counter = count();
console.log(counter.next()); // { value: 1, done: false }
```

---

### **Q28: Why is extending built-in JavaScript objects not a good idea?**

Modifying built-in prototypes (e.g., `Array.prototype.customMethod = ...`) is called **Monkey Patching** and is considered an anti-pattern:

1. **Future Spec Breakage:** If a future ECMAScript specification adds a native method with the same name, your custom implementation could break or behave unexpectedly.
2. **Library Collisions:** Multiple third-party libraries attempting to patch the same prototype will overwrite each other.

---

### **Q29: What advantages are using arrow functions?**

1. **Concise Syntax:** Shorter syntax, with implicit returns for single expression bodies (`x => x * 2`).
2. **Lexical `this` Binding:** They do not bind their own `this` context; instead, they inherit `this` lexically from the surrounding scope.
3. **No `arguments` Object:** Simplifies scope tracking without implicit binding objects.

---

### **Q30: What are the advantages and disadvantages of using `use strict`?**

- **Advantages:**
- Throws explicit errors on accidental global variable assignments.
- Prevents duplicate parameter names (`function foo(a, a)`).
- Makes `this` inside plain functions `undefined` instead of `window`.
- Allows engines to perform micro-optimizations.

- **Disadvantages:**
- Older legacy codebases relying on implicit globals might throw errors when strict mode is enabled.
- Mixing strict and non-strict concatenated scripts can lead to inconsistent runtime behavior.

---

### **Q31: When should we use generators in ES6?**

1. **Managing Large Data Streams (Lazy Evaluation):** Compute values on-demand without storing entire datasets in memory.
2. **Creating Custom Iterables:** Defining custom iteration behavior for complex objects via `Symbol.iterator`.
3. **Asynchronous Flow Control:** Managing complex sequential async workflows (historically used before `async/await` in libraries like Redux-Saga).

---

### **Q32: How to compare two objects in JavaScript?**

In JavaScript, objects are reference types. Comparing two distinct objects with `===` checks reference identity, not content.

- **Shallow Comparison:** Compare keys and top-level values using `Object.keys(obj1)` and `===`.
- **Deep Comparison:** Recursively iterate keys/values or use utility functions like `lodash.isEqual()`.
- **Quick (but limited) String Comparison:** `JSON.stringify(obj1) === JSON.stringify(obj2)` (Note: Order of keys matters and functions/undefined are stripped).

---

### **Q33: What will be the output of the following code?**

_(Note: General answer structure depending on common output snippet questions)_
When functions return objects or rely on closure scope:

```javascript
console.log(typeof typeof 1); // Output: "string"
```

Because `typeof 1` returns `"number"`, and `typeof "number"` evaluates to `"string"`.

---

### **Q34: What is a closure, and how/why would you use one?**

- **Definition:** A **closure** is a combination of a function bundled together with references to its surrounding state (lexical environment).
- **Key Concept:** Inner functions retain access to variables defined in their outer function's scope even after the outer function has finished executing.
- **Why Use It:**

1. Data Privacy / Private variables.
2. Currying and function factory patterns.
3. Event listeners keeping access to state values.

---

### **Q35: What's a typical use case for anonymous functions?**

1. **Callbacks:** Passing inline handlers to async operations (e.g., `setTimeout(() => {}, 1000)` or `arr.map(x => x * 2)`).
2. **IIFE (Immediately Invoked Function Expressions):** Creating temporary isolated scopes.
3. **Event Listeners:** `button.addEventListener('click', function() { ... })`.

---

### **Q36: What will be the output of the following code?**

_(Common JS scope trick question)_

```javascript
(function () {
  var a = (b = 3);
})();
console.log(typeof a !== "undefined"); // false
console.log(typeof b !== "undefined"); // true
```

- **Explanation:** `var a = b = 3;` is evaluated right-to-left as `b = 3; var a = b;`. `b` becomes an implicit global variable, while `a` is scoped inside the function.

---

### **Q37: Suggest one simple way of removing duplicates from an array using ES6**

Use `Set` combined with the spread operator (`...`):

```javascript
const uniqueArray = [...new Set(array)];
```

---

### **Q38: What is the difference between Anonymous and Named functions?**

| Feature          | Named Functions                                | Anonymous Functions                                  |
| ---------------- | ---------------------------------------------- | ---------------------------------------------------- |
| **Syntax**       | `function myFunc() {}`                         | `function() {}` or `() => {}`                        |
| **Hoisting**     | Hoisted completely to top of scope             | Not hoisted unless assigned to `var`                 |
| **Stack Traces** | Displays explicit function name in stack trace | Appears as `<anonymous>` (harder to debug)           |
| **Recursion**    | Can call itself directly by name               | Requires extra steps or external variable references |

---

### **Q39: Explain the difference between `Object.freeze()` vs `const**`

- **`const`:** Binds a variable reference so it cannot be reassigned. However, the internal properties of an object assigned to `const` can still be mutated (`obj.key = 'new'`).
- **`Object.freeze()`:** Makes the object's properties immutable (shallow freeze). You cannot add, delete, or modify values inside the object, but the variable pointing to it can still be reassigned if declared with `let`.

---

### **Q40: Why should we use ES6 classes?**

1. **Cleaner Syntax:** Replaces manual prototype manipulation with clear, object-oriented syntax (`class`, `extends`, `constructor`, `super`).
2. **Built-in Constructor Safety:** Calling a class without `new` throws a `TypeError`.
3. **Inheritance Abstraction:** Simplifies subclassing and parent method overrides cleanly via `extends` and `super`.

---

Shall we proceed to **Theoretical Questions (Q41–Q60)** or jump into solving the **Code Challenges** next?
Here are detailed, interview-ready answers for **JavaScript Theoretical Questions (Q41 to Q60)** from your screenshots.

---

### **Q41: What are the differences between ES6 class and ES5 function constructors?**

| Feature           | ES5 Function Constructor                                                        | ES6 Class                                                         |
| ----------------- | ------------------------------------------------------------------------------- | ----------------------------------------------------------------- |
| **Syntax**        | Standard functions manipulating `.prototype`.                                   | Cleaner OOP syntax (`class`, `constructor`, `extends`).           |
| **Instantiation** | Calling without `new` runs the function silently (potentially leaking globals). | Calling without `new` throws an explicit `TypeError`.             |
| **Hoisting**      | Function declarations are hoisted completely.                                   | Class declarations are hoisted into the Temporal Dead Zone (TDZ). |
| **Inheritance**   | Uses manual prototype chain assignment (`Object.create`).                       | Uses built-in `extends` and `super()` keywords.                   |

---

### **Q42: What is Currying?**

**Currying** is a functional programming technique where a function with multiple arguments is transformed into a sequence of nesting functions, each taking a single argument.

- **Transformation:** $f(a, b, c) \rightarrow f(a)(b)(c)$
- **Example:**

```javascript
// Standard function
const add = (a, b) => a + b;

// Curried function
const curriedAdd = (a) => (b) => a + b;
const addFive = curriedAdd(5);
console.log(addFive(3)); // 8
```

---

### **Q43: What is the difference between document `load` event and document `DOMContentLoaded` event?**

- **`DOMContentLoaded`:** Fires when the initial HTML document has been completely parsed and the DOM tree is built, **without waiting** for external resources like images, subframes, or external stylesheets.
- **`load`:** Fires later, when the **entire page** and all dependent resources (images, stylesheets, scripts) have fully loaded.

---

### **Q44: What is the difference between a shim and a polyfill?**

- **Polyfill:** A specific type of shim that intercepts modern API calls and replicates the missing standard feature in older environments (e.g., adding `Array.prototype.includes` if it's missing).
- **Shim:** A broader term for a library that intercepts API calls and modifies or unifies behavior (e.g., normalizations across browsers), often bringing its own custom API or patching non-standard behavior rather than just backporting standard specifications.

---

### **Q45: What do you think of AMD vs CommonJS?**

Both are module formatting standards created before ES6 modules (`import`/`export`) were standardized:

- **CommonJS (CJS):** Designed for server-side runtimes (Node.js). Synchronous loading using `require()` and `module.exports`.
- **AMD (Asynchronous Module Definition):** Designed for browsers. Asynchronous loading using wrappers (`define(['dep1'], function(dep1) {})`) to avoid blocking script execution over network requests.
- _Modern Context:_ Both are largely superseded by native **ES Modules (ESM)** in modern frontend development.

---

### **Q46: What is the definition of a Higher-Order Function?**

A **Higher-Order Function (HOF)** is a function that performs at least one of the following actions:

1. Takes one or more functions as arguments (e.g., callbacks).
2. Returns a function as its result.

- **Built-in Examples:** `Array.prototype.map`, `filter`, `reduce`, `setTimeout`.

---

### **Q47: What is a Jump (or Block) Search?**

- **What it is:** A searching algorithm for **sorted arrays** that checks fewer elements than linear search by stepping/jumping ahead by fixed block sizes $m$ (typically optimal block size $m = \sqrt{n}$), then performing a linear search backward within that block once the target is overshot.
- **Time Complexity:** $O(\sqrt{n})$

---

### **Q48: Explain the difference between `undefined` and `not defined` in JavaScript**

- **`undefined`:** A primitive value indicating that a variable has been declared in code, but no value has been assigned to it yet.
- **`not defined`:** A `ReferenceError` thrown at runtime when the JavaScript engine attempts to access a variable name that was never declared in any accessible scope.

---

### **Q49: What is Coercion in JavaScript?**

**Type Coercion** is the automatic or implicit conversion of values from one data type to another (e.g., string to number, object to boolean) performed by the JS engine during operations.

- **Implicit Coercion:** `'5' + 2` yields `'52'` (number coerced to string).
- **Explicit Conversion:** `Number('5')` converts explicitly.

---

### **Q50: What is IIFE (Immediately Invoked Function Expression)?**

An **IIFE** is a JavaScript function that runs as soon as it is defined.

```javascript
(function () {
  var privateVar = "Secret";
  console.log("Runs immediately!");
})();
```

- **Purpose:** Historically used to create local scope closures and avoid polluting the global namespace prior to ES6 block scoping (`let`/`const`) and modules.

---

### **Q51: Explain what is Interpolation Search**

- **What it is:** An improved variation of Binary Search for **sorted, uniformly distributed datasets**.
- **How it works:** Instead of always checking the middle element, it calculates an estimated position based on the target value relative to the range endpoints (similar to how humans look up words in a physical dictionary).
- **Time Complexity:** Average case $O(\log(\log n))$, Worst case $O(n)$.

---

### **Q52: What is `export default` in JavaScript?**

In ES6 module syntax, `export default` specifies a single primary export per module file.

- **Usage:**

```javascript
// math.js
export default function add(a, b) {
  return a + b;
}

// app.js
import myAdditionFunc from "./math.js"; // Can be imported with any local name without curly braces
```

---

### **Q53: When should I use Arrow Functions in ES6?**

1. **Callback Functions:** Clean, inline operations for array methods (`arr.map(x => x * 2)`).
2. **Preserving `this` Scope:** In methods/event callbacks where you want to retain the surrounding lexical `this` (e.g., inside timeouts or promise handlers within object methods).
3. **Short Utilities:** Pure, single-expression utility functions.

---

### **Q54: What are the benefits of using spread syntax in ES6 and how is it different from rest syntax?**

Both use the `...` syntax, but serve opposite roles:

- **Spread Syntax (`...`):** Expands an iterable (like an array or object) into individual elements/properties.
- _Example:_ `const newArr = [...arr1, ...arr2];`

- **Rest Syntax (`...`):** Collects multiple individual values or remaining arguments into a single array structure.
- _Example:_ `function sum(...numbers) { ... }`

---

### **Q55: Explain `Function.prototype.bind**`

The `.bind()` method creates a **new function** that, when called, has its `this` keyword permanently bound to the provided object, alongside any initial pre-set arguments (partial application).

```javascript
const boundFunc = func.bind(thisContext, arg1, arg2);
```

---

### **Q56: Could you explain the difference between ES5 and ES6?**

| Aspect        | ES5 (ECMAScript 2009)           | ES6 (ECMAScript 2015)                             |
| ------------- | ------------------------------- | ------------------------------------------------- |
| **Variables** | `var` (function scope).         | `let` and `const` (block scope).                  |
| **Functions** | Standard `function` keyword.    | Arrow functions, default parameters, rest/spread. |
| **OOP**       | Prototypes and constructors.    | `class`, `extends`, `super`.                      |
| **Modules**   | Require CommonJS/AMD libraries. | Native ES Modules (`import`/`export`).            |
| **Async**     | Callbacks.                      | Promises and Generators.                          |

---

### **Q57: Describe Closure concept in JavaScript as best as you could**

A **closure** is created whenever a function is created, giving that function persistent access to variables in its outer lexical scope even after that parent function has finished executing and returned.

- **Mechanism:** The function holds a reference to its lexical environment, keeping variable memory alive instead of letting garbage collection sweep it away.

---

### **Q58: What is the preferred syntax for defining enums in JavaScript?**

Because JavaScript doesn't have native `enum` primitives (unlike TypeScript), the preferred syntax uses `Object.freeze()` on a standard object:

```javascript
const Status = Object.freeze({
  PENDING: "PENDING",
  SUCCESS: "SUCCESS",
  FAILED: "FAILED",
});
```

---

### **Q59: What's the difference between `.call()` and `.apply()`?**

Both immediately invoke a function with a specified `this` context:

- **`.call(thisArg, arg1, arg2)`:** Accepts arguments **individually** separated by commas.
- **`.apply(thisArg, [arg1, arg2])`:** Accepts arguments passed as an **array** (or array-like object).

---

### **Q60: What is the drawback of creating true private in JavaScript?**

Historically, true private members (e.g., using closures inside constructors or WeakMaps) had minor drawbacks:

1. **Memory Overhead:** Methods defined inside constructors to access closure variables are recreated on every instance rather than shared on the prototype chain.
2. **Debugging:** Harder to inspect private values in browser dev tools.

- _Modern Update:_ ES2022 introduced native private class fields using `#` (e.g., `#privateField`), which native runtimes optimize efficiently.

---

Ready to cover **Q61 to Q80** or dive into the **Code Challenges** next?

Here are detailed, interview-ready answers for **JavaScript Theoretical Questions (Q61 to Q80)** from your screenshots.

---

### **Q61: Explain the differences on the usage of `foo` between `function foo() {}` and `var foo = function() {}**`

- **`function foo() {}` (Function Declaration):**
- **Hoisting:** The function declaration is fully hoisted (both key name and function implementation) to the top of its scope during compilation.
- **Invocation:** You can invoke `foo()` anywhere in its scope, even _before_ its actual line of definition in code.

- **`var foo = function() {}` (Function Expression):**
- **Hoisting:** Only the variable definition `var foo` is hoisted (initialized to `undefined`). The assignment of the function definition occurs only when execution hits that line.
- **Invocation:** Invoking `foo()` before its definition line throws a `TypeError: foo is not a function`.

---

### **Q62: Does JavaScript have a `map` function to iterate over an object properties?**

**No**, `map()` is exclusively a method on `Array.prototype`.

- **How to map over Object properties:** Convert the object into an array structure first using ES6 methods:

```javascript
const obj = { a: 1, b: 2 };

// Map over keys:
Object.keys(obj).map((key) => key.toUpperCase());

// Map over entries (key-value pairs):
const newObj = Object.fromEntries(
  Object.entries(obj).map(([key, val]) => [key, val * 2]),
);
```

---

### **Q63: How would you prevent Callback Hell without using promises, async or generators?**

1. **Modularize / Named Functions:** Break nested anonymous callbacks out into separate, standalone named functions at the root scope level.
2. **Early Returns (Guard Clauses):** Handle errors early inside callbacks to avoid deeply nested `if/else` logic.
3. **Async Control Flow Libraries:** Use lightweight procedural utilities like `async.waterfall()` or `async.series()` (which organize callbacks sequentially under the hood).

---

### **Q64: Explain how JSONP works (and how it's not really Ajax)**

- **How JSONP Works:**
  JSONP (JSON with Padding) bypasses the Same-Origin Policy (SOP) by exploiting the fact that HTML `<script>` tags are allowed to load resources across different origins.

1. The client creates a `<script src="[https://api.example.com/data?callback=myCallback](https://api.example.com/data?callback=myCallback)">` tag dynamically in the DOM.
2. The server responds with JavaScript code executing that function with data as an argument: `myCallback({ "user": "John" });`.

- **Why it's not Ajax:** It does not use `XMLHttpRequest` or `fetch()`. It strictly injects executable `<script>` elements into the DOM, making it limited exclusively to `GET` HTTP requests and posing security risks (executable code injection).

---

### **Q65: Could you compare usage of Module Pattern vs Constructor/Prototype pattern?**

- **Module Pattern (Closures):**
- Uses IIFEs and closures to encapsulate data and return a public API object.
- Provides **true private state** (variables inside the closure cannot be accessed externally).
- _Drawback:_ Every instance duplicates methods in memory.

- **Constructor / Prototype Pattern:**
- Uses standard ES5 constructors (`function Person()`) or ES6 classes and attaches methods to `Person.prototype`.
- **Memory Efficient:** Prototype methods are shared across all instances via reference.
- _Drawback:_ Historically lacked private properties (all properties on `this` were public).

---

### **Q66: When would you use `import * as X from 'X'`?**

Use namespace imports when:

1. Importing a large library/utility module containing many exported functions (e.g., `import * as MathUtils from './math.js'`), allowing you to call `MathUtils.add()` and `MathUtils.subtract()`.
2. Preventing naming collisions with local variables or functions in the current file.
3. Importing modules that do not export a `default` value.

---

### **Q67: What tools can be used to assure consistent code style?**

1. **Linters:** **ESLint** (enforces code quality rules and flags syntax errors or anti-patterns).
2. **Formatters:** **Prettier** (automatically formats code indentation, quotes, semicolons, and line breaks).
3. **Git Hooks:** **Husky** & **lint-staged** (runs ESLint/Prettier checks automatically on staged files during `git commit`).

---

### **Q68: What is the Temporal Dead Zone in ES6?**

The **Temporal Dead Zone (TDZ)** is the time span between entering a scope where a `let` or `const` variable is hoisted and the actual line of code where it is initialized with a value.

- Attempting to access or evaluate a variable inside its TDZ throws an explicit **`ReferenceError`**.

---

### **Q69: Explain Prototype Inheritance in JavaScript**

In JavaScript, objects have an internal link to another object called their **prototype** (`[[Prototype]]` or `__proto__`).

- **Lookup Chain:** When accessing a property on an object, JavaScript checks the object itself first. If missing, it traverses up its prototype chain step-by-step until it finds the property or reaches `null`.
- **Inheritance:** Objects inherit properties and methods directly from their prototype objects without copying them.

---

### **Q70: Explain what is Hoisting in JavaScript**

**Hoisting** is the mechanism where the JavaScript engine allocates memory for variable and function declarations before executing code.

- **Function Declarations:** Fully hoisted (can be called before definition).
- **`var` Declarations:** Hoisted and initialized with `undefined`.
- **`let` / `const` Declarations:** Hoisted, but left uninitialized in the **Temporal Dead Zone (TDZ)** until declared.

---

### **Q71: What's the difference between a variable that is: `null`, `undefined` or undeclared? How would you go about checking for any of these states?**

- **`null`:** Explicitly assigned empty value.
- _Check:_ `val === null`

- **`undefined`:** Variable declared, but no value assigned.
- _Check:_ `val === undefined` or `typeof val === 'undefined'`

- **Undeclared:** Variable identifier never declared in scope using `var`/`let`/`const`.
- _Check:_ Must use `typeof undeclaredVar === 'undefined'` (directly accessing `undeclaredVar` throws a `ReferenceError`).

---

### **Q72: Describe the JS module design pattern**

The **Module Pattern** leverages closure scopes to encapsulate private logic and state while exposing a clean public API object.

```javascript
const UserModule = (function () {
  let privateName = "Alice"; // Private

  return {
    getName: function () {
      return privateName;
    }, // Public API
    setName: function (name) {
      privateName = name;
    },
  };
})();
```

---

### **Q73: Explain the Prototype Design Pattern**

The **Prototype Pattern** involves creating new objects by cloning an existing prototype object rather than instantiating classes from scratch.

- In JavaScript, this is natively implemented using `Object.create(prototypeObject)`:

```javascript
const carPrototype = {
  drive() {
    console.log("Vroom!");
  },
};

const myCar = Object.create(carPrototype);
myCar.drive(); // Inherits drive() via prototype chain
```

---

### **Q74: Can you give an example for destructuring an object or an array in ES6?**

- **Object Destructuring:**

```javascript
const user = { name: "Bob", age: 30 };
const { name, age } = user;
```

- **Array Destructuring:**

```javascript
const colors = ["red", "green", "blue"];
const [primary, secondary] = colors;
```

---

### **Q75: What does the term Transpiling stand for?**

**Transpiling** (Source-to-Source Compiling) is the process of translating source code written in one language/version into another language/version at the same abstraction level.

- _Example:_ **Babel** transpiles modern ES6+ JavaScript down to browser-compatible ES5 code so older browsers can run it.

---

### **Q76: Can you describe the main difference between a `.forEach` loop and a `.map()` loop and why you would pick one versus the other?**

| Method           | `.forEach()`                                                               | `.map()`                                                       |
| ---------------- | -------------------------------------------------------------------------- | -------------------------------------------------------------- |
| **Return Value** | Returns `undefined`.                                                       | Returns a **new Array** containing mapped values.              |
| **Side Effects** | Designed to execute side effects (mutating external state, DOM rendering). | Pure transformation function (does not mutate original array). |
| **When to Pick** | Use when performing an action _per item_ (e.g., logging, updating DOM).    | Use when transforming array items into a new array.            |

---

### **Q77: What is the `new` keyword in JavaScript?**

When used before a function constructor or class, `new`:

1. Creates a brand-new empty object `{}`.
2. Binds `this` inside the constructor function to this new object.
3. Sets the new object's internal `[[Prototype]]` to the constructor's `.prototype`.
4. Automatically returns the new object (unless the constructor explicitly returns a different object).

---

### **Q78: When should you NOT use arrow functions in ES6? Name three or more cases.**

1. **Object Methods:** Arrow functions inherit lexical `this`, breaking method invocation (`const obj = { val: 10, getVal: () => this.val }` returns `undefined`).
2. **DOM Event Handlers:** When you need `this` to refer to the target element triggered by the event listener.
3. **Constructors:** Arrow functions cannot be called with `new` (they lack a `.prototype` property and construct internal bindings).
4. **Prototypes:** Defining prototype functions requiring instance context.

---

### **Q79: Check if a given string is an isomorphic string**

Two strings `s` and `t` are **isomorphic** if characters in `s` can be mapped uniquely to characters in `t`.

```javascript
function isIsomorphic(s, t) {
  if (s.length !== t.length) return false;
  const mapS = new Map(),
    mapT = new Map();

  for (let i = 0; i < s.length; i++) {
    if (
      (mapS.has(s[i]) && mapS.get(s[i]) !== t[i]) ||
      (mapT.has(t[i]) && mapT.get(t[i]) !== s[i])
    ) {
      return false;
    }
    mapS.set(s[i], t[i]);
    mapT.set(t[i], s[i]);
  }
  return true;
}
```

---

### **Q80: Explain difference between: `function Person(){}`, `var person = Person()`, and `var person = new Person()`?**

- **`function Person(){}`:** Defines a standard function declaration.
- **`var person = Person()`:** Executes `Person` as a regular function and assigns its return value to `person` (if no `return`, `person` becomes `undefined`). Modifies the outer/global scope if `this.prop` was set inside.
- **`var person = new Person()`:** Instantiates a new instance object using `Person` as a constructor, setting `person.__proto__ === Person.prototype`.

---

Shall we proceed to **Theoretical Questions (Q81–Q92)** or start solving the **Code Challenges**?

Here are the detailed, interview-ready answers for the remaining **JavaScript Theoretical Questions (Q81 to Q92)**.

---

### **Q81: What is Hoisting in JavaScript?**

Hoisting is JavaScript's default behavior of moving declarations to the top of the current scope (script or function) during the compilation phase before code execution.

- **Functions:** Full function declarations are completely hoisted, allowing them to be called before their definition in the code.
- **`var`:** Hoisted and initialized with `undefined`.
- **`let` / `const`:** Hoisted to the top of the block, but left in the **Temporal Dead Zone (TDZ)**; accessing them before initialization throws a `ReferenceError`.

---

### **Q82: What are the actual uses of ES6 `WeakMap`?**

1. **Storing Private Data for Objects:** Associate private data with object instances without attaching properties directly onto the object or exposing them to public iteration.
2. **Caching / Memoization:** Store computed results keyed by input objects. When the input object is garbage collected, the cache entry is automatically deleted.
3. **DOM Element Metadata:** Attach metadata to specific DOM elements. When the DOM element is removed from the tree, its associated metadata is cleaned up automatically.

---

### **Q83: How can you share code between files?**

1. **ES6 Modules (ESM):** Modern standard using `export` (or `export default`) and `import` syntax.
2. **CommonJS (CJS):** Node.js standard using `module.exports` and `require()`.
3. **Global Script Tags / Namespaces:** Linking multiple `<script>` files in HTML and exposing shared utilities on the global `window` object (legacy approach).

---

### **Q84: Can you give an example of a curry function and why this syntax offers an advantage?**

- **Example:**

```javascript
const multiply = (a) => (b) => a * b;
const double = multiply(2); // Partially applied function
console.log(double(5)); // 10
```

- **Advantages:**
- **Partial Application / Reusability:** Fix certain arguments once to create specialized utility functions (`double`, `triple`).
- **Function Composition:** Fits cleanly into functional pipelines (e.g., passing curried handlers directly to array methods like `.map(double)`).

---

### **Q85: In JavaScript, why is the `this` operator inconsistent?**

`this` is not dynamically scoped or lexically bound by default (except in arrow functions); instead, **`this` is determined strictly by _how_ a function is invoked at runtime**:

- **Implicit Binding:** Called as an object method (`obj.fn()`) $\rightarrow$ `this` is `obj`.
- **Standalone Invocation:** Called as a regular function (`fn()`) $\rightarrow$ `this` is `window` (or `undefined` in strict mode).
- **Constructor Invocation:** Called with `new fn()` $\rightarrow$ `this` is the newly created object.
- **Explicit Binding:** Called via `.call()`, `.apply()`, or `.bind()` $\rightarrow$ `this` is explicitly specified.

---

### **Q86: Does JavaScript pass by references or pass by values?**

JavaScript is **always Pass-by-Value**.

- **Primitive Types:** Passed by copy of value.
- **Objects / Reference Types:** Passed by **copy of the reference value** (often called _Call-by-Sharing_). Modifications to object properties inside a function affect the original object, but reassigning the parameter variable entirely does not affect the outer variable reference.

---

### **Q87: Is JavaScript a pass-by-reference or pass-by-value language?**

_(See Q86)_ JavaScript is strictly **pass-by-value**. For objects, the "value" passed into the function argument is the copy of the memory address reference.

---

### **Q88: Is it possible to reset an ECMAScript 6 generator to its initial state?**

**No.** Native ES6 generator instances cannot be reset once they reach `{ done: true }` or advance mid-stream.

- **Workaround:** To start over, you must instantiate a **new generator object** by calling the generator function again:

```javascript
function* myGen() {
  yield 1;
  yield 2;
}
let gen = myGen();
gen.next(); // { value: 1, done: false }

// Reset by re-instantiating:
gen = myGen();
```

---

### **Q89: What's the difference between ES6 `Map` and `WeakMap`?**

| Feature                | `Map`                                                | `WeakMap`                                                                              |
| ---------------------- | ---------------------------------------------------- | -------------------------------------------------------------------------------------- |
| **Key Types**          | Any data type (Primitives, Objects, Functions).      | **Must be Objects** (or non-registered Symbols).                                       |
| **Garbage Collection** | Prevents keys from being garbage collected.          | Holds **weak references**; keys can be garbage-collected if no other references exist. |
| **Iterability**        | Fully iterable (`for...of`, `.keys()`, `.values()`). | **Not iterable** (no `.keys()`, `.size`, or iteration).                                |

---

### **Q90: How to deep-freeze object in JavaScript?**

`Object.freeze()` only performs a **shallow freeze**. To deep-freeze an object, recursively freeze all nested objects:

```javascript
function deepFreeze(obj) {
  Object.keys(obj).forEach((prop) => {
    if (
      typeof obj[prop] === "object" &&
      obj[prop] !== null &&
      !Object.isFrozen(obj[prop])
    ) {
      deepFreeze(obj[prop]);
    }
  });
  return Object.freeze(obj);
}
```

---

### **Q91: Compare Async/Await and Generators usage to achieve same functionality**

Before native `async/await` was added in ES2017, **Generators + Promises** were used together to write synchronous-looking asynchronous code (via runner libraries like `co` or Babel transpilers):

- **Using Generators (Legacy Approach):**

```javascript
function* fetchData() {
  const res = yield fetch("/api");
  const data = yield res.json();
  return data;
}
```

- **Using `async/await` (Modern Standard):**

```javascript
async function fetchData() {
  const res = await fetch("/api");
  const data = await res.json();
  return data;
}
```

- `async/await` is syntactically clean syntactic sugar built directly on top of Promises and Generators.

---

### **Q92: What is the difference between the `await` keyword and the `yield` keyword?**

| Keyword     | Context                                                          | Behavior                                                                                                                                        |
| ----------- | ---------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| **`await`** | Must be used inside `async` functions (or top-level ES modules). | Pauses execution until a **Promise** resolves or rejects, returning the resolved value directly.                                                |
| **`yield`** | Must be used inside Generator functions (`function*`).           | Pauses execution and **returns a value back to the caller/iterator** (`{ value, done }`), waiting for the caller to invoke `.next()` to resume. |

---

We have completed all **Theoretical Questions (Q1 to Q92)** across your sets! Would you like to proceed to solving the **Code Challenges (Q1 to Q83)** next?

Here are the complete, step-by-step solutions for the first batch of **Code Challenges (Q1 to Q20)** from your screenshots.

---

### **Q1: Sum of Array Plus One**

**Problem:** Given an array of numbers (or arrays), return the sum of all elements plus 1 per element.

```javascript
function sumArrayPlusOne(arr) {
  return arr.reduce((acc, curr) => acc + curr + 1, 0);
}

// Example:
console.log(sumArrayPlusOne([1, 2, 3])); // (1+1) + (2+1) + (3+1) = 9
```

---

### **Q2: Lucky Sevens**

**Problem:** Write a function that takes an array of integers and returns `true` if any three consecutive elements sum up to 7.

```javascript
function luckySevens(arr) {
  if (arr.length < 3) return false;

  for (let i = 2; i < arr.length; i++) {
    if (arr[i - 2] + arr[i - 1] + arr[i] === 7) {
      return true;
    }
  }
  return false;
}

// Example:
console.log(luckySevens([2, 1, 5, 1, 0])); // true (1 + 5 + 1 = 7)
```

---

### **Q3: Explain how Bubble Sort works**

**Concept:** Bubble Sort repeatedly steps through the list, compares adjacent elements, and swaps them if they are in the wrong order. Pass after pass, the largest unsorted element "bubbles up" to its correct position at the end of the array.

- **Time Complexity:** $O(n^2)$ worst/average case, $O(n)$ best case (when already sorted).

---

### **Q4: String Rotation**

**Problem:** Given two strings `str1` and `str2`, check if `str2` is a rotation of `str1`.

```javascript
function isStringRotation(str1, str2) {
  if (str1.length !== str2.length || str1.length === 0) return false;
  // Concatenate str1 with itself; a rotated string will always be a substring
  return (str1 + str1).includes(str2);
}

// Example:
console.log(isStringRotation("javascript", "scriptjava")); // true
```

---

### **Q5: Oddball Sum**

**Problem:** Write a function that sums all odd numbers in an array.

```javascript
function oddballSum(arr) {
  return arr.reduce((sum, num) => (num % 2 !== 0 ? sum + num : sum), 0);
}

// Example:
console.log(oddballSum([1, 2, 3, 4, 5])); // 1 + 3 + 5 = 9
```

---

### **Q6: Test Divisors of Three**

**Problem:** Check if all numbers in an array are divisible by 3.

```javascript
function checkDivisorsOfThree(arr) {
  return arr.every((num) => num % 3 === 0);
}

// Example:
console.log(checkDivisorsOfThree([3, 6, 9, 12])); // true
```

---

### **Q7: Sum of Several Arrays**

**Problem:** Write a function that takes multiple arrays (or nested arrays) and returns the total sum of all numbers.

```javascript
function sumSeveralArrays(...arrays) {
  return arrays.flat(Infinity).reduce((acc, curr) => acc + curr, 0);
}

// Example:
console.log(sumSeveralArrays([1, 2], [3, 4], [5])); // 15
```

---

### **Q8: Simple Clock Angle**

**Problem:** Calculate the smaller angle between the hour hand and minute hand on an analog clock for a given time `num` (representing minutes or given as `hours` and `minutes`).

```javascript
function getClockAngle(hours, minutes) {
  // Hour hand moves 30 deg/hour + 0.5 deg/minute
  const hourAngle = (hours % 12) * 30 + minutes * 0.5;
  // Minute hand moves 6 deg/minute
  const minuteAngle = minutes * 6;

  let angle = Math.abs(hourAngle - minuteAngle);
  return Math.min(angle, 360 - angle);
}

// Example: 3:15
console.log(getClockAngle(3, 15)); // 7.5 degrees
```

---

### **Q9 & Q19: Implement a Queue using two Stacks**

**Concept:** Use two stacks (`stackIn` for enqueue, `stackOut` for dequeue).

```javascript
class QueueWithStacks {
  constructor() {
    this.stackIn = [];
    this.stackOut = [];
  }

  enqueue(val) {
    this.stackIn.push(val);
  }

  dequeue() {
    if (this.stackOut.length === 0) {
      while (this.stackIn.length > 0) {
        this.stackOut.push(this.stackIn.pop());
      }
    }
    return this.stackOut.pop() || null;
  }
}
```

---

### **Q10: Tree Level Order Print**

**Problem:** Perform a Breadth-First Search (BFS) on a binary tree and print values level by level.

```javascript
function levelOrderPrint(root) {
  if (!root) return [];
  const result = [];
  const queue = [root];

  while (queue.length > 0) {
    const levelSize = queue.length;
    const currentLevel = [];

    for (let i = 0; i < levelSize; i++) {
      const node = queue.shift();
      currentLevel.push(node.val);
      if (node.left) queue.push(node.left);
      if (node.right) queue.push(node.right);
    }
    result.push(currentLevel);
  }
  return result;
}
```

---

### **Q11: Stock Maximum Profit**

**Problem:** Find the maximum profit from buying and selling a stock given array prices (Best time to buy/sell stock).

```javascript
function maxProfit(prices) {
  let minPrice = Infinity;
  let maxProfit = 0;

  for (let price of prices) {
    if (price < minPrice) {
      minPrice = price;
    } else if (price - minPrice > maxProfit) {
      maxProfit = price - minPrice;
    }
  }
  return maxProfit;
}

// Example:
console.log(maxProfit([7, 1, 5, 3, 6, 4])); // 5 (Buy at 1, sell at 6)
```

---

### **Q12: Make this work**

**Classic Question:** Make `add(2)(3)` return `5`.

```javascript
function add(a) {
  return function (b) {
    return a + b;
  };
}

console.log(add(2)(3)); // 5
```

---

### **Q13: Two Sum Problem**

**Problem:** Find indices of two numbers in an array that add up to a target value.

```javascript
function twoSum(nums, target) {
  const map = new Map();
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (map.has(complement)) {
      return [map.get(complement), i];
    }
    map.set(nums[i], i);
  }
  return [];
}

// Example:
console.log(twoSum([2, 7, 11, 15], 9)); // [0, 1]
```

---

### **Q14: Given a string, reverse each word in the sentence**

```javascript
function reverseWords(sentence) {
  return sentence
    .split(" ")
    .map((word) => word.split("").reverse().join(""))
    .join(" ");
}

// Example:
console.log(reverseWords("Hello World")); // "olleH dlroW"
```

---

### **Q15: How to empty an array in JavaScript?**

Four common ways:

```javascript
let arr = [1, 2, 3, 4];

// Method 1 (Best performance / modifies original reference):
arr.length = 0;

// Method 2 (Reassignment):
arr = [];

// Method 3:
arr.splice(0, arr.length);

// Method 4:
while (arr.length) {
  arr.pop();
}
```

---

### **Q16: Explain what a callback function is and provide a simple example**

A **callback function** is a function passed into another function as an argument, which is then invoked inside the outer function to complete an action.

```javascript
function processUser(name, callback) {
  console.log(`Processing ${name}...`);
  callback();
}

processUser("Alice", () => console.log("Callback executed!"));
```

---

### **Q17: Determine overlapping numbers in ranges**

**Problem:** Given two range intervals `[a, b]` and `[c, d]`, check if they overlap and return the overlapping numbers.

```javascript
function getOverlap(range1, range2) {
  const start = Math.max(range1[0], range2[0]);
  const end = Math.min(range1[1], range2[1]);

  if (start > end) return []; // No overlap

  const overlap = [];
  for (let i = start; i <= end; i++) {
    overlap.push(i);
  }
  return overlap;
}

// Example:
console.log(getOverlap([1, 5], [3, 7])); // [3, 4, 5]
```

---

### **Q18: Write a "mul" function which will properly work when invoked as below syntax**

**Syntax:** `mul(2)(3)(4)` yields `24`.

```javascript
function mul(a) {
  return function (b) {
    return function (c) {
      return a * b * c;
    };
  };
}

console.log(mul(2)(3)(4)); // 24
```

---

### **Q20: How to check if an object is an array or not? Provide some code.**

```javascript
// Recommended Standard Way:
Array.isArray(obj);

// Alternative via Object prototype:
Object.prototype.toString.call(obj) === "[object Array]";
```

---

Shall we proceed directly to **Code Challenges Q21 to Q40** next?

Here are the complete, step-by-step solutions for **Code Challenges Q21 to Q40** from your JavaScript interview set.

---

### **Q21: Write a function that would allow you to do this? (`add(2)(3)`)**

_(A variation of partial application / currying)_

```javascript
function add(x) {
  return function (y) {
    return x + y;
  };
}

// Usage:
console.log(add(2)(3)); // 5
```

---

### **Q22: Find the missing number in $O(n)$ time**

**Problem:** Given an array containing $n$ distinct numbers taken from $0, 1, 2, \dots, n$, find the one that is missing.

```javascript
function findMissingNumber(nums) {
  const n = nums.length;
  // Sum formula for 0 to n: n * (n + 1) / 2
  const expectedSum = (n * (n + 1)) / 2;
  const actualSum = nums.reduce((sum, num) => sum + num, 0);

  return expectedSum - actualSum;
}

// Example:
console.log(findMissingNumber([3, 0, 1])); // 2
```

---

### **Q23: Step-by-step solution for step counting using recursion**

**Problem (Climbing Stairs):** You are climbing a staircase with $n$ steps. Each time you can take $1$ or $2$ steps. In how many distinct ways can you climb to the top?

```javascript
// Base cases: 1 step -> 1 way; 2 steps -> 2 ways
function countWays(n) {
  if (n <= 1) return 1;
  if (n === 2) return 2;

  // Recursive step: ways to reach (n-1) + ways to reach (n-2)
  return countWays(n - 1) + countWays(n - 2);
}

// Optimization with Memoization (to avoid O(2^n) time complexity):
function countWaysMemo(n, memo = {}) {
  if (n <= 1) return 1;
  if (n === 2) return 2;
  if (memo[n]) return memo[n];

  memo[n] = countWaysMemo(n - 1, memo) + countWaysMemo(n - 2, memo);
  return memo[n];
}
```

---

### **Q24: How would you check if a number is an integer?**

```javascript
// Method 1: Standard ES6 method
Number.isInteger(num);

// Method 2: Modulo division
function isInteger(num) {
  return typeof num === "number" && num % 1 === 0;
}
```

---

### **Q25 & Q27: Return the N-th value of the Fibonacci sequence in $O(n)$ time / Recursively**

- **$O(n)$ Time Iterative Approach:**

```javascript
function fibonacciIterative(n) {
  if (n <= 0) return 0;
  if (n === 1) return 1;

  let prev = 0,
    curr = 1;
  for (let i = 2; i <= n; i++) {
    let temp = prev + curr;
    prev = curr;
    curr = temp;
  }
  return curr;
}
```

- **Recursive Approach (with Memoization for $O(n)$ time):**

```javascript
function fibonacciRecursive(n, memo = {}) {
  if (n <= 0) return 0;
  if (n === 1) return 1;
  if (memo[n]) return memo[n];

  memo[n] = fibonacciRecursive(n - 1, memo) + fibonacciRecursive(n - 2, memo);
  return memo[n];
}
```

---

### **Q26: Implement Bubble Sort**

```javascript
function bubbleSort(arr) {
  const len = arr.length;
  let swapped;

  for (let i = 0; i < len; i++) {
    swapped = false;
    for (let j = 0; j < len - 1 - i; j++) {
      if (arr[j] > arr[j + 1]) {
        // Swap elements
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        swapped = true;
      }
    }
    if (!swapped) break; // Optimization: stop if array is already sorted
  }
  return arr;
}
```

---

### **Q28: Remove duplicates of an array and return an array of only unique elements**

```javascript
// Method 1: Using ES6 Set
function removeDuplicates(arr) {
  return [...new Set(arr)];
}

// Method 2: Using filter
function removeDuplicatesFilter(arr) {
  return arr.filter((item, index) => arr.indexOf(item) === index);
}
```

---

### **Q29: Explain how Insertion Sort works**

**Concept:** Insertion Sort builds the final sorted array one item at a time. It iterates through an input array, removes one element, and finds the location it belongs within the sorted portion of the array, shifting larger elements to the right.

```javascript
function insertionSort(arr) {
  for (let i = 1; i < arr.length; i++) {
    let key = arr[i];
    let j = i - 1;

    while (j >= 0 && arr[j] > key) {
      arr[j + 1] = arr[j];
      j--;
    }
    arr[j + 1] = key;
  }
  return arr;
}
```

---

### **Q30: FizzBuzz Challenge**

```javascript
function fizzBuzz(n) {
  for (let i = 1; i <= n; i++) {
    if (i % 15 === 0) console.log("FizzBuzz");
    else if (i % 3 === 0) console.log("Fizz");
    else if (i % 5 === 0) console.log("Buzz");
    else console.log(i);
  }
}
```

---

### **Q31: Check if a given string is a palindrome (Case sensitive)**

```javascript
function isPalindrome(str) {
  const reversed = str.split("").reverse().join("");
  return str === reversed;
}

// Example:
console.log(isPalindrome("racecar")); // true
console.log(isPalindrome("Racecar")); // false (case sensitive)
```

---

### **Q32: Find all string combinations consisting only of 0, 1, and ?**

**Problem:** Replace every `?` with both `0` and `1` recursively.

```javascript
function generateBinaryCombinations(str) {
  const results = [];

  function helper(currentStr, index) {
    if (index === currentStr.length) {
      results.push(currentStr);
      return;
    }

    if (currentStr[index] === "?") {
      // Branch 1: Replace with '0'
      helper(
        currentStr.substring(0, index) + "0" + currentStr.substring(index + 1),
        index + 1,
      );
      // Branch 2: Replace with '1'
      helper(
        currentStr.substring(0, index) + "1" + currentStr.substring(index + 1),
        index + 1,
      );
    } else {
      helper(currentStr, index + 1);
    }
  }

  helper(str, 0);
  return results;
}

// Example:
console.log(generateBinaryCombinations("1?0?")); // ["1000", "1001", "1100", "1101"]
```

---

### **Q33: Generate all balanced bracket combinations**

**Problem:** Generate all combinations of $n$ pairs of balanced parentheses.

```javascript
function generateParentheses(n) {
  const result = [];

  function backtrack(current, open, close) {
    if (current.length === 2 * n) {
      result.push(current);
      return;
    }

    if (open < n) backtrack(current + "(", open + 1, close);
    if (close < open) backtrack(current + ")", open, close + 1);
  }

  backtrack("", 0, 0);
  return result;
}

// Example:
console.log(generateParentheses(2)); // ["()()", "(())"]
```

---

### **Q34: Write a recursive function that returns the binary string of a given decimal number**

```javascript
function decimalToBinary(n) {
  if (n === 0) return "0";
  if (n === 1) return "1";

  return decimalToBinary(Math.floor(n / 2)) + (n % 2).toString();
}

// Example:
console.log(decimalToBinary(10)); // "1010"
```

---

### **Q35: Find the intersection of two arrays**

```javascript
function arrayIntersection(arr1, arr2) {
  const set1 = new Set(arr1);
  return [...new Set(arr2.filter((item) => set1.has(item)))];
}

// Example:
console.log(arrayIntersection([1, 2, 2, 1], [2, 2])); // [2]
```

---

### **Q36: How would you use a closure to create a private counter?**

```javascript
function createCounter() {
  let count = 0; // Private variable

  return {
    increment: function () {
      count++;
      return count;
    },
    decrement: function () {
      count--;
      return count;
    },
    getCount: function () {
      return count;
    },
  };
}

const counter = createCounter();
console.log(counter.increment()); // 1
console.log(counter.increment()); // 2
console.log(counter.getCount()); // 2
```

---

### **Q37: Given two strings, return true if they are anagrams of one another**

```javascript
function isAnagram(str1, str2) {
  if (str1.length !== str2.length) return false;

  const normalize = (str) => str.toLowerCase().split("").sort().join("");
  return normalize(str1) === normalize(str2);
}

// Example:
console.log(isAnagram("listen", "silent")); // true
```

---

### **Q38 & Q43: All Permutations (Anagrams) of a String**

```javascript
function getPermutations(str) {
  if (str.length <= 1) return [str];

  const permutations = [];
  for (let i = 0; i < str.length; i++) {
    const char = str[i];
    const remaining = str.slice(0, i) + str.slice(i + 1);

    for (let subPerm of getPermutations(remaining)) {
      permutations.push(char + subPerm);
    }
  }
  return [...new Set(permutations)]; // Remove duplicates
}

// Example:
console.log(getPermutations("abc")); // ["abc", "acb", "bac", "bca", "cab", "cba"]
```

---

### **Q39: Maximum Difference in Array (Lesser index comes before greater element)**

**Problem:** Best Time to Buy and Sell Stock variation.

```javascript
function maxDifference(arr) {
  let minElement = arr[0];
  let maxDiff = -1;

  for (let i = 1; i < arr.length; i++) {
    if (arr[i] > minElement) {
      maxDiff = Math.max(maxDiff, arr[i] - minElement);
    } else {
      minElement = arr[i];
    }
  }
  return maxDiff;
}

// Example:
console.log(maxDifference([2, 3, 10, 6, 4, 8, 1])); // 8 (10 - 2)
```

---

### **Q40: Implement a Queue using a Linked List**

```javascript
class Node {
  constructor(value) {
    this.value = value;
    this.next = null;
  }
}

class LinkedListQueue {
  constructor() {
    this.head = null;
    this.tail = null;
    this.size = 0;
  }

  enqueue(val) {
    const newNode = new Node(val);
    if (!this.head) {
      this.head = newNode;
      this.tail = newNode;
    } else {
      this.tail.next = newNode;
      this.tail = newNode;
    }
    this.size++;
  }

  dequeue() {
    if (!this.head) return null;
    const removedVal = this.head.value;
    this.head = this.head.next;
    if (!this.head) this.tail = null;
    this.size--;
    return removedVal;
  }
}
```

---

Ready to move forward to **Code Challenges Q41 to Q65** next?

Here are the complete, step-by-step solutions for **Code Challenges Q41 to Q65** from your JavaScript interview set.

---

### **Q41: Check if parentheses are balanced using Stack**

```javascript
function isBalancedParentheses(str) {
  const stack = [];
  const map = { "(": ")", "{": "}", "[": "]" };

  for (let char of str) {
    if (map[char]) {
      stack.push(char); // Push opening brackets
    } else if (char === ")" || char === "}" || char === "]") {
      const last = stack.pop();
      if (map[last] !== char) return false;
    }
  }
  return stack.length === 0;
}

// Example:
console.log(isBalancedParentheses("{[()]}")); // true
console.log(isBalancedParentheses("{[(])}")); // false
```

---

### **Q42: Quickly calculate the cube root of 6-digit numbers**

**Interview Trick Solution:** For exact 6-digit integer cubes (e.g., $103,823$):

1. **Ten's Digit:** Look at the thousands portion ($103$). Since $4^3 = 64$ and $5^3 = 125$, the tens digit is **4**.
2. **Unit's Digit:** The last digit of $103,823$ is $3$. Only numbers ending in $7$ produce cubes ending in $3$ ($7^3 = 343$). Thus, the unit's digit is **7**.

- **Result:** $\sqrt[3]{103823} = 47$.

**JavaScript Code Solution:**

```javascript
function quickCubeRoot(num) {
  return Math.cbrt(num); // Or Math.round(Math.pow(num, 1/3))
}
```

---

### **Q44: Implement `pow(a, b)` without multiplication or division**

```javascript
function pow(a, b) {
  if (b === 0) return 1;

  function multiply(x, y) {
    let result = 0;
    for (let i = 0; i < Math.abs(y); i++) {
      result += Math.abs(x);
    }
    return (x < 0) ^ (y < 0) ? -result : result;
  }

  let answer = a;
  for (let i = 1; i < b; i++) {
    answer = multiply(answer, a);
  }
  return answer;
}

// Example:
console.log(pow(2, 3)); // 8
```

---

### **Q45: Write a program for Recursive Binary Search**

```javascript
function recursiveBinarySearch(arr, target, left = 0, right = arr.length - 1) {
  if (left > right) return -1;

  const mid = Math.floor((left + right) / 2);

  if (arr[mid] === target) return mid;
  if (arr[mid] > target)
    return recursiveBinarySearch(arr, target, left, mid - 1);
  return recursiveBinarySearch(arr, target, mid + 1, right);
}

// Example:
console.log(recursiveBinarySearch([1, 3, 5, 7, 9], 7)); // 3
```

---

### **Q46: Provide some examples of non-boolean value coercion to a boolean one**

Values coerced to `false` (**Falsy values**): `0`, `""` (empty string), `null`, `undefined`, `NaN`, `-0`, `0n`.
All other values are coerced to `true` (**Truthy values**), including `[]` and `{}`.

```javascript
console.log(Boolean("hello")); // true
console.log(Boolean(0)); // false
console.log(Boolean([])); // true
console.log(Boolean(null)); // false
```

---

### **Q47: How to merge two sorted Arrays into a Sorted Array?**

```javascript
function mergeSortedArrays(arr1, arr2) {
  const merged = [];
  let i = 0,
    j = 0;

  while (i < arr1.length && j < arr2.length) {
    if (arr1[i] < arr2[j]) {
      merged.push(arr1[i++]);
    } else {
      merged.push(arr2[j++]);
    }
  }

  return merged.concat(arr1.slice(i)).concat(arr2.slice(j));
}

// Example:
console.log(mergeSortedArrays([1, 3, 5], [2, 4, 6])); // [1, 2, 3, 4, 5, 6]
```

---

### **Q48: How would you read files in sequence in Node.js? Provide a code example**

Using modern Node.js `fs/promises` with `async/await`:

```javascript
const fs = require("fs/promises");

async function readFilesSequentially(filePaths) {
  for (const filePath of filePaths) {
    try {
      const data = await fs.readFile(filePath, "utf-8");
      console.log(`Contents of ${filePath}:\n`, data);
    } catch (err) {
      console.error(`Error reading ${filePath}:`, err);
    }
  }
}
```

---

### **Q49: LIS: Find length of the longest increasing subsequence in the array using Dynamic Programming**

```javascript
function lengthOfLIS(nums) {
  if (nums.length === 0) return 0;
  const dp = new Array(nums.length).fill(1);

  for (let i = 1; i < nums.length; i++) {
    for (let j = 0; j < i; j++) {
      if (nums[i] > nums[j]) {
        dp[i] = Math.max(dp[i], dp[j] + 1);
      }
    }
  }
  return Math.max(...dp);
}

// Example:
console.log(lengthOfLIS([10, 9, 2, 5, 3, 7, 101, 18])); // 4 ([2, 3, 7, 101])
```

---

### **Q50 & Q51: Heap Sort vs Merge Sort**

- **Heap Sort ($O(n \log n)$ time, $O(1)$ space):**
  Builds a Max-Heap from the input array, then repeatedly extracts the maximum element from the heap and places it at the end of the array.
- **Merge Sort ($O(n \log n)$ time, $O(n)$ space):**
  A Divide-and-Conquer algorithm that divides the array into half, recursively sorts both halves, and merges the two sorted halves back together.

---

### **Q52: Get the N-th Fibonacci number with $O(n)$ time and $O(1)$ space complexity**

```javascript
function fibConstantSpace(n) {
  if (n <= 0) return 0;
  if (n === 1) return 1;

  let a = 0,
    b = 1;
  for (let i = 2; i <= n; i++) {
    let c = a + b;
    a = b;
    b = c;
  }
  return b;
}
```

---

### **Q54: Insert an interval into a list of sorted disjoint intervals**

```javascript
function insertInterval(intervals, newInterval) {
  const result = [];
  let i = 0;

  // 1. Add all intervals ending before newInterval starts
  while (i < intervals.length && intervals[i][1] < newInterval[0]) {
    result.push(intervals[i++]);
  }

  // 2. Merge overlapping intervals
  while (i < intervals.length && intervals[i][0] <= newInterval[1]) {
    newInterval[0] = Math.min(newInterval[0], intervals[i][0]);
    newInterval[1] = Math.max(newInterval[1], intervals[i][1]);
    i++;
  }
  result.push(newInterval);

  // 3. Add remaining intervals
  while (i < intervals.length) {
    result.push(intervals[i++]);
  }

  return result;
}

// Example:
console.log(
  insertInterval(
    [
      [1, 3],
      [6, 9],
    ],
    [2, 5],
  ),
); // [[1, 5], [6, 9]]
```

---

### **Q57: Throttle Function Implementation**

Ensures a function is invoked at most once per specified time period (`delay`).

```javascript
function throttle(fn, delay) {
  let lastCall = 0;
  return function (...args) {
    const now = Date.now();
    if (now - lastCall >= delay) {
      lastCall = now;
      fn.apply(this, args);
    }
  };
}
```

---

### **Q58: Given an array of integers, find the largest product yielded from three of the integers**

```javascript
function maximumProductOfThree(nums) {
  nums.sort((a, b) => a - b);
  const n = nums.length;

  // Either product of 3 largest positive numbers, OR 2 smallest negatives * largest positive
  const option1 = nums[n - 1] * nums[n - 2] * nums[n - 3];
  const option2 = nums[0] * nums[1] * nums[n - 1];

  return Math.max(option1, option2);
}

// Example:
console.log(maximumProductOfThree([-10, -10, 5, 2])); // 500 (-10 * -10 * 5)
```

---

### **Q59: Find Word Positions in Text**

```javascript
function findWordPositions(text, word) {
  const regex = new RegExp(`\\b${word}\\b`, "gi");
  const positions = [];
  let match;

  while ((match = regex.exec(text)) !== null) {
    positions.push(match.index);
  }
  return positions;
}

// Example:
console.log(
  findWordPositions("the quick brown fox jumps over the lazy dog", "the"),
); // [0, 31]
```

---

### **Q61: Dutch National Flag Sorting Problem**

**Problem:** Sort an array consisting only of 0s, 1s, and 2s in $O(n)$ time and $O(1)$ space.

```javascript
function sortColors(nums) {
  let low = 0,
    mid = 0,
    high = nums.length - 1;

  while (mid <= high) {
    if (nums[mid] === 0) {
      [nums[low], nums[mid]] = [nums[mid], nums[low]];
      low++;
      mid++;
    } else if (nums[mid] === 1) {
      mid++;
    } else {
      // nums[mid] === 2
      [nums[mid], nums[high]] = [nums[high], nums[mid]];
      high--;
    }
  }
  return nums;
}

// Example:
console.log(sortColors([2, 0, 2, 1, 1, 0])); // [0, 0, 1, 1, 2, 2]
```

---

### **Q62: Merge two sorted linked lists**

```javascript
function mergeTwoLists(l1, l2) {
  const dummy = new Node(0);
  let current = dummy;

  while (l1 !== null && l2 !== null) {
    if (l1.value < l2.value) {
      current.next = l1;
      l1 = l1.next;
    } else {
      current.next = l2;
      l2 = l2.next;
    }
    current = current.next;
  }

  current.next = l1 !== null ? l1 : l2;
  return dummy.next;
}
```

---

### **Q64: Given an integer, determine if it is a power of 2. If so, return that number, else return -1**

```javascript
function powerOfTwoCheck(n) {
  if (n > 0 && (n & (n - 1)) === 0) {
    return n;
  }
  return -1;
}

// Example:
console.log(powerOfTwoCheck(16)); // 16
console.log(powerOfTwoCheck(18)); // -1
```

---

Ready to complete the final set of **Code Challenges (Q66 to Q83)**?
Here are the step-by-step solutions for the final set of **Code Challenges (Q66 to Q83)** from your JavaScript interview screenshots.

---

### **Q66: What is Closure in JavaScript? Provide an example**

A **closure** is a function combined with references to its outer lexical scope, allowing the inner function to access variables from its outer function even after the outer function has finished executing.

```javascript
function outer() {
  const secret = "React & JS Interview";
  return function inner() {
    console.log(secret); // Retains access to `secret`
  };
}

const myClosure = outer();
myClosure(); // Output: "React & JS Interview"
```

---

### **Q67: How would you create a private variable in JavaScript?**

- **Method 1: Closure (Traditional)**

```javascript
function createSecret() {
  let _privateVar = "hidden";
  return {
    getSecret: () => _privateVar,
  };
}
```

- **Method 2: Native Class Private Fields (Modern ES2022+)**

```javascript
class BankAccount {
  #balance = 100; // Native private field using `#`

  getBalance() {
    return this.#balance;
  }
}
```

---

### **Q68: Create a function that will evaluate if a given expression has balanced parentheses using stacks**

_(See Q41 implementation above using a Stack structure)._

---

### **Q69: When would you use the `bind` function?**

Use `Function.prototype.bind()` when you want to pass a function around as a callback while explicitly preserving its original `this` context (e.g., event listeners or timer callbacks inside class methods).

```javascript
class ButtonHandler {
  constructor() {
    this.label = "Submit";
  }

  click() {
    console.log(`Clicked ${this.label}`);
  }
}

const handler = new ButtonHandler();
// Bind 'handler' so 'this.label' isn't undefined inside event callbacks:
document.addEventListener("click", handler.click.bind(handler));
```

---

### **Q70: Write a recursive function that performs a binary search**

```javascript
function recursiveBinarySearch(arr, target, low = 0, high = arr.length - 1) {
  if (low > high) return -1; // Base case: target not found

  const mid = Math.floor((low + high) / 2);

  if (arr[mid] === target) return mid;
  if (arr[mid] > target) {
    return recursiveBinarySearch(arr, target, low, mid - 1);
  }
  return recursiveBinarySearch(arr, target, mid + 1, high);
}
```

---

### **Q71: Explain when and how to use Exponential (Galloping) Search**

- **When to use:** On **sorted, unbounded, or infinite lists** (like streams where list length is unknown ahead of time).
- **How it works:**

1. Find a range $[2^{k-1}, 2^k]$ where the target lies by doubling indices ($1, 2, 4, 8, 16\dots$).
2. Perform a standard **Binary Search** within that bound interval.

- **Time Complexity:** $O(\log i)$, where $i$ is the position of the target element.

---

### **Q72: Explain what is Fibonacci Search technique?**

A search technique for **sorted arrays** that uses Fibonacci numbers to calculate split probe indices (instead of dividing array sizes equally by 2 like Binary Search).

- **Advantage:** Performs only addition and subtraction operations rather than division or bit-shifting, making it optimized on low-power hardware systems without fast hardware division circuits.

---

### **Q73: Calculate n-th Fibonacci number using Tail Recursion**

Tail recursion allows JavaScript engines with **Tail Call Optimization (TCO)** to execute recursive functions in $O(1)$ stack space.

```javascript
function fibTailRecursive(n, a = 0, b = 1) {
  if (n === 0) return a;
  if (n === 1) return b;
  return fibTailRecursive(n - 1, b, a + b); // Tail call position
}

console.log(fibTailRecursive(10)); // 55
```

---

### **Q74: Explain how QuickSort works**

**Concept:** QuickSort is a Divide-and-Conquer sorting algorithm.

1. Pick an element as a **pivot** (e.g., last element).
2. **Partitioning:** Rearrange the array so elements smaller than the pivot go to the left, and elements greater go to the right.
3. Recursively apply QuickSort to the left and right sub-arrays.

- **Time Complexity:** $O(n \log n)$ average, $O(n^2)$ worst case.

---

### **Q75: Binet's formula: How to calculate Fibonacci numbers without Recursion or Iteration?**

Binet's formula calculates the $n$-th Fibonacci number directly in $O(1)$ time using the Golden Ratio ($\phi$):

$$\text{Fib}(n) = \frac{\phi^n - \psi^n}{\sqrt{5}} \quad \text{where } \phi = \frac{1 + \sqrt{5}}{2} \text{ and } \psi = \frac{1 - \sqrt{5}}{2}$$

```javascript
function fibBinet(n) {
  const phi = (1 + Math.sqrt(5)) / 2;
  return Math.round(Math.pow(phi, n) / Math.sqrt(5));
}

console.log(fibBinet(10)); // 55
```

---

### **Q76: Explain how Radix Sort works**

**Concept:** Radix Sort is a non-comparative sorting algorithm for integers. It groups keys by individual digits sharing the same position/significant place (Least Significant Digit (LSD) to Most Significant Digit (MSD)) using Counting Sort as a stable subroutine.

- **Time Complexity:** $O(d \cdot (n + k))$, where $d$ is the number of digits and $k$ is the base range.

---

### **Q77: How to recursively reverse a Linked List?**

```javascript
function reverseListRecursive(head) {
  // Base case: empty list or single node
  if (!head || !head.next) return head;

  const reversedSubListHead = reverseListRecursive(head.next);
  head.next.next = head; // Point next node back to current node
  head.next = null; // Break old forward link

  return reversedSubListHead;
}
```

---

### **Q78: How to use Memoization for N-th Fibonacci number?**

Memoization caches the output of function calls based on inputs to avoid duplicate subproblem computations:

```javascript
function memoizedFib() {
  const cache = {};

  return function fib(n) {
    if (n in cache) return cache[n];
    if (n <= 0) return 0;
    if (n === 1) return 1;

    cache[n] = fib(n - 1) + fib(n - 2);
    return cache[n];
  };
}

const getFib = memoizedFib();
console.log(getFib(50)); // Fast calculation without call stack overflow
```

---

### **Q79: Explain why the following doesn't work as an IIFE. What needs to be changed to properly make it an IIFE?**

**Invalid Syntax:**

```javascript
function foo() {}(); // SyntaxError: Unexpected token ')'

```

- **Why it fails:** The JS parser interprets `function foo() {}` as a standard Function Declaration. The trailing `()` is viewed as an invalid empty grouping operator syntax.
- **Fix:** Wrap the declaration inside parentheses to force the parser to evaluate it as a Function Expression:

```javascript
(function foo() {
  console.log("Valid IIFE!");
})();
```

---

### **Q80, Q81, Q82: Code Output Analysis Tricks**

- **Output Code Pattern 1 (Scope & Hoisting):**

```javascript
var x = 10;
function test() {
  console.log(x);
  var x = 20;
}
test(); // Output: undefined (due to variable hoisting inside `test`)
```

- **Output Code Pattern 2 (Loop Closures with `var` vs `let`):**

```javascript
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 100);
}
// Output: 3, 3, 3 (because `var` is function-scoped)

for (let j = 0; j < 3; j++) {
  setTimeout(() => console.log(j), 100);
}
// Output: 0, 1, 2 (because `let` creates a new block scope per iteration)
```

---

### **Q83: How does the `this` keyword work? Provide some code examples**

`this` refers to the object executing the current function:

1. **Implicit Binding (Method Call):**

```javascript
const obj = {
  name: "Alice",
  greet() {
    console.log(this.name);
  },
};
obj.greet(); // "Alice"
```

2. **Explicit Binding (`call`, `apply`, `bind`):**

```javascript
function greet() {
  console.log(this.name);
}
greet.call({ name: "Bob" }); // "Bob"
```

3. **Arrow Function (Lexical `this`):**

```javascript
const obj2 = {
  name: "Charlie",
  delayedGreet() {
    setTimeout(() => console.log(this.name), 100); // Inherits `this` from delayedGreet
  },
};
obj2.delayedGreet(); // "Charlie"
```

---

You have now gone through every single standard theoretical question and hands-on coding challenge from your interview prep set! Best of luck with your interviews!
