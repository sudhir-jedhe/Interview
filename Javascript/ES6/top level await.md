Explain how top-level await works in ES6 modules with practical code examples.

Prior to ES2022, the `await` keyword could only be used inside functions marked with `async`. If you tried to use `await` at the root/top level of a file, JavaScript threw a `SyntaxError`.

**Top-level `await**` allows developers to use the `await` keyword directly at the top level of an **ES6 Module** (`.mjs` files or projects with `"type": "module"` in `package.json`) without wrapping the code in an `async` function or an Immediately Invoked Function Expression (IIFE).

---

### 1. Key Mechanics: How it Works Under the Hood

When an ES6 module contains a top-level `await`:

1. **The Module Becomes an Async Resource:** The module itself behaves like a large `async` function.
2. **Pauses Execution of Dependent Modules:** Any module that imports a top-level `await` module will wait for that `await` to resolve **before executing its own body code**.
3. **Sibling Modules Execute in Parallel:** If Module A imports Module B and Module C (and both B and C use top-level `await`), Node.js / browsers execute the asynchronous operations in B and C concurrently in parallel before executing A.

---

### 2. Practical Use Cases & Code Examples

#### Use Case 1: Dynamic Resource & Configuration Loading

Loading runtime settings, database connections, or internationalization files before the rest of your application initializes:

```javascript
// dbConnection.js (ES6 Module)
import { createConnection } from 'some-db-driver';

// Top-level await pauses module execution until the connection is established!
const dbConfig = await fetch('https://api.example.com/config').then(r => r.json());

export const connection = await createConnection(dbConfig);
console.log('Database connected successfully!');

```

```javascript
// app.js
import { connection } from './dbConnection.js';

// This code will NOT run until dbConnection.js finishes its top-level awaits!
console.log('Starting Web Server...');
connection.query('SELECT * FROM users');

```

---

#### Use Case 2: Conditional / Fallback Module Loading

Selecting and loading different dependencies based on environment variables or runtime capability checks:

```javascript
// render.js
let renderer;

if (process.env.NODE_ENV === 'production') {
  renderer = await import('./productionRenderer.js');
} else {
  renderer = await import('./developmentRenderer.js');
}

export function render(data) {
  renderer.draw(data);
}

```

---

#### Use Case 3: Dependency Fallbacks with `try...catch`

Loading data or modules from a primary server with a fallback if the request fails:

```javascript
// translations.js
let translations;

try {
  // Try loading primary CDN translations
  const response = await fetch('https://cdn.example.com/en.json');
  translations = await response.json();
} catch (error) {
  console.warn('CDN failed, loading local fallback translations...');
  // Fallback to local file if CDN fails
  const localModule = await import('./locales/en-fallback.json', { with: { type: 'json' } });
  translations = localModule.default;
}

export default translations;

```

---

### 3. Comparing Old IIFE Workarounds vs. Top-Level Await

#### ❌ The Old Way (Async IIFE Pattern)

Before top-level `await`, you had to wrap your logic in an IIFE and handle exported values asynchronously:

```javascript
// oldDb.js
export let db;

(async () => {
  db = await connectToDatabase();
})();

```

```javascript
// oldApp.js
import { db } from './oldDb.js';

// ❌ RACE CONDITION BUG: 'db' is still undefined here because the async IIFE hasn't finished!
console.log(db); // undefined

```

---

#### ✅ The Modern Way (Top-Level Await)

Top-level `await` eliminates race conditions by pausing dependent module execution until exports are fully populated:

```javascript
// modernDb.js
export const db = await connectToDatabase();

```

```javascript
// modernApp.js
import { db } from './modernDb.js';

// ✅ SAFE: Node/Browser guarantees 'db' is fully resolved before running this line!
console.log(db); // Connected Database Instance

```

---

### 4. Important Rules & Restrictions

1. **Only Available in ES Modules:** Top-level `await` works **only inside ES6 modules** (`import`/`export`). Attempting to use it in CommonJS files (`require`) or standard non-module `<script>` tags throws a `SyntaxError`.
2. **Error Handling:** If a top-level `await` rejects without a `try...catch` block, the entire module evaluation fails, throwing an unhandled rejection and halting downstream dependent modules. Always wrap network calls in `try...catch`.

---

### Summary Checklist

| Context                                       | Top-Level `await` Supported? |
| --------------------------------------------- | ---------------------------- |
| **ES Modules (`.mjs` or `"type": "module"`)** | ✅ **Yes**                    |
| **CommonJS (`.cjs` or `require`)**            | ❌ No (`SyntaxError`)         |
| **`<script type="module">` in HTML**          | ✅ **Yes**                    |
| **Standard `<script>` in HTML**               | ❌ No (`SyntaxError`)         |

