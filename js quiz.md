Here are the explanations for the questions you asked:

### 1. **What is the difference between 'Pass by Value' and 'Pass by Reference'?**

- **Pass by Value**: When a variable is passed to a function, a copy of the value is passed. Changes made to the parameter inside the function do not affect the original variable.
- **Pass by Reference**: When a variable is passed, the reference (memory address) of the variable is passed. Changes made to the parameter inside the function affect the original variable.

### 2. **What is the difference between `map` and `filter`?**

- **`map`**: Transforms each element in an array into a new array based on a function. It always returns a new array of the same length.
- **`filter`**: Creates a new array containing only the elements that pass a test defined by a function. It may return a smaller array or an empty array.

### 3. **What is the difference between `map()` and `forEach()`?**

- **`map()`**: Returns a new array after applying a function to each element. It can be chained.
- **`forEach()`**: Executes a function on each element of the array but does not return anything. It cannot be chained.

### 4. **What is the difference between Pure and Impure functions?**

- **Pure Function**: Given the same input, always returns the same output and has no side effects (does not alter any external state).
- **Impure Function**: May produce different outputs for the same inputs, or it may alter external states (e.g., modifying a global variable).

### 5. **What is the difference between `for-in` and `for-of`?**

- **`for-in`**: Loops over the keys (property names) of an object.
- **`for-of`**: Loops over the values of an iterable (like arrays, strings, etc.).

### 6. **What are the differences between `call()`, `apply()`, and `bind()`?**

- **`call()`**: Invokes a function immediately, setting `this` and passing arguments individually.
- **`apply()`**: Similar to `call()`, but passes arguments as an array.
- **`bind()`**: Returns a new function with a specified `this` value and optional arguments, but does not execute immediately.

### 7. **List out some key features of ES6?**

- Arrow functions
- Classes and inheritance
- Template literals
- Destructuring
- Default parameters
- Promises
- `let` and `const` for block-scoped variables
- Modules (`import`/`export`)
- `Map`, `Set`, `WeakMap`, and `WeakSet`

### 8. **What’s the spread operator in JavaScript?**

- The spread operator (`...`) allows you to expand elements of an array or object into individual elements. It is used in function calls, array literals, and object literals.

### 9. **What is the rest operator in JavaScript?**

- The rest operator (`...`) is used to collect multiple elements into a single array. It is used in function parameters to capture all remaining arguments into an array.

### 10. **What are DRY, KISS, YAGNI, SOLID Principles?**

- **DRY**: Don't Repeat Yourself - Avoid duplication of code.
- **KISS**: Keep It Simple, Stupid - Keep the code simple and readable.
- **YAGNI**: You Aren't Gonna Need It - Only implement features when they are needed.
- **SOLID**: A set of five object-oriented design principles:
  1.  Single Responsibility
  2.  Open/Closed
  3.  Liskov Substitution
  4.  Interface Segregation
  5.  Dependency Inversion

### 11. **What is Temporal Dead Zone?**

- The Temporal Dead Zone (TDZ) refers to the time between the entering of a scope (e.g., a block) and the variable’s declaration, during which accessing the variable results in a `ReferenceError`.

### 12. **Different ways to create objects in JavaScript?**

- Object literal: `const obj = {};`
- Constructor function: `function Person() {}`
- `Object.create()`: `const obj = Object.create(proto);`
- ES6 class: `class Person {}`

### 13. **What’s the difference between `Object.keys`, `values`, and `entries`?**

- **`Object.keys()`**: Returns an array of the object's keys.
- **`Object.values()`**: Returns an array of the object's values.
- **`Object.entries()`**: Returns an array of key-value pairs (arrays) from the object.

### 14. **What’s the difference between `Object.freeze()` vs `Object.seal()`?**

- **`Object.freeze()`**: Prevents new properties from being added and existing properties from being modified or deleted.
- **`Object.seal()`**: Prevents new properties from being added and existing properties from being deleted, but allows modification of existing property values.

