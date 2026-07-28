Here is a complete, structured overview of the JavaScript `Array` global object.

---

## Description

In JavaScript, an **`Array`** is a high-level, list-like global object used to store ordered collections of values.

### Key Characteristics:

- **Zero-indexed:** The first element is at index `0`, the second at `1`, and so on.
- **Dynamic & Resizable:** Arrays automatically grow or shrink as you add or remove elements.
- **Heterogeneous:** Elements do not need to be of the same type; an array can hold numbers, strings, objects, or other arrays.
- **Not Dense by Guarantee (Sparse Arrays):** Array indices are technically object property keys. If an index is skipped (e.g., `arr[10] = 'x'` on an empty array), holes (`empty`) are created rather than filled values.

---

## Constructor

The `Array()` constructor is used to create new `Array` instances.

```javascript
// 1. Array Literal syntax (Preferred)
const fruits = ["Apple", "Banana"];

// 2. Single Number argument: creates an empty array with length N
const emptyArr = new Array(5); // [empty × 5]

// 3. Multiple arguments: creates an array containing those items
const numbers = new Array(10, 20, 30); // [10, 20, 30]
```

---

## Static Properties

Static properties belong to the global `Array` constructor itself, not to individual array instances.

- **`Array.prototype`**: Allows the addition of custom properties and methods to all array instances.
- **`Array[Symbol.species]`**: Returns the constructor function used to create derived objects.

---

## Static Methods

Static methods are called directly on `Array` (e.g., `Array.from()`) rather than on an array variable.

| Method                               | Description                                                                                                               |
| ------------------------------------ | ------------------------------------------------------------------------------------------------------------------------- |
| **`Array.isArray(value)`**           | Returns `true` if `value` is an array; otherwise `false`.                                                                 |
| **`Array.from(arrayLike, mapFn?)`**  | Creates a new array instance from an array-like object (e.g., `NodeList`, `Arguments`) or iterable (`Set`, `Map`).        |
| **`Array.fromAsync(asyncIterable)`** | _(Modern)_ Creates a new array instance from an async iterable or Promise-returning iterable.                             |
| **`Array.of(...elementN)`**          | Creates a new array instance with a variable number of arguments, regardless of quantity or type (unlike `new Array(5)`). |

---

## Instance Properties

Instance properties are available on every specific array instance created.

- **`arr.length`**: Reflects the number of elements in the array. Modifying `length` can truncate or extend the array.
- **`arr[Symbol.iterator]`**: The default iterator function (allows arrays to be used in `for...of` loops).

---

## Instance Methods

Instance methods are called directly on array variables (e.g., `myArray.push(5)`). They are categorized by how they handle the original array:

### 1. Mutating Methods (Modify the original array in place)

- **`push(...items)`**: Adds elements to the end; returns new `length`.
- **`pop()`**: Removes and returns the last element.
- **`unshift(...items)`**: Adds elements to the beginning; returns new `length`.
- **`shift()`**: Removes and returns the first element.
- **`splice(start, deleteCount, ...items)`**: Removes, replaces, or adds elements at any index.
- **`sort(compareFn?)`**: Sorts elements in place.
- **`reverse()`**: Reverses elements in place.
- **`fill(value, start?, end?)`**: Fills elements with a static value.
- **`copyWithin(target, start?, end?)`**: Copies array elements within the array.

### 2. Non-Mutating / Copying Methods (Return a new array or value)

- **`concat(...arrays)`**: Merges arrays into a new array.
- **`slice(start?, end?)`**: Extracts a section into a new array.
- **`toSorted(compareFn?)`**: Returns a new sorted copy of the array (does not mutate).
- **`toReversed()`**: Returns a new reversed copy of the array (does not mutate).
- **`toSpliced(start, deleteCount, ...items)`**: Returns a new array with elements removed/replaced (does not mutate).
- **`with(index, value)`**: Returns a new array with the element at `index` replaced by `value`.
- **`flat(depth?)`**: Flattens nested arrays into a single new array.
- **`flatMap(callback)`**: Maps each element, then flattens the result by 1 level.
- **`join(separator?)`**: Joins all elements into a single string.

