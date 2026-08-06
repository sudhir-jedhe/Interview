Creating a **custom `bind()`** function is a great way to understand how JavaScript handles function contexts and how function binding works. The `bind()` method allows you to create a new function that, when called, has its `this` value set to a specific value, and optionally, you can also pre-apply arguments.

### `bind()` Function Explanation

In JavaScript, `bind()` is used to create a new function where the `this` context is fixed and arguments can be preset.

```javascript
const newFunc = func.bind(thisArg, arg1, arg2, ...);
```

- **`thisArg`**: The value that will be assigned to `this` when the function is called.
- **`arg1, arg2, ...`**: Arguments that will be passed to the function when it is invoked. These arguments are "pre-set" before the function is called.

A **custom `bind()`** function will:

1. Bind the `this` context to the given `thisArg`.
2. Optionally allow you to pass in pre-set arguments.
3. Return a new function that can be invoked later.

### Custom `bind()` Implementation

The process involves the following steps:

1. **Create a closure**: The custom `bind()` function needs to return a new function that remembers the `this` context and any initial arguments.
2. **Handle arguments passed to the new function**: When the returned function is called, it should combine the pre-set arguments and any arguments passed during invocation.
3. **Invoke the original function with the correct context and arguments**.

### Custom `bind()` Function Code

```javascript
function myBind(func, thisArg, ...boundArgs) {
  // Step 1: Check if the provided func is a function
  if (typeof func !== "function") {
    throw new TypeError("First argument must be a function");
  }

  // Step 2: Return a new function that binds the context and arguments
  return function(...args) {
    // Combine the pre-set arguments (boundArgs) with any arguments passed when the function is called
    return func.apply(thisArg, [...boundArgs, ...args]);
  };
}
```

### Explanation

- **`func`**: The function we want to bind (must be callable).
- **`thisArg`**: The value to which `this` should be set when `func` is invoked.
- **`boundArgs`**: The arguments that are pre-set when `bind()` is called.
- **Returned function**: The new function, when called, combines `boundArgs` with any arguments passed to it and invokes the original function (`func`) with the `thisArg` context.

### Example Usage

#### 1. Basic Example with `thisArg`

```javascript
const person = {
  firstName: "John",
  lastName: "Doe",
  fullName: function() {
    return `${this.firstName} ${this.lastName}`;
  }
};

const boundFullName = myBind(person.fullName, person);

console.log(boundFullName()); // Output: John Doe
```

- `myBind(person.fullName, person)` binds the `this` context to `person`.
- When `boundFullName()` is called, the `this` inside `fullName` refers to `person`, so it returns `"John Doe"`.

#### 2. Example with Pre-set Arguments

```javascript
function greet(greeting, punctuation) {
  return `${greeting}, ${this.firstName} ${this.lastName}${punctuation}`;
}

const person = {
  firstName: "Alice",
  lastName: "Johnson"
};

// Bind with a pre-set greeting
const greetAlice = myBind(greet, person, "Hello");

console.log(greetAlice("!")); // Output: Hello, Alice Johnson!
```

- `myBind(greet, person, "Hello")` pre-sets the `greeting` argument to `"Hello"`.
- When `greetAlice("!")` is called, the final result is `"Hello, Alice Johnson!"` because the pre-set argument `"Hello"` is combined with the argument `"!"`.

#### 3. Example with Multiple Pre-set Arguments

```javascript
function add(a, b, c) {
  return a + b + c;
}

const add10 = myBind(add, null, 10);  // Bind `add` with first argument set to 10

console.log(add10(5, 2)); // Output: 17 (10 + 5 + 2)
```

- `myBind(add, null, 10)` binds the `a` parameter of `add` to `10`.
- When `add10(5, 2)` is called, the final sum is `10 + 5 + 2 = 17`.

#### 4. Example with `thisArg` as `null` or `undefined`

```javascript
function sayHello() {
  return `Hello, ${this.name || "Guest"}`;
}

const sayHelloGuest = myBind(sayHello, null);

console.log(sayHelloGuest()); // Output: Hello, Guest
```

- Since `thisArg` is `null`, the `this` context inside `sayHello` defaults to `globalThis` (or `window` in browsers), and we use `"Guest"` as the default name.

### Key Points

- **Pre-set arguments**: The custom `bind()` allows you to pre-set arguments that are passed when the new function is called.
- **New function**: `bind()` always returns a new function that can be invoked later with the `this` context and pre-set arguments.
- **`thisArg`**: The context (`this`) is set to `thisArg` when the function is executed.

### Why Custom `bind()`?

- **Understanding closures**: The custom `bind()` function helps you understand closures, as the returned function retains access to the arguments (`boundArgs`) and the `this` context (`thisArg`).
- **Learning JavaScript's function invocation**: Implementing `bind()` from scratch gives insight into how JavaScript's function invocation and context management works under the hood.
- **Custom behavior**: You can modify the custom `bind()` to add custom logic, logging, or other functionality while binding the `this` context and arguments.

This approach provides a clear understanding of how `bind()` works and how you can replicate it in your own code!
