Here is a complete, architectural breakdown answering all 45 fundamental JavaScript execution, runtime, memory, and async questions with clear code examples.

---

### Event Loop, Threading & Concurrency

#### 1. Why does JavaScript use a single-threaded model?

JavaScript was originally designed in 1995 to run inside the web browser to add lightweight interactivity to pages. A single-threaded model was chosen to **avoid complex synchronization problems** inherent in multi-threaded environments, such as race conditions, deadlocks, and thread-safe lock management when manipulating the shared DOM (Document Object Model).

If two parallel threads modified the same DOM node at the same time (e.g., one thread deleting an element while another updates its style), rendering state would become unpredictable.

```javascript
// Single-threaded execution ensures DOM mutations are deterministic.
// If multi-threaded without locks, these two lines could collide:
document.body.appendChild(element); // Thread A
document.body.removeChild(element); // Thread B

```

---

#### 2. Why does the event loop exist?

Because JavaScript is single-threaded, synchronous operations block the execution thread until they complete. To perform non-blocking asynchronous operations (network requests, timers, disk I/O), JavaScript delegates these operations to the host environment (the Browser or Node.js via C++ APIs/libuv).

The **Event Loop** exists to monitor the Call Stack and task queues. When the Call Stack is empty, it pushes pending asynchronous callbacks onto the stack for execution.

```text
 ┌────────────────────────────────────────────────────────┐
 │                      CALL STACK                        │
 └───────────────────────────┬────────────────────────────┘
                             │
                             ▼
 ┌────────────────────────────────────────────────────────┐
 │                      EVENT LOOP                        │
 └──────┬──────────────────────────────────────────▲──────┘
        │                                          │
        ▼                                          │
 ┌───────────────┐                          ┌──────┴──────┐
 │ Microtask Queue│                          │ Macrotask   │
 │ (Promises)    │                          │ Queue       │
 └───────────────┘                          └─────────────┘

```

```javascript
console.log('Start');

setTimeout(() => {
  console.log('Macrotask (Timer)');
}, 0);

Promise.resolve().then(() => {
  console.log('Microtask (Promise)');
});

console.log('End');

// Output order:
// 1. Start
// 2. End
// 3. Microtask (Promise)
// 4. Macrotask (Timer)

```

---

#### 3. Why do microtasks execute before macrotasks?

Microtasks (Promises, `queueMicrotask`, `MutationObserver`) represent tasks that need to run immediately after the current synchronous script finishes execution, **before the browser re-renders the screen or picks up the next macrotask**.

This priority guarantees state consistency across async operations so that the user does not see intermediate, half-rendered frames between async state updates.

```javascript
setTimeout(() => console.log('Macrotask: UI update or Timer'), 0);

Promise.resolve().then(() => {
  console.log('Microtask 1');
  return Promise.resolve();
}).then(() => {
  console.log('Microtask 2'); // Drains the microtask queue completely before macrotasks
});

// Output:
// Microtask 1
// Microtask 2
// Macrotask: UI update or Timer

```

---

#### 4. Why can Promise chains block rendering?

The Event Loop continuously drains the **entire Microtask Queue until it is completely empty** before yielding control back to the browser's Rendering Pipeline or moving to a Macrotask.

If a microtask recursively enqueues another microtask, the queue never empties, starving the event loop and completely blocking UI rendering and user input.

```javascript
// ⚠️ WARNING: Infinite microtask loop that completely freezes the UI thread
function infiniteMicrotasks() {
  Promise.resolve().then(() => {
    infiniteMicrotasks(); // Keeps adding to the microtask queue
  });
}

// Un-commenting this will permanently freeze the browser tab:
// infiniteMicrotasks();

```

---

#### 5. Why does `setTimeout` not guarantee exact timing?

The delay argument in `setTimeout(fn, delay)` specifies the **minimum waiting time** before the timer callback is pushed into the Macrotask Queue—not the exact time it executes.

If the Call Stack or the Microtask Queue is busy processing long synchronous work, the timer callback sits in the queue waiting for the thread to become free.

```javascript
const start = Date.now();

setTimeout(() => {
  console.log(`Executed after ${Date.now() - start}ms`);
}, 100);

// Synchronous heavy work blocking the main thread for 500ms
const end = Date.now() + 500;
while (Date.now() < end) {}

// Output: Executed after ~500ms (NOT 100ms!)

```

