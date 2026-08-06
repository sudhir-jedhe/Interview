The provided code showcases three different approaches to implementing **memoization** in JavaScript, a technique used to improve the performance of functions by caching their results. Below is an explanation of each method, its features, and potential use cases:

---

### **1. Basic Closure-Based Memoization**

#### Code

```javascript
const memoizAddition = () => {
  let cache = {};
  return (value) => {
    if (value in cache) {
      console.log("Fetching from cache");
      return cache[value];
    } else {
      console.log("Calculating result");
      let result = value + 20;
      cache[value] = result;
      return result;
    }
  };
};

const addition = memoizAddition();
console.log(addition(20)); // Output: 40 (calculated)
console.log(addition(20)); // Output: 40 (cached)
```

#### Features

- **Simple and Straightforward**: A closure maintains a `cache` object.
- **Keyed by Input Values**: Cache uses the input value as the key.
- **No Cache Clearing**: Cache grows indefinitely, which could cause memory issues for functions with many unique inputs.

#### Use Case

- Quick and simple caching for functions with single primitive inputs.

---

### **2. Advanced Memoization Using `Map`**

#### Code

```javascript
const memoize = fn => {
  const cache = new Map();
  const cached = function (val) {
    return cache.has(val)
      ? cache.get(val)
      : cache.set(val, fn.call(this, val)) && cache.get(val);
  };
  cached.cache = cache;
  return cached;
};

const anagrams = str => {
  if (str.length <= 2) return str.length === 2 ? [str, str[1] + str[0]] : [str];
  return str
    .split('')
    .reduce(
      (acc, letter, i) =>
        acc.concat(
          anagrams(str.slice(0, i) + str.slice(i + 1)).map(val => letter + val)
        ),
      []
    );
};

const anagramsCached = memoize(anagrams);
anagramsCached('javascript'); // Slow for first call
anagramsCached('javascript'); // Virtually instant due to caching
```

#### Features

- **Uses `Map` for Cache**: `Map` is more efficient than objects for caching and allows any value (e.g., objects) as keys.
- **Reusable Memoize Function**: Can memoize any single-argument function.
- **Attaches Cache to Function**: Cache is exposed for inspection or clearing.

#### Use Case

- Caching computationally intensive functions like `anagrams` with a single argument.

---

### **3. Memoization Using Proxies**

#### Code

```javascript
const memoize = fn =>
  new Proxy(fn, {
    cache: new Map(),
    apply(target, thisArg, argsList) {
      let cacheKey = argsList.toString();
      if (!this.cache.has(cacheKey)) {
        this.cache.set(cacheKey, target.apply(thisArg, argsList));
      }
      return this.cache.get(cacheKey);
    },
  });

const fibonacci = n => (n <= 1 ? 1 : fibonacci(n - 1) + fibonacci(n - 2));
const memoizedFibonacci = memoize(fibonacci);

for (let i = 0; i < 100; i++) fibonacci(30); // ~5000ms
for (let i = 0; i < 100; i++) memoizedFibonacci(30); // ~50ms
```

#### Features

- **Uses `Proxy`**: Leverages the `apply` trap to intercept function calls.
- **Supports Multiple Arguments**: Arguments are serialized into a string key.
- **Elegant and Reusable**: Memoizes functions with minimal boilerplate.

#### Use Case

- General-purpose memoization for functions with multiple arguments or varying inputs.

---

### **Comparative Analysis**

| Feature            | Closure-Based      | `Map`-Based   | Proxy-Based   |
| ------------------ | ------------------ | ------------- | ------------- |
| Simplicity         | High               | Medium        | Low           |
| Cache Efficiency   | Medium (Object)    | High (`Map`)  | High (`Map`)  |
| Multiple Arguments | No                 | Limited       | Yes           |
| Reusability        | Low (Specific Use) | Medium        | High          |
| Memory Management  | None (Manual)      | None (Manual) | None (Manual) |

---

### **Best Practices for Memoization**

