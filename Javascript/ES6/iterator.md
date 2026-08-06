Under the hood, the **array spread syntax** (`[...iterable]`) and **function argument spread** (`fn(...iterable)`) do not rely on standard `for` loops or object keys. Instead, they rely entirely on the **JavaScript Iteration Protocol**.

Any object that implements the `Symbol.iterator` method can be unpacked using spread syntax—including built-in iterables (`Array`, `String`, `Map`, `Set`, `TypedArray`, `NodeList`) and custom objects or **Generators**.

---

### 1. The Iteration Protocol & `Symbol.iterator`

An object is an **Iterable** if it defines a method at the `Symbol.iterator` key. This method must return an **Iterator object** that conforms to the following contract:

1. It must have a `.next()` method.
2. The `.next()` method must return an object with two properties:

* `value`: The current item yielded by the iteration.
* `done`: A boolean (`true` when iteration is complete, `false` otherwise).

#### How Spread Executes Under the Hood

When you execute `[...myIterable]`, the JavaScript engine performs these steps:

```
1. Calls myIterable[Symbol.iterator]()  ──► Returns iterator instance
2. Loops: iterator.next()               ──► Receives { value, done }
3. Collects 'value' into the array until 'done' is true
4. Returns the newly populated array

```

---

### 2. Making a Custom Object Spreadable

Plain objects (`{}`) are **not** iterable by default and will throw a `TypeError` if you try to spread them into an array:

```javascript
const obj = { a: 1, b: 2 };

// ❌ Throws TypeError: obj is not iterable
const arr = [...obj]; 

```

You can make any custom object spreadable by implementing `Symbol.iterator`:

```javascript
const range = {
  from: 1,
  to: 4,

  // Implement the Symbol.iterator method
  [Symbol.iterator]() {
    let current = this.from;
    const last = this.to;

    // Return the Iterator object
    return {
      next() {
        if (current <= last) {
          return { value: current++, done: false };
        } else {
          return { value: undefined, done: true };
        }
      }
    };
  }
};

// ✅ Spreading custom iterable into an array
const rangeArray = [...range];

console.log(rangeArray); // [1, 2, 3, 4]

```

---

### 3. Generator Functions and Spread Syntax

**Generator functions** (`function*`) are special functions that return a **Generator object** when called. Because Generator objects naturally conform to both the **Iterable** and **Iterator** protocols (they come with a built-in `[Symbol.iterator]` method that returns `this`), they work seamlessly with spread syntax.

Whenever `yield` is invoked, the generator pauses execution and provides the next `{ value, done: false }` to the spread operator.

#### A. Spreading a Generator

```javascript
// Generator function yielding values sequentially
function* countUpTo(max) {
  for (let i = 1; i <= max; i++) {
    yield i;
  }
}

// 1. Calling countUpTo(3) returns a Generator object
const counterGen = countUpTo(3);

// 2. Spread consumes the generator until done === true
const countArray = [...counterGen];

console.log(countArray); // [1, 2, 3]

```

#### B. Generating Custom Sequences Inlined

Generators make creating custom spreadable iterables much simpler because you don't need to manually manage state object closures inside `.next()`:

```javascript
const Fibonacci = {
  *[Symbol.iterator]() {
    let a = 0, b = 1;
    for (let i = 0; i < 7; i++) {
      yield a;
      [a, b] = [b, a + b];
    }
  }
};

// Spread evaluates 7 iterations of the Fibonacci generator
const fibSequence = [...Fibonacci];

console.log(fibSequence); // [0, 1, 1, 2, 3, 5, 8]

```

---

### 4. Important Edge Cases & Behaviors

#### A. Consuming Generator Instances (Single-Use Iterators)

A generator instance is a **one-time-use iterator**. Once a generator has been fully spread or iterated through, its internal state is exhausted (`done: true`). Trying to spread it a second time produces an empty array:

```javascript
function* numberGen() {
  yield 1;
  yield 2;
}

const genInstance = numberGen();

const firstSpread = [...genInstance];  // [1, 2]
const secondSpread = [...genInstance]; // [] (Already exhausted!)

// ✅ FIX: Re-invoke the generator function to get a fresh iterator
const freshSpread = [...numberGen()];  // [1, 2]

```

#### B. Infinite Generators and Spread