---

#### 6. Why can long-running tasks freeze the UI?

The browser's layout engine, reflow calculation, paint operations, and event processing share the exact same single main thread as JavaScript execution.

If a JavaScript task runs continuously for longer than $16.6\text{ms}$ (the time frame budget for $60\text{ FPS}$ rendering), the browser cannot repaint the screen, process mouse clicks, or respond to user scrolling, resulting in a frozen UI.

```javascript
function heavyCompute() {
  // Synchronous loop running 5 billion iterations on the main thread
  for (let i = 0; i < 5000000000; i++) {}
}

document.getElementById('btn').addEventListener('click', () => {
  heavyCompute(); // Freezes the entire webpage while executing
});

```

---

#### 7. Why does call stack overflow happen?

The Call Stack is a fixed-size LIFO (Last In, First Out) memory structure allocated by the JavaScript runtime engine to keep track of active function execution contexts.

When recursive function calls occur without a terminating base case, new stack frames are pushed onto the stack continuously until memory limits are exceeded, triggering a `RangeError: Maximum call stack size exceeded`.

```javascript
function recursiveCrash() {
  recursiveCrash(); // Pushes infinite stack frames without returning
}

try {
  recursiveCrash();
} catch (e) {
  console.error(e.name, e.message); 
  // RangeError: Maximum call stack size exceeded
}

```

---

### Scope, Closures & Execution Context

#### 8. Why are closures powerful in JavaScript?

A closure is a function bundled together with references to its outer lexical environment. This allows inner functions to maintain access to outer variables even after the outer function has executed and its call stack frame has been destroyed.

Closures enable **data privacy/encapsulation**, **factory functions**, **currying**, and **state preservation** in asynchronous callbacks.

```javascript
function createCounter() {
  let count = 0; // Private variable encapsulated inside closure

  return {
    increment() { count++; return count; },
    decrement() { count--; return count; },
    getValue() { return count; }
  };
}

const counter = createCounter();
console.log(counter.increment()); // 1
console.log(counter.increment()); // 2
console.log(counter.count);       // undefined (Cannot be tampered with directly!)

```

---

#### 9. Why can stale closures create bugs?

A stale closure occurs when an inner function captures variables from an earlier render/invocation pass and continues referencing those outdated variable snapshots across subsequent state updates or timer callbacks.

```javascript
function createTimer() {
  let count = 0;

  setInterval(() => {
    // This callback closes over the initial 'count' variable reference
    // In React or state updates, holding onto stale references causes out-of-sync UI bugs.
    console.log('Count:', count);
  }, 1000);

  return () => { count++; };
}

const increment = createTimer();
increment(); // count is now 1, but asynchronous timers might still log initial closed-over values!

```

---

#### 10. Why does lexical scope matter?

Lexical scope means that **variable resolution is determined statically by the physical location of variables and blocks within the source code at author time**, not dynamically by where functions are invoked at runtime.

This guarantees predictability—you can visually trace which variables are accessible to a function simply by looking at the code structure.

```javascript
const val = 'Global';

function foo() {
  console.log(val); // Always references 'Global' because of where foo was DECLARED
}

function bar() {
  const val = 'Local Bar';
  foo(); // Invoked here, but uses lexical scope resolution!
}

bar(); // Output: "Global"

```

---

#### 11. Why does hoisting happen?

During the **Creation Phase** of an Execution Context (before any code actually runs line-by-line), the JavaScript engine scans the code, sets aside memory for variable declarations, and registers function declarations in the environment record.

Hoisting was designed into the language so that function declarations could be called before their visual definition in code, enabling cleaner code organization and supporting mutual recursion.

```javascript
// Function is usable before declaration line due to creation phase hoisting
console.log(square(5)); // Output: 25

function square(n) {
  return n * n;
}

```

---

#### 12. Why are variables hoisted differently with `var`, `let`, and `const`?

* `var` is hoisted and **immediately initialized with `undefined**`.
* `let` and `const` are hoisted into the scope during compilation, but remain **uninitialized**.
* Accessing `let` or `const` before their declaration line throws a `ReferenceError` because they sit in the **Temporal Dead Zone**. `const` also enforces immediate assignment upon initialization.

```javascript
console.log(aVar); // Output: undefined
var aVar = 10;

try {
  console.log(aLet); // ReferenceError: Cannot access 'aLet' before initialization
  let aLet = 20;
} catch (e) {
  console.error(e.message);
}

```