### 15. **What is a polyfill in JavaScript?**

- A polyfill is a piece of code (usually a function) that implements features that are not natively supported by some browsers.

### 16. **What is a generator function in JavaScript?**

- A generator function is a function that can be paused and resumed. It is defined using the `function*` syntax and uses `yield` to return values.

### 17. **What is a prototype in JavaScript?**

- A prototype is an object from which another object can inherit properties and methods. Every JavaScript object has a prototype.

### 18. **What is IIFE?**

- IIFE (Immediately Invoked Function Expression) is a function that is defined and executed immediately. It is often used to create a local scope and avoid polluting the global namespace.

### 19. **What is CORS?**

- CORS (Cross-Origin Resource Sharing) is a security feature that allows or restricts web applications from making requests to a domain different from the one that served the web page.

### 20. **What are the different data types in JavaScript?**

- **Primitive**: `string`, `number`, `bigint`, `boolean`, `undefined`, `null`, `symbol`
- **Non-primitive (Reference types)**: `object`, `array`, `function`

Did you know JavaScript lets you call methods directly on primitive values like strings, numbers, or booleans?

For example:
• "hello".toUpperCase()
• (42).toFixed(2)
• (true).toString()

But how does this work? You’re not directly working with objects here!

This magic happens thanks to Autoboxing—a fascinating feature in JavaScript that you’ve probably used countless times without even realizing it.

**What is Autoboxing?**

Autoboxing is the automatic conversion of primitive values (like strings, numbers, or booleans) into their respective object wrappers when you access methods or properties on them. This allows primitives to temporarily behave like objects.

**Object Wrappers in JavaScript​:**

• String (e.g., "text".includes("t"))
• Number (e.g., (100).toExponential())
• Boolean (e.g., (false).valueOf())

For example:
When you write "abc".length, JavaScript wraps the string "abc" in a String object behind the scenes, making the length property accessible.

### 21. **What are the differences between TypeScript and JavaScript?**

- **TypeScript**: A superset of JavaScript with static typing, interfaces, and other advanced features. It compiles to JavaScript.
- **JavaScript**: A dynamically typed language, often used directly in the browser or Node.js without the need for compilation.

### 22. **What is authentication vs authorization?**

- **Authentication**: The process of verifying the identity of a user (e.g., login).
- **Authorization**: The process of determining if the authenticated user has permission to access a resource.

### 23. **Difference between null and undefined?**

- **`null`**: Represents the intentional absence of a value.
- **`undefined`**: Represents an uninitialized variable or missing value.

### 24. **What is the output of `3+2+”7”`?**

- The output is `"57"` because the `+` operator first adds `3` and `2` to get `5`, then it concatenates `"5"` with the string `"7"`.

### 25. **Slice vs Splice in JavaScript?**

- **`slice()`**: Returns a shallow copy of a portion of an array, does not modify the original array.
- **`splice()`**: Changes the content of an array by removing or replacing elements, and/or adding new elements.

### 26. **What is destructuring?**

- Destructuring is a syntax that allows unpacking values from arrays or properties from objects into distinct variables.

### 27. **What is `setTimeout` in JavaScript?**

- `setTimeout` is used to execute a function after a specified delay.

### 28. **What is `setInterval` in JavaScript?**

- `setInterval` repeatedly executes a function at a specified interval.

### 29. **What are Promises in JavaScript?**

- A Promise represents an eventual completion or failure of an asynchronous operation and its resulting value.

### 30. **What is a callstack in JavaScript?**

- The call stack is a data structure that stores function calls. When a function is invoked, it is added to the stack, and when it completes, it is removed.

### 31. **What is a closure?**

- A closure is a function that retains access to its lexical scope (variables from its outer function) even after the outer function has finished executing.

### 32. **What are callbacks in JavaScript?**

- A callback is a function passed into another function as an argument and executed after a task is completed.

