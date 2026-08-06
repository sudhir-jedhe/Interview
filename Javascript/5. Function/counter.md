### Task Overview

We need to create a `counter` function that behaves differently based on the context:

1. **Counter Object with Methods**: A counter object should be created that can be incremented or decremented with specific methods, and the current value should be retrievable.
2. **Counter with a Closure**: Another version uses closures to keep the state of the counter private.
3. **Counter with Read-Only Property**: A version that increments a counter each time it's accessed, but does not allow direct modification of the counter.
4. **Counter with Increment and Reset**: A counter that increments and resets, based on given instructions.

### 1. **Counter Object with Methods**:
This creates a counter object with methods to increment, decrement, and get the value.

```javascript
function Counter() {
  let count = 0;

  return {
    get() {
      return count;
    },
    increment() {
      count++;
    },
    decrement() {
      count--;
    },
  };
}

// Example usage:
const counter = Counter();

console.log(counter.get()); // 0
counter.increment();
console.log(counter.get()); // 1
counter.decrement();
console.log(counter.get()); // 0
```

### 2. **Counter with Closure**:
This version creates a closure where the counter's state is private, and the `modify` function handles incrementing or decrementing the count.

```javascript
function counter() {
  let count = 0;

  function increment() {
    count++;
  }

  function decrement() {
    count--;
  }

  function modify(val) {
    if (val === "1") increment();
    else if (val === "0") decrement();
    return count;
  }

  return modify;
}

const closure = counter();
console.log(closure("1")); // Increment and returns 1
console.log(closure("0")); // Decrement and returns 0
```

### 3. **Counter with Read-Only Property**:
This version returns an object where the `count` property increments automatically each time it's accessed. The value can't be modified directly.

```javascript
function createCounter() {
  let count = 0;

  return {
    get count() {
      return count++;
    }
  };
}

// Example usage:
const counter = createCounter();
console.log(counter.count); // 0
console.log(counter.count); // 1
console.log(counter.count); // 2
counter.count = 100; // This won't change the value
console.log(counter.count); // 3
```

### 4. **Counter with Increment, Decrement, and Reset**:
This version allows incrementing, decrementing, and resetting the counter to its initial value.

```javascript
var createCounter = function(init) {
  let cnt = init;
  return {
    increment: () => cnt += 1,
    decrement: () => cnt -= 1,
    reset: () => cnt = init,
    get: () => cnt
  };
};

// Example usage:
const counter = createCounter(5);
console.log(counter.get()); // 5
console.log(counter.increment()); // 6
console.log(counter.reset()); // 5
console.log(counter.decrement()); // 4
```

### Summary of Solutions:

- **Counter Object**: Use methods like `get`, `increment`, and `decrement` to control the count.
- **Counter with Closure**: A closure maintains the counter's state privately, and external functions interact with it.
- **Counter with Read-Only Property**: The `count` property increments automatically on each access.
- **Counter with Increment, Decrement, and Reset**: This implementation includes all three actions — `increment`, `decrement`, and `reset`.

These are all valid approaches depending on how you want the counter to behave and whether you need to maintain encapsulation, control access, or expose the counter directly.


/******************/
# Function Call Counter (JavaScript Interview)

A **Function Call Counter** is a common interview problem that tests:

* Closures
* Higher-Order Functions
* Function Wrappers (Decorators)
* Proxies
* JavaScript Function Objects