### 3. Searching & Indexing

- **`indexOf(element)`**: Returns the first index of `element`, or `-1` if absent.
- **`lastIndexOf(element)`**: Returns the last index of `element`, or `-1`.
- **`includes(element)`**: Returns `true` if the array contains `element`.
- **`find(callback)`**: Returns the **first element** that satisfies the test function.
- **`findIndex(callback)`**: Returns the **index** of the first element that satisfies the test.
- **`findLast(callback)`**: Returns the **last element** satisfying the test function.
- **`findLastIndex(callback)`**: Returns the **index of the last element** satisfying the test.
- **`at(index)`**: Accesses elements using positive or negative integers (e.g., `arr.at(-1)` for last item).

### 4. Iteration Methods

- **`forEach(callback)`**: Executes a provided function once for each array element.
- **`map(callback)`**: Creates a **new array** populated with the results of calling a function on every element.
- **`filter(callback)`**: Creates a **new array** with all elements that pass the test function.
- **`reduce(callback, initialValue?)`**: Reduces the array to a single value (accumulating from left to right).
- **`reduceRight(callback, initialValue?)`**: Reduces the array from right to left.
- **`some(callback)`**: Returns `true` if **at least one** element passes the test function.
- **`every(callback)`**: Returns `true` if **all** elements pass the test function.
- **`keys()`**: Returns an Array Iterator containing keys (indices).
- **`values()`**: Returns an Array Iterator containing values.
- **`entries()`**: Returns an Array Iterator containing `[index, value]` pairs.

In React, **Arrays** power almost every dynamic UI feature—from tables and product feeds to state updates and batch actions.

The single golden rule when working with arrays in React state is **Immutability**. You must never mutate an array directly (e.g., using `push()`, `splice()`, or `sort()`). Instead, always use non-mutating methods like `.map()`, `.filter()`, or spread syntax (`[...]`) to create a new array reference.

---

## 1. Rendering Dynamic Lists (`.map`)

**Scenario:** Displaying dynamic UI elements like product cards, table rows, or user comments.

```tsx
interface Product {
  id: string;
  name: string;
  price: number;
}

export function ProductList({ products }: { products: Product[] }) {
  return (
    <ul>
      {products.map((product) => (
        // Always provide a unique 'key' prop for React reconciler
        <li key={product.id}>
          {product.name} - ${product.price}
        </li>
      ))}
    </ul>
  );
}
```

---

## 2. Adding Items to State (Spread Operator `[...]`)

**Scenario:** Adding a new task to a To-Do list or adding an item to a shopping cart.

```tsx
import { useState } from "react";

export function TodoApp() {
  const [todos, setTodos] = useState<string[]>(["Buy groceries", "Walk dog"]);
  const [input, setInput] = useState("");

  const handleAdd = () => {
    if (!input.trim()) return;
    // ✅ Create new array with spread syntax
    setTodos((prevTodos) => [...prevTodos, input]);
    setInput("");
  };

  return (
    <div>
      <input value={input} onChange={(e) => setInput(e.target.value)} />
      <button onClick={handleAdd}>Add Todo</button>
    </div>
  );
}
```

---

## 3. Removing Items from State (`.filter`)

**Scenario:** Deleting an item, clearing a notification, or removing a cart product.

```tsx
interface Item {
  id: number;
  label: string;
}

export function ItemList() {
  const [items, setItems] = useState<Item[]>([
    { id: 1, label: "Item A" },
    { id: 2, label: "Item B" },
  ]);

  const handleDelete = (idToDelete: number) => {
    // ✅ Returns a new array excluding the specified item
    setItems((prevItems) => prevItems.filter((item) => item.id !== idToDelete));
  };

  return (
    <div>
      {items.map((item) => (
        <div key={item.id}>
          {item.label}
          <button onClick={() => handleDelete(item.id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}
```

