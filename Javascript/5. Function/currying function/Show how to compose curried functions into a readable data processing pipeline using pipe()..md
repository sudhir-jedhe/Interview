Combining curried utility functions with `pipe()` allows you to build declarative, point-free data pipelines where the target data flows from left to right (top to bottom) without intermediate variable clutter.

---

### 1. The Core Primitives (`curry` and `pipe`)

* **`pipe(...fns)`**: Takes functions and chains them left-to-right (`x => f(g(x))`).
* **`curry(fn)`**: Allows configuring operations ahead of time so the data target can be supplied last ("data-last" style).

```javascript
// Universal curry
const curry = (fn) => {
  return function curried(...args) {
    if (args.length >= fn.length) {
      return fn.apply(this, args);
    }
    return (...nextArgs) => curried.apply(this, [...args, ...nextArgs]);
  };
};

// Left-to-right function composition
const pipe = (...fns) => (initialValue) =>
  fns.reduce((acc, fn) => fn(acc), initialValue);

```

---

### 2. Building "Data-Last" Curried Utility Helpers

In functional pipelines, utility helpers should receive their **configuration arguments first** and the **actual data last**.

```javascript
// filter :: (a -> Boolean) -> [a] -> [a]
const filter = curry((predicate, array) => array.filter(predicate));

// map :: (a -> b) -> [a] -> [b]
const map = curry((transform, array) => array.map(transform));

// prop :: String -> Object -> Any
const prop = curry((key, obj) => (obj ? obj[key] : undefined));

// eq :: Any -> Any -> Boolean
const eq = curry((expected, actual) => actual === expected);

// sortBy :: (Object -> Number|String) -> [Object] -> [Object]
const sortBy = curry((getter, array) =>
  [...array].sort((a, b) => {
    const valA = getter(a);
    const valB = getter(b);
    return valA > valB ? 1 : valA < valB ? -1 : 0;
  })
);

// reduce :: ((b, a) -> b) -> b -> [a] -> b
const reduce = curry((reducer, initial, array) => array.reduce(reducer, initial));

```

---

### 3. Assembling the Pipeline

Suppose we have an e-commerce order dataset. We want to:

1. Filter orders that have been **delivered**.
2. Filter for transactions from the year **2026**.
3. Sort them in ascending order of **total amount**.
4. Extract only the **customer name** and the **formatted total**.

```javascript
// Raw input dataset
const rawOrders = [
  { id: 'A1', customer: 'Alice', status: 'delivered', date: '2026-03-15', total: 120 },
  { id: 'A2', customer: 'Bob',   status: 'pending',   date: '2026-04-10', total: 450 },
  { id: 'A3', customer: 'Carol', status: 'delivered', date: '2025-11-20', total: 85 },
  { id: 'A4', customer: 'Dave',  status: 'delivered', date: '2026-01-08', total: 310 },
  { id: 'A5', customer: 'Eve',   status: 'delivered', date: '2026-06-22', total: 195 },
];

// Composed pipeline: each function is pre-configured and waiting for the array
const processDeliveredOrders2026 = pipe(
  // 1. Keep only delivered orders
  filter((order) => order.status === 'delivered'),

  // 2. Keep only 2026 orders
  filter((order) => order.date.startsWith('2026')),

  // 3. Sort by total ascending
  sortBy(prop('total')),

  // 4. Transform into clean customer report summaries
  map((order) => ({
    client: order.customer,
    amount: `$${order.total.toFixed(2)}`,
  }))
);

// Run the pipeline
const report = processDeliveredOrders2026(rawOrders);

console.log(report);
/*
Output:
[
  { client: 'Alice', amount: '$120.00' },
  { client: 'Eve',   amount: '$195.00' },
  { client: 'Dave',  amount: '$310.00' }
]
*/

```

---

### 4. Aggregating to a Single Value

Because `pipe()` simply threads the output of each function into the next, your pipeline can terminate in any data structure, such as a single numeric summary:

```javascript
const calculate2026DeliveredRevenue = pipe(
  filter((order) => order.status === 'delivered'),
  filter((order) => order.date.startsWith('2026')),
  map(prop('total')),
  reduce((sum, amount) => sum + amount, 0)
);

console.log(calculate2026DeliveredRevenue(rawOrders)); 
// Output: 625 (120 + 195 + 310)

```

---

### 5. Debugging Intermediate Steps (`trace`)

A common question with point-free pipelines is: *"How do I inspect intermediate values without breaking the chain?"*

Use a curried `trace` tap:

```javascript
const trace = curry((label, data) => {
  console.log(`=== [${label}] ===`, data);
  return data; // Always pass the data unchanged to the next pipe step
});

const debuggedPipeline = pipe(
  filter((order) => order.status === 'delivered'),
  trace('After Delivered Filter'),
  map(prop('total')),
  trace('Extracted Totals')
);

debuggedPipeline(rawOrders);

```

---

### Why This Pattern Works Well

* **Point-Free Readability:** Logic is stated in terms of actions (`filter`, `sortBy`, `map`) rather than loop bookkeeping (`for`, `i++`, temporary variables).
* **Reusability:** Curried predicates like `filter(order => order.status === 'delivered')` or `sortBy(prop('total'))` can be exported and reused across multiple routes, services, or UI components.
* **Testability:** Each stage is an isolated, pure function that can be unit-tested independently without mocking the rest of the flow.
