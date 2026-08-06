To understand how JavaScript executes code under the hood—from variable hoisting to scope resolution and closures—you need to understand three core components of the JavaScript engine (like V8):

1. **Execution Context (EC)**: The environment in which JavaScript code is evaluated and executed.
2. **Call Stack**: The data structure that manages the lifecycle of these Execution Contexts.
3. **Lexical Environment**: The internal structure that stores variables, functions, and handles scope resolution.

---

## 1. Execution Context (EC)

An Execution Context is an abstract environment created by the engine whenever code runs. Everything in JavaScript executes inside an Execution Context.

There are three types:

* **Global Execution Context (GEC):** Created by default before any code runs. There is only **one** GEC per application. It creates the global object (`window` in browsers, `global` in Node.js) and sets `this` to point to it.
* **Function Execution Context (FEC):** Created every time a function is **invoked** (not when defined). Each function call gets its own independent FEC.
* **Eval Execution Context:** Created when code is executed inside an `eval()` string (rarely used).

---

## 2. The Two Phases of Execution Context Creation

When a function is called or the script starts, the engine does not immediately execute line 1. Instead, the Execution Context goes through **two distinct phases**:

```
           ┌─────────────────────────────────────────┐
           │        EXECUTION CONTEXT CREATION       │
           └────────────────────┬────────────────────┘
                                │
            ┌───────────────────┴───────────────────┐
            ▼                                       ▼
 ┌─────────────────────┐                 ┌─────────────────────┐
 │    1. CREATION      │                 │    2. EXECUTION     │
 │       PHASE         │                 │       PHASE         │
 ├─────────────────────┤                 ├─────────────────────┤
 │ • Allocate Memory   │   ───────►      │ • Execute Code      │
 │ • Hoisting (var/fn) │                 │ • Assign Values     │
 │ • Setup Lexical Env │                 │ • Evaluate Funcs    │
 └─────────────────────┘                 └─────────────────────┘

```

### Phase 1: Creation Phase (Memory Allocation)

Before executing code, the engine scans the code to set up memory allocation:

1. **Hoisting**:

* Functions declared with `function foo() {}` are stored entirely in memory.
* Variables declared with `var` are allocated memory and initialized with `undefined`.
* Variables declared with `let` and `const` are allocated memory but left uninitialized in the **Temporal Dead Zone (TDZ)**. Accessing them before initialization throws a `ReferenceError`.

1. **Setup Scope Chain & Lexical Environment**: The engine determines outer parent links.
2. **Determine `this` Binding**: The value of `this` is dynamically evaluated based on how the function was called.

### Phase 2: Execution Phase

The engine executes the code line by line:

* Assigns actual values to variables (`x = 10`).
* Invokes functions, triggering the creation of a *new* Function Execution Context.

---

## 3. The Call Stack (Managing Execution Order)

The **Call Stack** is a standard LIFO (Last-In, First-Out) stack structure that keeps track of where the engine is in the program.

```javascript
function first() {
  second();
}

function second() {
  console.log("Hello!");
}

first();

```

### Call Stack Lifecycle

```
Step 1:           Step 2:           Step 3:           Step 4:           Step 5:
[ GEC ]    ──►    [ FEC: first ]    ──► [ FEC: second]    ──► [ FEC: first ]    ──► [ GEC ]
                  [ GEC        ]        [ FEC: first ]        [ GEC        ]
                                        [ GEC        ]
(Script starts)   (first() called)      (second() called)     (second finishes)   (first finishes)

```

1. **Global Execution Context (GEC)** is pushed onto the stack.
2. Calling `first()` creates its FEC and pushes it onto the stack.
3. Inside `first()`, calling `second()` creates its FEC and pushes it onto the stack.
4. `second()` finishes and its context is **popped** off the stack.
5. `first()` finishes and its context is **popped** off the stack.
6. When the script ends, GEC is popped off.

