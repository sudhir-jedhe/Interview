# Currying with Closures

Currying transforms a function taking multiple arguments into a sequence of functions each taking one, using closures to accumulate arguments across calls:

```js
function curry(a) {
  return function(b) {
    return function(c) {
      return a + b + c; // closes over a and b from the outer calls
    };
  };
}
console.log(curry(1)(2)(3)); // 6
```

Each nested function forms a closure over the parameters accumulated from every outer call so far. This is also naturally expressible with arrow functions:

```js
const add = (a) => (b) => (c) => a + b + c;
console.log(add(1)(2)(3)); // 6

const addFive = add(5);     // partially applied, closes over a=5
console.log(addFive(2)(3)); // 10
```

`addFive` is itself a useful, independently reusable function — it's just `add` with `a` permanently fixed to `5` via closure, which is a form of partial application. This pattern is common in functional-style utility libraries and in composing configuration-driven functions (e.g. `const withTax = applyRate(0.08)`).
