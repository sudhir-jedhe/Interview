### Explanation

In both examples, you are implementing a **calculator object** that supports method chaining. This allows you to call multiple methods on the same object sequentially, where each method modifies the internal state of the object (`total`) and then returns the object itself (`this`) for further method calls.

### First Example (Using an Object Literal)

```javascript
const calculator = {
  total: 0,
  add: function (val) {
    this.total += val; // Adds the value to total
    return this; // Returns the calculator object for chaining
  },
  subtract: function (val) {
    this.total -= val; // Subtracts the value from total
    return this; // Returns the calculator object for chaining
  },
  divide: function (val) {
    this.total /= val; // Divides the total by the given value
    return this; // Returns the calculator object for chaining
  },
  multiply: function (val) {
    this.total *= val; // Multiplies the total by the given value
    return this; // Returns the calculator object for chaining
  },
};

const result = calculator.add(10).subtract(2).divide(2).multiply(5);
console.log(calculator.total); // Output: 20
```

**How it works:**

1. `calculator.add(10)` adds 10 to `total`, changing the value of `total` to 10.
2. `calculator.subtract(2)` subtracts 2 from `total`, changing the value of `total` to 8.
3. `calculator.divide(2)` divides `total` by 2, changing the value of `total` to 4.
4. `calculator.multiply(5)` multiplies `total` by 5, changing the value of `total` to 20.

### Second Example (Using a Constructor Function)

```javascript
const CALC = function () {
  this.total = 0; // Initializes total to 0

  this.add = (val) => {
    this.total += val; // Adds the value to total
    return this; // Returns the current instance for chaining
  };

  this.subtract = (val) => {
    this.total -= val; // Subtracts the value from total
    return this; // Returns the current instance for chaining
  };

  this.multiply = (val) => {
    this.total *= val; // Multiplies the total by the given value
    return this; // Returns the current instance for chaining
  };

  this.divide = (val) => {
    this.total /= val; // Divides the total by the given value
    return this; // Returns the current instance for chaining
  };

  this.value = () => this.total; // Method to retrieve the final value
};

const calculator = new CALC();
calculator.add(10).subtract(2).divide(2).multiply(5);
console.log(calculator.total); // Output: 20
```

**How it works:**

- The `CALC` function is a **constructor function** that initializes the `total` property to 0 when an object is created.
- Each method (`add`, `subtract`, `multiply`, `divide`) modifies the `total` and returns the current object (`this`) for chaining.
- You can also call the `value()` method to get the final value of `total`, although it's not used in the given example.

### Key Differences

1. **Object Literal vs Constructor Function:**
   - In the first example, you're directly defining an object (`calculator`) with methods and properties.
   - In the second example, you're using a constructor function (`CALC`) to create instances of the calculator object, which gives you more flexibility for creating multiple independent calculator instances.
2. **Arrow Functions:**
   - In the second example, you use **arrow functions** for the methods (`add`, `subtract`, etc.). Arrow functions **do not bind their own `this`**, so they rely on the `this` value from the surrounding context, which in this case is the `CALC` instance.
   - In the first example, the methods are regular functions, which means they have their own `this` binding, but since you're always returning the same object (`this`), it works similarly for method chaining.

3. **Method Chaining:**
   - Both implementations allow method chaining (e.g., `calculator.add(10).subtract(2)`), as each method returns the object itself (`this`) after modifying the `total`.

### Output

For both examples, when you call the chain of methods:

```javascript
calculator.add(10).subtract(2).divide(2).multiply(5);
```

You end up with `total` being `20` because:

- `10 + 10 = 10`
- `10 - 2 = 8`
- `8 / 2 = 4`
- `4 * 5 = 20`

### Conclusion

- Both examples are valid approaches to implementing method chaining in a calculator-like object.
- The second approach using the constructor function (`CALC`) is more flexible and allows for the creation of multiple instances of the calculator, while the first approach is more straightforward for a single instance.
This explanation is accurate and covers the mechanics of method chaining in JavaScript well. A few key observations, nuances, and modern improvements to keep in mind:

### 1. The Typo in the Mathematical Walkthrough

In the "Output" section breakdown, the first bullet point lists:

- Incorrect: `10 + 10 = 10`
- Correct: `0 + 10 = 10` (since `total` starts at `0`).

---

### 2. A Subtle Gotcha in Example 1 (Singleton Mutation)

The object literal approach creates a **singleton**. If you call `calculator.add(10)` a second time later in your codebase, `total` will **not** reset to `0`—it will start from `20` and evaluate to `40`.

To reuse an object literal safely, you would need a explicit reset method (e.g., `reset() { this.total = 0; return this; }`).

---

### 3. Arrow Functions vs. Prototypes in Constructor Functions

In Example 2, methods are assigned directly inside the constructor using arrow functions:

```javascript
this.add = (val) => { ... };

```

While this correctly captures `this` from the lexical scope, it recreates brand-new function instances in memory **every single time** `new CALC()` is called.

For better performance and memory efficiency across multiple instances, standard practice relies on **prototypes** or modern **ES6 `class` syntax**:

#### Modern ES6 Class Approach (Recommended)

```javascript
class Calculator {
  constructor(initialValue = 0) {
    this.total = initialValue;
  }

  add(val) {
    this.total += val;
    return this;
  }

  subtract(val) {
    this.total -= val;
    return this;
  }

  multiply(val) {
    this.total *= val;
    return this;
  }

  divide(val) {
    this.total /= val;
    return this;
  }

  value() {
    return this.total;
  }
}

// Usage
const calc = new Calculator();
console.log(calc.add(10).subtract(2).divide(2).multiply(5).value()); // Output: 20

```

---

### Summary Table

| Pattern                           | Best Use Case                                            | Memory Impact                            | Multi-Instance Ready?          |
| --------------------------------- | -------------------------------------------------------- | ---------------------------------------- | ------------------------------ |
| **Object Literal**                | Simple, quick scripts where only 1 calculator is needed. | Low (Single Object)                      | No (State is shared/persisted) |
| **Constructor + Arrow Functions** | Quick component helpers needing lexical `this`.          | Higher (Methods duplicated per instance) | Yes                            |
| **ES6 `class**`                   | Production applications, reusability, clean syntax.      | Optimal (Methods shared on prototype)    | Yes                            |

Implementing method chaining with asynchronous operations requires ensuring that each method in the chain returns either a **Promise that resolves to `this**` or a **thenable wrapper object**.

Here are the three primary approaches to achieve asynchronous method chaining, ranging from standard Promise-returning classes to custom async wrappers.

---

### Approach 1: Class Methods Returning `this` via Promises (Standard Async Chaining)

The most straightforward way is to make each chained method an `async` function (or return a Promise) that resolves to `this`.

Because `async` functions automatically wrap return values in a Promise, calling `.then()` or `await` between calls allows sequential execution:

```javascript
class AsyncCalculator {
  constructor(initialValue = 0) {
    this.total = initialValue;
  }

  // Helper to simulate asynchronous delay
  async delay(ms = 500) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async add(val) {
    await this.delay();
    this.total += val;
    return this; // Resolves to the instance
  }

  async subtract(val) {
    await this.delay();
    this.total -= val;
    return this;
  }

  async multiply(val) {
    await this.delay();
    this.total *= val;
    return this;
  }

  async value() {
    await this.delay();
    return this.total;
  }
}

```

#### How to consume it

**1. Using Promise `.then()` chaining:**

```javascript
const calc = new AsyncCalculator();

calc.add(10)
  .then((c) => c.subtract(2))
  .then((c) => c.multiply(5))
  .then((c) => c.value())
  .then((result) => console.log(result)); // Output after 2s: 40

```

**2. Using `await` sequentially:**