1. **Clear Cache for Large Inputs**: Implement a cache eviction strategy (e.g., LRU) if the function handles many unique inputs.
2. **Avoid Overhead for Lightweight Functions**: Use memoization only for functions where computation time is significant.
3. **Test with Edge Cases**: Ensure correctness for recursive or complex input structures.
4. **Serialize Keys Properly**: When handling objects or multiple arguments, serialize keys carefully to avoid collisions.

---

### **Conclusion**

- **Closure-Based**: Good for simple cases.
- **Map-Based**: Versatile and efficient.
- **Proxy-Based**: Powerful, elegant, and suitable for complex functions.

# Memoization in JavaScript & React (Interview Perspective)

Memoization is a **performance optimization technique** where the result of an expensive function call is cached and reused when the same inputs occur again.

The interview evaluations found in your organisation's knowledge base describe `useMemo` as caching expensive computations and returning the cached result when dependencies have not changed, while `React.memo` prevents unnecessary child component re-renders when props remain unchanged. [\[AI_Intevie...d_00003240 \| PDF\]](https://persistentsystems.sharepoint.com/sites/PersistentLearningandDevelopment/ResponsiveAssets/SLF/SLF%20AI-interview%20reports/HLS-SLF%20AI-interview%20reports/Myriad/AI_Inteview_Evaluation_Tushar%20Rathod_00003240.pdf?web=1), [\[Chowshan C...Evaluation \| PDF\]](https://persistentsystems.sharepoint.com/sites/PersistentLearningandDevelopment/ResponsiveAssets/SLF/SLF%20AI-interview%20reports/BFSI-SLF%20AI-interview%20reports/CBA/Chowshan%20Chowtapalli_00002666_AI_Inteview_Evaluation.pdf?web=1)

***

# 1. What is Memoization?

Without memoization:

```javascript
calculate(5);
calculate(5);
calculate(5);
```

```text
Calculation happens 3 times
```

With memoization:

```javascript
calculate(5);
calculate(5);
calculate(5);
```

```text
Calculation happens once
Cached result returned
```

***

# JavaScript Memoization Example

## Without Memoization

```javascript
function square(num) {

  console.log("Computing...");

  return num * num;
}

square(5);
square(5);
```

Output:

```text
Computing...
Computing...
```

***

## With Memoization

```javascript
function memoize(fn) {

  const cache = {};

  return function(num) {

    if (cache[num]) {

      console.log(
        "From Cache"
      );

      return cache[num];
    }

    console.log(
      "Calculating"
    );

    const result =
      fn(num);

    cache[num] = result;

    return result;
  };
}

const square =
  memoize(num =>
    num * num
  );

square(5);
square(5);
square(5);
```

Output:

```text
Calculating
From Cache
From Cache
```

***

# Fibonacci Interview Question

Without memoization:

```javascript
function fib(n) {

  if (n <= 1)
    return n;

  return (
    fib(n - 1) +
    fib(n - 2)
  );
}
```

Complexity:

```text
O(2^n)
```

***

## Memoized Fibonacci

```javascript
function memoFib() {

  const cache = {};

  return function fib(n) {

    if (n in cache) {
      return cache[n];
    }

    if (n <= 1)
      return n;

    cache[n] =
      fib(n - 1) +
      fib(n - 2);

    return cache[n];
  };
}

const fib =
  memoFib();

console.log(
  fib(40)
);
```

Complexity:

```text
O(n)
```

***

# Memoization in React

React commonly uses:

```text
✅ useMemo
✅ useCallback
✅ React.memo
```