---

## 4. Updating Specific Items inside Array State (`.map`)

**Scenario:** Toggling a checkbox status, editing an inline field, or incrementing product quantities.

```tsx
interface Task {
  id: number;
  text: string;
  completed: boolean;
}

export function TaskTracker() {
  const [tasks, setTasks] = useState<Task[]>([
    { id: 101, text: "Write code", completed: false },
    { id: 102, text: "Review PRs", completed: false },
  ]);

  const toggleTask = (id: number) => {
    // ✅ Return updated copy for matching item, keep original for others
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task,
      ),
    );
  };

  return (
    <ul>
      {tasks.map((task) => (
        <li
          key={task.id}
          onClick={() => toggleTask(task.id)}
          style={{ textDecoration: task.completed ? "line-through" : "none" }}
        >
          {task.text}
        </li>
      ))}
    </ul>
  );
}
```

---

## 5. Sorting & Reordering Arrays (`.toSorted` or `[...arr].sort`)

**Scenario:** Sorting products by price, date, or name without mutating the original state.

```tsx
export function PriceSorter() {
  const [prices, setPrices] = useState([40, 10, 100, 25]);

  const sortByAscending = () => {
    // ✅ Option A: ES2023 non-mutating toSorted()
    setPrices((prev) => prev.toSorted((a, b) => a - b));

    // ✅ Option B: Clone first, then sort
    // setPrices((prev) => [...prev].sort((a, b) => a - b));
  };

  return (
    <div>
      <button onClick={sortByAscending}>Sort Cheapest First</button>
      <p>{prices.join(", ")}</p>
    </div>
  );
}
```

---

## 6. Deriving Summary Values from Arrays (`.reduce`)

**Scenario:** Calculating shopping cart totals, average ratings, or badge count badges.

```tsx
interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

export function CartSummary({ cart }: { cart: CartItem[] }) {
  // Derive calculation directly during render (no need for useEffect/useState)
  const totalPrice = cart.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  );

  return (
    <div>
      <h3>Total Cart Price: ${totalPrice.toFixed(2)}</h3>
    </div>
  );
}
```

---

## 7. Conditional / Filtered Views (`.filter` + `.map`)

**Scenario:** Real-time search filters or tab-based category filters.

```tsx
export function FilterableList({ users }: { users: string[] }) {
  const [searchTerm, setSearchTerm] = useState("");

  // Derived state: Filters list dynamically on every render
  const filteredUsers = users.filter((user) =>
    user.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div>
      <input
        type="text"
        placeholder="Search users..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <ul>
        {filteredUsers.map((user, index) => (
          <li key={index}>{user}</li>
        ))}
      </ul>
    </div>
  );
}
```

---

## Summary Matrix: Which Array Method to Use in React?

| Goal                      | Best Method                     | Mutates Original? | Safe for State?           |
| ------------------------- | ------------------------------- | ----------------- | ------------------------- |
| **Render JSX elements**   | `.map()`                        | ❌ No             | ✅ Yes                    |
| **Delete / Filter items** | `.filter()`                     | ❌ No             | ✅ Yes                    |
| **Update specific item**  | `.map()`                        | ❌ No             | ✅ Yes                    |
| **Add item to start/end** | Spread `[...]`                  | ❌ No             | ✅ Yes                    |
| **Calculate sum / total** | `.reduce()`                     | ❌ No             | ✅ Yes                    |
| **Sort / Reorder items**  | `.toSorted()`                   | ❌ No             | ✅ Yes                    |
| **Replace item at index** | `.with(index, value)`           | ❌ No             | ✅ Yes                    |
| **Raw Mutating Methods**  | `push`, `pop`, `splice`, `sort` | ⚠️ **YES**        | ❌ **FORBIDDEN IN STATE** |