```javascript
async function run() {
  const calc = new AsyncCalculator();
  
  await calc.add(10);
  await calc.subtract(2);
  await calc.multiply(5);
  const result = await calc.value();

  console.log(result); // Output: 40
}

run();

```

---

### Approach 2: Fluent Queue Pipeline (Synchronous Chaining, Async Execution)

If you want the clean syntax of **dot-chaining without `await` at every step** (e.g., `calc.add(10).subtract(2).value()`), you can push tasks onto an internal Promise queue and defer execution until the end of the chain.

```javascript
class AsyncQueueCalculator {
  constructor(initialValue = 0) {
    // Start the queue resolved with initial state
    this.queue = Promise.resolve(initialValue);
  }

  _delay(ms = 500) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  add(val) {
    this.queue = this.queue.then(async (total) => {
      await this._delay();
      return total + val;
    });
    return this; // Returns `this` synchronously so methods can be dot-chained
  }

  subtract(val) {
    this.queue = this.queue.then(async (total) => {
      await this._delay();
      return total - val;
    });
    return this;
  }

  multiply(val) {
    this.queue = this.queue.then(async (total) => {
      await this._delay();
      return total * val;
    });
    return this;
  }

  // Final terminal method to execute the queue and return the value
  async value() {
    return await this.queue;
  }
}

// Usage: Synchronous-looking method chaining!
const calc = new AsyncQueueCalculator(0);

calc.add(10)
    .subtract(2)
    .multiply(5)
    .value()
    .then((result) => console.log(result)); // Output after 1.5s: 40

```

---

### Approach 3: Proxy / Thenable Chain (Advanced Fluent API)

Libraries like Cypress or Knex use a **Thenable Proxy** pattern. Every method call appends to an internal Promise chain and returns a Proxy that acts like a Promise (it implements `.then()`), allowing seamless `await` at the end of the chain.

```javascript
class FluentAsync {
  constructor(promise = Promise.resolve(0)) {
    this.promise = promise;
  }

  // Make the class object "thenable" so it can be directly `await`ed
  then(onFulfilled, onRejected) {
    return this.promise.then(onFulfilled, onRejected);
  }

  _delay(ms = 300) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  add(val) {
    const nextPromise = this.promise.then(async (total) => {
      await this._delay();
      return total + val;
    });
    return new FluentAsync(nextPromise);
  }

  multiply(val) {
    const nextPromise = this.promise.then(async (total) => {
      await this._delay();
      return total * val;
    });
    return new FluentAsync(nextPromise);
  }
}

// Usage: Clean chaining with direct await support
async function execute() {
  const result = await new FluentAsync()
    .add(10)
    .multiply(4)
    .add(2);

  console.log(result); // Output: 42
}

execute();

```

---

### Comparison Summary

| Approach                      | Syntax Example                     | How It Works                                                             | Best For                                                              |
| ----------------------------- | ---------------------------------- | ------------------------------------------------------------------------ | --------------------------------------------------------------------- |
| **1. Standard Async Methods** | `await c.add(10); await c.sub(2);` | Each method returns `Promise<this>`.                                     | Simple async classes where intermediate steps need explicit awaiting. |
| **2. Internal Promise Queue** | `c.add(10).sub(2).value()`         | Methods queue promises synchronously; `.value()` flushes the pipeline.   | Batching work without having to `await` intermediate calls.           |
| **3. Thenable Proxy Object**  | `await c.add(10).sub(2)`           | Objects implement `.then()`, allowing direct `await` on the final chain. | Custom libraries, ORMs, and fluent domain-specific languages (DSLs).  |

Handling errors and retries in an asynchronous method chain requires two core features:

1. **Error Propagation**: Preventing unhandled promise rejections and allowing standard `.catch()` or `try/catch` blocks to capture errors anywhere in the pipeline.
2. **Retry Logic**: Wrapping individual step execution in an exponential backoff loop so intermittent network or timing failures recover automatically without breaking the outer chain.

