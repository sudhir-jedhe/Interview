// In Javascript, functions are first class objects.
// First-class functions means when functions in that language are treated
// like any other variable.

Yes, in JavaScript, functions are first-class objects, meaning they can be treated like any other variable. Here's a detailed breakdown of what this entails:

### 1. **Assigning Functions to Variables**
   You can assign a function to a variable, just like you assign a value to a variable.

   ```javascript
   const greet = function() {
       console.log("Hello!");
   };
   greet(); // Output: Hello!
   ```

### 2. **Passing Functions as Arguments**
   Functions can be passed as arguments to other functions. This is a common pattern, especially in callback-based programming.

   ```javascript
   const sayHello = () => console.log("Hello");
   const executeCallback = (callback) => callback();
   executeCallback(sayHello); // Output: Hello
   ```

### 3. **Returning Functions from Functions**
   Functions can also return other functions. This is the basis of closures.

   ```javascript
   const createMultiplier = (factor) => {
       return (number) => number * factor;
   };

   const double = createMultiplier(2);
   console.log(double(5)); // Output: 10
   ```

### 4. **Storing Functions in Data Structures**
   Since functions are treated as objects, they can be stored in arrays or objects.

   ```javascript
   const functionsArray = [
       () => console.log("Function 1"),
       () => console.log("Function 2"),
   ];

   functionsArray[0](); // Output: Function 1
   functionsArray[1](); // Output: Function 2
   ```

   ```javascript
   const functionsObject = {
       greet: () => console.log("Hello!"),
       farewell: () => console.log("Goodbye!"),
   };

   functionsObject.greet(); // Output: Hello!
   functionsObject.farewell(); // Output: Goodbye!
   ```

### 5. **Attaching Functions to Event Listeners**
   The example you provided demonstrates attaching a function to an event listener. This is a cornerstone of event-driven programming in JavaScript.

   ```javascript
   const handler = () => console.log("This is a click handler function");
   document.addEventListener("click", handler);
   ```

   Here, `handler` is passed as an argument to `addEventListener`. When the click event occurs, the browser executes the `handler` function.

### 6. **Functions Have Properties and Methods**
   Since functions are objects, they have properties and methods. For example, you can add properties to functions or use their built-in methods like `bind`.

   ```javascript
   const greet = function(name) {
       return `Hello, ${name}!`;
   };

   greet.description = "A function to greet someone";
   console.log(greet.description); // Output: A function to greet someone
   ```

### Summary
Treating functions as first-class objects is a powerful feature of JavaScript. It enables functional programming patterns, event-driven architecture, and greater flexibility in writing code.


# First-Class Functions in JavaScript

A language is said to support **First-Class Functions** if functions can be:

```text
✅ Assigned to variables
✅ Passed as arguments
✅ Returned from functions
✅ Stored in objects/arrays
✅ Created at runtime
```

JavaScript treats functions like any other variable.

***

# 1. Assign Function to a Variable

```javascript
const greet = function () {
  return "Hello";
};

console.log(greet());
```

Output:

```text
Hello
```

Here the function is assigned to a variable.

***

# 2. Pass Function as Argument (Callback)

```javascript
function execute(fn) {
  fn();
}

function sayHello() {
  console.log("Hello");
}

execute(sayHello);
```

Output:

```text
Hello
```

This is the foundation of:

```text
Callbacks
Event Handlers
Array Methods
```

***

# 3. Return Function from Another Function

```javascript
function multiply(x) {

  return function(y) {

    return x * y;

  };

}

const double = multiply(2);

console.log(double(5));
```

Output:

```text
10
```

This is possible because functions are first-class citizens.

***

# 4. Store Functions in Objects

```javascript
const calculator = {

  add(a, b) {
    return a + b;
  },

  subtract(a, b) {
    return a - b;
  }

};

console.log(
  calculator.add(5, 3)
);
```

Output:

```text
8
```

***

# 5. Store Functions in Arrays

```javascript
const operations = [

  x => x + 1,

  x => x * 2,

  x => x * x

];

console.log(
  operations
);
```

Output:

```text
10
```

***

# Real React Examples

## Event Handler

```jsx
function App() {

  const handleClick =
    () => {
      console.log(
        "Clicked"
      );
    };

  return (
    <button
      onClick={handleClick}
    >
      Click
    </button>
  );
}
```

Here:

```javascript
handleClick
```

is passed as a value.

***

## Props as Functions

### Parent

```jsx
function Parent() {

  const handleSave =
    data => {

      console.log(data);

    };

  return (
    <Child
      onSave={handleSave}
    />
  );
}
```

***

### Child

```jsx
function Child({
  onSave
}) {

  return (
    <button
      onClick={() =>
        onSave("React")
      }
    >
      Save
    </button>
  );
}
```

This works because functions are first-class citizens.

***

# Array Methods

## map()

```javascript
const nums =
  [1, 2, 3];

const doubled =
  nums.map(
    num => num * 2
  );

console.log(doubled);
```

Output:

```javascript
[2, 4, 6]
```

***

## filter()

```javascript
const nums =
  [1, 2, 3, 4];

const evens =
  nums.filter(
    num => num % 2 === 0
  );

console.log(evens);
```

Output:

```javascript
[2, 4]
```

***

## reduce()

```javascript
const nums =
  [1, 2, 3];

const sum =
  nums.reduce(
    (acc, num) =>
      acc + num,
    0
  );

console.log(sum);
```

Output:

```text
6
```

***

# First-Class Functions vs Higher-Order Functions

### First-Class Function

Functions can be treated like values.

```javascript
const fn = () => {};
```

***

### Higher-Order Function

A function that:

```text
Receives function OR
Returns function
```

Example:

```javascript
function execute(fn) {
  fn();
}
```

Here:

```javascript
execute
```

is a higher-order function.

***

# Common Interview Questions

### Is JavaScript a First-Class Function Language?

✅ Yes

Because functions can:

```text
Assign
Pass
Return
Store
```

***

### Why are First-Class Functions Important?

They enable:

```text
✅ Callbacks
✅ Closures
✅ Currying
✅ Higher-Order Functions
✅ Functional Programming
✅ React Event Handling
```

***

# Interview Definition

> First-class functions mean that functions are treated like any other value in JavaScript. They can be assigned to variables, passed as arguments, returned from other functions, and stored inside objects or arrays. This capability enables powerful patterns such as callbacks, closures, higher-order functions, currying, promises, and React event handling.