Do **not** spread an infinite generator function into an array without a termination condition inside the generator or yielding logic. Spread syntax will loop indefinitely until it exceeds memory limits and throws a `RangeError: Maximum call stack size exceeded` or crashes the thread.

```javascript
function* infiniteGen() {
  let i = 0;
  while (true) {
    yield i++;
  }
}

// ❌ DANGEROUS: Infinite loop -> Crashes memory!
// const arr = [...infiniteGen()]; 

```

#### C. Return Values in Generators vs. Spread

If a generator function uses a `return` statement alongside `yield`, the value in `return` is attached to `{ value: returnedVal, done: true }`. **Spread syntax ignores the value on `done: true**`:

```javascript
function* demo() {
  yield 'A';
  yield 'B';
  return 'C'; // Final return
}

console.log([...demo()]); // ['A', 'B']  ('C' is ignored because done was true!)

```

---

### Summary Checklist

1. **Spread Syntax (`[...]`)** relies on calling `[Symbol.iterator]()` under the hood.
2. **Object Spread (`{ ...obj }`)** is a special language exception that uses enumerable property key copying, **not** `Symbol.iterator`.
3. **Generators (`function*`)** automatically implement `Symbol.iterator`, making them the most concise way to create custom spreadable sequences.
4. **Generator instances are stateful & single-use**, meaning spreading a generator instance exhausts it for future iterations.

Just as standard iterables allow you to step through collections of data synchronously, **async iterables** allow you to step through streams of data where each piece arrives asynchronously (such as network data chunks, file reads, database cursor streaming, or WebSocket events).

---

### 1. The Core Contracts

The async iteration protocol mirrors synchronous iteration, with one fundamental shift: instead of returning plain `{ value, done }` objects, **its methods return Promises that resolve to `{ value, done }` objects**.

```
Sync Iterator:  iterator.next()  ──►  { value: T, done: boolean }
Async Iterator: iterator.next()  ──►  Promise<{ value: T, done: boolean }>

```

To make an object an **Async Iterable**, it must implement a method at the **`Symbol.asyncIterator`** well-known symbol.

```javascript
const myAsyncIterable = {
  [Symbol.asyncIterator]() {
    let count = 0;
    return {
      async next() {
        if (count < 3) {
          // Simulate an async operation (e.g., fetching a chunk)
          await new Promise(resolve => setTimeout(resolve, 500));
          return { value: ++count, done: false };
        }
        return { value: undefined, done: true };
      }
    };
  }
};

```

---

### 2. Consuming Async Iterables with `for await...of`

To consume an async iterable, JavaScript provides the **`for await...of`** loop (introduced in ES2018).

At each iteration step, the loop:

1. Calls `iterator.next()`.
2. **Awaits** the returned Promise.
3. Unwraps `value` and assigns it to the loop variable.
4. Terminates when `done === true`.

```javascript
async function consume() {
  for await (const num of myAsyncIterable) {
    console.log(num); 
  }
}

consume();
// Output (with 500ms delays between logs):
// 1
// 2
// 3

```

---

### 3. Async Generators (`async function*`)

Writing manual async iterators with `Symbol.asyncIterator` and returning objects with `.next()` can get verbose and error-prone. **Async Generators** provide a clean declarative syntax combining the power of `async/await` and `yield`.

* An async generator is declared using **`async function*`**.
* You can use **`await`** to pause execution until a Promise resolves.
* You can use **`yield`** to emit data to the `for await...of` loop.

#### Example: Paginated API Fetcher

Imagine fetching thousands of user records from a paginated API:

```javascript
async function* fetchUsersPaginated(apiEndpoint) {
  let page = 1;
  let hasMore = true;

  while (hasMore) {
    // 1. Await asynchronous network call
    const response = await fetch(`${apiEndpoint}?page=${page}`);
    const data = await response.json();

    // 2. Yield individual items to the caller
    for (const user of data.users) {
      yield user;
    }

    hasMore = page < data.totalPages;
    page++;
  }
}

// Consuming the paginated stream cleanly
async function processAllUsers() {
  const userStream = fetchUsersPaginated('https://api.example.com/users');

  for await (const user of userStream) {
    console.log(`Processing user: ${user.name}`);
    // Memory remains low because records are processed piece by piece!
  }
}

```

---

### 4. Delegation with `yield*` in Async Generators

Async generators can delegate iteration to another iterable or async iterable using **`yield*`**:

```javascript
async function* fetchFromSourceA() {
  yield 'Source A - Item 1';
  yield 'Source A - Item 2';
}

async function* fetchFromSourceB() {
  yield 'Source B - Item 1';
}

async function* fetchAllData() {
  yield* fetchFromSourceA(); // Delegates to Source A
  yield* fetchFromSourceB(); // Delegates to Source B
}

async function run() {
  for await (const item of fetchAllData()) {
    console.log(item);
  }
}
// Logs Source A items first, then Source B items

```

---

### 5. Important Differences: Sync vs. Async Iteration

| Feature                     | Sync Iteration (`Symbol.iterator`) | Async Iteration (`Symbol.asyncIterator`)          |
| --------------------------- | ---------------------------------- | ------------------------------------------------- |
| **Method Name**             | `[Symbol.iterator]()`              | `[Symbol.asyncIterator]()`                        |
| **`next()` Return Type**    | `{ value, done }`                  | `Promise<{ value, done }>`                        |
| **Loop Syntax**             | `for...of`                         | `for await...of`                                  |
| **Spread Syntax (`[...]`)** | ✅ Supported (`[...iterable]`)      | ❌ **NOT supported** (cannot spread synchronously) |
| **Generator Syntax**        | `function*`                        | `async function*`                                 |

> **Why doesn't Spread Syntax (`[...]`) work with Async Iterables?**
> Spread syntax operates synchronously in memory. Because async iterables require awaiting Promises between steps, you cannot spread an async iterable directly into `[...]`. Instead, you collect items using a `for await...of` loop into an array:
>
> ```javascript
> async function toArray(asyncIterable) {
>   const result = [];
>   for await (const item of asyncIterable) {
>     result.push(item);
>   }
>   return result;
> }
> 
> ```
>
>

---

### Real-World Use Case: Web Streams API (Node.js & Browsers)

Modern Web APIs—such as Node.js `ReadableStream` or Browser `fetch()` response bodies—implement `Symbol.asyncIterator` natively. This allows you to stream large HTTP payloads line-by-line without overloading RAM:

```javascript
import fs from 'node:fs';
import readline from 'node:readline';

async function processLargeLogFile(filePath) {
  const fileStream = fs.createReadStream(filePath);
  
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  // readline interfaces natively implement Symbol.asyncIterator!
  for await (const line of rl) {
    if (line.includes('ERROR')) {
      console.log(`Error detected: ${line}`);
    }
  }
}

```

Explain how to manage backpressure and controlled concurrency when using async iterators in JavaScript.

In asynchronous data processing, two primary challenges arise when handling high-throughput streams (like WebSockets, database reads, or multi-file uploads):

1. **Backpressure:** The producer pushes data faster than the consumer can process it, causing unconsumed items to pile up in memory until the application runs out of RAM or crashes.
2. **Uncontrolled Concurrency:** Firing off asynchronous operations simultaneously without a limit (e.g., launching $10,000$ concurrent HTTP requests) causes socket starvation, rate-limiting errors (429 Too Many Requests), or database pool exhaustion.

Async iterators are uniquely suited to solve these problems because they operate on a **pull-based model**: the producer pauses execution until the consumer explicitly calls `next()` to request the next chunk.

---

## 1. Managing Backpressure

Because `for await...of` inherently awaits the resolution of each loop body before invoking `.next()` on the iterator, backpressure control is built directly into JavaScript async generators.

### Pull-Based Flow Control

In a pull-based stream, the producer does not push items onto a queue. Instead, it yields an item and **pauses** until the consumer finishes processing the current item and requests the next one.

```javascript
// Producer: Only reads and yields when requested
async function* fetchRecordsProducer(dataSource) {
  let offset = 0;
  const BATCH_SIZE = 100;

  while (true) {
    // 1. Fetch a chunk from database/API
    const batch = await dataSource.readChunk(offset, BATCH_SIZE);
    if (batch.length === 0) break;

    for (const record of batch) {
      // 2. Yield pauses execution until consumer finishes current iteration step
      yield record; 
    }

    offset += BATCH_SIZE;
  }
}

// Consumer: Controls the pace
async function processPipeline() {
  const stream = fetchRecordsProducer(dbConnection);

  for await (const record of stream) {
    // Slow consumer: Takes 200ms per record
    await heavyProcessingWork(record); 
    // The producer is PAUSED during these 200ms! 
    // No unprocessed records accumulate in memory.
  }
}

```

