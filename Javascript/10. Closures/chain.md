### Explanation of the Code:

In both versions of the `sum` function, we're using **nested functions** to create a **curried function**. Each of these inner functions "remembers" the values of the variables from their outer scopes, which is an example of how **closures** work in JavaScript.

#### Key Concepts:

1. **Closure**: A closure is a function that "remembers" its lexical environment, even when the function is executed outside of that environment.
2. **Currying**: This is a technique in functional programming where a function returns another function to take one argument at a time until all arguments are provided.

Let's break down both versions of the code:

### Version 1: Chained Function Calls (Implicit Execution)

```javascript
// global scope
const e = 10;
function sum(a) {
  return function (b) {
    return function (c) {
      // outer functions scope
      return function (d) {
        // local scope
        return a + b + c + d + e;
      };
    };
  };
}

console.log(sum(1)(2)(3)(4)); // 20
```

1. **Global Scope**:
   - A constant `e` is defined globally with the value `10`.
   
2. **sum Function**:
   - The `sum` function takes an argument `a` and returns another function that takes an argument `b`. This pattern continues, returning functions that each take one more argument (`c`, `d`, etc.).
   - The final returned function adds the values of `a`, `b`, `c`, `d`, and `e` together and returns the result.
   
3. **Flow**:
   - The function call `sum(1)(2)(3)(4)` is equivalent to:
     - `sum(1)` returns a function that takes `b`.
     - `sum(1)(2)` returns a function that takes `c`.
     - `sum(1)(2)(3)` returns a function that takes `d`.
     - `sum(1)(2)(3)(4)` computes `1 + 2 + 3 + 4 + 10`, which equals `20`.

4. **Output**:
   - `console.log(sum(1)(2)(3)(4));` prints `20`.

### Version 2: Step-by-step Function Calls (Explicit Execution)

```javascript
// global scope
function sum(a) {
  return function sum2(b) {
    return function sum3(c) {
      // outer functions scope
      return function sum4(d) {
        // local scope
        return a + b + c + d + e;
      };
    };
  };
}

const sum2 = sum(1);
const sum3 = sum2(2);
const sum4 = sum3(3);
const result = sum4(4);
console.log(result); // 20
```

1. **Global Scope**:
   - `e` is assumed to be globally defined as `10`, though it's missing in the given code snippet. If `e` is not defined globally, this would result in a `ReferenceError` at runtime. Let's assume `e` exists globally as `10`.

2. **sum Function**:
   - The `sum` function is very similar to the first version, but the function calls are made explicitly step by step.
   - Each call (`sum(1)`, `sum2(2)`, `sum3(3)`, and `sum4(4)`) returns a new function, and the final result is computed when the last function (`sum4`) is called with `4`.

3. **Flow**:
   - `const sum2 = sum(1);` calls `sum` with `a = 1`, returning a function `sum2` that expects `b`.
   - `const sum3 = sum2(2);` calls the returned function from `sum2` with `b = 2`, returning another function `sum3` that expects `c`.
   - `const sum4 = sum3(3);` calls the returned function from `sum3` with `c = 3`, returning another function `sum4` that expects `d`.
   - `const result = sum4(4);` calls the returned function from `sum4` with `d = 4`, computing `1 + 2 + 3 + 4 + 10`, which equals `20`.

4. **Output**:
   - `console.log(result);` prints `20`.

### Key Points:

1. **Function Currying**:
   - Both versions of the code use currying, which means each function returns another function that takes a single argument until all arguments are provided.
   
2. **Closures**:
   - Each inner function retains access to variables from its outer functions, including the argument values (`a`, `b`, `c`, etc.) and any global variables (`e` in this case).

3. **Both Methods**:
   - Both methods eventually lead to the same result (`20`), but the first method uses an implicit chain of function calls, while the second method calls each function explicitly and stores intermediate results in variables (`sum2`, `sum3`, `sum4`).

### Output of Both Examples:
```
20
20
```