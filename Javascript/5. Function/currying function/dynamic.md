**Dynamic Currying Sum** is a classic JavaScript interview question that tests:

* Closures
* Currying
* Function chaining
* Type coercion (`valueOf` / `toString`)
* Recursion

***

# Problem 1

Support:

```js
sum(1)(2)(3)(); // 6
sum(5)(10)(15)(20)(); // 50
```

### Solution

```js
function sum(a) {
  let total = a;

  function inner(b) {
    if (b === undefined) {
      return total;
    }

    total += b;
    return inner;
  }

  return inner;
}
```

### Usage

```js
console.log(sum(1)(2)(3)()); // 6
console.log(sum(10)(20)(30)(40)()); // 100
```

***

# Problem 2 (Most Common Interview Version)

Support:

```js
sum(1)(2)(3)
sum(1)(2)(3)(4)
sum(10)(20)
```

without requiring the final `()`.

### Solution Using `valueOf`

```js
function sum(a) {
  let total = a;

  function inner(b) {
    total += b;
    return inner;
  }

  inner.valueOf = () => total;
  inner.toString = () => String(total);

  return inner;
}
```

### Usage

```js
console.log(sum(1)(2)(3) + 0);
```

Output:

```js
6
```

***

### Examples

```js
console.log(sum(1)(2)(3) + 0);

console.log(sum(10)(20)(30) + 0);

console.log(Number(sum(5)(5)(5)));

console.log(`${sum(1)(2)(3)(4)}`);
```

Output

```js
6
60
15
10
```

***

# Enhanced Version (Variable Arguments)

Support:

```js
sum(1, 2)(3, 4)(5)
```

Output:

```js
15
```

### Solution

```js
function sum(...args) {
  let total = args.reduce(
    (acc, curr) => acc + curr,
    0
  );

  function inner(...nextArgs) {
    total += nextArgs.reduce(
      (acc, curr) => acc + curr,
      0
    );

    return inner;
  }

  inner.valueOf = () => total;
  inner.toString = () => String(total);

  return inner;
}
```

### Usage

```js
console.log(sum(1, 2)(3, 4)(5) + 0);

console.log(sum(10)(20, 30)(40) + 0);
```

Output

```js
15
100
```

***

# Infinite Currying

Support:

```js
sum(1)(2)(3)(4)(5)...
```

until conversion happens.

```js
console.log(sum(1)(2)(3)(4));
```

### Solution

```js
function sum(a) {
  let total = a;

  function inner(b) {
    total += b;
    return inner;
  }

  inner.valueOf = () => total;

  return inner;
}
```

### Usage

```js
console.log(sum(1)(2)(3)(4) + 0);
```

Output:

```js
10
```

***

# Generic Curry Utility (Senior-Level)

```js
function curry(fn) {
  return function curried(...args) {
    if (args.length >= fn.length) {
      return fn(...args);
    }

    return (...nextArgs) =>
      curried(...args, ...nextArgs);
  };
}
```

### Example

```js
function add(a, b, c) {
  return a + b + c;
}

const curriedAdd = curry(add);

console.log(
  curriedAdd(1)(2)(3)
);

console.log(
  curriedAdd(1, 2)(3)
);

console.log(
  curriedAdd(1)(2, 3)
);
```

Output:

```js
6
6
6
```

***

# Interview Explanation

For:

```js
sum(1)(2)(3)
```

Execution flow:

```text
sum(1)
  total = 1

(2)
  total = 3

(3)
  total = 6

console.log()
  valueOf() -> 6
```

Key concepts:

* Closure keeps `total` alive across calls
* Each call returns the same function
* `valueOf()` enables automatic primitive conversion
* Time Complexity: **O(n)** where `n` is the number of values added
* Space Complexity: **O(1)** (excluding call chain metadata)

### Senior React/JavaScript Interview Follow-up

Interviewers often ask:

```js
sum(1)(2)(3) == 6
```

or

```js
console.log(sum(1)(2)(3));
```

To support that elegantly, implement both:

```js
inner.valueOf = () => total;
inner.toString = () => String(total);
inner[Symbol.toPrimitive] = () => total;
```

This is the most robust production-quality implementation.
