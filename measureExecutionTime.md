# Measure Function Execution Time (JavaScript Interview)

This is a common JavaScript/React interview question.

The modern recommended approach is to use **`performance.now()`**, which provides higher-resolution timing than `Date.now()`. [\[stackoverflow.com\]](https://stackoverflow.com/questions/313893/how-to-measure-time-taken-by-a-function-to-execute), [\[medium.com\]](https://medium.com/@AlexanderObregon/getting-accurate-time-with-javascript-performance-now-ccd658a97ab3)

---

# 1. Basic Solution

```js
function measureExecutionTime(fn) {
  const start = performance.now();

  const result = fn();

  const end = performance.now();

  console.log(`Execution Time: ${end - start} ms`);

  return result;
}
```

### Usage

```js
function heavyTask() {
  let sum = 0;

  for (let i = 0; i < 1000000; i++) {
    sum += i;
  }

  return sum;
}

measureExecutionTime(heavyTask);
```

Output:

```text
Execution Time: 3.45 ms
```

`performance.now()` is commonly used for measuring elapsed execution time. [\[stackoverflow.com\]](https://stackoverflow.com/questions/313893/how-to-measure-time-taken-by-a-function-to-execute), [\[geeksforgeeks.org\]](https://www.geeksforgeeks.org/javascript/how-to-measure-time-taken-by-a-function-to-execute-using-javascript/)

---

# 2. Generic Wrapper

```js
function measure(fn) {
  return (...args) => {
    const start = performance.now();

    const result = fn(...args);

    const end = performance.now();

    console.log(`${fn.name} took ${end - start} ms`);

    return result;
  };
}
```

### Usage

```js
function add(a, b) {
  return a + b;
}

const measuredAdd = measure(add);

console.log(measuredAdd(10, 20));
```

Output

```text
add took 0.03 ms

30
```

---

# 3. Async Function Version

Interviewers often ask:

```text
What if the function returns a Promise?
```

```js
async function measureAsync(fn, ...args) {
  const start = performance.now();

  const result = await fn(...args);

  const end = performance.now();

  console.log(`Execution Time: ${end - start} ms`);

  return result;
}
```

### Usage

```js
async function fetchData() {
  return new Promise((resolve) => setTimeout(() => resolve("Success"), 1000));
}

measureAsync(fetchData);
```

Output:

```text
Execution Time: 1002 ms
```

---

# 4. Higher-Order Function (Production Style)

```js
function withExecutionTime(fn) {
  return async function (...args) {
    const start = performance.now();

    const result = await fn(...args);

    const end = performance.now();

    console.log({
      function: fn.name,
      executionTime: `${(end - start).toFixed(2)} ms`,
    });

    return result;
  };
}
```

### Usage

```js
const wrapped = withExecutionTime(fetchData);

await wrapped();
```

---

# 5. Using console.time()

JavaScript also provides:

```js
console.time("heavyTask");

heavyTask();

console.timeEnd("heavyTask");
```

Output:

```text
heavyTask: 3.8ms
```

`console.time()` and `console.timeEnd()` are built-in timing utilities for measuring code execution duration. [\[stackoverflow.com\]](https://stackoverflow.com/questions/313893/how-to-measure-time-taken-by-a-function-to-execute), [\[geeksforgeeks.org\]](https://www.geeksforgeeks.org/javascript/how-to-measure-time-taken-by-a-function-to-execute-using-javascript/)

---

# TypeScript Version

```ts
function measure<T>(fn: (...args: any[]) => T) {
  return (...args: any[]): T => {
    const start = performance.now();

    const result = fn(...args);

    const end = performance.now();

    console.log(`${fn.name} took ${end - start} ms`);

    return result;
  };
}
```

---

# Senior Interview Follow-Ups

### Benchmark Multiple Runs

```js
function benchmark(fn, iterations = 1000) {
  const start = performance.now();

  for (let i = 0; i < iterations; i++) {
    fn();
  }

  const end = performance.now();

  return (end - start) / iterations;
}
```

---

### Compare Two Functions

```js
const fast = benchmark(fn1);

const slow = benchmark(fn2);

console.log(fast < slow ? "fn1 faster" : "fn2 faster");
```

---

# Complexity

```text
Timing Wrapper:
Time  : O(1)

Memory: O(1)
```

### Interview Answer

> Use `performance.now()` before and after executing the function, then subtract the timestamps to get the execution duration. For asynchronous functions, await the result before capturing the end time. `performance.now()` is preferred because it provides higher precision than `Date.now()`. [\[stackoverflow.com\]](https://stackoverflow.com/questions/313893/how-to-measure-time-taken-by-a-function-to-execute), [\[medium.com\]](https://medium.com/@AlexanderObregon/getting-accurate-time-with-javascript-performance-now-ccd658a97ab3)