Here are the standard patterns to implement robust, retry-capable async method chains using the **Internal Promise Queue** (fluent) and **Thenable Wrapper** models.

---

### Pattern 1: Retrying Steps within a Queue Pipeline

In this pattern, each queued operation is wrapped with a retry mechanism. If a step fails, it retries up to `maxRetries` before rejecting. Once rejected, the entire chain halts execution and jumps to the final `.catch()`.

```javascript
class ResilientAsyncChain {
  constructor(initialValue = 0) {
    this.chain = Promise.resolve(initialValue);
  }

  /**
   * Internal retry wrapper with delay / exponential backoff
   */
  async _withRetry(fn, maxRetries = 3, delayMs = 500) {
    let lastError;
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await fn();
      } catch (err) {
        lastError = err;
        console.warn(`Attempt ${attempt}/${maxRetries} failed: ${err.message}`);
        if (attempt < maxRetries) {
          // Exponential backoff delay
          await new Promise((res) => setTimeout(res, delayMs * Math.pow(2, attempt - 1)));
        }
      }
    }
    throw new Error(`Task failed after ${maxRetries} attempts. Last error: ${lastError.message}`);
  }

  /**
   * Helper to append steps to the promise chain safely
   */
  _enqueue(operation, options = {}) {
    this.chain = this.chain.then(async (currentVal) => {
      return this._withRetry(() => operation(currentVal), options.retries, options.delay);
    });
    return this; // Return instance for chaining
  }

  // Chained methods
  fetchData(url) {
    return this._enqueue(async () => {
      // Flaky operation simulation
      if (Math.random() < 0.7) {
        throw new Error(`Network timeout fetching ${url}`);
      }
      return { data: [10, 20, 30] };
    }, { retries: 3, delay: 200 });
  }

  transformData(fn) {
    return this._enqueue(async (state) => {
      return { data: state.data.map(fn) };
    });
  }

  // Terminal value resolver
  async execute() {
    return await this.chain;
  }
}

```

#### Consuming with `async/await` and `try/catch`

```javascript
async function runPipeline() {
  try {
    const result = await new ResilientAsyncChain()
      .fetchData("https://api.example.com/items")
      .transformData((x) => x * 2)
      .execute();

    console.log("Pipeline Succeeded:", result);
  } catch (error) {
    console.error("Pipeline Failed Permanently:", error.message);
  }
}

runPipeline();

```

---

### Pattern 2: Graceful Step-Level Error Recovery (`.catch()` in Chain)

Sometimes you don't want a failed step to break the whole chain. You can introduce a `.fallback()` or `.catch()` method into the fluent interface so the pipeline can recover state and continue.

```javascript
class RecoverableChain {
  constructor(promise = Promise.resolve(null)) {
    this.promise = promise;
  }

  then(onFulfilled, onRejected) {
    return this.promise.then(onFulfilled, onRejected);
  }

  step(fn) {
    const next = this.promise.then(async (val) => await fn(val));
    return new RecoverableChain(next);
  }

  // Intercept errors in the chain and supply a fallback value
  catch(fallbackFn) {
    const recovered = this.promise.catch(async (err) => {
      console.log(`Recovered from error ("${err.message}") using fallback.`);
      return await fallbackFn(err);
    });
    return new RecoverableChain(recovered);
  }
}

// Usage
async function execute() {
  const data = await new RecoverableChain()
    .step(async () => {
      throw new Error("Service Unavailable");
    })
    .catch(async (err) => {
      // Fallback value when step fails
      return { status: "cached", items: [1, 2, 3] };
    })
    .step(async (state) => {
      return state.items.length;
    });

  console.log("Final Output:", data); // Output: 3
}

execute();

```

---

### Key Best Practices

