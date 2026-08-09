useCallback for Optimising Callback Props in React

One of the common causes of unnecessary re-renders in React is passing a new function reference to child components on every parent render.

Internal React interview discussions specifically mention using useCallback, useMemo, and React.memo for performance optimisation.

Problem Without useCallback
Parent
import { useState } from "react";
import Child from "./Child";

function Parent() {
const [count, setCount] = useState(0);

const handleClick = () => {
console.log("Button clicked");
};

return (
<>
<button
onClick={() =>
setCount(count + 1)
} >
Count: {count}
</button>

      <Child onClick={handleClick} />
    </>

);
}

Child
import React from "react";

const Child = React.memo(
({ onClick }) => {

    console.log(
      "Child Re-rendered"
    );

    return (
      <button onClick={onClick}>
        Child Button
      </button>
    );

}
);

export default Child;

What Happens?

When:

Count changes

Parent re-renders.

Parent Render
↓
new handleClick created
↓
Child receives NEW function reference
↓
Child re-renders

Even though:

Child UI unchanged

Solution Using useCallback
Parent
import {
useState,
useCallback
} from "react";

function Parent() {

const [count, setCount] =
useState(0);

const handleClick =
useCallback(() => {

      console.log(
        "Button clicked"
      );

    }, []);

return (
<>
<button
onClick={() =>
setCount(
count + 1
)
} >
Count: {count}
</button>

      <Child
        onClick={
          handleClick
        }
      />
    </>

);
}

Now What Happens?
Count changes
↓
Parent re-renders
↓
handleClick reference remains same
↓
React.memo detects same prop
↓
Child DOES NOT re-render

✅ Better performance

✅ Less rendering

✅ Faster UI

Real Interview Example
User Table

Imagine a page with:

UserTable
├── 1000 rows
└── Edit Button

Without useCallback
<UserRow
onEdit={() =>
editUser(id)
}
/>

Every render:

1000 new functions created
1000 rows re-rendered

With useCallback
const handleEdit =
useCallback(
(id) => {

      editUser(id);

    },
    []

);

<UserRow
onEdit={
handleEdit
}
/>

Much more efficient.

Example with Dependency Array
const saveUser =
useCallback(() => {

    api.save(user);

}, [user]);

Function recreated only when:

user changes

When Should You Use useCallback?

✅ Passing callbacks to memoised child components

React.memo()

✅ Large tables

✅ Complex forms

✅ Virtualized lists

✅ Performance-critical UI

✅ Props passed deep into component trees

When NOT to Use It?

❌ Every function in every component

const add =
useCallback(() => {}, []);

This may add unnecessary complexity.

Use it only when:

Function reference stability matters

useCallback vs useMemo
useCallback

Memoises a function.

const fn =
useCallback(
() => {},
[]
);

useMemo

Memoises a value.

const total =
useMemo(
() =>
calculateTotal(items),
[items]
);

Internal React discussions specifically reference using useMemo, useCallback, and React.memo together for performance optimisation.

Senior React Interview Answer

useCallback memoises a function and prevents a new function reference from being created on every render. It is most useful when callback props are passed to components wrapped with React.memo, because it helps avoid unnecessary child re-renders. I typically use useCallback in large tables, forms, dashboards, and performance-sensitive components, but I avoid using it everywhere because it also has a maintenance cost.

Using useMemo Together with useCallback

A common React performance pattern is:

useCallback → memoise functions
useMemo → memoise computed values
React.memo → prevent unnecessary child re-renders

Internal React interview discussions specifically mention using React.memo, useMemo, and useCallback for performance optimisation.

Example: Product List
Child Component
import React from "react";

const ProductList = React.memo(
({ products, onSelect }) => {
console.log("ProductList Render");

    return (
      <ul>
        {products.map((product) => (
          <li key={product.id}>
            <button
              onClick={() =>
                onSelect(product)
              }
            >
              {product.name}
            </button>
          </li>
        ))}
      </ul>
    );

}
);

