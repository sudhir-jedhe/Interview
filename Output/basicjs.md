### 1. **Event Delegation**

Event delegation is a technique in JavaScript where you attach a single event listener to a parent element instead of attaching it to each individual child element. This allows you to handle events for dynamically added elements as well. It works by taking advantage of event bubbling, where events propagate up from the target element to the parent elements.

**How this works in JavaScript:**

```javascript
document.getElementById('parent').addEventListener('click', function(event) {
  if (event.target && event.target.matches('button.classname')) {
    // Handle button click
  }
});
```

### 2. **Event Delegation in ES6**

In ES6, event delegation works the same way, but arrow functions can simplify the syntax:

```javascript
document.getElementById('parent').addEventListener('click', (event) => {
  if (event.target.matches('button.classname')) {
    // Handle button click
  }
});
```

Here, the arrow function ensures that the `this` keyword doesn't need to be explicitly bound.

---

### 3. **Prototypal Inheritance**

Prototypal inheritance is a feature in JavaScript where objects inherit properties and methods from other objects. Instead of using classes, objects directly reference other objects via their `prototype` chain. This allows for shared behavior without needing to explicitly define methods on each object.

Example:

```javascript
function Animal(name) {
  this.name = name;
}
Animal.prototype.speak = function() {
  console.log(this.name + ' makes a noise');
};

const dog = new Animal('Dog');
dog.speak(); // Dog makes a noise
```

---

### 4. **Difference Between null, undefined, and undeclared Variables**

- **null**: A variable that has been explicitly set to no value.
- **undefined**: A variable that has been declared but not assigned a value.
- **undeclared**: A variable that has not been declared in the code.

**Checking these states:**

```javascript
let x;
console.log(x === undefined);  // true
let y = null;
console.log(y === null);      // true
console.log(typeof z === 'undefined'); // true for undeclared variable z
```

---

### 5. **What is a Closure?**

A closure is a function that retains access to its lexical scope, even when the function is executed outside that scope.

Example:

```javascript
function outer() {
  let counter = 0;
  return function inner() {
    counter++;
    console.log(counter);
  };
}
const increment = outer();
increment(); // 1
increment(); // 2
```

**Why use closures?** To maintain state and create private variables.

---

### 6. **Iterating over Object Properties and Array Items**

- **For Arrays**:

  ```javascript
  for (let i = 0; i < arr.length; i++) { ... }
  arr.forEach(item => { ... });
  ```

- **For Objects**:

  ```javascript
  for (const key in obj) { ... }
  Object.keys(obj).forEach(key => { ... });
  ```

---

### 7. **Array.forEach() vs Array.map()**

- **forEach()**: Iterates over each array element, but does not return a new array.
- **map()**: Creates and returns a new array with the results of calling a provided function on every element.

**When to use:**

- Use `forEach()` when you want to iterate and perform side effects (like logging).
- Use `map()` when you need a transformed array.

---

### 8. **Other Methods for Iterating Over Arrays**

- `reduce()`: Accumulates a result from array elements.
- `filter()`: Filters elements based on a condition.
- `some()`: Tests if at least one element passes a condition.
- `every()`: Tests if all elements pass a condition.

---

### 9. **Use Case for Anonymous Functions**

Anonymous functions are often used when passing a short function as an argument, for example, when using methods like `forEach`, `setTimeout`, or event listeners:

```javascript
setTimeout(() => console.log("Hello"), 1000);
```

---

### 10. **Difference Between Host Objects and Native Objects**

- **Host objects** are provided by the JavaScript environment (e.g., `window`, `document` in browsers).
- **Native objects** are part of the JavaScript language specification (e.g., `Object`, `Array`, `String`).

---

### 11. **Difference Between function Person() {}, var person = Person(), and var person = new Person()**

- **function Person() {}**: Declares a constructor function.
- **var person = Person()**: Invokes `Person()` without the `new` keyword (may lead to unintended results).
- **var person = new Person()**: Creates a new instance of the `Person` constructor with proper inheritance.

---

### 12. **Difference Between `function foo() {}` and `var foo = function() {}`**