1. **Avoid Unhandled Rejections:** Ensure every internal promise in the chain is attached via `.then()` or awaited inside an async function. If a step throws an uncaught error, it will naturally reject the outer chain.
2. **Exponential Backoff:** Avoid hammering servers instantly on retries. Scale delays using $delay \times 2^{attempt - 1}$.
3. **Immutability vs. Shared State:** Passing intermediate results through the `Promise.then` argument chain (like `Pattern 2`) avoids race conditions if multiple async chains run in parallel.

Show how to build an asynchronous HTTP API request builder using method chaining in JavaScript.

Building a fluent, asynchronous HTTP API request builder combines **method chaining for request configuration** with a **Thenable interface** so it can be directly `await`ed or completed with a terminal `.send()` call.

Here is a full implementation using native `fetch`, featuring headers, query parameters, retries, and JSON body parsing.

---

### Implementation: The `RequestBuilder` Class

```javascript
class RequestBuilder {
  constructor(baseUrl = '') {
    this.baseUrl = baseUrl;
    this._endpoint = '';
    this._method = 'GET';
    this._headers = { 'Content-Type': 'application/json' };
    this._queryParams = {};
    this._body = null;
    this._retries = 0;
    this._retryDelay = 500;
  }

  // --- Configuration Methods (Method Chaining) ---

  endpoint(path) {
    this._endpoint = path;
    return this;
  }

  method(verb) {
    this._method = verb.toUpperCase();
    return this;
  }

  header(key, value) {
    this._headers[key] = value;
    return this;
  }

  auth(token) {
    this._headers['Authorization'] = `Bearer ${token}`;
    return this;
  }

  query(params) {
    this._queryParams = { ...this._queryParams, ...params };
    return this;
  }

  body(data) {
    this._body = typeof data === 'object' ? JSON.stringify(data) : data;
    return this;
  }

  retry(count = 3, delayMs = 500) {
    this._retries = count;
    this._retryDelay = delayMs;
    return this;
  }

  // --- Execution & Retry Logic ---

  async _executeWithRetry() {
    // Construct full URL with query parameters
    const url = new URL(this._endpoint, this.baseUrl || window.location.origin);
    Object.entries(this._queryParams).forEach(([k, v]) => {
      if (v !== undefined && v !== null) url.searchParams.append(k, v);
    });

    const options = {
      method: this._method,
      headers: this._headers,
      body: ['POST', 'PUT', 'PATCH'].includes(this._method) ? this._body : undefined,
    };

    let lastError;
    for (let attempt = 0; attempt <= this._retries; attempt++) {
      try {
        const response = await fetch(url.toString(), options);
        if (!response.ok) {
          throw new Error(`HTTP Error ${response.status}: ${response.statusText}`);
        }
        
        // Handle empty responses (204 No Content) vs JSON
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          return await response.json();
        }
        return await response.text();
      } catch (err) {
        lastError = err;
        if (attempt < this._retries) {
          // Exponential backoff
          const delay = this._retryDelay * Math.pow(2, attempt);
          await new Promise((res) => setTimeout(res, delay));
        }
      }
    }

    throw new Error(`Request failed after ${this._retries + 1} attempts. Cause: ${lastError.message}`);
  }

  // Explicit terminal call
  async send() {
    return await this._executeWithRetry();
  }

  // Makes the object "Thenable", allowing direct `await api.get(...)` syntax
  then(onFulfilled, onRejected) {
    return this._executeWithRetry().then(onFulfilled, onRejected);
  }
}

```

---

### Creating an API Client Factory

To avoid repeating base configuration (like base URLs or authentication tokens), wrap the builder in an API client factory:

```javascript
class ApiClient {
  constructor(baseUrl, defaultToken = null) {
    this.baseUrl = baseUrl;
    this.token = defaultToken;
  }

  request(endpoint = '') {
    const builder = new RequestBuilder(this.baseUrl).endpoint(endpoint);
    if (this.token) builder.auth(this.token);
    return builder;
  }

  // Shortcut helpers
  get(endpoint) {
    return this.request(endpoint).method('GET');
  }

  post(endpoint, data) {
    return this.request(endpoint).method('POST').body(data);
  }

  put(endpoint, data) {
    return this.request(endpoint).method('PUT').body(data);
  }

  delete(endpoint) {
    return this.request(endpoint).method('DELETE');
  }
}

```

