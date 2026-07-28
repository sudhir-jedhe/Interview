Here are answers to your questions:

### 1. What is the difference between `slice()` and `splice()` in JavaScript?

- **`slice()`**:
  - Does not modify the original array.
  - Creates a shallow copy of a portion of an array, selected from a start index to an end index.
  - Syntax: `array.slice(startIndex, endIndex)`
  - Returns a new array with the extracted portion.

- **`splice()`**:
  - Modifies the original array.
  - Used to add, remove, or replace elements from an array.
  - Syntax: `array.splice(startIndex, deleteCount, item1, item2, ...)`
  - Returns an array of removed elements (if any).

### 2. What is `setTimeout()` in JavaScript?

`setTimeout()` is a function that executes a specified function or code block after a delay in milliseconds.

Syntax:

```javascript
setTimeout(callback, delay);
```

- `callback`: The function to execute.
- `delay`: The time (in milliseconds) before the function is executed.

Example:

```javascript
setTimeout(() => {
  console.log("Executed after 2 seconds");
}, 2000);
```

### 3. What is `setInterval()` in JavaScript?

`setInterval()` is similar to `setTimeout()`, but it repeatedly executes a function at specified intervals (in milliseconds).

Syntax:

```javascript
setInterval(callback, interval);
```

- `callback`: The function to execute.
- `interval`: The time (in milliseconds) between each function execution.

Example:

```javascript
setInterval(() => {
  console.log("This will repeat every 3 seconds");
}, 3000);
```

### 4. What is a call stack in JavaScript?

A **call stack** is a mechanism that keeps track of function calls in JavaScript. It’s a stack data structure where functions are added when they are invoked and removed once they complete.

- **Function Invocation**: Each time a function is called, it's pushed onto the stack.
- **Function Execution**: The function at the top of the stack is executed.
- **Function Completion**: Once a function finishes executing, it’s popped from the stack.

### 5. What is a closure, and how does it work?

A **closure** is a function that "remembers" its lexical scope, even when the function is executed outside that scope.

- A closure allows a function to access variables from its outer (enclosing) function even after the outer function has finished execution.

Example:

```javascript
function outer() {
  let count = 0;
  return function inner() {
    count++;
    console.log(count);
  };
}

const counter = outer();
counter(); // 1
counter(); // 2
```

### 6. What are higher-order functions in JavaScript?

A **higher-order function** is a function that either:

1. Takes one or more functions as arguments.
2. Returns a function as its result.

Examples: `map()`, `filter()`, and `reduce()` are higher-order functions in JavaScript.

### 7. Explain the difference between `null` and `undefined`.

- **`null`**: A deliberate assignment of "no value" or "empty value" to a variable. It is an object.

  ```javascript
  let value = null;
  ```

- **`undefined`**: A variable that has been declared but not assigned a value. It’s the default value for uninitialized variables.
  ```javascript
  let value;
  console.log(value); // undefined
  ```

### 8. What is event bubbling in JavaScript?

**Event bubbling** is a type of event propagation in the DOM. When an event occurs on an element, it bubbles up from the target element to the root of the DOM tree, triggering any listeners attached to the ancestors of the target element.

Example: If you click on a button inside a div, the event will first trigger the button's event listener, then the div’s event listener (and so on).

### 9. What is event capturing in JavaScript?

**Event capturing** is the opposite of event bubbling. In event capturing, the event is triggered on the outermost element first (root of the DOM) and then propagates down to the target element.

### 10. What are the differences between shallow copy and deep copy?

- **Shallow Copy**: Creates a copy of the object, but nested objects are still references to the original objects.
- **Deep Copy**: Creates a fully independent copy of the object, including nested objects.

Example:

```javascript
const obj1 = { a: 1, b: { c: 2 } };
const shallowCopy = { ...obj1 };
shallowCopy.b.c = 3;
console.log(obj1.b.c); // 3 (shallow copy modified the original object)
```

### 11. What is the difference between `find()` and `findIndex()`?