Prior to ES2022, the `await` keyword could only be used inside functions marked with `async`. If you tried to use `await` at the root/top level of a file, JavaScript threw a `SyntaxError`.

**Top-level `await**` allows developers to use the `await` keyword directly at the top level of an **ES6 Module** (`.mjs` files or projects with `"type": "module"` in `package.json`) without wrapping the code in an `async` function or an Immediately Invoked Function Expression (IIFE).

---

### 1. Key Mechanics: How it Works Under the Hood

When an ES6 module contains a top-level `await`:

1. **The Module Becomes an Async Resource:** The module itself behaves like a large `async` function.
2. **Pauses Execution of Dependent Modules:** Any module that imports a top-level `await` module will wait for that `await` to resolve **before executing its own body code**.
3. **Sibling Modules Execute in Parallel:** If Module A imports Module B and Module C (and both B and C use top-level `await`), Node.js / browsers execute the asynchronous operations in B and C concurrently in parallel before executing A.

---

### 2. Practical Use Cases & Code Examples

#### Use Case 1: Dynamic Resource & Configuration Loading

Loading runtime settings, database connections, or internationalization files before the rest of your application initializes:

```javascript
// dbConnection.js (ES6 Module)
import { createConnection } from 'some-db-driver';

// Top-level await pauses module execution until the connection is established!
const dbConfig = await fetch('https://api.example.com/config').then(r => r.json());

export const connection = await createConnection(dbConfig);
console.log('Database connected successfully!');

```

```javascript
// app.js
import { connection } from './dbConnection.js';

// This code will NOT run until dbConnection.js finishes its top-level awaits!
console.log('Starting Web Server...');
connection.query('SELECT * FROM users');

```

---

#### Use Case 2: Conditional / Fallback Module Loading

Selecting and loading different dependencies based on environment variables or runtime capability checks:

```javascript
// render.js
let renderer;

if (process.env.NODE_ENV === 'production') {
  renderer = await import('./productionRenderer.js');
} else {
  renderer = await import('./developmentRenderer.js');
}

export function render(data) {
  renderer.draw(data);
}

```

---

#### Use Case 3: Dependency Fallbacks with `try...catch`

Loading data or modules from a primary server with a fallback if the request fails:

```javascript
// translations.js
let translations;

try {
  // Try loading primary CDN translations
  const response = await fetch('https://cdn.example.com/en.json');
  translations = await response.json();
} catch (error) {
  console.warn('CDN failed, loading local fallback translations...');
  // Fallback to local file if CDN fails
  const localModule = await import('./locales/en-fallback.json', { with: { type: 'json' } });
  translations = localModule.default;
}

export default translations;

```

---

### 3. Comparing Old IIFE Workarounds vs. Top-Level Await

#### ❌ The Old Way (Async IIFE Pattern)

Before top-level `await`, you had to wrap your logic in an IIFE and handle exported values asynchronously:

```javascript
// oldDb.js
export let db;

(async () => {
  db = await connectToDatabase();
})();

```

```javascript
// oldApp.js
import { db } from './oldDb.js';

// ❌ RACE CONDITION BUG: 'db' is still undefined here because the async IIFE hasn't finished!
console.log(db); // undefined

```

---

#### ✅ The Modern Way (Top-Level Await)

Top-level `await` eliminates race conditions by pausing dependent module execution until exports are fully populated:

```javascript
// modernDb.js
export const db = await connectToDatabase();

```

```javascript
// modernApp.js
import { db } from './modernDb.js';

// ✅ SAFE: Node/Browser guarantees 'db' is fully resolved before running this line!
console.log(db); // Connected Database Instance

```

---

### 4. Important Rules & Restrictions

1. **Only Available in ES Modules:** Top-level `await` works **only inside ES6 modules** (`import`/`export`). Attempting to use it in CommonJS files (`require`) or standard non-module `<script>` tags throws a `SyntaxError`.
2. **Error Handling:** If a top-level `await` rejects without a `try...catch` block, the entire module evaluation fails, throwing an unhandled rejection and halting downstream dependent modules. Always wrap network calls in `try...catch`.

---

### Summary Checklist