### 33. **What are Higher Order Functions in JavaScript?**

- Higher-order functions are functions that take other functions as arguments or return functions as their result.

### 34. **What is the difference between `==` and `===` in JavaScript?**

- **`==`**: Compares values for equality, performing type coercion if necessary.
- **`===`**: Compares both value and type, without type coercion.

### 35. **Is JavaScript a dynamically typed language or a statically typed language?**

- **JavaScript** is dynamically typed, meaning types are determined at runtime.

### 36. **What is the difference between IndexedDB and sessionStorage?**

- **IndexedDB**: A low-level API for storing large amounts of structured data, supports querying and transactions.
- **sessionStorage**: Stores data for the duration of the page session (until the tab is closed).

### 37. **What are Interceptors?**

- Interceptors are functions that allow you to intercept and modify requests or responses in HTTP requests, often used in APIs like Axios.

### 38. **What is Hoisting?**

- Hoisting is JavaScript's behavior of moving declarations to the top of their containing scope during compilation.

### 39. **What are the differences between `let`, `var`, and `const`?**

- **`var`**: Function-scoped, can be redeclared and updated.
- **`let`**: Block-scoped, can be updated but not redeclared in the same scope.
- **`const`**: Block-scoped, cannot be updated or redeclared.

### 40. **Differences between `Promise.all`, `allSettled`, `any`, `race`?**

- **`Promise.all()`**: Resolves when all promises resolve, or rejects if any promise rejects.
- **`allSettled()`**: Resolves when all promises settle (either resolve or reject).
- **`any()`**: Resolves when any one promise resolves, rejects if all promises reject.
- **`race()`**: Resolves when the first promise settles (resolves or rejects).

### 41. **What are limitations of arrow functions?**

- Cannot be used as constructors.
- Do not have their own `this` context (inherits from the surrounding scope).
- Cannot be used with `new`.

### 42. **What is the difference between `find` and `findIndex`?**

- **`find()`**: Returns the first element that satisfies the provided condition.
- **`findIndex()`**: Returns the index of the first element that satisfies the provided condition.

### 43. **What is tree shaking in JavaScript?**

- Tree shaking is a process of removing unused code during the bundling process, improving performance.

### 44. **What is the main difference between Local Storage and Session Storage?**

- **Local Storage**: Stores data with no expiration date, persists across sessions.
- **Session Storage**: Stores data for the duration of the page session (until the tab is closed).

### 45. **What is `eval()`?**

- `eval()` executes a string of JavaScript code in the current scope.

### 46. **What is the difference between Shallow copy and deep copy?**

- **Shallow copy**: Creates a new object, but nested objects are still references to the original objects.
- **Deep copy**: Creates a new object and recursively copies all nested objects.

### 47. **What are the differences between undeclared and undefined variables?**

- **Undeclared**: A variable that has been used without being declared.
- **Undefined**: A variable that has been declared but not assigned a value.

### 48. **What is event bubbling?**

- Event bubbling is when an event starts from the innermost element and propagates outward to the root.

### 49. **What is event capturing?**

- Event capturing is when an event starts from the outermost element and propagates inward.

### 50. **What are cookies?**

- Cookies are small pieces of data stored by the browser, often used for session management, personalization, and tracking.

### 51. **`typeof` operator?**

- `typeof` is used to determine the data type of a variable.

### 52. **What is `this` in JavaScript, and how does it behave in various scenarios?**

- `this` refers to the object in which the current function is executing. Its value depends on how the function is invoked: it can refer to the global object, an object method, or be bound explicitly.

### 53. **How do you optimize the performance of an application?**

- Reduce DOM manipulation, use lazy loading, minify assets, optimize images, and use caching.

### 54. **What is meant by debouncing and throttling?**

- **Debouncing**: Delays the execution of a function until after a specified time has passed since the last invocation.
- **Throttling**: Ensures that a function is executed at most once within a specified time interval.