- **`find()`**: Returns the first element that satisfies the condition.

  ```javascript
  const arr = [1, 2, 3];
  const found = arr.find((element) => element > 2); // 3
  ```

- **`findIndex()`**: Returns the index of the first element that satisfies the condition.
  ```javascript
  const arr = [1, 2, 3];
  const index = arr.findIndex((element) => element > 2); // 2
  ```

### 12. What is the `typeof` operator in JavaScript?

The `typeof` operator returns a string indicating the type of a variable or expression.

Example:

```javascript
typeof 42; // "number"
typeof "hello"; // "string"
typeof true; // "boolean"
typeof undefined; // "undefined"
```

### 13. How does `this` behave in different JavaScript contexts?

- **Global context**: `this` refers to the global object (`window` in browsers).
- **Inside a function**: In non-strict mode, `this` refers to the global object; in strict mode, `this` is `undefined`.
- **Inside an object method**: `this` refers to the object the method is called on.
- **Inside a class method**: `this` refers to the instance of the class.

### 14. What is CORS (Cross-Origin Resource Sharing)?

**CORS** is a security feature that allows or restricts web applications from making requests to a domain different from the one that served the web page. It defines a way for browsers and servers to communicate about permissions for cross-origin requests.

### 15. What is the difference between `Object.assign()` and the spread operator?

- **`Object.assign()`**: Copies the values of all properties from one or more source objects to a target object.

  ```javascript
  Object.assign({}, obj1);
  ```

- **Spread Operator**: A shorthand for copying properties from an object or array.
  ```javascript
  const newObj = { ...obj1 };
  ```

### 16. What is a module bundler, and how does it work?

A **module bundler** (like Webpack) takes your JavaScript files and their dependencies (modules) and bundles them into one or more files that can be included in the HTML for the browser. It helps manage code modularization and optimization for faster loading.

### 17. What is debouncing in JavaScript, and how is it implemented?

**Debouncing** ensures that a function is not called multiple times within a short period, especially for events like resizing or typing. It delays the execution of a function until after a specified time has passed since the last call.

Example:

```javascript
let timeout;
function debounce(func, delay) {
  clearTimeout(timeout);
  timeout = setTimeout(func, delay);
}
```

### 18. What is throttling in JavaScript, and what are its benefits?

**Throttling** limits the number of times a function can be executed over time, ensuring it is executed at most once in a specific time interval. It’s useful for controlling resource-heavy functions like scroll or resize events.

### 19. How do you implement memoization in JavaScript?

**Memoization** is a technique to optimize performance by caching function results and returning the cached result when the same inputs are encountered.

Example:

```javascript
const memoize = (func) => {
  const cache = {};
  return (arg) => {
    if (cache[arg]) return cache[arg];
    const result = func(arg);
    cache[arg] = result;
    return result;
  };
};
```

### 20. Explain how promises can be chained in JavaScript.

Promises can be chained by using the `then()` method, which returns a new promise.

Example:

```javascript
fetch("url")
  .then((response) => response.json())
  .then((data) => console.log(data))
  .catch((error) => console.error(error));
```

### 21. What are the differences between `Promise.all()`, `Promise.any()`, `Promise.allSettled()`, and `Promise.race()`?

- **`Promise.all()`**: Resolves when all promises are fulfilled or rejects as soon as one promise rejects.
- **`Promise.any()`**: Resolves when any of the promises are fulfilled, rejects if all are rejected.
- **`Promise.allSettled()`**: Resolves when all promises have settled (either fulfilled or rejected).
- **`Promise.race()`**: Resolves or rejects as soon as any of the promises resolves or rejects.

### 22. What are interceptors in JavaScript, and how are they used?

**Interceptors** are used to intercept requests or responses in HTTP libraries (like Axios) before they are processed by the application. They can modify requests, add headers, or handle errors globally.

### 23. How does `localStorage` differ from `sessionStorage`?

- **`localStorage`**: Stores data with no expiration time. Data persists even when the browser is closed and reopened.
- **`sessionStorage`**: Stores data for the duration of the page session (until the browser or tab is closed).