| Context                                       | Top-Level `await` Supported? |
| --------------------------------------------- | ---------------------------- |
| **ES Modules (`.mjs` or `"type": "module"`)** | ✅ **Yes**                    |
| **CommonJS (`.cjs` or `require`)**            | ❌ No (`SyntaxError`)         |
| **`<script type="module">` in HTML**          | ✅ **Yes**                    |
| **Standard `<script>` in HTML**               | ❌ No (`SyntaxError`)         |

Explain how for await...of loops work with Async Generators and ReadableStreams in JavaScript.

The `for await...of` loop in JavaScript iterates over **Async Iterables**—objects that produce a sequence of Promises resolving to `{ value, done }` iteration result objects.

While a standard `for...of` loop synchronously processes data already in memory, `for await...of` pauses execution asynchronously at each step until the next item's Promise resolves.

---

## 1. How `for await...of` Works Under the Hood

When you execute `for await (const item of asyncIterable)`, JavaScript calls the internal `[Symbol.asyncIterator]()` method on the iterable object.

On every iteration step, the loop:

1. Calls `.next()` on the async iterator, which returns a **Promise**.
2. **Pauses execution** (via `await`) until that Promise settles.
3. Unwraps the `{ value, done }` object:

* If `done: false`, assigns `value` to the loop variable and runs the loop body.
* If `done: true`, exits the loop.

---

## 2. Using `for await...of` with Async Generators

An **Async Generator** (`async function*`) combines the power of asynchronous functions (`await`) with generators (`yield`). Every time `yield` is called inside an async generator, it produces a Promise that `for await...of` consumes cleanly.

### Practical Example: Paged API Fetcher

Imagine querying a paginated REST API where you must wait for network requests between chunks of data:

```javascript
// Async Generator Function
async function* fetchAllUserPages(maxPages) {
  let currentPage = 1;

  while (currentPage <= maxPages) {
    console.log(`📡 Fetching page ${currentPage}...`);
    
    // Simulate network delay / API fetch
    const response = await fetch(`https://api.example.com/users?page=${currentPage}`);
    const data = await response.json();

    // Yield items from current page
    for (const user of data.users) {
      yield user; // Returns a promise resolving to { value: user, done: false }
    }

    currentPage++;
  }
}

// Consuming the Async Generator with 'for await...of'
async function processUsers() {
  // The loop automatically awaits each yielded value!
  for await (const user of fetchAllUserPages(3)) {
    console.log(`Processing user: ${user.name}`);
  }
  console.log('✅ All pages processed!');
}

processUsers();

```

---

## 3. Using `for await...of` with `ReadableStream`

In modern JavaScript environments (Web Browsers, Node.js, Deno, Bun), the `ReadableStream` API implements the Async Iterable protocol (`Symbol.asyncIterator`).

This allows streaming data—like downloading a large file or reading incoming HTTP chunks—to be processed chunk-by-chunk as data arrives over the network, without loading the entire payload into RAM.

### Practical Example: Streaming a Fetch Response

```javascript
async function consumeTextStream(url) {
  const response = await fetch(url);
  
  // TextDecoderStream decodes binary Uint8Array chunks into text strings
  const textStream = response.body.pipeThrough(new TextDecoderStream());

  let totalBytes = 0;

  // Consume stream chunks in real-time as they arrive over the wire:
  for await (const chunk of textStream) {
    totalBytes += chunk.length;
    console.log(`Received chunk (${chunk.length} chars): "${chunk.slice(0, 30)}..."`);
  }

  console.log(`Stream complete. Total size: ${totalBytes} characters.`);
}

consumeTextStream('https://jsonplaceholder.typicode.com/posts');

```

---

## 4. Comparing Iteration Loops

| Loop Type            | Iterable Interface     | Consumes                              | Pauses on Promises? | Best For                                  |
| -------------------- | ---------------------- | ------------------------------------- | ------------------- | ----------------------------------------- |
| **`for...of`**       | `Symbol.iterator`      | Sync values / Arrays / Sets           | ❌ No                | In-memory synchronous data structures     |
| **`for await...of`** | `Symbol.asyncIterator` | Promises / Async Generators / Streams | ✅ **Yes**           | Web streams, paginated APIs, event queues |

---

## 5. Important Rules & Gotchas

1. **Must be in an `async` context:** Just like standard `await`, using `for await...of` requires being inside an `async function`, an async block, or an ES module with top-level `await`.
2. **Sequential Execution:** `for await...of` processes items **one by one in series**. If you have an array of independent promises (`[p1, p2, p3]`) and want to process them in parallel, use `Promise.all()` instead:

```javascript
// ⚠️ Sequential (Wait for p1, then wait for p2):
for await (const result of promiseArray) { ... }

