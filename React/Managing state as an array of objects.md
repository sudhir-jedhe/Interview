Managing state as an **array of objects** is one of the most common patterns in React (for lists, todo items, shopping carts, table data, etc.).

Because React requires **immutable state updates** to detect changes and trigger re-renders, you must **never mutate array or object state directly** (e.g., using `push()`, `splice()`, or direct property assignment like `items[0].title = 'New'`).

Instead, always create a **new array instance** containing updated copies of the objects.

---

## Cheat Sheet: Array of Objects Immutable Operations

| Operation          | Standard JS Method            | React Safe Pattern                                                                    |
| ------------------ | ----------------------------- | ------------------------------------------------------------------------------------- |
| **Add**            | `push()` ❌                    | Spread operator `[...prev, newItem]`                                                  |
| **Remove**         | `splice()` ❌                  | `.filter(item => item.id !== targetId)`                                               |
| **Update Item**    | `items[0].value = x` ❌        | `.map(item => item.id === targetId ? { ...item, field: newValue } : item)`            |
| **Toggle Prop**    | `items[0].completed = true` ❌ | `.map(item => item.id === targetId ? { ...item, completed: !item.completed } : item)` |
| **Sort / Reorder** | `.sort()` ❌                   | `[...prev].sort()`                                                                    |

---

## Complete Practical Example: Todo / Task Manager

Here is a full component demonstrating **Adding**, **Toggling**, **Updating**, and **Deleting** items in an array-of-objects state.

```tsx
import React, { useState } from 'react';

// 1. Define the Object Structure
interface Task {
  id: number;
  title: string;
  completed: boolean;
}

export function TaskApp() {
  // 2. Initialize State as an Array of Objects
  const [tasks, setTasks] = useState<Task[]>([
    { id: 1, title: 'Learn React Hooks', completed: true },
    { id: 2, title: 'Master State Management', completed: false },
  ]);

  const [inputTitle, setInputTitle] = useState('');

  // -------------------------------------------------------------
  // A. ADD ITEM: Spread existing array and append new object
  // -------------------------------------------------------------
  const addTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputTitle.trim()) return;

    const newTask: Task = {
      id: Date.now(), // Unique ID
      title: inputTitle,
      completed: false,
    };

    setTasks((prevTasks) => [...prevTasks, newTask]);
    setInputTitle('');
  };

  // -------------------------------------------------------------
  // B. TOGGLE BOOLEAN PROPERTY inside an object
  // -------------------------------------------------------------
  const toggleTask = (id: number) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id
          ? { ...task, completed: !task.completed } // Spread object & override prop
          : task // Return untouched object reference
      )
    );
  };

  // -------------------------------------------------------------
  // C. UPDATE TEXT PROPERTY inside an object
  // -------------------------------------------------------------
  const updateTaskTitle = (id: number, newTitle: string) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id ? { ...task, title: newTitle } : task
      )
    );
  };

  // -------------------------------------------------------------
  // D. REMOVE ITEM: Filter out item by ID
  // -------------------------------------------------------------
  const deleteTask = (id: number) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
  };

  return (
    <div style={{ maxWidth: '450px', padding: '20px', fontFamily: 'sans-serif' }}>
      <h2>Tasks ({tasks.filter((t) => t.completed).length}/{tasks.length} Completed)</h2>

      {/* Add Item Form */}
      <form onSubmit={addTask} style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
        <input
          type="text"
          value={inputTitle}
          onChange={(e) => setInputTitle(e.target.value)}
          placeholder="Enter task title..."
          style={{ flex: 1, padding: '8px' }}
        />
        <button type="submit">Add Task</button>
      </form>

      {/* Render List of Objects */}
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {tasks.map((task) => (
          <li
            key={task.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '8px',
              borderBottom: '1px solid #ddd',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => toggleTask(task.id)}
              />
              <span style={{ textDecoration: task.completed ? 'line-through' : 'none' }}>
                {task.title}
              </span>
            </div>

            <button
              onClick={() => deleteTask(task.id)}
              style={{ backgroundColor: '#ff4d4d', color: '#fff', border: 'none', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer' }}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

```

---

## Advanced: Updating Nested Objects Inside an Array

If your object contains **nested objects or arrays** (e.g., `user.address.city`), spreading only the top-level object is not enough because the inner object reference remains mutated.

### ❌ Shallow Spread Mutation (Buggy)

```tsx
// BUG: Modifies city in place without creating a new address object reference
setUsers(prev => prev.map(u => u.id === targetId ? { ...u, address: { city: 'Pune' } } : u));

```

### ✅ Deep Immutable Spread

```tsx
interface User {
  id: number;
  name: string;
  address: {
    city: string;
    zip: string;
  };
}

const updateUserCity = (userId: number, newCity: string) => {
  setUsers((prevUsers) =>
    prevUsers.map((user) =>
      user.id === userId
        ? {
            ...user,
            address: {
              ...user.address, // Spread inner nested object
              city: newCity,   // Override city
            },
          }
        : user
    )
  );
};

```

---

## Simplification Tip: Using `useImmer` for Complex Nested Arrays

If spreading deeply nested objects becomes too verbose, install **`use-immer`** to write mutating-style code safely:

```bash
npm install use-immer

```