### Bridging Push Streams to Pull Streams (Handling Uncontrolled Producers)

Sometimes you have a **push-based source** (like a raw WebSocket, UI events, or Node.js events) that fires events uncontrollably. To prevent memory overload, you can buffer events with a fixed maximum queue size, dropping items or pausing the underlying source when the buffer fills up:

```javascript
class BoundedQueueStream {
  constructor(maxSize = 100) {
    this.maxSize = maxSize;
    this.queue = [];
    this.resolveNext = null;
    this.isDone = false;
  }

  // Push method called by high-frequency event producer
  push(item) {
    if (this.queue.length >= this.maxSize) {
      console.warn('Backpressure threshold reached! Dropping or pausing source.');
      return false; // Signal producer to pause/drop
    }

    if (this.resolveNext) {
      const resolve = this.resolveNext;
      this.resolveNext = null;
      resolve({ value: item, done: false });
    } else {
      this.queue.push(item);
    }
    return true;
  }

  end() {
    this.isDone = true;
    if (this.resolveNext) {
      const resolve = this.resolveNext;
      this.resolveNext = null;
      resolve({ value: undefined, done: true });
    }
  }

  [Symbol.asyncIterator]() {
    return {
      next: () => {
        if (this.queue.length > 0) {
          return Promise.resolve({ value: this.queue.shift(), done: false });
        }
        if (this.isDone) {
          return Promise.resolve({ value: undefined, done: true });
        }
        return new Promise(resolve => {
          this.resolveNext = resolve;
        });
      }
    };
  }
}

```

---

## 2. Controlled Concurrency (Batching vs. Worker Pool)

While standard `for await...of` processes items **sequentially** (1 task at a time), processing tasks sequentially can be too slow for I/O-bound jobs. You often want **controlled concurrency**—running up to $N$ operations simultaneously (e.g., exactly 5 concurrent requests at any given time).

Here are the two primary patterns for implementing concurrent processing over an async iterator.

---

### Pattern A: Fixed Window / Chunked Batching

This pattern pulls $N$ items from the iterator, processes them in parallel using `Promise.all()`, awaits completion of the entire batch, and then pulls the next $N$ items.

```javascript
async function* mapConcurrentBatch(asyncIterable, limit, workerFn) {
  let batch = [];

  for await (const item of asyncIterable) {
    // Collect promises up to limit
    batch.push(workerFn(item));

    if (batch.length === limit) {
      // Process current window and yield results
      const results = await Promise.all(batch);
      for (const res of results) yield res;
      batch = []; // Reset batch
    }
  }

  // Process remaining items in final incomplete batch
  if (batch.length > 0) {
    const results = await Promise.all(batch);
    for (const res of results) yield res;
  }
}

// Usage Example:
async function runBatchExample() {
  const urls = generateUrlAsyncIterator();

  // Processes URLs 5 at a time in distinct batches
  for await (const result of mapConcurrentBatch(urls, 5, fetchUrl)) {
    console.log('Batch result:', result);
  }
}

```

> **Trade-off:** Chunked batching is simple to write, but if 1 task out of 5 takes much longer than the others, worker slots sit idle waiting for that slow task to complete before starting the next batch.

---

### Pattern B: Continuous Pool (Sliding Window / Semaphore Pattern)

A continuous worker pool maintains **exactly $N$ active worker slots**. As soon as *any* single task finishes, a new item is immediately pulled from the async iterator to fill the vacant worker slot.

```javascript
async function* mapConcurrentPool(asyncIterable, concurrencyLimit, workerFn) {
  const iterator = asyncIterable[Symbol.asyncIterator]();
  const executing = new Set();
  let done = false;

  // Helper function to fetch the next item and wrap worker execution
  async function getNextTask() {
    if (done) return null;

    const { value, done: isDone } = await iterator.next();
    if (isDone) {
      done = true;
      return null;
    }

    // Execute task and remove itself from executing set when finished
    const taskPromise = (async () => {
      try {
        return await workerFn(value);
      } finally {
        executing.delete(taskPromise);
      }
    })();

    executing.add(taskPromise);
    return taskPromise;
  }

  // Fill initial pool up to concurrency limit
  while (executing.size < concurrencyLimit && !done) {
    const task = getNextTask();
    if (!task) break;
  }

  // Yield results as workers complete and refill slots
  while (executing.size > 0) {
    // Promise.race resolves as soon as ANY worker slot finishes
    const completedResult = await Promise.race(executing);
    yield completedResult;

    // Refill the freed worker slot if stream has remaining items
    if (!done && executing.size < concurrencyLimit) {
      getNextTask();
    }
  }
}

```

