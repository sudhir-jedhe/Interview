```js
// compose.js

export function compose(funcs) {
  return function (x) {
    return funcs.reduceRight((acc, fn) => fn(acc), x);
  };
}

// Example functions
function double(x) {
  return x * 2;
}

function square(x) {
  return x * x;
}

function addOne(x) {
  return x + 1;
}

// Array of functions
const functions = [double, square, addOne];

// Compose the functions
const composedFunction = compose(functions);

// Test the composed function
console.log(composedFunction(3)); // Output: 19 (addOne(square(double(3))))

```