```tsx
import { useImmer } from 'use-immer';

export function ImmerTaskList() {
  const [tasks, updateTasks] = useImmer([
    { id: 1, title: 'Learn Immer', completed: false },
  ]);

  const toggleTask = (id: number) => {
    // Write imperative code — Immer handles immutability under the hood!
    updateTasks((draft) => {
      const task = draft.find((t) => t.id === id);
      if (task) {
        task.completed = !task.completed;
      }
    });
  };

  // ...
}

```

Show me how to manage an array of objects state using useReducer in React with TypeScript.

When managing state as an **array of objects** in React, the golden rule is **immutability**. React tracks state changes by checking object references (`Object.is`). If you modify an object or array directly (e.g., using `push()`, `splice()`, or `item.name = 'New'`), React won't detect the change, and your UI won't re-render.

Here are the 4 core patterns to perform every CRUD operation immutably.

---

## Operations Cheat Sheet

| Action             | ❌ Mutating (Avoid)       | ✅ Immutable (Use in React)                                          |
| ------------------ | ------------------------ | ------------------------------------------------------------------- |
| **Add**            | `items.push(newItem)`    | `[...items, newItem]`                                               |
| **Delete**         | `items.splice(index, 1)` | `items.filter(item => item.id !== id)`                              |
| **Update**         | `items[0].name = 'X'`    | `items.map(item => item.id === id ? { ...item, name: 'X' } : item)` |
| **Sort / Reorder** | `items.sort()`           | `[...items].sort()`                                                 |

---

## 1. Adding an Object to an Array

To add a new object, use the spread operator (`...`) to copy the existing array and append or prepend the new object.

```tsx
const [users, setUsers] = useState([
  { id: 1, name: 'Sudhir', role: 'Developer' }
]);

const addUser = (name: string, role: string) => {
  const newUser = { id: Date.now(), name, role };

  // Append to the end
  setUsers(prevUsers => [...prevUsers, newUser]);

  // Or prepend to the top
  // setUsers(prevUsers => [newUser, ...prevUsers]);
};

```

---

## 2. Updating an Object Inside an Array

Use `.map()` to iterate through the array. When you match the target ID, return a **new object** with the spread operator overriding the specific fields. Return all other items untouched.

```tsx
const updateUserRole = (userId: number, newRole: string) => {
  setUsers(prevUsers =>
    prevUsers.map(user =>
      user.id === userId
        ? { ...user, role: newRole } // Spreads existing fields, overrides 'role'
        : user                      // Keeps original reference for unchanged items
    )
  );
};

```

### Updating Nested Objects Inside an Array

If objects inside the array have nested structures, spread the inner object too:

```tsx
// Example item: { id: 1, name: 'Sudhir', address: { city: 'Pune' } }
const updateCity = (userId: number, newCity: string) => {
  setUsers(prevUsers =>
    prevUsers.map(user =>
      user.id === userId
        ? {
            ...user,
            address: { ...user.address, city: newCity } // Deep spread
          }
        : user
    )
  );
};

```

---

## 3. Removing an Object from an Array

Use `.filter()` to return a new array containing only the items that do not match the target ID.

```tsx
const deleteUser = (userId: number) => {
  setUsers(prevUsers => prevUsers.filter(user => user.id !== userId));
};

```

---

## 4. Sorting or Reordering an Array

Methods like `.sort()` or `.reverse()` mutate the array in place. Always create a copy with `[...]` first:

```tsx
const sortByName = () => {
  setUsers(prevUsers =>
    [...prevUsers].sort((a, b) => a.name.localeCompare(b.name))
  );
};

```

---

## Complete Working Example (Shopping Cart)

```tsx
import React, { useState } from 'react';

interface CartItem {
  id: number;
  name: string;
  quantity: number;
  price: number;
}

export function ShoppingCart() {
  const [items, setItems] = useState<CartItem[]>([
    { id: 1, name: 'Mechanical Keyboard', quantity: 1, price: 100 },
    { id: 2, name: 'Wireless Mouse', quantity: 2, price: 50 },
  ]);

  // 1. ADD
  const addItem = () => {
    const newItem: CartItem = {
      id: Date.now(),
      name: 'Monitor Stand',
      quantity: 1,
      price: 30,
    };
    setItems(prev => [...prev, newItem]);
  };

  // 2. UPDATE QUANTITY
  const updateQuantity = (id: number, delta: number) => {
    setItems(prev =>
      prev.map(item => {
        if (item.id === id) {
          const newQty = item.quantity + delta;
          return newQty > 0 ? { ...item, quantity: newQty } : item;
        }
        return item;
      })
    );
  };

  // 3. DELETE
  const removeItem = (id: number) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div style={{ maxWidth: '400px', padding: '20px', fontFamily: 'sans-serif' }}>
      <h2>Shopping Cart</h2>
      <button onClick={addItem}>Add Monitor Stand</button>

      <ul style={{ listStyle: 'none', padding: 0 }}>
        {items.map(item => (
          <li
            key={item.id}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '8px 0',
              borderBottom: '1px solid #ccc',
            }}
          >
            <div>
              <strong>{item.name}</strong> (${item.price})
            </div>
            <div>
              <button onClick={() => updateQuantity(item.id, -1)}>-</button>
              <span style={{ margin: '0 8px' }}>{item.quantity}</span>
              <button onClick={() => updateQuantity(item.id, 1)}>+</button>
              <button
                onClick={() => removeItem(item.id)}
                style={{ marginLeft: '12px', color: 'red' }}
              >
                Remove
              </button>
            </div>
          </li>
        ))}
      </ul>

      <h3>Total: ${totalPrice}</h3>
    </div>
  );
}

```
