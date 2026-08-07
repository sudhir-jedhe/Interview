**JavaScript Control Flow** refers to the order in which statements are executed in a script. By default, code executes sequentially from top to bottom. Control flow statements interrupt or direct this path based on logic, conditions, or repetitive tasks.

Here is a comprehensive breakdown of the core control flow mechanisms in JavaScript.

---

## 1. Conditional Statements (Decision Making)

Conditional statements execute specific code blocks only if a designated condition evaluates to `true` (or a *truthy* value).

### `if`, `else if`, `else`

Used to execute different blocks based on boolean conditions.

```javascript
const score = 85;

if (score >= 90) {
  console.log("Grade: A");
} else if (score >= 80) {
  console.log("Grade: B"); // Executed
} else {
  console.log("Grade: C");
}

```

### Ternary Operator (`condition ? exprIfTrue : exprIfFalse`)

A concise alternative to single `if...else` statements for assigning values or evaluating expressions.

```javascript
const age = 20;
const status = age >= 18 ? "Adult" : "Minor"; // "Adult"

```

### `switch` Statement

Evaluates an expression against multiple potential `case` matches using strict equality (`===`).

```javascript
const day = "MONDAY";

switch (day) {
  case "MONDAY":
    console.log("Start of the work week.");
    break; // Prevents fall-through to the next case
  case "FRIDAY":
    console.log("Weekend is close.");
    break;
  default:
    console.log("Mid-week day.");
}

```

---

## 2. Iteration & Loops (Repetition)

Loops repeatedly execute a block of code as long as a condition holds true or until an iterable is fully processed.

### Standard Loops (`for`, `while`, `do...while`)

```javascript
// Standard 'for' loop - best for indexed iteration with known bounds
for (let i = 0; i < 3; i++) {
  console.log(`Index: ${i}`);
}

// 'while' loop - evaluates condition BEFORE executing body
let count = 0;
while (count < 3) {
  console.log(`Count: ${count}`);
  count++;
}

// 'do...while' loop - executes body AT LEAST ONCE before testing condition
let num = 5;
do {
  console.log(`Num: ${num}`); // Runs once even though num >= 3
  num++;
} while (num < 3);

```

### Modern Iteration Loops (`for...of`, `for...in`)

```javascript
// 'for...of' - Iterates over VALUES of an iterable (Arrays, Strings, Sets, Maps)
const colors = ["red", "green", "blue"];
for (const color of colors) {
  console.log(color);
}

// 'for...in' - Iterates over ENUMERABLE PROPERTY KEYS of an object
const user = { name: "Alice", role: "Admin" };
for (const key in user) {
  console.log(`${key}: ${user[key]}`);
}

```

---

## 3. Loop Flow Interruptions (`break`, `continue`, Labels)

You can alter normal loop execution using flow statements:

* **`break`**: Exits the loop or `switch` immediately.
* **`continue`**: Skips the rest of the current iteration and jumps to the next turn.
* **Labeled Statements**: Allows a `break` or `continue` to target an outer parent loop rather than just the innermost loop.

```javascript
outerLoop: for (let i = 1; i <= 3; i++) {
  for (let j = 1; j <= 3; j++) {
    if (i === 2 && j === 2) {
      break outerLoop; // Halts BOTH loops immediately
    }
    console.log(`i=${i}, j=${j}`);
  }
}

```

---

## 4. Exceptional Control Flow (`try...catch...finally`)

Exception handling routes execution to an error-handling block whenever a runtime error is thrown or explicitly raised via `throw`.

```javascript
function parseData(jsonString) {
  try {
    const data = JSON.parse(jsonString); // May throw SyntaxError
    return data;
  } catch (error) {
    console.error("Failed to parse JSON:", error.message);
    return null; // Graceful fallback
  } finally {
    console.log("Parsing attempt completed."); // ALWAYS runs regardless of success or failure
  }
}

```

---

## 5. Asynchronous Control Flow

JavaScript executes on a single thread. Asynchronous control flow mechanisms handle non-blocking operations like network requests or timers without freezing the main execution path.

### Promises & `async/await`

`async/await` simplifies asynchronous control flow by making asynchronous operations read sequentially, similar to synchronous code.

```javascript
async function fetchUserData(userId) {
  try {
    const response = await fetch(`https://api.example.com/users/${userId}`);
    if (!response.ok) throw new Error("User not found");
    
    const user = await response.json();
    return user;
  } catch (err) {
    console.error("Async error caught:", err);
  }
}

```

### Asynchronous Iteration (`for await...of`)

Used to consume streams, paginated endpoints, or `async generator` functions sequentially.

```javascript
async function processStream(asyncIterable) {
  for await (const chunk of asyncIterable) {
    console.log("Received chunk:", chunk);
  }
}

```

---

## Control Flow Comparison Summary

| Control Mechanism   | Trigger / Evaluation                  | Primary Use Case                                                 |
| ------------------- | ------------------------------------- | ---------------------------------------------------------------- |
| **`if...else`**     | Boolean expression evaluation         | Branching based on dynamic conditions.                           |
| **`switch`**        | Value matching (`===`)                | Evaluating a single variable against multiple discrete options.  |
| **`for` / `while**` | Condition state                       | Executing code blocks repeatedly until a condition changes.      |
| **`for...of`**      | Iterable protocol (`Symbol.iterator`) | Traversing arrays, strings, sets, and maps safely.               |
| **`try...catch`**   | Exceptions / Errors                   | Guarding against runtime crashes and handling failure states.    |
| **`async / await`** | Promise resolution state              | Managing sequential asynchronous tasks without nested callbacks. |
