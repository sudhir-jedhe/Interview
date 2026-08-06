Creating a **custom `call()`** function from scratch in JavaScript will allow you to understand the underlying mechanics of how function invocation with a specific `this` context works. The `call()` method in JavaScript allows you to invoke a function with a specified `this` value and pass arguments individually (not as an array).

### Custom `call` Function Explanation

The `call()` method has the following signature:

```javascript
func.call(thisArg, arg1, arg2, ..., argN);
```

- **`thisArg`**: The value to which the `this` keyword will be set when the function is called.
- **`arg1, arg2, ..., argN`**: The arguments that will be passed to the function.

In our custom implementation:

1. We'll set the `this` context for the function.
2. We'll handle passing arguments individually.
3. We'll ensure the function is callable.
4. We'll invoke the function with the specified context and arguments.

### Custom `call()` Implementation

#### Steps

1. **Check if the `func` is a callable function**: If the provided `func` is not a function, throw a `TypeError`.
2. **Set `thisArg`**: If `thisArg` is `null` or `undefined`, set it to `globalThis` (for non-strict mode environments). If it's provided, use that as the `this` context.
3. **Handle Arguments**: Use `arguments` or `Array.prototype.slice.call()` to handle the arguments passed to the function.
4. **Invoke the Function**: Assign the `thisArg` context to the function and invoke it with the provided arguments.

### Here's the implementation

```javascript
function myCall(func, thisArg, ...args) {
  // Step 1: Check if func is callable
  if (typeof func !== "function") {
    throw new TypeError("First argument must be a function");
  }

  // Step 2: If `thisArg` is null or undefined, set it to the global object (for non-strict mode)
  if (thisArg == null) {
    thisArg = globalThis;
  }

  // Step 3: Assign the function to a temporary property of `thisArg`
  // This allows us to invoke the function with the correct `this` context
  const uniqueSymbol = Symbol(); // Creating a unique property key
  thisArg[uniqueSymbol] = func;

  // Step 4: Call the function with the arguments
  const result = thisArg[uniqueSymbol](...args);

  // Step 5: Remove the temporary property to prevent polluting the `thisArg` object
  delete thisArg[uniqueSymbol];

  // Step 6: Return the result of the function invocation
  return result;
}
```

### Example of Usage

#### 1. Invoking a Function with `thisArg`

```javascript
const person = {
  firstName: "Alice",
  lastName: "Doe",
  fullName: function() {
    return `${this.firstName} ${this.lastName}`;
  }
};

// Calling `fullName` with a custom `thisArg`
const result = myCall(person.fullName, person);
console.log(result); // Output: "Alice Doe"
```

In this example:

- The `fullName` method is invoked on the `person` object.
- The `thisArg` is explicitly set to the `person` object, and we get `"Alice Doe"` as the result.

#### 2. Using `myCall()` with a Function that Accepts Arguments

```javascript
function greet(greeting, punctuation) {
  return `${greeting}, ${this.firstName} ${this.lastName}${punctuation}`;
}

const person = {
  firstName: "Bob",
  lastName: "Smith"
};

const result = myCall(greet, person, "Hello", "!");
console.log(result); // Output: "Hello, Bob Smith!"
```

In this example:

- The `greet` function is invoked with the `thisArg` set to the `person` object.
- The arguments `"Hello"` and `"!"` are passed individually to the function.

#### 3. Using `myCall()` with `null` or `undefined` as `thisArg`

```javascript
function showMax(...numbers) {
  return Math.max(...numbers);
}

const result = myCall(showMax, null, 1, 2, 3);
console.log(result); // Output: 3
```

In this example:

- We explicitly pass `null` as the `thisArg`, which will set the `this` context to the global object (`globalThis`).
- The arguments `1, 2, 3` are passed to `Math.max()`, which returns `3`.

### Why Use a Custom `call()` Function?

1. **Understanding Function Context (`this`)**: By building a custom `call()` function, you gain a deeper understanding of how the `this` context is manipulated and how it affects function invocation.

2. **Function Invocation with Custom Context**: You can control the `this` context and pass arguments as needed, which is helpful when working with object methods or event handlers.

3. **Customizing Behavior**: While JavaScript's built-in `call()` works perfectly for most use cases, creating a custom version allows for error handling, logging, or any custom behavior you'd like to add.

### Key Points

- **`thisArg`**: The value of `this` inside the function is determined by `thisArg`. If `null` or `undefined` is passed, `this` defaults to `globalThis` in non-strict mode.
- **Arguments**: Arguments are passed as individual values, not in an array (unlike `apply()`).
- **Temporary Property**: We assign the function to a temporary property on `thisArg` to invoke it with the correct `this` context, and then we remove that property afterward to avoid side effects.

This is how you can create a custom `call()` function in JavaScript! It helps you understand how JavaScript handles function context (`this`) and how you can manipulate it in your own custom implementations.