---

### Usage Examples

#### 1. Basic GET Request using Direct `await` (Thenable Pattern)

```javascript
const api = new ApiClient('https://api.github.com');

async function getUser() {
  try {
    // Directly awaiting the chained object triggers execution
    const user = await api
      .get('/users/octocat')
      .header('User-Agent', 'MyApp')
      .retry(2);

    console.log('User profile:', user.name);
  } catch (err) {
    console.error('Failed to fetch user:', err.message);
  }
}

```

#### 2. POST Request with Auth, Query Parameters, and Explicit `.send()`

```javascript
const api = new ApiClient('https://jsonplaceholder.typicode.com');

async function createPost() {
  try {
    const response = await api
      .post('/posts', { title: 'Async Chaining', body: 'Fluent HTTP Builders' })
      .auth('secret-jwt-token')
      .query({ draft: false, notify: true })
      .retry(3, 300)
      .send(); // Explicitly sending

    console.log('Created post:', response);
  } catch (err) {
    console.error('Error creating post:', err.message);
  }
}

```

---

### How the Magic Works

1. **Immutable Chain vs. Mutable Config:** Each setter method (`.query()`, `.header()`, `.auth()`) mutates the builder's internal configuration state and returns `this`, allowing continuous method chaining.
2. **The `then()` Method (Thenable):** JavaScript's `await` operator checks if an object has a `.then()` method. By implementing `then(...)` directly on `RequestBuilder`, the instance can be awaited like a native Promise, removing the requirement to explicitly call `.send()` at the end.

Show how to add request and response middleware/interceptors to the RequestBuilder API client.

Adding request and response interceptors to a fluent API client allows you to transform outgoing configs (e.g., adding dynamic auth tokens, logging) and incoming responses (e.g., handling global errors, unwrapping data payloads) before they reach caller code.

Here is how to enhance the `ApiClient` and `RequestBuilder` implementation with middleware stacks for both request and response phases.

---

### Implementation: Request & Response Interceptors

```javascript
class RequestBuilder {
  constructor(baseUrl = '', interceptors = { request: [], response: [] }) {
    this.baseUrl = baseUrl;
    this.interceptors = interceptors;

    // Config state
    this._endpoint = '';
    this._method = 'GET';
    this._headers = { 'Content-Type': 'application/json' };
    this._queryParams = {};
    this._body = null;
    this._retries = 0;
    this._retryDelay = 500;
  }

  // --- Chaining Config Methods ---

  endpoint(path) {
    this._endpoint = path;
    return this;
  }

  method(verb) {
    this._method = verb.toUpperCase();
    return this;
  }

  header(key, value) {
    this._headers[key] = value;
    return this;
  }

  auth(token) {
    this._headers['Authorization'] = `Bearer ${token}`;
    return this;
  }

  query(params) {
    this._queryParams = { ...this._queryParams, ...params };
    return this;
  }

  body(data) {
    this._body = typeof data === 'object' ? JSON.stringify(data) : data;
    return this;
  }

  retry(count = 3, delayMs = 500) {
    this._retries = count;
    this._retryDelay = delayMs;
    return this;
  }

  // --- Execution & Interceptor Pipeline ---

  async _executeWithRetry() {
    // 1. Build initial request context object
    let requestContext = {
      baseUrl: this.baseUrl,
      endpoint: this._endpoint,
      method: this._method,
      headers: { ...this._headers },
      queryParams: { ...this._queryParams },
      body: this._body,
    };

    // 2. Run Request Interceptors sequentially
    for (const interceptor of this.interceptors.request) {
      requestContext = (await interceptor(requestContext)) || requestContext;
    }

    // 3. Assemble URL from final request context
    const url = new URL(requestContext.endpoint, requestContext.baseUrl || window.location.origin);
    Object.entries(requestContext.queryParams).forEach(([k, v]) => {
      if (v !== undefined && v !== null) url.searchParams.append(k, v);
    });

    const options = {
      method: requestContext.method,
      headers: requestContext.headers,
      body: ['POST', 'PUT', 'PATCH'].includes(requestContext.method) ? requestContext.body : undefined,
    };

    // 4. Fetch with Retry Pipeline
    let lastError;
    let response;

    for (let attempt = 0; attempt <= this._retries; attempt++) {
      try {
        response = await fetch(url.toString(), options);
        if (!response.ok) {
          throw new Error(`HTTP Error ${response.status}: ${response.statusText}`);
        }
        break; // Request succeeded, break retry loop
      } catch (err) {
        lastError = err;
        if (attempt < this._retries) {
          const delay = this._retryDelay * Math.pow(2, attempt);
          await new Promise((res) => setTimeout(res, delay));
        }
      }
    }

    if (!response || !response.ok) {
      throw new Error(`Request failed after ${this._retries + 1} attempts. Cause: ${lastError.message}`);
    }

    // 5. Parse body payload
    const contentType = response.headers.get('content-type');
    let data;
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    // 6. Run Response Interceptors sequentially
    let responseContext = { response, data };
    for (const interceptor of this.interceptors.response) {
      responseContext = (await interceptor(responseContext)) || responseContext;
    }

    return responseContext.data;
  }

  // Make the object Thenable
  then(onFulfilled, onRejected) {
    return this._executeWithRetry().then(onFulfilled, onRejected);
  }
}

```