export default ProductList;

Parent Component
import {
useState,
useMemo,
useCallback
} from "react";

function Dashboard() {

const [search, setSearch] =
useState("");

const [count, setCount] =
useState(0);

const products = [
{
id: 1,
name: "Laptop"
},
{
id: 2,
name: "Mouse"
}
];

// Expensive filtering
const filteredProducts =
useMemo(() => {

      console.log(
        "Filtering Products"
      );

      return products.filter(
        (p) =>
          p.name
            .toLowerCase()
            .includes(
              search.toLowerCase()
            )
      );

    }, [search]);

// Stable callback reference
const handleSelect =
useCallback((product) => {

      console.log(
        "Selected",
        product.name
      );

    }, []);

return (
<>
<input
value={search}
onChange={(e) =>
setSearch(
e.target.value
)
}
/>

      <button
        onClick={() =>
          setCount(
            count + 1
          )
        }
      >
        Counter: {count}
      </button>

      <ProductList
        products={
          filteredProducts
        }
        onSelect={
          handleSelect
        }
      />
    </>

);
}

Result

When:

Counter changes

✅ ProductList does NOT re-render

✅ Filtering does NOT execute again

✅ Callback reference remains stable

When NOT to Use useCallback

Many developers overuse it.

❌ Case 1: Function Not Passed as Prop
function Component() {

const handleClick = () => {
console.log("clicked");
};

return (
<button
      onClick={handleClick}
    >
Click
</button>
);
}

No child component depends on the function.

Do not use:

useCallback(() => {}, []);

It adds complexity without any benefit.

❌ Case 2: Component Renders Rarely
function SettingsPage() {
const save = () => {};
}

If renders are infrequent:

Settings
Profile
About Page

useCallback usually provides no measurable improvement.

❌ Case 3: Child Is Not Memoised
<Child onSave={save} />

If child is:

function Child() {}

(not wrapped in React.memo)

then:

useCallback gives little benefit

because the child re-renders anyway.

❌ Case 4: Tiny Applications

For a small app:

2-3 components
minimal state

prioritise readability over micro-optimisation.

Rule of Thumb
Use useCallback ✅
Passing callbacks to React.memo children
Large tables/grids
Virtualised lists
Complex forms
Expensive child rendering
Custom hooks that expose callback APIs
Avoid useCallback ❌
Local event handlers only
Small components
Non-memoised children
Premature optimisation
Senior React Interview Answer

useMemo and useCallback are often used together. useMemo caches expensive computed values, while useCallback caches function references. Combined with React.memo, they help prevent unnecessary calculations and child re-renders. However, I avoid using useCallback everywhere because it has its own memory and maintenance cost. I primarily use it when passing callbacks to memoised child components or in performance-critical UI areas such as tables, forms, and dashboards.

How useCallback Dependency Array Works

useCallback memoizes a function reference.

const memoizedFn = useCallback(
() => {
// function code
},
[dependencies]
);

Think of it as:

"Keep the same function instance
until one of the dependencies changes"

Syntax
const handleClick = useCallback(
() => {
console.log("clicked");
},
[]
);

Parameters
useCallback(
callbackFunction,
dependencyArray
)

Part MeaningcallbackFunction Function to memoize
dependencyArray Values that the function depends on
Case 1: Empty Dependency Array
const handleClick =
useCallback(() => {

    console.log("Clicked");

}, []);

Behaviour
Component Mount
↓
Function Created Once
↓
Never Recreated Again

The same function reference is reused for the lifetime of the component.

Example
function Parent() {

const handleSave =
useCallback(() => {

      console.log("Save");

    }, []);

return (
<Child
      onSave={handleSave}
    />
);
}

Since handleSave never changes:

Child receives same prop reference

which works well with:

React.memo()