### 24. What is the difference between synchronous and asynchronous code in JavaScript?

- **Synchronous code**: Executes sequentially, blocking the execution of other tasks until it’s complete.
- **Asynchronous code**: Executes independently, allowing other tasks to run while waiting for an operation to complete (e.g., network requests, timers).

### 25. How does the Event Loop work in JavaScript?

The **Event Loop** allows JavaScript to perform non-blocking I/O operations. It continuously checks the call stack and the message queue. If the stack is empty, it processes the next task from the message queue.

### 26. What is `eval()` in JavaScript, and why is it considered harmful?

`eval()` evaluates or executes JavaScript code represented as a string. It’s considered harmful because it can introduce security risks, make code harder to debug, and lead to performance issues.

### 27. What is a `Proxy` in JavaScript, and how is it used?

A **Proxy** is an object that wraps another object to intercept and modify its behavior. It can be used to create custom behavior for operations like property access, method calls, etc.

### 28. Explain how `async` and `await` work in JavaScript.

**`async`** makes a function return a promise, and **`await`** pauses the execution of the function until the promise resolves.

Example:

```javascript
async function fetchData() {
  let response = await fetch("url");
  let data = await response.json();
  console.log(data);
}
```

### 29. What is a `WeakMap` in JavaScript, and how does it differ from a regular `Map`?

A **WeakMap** stores key-value pairs where the keys are objects and are held **weakly**. This means the keys can be garbage collected if there are no other references to them. In contrast, keys in a regular `Map` prevent garbage collection.

### 30. What are the different data types in JavaScript?

- **Primitive**: `undefined`, `null`, `boolean`, `number`, `string`, `symbol`, `bigint`.
- **Non-primitive**: `object` (includes arrays, functions, and other objects).

Here are the answers to your JavaScript questions:

### 1. What are the different data types in JavaScript?

- **Primitive types**: `undefined`, `null`, `boolean`, `number`, `string`, `symbol`, `bigint`
- **Non-primitive type**: `object` (includes arrays, functions, and other objects)

### 2. What is the difference between `null` and `undefined`?

- **`null`**: Represents the intentional absence of any object value.
- **`undefined`**: Represents a variable that has been declared but not assigned a value.

### 3. What is the output of `3 + 2 + "7"`?

- The output is `"57"` because JavaScript converts the number `2` and `3` to strings when concatenating with the string `"7"`.

### 4. What is the difference between `==` and `===` in JavaScript?

- **`==` (loose equality)**: Compares values after type coercion.
- **`===` (strict equality)**: Compares values without type coercion.

### 5. Is JavaScript a dynamically typed language or a statically typed language?

- JavaScript is **dynamically typed**, meaning variables' types are determined at runtime.

### 6. What is the `typeof` operator?

- The `typeof` operator returns a string indicating the type of a variable or expression.

### 7. What is the difference between Pure and Impure functions?

- **Pure functions**: Always return the same output for the same input and have no side effects.
- **Impure functions**: May return different outputs for the same input or cause side effects (e.g., modifying global variables).

### 8. What are Higher Order Functions in JavaScript?

- **Higher-order functions** are functions that take one or more functions as arguments, or return a function as their result.

```js
function higherOrderFunction(param, callback) {
  return callback(param);
}
```

### 9. What are callbacks in JavaScript?

- A **callback** is a function passed as an argument to another function, to be executed later.

### 10. What is a closure?

- A **closure** is a function that has access to its lexical scope, even after the outer function has finished execution.

### 11. What are Promises in JavaScript?

- A **Promise** is an object representing the eventual completion or failure of an asynchronous operation.

### 12. What is the difference between `map()` and `forEach()`?

- **`map()`**: Returns a new array with the results of calling a function on every element.
- **`forEach()`**: Executes a function on each element but does not return anything.

### 13. What is the difference between `map` and `filter`?

- **`map()`**: Transforms every element of an array and returns a new array.
- **`filter()`**: Creates a new array with all elements that pass a test.