---

### Updating `ApiClient` to Manage Interceptors

The client instance acts as the centralized registry for global request and response interceptors.

```javascript
class ApiClient {
  constructor(baseUrl) {
    this.baseUrl = baseUrl;
    this.interceptors = {
      request: [],
      response: [],
    };
  }

  // Register request interceptors
  useRequest(fn) {
    this.interceptors.request.push(fn);
    return this;
  }

  // Register response interceptors
  useResponse(fn) {
    this.interceptors.response.push(fn);
    return this;
  }

  request(endpoint = '') {
    return new RequestBuilder(this.baseUrl, this.interceptors).endpoint(endpoint);
  }

  get(endpoint) {
    return this.request(endpoint).method('GET');
  }

  post(endpoint, data) {
    return this.request(endpoint).method('POST').body(data);
  }
}

```

---

### Usage Example: Logging, Dynamic Auth, and Global Data Unwrapping

```javascript
const api = new ApiClient('https://jsonplaceholder.typicode.com');

// --- Request Interceptor 1: Dynamic Auth Token Injection ---
api.useRequest(async (config) => {
  const token = await Promise.resolve('session-bearer-token-123'); // e.g. fetched from storage
  config.headers['Authorization'] = `Bearer ${token}`;
  return config;
});

// --- Request Interceptor 2: Logging Outgoing Requests ---
api.useRequest((config) => {
  console.log(`[OUTGOING] ${config.method} -> ${config.endpoint}`);
  return config;
});

// --- Response Interceptor 1: Handling Global Error Statuses ---
api.useResponse(({ response, data }) => {
  if (response.status === 401) {
    console.error('Unauthorized! Redirecting to login...');
  }
  return { response, data };
});

// --- Response Interceptor 2: Unwrapping Nested Data Wrappers ---
api.useResponse(({ response, data }) => {
  // If API wraps payloads inside { status: "success", result: { ... } }
  if (data && data.result) {
    return { response, data: data.result };
  }
  return { response, data };
});

// --- Usage ---
async function fetchPosts() {
  try {
    const posts = await api.get('/posts').query({ userId: 1 });
    console.log('Final Received Data:', posts);
  } catch (err) {
    console.error('Request failed:', err.message);
  }
}

fetchPosts();

```

---

### Key Highlights