---

#### 13. Why does temporal dead zone exist?

The **Temporal Dead Zone (TDZ)** is the time span between entering a block scope and the point where a `let` or `const` variable is declared and initialized.

TDZ exists to **catch access errors early**, prevent usage of variables before initialization, and ensure that `const` variables are never read in an uninitialized state before being assigned their immutable binding.

```javascript
{
  // TDZ for 'value' begins here
  // console.log(value); // Uncaught ReferenceError
  
  let value = 42; // TDZ ends here
  console.log(value); // 42
}

```

---

### Objects, Functions & Prototypes

#### 14. Why does `this` behave differently in arrow functions?

Standard functions bind `this` **dynamically** depending on *how* they are called (e.g., as a method, as a standalone function, or via `call`/`apply`/`bind`).

Arrow functions do not define their own `this` binding. Instead, they capture `this` **lexically** from their enclosing outer execution context at definition time, preventing `this` context loss inside callbacks.

```javascript
const person = {
  name: 'Sudhir',
  
  // Standard method: 'this' points to person
  sayNameStandard() {
    setTimeout(function() {
      // Lost context! 'this' defaults to global/undefined in strict mode
      console.log('Standard:', this?.name);
    }, 100);
  },

  // Arrow function: captures 'this' lexically from person
  sayNameArrow() {
    setTimeout(() => {
      console.log('Arrow:', this.name);
    }, 100);
  }
};

person.sayNameStandard(); // Output: Standard: undefined
person.sayNameArrow();    // Output: Arrow: Sudhir

```

---

#### 15. Why does `bind` change function context?

The `bind()` method creates a **new bound function wrapper** that explicitly fixes its internal `[[BoundThis]]` slot to the provided object argument, permanently overriding dynamic runtime `this` invocation rules.

```javascript
const user1 = { name: 'Alice' };
const user2 = { name: 'Bob' };

function showName() {
  console.log(this.name);
}

const boundToUser1 = showName.bind(user1);
boundToUser1(); // Output: Alice

// Attempting to re-bind or call with user2 will still use user1!
boundToUser1.call(user2); // Output: Alice

```

---

#### 16. Why do functions behave like objects in JavaScript?

Functions in JavaScript are **First-Class Objects** (specifically, instances of the `Function` built-in object).

They inherit from `Function.prototype` and `Object.prototype`, meaning they can be assigned to variables, passed as arguments, returned from other functions, and have properties/methods dynamically attached to them.

```javascript
function greet() {
  return 'Hello';
}

// Attaching properties to a function object
greet.language = 'English';
greet.version = '1.0';

console.log(greet());         // Output: "Hello"
console.log(greet.language);  // Output: "English"
console.log(greet instanceof Object); // Output: true

```

---

#### 17. Why does prototype inheritance exist?

JavaScript relies on **Prototypal Inheritance** to enable memory-efficient code reuse.

Instead of copying methods and properties to every new instance created by a constructor or class, instances share a reference link to a single common prototype object containing shared methods.

```javascript
function Animal(name) {
  this.name = name;
}

// Shared method allocated ONCE in memory on the prototype
Animal.prototype.makeSound = function() {
  console.log(`${this.name} makes a sound.`);
};

const a1 = new Animal('Dog');
const a2 = new Animal('Cat');

console.log(a1.makeSound === a2.makeSound); // true (Both share same function reference)

```

---

#### 18. Why is `__proto__` different from `prototype`?

* **`prototype`**: A property present on constructor functions that defines the properties and methods that will be inherited by instances created using the `new` keyword.
* **`__proto__`**: An internal accessor property on instances that points directly to the prototype object from which that instance inherited.

```javascript
function User(name) {
  this.name = name;
}

const userObj = new User('Kishori');

// userObj.__proto__ points directly to User.prototype!
console.log(userObj.__proto__ === User.prototype); // true

```

---

### Data Structures, Arrays & Memory

#### 19. Why do arrays perform differently from objects?

Arrays in JavaScript are specialized objects designed for ordered list manipulations. Engine implementations (V8) optimize arrays stored as contiguous memory locations (**Fast Elements / Packed Elements**) for $O(1)$ index lookup access.

Key-value Objects use hash maps or dictionary lookups, which incur higher property lookup and shape transition overhead.

