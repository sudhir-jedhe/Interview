In JavaScript, loop flow control allows you to alter the normal execution sequence of a loop—either stopping it early, skipping an iteration, or jumping out of nested loops entirely.

---

## Key Flow Control Statements

| Statement       | What it Does                                                       | Common Use Case                              |
| --------------- | ------------------------------------------------------------------ | -------------------------------------------- |
| `break`         | Terminates the loop immediately and jumps out.                     | Exit early once a target item is found.      |
| `continue`      | Skips the rest of the current iteration and moves to the next one. | Skip invalid, empty, or unwanted values.     |
| `return`        | Exits the surrounding function immediately (stopping the loop).    | Early exit inside a function call.           |
| `Labeled break` | Breaks out of a specifically named parent/outer loop.              | Exiting nested loops without flag variables. |

---

## 1. `break` (Stop and Exit)

The `break` statement immediately stops execution of the loop body and moves control to the first line of code after the loop.

```javascript
const numbers = [10, 20, 30, 40, 50];

for (let i = 0; i < numbers.length; i++) {
  if (numbers[i] === 30) {
    console.log("Found 30! Exiting loop.");
    break; // Loop stops immediately when 30 is encountered
  }
  console.log(numbers[i]);
}

// Output:
// 10
// 20
// Found 30! Exiting loop.

```

---

## 2. `continue` (Skip Current Iteration)

The `continue` statement skips the remaining code inside the loop body for the **current iteration** and immediately moves to the next turn of the loop.

```javascript
for (let i = 1; i <= 5; i++) {
  if (i === 3) {
    continue; // Skips printing 3
  }
  console.log(`Number: ${i}`);
}

// Output:
// Number: 1
// Number: 2
// Number: 4
// Number: 5

```

---

## 3. Labeled Statements (Breaking Outer Loops)

By default, `break` or `continue` only applies to the **innermost** loop. To break out of an outer loop from inside a nested loop, assign a label to the outer loop.

```javascript
outerLoop: for (let i = 1; i <= 3; i++) {
  for (let j = 1; j <= 3; j++) {
    if (i === 2 && j === 2) {
      console.log(`Breaking outer loop at i=${i}, j=${j}`);
      break outerLoop; // Exits BOTH loops completely
    }
    console.log(`i = ${i}, j = ${j}`);
  }
}

// Output:
// i = 1, j = 1
// i = 1, j = 2
// i = 1, j = 3
// i = 2, j = 1
// Breaking outer loop at i=2, j=2

```

---

## Flow Control with Array Iteration Methods

Standard statements like `break` and `continue` behave differently depending on the loop construction:

### Modern Loops (`for...of`, `for...in`)

`break` and `continue` work normally inside modern `for...of` and `for...in` loops.

```javascript
const users = ["Alice", "Bob", "Charlie"];

for (const user of users) {
  if (user === "Bob") continue; // Works as expected
  console.log(user);
}

```

### Array Higher-Order Methods (`forEach`, `map`, `filter`)

> **Note:** You **cannot** use `break` or `continue` inside `forEach()`, `map()`, or `filter()`. Doing so throws a `SyntaxError`.

To emulate flow breaks in functional iteration:

* **To skip an iteration (`continue` equivalent):** Use `return`.
* **To stop early (`break` equivalent):** Use `.some()` or `.every()`, or use a standard `for...of` loop instead.

```javascript
const items = [1, 2, 3, 4, 5];

// 1. Skip item using `return` inside forEach
items.forEach((num) => {
  if (num === 3) return; // Works like 'continue'
  console.log(num); // Prints 1, 2, 4, 5
});

// 2. Early exit using .some()
items.some((num) => {
  if (num === 3) {
    return true; // Returning true stops .some() execution like 'break'
  }
  console.log(num); // Prints 1, 2
  return false;
});

```

How do break and continue work differently inside while and do-while loops, especially with iterator mutation?

In `while` and `do...while` loops, the syntax for `break` and `continue` is identical to standard `for` loops, but **`continue` poses a specific danger when combined with iterator mutations** (e.g., `i++`).

In a `for` loop (`for (let i = 0; i < 5; i++)`), the update expression (`i++`) is executed automatically at the end of every turn, *even when `continue` is triggered*.

In `while` and `do...while` loops, the iterator update is placed inside the loop body. If a `continue` statement is executed **before** the iterator is updated, the loop skips the increment step and jumps straight back to evaluating the condition—leading to an **infinite loop**.

---

## 1. The Infinite Loop Trap with `continue`

### Incorrect Example (Infinite Loop)

Because `i++` is placed *after* the `continue` check, when `i === 2`, `continue` executes immediately. The increment is skipped, `i` remains `2`, and the condition `i < 5` remains true forever.

```javascript
let i = 0;

while (i < 5) {
  if (i === 2) {
    continue; // ❌ DANGER: Skips i++, causing an infinite loop!
  }
  console.log(i);
  i++;
}

```

### Correct Solutions

To safely use `continue` in condition-based loops, ensure the state/iterator mutates **before** the `continue` statement executes, or place the increment inside the condition itself.

#### Option A: Increment inside the conditional branch

```javascript
let i = 0;

while (i < 5) {
  if (i === 2) {
    i++; // Mutate before skipping
    continue; 
  }
  console.log(i); // Prints: 0, 1, 3, 4
  i++;
}

```

#### Option B: Mutate directly in the condition check

```javascript
let i = 0;

// Increment happens during condition evaluation
while (i++ < 5) {
  if (i === 2) {
    continue; // Safe because 'i' has already incremented
  }
  console.log(i); // Prints: 1, 3, 4, 5
}

```

---

## 2. `break` in `while` vs. `do...while`