### 14. What is the difference between `find` vs `findIndex`?

- **`find()`**: Returns the first element that satisfies the condition.
- **`findIndex()`**: Returns the index of the first element that satisfies the condition.

### 15. `slice` vs `splice` in JavaScript?

- **`slice()`**: Returns a shallow copy of a portion of an array.
- **`splice()`**: Changes the original array by adding, removing, or replacing elements.

### 16. What is the difference between `for-in` and `for-of`?

- **`for-in`**: Iterates over the keys (properties) of an object.
- **`for-of`**: Iterates over the values of an iterable object (e.g., arrays).

### 17. What is `setTimeout` in JavaScript?

- **`setTimeout()`** is used to execute a function after a specified delay (in milliseconds).

### 18. What is `setInterval` in JavaScript?

- **`setInterval()`** repeatedly calls a function at specified intervals (in milliseconds).

### 19. What are the differences between `call()`, `apply()`, and `bind()`?

- **`call()`**: Invokes a function with a specified `this` value and arguments.
- **`apply()`**: Invokes a function with a specified `this` value, but arguments are passed as an array.
- **`bind()`**: Returns a new function with a fixed `this` value and initial arguments.

The apply invokes a function specifying the this or the "owner" object of that function on that time of invocation.

```js
const details = {
  message: "Hello World!",
};

function getMessage() {
  return this.message;
}

getMessage.apply(details); // returns 'Hello World!'
```

This method works like Function.prototype.call the only difference is how we pass arguments. In apply we pass arguments as an array.

```js
const person = {
  name: "Marko Polo",
};

function greeting(greetingMessage) {
  return `${greetingMessage} ${this.name}`;
}

greeting.apply(person, ["Hello"]); // returns "Hello Marko Polo!"
```

The call invokes a function specifying the this or the "owner" object of that function on that time of invocation.

```js
const details = {
  message: "Hello World!",
};

function getMessage() {
  return this.message;
}

getMessage.call(details); // returns 'Hello World!'
```

This method works like Function.prototype.apply the only difference is how we pass arguments. In call we pass directly the arguments separating them with a comma , for every argument.

```js
const person = {
  name: "Marko Polo",
};

function greeting(greetingMessage) {
  return `${greetingMessage} ${this.name}`;
}

greeting.call(person, "Hello"); // returns "Hello Marko Polo!"
```

**What's the difference between Function.prototype.apply and Function.prototype.call?**
↑ The only difference between apply and call is how we pass the arguments in the function being called. In apply we pass the arguments as an array and in call we pass the arguments directly in the argument list.

```js
const obj1 = {
  result: 0,
};

const obj2 = {
  result: 0,
};

function reduceAdd() {
  let result = 0;
  for (let i = 0, len = arguments.length; i < len; i++) {
    result += arguments[i];
  }
  this.result = result;
}

reduceAdd.apply(obj1, [1, 2, 3, 4, 5]); // returns 15
reduceAdd.call(obj2, 1, 2, 3, 4, 5); // returns 15
```

**30. What is the usage of Function.prototype.bind?**
↑ The bind method returns a new function that is bound
to a specific this value or the "owner" object, So we can use it later in our code. The call,apply methods invokes the function immediately instead of returning a new function like the bind method.

```js
import React from "react";

class MyComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: "",
    };
    this.handleChange = this.handleChange.bind(this);
    // Binds the "handleChange" method to the "MyComponent" component
  }

  handleChange(e) {
    //do something amazing here
  }

  render() {
    return (
      <>
        <input
          type={this.props.type}
          value={this.state.value}
          onChange={this.handleChange}
        />
      </>
    );
  }
}
```

### 20. What is the difference between Pass by Value and Pass by Reference?

- **Pass by Value**: Primitive types are passed by value, meaning a copy of the variable is passed.
- **Pass by Reference**: Objects are passed by reference, meaning a reference to the original object is passed.

### 21. What is destructuring?

- **Destructuring** is a syntax for unpacking values from arrays or objects into variables.

Example:

```javascript
const [a, b] = [1, 2];
const { x, y } = { x: 10, y: 20 };
```

### 22. What is the spread operator in JavaScript?

- The **spread operator** (`...`) is used to unpack elements from an array or object.

Example:

```javascript
const arr = [1, 2, 3];
const newArr = [...arr, 4];
```

### 23. What is the rest operator in JavaScript?

- The **rest operator** (`...`) collects the remaining elements into an array in function parameters.

Example:

```javascript
function sum(...numbers) {
  return numbers.reduce((acc, num) => acc + num, 0);
}
```

**What's the difference between Spread operator and Rest operator?**
↑ The Spread operator and Rest paremeters have the same operator ... the difference between is that the Spread operator we give or spread individual data of an array to another data while the Rest parameters is used in a function or an array to get all the arguments or values and put them in an array or extract some pieces of them.

```js
function add(a, b) {
  return a + b;
}

const nums = [5, 6];
const sum = add(...nums);
console.log(sum);
```

In this example, we're using the Spread Operator when we call the add function we are spreading the nums array. So the value of parameter a will be 5 and the value of b will be 6. So the sum will be 11.

```js
function add(...rest) {
  return rest.reduce((total, current) => total + current);
}

console.log(add(1, 2)); // logs 3
console.log(add(1, 2, 3, 4, 5)); // logs 15
```

In this example, we have a function add that accepts any number of arguments and adds them all and return the total.

```js
const [first, ...others] = [1, 2, 3, 4, 5];
console.log(first); //logs 1
console.log(others); //logs [2,3,4,5]
```

In this another example, we are using the Rest operator to extract all the remaining array values and put them in array others except the first item.

### 24. What is Hoisting?

- **Hoisting** is JavaScript's behavior of moving variable and function declarations to the top of their scope during compilation.

### 25. What is IIFE (Immediately Invoked Function Expression)?

- An **IIFE** is a function expression that is invoked immediately after being defined.
- An IIFE or Immediately Invoked Function Expression is a function that is gonna get invoked or executed after its creation or declaration.
- The syntax for creating IIFE is that we wrap the function (){} inside a parentheses () or the Grouping Operator to treat the function as an expression and after that we invoke it with another parentheses (). So an IIFE looks like this (function(){})().

Example:

```javascript
(function () {
  console.log("IIFE executed");
})();

(function () {})();

(function () {})();

(function named(params) {})();

(() => {})();

(function (global) {})(window);

const utility = (function () {
  return {
    //utilities
  };
})();
```

These examples are all valid IIFE. The second to the last example shows we can pass arguments to an IIFE function. The last example shows that we can save the result of the IIFE to a variable so we can reference it later.

The best use of IIFE is making initialization setup functionalities and to avoid naming collisions with other variables in the global scope or polluting the global namespace. Let's have an example.

```js
<script src="https://cdnurl.com/somelibrary.js"></script>
```

Suppose we have a link to a library somelibrary.js that exposes some global functions that we use can in our code but this library has two methods that we don't use createGraph and drawGraph because these methods have bugs in them. And we want to implement our own createGraph and drawGraph methods.

One way of solving this is by changing the structure of our scripts.

```js
<script src="https://cdnurl.com/somelibrary.js"></script>
<script>
   function createGraph() {
      // createGraph logic here
   }
   function drawGraph() {
      // drawGraph logic here
   }
</script>
```

When we use this solution we are overriding those two methods that the library gives us.

Another way of solving this is by changing the name of our own helper functions.

```js
<script src="https://cdnurl.com/somelibrary.js"></script>
<script>
   function myCreateGraph() {
      // createGraph logic here
   }
   function myDrawGraph() {
      // drawGraph logic here
   }
</script>
```

When we use this solution we will also change those function calls to the new function names.

Another way is using an IIFE.

```js
<script src="https://cdnurl.com/somelibrary.js"></script>
<script>
   const graphUtility = (function () {
      function createGraph() {
         // createGraph logic here
      }
      function drawGraph() {
         // drawGraph logic here
      }
      return {
         createGraph,
         drawGraph
      }
   })();
</script>
```