#### Usage Example

```javascript
const userIds = getLargeUserIdAsyncIterator();

// Maintains exactly 4 active HTTP requests in flight at all times
const concurrentStream = mapConcurrentPool(userIds, 4, async (id) => {
  const response = await fetch(`/api/users/${id}`);
  return response.json();
});

async function processAll() {
  for await (const user of concurrentStream) {
    console.log('Received user:', user.name);
  }
}

```

---

### Summary Architectural Matrix

| Strategy                             | Backpressure Control              | Resource Utilization               | Code Complexity | Use Case                                            |
| ------------------------------------ | --------------------------------- | ---------------------------------- | --------------- | --------------------------------------------------- |
| **Sequential (`for await...of`)**    | 🟢 Native / Perfect                | 🐢 Low (1 task at a time)           | 🌟 Minimal       | Sequential DB updates, file stream writes           |
| **Chunked Batching (`Promise.all`)** | 🟢 Controlled by batch size        | 🟡 Moderate (Wait for slowest task) | 🟢 Low           | Periodic API syncing, bulk batch database inserts   |
| **Continuous Pool (`Promise.race`)** | 🟢 Controlled by concurrency limit | 🚀 Maximum (Workers never sit idle) | 🟡 Moderate      | High-throughput web scraping, multi-file S3 uploads |

Explain how to handle errors, try-finally cleanup, and stream cancellation with async iterators in JavaScript.

When working with async iterators in JavaScript, resource management, error handling, and stream cancellation require careful design. Because streams often deal with external resources—such as open file handles, database connections, or socket subscriptions—ensuring that cleanup logic always executes when a stream fails or terminates early is critical to preventing memory and socket leaks.

---

## 1. Error Handling in Async Iterators

Errors during async iteration can originate from two places:

1. **Inside the generator/producer** (e.g., a failed network call or database query).
2. **Inside the consumer loop** (e.g., business logic throwing while processing a yielded item).

### Basic `try...catch` Block Around the Loop

The simplest way to handle errors in an async iterator is wrapping the `for await...of` loop in a standard `try...catch` block.

```javascript
async function consumeStream(asyncStream) {
  try {
    for await (const chunk of asyncStream) {
      if (chunk.isCorrupted) {
        throw new Error('Corrupted data encountered');
      }
      console.log('Processed:', chunk);
    }
  } catch (err) {
    console.error('Stream processing failed:', err.message);
  }
}

```

### Catching Errors Inside an Async Generator

Inside an `async function*`, wrapping internal operations in `try...catch` allows the generator to handle low-level errors gracefully or yield a fallback value before exiting.

```javascript
async function* fetchPages(totalPages) {
  for (let page = 1; page <= totalPages; page++) {
    try {
      const response = await fetch(`/api/items?page=${page}`);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      yield data;
    } catch (err) {
      console.warn(`Failed to fetch page ${page}:`, err.message);
      // Decide whether to rethrow, skip, or yield an error payload
      yield { error: true, page, message: err.message };
    }
  }
}

```

---

## 2. Resource Cleanup with `try...finally` and `.return()`

The key mechanism for cleaning up resources during async iteration is the `try...finally` block inside the generator.

### The Iterator Contract: `.return()` and `.throw()`

Under the hood, an async iterator implements two optional lifecycle methods in addition to `.next()`:

* **`return(value)`**: Called automatically by the engine when a consumer terminates the loop early (via `break`, `return`, or `throw`). It tells the generator to shut down.
* **`throw(error)`**: Passes an exception directly into the generator at its current paused `yield` point.

When an async generator has a `try...finally` block, executing `break` in a `for await...of` loop automatically invokes `.return()`, which immediately transfers control to the `finally` block before exiting.