`break` behaves identically in both loops—it immediately halts execution and exits the loop without re-checking the condition. The only key structural difference lies in how `do...while` guarantees at least one execution pass.

### `while` Loop with `break`

If the condition is false initially, the loop body—and any `break` statement inside it—never runs.

```javascript
let i = 5;

while (i < 5) {
  if (i === 5) break; // Never reached because condition (5 < 5) is false
  console.log(i);
}

```

### `do...while` Loop with `break`

Because `do...while` executes the body **before** testing the condition, a `break` on the first line can stop the loop before the conditional evaluation is ever reached.

```javascript
let count = 0;

do {
  console.log("Executes once");
  if (count === 0) {
    break; // Stops immediately; the trailing condition 'while (count > 0)' is never evaluated
  }
  count++;
} while (count > 0);

// Output:
// "Executes once"

```

---

## Comparison Summary

| Loop Type        | `break` Behavior | `continue` Jump Target                                                | Primary Pitfall                                                 |
| ---------------- | ---------------- | --------------------------------------------------------------------- | --------------------------------------------------------------- |
| **`for`**        | Exits loop.      | Jumps to the **increment expression** (`i++`), then checks condition. | Rare iterator issues (update is part of loop header).           |
| **`while`**      | Exits loop.      | Jumps directly to the **condition check** at the top.                 | **Infinite loops** if iterator mutation comes after `continue`. |
| **`do...while`** | Exits loop.      | Jumps directly to the **condition check** at the bottom.              | **Infinite loops** if iterator mutation comes after `continue`. |

How do break and continue work inside for-await-of loops and async generators?

In asynchronous JavaScript, `break` and `continue` inside `for await...of` loops and `async generator` functions control flow similarly to synchronous loops, but with crucial under-the-hood mechanics regarding **promise resolution** and **generator cleanup (`return()` method execution)**.

---

## 1. `break` and `continue` in `for await...of` Loops

A `for await...of` loop pauses execution at each step until the Promise yielded or returned by the async iterable resolves.

```javascript
async function processStreams(asyncIterable) {
  for await (const item of asyncIterable) {
    if (item.skip) {
      continue; // Skips processing for this resolved item
    }
    
    if (item.isFatalError) {
      break; // Stops consumption, closes the stream/iterator
    }
    
    console.log("Processed:", item);
  }
}

```

### What Happens Behind the Scenes

#### `continue`

1. The current loop body execution finishes early.
2. The loop calls `.next()` on the underlying async iterator.
3. Execution pauses until the next Promise resolves.

#### `break` (and Automatic Cleanup)

1. The loop halts further consumption immediately.
2. JavaScript automatically calls the underlying async iterator’s `return()` method (if defined).
3. This allows resources—such as open HTTP streams, database cursors, or file handles—to release memory and clean up gracefully.

```javascript
// Example demonstrating automatic cleanup on 'break'
const customAsyncIterable = {
  [Symbol.asyncIterator]() {
    let count = 0;
    return {
      async next() {
        if (count < 5) return { value: ++count, done: false };
        return { done: true };
      },
      async return() {
        console.log("Cleanup executed: Async iterator closed early.");
        return { done: true };
      }
    };
  }
};

(async () => {
  for await (const val of customAsyncIterable) {
    if (val === 2) {
      console.log("Breaking at", val);
      break; // Automatically invokes customAsyncIterable's return() method
    }
  }
})();

// Output:
// Breaking at 2
// Cleanup executed: Async iterator closed early.

```

---

## 2. `break` and `continue` Inside `async function*` (Async Generators)

Inside an async generator function, `yield` pauses the generator until the caller requests the next item. Using `break` or `continue` inside an async generator controls the inner loop logic, affecting when and what values are yielded.

```javascript
async function* fetchPagesGenerator(totalPages) {
  for (let page = 1; page <= totalPages; page++) {
    const data = await fetchPageData(page);

    if (data.isEmpty) {
      continue; // Skip yielding empty pages; moves to next page iteration
    }

    if (data.hasError) {
      console.log("Error encountered, stopping generator early.");
      break; // Stops generator loop; generator moves to 'done: true' state
    }

    yield data;
  }
}

```

---

## 3. What Happens When a Consumer Breaks an Async Generator? (`try...finally`)

When a consumer uses `break` while consuming an `async function*` via `for await...of`, the JavaScript engine injects a `return()` call into the generator at the point of the suspended `yield`.

If the generator has a `try...finally` block around the `yield`, **the `finally` block is guaranteed to run when the consumer breaks**.

```javascript
async function* generateData() {
  try {
    console.log("Resource opened");
    yield 1;
    yield 2;
    yield 3;
  } finally {
    // This executes when a consumer breaks out of the loop early!
    console.log("Resource cleaned up in generator finally block");
  }
}

(async () => {
  for await (const num of generateData()) {
    console.log("Consumer received:", num);
    if (num === 1) {
      break; // Exit loop early
    }
  }
})();

// Output:
// Resource opened
// Consumer received: 1
// Resource cleaned up in generator finally block

```

---

## Behavior Summary Matrix

| Scenario                                 | `continue` Behavior                                                                     | `break` Behavior                                                                                                |
| ---------------------------------------- | --------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| **`for await...of` loop**                | Awaits current promise, skips remaining body code, requests `.next()` from iterator.    | Stops loop, awaits any active promise, and calls `iterator.return()` for cleanup.                               |
| **Inside `async function***`             | Skips current iteration logic and moves to the next turn (evaluating the next `yield`). | Exits the generator's internal loop, executing any `finally` blocks before completing the generator.            |
| **Consumer breaks an `async function***` | N/A                                                                                     | Injects `.return()` into the generator at the active `yield`, triggering `finally` blocks inside the generator. |