Case 2: Dependency Changes
function UserProfile() {

const [user,
setUser
] = useState("Sudhir");

const saveUser =
useCallback(() => {

      console.log(user);

    }, [user]);

}

Render 1
user = Sudhir

Function created:

saveUser()

captures:

Sudhir

Render 2
user = John

Dependency changed:

Sudhir → John

React creates a NEW function.

Render 3
user = John

Dependency unchanged.

React reuses existing function.

Why Dependencies Matter

Functions create closures.

Example:

const saveUser =
() => {

    console.log(user);

};

The function "remembers" variables from the render where it was created.

Without dependencies:

const saveUser =
useCallback(() => {

    console.log(user);

}, []);

it will always remember the initial value.

Bug
Initial user = Sudhir

Later:

user = John

Click Save:

Sudhir

❌ stale data

Because the callback was never recreated.

Correct Usage
const saveUser =
useCallback(() => {

    console.log(user);

}, [user]);

Now:

user changes
↓
callback recreated
↓
latest user available

✅ correct

Example with Multiple Dependencies
const submitOrder =
useCallback(() => {

    api.submit({
      userId,
      cartItems
    });

}, [
userId,
cartItems
]);

Function recreated only when:

userId changes
OR
cartItems changes

Common Mistake
Missing Dependency
const save =
useCallback(() => {

    api.save(user);

}, []);

ESLint warning:

React Hook useCallback has missing dependency 'user'

Why?

Because:

user used inside callback

but not declared in dependency array.

State Update Example
Wrong
const increment =
useCallback(() => {

    setCount(count + 1);

}, []);

Problem:

count captured from first render

Better
const increment =
useCallback(() => {

    setCount(
      prev => prev + 1
    );

}, []);

Using functional updates removes the dependency.

React experts often use functional state updates to avoid unnecessary callback recreation.

Parent + Child Optimization Example
function Parent() {

const [count, setCount] =
useState(0);

const handleClick =
useCallback(() => {

      console.log("clicked");

    }, []);

return (
<>
<button
onClick={() =>
setCount(count + 1)
} >
{count}
</button>

      <Child
        onClick={handleClick}
      />
    </>

);
}

const Child =
React.memo(({ onClick }) => {

    console.log(
      "Child Render"
    );

    return (
      <button
        onClick={onClick}
      >
        Click
      </button>
    );

});

Result

When:

count changes

Parent renders.

But:

handleClick reference unchanged

Therefore:

Child does NOT re-render

✅ Performance improvement

This aligns with guidance that React.memo prevents re-renders when props remain unchanged and that memoization depends on stable references.

Dependency Array Rules
Include Everything Used Inside
const fn =
useCallback(() => {

    console.log(
      user,
      theme,
      cart
    );

}, [
user,
theme,
cart
]);

Exclude Stable Values

Usually safe to omit:

setState
dispatch

Example:

const increment =
useCallback(() => {

    setCount(
      prev => prev + 1
    );

}, []);

useMemo vs useCallback
useMemo

Memoizes a value.

const total =
useMemo(
() => calculateTotal(items),
[items]
);

useCallback

Memoizes a function.

const save =
useCallback(
() => submit(),
[]
);

Internal interview discussions describe useMemo as caching expensive calculations and avoiding recomputation when dependencies don't change.

Senior Interview Answer

The useCallback dependency array controls when React should recreate the function. React keeps the same function reference between renders until one of the dependencies changes. Every value used inside the callback should usually be included in the dependency array to avoid stale closures. I typically use useCallback when passing callbacks to React.memo components, custom hooks, large tables, forms, and other performance-sensitive UI areas.

1. useCallback with Multiple Dependencies

A callback is recreated whenever any dependency in the array changes.

function CheckoutPage() {
const [userId, setUserId] = useState(1);
const [cartItems, setCartItems] = useState([]);
const [coupon, setCoupon] = useState("");

const handleCheckout = useCallback(() => {
api.checkout({
userId,
cartItems,
coupon
});
}, [userId, cartItems, coupon]);

return (
<CheckoutButton
      onCheckout={handleCheckout}
    />
);
}