- **`function foo() {}`**: Function declaration. Can be called before the function is defined due to hoisting.
- **`var foo = function() {}`**: Function expression. Cannot be called before it is defined.

---

### 13. **Function.call() vs Function.apply()**

- **call()**: Calls the function with a specified `this` value and arguments passed individually.
- **apply()**: Calls the function with a specified `this` value and arguments passed as an array.

Example:

```javascript
function greet(name) {
  console.log('Hello ' + name);
}

greet.call(this, 'Alice');
greet.apply(this, ['Alice']);
```

---

### 14. **Function.prototype.bind()**

`bind()` returns a new function where the `this` keyword is permanently set to the value provided.

```javascript
const obj = { name: 'Alice' };
function greet() {
  console.log('Hello ' + this.name);
}
const boundGreet = greet.bind(obj);
boundGreet(); // Hello Alice
```

---

### 15. **Feature Detection, Feature Inference, and UA String**

- **Feature Detection**: Checking if a feature is available in the browser (`if ('fetch' in window)`).
- **Feature Inference**: Inferring the presence of a feature based on conditions (e.g., if `window.localStorage` is available, we can infer support).
- **UA String**: Parsing the user agent string to determine browser characteristics (less reliable).

---

### 16. **Hoisting**

Hoisting is JavaScript's behavior of moving variable and function declarations to the top of their scope during the compile phase.

```javascript
console.log(x); // undefined (variable declaration hoisted)
var x = 5;
```

---

### 17. **Type Coercion**

Type coercion happens when JavaScript automatically converts one data type to another.

```javascript
console.log(5 + '5'); // "55" (number coerced to string)
console.log('5' - 3); // 2 (string coerced to number)
```

Common pitfalls: relying on coercion can lead to unexpected results.

---

### 18. **Event Bubbling vs Event Capturing**

- **Event Bubbling**: Events propagate from the target element up to the root.
- **Event Capturing**: Events propagate from the root down to the target element.

---

### 19. **Attribute vs Property**

- **Attribute**: A value defined in HTML (e.g., `<input type="text">`).
- **Property**: The value of an element's property in the DOM (e.g., `document.querySelector('input').type`).

---

### 20. **Pros and Cons of Extending Built-in JavaScript Objects**

- **Pros**: Extending objects can provide useful utilities for custom behavior.
- **Cons**: It can cause conflicts with existing JavaScript functionality, and it's not recommended as it can lead to unexpected bugs.

---

### 21. **== vs ===**

- **==**: Compares values after type coercion.
- **===**: Compares both value and type (strict equality).

---

### 22. **Same-Origin Policy**

The same-origin policy restricts web pages from making requests to a different domain than the one that served the web page, for security reasons.

---

### 23. **Ternary Operator**

The ternary operator is a shorthand for an `if-else` statement. "Ternary" refers to its three operands:

```javascript
let result = condition ? 'true' : 'false';
```

---

### 24. **Strict Mode**

Strict mode is a way to opt into a restricted variant of JavaScript. It catches common coding mistakes and prevents certain actions.
**Advantages**: Avoids silent errors, eliminates `this` coercion.
**Disadvantages**: Can break older code.

---

### 25. **Advantages/Disadvantages of Using JavaScript Compiled Languages**

**Advantages**: Easier to maintain, modern features, type safety.
**Disadvantages**: Extra compilation step, slower debugging.

---

### 26. **Debugging JavaScript Code**

- Using `console.log()`, breakpoints, and debugger tools.
- Tools like Chrome DevTools help inspect variables, track errors, and visualize call stacks.

---

### 27. **Mutable vs Immutable Objects**

- **Mutable** objects can be changed after creation (e.g., arrays, objects).
- **Immutable** objects cannot be changed after creation (e.g., strings, numbers).
  
**Example**: `Object.freeze()` makes an object immutable.

---

### 28. **Synchronous vs Asynchronous Functions**

- **S

ynchronous**: Code executes sequentially, blocking the next operation until complete.

- **Asynchronous**: Code executes independently, allowing other tasks to run in parallel (e.g., with promises, async/await).

