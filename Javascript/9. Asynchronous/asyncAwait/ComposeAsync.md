# ComposeAsync (Async Function Composition)

A common **Senior JavaScript / React interview** question is implementing a `composeAsync()` utility that composes multiple async (or sync) functions from **right to left**. Async composition is a recognised pattern in JavaScript functional programming. [\[30secondsofcode.org\]](https://www.30secondsofcode.org/js/s/async-function-composition/), [\[stackoverflow.com\]](https://stackoverflow.com/questions/70050001/javascript-how-to-compose-asynchronous-functions)

## Goal

```js
const add1 = async (x) => x + 1;
const multiply2 = async (x) => x * 2;
const subtract5 = async (x) => x - 5;

const composed = composeAsync(
  subtract5,
  multiply2,
  add1
);

const result = await composed(10);

console.log(result);
```

Execution:

```text
10
 ↓ add1
11
 ↓ multiply2
22
 ↓ subtract5
17
```

Output:

```js
17
```

***

# Implementation

```js
function composeAsync(...fns) {
  return async function (value) {
    let result = value;

    for (let i = fns.length - 1; i >= 0; i--) {
      result = await fns[i](result);
    }

    return result;
  };
}
```

***

# Functional Style (Most Common)

Uses `reduceRight()` as often shown in async composition examples. [\[30secondsofcode.org\]](https://www.30secondsofcode.org/js/s/async-function-composition/)

```js
const composeAsync =
  (...fns) =>
  (value) =>
    fns.reduceRight(
      (promise, fn) =>
        promise.then(fn),
      Promise.resolve(value)
    );
```

***

# Example

```js
const add1 = async (x) => x + 1;

const multiply2 = async (x) =>
  new Promise((resolve) =>
    setTimeout(
      () => resolve(x * 2),
      1000
    )
  );

const subtract5 = async (x) => x - 5;

const calculate =
  composeAsync(
    subtract5,
    multiply2,
    add1
  );

(async () => {
  const result =
    await calculate(10);

  console.log(result);
})();
```

Output:

```text
17
```

***

# Support Both Sync and Async Functions

```js
function composeAsync(...fns) {
  return async function (value) {
    return fns.reduceRight(
      async (acc, fn) =>
        fn(await acc),
      Promise.resolve(value)
    );
  };
}
```

Usage:

```js
const add = (x) => x + 2;

const fetchData = async (x) =>
  x * 3;

const final = (x) => x - 1;

const pipeline =
  composeAsync(
    final,
    fetchData,
    add
  );

console.log(
  await pipeline(5)
);
```

Output:

```text
20
```

***

# PipeAsync (Left to Right)

Interviewers often ask the difference.

```js
const pipeAsync =
  (...fns) =>
  (value) =>
    fns.reduce(
      (promise, fn) =>
        promise.then(fn),
      Promise.resolve(value)
    );
```

### Example

```js
const process =
  pipeAsync(
    add1,
    multiply2,
    subtract5
  );

await process(10);
```

Flow:

```text
10
 ↓
add1
 ↓
multiply2
 ↓
subtract5
```

***

# Error Handling Version

```js
function composeAsync(...fns) {
  return async function (value) {
    try {
      return await fns.reduceRight(
        async (accPromise, fn) => {
          const acc =
            await accPromise;

          return fn(acc);
        },
        Promise.resolve(value)
      );
    } catch (error) {
      console.error(
        "Pipeline Error:",
        error
      );

      throw error;
    }
  };
}
```

***

# Advanced Version With Multiple Arguments

```js
function composeAsync(...fns) {
  return async (...args) => {
    let result =
      await fns[
        fns.length - 1
      ](...args);

    for (
      let i = fns.length - 2;
      i >= 0;
      i--
    ) {
      result =
        await fns[i](result);
    }

    return result;
  };
}
```

Usage:

```js
const sum = async (a, b) =>
  a + b;

const double = async (x) =>
  x * 2;

const square = async (x) =>
  x * x;

const calculate =
  composeAsync(
    square,
    double,
    sum
  );

console.log(
  await calculate(2, 3)
);
```

Output:

```text
100
```

Calculation:

```text
2 + 3 = 5
5 * 2 = 10
10 * 10 = 100
```

***

# TypeScript Version

```ts
type AsyncFn<T = any> = (
  arg: T
) => Promise<T> | T;

export function composeAsync(
  ...fns: AsyncFn[]
) {
  return async (
    value: any
  ): Promise<any> => {
    return fns.reduceRight(
      async (acc, fn) =>
        fn(await acc),
      Promise.resolve(value)
    );
  };
}
```

***

# Interview Discussion

### compose

```text
Right → Left
```

```js
compose(f, g, h)

f(g(h(x)))
```

### pipe

```text
Left → Right
```

```js
pipe(h, g, f)

f(g(h(x)))
```

### Complexity

For:

```js
composeAsync(f1,f2,...fn)
```

```text
Time  : O(n)
Space : O(n)
```

where `n` is the number of functions.

### Real-World Use Cases

* API response transformations
* Validation pipelines
* Data formatting chains
* Middleware execution
* React Query data processing
* Form submission pipelines

A concise interview answer is:

> `composeAsync` chains async functions from right to left, awaiting each result before passing it to the next function. The cleanest implementation uses `reduceRight()` with `Promise.resolve()` and works with both synchronous and asynchronous functions. [\[30secondsofcode.org\]](https://www.30secondsofcode.org/js/s/async-function-composition/), [\[stackoverflow.com\]](https://stackoverflow.com/questions/70050001/javascript-how-to-compose-asynchronous-functions)