What happens?
userId changes → callback recreated
cartItems changes → callback recreated
coupon changes → callback recreated

Nothing changes → existing callback reused

The dependency array works similarly to useMemo: React reuses the cached value/function until dependencies change.

1. Understanding the Stale Closure Problem

This is one of the most common React interview questions.

Wrong Example
function Counter() {
const [count, setCount] =
useState(0);

const logCount =
useCallback(() => {
console.log(count);
}, []);

return (
<>
<button
onClick={() =>
setCount(count + 1)
} >
Increment
</button>

      <button
        onClick={logCount}
      >
        Log Count
      </button>
    </>

);
}

Initial Render
count = 0

logCount captures:

count = 0

User Clicks Increment 5 Times
count = 5

User Clicks "Log Count"

Output:

0

❌ Wrong

Why?

Because:

useCallback(() => {
console.log(count);
}, []);

was created only once and remembers the value from the first render.

This is called a stale closure.

Correct Example
const logCount =
useCallback(() => {
console.log(count);
}, [count]);

Now:

count changes
↓
callback recreated
↓
latest count available

✅ Correct output

1. Another Common Stale Closure Bug
   Wrong
   const increment =
   useCallback(() => {
   setCount(count + 1);
   }, []);

Always uses:

initial count

Better
const increment =
useCallback(() => {
setCount(prev => prev + 1);
}, []);

Using a functional update removes the dependency on count.

✅ No stale data

✅ No dependency needed

1. Tips for Managing useCallback Dependencies
   ✅ Tip 1: Include Everything Used Inside
   Bad
   const save =
   useCallback(() => {
   api.save(user);
   }, []);

Missing dependency:

user

Good
const save =
useCallback(() => {
api.save(user);
}, [user]);

✅ Tip 2: Trust ESLint

Install:

eslint-plugin-react-hooks

Example warning:

React Hook useCallback
has a missing dependency

Usually the warning is correct.

✅ Tip 3: Use Functional Updates
Instead of
const increment =
useCallback(() => {
setCount(count + 1);
}, [count]);

Prefer
const increment =
useCallback(() => {
setCount(prev => prev + 1);
}, []);

Smaller dependency array.

✅ Tip 4: Memoise Objects First
Problem
const filters = {
status: "active"
};

const loadData =
useCallback(() => {
fetch(filters);
}, [filters]);

New object every render.

Callback recreated every render.

Solution
const filters =
useMemo(
() => ({
status: "active"
}),
[]
);

const loadData =
useCallback(() => {
fetch(filters);
}, [filters]);

✅ Tip 5: Use With React.memo

Best benefit comes from:

React.memo()

- useCallback()

<Child
  onSave={handleSave}
/>

When the callback reference remains stable, memoised children avoid unnecessary re-renders. React interview discussions explicitly mention using React.memo, useMemo, and memoisation to avoid unnecessary re-rendering.

✅ Tip 6: Do Not Overuse useCallback

Avoid:

const show =
useCallback(() => {
console.log("show");
}, []);

if:

Function is local only
Not passed to children
No performance issue exists

Premature optimisation can make code harder to read.

Mental Model

Think of:

useCallback(fn, deps)

as:

"Keep this function reference
until one of the dependencies changes"

Senior React Interview Answer

useCallback caches a function reference. The dependency array determines when React should recreate that function. Every value used inside the callback should normally appear in the dependency array to avoid stale closures. A stale closure occurs when a callback captures old state or props because it wasn't recreated when those values changed. I typically use useCallback with React.memo and functional state updates to minimise dependencies and prevent unnecessary child re-renders.

`useCallback` is a React Hook that **caches (memoizes) a function definition** between re-renders.

It prevents React from recreating a new function instance in memory on every render pass unless its dependencies change.

---

## 1. Syntax