---

## 4. Lexical Environment (Under the Hood)

Inside every Execution Context, the engine creates a **Lexical Environment**. This is a specification type used to map identifiers (variable/function names) to actual values in memory.

A Lexical Environment consists of two parts:

```
┌──────────────────────────────────────────────────────────┐
│                   LEXICAL ENVIRONMENT                    │
├──────────────────────────────────────────────────────────┤
│ 1. Environment Record:                                  │
│    Stores local variables, parameters, and functions.   │
├──────────────────────────────────────────────────────────┤
│ 2. Outer Lexical Environment Reference (outerEnv):       │
│    Reference to the parent environment (Scope Chain).    │
└──────────────────────────────────────────────────────────┘

```

### How Scope Chain Resolution Works

When JavaScript looks up a variable, it follows the **Scope Chain**:

1. Checks the current **Environment Record**.
2. If not found, follows the `outerEnv` link to the parent Lexical Environment.
3. Repeats this process up to the **Global Environment Record**.
4. If still not found, throws a `ReferenceError`.

```javascript
const globalVar = 'Global';

function outer() {
  const outerVar = 'Outer';

  function inner() {
    const innerVar = 'Inner';
    console.log(innerVar, outerVar, globalVar);
  }

  inner();
}

outer();

```

### Visualizing the Lexical Environment Chain

```
┌───────────────────────────────────────────────────────┐
│ Global Lexical Environment                            │
│ - Record: { globalVar: 'Global', outer: <func> }       │
│ - outerEnv: null                                      │
└──────────────────────────▲────────────────────────────┘
                           │ (outerEnv link)
┌──────────────────────────┴────────────────────────────┐
│ outer() Lexical Environment                           │
│ - Record: { outerVar: 'Outer', inner: <func> }         │
│ - outerEnv: Global Lexical Environment                │
└──────────────────────────▲────────────────────────────┘
                           │ (outerEnv link)
┌──────────────────────────┴────────────────────────────┐
│ inner() Lexical Environment                           │
│ - Record: { innerVar: 'Inner' }                       │
│ - outerEnv: outer() Lexical Environment               │
└───────────────────────────────────────────────────────┘

```

When `console.log(globalVar)` runs inside `inner()`:

* Engine checks `inner` Environment Record $\rightarrow$ Not found.
* Follows `outerEnv` to `outer` Environment Record $\rightarrow$ Not found.
* Follows `outerEnv` to `Global` Environment Record $\rightarrow$ Found!

---

## How This Connects to Closures

A **closure** happens because when a function is *created*, it retains an internal hidden property called `[[Environment]]` that points directly to the Lexical Environment in which it was created.

Even after `outer()` finishes and its Function Execution Context is popped off the Call Stack, the **Lexical Environment** created during `outer()`'s execution **is not garbage collected** if `inner()`'s `[[Environment]]` reference still points to it!

```javascript
function makeCounter() {
  let count = 0; // Stored in Lexical Environment

  return function increment() {
    count++;
    return count;
  };
}

const counter = makeCounter();
// makeCounter() execution context is POPPED off the Call Stack here...
// BUT its Lexical Environment remains in memory because `increment`'s
// [[Environment]] property retains a live pointer to it!

console.log(counter()); // 1

```

---

## Summary Cheat Sheet

| Component               | What it is                              | Role                                                                                                     |
| ----------------------- | --------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| **Execution Context**   | The running container                   | Manages execution phases (creation vs execution) and `this` binding.                                     |
| **Call Stack**          | LIFO Stack structure                    | Tracks execution order and function invocation depth.                                                    |
| **Lexical Environment** | Map of identifiers $\rightarrow$ values | Holds scope data and handles variable lookups via `outerEnv` pointers.                                   |
| **Closure**             | Persistent Lexical Reference            | Preserves a parent Lexical Environment in memory even after its call frame is popped off the Call Stack. |
