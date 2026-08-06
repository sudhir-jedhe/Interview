Creating a **custom `apply()` function** from scratch in JavaScript can help you understand how `apply()` works and gain insight into function invocation and the `this` context. Let's build it step by step.

### Custom `apply` Function Explanation

The `apply()` method is a built-in JavaScript function that allows you to invoke a function with a specific `this` context and pass an array (or array-like object) of arguments to that function.

A custom `apply()` function should:

1. Allow you to set the `this` context.
2. Accept arguments in the form of an array (or array-like object).
3. Call the provided function with the given context and arguments.

### Here's how to implement a custom `apply()`

#### Steps

1. **Check if the function is callable**: First, ensure that the first parameter passed is a function.
2. **Set the `this` context**: Use the `thisArg` to specify the context (`this` value) inside the function.
3. **Handle arguments**: Spread the `argsArray` into the function when calling it.
4. **Call the function**: Use JavaScript's `call()` method internally to invoke the function with the specified `this` context.

### Implementation

```javascript
function myApply(func, thisArg, argsArray) {
  // Step 1: Check if func is callable
  if (typeof func !== "function") {
    throw new TypeError("First argument must be a function");
  }

  // Step 2: Handle case where thisArg is not provided (default to the global object or null)
  if (thisArg === undefined || thisArg === null) {
    thisArg = globalThis; // For non-strict mode, globalThis is used.
  }

  // Step 3: Ensure argsArray is an array (or convert array-like objects to array)
  if (!Array.isArray(argsArray)) {
    throw new TypeError("Third argument must be an array");
  }

  // Step 4: Use `call` to invoke the function with the given `this` and arguments
  return func.apply(thisArg, argsArray);
}
```

### Example of Usage

#### 1. Calling a Function with `thisArg` and Arguments

```javascript
const person = {
  firstName: "Alice",
  lastName: "Doe",
  fullName: function() {
    return `${this.firstName} ${this.lastName}`;
  }
};

const result = myApply(person.fullName, person, []);
console.log(result); // Output: "Alice Doe"

const person = { name: "Alice" };

function greet(greeting) {
  console.log(`${greeting}, ${this.name}!`);
}

greet.apply(person, ["Hi"]); // Output: Hi, Alice!

```

In this example:

- `person.fullName` is called with `thisArg` set to the `person` object.
- `fullName` uses `this.firstName` and `this.lastName` to return `"Alice Doe"`.
- Since `fullName` does not take any arguments, an empty array `[]` is passed.

#### 2. Using `myApply` with a Built-in Function (`Math.max`)

```javascript
const result = myApply(Math.max, null, [1, 2, 3, 4]);
console.log(result); // Output: 4
```

In this example:

- `Math.max` is called with `null` as the `thisArg` (since `Math.max` doesn't require a specific `this` context).
- The array `[1, 2, 3, 4]` is passed as arguments to `Math.max`, which returns the highest value, `4`.

### Why Use `apply()`?

1. **Flexible function invocation**: `apply()` is often used when you want to call a function with a variable number of arguments, especially when the arguments are already in an array format.
2. **Custom `this` context**: `apply()` allows you to specify the value of `this` for the function being invoked. This is very useful when dealing with methods that belong to different objects or when working with JavaScript's event handlers.

### Key Points

- **Function Invocation**: `func.apply(thisArg, argsArray)` allows you to call a function with a specific context (`thisArg`) and an array of arguments (`argsArray`).
- **Error Handling**: In the custom implementation, we check if the function is callable and if the arguments are in the correct format (array).
- **Default `thisArg`**: In the case where `thisArg` is `null` or `undefined`, we default it to `globalThis`, which is the global object (in a non-strict mode environment).

### Advantages of Custom `apply()`

1. **Better understanding of `this`**: Writing your own implementation helps you better understand how the `this` context works in JavaScript.
2. **Control**: You can customize and add your own logic, validation, and error-handling mechanisms.
3. **Practical use**: Knowing how `apply()` works under the hood can help you in debugging or implementing custom utilities when working with JavaScript functions.

This is how you can implement a custom `apply()` function in JavaScript.