`useCallback` accepts a function and a dependency array:

```tsx
import { useCallback } from 'react';

const memoizedCallback = useCallback(() => {
  // Function logic here
  doSomething(a, b);
}, [a, b]); // Dependency array

```

- **On initial render:** React returns the function you passed in.
- **On subsequent renders:**
- If dependencies (`a` or `b`) **have not changed**, React returns the exact same function instance from memory.
- If dependencies **have changed**, React creates and returns a new function instance.

---

## 2. Why Do We Need `useCallback`?

In JavaScript, functions are objects. Every time a component re-renders, any function declared inside its body is **recreated with a new memory reference**:

```tsx
function Parent() {
  // ❌ Recreated as a NEW function instance on every Parent render!
  const handleClick = () => {
    console.log('Clicked');
  };

  return <Child onClick={handleClick} />;
}

```

Even if `Child` is wrapped in `React.memo` to skip unnecessary re-renders, it will **still re-render** because `props.onClick` receives a new function reference every time `Parent` renders.

---

## 3. Primary Use Cases

### A. Passing Callbacks to Optimized Child Components (`React.memo`)

When passing a callback to a child component that uses `React.memo`, wrap the callback in `useCallback` to maintain referential integrity.

```tsx
import React, { useState, useCallback } from 'react';

// Child component skips re-renders if props haven't changed
const ExpensiveButton = React.memo(({ onClick, label }: { onClick: () => void; label: string }) => {
  console.log(`Rendering button: ${label}`);
  return <button onClick={onClick}>{label}</button>;
});

export function ParentComponent() {
  const [count, setCount] = useState(0);
  const [text, setText] = useState('');

  // ✅ Keeps the same function reference across renders
  const handleReset = useCallback(() => {
    setCount(0);
  }, []); // Empty deps = function reference never changes

  return (
    <div>
      <input value={text} onChange={(e) => setText(e.target.value)} />
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>

      {/* Typing in <input> causes Parent to render, but ExpensiveButton WON'T re-render! */}
      <ExpensiveButton onClick={handleReset} label="Reset Count" />
    </div>
  );
}

```

---

### B. Preventing Extra Execution in Custom Hooks or `useEffect`

If a function declared in a component is called inside a `useEffect` or passed as a dependency to a custom hook, wrapping it in `useCallback` prevents the effect from firing unnecessarily.

```tsx
import { useState, useEffect, useCallback } from 'react';

function SearchResults({ query }: { query: string }) {
  const [results, setResults] = useState([]);

  // ✅ Stable reference prevents useEffect from looping continuously
  const fetchResults = useCallback(async () => {
    const res = await fetch(`/api/search?q=${query}`);
    const data = await res.json();
    setResults(data);
  }, [query]);

  useEffect(() => {
    fetchResults();
  }, [fetchResults]); // Safely included in dependencies

  return <ul>{/* Render results */}</ul>;
}

```

---

## 4. `useCallback` vs. `useMemo`

`useCallback` and `useMemo` are closely related. In fact, `useCallback(fn, deps)` is just syntax sugar for `useMemo(() => fn, deps)`.

| Hook              | What It Caches                               | Typical Use Case                                                   |
| ----------------- | -------------------------------------------- | ------------------------------------------------------------------ |
| **`useCallback`** | The **function instance itself**             | Passing functions to `React.memo` children or `useEffect` deps.    |
| **`useMemo`**     | The **result value** of executing a function | Caching heavy data processing, filtering, or complex calculations. |

---

## 5. When NOT to Use `useCallback`

Do **not** wrap every function in `useCallback` by default.

- **Creating a function in JS is fast:** Inline functions are extremely cheap to create.
- **Overhead cost:** `useCallback` adds extra memory and dependency-checking logic.
- **If the child is not memoized (`React.memo`):** Using `useCallback` on a prop passed to an unmemoized child provides **zero performance benefit**, because the child will re-render when the parent renders anyway.