```javascript
const packedArray = [10, 20, 30, 40]; // Engine stores as contiguous packed array
console.log(packedArray[2]); // Fast O(1) indexed offset access

const hashObject = { key1: 10, key2: 20 }; // Dictionary lookup

```

---

#### 20. Why are sparse arrays problematic?

A **sparse array** contains empty holes where elements were skipped or deleted.

Sparse arrays force V8 engine optimizers to downgrade the array from a fast contiguous memory array to a slow dictionary lookup mode, degrading performance and causing unexpected behavior with array iteration methods (`map`, `forEach`, `filter`), which skip empty slots.

```javascript
const sparse = [1, , 3]; // Hole at index 1

console.log(sparse.length); // 3

// Methods skip empty holes entirely!
sparse.forEach((val, idx) => {
  console.log(idx, val); // Logs index 0 and 2 only! (Index 1 skipped)
});

```

---

#### 21. Why does deep cloning become difficult in JavaScript?

Objects in JavaScript can contain complex data types such as circular references, non-serializable types (`Functions`, `Symbols`), specialized objects (`Date`, `RegExp`, `Map`, `Set`), or inherited prototype chains.

Creating a true deep copy requires traversing and duplicating nested structures without breaking internal object references or triggering infinite loops.

```javascript
const original = { a: 1 };
original.self = original; // Circular Reference!

// Naive deep clone attempts crash on circular references
try {
  JSON.parse(JSON.stringify(original));
} catch (e) {
  console.error(e.message); // TypeError: Converting circular structure to JSON
}

// Native modern deep cloning:
const cloned = structuredClone(original);
console.log(cloned.self === cloned); // true (Handles circular references cleanly)

```

---

#### 22. Why can `JSON.parse(JSON.stringify())` fail for cloning?

`JSON.stringify()` drops properties with `undefined` or `Function` values, converts `Date` objects to ISO strings, converts `NaN` / `Infinity` to `null`, and fails on circular references.

```javascript
const data = {
  date: new Date(),
  func: () => 'hello',
  missing: undefined,
  notANumber: NaN
};

const jsonCloned = JSON.parse(JSON.stringify(data));

console.log(typeof jsonCloned.date); // "string" (Lost Date instance!)
console.log(jsonCloned.func);        // undefined (Function dropped!)
console.log(jsonCloned.notANumber);  // null (NaN converted to null!)

```

---

#### 23. Why does reference equality matter?

Primitives (strings, numbers, booleans) are compared by **value**. Objects, Arrays, and Functions are compared by **memory reference pointer**.

Two distinct objects with identical properties are not equal because they occupy different memory addresses. In frontend frameworks (like React), reference changes trigger re-renders, while unchanged references skip re-renders.

```javascript
const objA = { id: 1 };
const objB = { id: 1 };
const objC = objA;

console.log(objA === objB); // false (Different memory addresses)
console.log(objA === objC); // true  (Same memory address pointer)

```

---

#### 24. Why does mutation create hidden bugs?

Directly mutating objects or arrays modifies shared memory references in place. If multiple parts of an application share the same object reference, changing it in one component silently updates it everywhere else, creating unpredictable side effects and race conditions.

```javascript
const state = { user: { name: 'Kriyansh', status: 'Active' } };

function updateStatus(userObj) {
  userObj.status = 'Inactive'; // Mutates shared state directly!
}

updateStatus(state.user);
console.log(state.user.status); // "Inactive" (State was altered unexpectedly!)

```

---

#### 25. Why are immutable patterns important in frontend applications?

Immutable patterns create a brand-new object reference whenever state changes.

This enables efficient **shallow reference equality checks (`oldState === newState`)** in framework rendering trees (e.g., React `React.memo`), skipping expensive deep object comparisons and making application state flow deterministic.

```javascript
const initialState = { name: 'Kiara', age: 3 };

// Immutable Update Pattern: Return a new object reference
const updatedState = {
  ...initialState,
  age: 4
};

console.log(initialState === updatedState); // false (React can instantly detect a change)

```

---

### Memory Management & Performance

#### 26. Why can memory leaks happen in JavaScript?

JavaScript manages memory automatically using a Garbage Collector.

However, if an application accidentally maintains **unintended references** to unused objects in a reachable path from the Global Root Object, the Garbage Collector cannot reclaim that memory, causing memory usage to climb over time.