// 🚀 Parallel execution:
const results = await Promise.all(promiseArray);

```

1. **Stream Cancellation:** Exiting a `for await...of` loop early (via `break` or `return`) automatically calls the stream's `.return()` method on the iterator, canceling the underlying stream safely.

Show how to create a custom object that implements Symbol.asyncIterator in JavaScript.

To make any custom JavaScript object work with `for await...of` loops, you must implement the **`Symbol.asyncIterator`** protocol.

The `Symbol.asyncIterator` method must return an **Async Iterator object**—an object with a `.next()` method that returns a Promise resolving to an object shape of `{ value: any, done: boolean }`.

---

### 1. Structure of the `Symbol.asyncIterator` Protocol

```javascript
const myAsyncIterable = {
  [Symbol.asyncIterator]() {
    return {
      async next() {
        if (/* condition to keep iterating */) {
          return { value: 'some data', done: false };
        }
        return { value: undefined, done: true };
      }
    };
  }
};

```

---

### 2. Practical Example: Building a Custom Async Queue / Polling Service

Here is a complete example of a custom `AsyncTicker` object that streams timed counter increments asynchronously before automatically stopping:

```javascript
class AsyncTicker {
  constructor(maxTicks, intervalMs = 500) {
    this.maxTicks = maxTicks;
    this.intervalMs = intervalMs;
  }

  // Implement the Symbol.asyncIterator method
  [Symbol.asyncIterator]() {
    let currentTick = 0;
    const max = this.maxTicks;
    const delay = this.intervalMs;

    return {
      // The next() method must return a Promise
      next() {
        return new Promise((resolve) => {
          setTimeout(() => {
            currentTick++;

            if (currentTick <= max) {
              // Yield next tick value
              resolve({
                value: { tick: currentTick, timestamp: new Date().toISOString() },
                done: false
              });
            } else {
              // Signal end of iteration
              resolve({ value: undefined, done: true });
            }
          }, delay);
        });
      },

      // Optional: Cleanup if the consumer exits the for await...of loop early (e.g. via 'break')
      return() {
        console.log('⚠️ Iteration terminated early by consumer. Cleaning up...');
        return Promise.resolve({ value: undefined, done: true });
      }
    };
  }
}

// -------------------------------------------------------------
// Consuming the Custom Async Iterable with 'for await...of'
// -------------------------------------------------------------

async function run() {
  const ticker = new AsyncTicker(4, 300); // 4 ticks, every 300ms

  console.log('🚀 Starting AsyncTicker stream...\n');

  for await (const data of ticker) {
    console.log(`Tick #${data.tick} received at ${data.timestamp}`);
  }

  console.log('\n✅ Stream finished naturally!');
}

run();

```

---

### 3. Alternative & Cleaner Pattern: Using Async Generator Methods

Writing raw `.next()` Promise handlers manually can be verbose. An easier and cleaner way to implement `Symbol.asyncIterator` on a custom object or class is by defining it directly as an **Async Generator Method (`async *`)**:

```javascript
class PagedDataReader {
  constructor(totalCount, pageSize = 2) {
    this.totalCount = totalCount;
    this.pageSize = pageSize;
  }

  // An async generator automatically implements the Symbol.asyncIterator protocol!
  async *[Symbol.asyncIterator]() {
    let fetched = 0;

    while (fetched < this.totalCount) {
      // Simulate fetching a batch of records from a server/database
      await new Promise((resolve) => setTimeout(resolve, 400));

      const batchSize = Math.min(this.pageSize, this.totalCount - fetched);
      const batchData = Array.from({ length: batchSize }, (_, i) => `Item ${fetched + i + 1}`);

      fetched += batchSize;

      // Yielding automatically wraps items into { value: batchData, done: false } promises
      yield batchData;
    }
  }
}

// Consuming the Async Generator Class
async function readBatches() {
  const reader = new PagedDataReader(5, 2);

  for await (const batch of reader) {
    console.log('Received batch:', batch);
  }
}

readBatches();
/* Output:
Received batch: [ 'Item 1', 'Item 2' ]
Received batch: [ 'Item 3', 'Item 4' ]
Received batch: [ 'Item 5' ]
*/

```

---

### Summary Rules

1. **Protocol Key:** The property name **must** be `Symbol.asyncIterator`.
2. **Result Shape:** Every step must resolve to `{ value: any, done: boolean }`.
3. **Async Generators:** Marking `[Symbol.asyncIterator]()` as `async *` lets you use `yield` and `await` naturally inside the iterator without manually instantiating Promises or constructing return objects.