1. **Async Interceptors:** Each interceptor in the queue is awaited sequentially using `await interceptor(...)`. This allows request interceptors to perform async tasks (e.g., refreshing an expired OAuth token) before proceeding with the HTTP call.
2. **Context Passing:** The request interceptor receives a mutable context (`requestContext`). Interceptors return the modified context, which flows down to the next interceptor in the chain.
3. **Decoupled Business Logic:** Individual endpoints don't need manual authentication or payload extraction—the middleware pipeline processes cross-cutting concerns automatically.

How do you add request timeouts and AbortController cancellation support to this RequestBuilder API client?

To add request timeouts and cancellation support using `AbortController` to a `RequestBuilder` API client, you need to:

1. **Store an `AbortController` instance** inside the builder (or allow passing a custom `AbortSignal`).
2. **Accept a timeout duration** (in milliseconds) and use `setTimeout` to trigger `controller.abort()` when the duration expires.
3. **Combine external and internal signals** using `AbortSignal.any()` if the consumer passes their own custom signal.
4. **Pass the signal to `fetch**` in the execution method.

---

### Implementation Example

```typescript
export class RequestBuilder {
  private url: string;
  private options: RequestInit = {};
  private timeoutMs?: number;
  private externalSignal?: AbortSignal;

  constructor(baseUrl: string) {
    this.url = baseUrl;
  }

  // 1. Add method to set a timeout
  setTimeout(timeoutMs: number): this {
    this.timeoutMs = timeoutMs;
    return this;
  }

  // 2. Add method to pass an external AbortSignal (e.g., from UI unmounts or user cancels)
  setSignal(signal: AbortSignal): this {
    this.externalSignal = signal;
    return this;
  }

  // Standard request methods
  setMethod(method: string): this {
    this.options.method = method;
    return this;
  }

  setHeaders(headers: Record<string, string>): this {
    this.options.headers = headers;
    return this;
  }

  // 3. Handle signal combination & timeout during execution
  async send<T = any>(): Promise<T> {
    const internalController = new AbortController();
    let timeoutId: NodeJS.Timeout | number | undefined;

    // Combine signals if an external signal was passed
    const signalsToCombine: AbortSignal[] = [internalController.signal];
    if (this.externalSignal) {
      signalsToCombine.push(this.externalSignal);
    }

    // AbortSignal.any combines multiple signals (supported in modern browsers & Node 20+)
    const combinedSignal = AbortSignal.any
      ? AbortSignal.any(signalsToCombine)
      : internalController.signal; // Fallback if single signal

    // Set up the timeout timer
    if (this.timeoutMs) {
      timeoutId = setTimeout(() => {
        internalController.abort(new Error(`Request timed out after ${this.timeoutMs}ms`));
      }, this.timeoutMs);
    }

    try {
      const response = await fetch(this.url, {
        ...this.options,
        signal: combinedSignal,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error: any) {
      if (error.name === 'AbortError') {
        console.error('Request was cancelled or timed out:', error.message);
      }
      throw error;
    } finally {
      // Always clear the timer to prevent memory leaks
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    }
  }
}

```

---

### Usage Patterns

#### 1. Automatic Timeout

```typescript
const data = await new RequestBuilder('https://api.example.com/data')
  .setMethod('GET')
  .setTimeout(5000) // Aborts if request takes longer than 5 seconds
  .send();

```

#### 2. Manual Cancellation (User-triggered or Component Unmount)

```typescript
const controller = new AbortController();

// Pass signal to the builder
const requestPromise = new RequestBuilder('https://api.example.com/large-file')
  .setMethod('GET')
  .setSignal(controller.signal)
  .send();

// Cancel request from outside
btnCancel.addEventListener('click', () => {
  controller.abort('User cancelled the upload');
});

```

#### 3. Combining Both

When using both `.setTimeout(3000)` and `.setSignal(userController.signal)`, the fetch request will abort whichever happens first—either the 3-second timer expiring or the user clicking "Cancel".