In this solution, we are making a utility variable that is the result of IIFE which returns an object that contains two methods createGraph and drawGraph.

Another problem that IIFE solves is in this example.

```js
var li = document.querySelectorAll(".list-group > li");
for (var i = 0, len = li.length; i < len; i++) {
  li[i].addEventListener("click", function (e) {
    console.log(i);
  });
}
```

Suppose we have a ul element with a class of list-group and it has 5 li child elements. And we want to console.log the value of i when we click an individual li element.
But the behavior we want in this code does not work. Instead, it logs 5 in any click on an li element. The problem we're having is due to how Closures work. Closures are simply the ability of functions to remember the references of variables on its current scope, on its parent function scope and in the global scope. When we declare variables using the var keyword in the global scope, obviously we are making a global variable i. So when we click an li element it logs 5 because that is the value of i when we reference it later in the callback function.

One solution to this is an IIFE.

```js
var li = document.querySelectorAll(".list-group > li");
for (var i = 0, len = li.length; i < len; i++) {
  (function (currentIndex) {
    li[currentIndex].addEventListener("click", function (e) {
      console.log(currentIndex);
    });
  })(i);
}
```

This solution works because of the reason that the IIFE creates a new scope for every iteration and we capture the value of i and pass it into the currentIndex parameter so the value of currentIndex is different for every iteration when we invoke the IIFE.

### 26. What is event bubbling?

- **Event bubbling** is a mechanism where an event propagates from the innermost target element to the outermost ancestor.

### 27. What is event capturing?

- **Event capturing** is a mechanism where an event propagates from the outermost ancestor to the innermost target element.

### 28. What is the callstack in JavaScript?

- The **call stack** keeps track of the execution context of functions in JavaScript.

### 29. What is a polyfill in JavaScript?

- A **polyfill** is a piece of code that provides functionality that is not natively supported by the browser.

### 30. What is CORS?

- **CORS** (Cross-Origin Resource Sharing) is a security feature that controls how resources can be requested from a different domain.

### 31. What are the differences between `let`, `var`, and `const`?

- **`let`**: Block-scoped, allows reassignment.
- **`var`**: Function-scoped, allows reassignment, can be hoisted.
- **`const`**: Block-scoped, does not allow reassignment.

### 32. What is temporal dead zone?

- The **temporal dead zone** is the period between entering the scope and variable initialization, during which the variable cannot be accessed.

### 33. What is `this` in JavaScript and how does it behave in various scenarios?

- **`this`** refers to the context in which a function is called. It varies based on the invocation:
  - In the global context: refers to the global object (`window` in browsers).
  - Inside a function: depends on how the function is invoked.
  - In an object method: refers to the object itself.
  - In a class method: refers to the class instance.

### 34. What are DRY, KISS, YAGNI, SOLID principles?

- **DRY**: Don't Repeat Yourself
- **KISS**: Keep It Simple, Stupid
- **YAGNI**: You Aren't Gonna Need It
- **SOLID**: A set of five design principles for object-oriented programming.

### 35. What is meant by debouncing and throttling?

- **Debouncing** ensures a function is only called once after a certain delay, useful for user input.
- **Throttling** limits how often a function can be executed over time.

### 36. What is a generator function in JavaScript?

- A **generator function** is a function that can be paused and resumed, using `yield`.

Example:

```javascript
function* generator() {
  yield 1;
  yield 2;
}
```

### 37. What is prototype in JavaScript?

- A **prototype** is an object that is associated with every function and object in JavaScript. It allows inheritance.

A prototype in simplest terms is a blueprint of an object. It is used as a fallback for properties and methods if it does exist in the current object. It's the way to share properties and functionality between objects. It's the core concept around JavaScript's Prototypal Inheritance.

```js
const o = {};
console.log(o.toString()); // logs [object Object]
```

Even though the o.toString method does not exist in the o object it does not throw an error instead returns a string [object Object]. When a property does not exist in the object it looks into its prototype and if it still does not exist it looks into the prototype's prototype and so on until it finds a property with the same in the Prototype Chain. The end of the Prototype Chain is null after the Object.prototype.