```javascript
async function* readFileLines(filePath) {
  // Simulate opening a file handle
  const fileHandle = await openFile(filePath);
  console.log('📂 File handle opened.');

  try {
    while (!fileHandle.isEOF()) {
      const line = await fileHandle.readLine();
      yield line;
    }
  } finally {
    // ALWAYS GUARANTEED TO RUN:
    // Runs when loop finishes naturally, OR when loop hits break/return/throw
    await fileHandle.close();
    console.log('🔒 File handle safely closed.');
  }
}

// Consumer breaking early:
async function run() {
  for await (const line of readFileLines('logs.txt')) {
    if (line.includes('STOP')) {
      console.log('Stopping early...');
      break; // Triggers iterator.return(), forcing generator's finally block to run!
    }
  }
}

```

---

## 3. Stream Cancellation with `AbortController`

While `break` or `return` cancels iteration from the **consumer side**, you often need an external signal—such as a user clicking a "Cancel" button or a timeout—to stop an active async stream mid-flight.

The web standard for cancellation is **`AbortController`** and its associated **`AbortSignal`**.

### Wiring `AbortSignal` into an Async Generator

To support cancellation:

1. Pass an `AbortSignal` into the async generator function.
2. Check `signal.aborted` or listen for the `'abort'` event before/after `yield` or `await` operations.
3. Pass `signal` to any underlying async calls (like `fetch`).

```javascript
async function* streamDataWithCancellation(url, signal) {
  let page = 1;

  try {
    while (true) {
      // 1. Check if signal was aborted before making the network request
      if (signal?.aborted) {
        throw new DOMException('Aborted by user', 'AbortError');
      }

      // 2. Pass signal down to native async APIs like fetch
      const response = await fetch(`${url}?page=${page}`, { signal });
      const items = await response.json();

      if (items.length === 0) break;

      for (const item of items) {
        // Re-check abort status inside the loop
        if (signal?.aborted) {
          throw new DOMException('Aborted by user', 'AbortError');
        }
        yield item;
      }

      page++;
    }
  } finally {
    // Cleanup tasks run regardless of whether abort occurred
    console.log('Cleanup completed after cancellation or natural end.');
  }
}

```

### Usage Example with `AbortController` and Timeouts

```javascript
async function runWithTimeout() {
  const controller = new AbortController();
  const { signal } = controller;

  // Automatically trigger abort signal after 3 seconds
  const timeoutId = setTimeout(() => {
    console.log('⏱️ Time limit reached! Cancelling stream...');
    controller.abort();
  }, 3000);

  try {
    const stream = streamDataWithCancellation('/api/events', signal);

    for await (const event of stream) {
      console.log('Received event:', event);
      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  } catch (err) {
    if (err.name === 'AbortError') {
      console.warn('Stream successfully cancelled.');
    } else {
      console.error('Unexpected error:', err);
    }
  } finally {
    clearTimeout(timeoutId);
  }
}

```

---

## 4. Manual Custom Iterator Cleanup

If you build custom async iterators manually without `async function*` generators, you must implement the `return()` method explicitly to handle cleanup when consumers exit early.

```javascript
function createCustomAsyncIterable(resource) {
  return {
    [Symbol.asyncIterator]() {
      let isClosed = false;

      return {
        async next() {
          if (isClosed) {
            return { value: undefined, done: true };
          }
          const data = await resource.readNext();
          return data ? { value: data, done: false } : { value: undefined, done: true };
        },

        // Called automatically when consumer breaks/throws
        async return() {
          if (!isClosed) {
            isClosed = true;
            await resource.close();
            console.log('Resource cleaned up via manual return().');
          }
          return { value: undefined, done: true };
        }
      };
    }
  };
}

```

---

## Summary Best Practices Checklist

| Objective                 | Recommended Pattern                                         | Key Benefit                                                               |
| ------------------------- | ----------------------------------------------------------- | ------------------------------------------------------------------------- |
| **Resource Cleanup**      | Wrap generator bodies in `try...finally`.                   | Guarantees resource release on `break`, `return`, or uncaught exceptions. |
| **External Cancellation** | Pass `AbortSignal` to async generators.                     | Enables cancellation via timeouts, UI events, or parent task teardown.    |
| **Network & I/O Passing** | Forward `signal` directly to APIs (`fetch`, `fs.promises`). | Instantly halts pending network requests or disk reads at the OS layer.   |
| **Manual Iterators**      | Always implement `async return()` on the iterator object.   | Ensures custom iterators conform to standard loop cancellation semantics. |