Common approaches include using a counter variable, wrapper functions, closures, or ES6 Proxy objects. [\[geeksforgeeks.org\]](https://www.geeksforgeeks.org/javascript/how-to-find-out-how-many-times-a-function-is-called-with-javascript/), [\[xjavascript.com\]](https://www.xjavascript.com/blog/how-do-i-find-out-how-many-times-a-function-is-called-with-javascript-jquery/)

***

# Problem Statement

Implement:

```js
const fn = createCounter(myFunction);

fn();
fn();
fn();

console.log(fn.getCount());
```

Output:

```text
3
```

***

# Solution 1: Closure-Based Counter (Most Common)

```js
function createCounter(fn) {
  let count = 0;

  function wrapper(...args) {
    count++;

    return fn(...args);
  }

  wrapper.getCount = () => count;

  return wrapper;
}
```

### Usage

```js
function greet(name) {
  console.log(
    `Hello ${name}`
  );
}

const countedGreet =
  createCounter(greet);

countedGreet("Sudhir");
countedGreet("John");
countedGreet("Mike");

console.log(
  countedGreet.getCount()
);
```

Output:

```text
Hello Sudhir
Hello John
Hello Mike

3
```

This uses a closure to keep a private counter while forwarding calls to the original function. [\[stackoverflow.com\]](https://stackoverflow.com/questions/7243101/function-count-calls), [\[github.com\]](https://github.com/javascript-tutorial/en.javascript.info/blob/master/1-js/06-advanced-functions/09-call-apply-decorators/article.md)

***

# Solution 2: Return Call Count Every Time

```js
function createCounter() {
  let count = 0;

  return function () {
    return ++count;
  };
}
```

Usage:

```js
const counter =
  createCounter();

console.log(counter());
console.log(counter());
console.log(counter());
```

Output:

```js
1
2
3
```

***

# Solution 3: Function Property

JavaScript functions are objects, so they can store state.

```js
function greet() {
  greet.count =
    (greet.count || 0) + 1;

  console.log("Hello");
}
```

Usage:

```js
greet();
greet();
greet();

console.log(
  greet.count
);
```

Output:

```text
3
```

Function-object counters are another frequently used technique. [\[stackoverflow.com\]](https://stackoverflow.com/questions/31740692/count-functions-calls-with-javascript), [\[stackoverflow.com\]](https://stackoverflow.com/questions/7243101/function-count-calls)

***

# Solution 4: Proxy Based (Senior Level)

```js
function greet(name) {
  console.log(
    `Hello ${name}`
  );
}

let count = 0;

const trackedGreet =
  new Proxy(greet, {
    apply(
      target,
      thisArg,
      args
    ) {
      count++;

      console.log(
        "Call:",
        count
      );

      return Reflect.apply(
        target,
        thisArg,
        args
      );
    },
  });
```

Usage:

```js
trackedGreet("Sudhir");
trackedGreet("John");
trackedGreet("Mike");
```

Output:

```text
Call: 1
Hello Sudhir

Call: 2
Hello John

Call: 3
Hello Mike
```

Using a Proxy allows interception of function calls without modifying the original function. [\[geeksforgeeks.org\]](https://www.geeksforgeeks.org/javascript/how-to-find-out-how-many-times-a-function-is-called-with-javascript/), [\[xjavascript.com\]](https://www.xjavascript.com/blog/how-do-i-find-out-how-many-times-a-function-is-called-with-javascript-jquery/)

***

# React Hook Version

```tsx
import { useRef } from "react";

function useCallCounter() {
  const countRef =
    useRef(0);

  const increment =
    () => {
      countRef.current++;
    };

  return {
    increment,
    getCount: () =>
      countRef.current,
  };
}
```

Usage:

```tsx
const {
  increment,
  getCount,
} = useCallCounter();

increment();
increment();

console.log(
  getCount()
);
```

***

# TypeScript Version

```ts
function createCounter<T>(
  fn: (...args: any[]) => T
) {
  let count = 0;

  const wrapper = (
    ...args: any[]
  ): T => {
    count++;

    return fn(...args);
  };

  wrapper.getCount =
    (): number => count;

  return wrapper;
}
```

***

# Follow-Up Interview Question

### Count Calls Per Argument

```js
counter("A");
counter("A");
counter("B");
```

Output:

```js
{
  A: 2,
  B: 1
}
```

```js
function trackCalls(fn) {
  const calls =
    new Map();

  return function (
    arg
  ) {
    calls.set(
      arg,
      (calls.get(arg) ||
        0) + 1
    );

    console.log(
      calls
    );

    return fn(arg);
  };
}
```

***

# Complexity

### Per Function Call

```text
Time:  O(1)

Space: O(1)
```

***

# Senior Interview Answer

> The cleanest solution is to create a higher-order function that wraps the original function and stores a private counter inside a closure. Every invocation increments the counter before forwarding the call. This keeps counting logic separate from business logic and follows the decorator pattern. [\[github.com\]](https://github.com/javascript-tutorial/en.javascript.info/blob/master/1-js/06-advanced-functions/09-call-apply-decorators/article.md), [\[geeksforgeeks.org\]](https://www.geeksforgeeks.org/javascript/how-to-find-out-how-many-times-a-function-is-called-with-javascript/)