for memoization-based optimizations. This aligns with interview discussions recorded in internal evaluation files. [\[AI_Intevie...d_00003240 \| PDF\]](https://persistentsystems.sharepoint.com/sites/PersistentLearningandDevelopment/ResponsiveAssets/SLF/SLF%20AI-interview%20reports/HLS-SLF%20AI-interview%20reports/Myriad/AI_Inteview_Evaluation_Tushar%20Rathod_00003240.pdf?web=1), [\[AI_Intevie...a_00003253 \| PDF\]](https://persistentsystems.sharepoint.com/sites/PersistentLearningandDevelopment/ResponsiveAssets/SLF/SLF%20AI-interview%20reports/HLS-SLF%20AI-interview%20reports/Myriad/AI_Inteview_Evaluation_Ankita%20Malviya_00003253.pdf?web=1)

***

# React `useMemo`

## Without useMemo

```jsx
function App() {

  const [count,
         setCount] =
    useState(0);

  const [text,
         setText] =
    useState("");

  const expensiveValue =
    expensiveFunction(
      count
    );

  return (
    <>
      <input
        onChange={
          e =>
            setText(
              e.target.value
            )
        }
      />

      <p>
        {expensiveValue}
      </p>
    </>
  );
}
```

Problem:

```text
Typing in input
↓
expensiveFunction runs again
```

***

## With useMemo

```jsx
const expensiveValue =
  useMemo(() => {

    return expensiveFunction(
      count
    );

  }, [count]);
```

Now:

```text
Input changes
❌ No recalculation

Count changes
✅ Recalculate
```

***

# React.memo

Used for components.

According to interview evaluations, `React.memo` is typically applied to child components to avoid re-rendering when props have not changed. [\[AI_Intevie...d_00003240 \| PDF\]](https://persistentsystems.sharepoint.com/sites/PersistentLearningandDevelopment/ResponsiveAssets/SLF/SLF%20AI-interview%20reports/HLS-SLF%20AI-interview%20reports/Myriad/AI_Inteview_Evaluation_Tushar%20Rathod_00003240.pdf?web=1)

```jsx
const UserCard =
  React.memo(
    ({ user }) => {

      console.log(
        "Rendered"
      );

      return (
        <div>
          {user.name}
        </div>
      );
    }
  );
```

If parent renders but:

```javascript
user prop unchanged
```

then:

```text
UserCard won't re-render
```

***

# useCallback

Memoizes functions.

### Without useCallback

```jsx
function Parent() {

  const handleClick =
    () => {};

  return (
    <Child
      onClick={
        handleClick
      }
    />
  );
}
```

Every render:

```text
New Function Created
```

***

### With useCallback

```jsx
const handleClick =
  useCallback(() => {

  }, []);
```

Same function reference:

```text
Improves React.memo effectiveness
```

***

# When to Use Memoization?

✅ Expensive calculations

```javascript
Sorting
Filtering
Aggregation
Large Lists
```

✅ Derived state

```javascript
Cart Total
Tax Calculation
Statistics
```

✅ Prevent unnecessary re-renders

```javascript
React.memo
useMemo
useCallback
```

***

# When NOT to Use Memoization?

Don't use it everywhere.

Bad:

```jsx
const value =
  useMemo(
    () => count + 1,
    [count]
  );
```

Reason:

```text
Calculation is cheap
useMemo overhead > benefit
```

***

# Most Asked Memoization Interview Questions

### What is memoization?

> Caching function results to avoid recomputation for the same inputs.

***

### Difference between `useMemo` and `useCallback`?

| useMemo        | useCallback       |
| -------------- | ----------------- |
| Memoizes value | Memoizes function |
| Returns result | Returns function  |

**useMemo**

```jsx
const total =
  useMemo(
    () => calculate(),
    []
  );
```

**useCallback**

```jsx
const handler =
  useCallback(
    () => {},
    []
  );
```

***

### Difference between `React.memo` and `useMemo`?

| React.memo         | useMemo                |
| ------------------ | ---------------------- |
| Component level    | Value level            |
| Prevents re-render | Prevents recalculation |

***

### Does `useMemo` guarantee no recalculation?

❌ No

React may discard cache when necessary.

It's a performance optimisation, not a correctness mechanism.

***

### Real-world example?

For a product grid:

```javascript
5000 products
↓
filter
↓
sort
↓
search
```

Memoize:

```javascript
filteredProducts
```

using:

```javascript
useMemo()
```

to avoid recomputing on unrelated state changes.

***

# Senior React Interview Answer

> Memoization is a performance optimisation technique that caches computed results and returns the cached value when the same inputs are provided again. In JavaScript it is commonly implemented using closures and cache objects. In React, memoization is achieved using `useMemo` for expensive computations, `useCallback` for function references, and `React.memo` for component rendering optimisation. Memoization should be used selectively for expensive calculations and unnecessary re-renders, not for every value in the application. [\[AI_Intevie...d_00003240 \| PDF\]](https://persistentsystems.sharepoint.com/sites/PersistentLearningandDevelopment/ResponsiveAssets/SLF/SLF%20AI-interview%20reports/HLS-SLF%20AI-interview%20reports/Myriad/AI_Inteview_Evaluation_Tushar%20Rathod_00003240.pdf?web=1), [\[AI_Intevie...a_00003253 \| PDF\]](https://persistentsystems.sharepoint.com/sites/PersistentLearningandDevelopment/ResponsiveAssets/SLF/SLF%20AI-interview%20reports/HLS-SLF%20AI-interview%20reports/Myriad/AI_Inteview_Evaluation_Ankita%20Malviya_00003253.pdf?web=1)

For a **Senior React Developer interview**, this is one of the most frequently asked performance topics.

The interview evaluations in your organisation's knowledge base describe:

- **`React.memo`** as preventing child component re-renders when props have not changed.
- **`useMemo`** as caching expensive computations and recalculating only when dependencies change.
- **`useCallback`** as being used alongside memoization to reduce unnecessary re-renders. [\[ManviShahResume 6 \| PDF\]](https://persistentsystems.sharepoint.com/sites/allcompany/Shared%20Documents/Apps/Yammer/ManviShahResume%206.pdf?web=1), [\[ManviShahResume \| PDF\]](https://persistentsystems.sharepoint.com/sites/MyLifeAtPersistent731/Shared%20Documents/General/ManviShahResume.pdf?web=1)

***

# 1. useMemo vs useCallback

Many candidates confuse these.

## useMemo

Memoizes a **value**.

```jsx
const value = useMemo(
  () => expensiveCalculation(data),
  [data]
);
```

Returns:

```text
Cached Result
```

***

## useCallback

Memoizes a **function**.

```jsx
const handleClick =
  useCallback(() => {

    console.log("Clicked");

  }, []);
```

Returns:

```text
Cached Function Reference
```

***

# Quick Comparison

| Feature  | useMemo                | useCallback          |
| -------- | ---------------------- | -------------------- |
| Memoizes | Value                  | Function             |
| Returns  | Computed Result        | Function Reference   |
| Used For | Expensive Calculations | Event Handlers       |
| Prevents | Recalculations         | Re-created Functions |

***

# Example: useMemo

## Problem

```jsx
function App() {

  const [count, setCount] =
    useState(0);

  const [text, setText] =
    useState("");

  const expensiveValue =
    expensiveCalculation(count);

  return (
    <>
      <input
        onChange={e =>
          setText(e.target.value)
        }
      />

      <p>{expensiveValue}</p>
    </>
  );
}
```

Typing:

```text
a
ab
abc
abcd
```

causes:

```text
expensiveCalculation()
```

to run repeatedly.

***

## Solution

```jsx
const expensiveValue =
  useMemo(() => {

    return expensiveCalculation(
      count
    );

  }, [count]);
```

Now:

```text
Text Change
❌ No Recalculation

Count Change
✅ Recalculation
```

***

# Example: useCallback

## Problem

```jsx
function Parent() {

  const handleClick =
    () => {

      console.log("Clicked");

    };

  return (
    <Child
      onClick={handleClick}
    />
  );
}
```

Every render:

```text
New Function Created
```

Therefore:

```text
Child Re-renders
```

***

## Solution

```jsx
const handleClick =
  useCallback(() => {

    console.log("Clicked");

  }, []);
```

Now:

```text
Function Reference Stays Same
```

***

# 2. React.memo Example

This is one of the most common interview questions.

## Child Component

```jsx
const Child = React.memo(
  ({ onClick }) => {

    console.log(
      "Child Rendered"
    );

    return (
      <button onClick={onClick}>
        Click
      </button>
    );
  }
);
```

***

## Parent Component

### Without useCallback

```jsx
function Parent() {

  const [count,
         setCount] =
    useState(0);

  const handleClick =
    () => {};

  return (
    <>
      <button
        onClick={() =>
          setCount(
            count + 1
          )
        }
      >
        Counter
      </button>

      <Child
        onClick={handleClick}
      />
    </>
  );
}
```

Every click:

```text
Parent Render
↓
New handleClick
↓
Child Render
```

***

### Optimized

```jsx
function Parent() {

  const [count,
         setCount] =
    useState(0);

  const handleClick =
    useCallback(() => {

    }, []);

  return (
    <>
      <button
        onClick={() =>
          setCount(
            count + 1
          )
        }
      >
        Counter
      </button>

      <Child
        onClick={handleClick}
      />
    </>
  );
}
```

Now:

```text
Parent Render
↓
Same Function Reference
↓
React.memo Skip Render
```

Result:

```text
Better Performance ✅
```

This optimisation approach is consistent with the React performance practices described in the interview evaluation material. [\[ManviShahResume 6 \| PDF\]](https://persistentsystems.sharepoint.com/sites/allcompany/Shared%20Documents/Apps/Yammer/ManviShahResume%206.pdf?web=1), [\[ManviShahResume \| PDF\]](https://persistentsystems.sharepoint.com/sites/MyLifeAtPersistent731/Shared%20Documents/General/ManviShahResume.pdf?web=1)

***

# 3. Common Memoization Interview Questions

### Q1. What is Memoization?

**Answer**

```text
Caching previously computed results
to avoid unnecessary recalculation.
```

***

### Q2. Difference Between useMemo and useCallback?

**Answer**

```text
useMemo → Memoizes a Value

useCallback → Memoizes a Function
```

***

### Q3. Difference Between React.memo and useMemo?

**Answer**

```text
React.memo
→ Component-level memoization

useMemo
→ Value-level memoization
```

***

### Q4. Difference Between React.memo and useCallback?

**Answer**

```text
React.memo
→ Prevents Child Re-render

useCallback
→ Prevents Function Re-creation
```

***

### Q5. Can useMemo Improve Everything?

❌ No.

Bad:

```jsx
const value =
  useMemo(
    () => count + 1,
    [count]
  );
```

Reason:

```text
Calculation is cheap.
Memoization overhead > benefit.
```

***

### Q6. Real-world useMemo Example?

```text
Product Filtering
Sorting
Cart Total
Analytics Dashboard
Large Table Processing
```

***

### Q7. Real-world React.memo Example?

```text
User Card
Product Card
Navigation Menu
Large Data Table Row
Dashboard Widgets
```

***

### Q8. How to Verify Memoization Worked?

Use:

```text
React DevTools
↓
Profiler
↓
Flame Graph
```

The interview evaluations specifically mention using React DevTools Profiler and flame graphs to identify unnecessary re-renders and verify optimisation effectiveness. [\[ManviShahResume 6 \| PDF\]](https://persistentsystems.sharepoint.com/sites/allcompany/Shared%20Documents/Apps/Yammer/ManviShahResume%206.pdf?web=1)

***

# Senior React Interview Answer

> `useMemo` memoizes expensive computed values and recalculates them only when dependencies change. `useCallback` memoizes function references to avoid unnecessary function recreation. `React.memo` memoizes a component and prevents re-rendering when props remain unchanged. In production React applications, these techniques are used together—`React.memo` for child components, `useCallback` for event handlers, and `useMemo` for expensive calculations such as filtering, sorting, aggregation, and large dataset transformations. [\[ManviShahResume 6 \| PDF\]](https://persistentsystems.sharepoint.com/sites/allcompany/Shared%20Documents/Apps/Yammer/ManviShahResume%206.pdf?web=1), [\[ManviShahResume \| PDF\]](https://persistentsystems.sharepoint.com/sites/MyLifeAtPersistent731/Shared%20Documents/General/ManviShahResume.pdf?web=1)

### 19. How do you implement memoization in JavaScript?

**Memoization** is a technique to optimize performance by caching function results and returning the cached result when the same inputs are encountered.

Example:

```javascript
const memoize = (func) => {
  const cache = {};
  return (arg) => {
    if (cache[arg]) return cache[arg];
    const result = func(arg);
    cache[arg] = result;
    return result;
  };
};
```
