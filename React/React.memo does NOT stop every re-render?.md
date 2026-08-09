**No, `React.memo` does NOT stop every re-render.**

`React.memo` is a Higher-Order Component (HOC) that optimizes performance by skipping re-renders **only when a component's props have not changed**. However, there are several common scenarios where a component wrapped in `React.memo` will still re-render.

---

### When `React.memo` SKIPS Re-renders

If a parent component re-renders, React normally re-renders all of its child components recursively.

When you wrap a child component in `React.memo`, React checks its props. If the new props are **shallowly equal** (`oldProps === newProps`) to the previous props, React skips re-rendering the child.

---

### When `React.memo` FAILS to Stop Re-renders

#### 1. Internal State Changes (`useState` or `useReducer`)

`React.memo` only checks incoming props. If the memoized component updates its **own internal state**, it will re-render regardless of whether its props changed.

```tsx
const MemoizedCounter = React.memo(() => {
  const [count, setCount] = useState(0); // 👈 Internal State
  
  // Clicking this will STILL force a re-render!
  return <button onClick={() => setCount(count + 1)}>Count: {count}</button>;
});

```

#### 2. Subscribed Context Changes (`useContext`)

If a memoized component consumes a React Context using `useContext` (or `<Context.Consumer>`), it will **always re-render when the context value changes**, even if its props remain identical.

```tsx
const MemoizedProfile = React.memo(() => {
  const theme = useContext(ThemeContext); // 👈 Context Subscription
  
  // Re-renders every time ThemeContext value changes!
  return <div className={theme}>User Profile</div>;
});

```

#### 3. Unstable Prop References (Functions, Objects, Arrays)

By default, `React.memo` performs a **shallow equality check** (`Object.is`) on props. In JavaScript, inline objects, arrays, and function declarations create **new memory references** on every render.

```tsx
function Parent() {
  const [text, setText] = useState('');

  // ❌ Inline function reference changes on every Parent render!
  const handleClick = () => console.log('Clicked');

  // ❌ Inline object reference changes on every Parent render!
  const user = { name: 'Alex' };

  return (
    <div>
      <input value={text} onChange={(e) => setText(e.target.value)} />
      {/* MemoizedChild WILL STILL RE-RENDER because props fail shallow check! */}
      <MemoizedChild onClick={handleClick} user={user} />
    </div>
  );
}

```

* **How to Fix:** Wrap functions in **`useCallback`** and objects/arrays in **`useMemo`** in the parent component to keep their memory references stable.

---

### How to Customize the Equality Check

If you are passing complex or deeply nested props, you can pass a custom comparison function as the second argument to `React.memo`:

```tsx
function arePropsEqual(prevProps, nextProps) {
  // Return TRUE if passing nextProps to render would yield the same result
  // Return FALSE if props changed and component SHOULD re-render
  return prevProps.item.id === nextProps.item.id;
}

const MemoizedItem = React.memo(MyItemComponent, arePropsEqual);

```

---

### Summary Checklist: Will My Component Re-render?

| Trigger                                                               | Does `React.memo` Stop the Re-render? |
| --------------------------------------------------------------------- | ------------------------------------- |
| **Parent re-renders, props UNCHANGED (primitives/stable references)** | ✅ **YES** (Re-render skipped)         |
| **Parent re-renders, props CHANGED (new object/function reference)**  | ❌ **NO** (Re-renders)                 |
| **Internal component state changes (`useState`)**                     | ❌ **NO** (Re-renders)                 |
| **Subscribed React Context value changes (`useContext`)**             | ❌ **NO** (Re-renders)                 |