```javascript
// Unintended Global Variable Leak
function leak() {
  leakedGlobal = new Array(1000000); // Forgotten 'var/let/const' creates window.leakedGlobal
}

leak();
console.log(window.leakedGlobal.length); // Memory cannot be garbage collected!

```

---

#### 27. Why do detached DOM nodes leak memory?

A **detached DOM node** is an element that has been removed from the visible document DOM tree using `removeChild()` or `.remove()`, but is still referenced by a JavaScript variable in memory.

Because the variable holds a reference to the DOM node, the node (and its entire child tree) cannot be garbage collected.

```javascript
let detachedElement = document.createElement('div');
document.body.appendChild(detachedElement);

// Element is removed from the screen...
document.body.removeChild(detachedElement);

// ...BUT 'detachedElement' variable still retains a reference in JS memory!
// To fix the leak:
detachedElement = null; // Unbinds reference, enabling garbage collection

```

---

#### 28. Why can timers and intervals cause leaks?

Timer functions (`setInterval`, `setTimeout`) keep their callback closures alive until cleared.

If the callback closes over variables or DOM nodes, those objects remain trapped in memory for the duration of the timer—even if the component hosting the timer has unmounted from the user interface.

```javascript
function startLeak() {
  const bigData = new Array(1000000).fill('Leak');

  setInterval(() => {
    // Retains 'bigData' in memory indefinitely because the timer is never cleared
    console.log('Timer running...', bigData.length);
  }, 1000);
}

```

---

#### 29. Why does garbage collection not clean everything instantly?

Modern JavaScript engines use a **Mark-and-Sweep** garbage collection algorithm.

GC cycles run periodically and non-deterministically to avoid locking the main thread. Running garbage collection after every single object allocation would destroy application performance and frame rates, so the runtime batches garbage sweeps based on heap size metrics.

```text
 ┌────────────────────────────────────────────────────────┐
 │                     ROOT OBJECT                        │
 └───────────────────────────┬────────────────────────────┘
                             │
            ┌────────────────┴────────────────┐
            ▼                                 ▼
   [Reachable Node A]               [Reachable Node B]
            │
            ▼
   [Reachable Node C]               [Unreachable Node D] ──► (Swept during next GC)

```

---

#### 30. Why does debounce improve performance?

Debouncing delays the execution of a function until a specified time delay has elapsed since the **last time the event was triggered**.

It prevents high-frequency events (such as keypresses in a search input) from triggering dozens of unnecessary network requests or expensive layout recalculations.

```javascript
function debounce(fn, delay) {
  let timer;
  return function (...args) {
    clearTimeout(timer); // Reset timer on every rapid event trigger
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}

const handleSearchInput = debounce((query) => {
  console.log('API call made for:', query);
}, 300);

```

---

#### 31. Why is throttle useful for heavy events?

Throttling guarantees that a function is executed **at most once within a specified time window**, regardless of how many times the user fires the event.

It is essential for continuous, high-frequency events like window resizing or page scrolling (`window.onscroll`).

```javascript
function throttle(fn, limit) {
  let inThrottle = false;
  return function (...args) {
    if (!inThrottle) {
      fn.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

window.addEventListener('scroll', throttle(() => {
  console.log('Scroll position calculated!');
}, 200));

```

---

### Async, Promises & Modern JS Features

#### 32. Why does `async/await` still use Promises internally?

`async/await` is syntactic sugar built directly on top of native **JavaScript Promises and Generators**.

An `async` function always returns a Promise implicitly, and the `await` keyword pauses execution of the async function body until the awaited Promise resolves or rejects, placing subsequent lines into the Microtask Queue.

```javascript
async function fetchData() {
  return 'Data';
}

// Under the hood, fetchData returns a resolved Promise:
fetchData().then((val) => console.log(val)); // Output: "Data"

```

---

#### 33. Why can `async` functions create race conditions?

When multiple asynchronous requests are initiated concurrently, network latency and response times vary.

If shared state is mutated by whichever request finishes last, a slower earlier request might arrive *after* a faster new request, overwriting fresh data with stale data.

```javascript
let currentUserId = null;

async function loadUserProfile(userId) {
  currentUserId = userId;
  const data = await fetch(`/api/user/${userId}`).then(res => res.json());

  // RACE CONDITION: If loadUserProfile(1) completes AFTER loadUserProfile(2),
  // stale user data will overwrite the UI!
  if (currentUserId === userId) {
    console.log('Safe to render:', data);
  }
}

```