---

### 29. **Event Loop**

The event loop allows JavaScript to handle asynchronous tasks by queuing them in the event queue while the main thread executes synchronous code.

---

### 30. **Call Stack vs Task Queue**

- **Call Stack**: Contains functions that are currently executing.
- **Task Queue**: Contains tasks (e.g., events, promises) that are waiting to be executed after the call stack is empty.

---

### 31. **let, var, and const**

- **var**: Function-scoped, can be re-assigned.
- **let**: Block-scoped, can be re-assigned.
- **const**: Block-scoped, cannot be re-assigned.

---

### 32. **Changing Property of Object Defined by const**

You can change properties of an object defined by `const`, but you cannot re-assign the object itself.

```javascript
const obj = { a: 1 };
obj.a = 2;  // Allowed
obj = {};   // Not allowed
```

---

### 33. **ES6 Classes vs ES5 Constructors**

ES6 classes provide a more readable and structured way to define constructor functions, while ES5 uses the `function` syntax for constructors.

---

### 34. **Arrow Functions**

Arrow functions provide a shorter syntax and don't bind their own `this`, making them useful for callbacks where the `this` value is important.

---

### 35. **Destructuring Example**

```javascript
const person = { name: 'Alice', age: 25 };
const { name, age } = person;
```

---

### 36. **Template Literals Example**

```javascript
const name = 'Alice';
console.log(`Hello, ${name}!`);
```

---

### 37. **Curry Function Example**

```javascript
const multiply = x => y => x * y;
const double = multiply(2);
console.log(double(3)); // 6
```

---

### 38. **Spread vs Rest Syntax**

- **Spread**: Unpacks elements from an array or object.

```javascript
const arr = [1, 2, 3];
const arr2 = [...arr, 4, 5];
```

- **Rest**: Collects multiple elements into an array.

```javascript
function sum(...args) {
  return args.reduce((a, b) => a + b, 0);
}
```

---

### 39. **Sharing Code Between Files**

You can use modules (e.g., `import`/`export`) to share code between files.

---

### 40. **Static Class Members**

Static members belong to the class itself rather than an instance. Useful for utility methods.

```javascript
class MyClass {
  static greet() {
    console.log('Hello!');
  }
}
MyClass.greet(); // Hello!
```

---

### 41. **While vs Do-While Loops**

- **while**: Executes the loop if the condition is true.
- **do-while**: Executes the loop at least once before checking the condition.

---

### 42. **Promise**

A promise represents a value that may not be available yet but will be resolved in the future.

```javascript
let promise = new Promise((resolve, reject) => {
  setTimeout(() => resolve("Done!"), 1000);
});
```

---

### 43. **Object-Oriented Programming in JavaScript**

You can use prototypes and classes to implement OOP principles like inheritance, encapsulation, and polymorphism.

---

### 44. **Event.target vs event.currentTarget**

- **event.target**: The element that triggered the event.
- **event.currentTarget**: The element the event listener is attached to.

---

### 45. **event.preventDefault() vs event.stopPropagation()**

- **preventDefault()**: Prevents the default behavior (e.g., form submission).
- **stopPropagation()**: Stops the event from propagating further in the DOM.

---

### 46. **Make `duplicate([1, 2, 3, 4, 5])` work**

```javascript
function duplicate(arr) {
  return [...arr, ...arr];
}
console.log(duplicate([1, 2, 3, 4, 5])); // [1, 2, 3, 4, 5, 1, 2, 3, 4, 5]
```

---

### 47. **FizzBuzz**

```javascript
for (let i = 1; i <= 100; i++) {
  let output = '';
  if (i % 3 === 0) output += 'fizz';
  if (i % 5 === 0) output += 'buzz';
  console.log(output || i);
}
```

---

### 48. **Return from console.log()**

```javascript
console.log("hello" || "world"); // "hello"
console.log("foo" && "bar");     // "bar"
```

---

### 49. **Immediately Invoked Function Expression (IIFE)**

```javascript
(function() {
  console.log("I am an IIFE");
})();
```