```js
console.log(o.toString === Object.prototype.toString); // logs true
// which means we we're looking up the Prototype Chain and it reached
// the Object.prototype and used the "toString" method.
```

### 38. What are the key features of ES6?

- Key features include arrow functions, template literals, destructuring, classes, promises, `let` and `const`, and modules.

### 39. What is `Object.freeze()` vs `Object.seal()`?

- **`Object.freeze()`**: Prevents modifications to an object (cannot add, delete, or modify properties).
- **`Object.seal()`**: Prevents adding or deleting properties, but allows modification of existing properties.

### 40. What is the difference between `Object.keys`, `Object.values`, and `Object.entries`?

- **`Object.keys()`**: Returns an array of the object's keys.
- **`Object.values()`**: Returns an array of the object's values.
- **`Object.entries()`**: Returns an array of key-value pairs.

### 41. What is the difference between IndexedDB and sessionStorage?

- **IndexedDB**: A low-level API for client-side storage of large amounts of structured data.
- **sessionStorage**: Stores data for the duration of the page session.

### 42. What is the difference between Local Storage and Session Storage?

- **Local Storage**: Persists data even when the browser is closed and reopened.
- **Session Storage**: Only stores data for the duration of the page session.

### 43. What is the difference between Shallow copy and

Deep copy?

- **Shallow copy**: Copies the top-level properties of an object.
- **Deep copy**: Recursively copies all levels of properties.

### 44. What are the differences between undeclared and undefined variables?

- **Undeclared variables**: Variables that haven't been declared in the code.
- **Undefined variables**: Variables that are declared but not assigned any value.

### 45. What are cookies?

- **Cookies** are small pieces of data stored on the client side and sent to the server with each HTTP request.

### 46. What is the `eval()` function?

- The **`eval()`** function executes JavaScript code represented as a string.

### 47. What is the difference between authentication and authorization?

- **Authentication** verifies who the user is.
- **Authorization** determines what the user is allowed to do.

### 48. What are the differences between JavaScript and TypeScript?

- **JavaScript** is a dynamic, interpreted language.
- **TypeScript** is a superset of JavaScript that adds static typing.

### 49. What is tree shaking in JavaScript?

- **Tree shaking** is a technique used to remove unused code from the final bundle during the build process.

### 50. What are the limitations of arrow functions?

- **Arrow functions** cannot be used as constructors and do not have their own `this` context.

### 51. What is the difference between `Promise.all`, `allSettled`, `any`, and `race`?

- **`Promise.all()`**: Resolves when all promises are resolved or rejects if any promise is rejected.
- **`Promise.allSettled()`**: Resolves when all promises are settled, regardless of whether they resolve or reject.
- **`Promise.any()`**: Resolves when any promise is resolved, rejects if all promises are rejected.
- **`Promise.race()`**: Resolves or rejects when the first promise resolves or rejects.

### 52. What is a polyfill in JavaScript?

- A **polyfill** is a piece of code that adds missing functionality for browsers that do not support certain features.

### 53. What are interceptors?

- **Interceptors** are functions used to modify requests or responses in HTTP communication (e.g., Axios interceptors).

### 54. How do you optimize the performance of an application?

- Optimize by minimizing HTTP requests, using lazy loading, optimizing images, and using code-splitting and caching.

### 55. What are the differences between `Object.freeze()` vs `Object.seal()`?

- See answer #39.

### 56. What is a generator function in JavaScript?

- See answer #36.

### 57. What is event bubbling and event capturing?

- See answers #26 and #27.

### 58. What is `setTimeout()` vs `setInterval()`?

- See answers #17 and #18.

### 59. What is the use of Promises in JavaScript?

- **Promises** are used to handle asynchronous operations, allowing cleaner code with `.then()` and `.catch()`.

### 60. What is the difference between `Promise.all()`, `allSettled()`, `any()`, and `race()`?

- See answer #51.