By default, `React.memo` uses **shallow comparison** (specifically using JavaScript's **`Object.is`** algorithm) to compare the component's previous props with its new props.

---

## 1. How Shallow Comparison Works in `React.memo`

During a re-render pass, React iterates over the keys of the `prevProps` and `nextProps` objects and compares each prop value:

```typescript
// Conceptual implementation of React's shallow comparison
function shallowEqual(prevProps, nextProps) {
  const keys1 = Object.keys(prevProps);
  const keys2 = Object.keys(nextProps);

  if (keys1.length !== keys2.length) return false;

  for (let key of keys1) {
    // Uses Object.is for comparison
    if (!Object.is(prevProps[key], nextProps[key])) {
      return false; // Props are different -> Re-render!
    }
  }

  return true; // Props are identical -> Skip re-render!
}

```

Because it uses `Object.is`:

* **Primitive values** (`number`, `string`, `boolean`, `null`, `undefined`, `symbol`) are compared by their actual **value**.
* **Reference values** (`objects`, `arrays`, `functions`) are compared by their **memory address/reference**, not their deep content.

---

## 2. Practical Examples of Comparison Behavior

### Primitive Props (Works as expected)

```tsx
// Re-render skipped if name and age values haven't changed
<MemoizedUser name="Alex" age={25} />

```

* `"Alex" === "Alex"` ➔ `true`
* `25 === 25` ➔ `true`
* **Result:** **No re-render** ✅

---

### Object/Array/Function Props (The Shallow Trap)

```tsx
function Parent() {
  const [count, setCount] = useState(0);

  // New object reference created on every Parent render!
  const user = { name: 'Alex' }; 

  // New function reference created on every Parent render!
  const handleClick = () => console.log('hi'); 

  return <MemoizedUser user={user} onClick={handleClick} />;
}

```

* `{ name: 'Alex' } === { name: 'Alex' }` ➔ `false` (Different object references in memory)
* `handleClick === handleClick` ➔ `false` (Different function instances)
* **Result:** **Triggers re-render anyway** ❌ *(Unless you stabilize references using `useMemo` and `useCallback` in the parent component).*

---

## 3. Custom Comparison Function

If you want to override the default shallow comparison (for example, to do a deep check on specific object properties), pass a custom comparison function as the **second argument** to `React.memo`.

> ⚠️ **Important:** Unlike `Array.prototype.sort` or `shouldComponentUpdate`, the return boolean for `React.memo` is **inverted**:
>
> * Return **`true`** if props are equal ➔ **Skip re-render**
> * Return **`false`** if props are different ➔ **Trigger re-render**
>
>

```tsx
interface Props {
  user: { id: string; name: string; age: number };
}

function UserComponent({ user }: Props) {
  return <div>{user.name}</div>;
}

// Custom comparison function
function arePropsEqual(prevProps: Props, nextProps: Props) {
  // Only re-render if the user ID or name changes (ignores age or object reference)
  return (
    prevProps.user.id === nextProps.user.id &&
    prevProps.user.name === nextProps.user.name
  );
}

export const MemoizedUser = React.memo(UserComponent, arePropsEqual);

```

You should avoid wrapping components in `React.memo` when the cost of running the comparison outweighs the savings of skipping a re-render.

Adding `React.memo` is not a free performance upgrade—it adds extra memory allocation and CPU overhead to every render cycle.

---

### 1. The Component Re-renders Frequently with Changing Props

If a component's props change almost every time its parent renders (e.g., passing dynamic mouse coordinates, scroll positions, or rapid timer ticks), `React.memo` will fail its shallow check every time.

* **What happens:** React runs the `Object.is` prop check, finds differences, and re-renders anyway.
* **The penalty:** You waste CPU cycles doing a prop check that consistently returns `false`.

---

### 2. Cheap, Lightweight UI Components

For simple UI elements like plain buttons, basic icons, typography elements, or short text containers, React’s Virtual DOM diffing is virtually instantaneous.

```tsx
// ❌ OVERKILL: Checking props takes more work than rendering a simple button!
const Button = React.memo(({ label, onClick }) => {
  return <button onClick={onClick}>{label}</button>;
});

```

* **Why avoid it:** The overhead of storing prop states in memory and performing JavaScript shallow comparisons is often **slower** than letting React re-render a small, fast DOM element.

---

### 3. Un-memoized Objects, Arrays, or Functions Are Passed as Props

If parent components pass inline functions, object literals, or array literals directly into a child, `React.memo` will fail to stop re-renders because `Object.is` evaluates new references as `false`.

```tsx
// ❌ USELESS: Inline function and object force MemoizedChild to re-render anyway!
function Parent() {
  return (
    <MemoizedChild 
      onClick={() => console.log('click')} // New function reference every render
      options={{ color: 'blue' }}          // New object reference every render
    />
  );
}

```

* **Why avoid it:** `React.memo` provides zero optimization unless you also wrap all non-primitive props in `useCallback` and `useMemo` in the parent component. Adding three hooks to make one `React.memo` work adds unnecessary complexity.

---

### 4. Components Using `children` as Props

If a component accepts `children` as a prop and wraps JSX (e.g., `<Card><p>Hello</p></Card>`), the `children` prop receives a **new React element object reference** on every parent render pass.

```tsx
// ❌ FAILS: JSX children create a new object reference every render pass
const Card = React.memo(({ children }) => {
  return <div className="card">{children}</div>;
});

function App() {
  return (
    <Card>
      <p>This text creates a new JSX element object reference on every render!</p>
    </Card>
  );
}

```

* **Why avoid it:** Unless the JSX passed into `children` is also wrapped in `useMemo`, `React.memo` will evaluate `prevProps.children === nextProps.children` as `false` and re-render.

---

### 5. Components That Consume Context

If a component calls `useContext`, it will **always re-render when the context value changes**, bypassing `React.memo` entirely.

```tsx
const UserProfile = React.memo(() => {
  const user = useContext(UserContext); // 👈 Bypasses React.memo on context update
  return <div>{user.name}</div>;
});

```

---

### Summary Checklist: Should You Use `React.memo`?

```
Is the component rendering slow/expensive (complex charts, virtual lists, heavy DOM)?
                               │
            ┌──────────────────┴──────────────────┐
            │                                     │
         NO (Cheap)                            YES (Expensive)
            │                                     │
     Do NOT use memo                 Do props change on almost every render?
                                                  │
                               ┌──────────────────┴──────────────────┐
                               │                                     │
                            YES (Frequent)                        NO (Infrequent)
                               │                                     │
                        Do NOT use memo                      Use `React.memo` 
                                                             (Ensure props are stable!)

```

**No, `useMemo` does NOT always improve performance.** In fact, using `useMemo` indiscriminately can make your application **slower, more memory-intensive, and harder to maintain**.

Every hook call in React comes with a cost. Understanding when `useMemo` hurts rather than helps is crucial for writing efficient React applications.

---

### 1. The Hidden Costs of `useMemo`

When you wrap a calculation in `useMemo`, React has to execute several extra operations during every render pass:

1. **Memory Allocation:** React allocates memory in heap storage to save the calculated return value **and** the dependency array elements.
2. **Dependency Checking:** On every single re-render pass, React iterates over every item in the dependency array and performs an equality check (`Object.is`) comparing old vs. new values.
3. **Closure Overhead:** Creating an extra callback function `() => ...` allocates a new function instance in memory during render before passing it to `useMemo`.

$$\text{Total Cost} = \text{Function Allocation} + \text{Dependency Array Check} + \text{Memory Storage}$$

If the calculation inside `useMemo` is cheaper than the cost of dependency checking and memory allocation, **`useMemo` makes your app slower than plain JavaScript.**

---

### 2. When `useMemo` Degrades Performance

#### A. Lightweight Calculations

Basic operations like filtering short lists, mapping over small arrays (< 100 items), string concatenations, or basic math are executed by JavaScript engines in **microseconds**.

```tsx
// ❌ BAD: Memory & dependency checking overhead cost MORE than array slicing!
const topThree = useMemo(() => {
  return items.slice(0, 3);
}, [items]);

// ✅ BETTER: Execute directly in render body. It's virtually instantaneous!
const topThree = items.slice(0, 3);

```

#### B. Changing Dependencies on Every Render

If one or more items in the dependency array change on almost every render pass, `useMemo` will consistently fail its cache check.

```tsx
// ❌ BAD: `searchTerm` changes on every keystroke, forcing recalculation EVERY TIME.
// You pay the memory/dependency overhead PLUS the calculation cost!
const filteredList = useMemo(() => {
  return hugeList.filter((item) => item.includes(searchTerm));
}, [hugeList, searchTerm]);

```

#### C. Primitive Values

Primitive values (`string`, `number`, `boolean`, `null`, `undefined`) are compared by value, not reference. Using `useMemo` solely to preserve a primitive value is completely redundant.

```tsx
// ❌ BAD: Numbers are already primitive values compared by value!
const totalCost = useMemo(() => price * quantity, [price, quantity]);

// ✅ BETTER:
const totalCost = price * quantity;

```

---

### 3. When `useMemo` ACTUALLY Improves Performance

There are only **two main valid reasons** to use `useMemo`:

#### 1. Truly Expensive Calculations

If an operation performs heavy CPU tasks—such as processing thousands of array items, running complex data transformations, or parsing massive JSON datasets—that visibly lag the main UI thread.

```tsx
// ✅ GOOD: Sorting 10,000 items takes noticeable CPU time
const sortedData = useMemo(() => {
  return bigDataArray.slice().sort((a, b) => b.value - a.value);
}, [bigDataArray]);

```

#### 2. Preserving Referential Equality for Child Components (`React.memo`)

In JavaScript, `{}` or `[]` creates a **new object reference** in memory on every render. If you pass an object or array literal as a prop to a child component wrapped in `React.memo`, the child will re-render anyway because its props failed reference equality.

`useMemo` preserves object reference identity across renders:

```tsx
function ParentDashboard({ userId, theme }) {
  // ✅ GOOD: Preserves object reference so <HeavyChart> doesn't re-render when `userId` changes
  const chartOptions = useMemo(() => {
    return { color: theme === 'dark' ? '#fff' : '#000', grid: true };
  }, [theme]);

  return <HeavyChart options={chartOptions} />; // HeavyChart is wrapped in React.memo
}

```

---

### Summary Checklist

```
                      Is the calculation visibly lagging or processing thousands of items?
                                                      │
                                   ┌──────────────────┴──────────────────┐
                                   │                                     │
                                YES                                      NO
                                   │                                     │
                             Use `useMemo`                 Does the result value get passed
                                                           as a prop to a `React.memo` child?
                                                                         │
                                                      ┌──────────────────┴──────────────────┐
                                                      │                                     │
                                                   YES                                      NO
                                                      │                                     │
                                                Use `useMemo`                        Do NOT use `useMemo`
                                                                                     (Calculate directly)

```

While both **`useMemo`** and **`React.memo`** are performance optimization tools in React used to skip unnecessary work, they operate at different levels of your application architecture: **one caches values inside a component, while the other caches entire component renders.**

---

### Core Difference at a Glance

| Feature                 | `useMemo`                                                        | `React.memo`                                      |
| ----------------------- | ---------------------------------------------------------------- | ------------------------------------------------- |
| **What is it?**         | A **React Hook**                                                 | A **Higher-Order Component (HOC)**                |
| **What does it cache?** | The **result of a calculation** or an **object/array reference** | The **rendered UI output** of an entire component |
| **Where is it placed?** | **Inside** a component function body                             | **Wrapping** a component export/definition        |
| **Primary Trigger**     | Dependency array values change (`[a, b]`)                        | Component props change (`oldProps === newProps`)  |

---

### 1. `useMemo`: Caching Values Inside a Component

Use **`useMemo`** inside a component when you want to avoid re-running an expensive calculation on every render pass, or when you need to keep an object/array reference stable across renders.

#### Primary Use Cases

1. **Expensive Data Processing:** Filtering, sorting, or mapping over large arrays (1,000+ items).
2. **Preserving Reference Identity:** Keeping an object or array reference stable so it doesn't trigger re-renders when passed down to a `React.memo` child component or passed into a `useEffect` dependency array.

```tsx
import { useState, useMemo } from 'react';

function ProductCatalog({ products, category }) {
  const [search, setSearch] = useState('');

  // ✅ useMemo caches the filtered array result.
  // It ONLY re-runs when `products` or `category` changes, ignoring `search` updates!
  const filteredProducts = useMemo(() => {
    return products.filter((p) => p.category === category);
  }, [products, category]);

  return (
    <div>
      <input value={search} onChange={(e) => setSearch(e.target.value)} />
      <ProductList items={filteredProducts} />
    </div>
  );
}

```

---

### 2. `React.memo`: Caching Entire Component Renders

Use **`React.memo`** to wrap a component when you want React to skip re-rendering that child component if its parent re-renders, provided the child's props haven't changed.

#### Primary Use Cases

1. **Expensive Child Components:** Complex UI subtrees, heavy charts, or virtual lists that take noticeable CPU time to render.
2. **Pure Presentational Components:** Components that render often with identical props because a parent higher up the tree re-renders frequently.

```tsx
import React from 'react';

// ✅ React.memo wraps the component.
// If the Parent re-renders, HeavyChart skips re-rendering UNLESS `data` or `title` changes!
export const HeavyChart = React.memo(function HeavyChart({ data, title }) {
  console.log('Rendering HeavyChart...');
  return (
    <div>
      <h3>{title}</h3>
      {/* Complex Chart rendering logic */}
    </div>
  );
});

```

---

### How `useMemo` and `React.memo` Work Together

`React.memo` performs a **shallow comparison** (`Object.is`) on props. In JavaScript, inline objects and arrays create **new memory references on every render**.

If a parent component passes an un-memoized object prop into a `React.memo` child, the child will re-render anyway. You use **`useMemo` in the parent** to make **`React.memo` work in the child**:

```tsx
function ParentDashboard({ userId, theme }) {
  // 1. Parent uses useMemo to keep the object reference stable
  const chartOptions = useMemo(() => {
    return { color: theme === 'dark' ? '#fff' : '#000', grid: true };
  }, [theme]);

  // 2. Child is wrapped in React.memo
  // When `userId` updates, <HeavyChart> SKIPS re-render because `options` reference was preserved!
  return <HeavyChart options={chartOptions} />;
}

```

---

### Quick Decision Guide: When to Use What?

```
                        What are you trying to optimize?
                                       │
                      ┌────────────────┴────────────────┐
                      │                                 │
            A Calculation / Object               An Entire Component
                      │                                 │
                      ▼                                 ▼
                 `useMemo`                         `React.memo`
         (Inside component body)              (Wraps component definition)

```

* **Use `useMemo` when:**
* Filtering/sorting/computing data takes > 10ms.
* You need to pass a stable object or array into a `React.memo` child or a `useEffect` dependency array.

* **Use `React.memo` when:**
* A component renders often with the exact same props.
* The component is computationally heavy or renders a complex DOM structure.

* **Avoid both when:**
* Operations are fast and simple (e.g., small arrays under 100 items).
* Props or dependencies change on almost every render pass anyway.