---

#### 34. Why does `Promise.all` fail fast?

`Promise.all([p1, p2, p3])` executes all promises in parallel. If **any single Promise rejects**, the returned wrapper Promise rejects **immediately** with that rejection reason, discarding the resolution values of any remaining pending Promises.

```javascript
const p1 = Promise.resolve('Success 1');
const p2 = Promise.reject('Fatal Error in P2');
const p3 = new Promise((res) => setTimeout(() => res('Success 3'), 1000));

Promise.all([p1, p2, p3])
  .then((results) => console.log(results))
  .catch((err) => console.error('Failed Fast:', err));

// Output: Failed Fast: Fatal Error in P2 (Instantly!)

```

---

#### 35. Why does `Promise.allSettled` behave differently?

Unlike `Promise.all`, `Promise.allSettled` **never rejects**. It waits for every single Promise in the input array to either fulfill or reject, returning an array of outcome objects describing the status (`'fulfilled'` or `'rejected'`) and result of each Promise.

```javascript
const p1 = Promise.resolve('Success');
const p2 = Promise.reject('Ignored Error');

Promise.allSettled([p1, p2]).then((results) => console.log(results));

// Output:
// [
//   { status: 'fulfilled', value: 'Success' },
//   { status: 'rejected', reason: 'Ignored Error' }
// ]

```

---

#### 36. Why are generators useful?

Generator functions (`function*`) can **pause execution (`yield`) and resume execution (`next()`)** on demand while maintaining their internal lexical state across yields.

They allow developers to build custom iterators, lazy-evaluated infinite data streams, and stateful saga control flows.

```javascript
function* infiniteIdGenerator() {
  let id = 1;
  while (true) {
    yield `ID_${id++}`;
  }
}

const gen = infiniteIdGenerator();
console.log(gen.next().value); // ID_1
console.log(gen.next().value); // ID_2

```

---

#### 37. Why does optional chaining improve reliability?

Optional chaining (`?.`) short-circuits evaluation and returns `undefined` if the reference before `?.` is `null` or `undefined`, preventing catastrophic `TypeError: Cannot read properties of undefined` runtime crashes.

```javascript
const response = { user: null };

// Safe evaluation without throwing TypeError:
const zipCode = response?.user?.address?.zipCode;
console.log(zipCode); // Output: undefined

```

---

#### 38. Why can destructuring create undefined errors?

Destructuring assumes that the object or array being unpacked exists and is non-nullish. Attempting to destructure properties from `null` or `undefined` throws a `TypeError` before default fallback values can be evaluated.

```javascript
function printUser(user) {
  // Throws TypeError if 'user' argument is passed as null or undefined!
  const { name = 'Anonymous' } = user || {}; 
  console.log(name);
}

printUser(null); // Output: "Anonymous" (Safe with || {})

```

---

### Language Quirks, Coercion & Edge Cases

#### 39. Why do floating-point precision issues happen?

JavaScript numbers are represented using the **IEEE 754 standard for double-precision 64-bit binary floating-point numbers**.

Decimals like $0.1$ and $0.2$ cannot be represented precisely in base-2 binary floating point, resulting in tiny rounding precision errors during arithmetic calculations.

```javascript
console.log(0.1 + 0.2); // Output: 0.30000000000000004
console.log(0.1 + 0.2 === 0.3); // Output: false

// Fix using Number.EPSILON comparison:
const isEqual = Math.abs((0.1 + 0.2) - 0.3) < Number.EPSILON;
console.log(isEqual); // Output: true

```

---

#### 40. Why is `NaN` not equal to itself?

`NaN` (Not-a-Number) represents an invalid or unrepresentable numeric result (such as `0 / 0` or `'text' * 5`).

According to IEEE 754 specifications, any comparison involving `NaN` (including `NaN === NaN`) must evaluate to `false` because two invalid numeric computations cannot be assumed to be identical.

```javascript
console.log(NaN === NaN); // Output: false

// Use Number.isNaN() to safely test for NaN values:
console.log(Number.isNaN(NaN)); // Output: true

```

---

#### 41. Why does `==` behave differently from `===`?

* **`==` (Abstract Equality):** Performs implicit **type coercion** if the types on both sides differ before comparing values.
* **`===` (Strict Equality):** Compares both **type** and **value** without performing implicit type conversion.

```javascript
console.log(5 == '5');   // true  (Coerces string '5' to number 5)
console.log(5 === '5');  // false (Types differ: number vs string)

console.log(null == undefined);  // true
console.log(null === undefined); // false

```

---

#### 42. Why are type coercion bugs common in JavaScript?

JavaScript is dynamically and weakly typed. When binary operators (`+`, `-`, `==`) encounter mismatched types, JS follows complex implicit coercion rules (e.g., preference for string concatenation with `+` over numeric addition).

```javascript
console.log('5' + 3); // "53" (String concatenation wins!)
console.log('5' - 3); // 2    (Numeric subtraction wins!)
console.log([] + []); // ""   (Arrays coerced to empty strings)

```

---

#### 43. Why does `Object.freeze` not create deep immutability?

`Object.freeze()` performs a **shallow freeze**. It prevents adding, deleting, or mutating top-level primitive properties of an object, but nested objects or arrays remain mutable.

```javascript
const user = Object.freeze({
  name: 'Arvind',
  details: { city: 'Pune' } // Nested object is NOT frozen!
});

user.name = 'New Name'; // Ignored in non-strict mode
user.details.city = 'Mumbai'; // Mutates successfully!

console.log(user.details.city); // Output: "Mumbai"

```

---

#### 44. Why can recursion become dangerous?

Recursion without proper base termination or tail-call optimizations accumulates stack frames in memory for every step. In deep recursive trees, this rapidly consumes Call Stack memory, leading to stack overflow crashes.

```javascript
// Unsafe deep recursion
function sumRange(n) {
  if (n <= 1) return n;
  return n + sumRange(n - 1);
}

// Fine for small numbers:
console.log(sumRange(100)); // 5050

// Crashes for deep recursive chains:
try {
  sumRange(100000);
} catch (e) {
  console.error(e.name); // RangeError: Maximum call stack size exceeded
}

```

---

#### 45. Why do synchronous loops block rendering?

Browsers execute JavaScript and screen repaints on the main thread. A synchronous loop (like `while(true)` or long `for` iterations) retains full control of the CPU call stack, preventing the Event Loop from reaching the Rendering Pipeline until the script completely yields execution.

```javascript
document.getElementById('blockBtn').addEventListener('click', () => {
  const start = Date.now();
  // Synchronously holds the main thread for 3 seconds
  while (Date.now() - start < 3000) {}
  
  console.log('3 seconds passed. UI unblocked.');
});

```

Here is a code debugging challenge that combines **event loop microtasks/macrotasks**, **closures**, and **variable scope**.

Examine the code below and identify the bugs causing unexpected behavior.

---

### The Buggy Code

```javascript
function createBatchProcessor() {
  var tasks = ['Task A', 'Task B', 'Task C'];
  var callbacks = [];

  // Bug Area 1: Loop, scope, and closures
  for (var i = 0; i < tasks.length; i++) {
    callbacks.push(function () {
      console.log(`[Processing] Index: ${i}, Item: ${tasks[i]}`);
    });
  }

  return {
    run: function () {
      console.log('--- Batch Execution Started ---');

      // Schedule macrotask
      setTimeout(function () {
        console.log('1. Timeout Callback Executed');
      }, 0);

      // Execute registered callbacks synchronously
      for (var j = 0; j < callbacks.length; j++) {
        callbacks[j]();
      }

      // Schedule microtask
      Promise.resolve().then(function () {
        console.log('2. Promise Microtask Executed');
      });

      // Schedule another microtask
      queueMicrotask(function () {
        console.log('3. QueueMicrotask Executed');
      });

      console.log('--- Batch Execution Scheduled ---');
    },
  };
}

const processor = createBatchProcessor();
processor.run();

```

---

### Your Challenge

1. **Predict the Exact Output:** What will be printed to the console when `processor.run()` is called, in exact order?
2. **Identify the Scope & Closure Bug:** Why does the output for `tasks[i]` inside `callbacks[j]()` fail to log `'Task A'`, `'Task B'`, and `'Task C'`?
3. **Identify the Event Loop Execution Order:** In what exact sequence do the console logs fire between the synchronous loop, `setTimeout`, `Promise.resolve().then`, and `queueMicrotask`—and why?
4. **Fix the Code:** Rewrite the snippet so that:

* Each callback logs its corresponding item correctly (`Index: 0, Item: Task A`, etc.).
* The event loop execution matches standard expectation.

Here is the complete, step-by-step breakdown of the execution order, the underlying bugs, and the corrected implementation.

---

### 1. Predicted Output of the Buggy Code

If you run the buggy code as written, this is the exact output printed to the console:

```text
--- Batch Execution Started ---
[Processing] Index: 3, Item: undefined
[Processing] Index: 3, Item: undefined
[Processing] Index: 3, Item: undefined
--- Batch Execution Scheduled ---
2. Promise Microtask Executed
3. QueueMicrotask Executed
1. Timeout Callback Executed

```

---

### 2. Explanation of the Bugs

#### Bug 1: `var` Hoisting & Closure Bug (Scope & Variables)

* **What went wrong:** Inside the `for` loop, `var i = 0` declares a variable with **function scope** (shared across the entire `createBatchProcessor` function context), not block scope.
* **Why it breaks:** The array of functions inside `callbacks` closed over the *reference* to `i`, not the primitive value of `i` at each iteration pass. By the time the synchronous loop finished, `i` had incremented to `3`.
* **The Result:** When the callbacks are called in `run()`, all three closures look up the same shared variable `i` (which is `3`). `tasks[3]` evaluates to `undefined`.

#### Bug 2: Misinterpreting Event Loop Execution Order

Here is how the JavaScript engine schedules and executes each statement inside `run()`:

1. **Synchronous Code Phase:**

* `console.log('--- Batch Execution Started ---')` executes immediately.
* `setTimeout(..., 0)` registers a callback with the Web APIs and schedules it for the **Macrotask Queue**.
* The `for (var j = 0; j < callbacks.length; j++)` loop executes **synchronously** right away, invoking all three callback closures.
* `Promise.resolve().then(...)` pushes its callback into the **Microtask Queue**.
* `queueMicrotask(...)` pushes its callback into the **Microtask Queue** directly behind the Promise callback.
* `console.log('--- Batch Execution Scheduled ---')` executes immediately.

1. **Microtask Queue Drain Phase (First Priority after Call Stack clears):**

* The Call Stack is now empty. The Event Loop drains the Microtask Queue completely before picking up any macrotasks:
* Executes Promise microtask: `'2. Promise Microtask Executed'`
* Executes queueMicrotask: `'3. QueueMicrotask Executed'`

1. **Macrotask Queue Phase (Lowest Priority):**

* The Event Loop picks up the `setTimeout` callback from the Macrotask Queue:
* Executes timer callback: `'1. Timeout Callback Executed'`

---

### 3. The Corrected Code

To fix the closure bug, change `var i` to `let i`. Using `let` creates a **new block-scoped binding** for `i` on every iteration pass of the loop, ensuring each callback function closes over its own distinct `i` value.

```javascript
function createBatchProcessor() {
  const tasks = ['Task A', 'Task B', 'Task C'];
  const callbacks = [];

  // FIX: Use 'let' instead of 'var' to create a new lexical binding per iteration
  for (let i = 0; i < tasks.length; i++) {
    callbacks.push(function () {
      console.log(`[Processing] Index: ${i}, Item: ${tasks[i]}`);
    });
  }

  return {
    run: function () {
      console.log('--- Batch Execution Started ---');

      // Macrotask
      setTimeout(function () {
        console.log('1. Timeout Callback Executed');
      }, 0);

      // Synchronous execution of registered callbacks
      for (let j = 0; j < callbacks.length; j++) {
        callbacks[j]();
      }

      // Microtask 1
      Promise.resolve().then(function () {
        console.log('2. Promise Microtask Executed');
      });

      // Microtask 2
      queueMicrotask(function () {
        console.log('3. QueueMicrotask Executed');
      });

      console.log('--- Batch Execution Scheduled ---');
    },
  };
}

const processor = createBatchProcessor();
processor.run();

```

---

### Expected Output from the Fixed Code

```text
--- Batch Execution Started ---
[Processing] Index: 0, Item: Task A
[Processing] Index: 1, Item: Task B
[Processing] Index: 2, Item: Task C
--- Batch Execution Scheduled ---
2. Promise Microtask Executed
3. QueueMicrotask Executed
1. Timeout Callback Executed

```
