**Data encapsulation** bundles data (state) and the methods that operate on it together, restricting direct outside access to internal details. It protects internal state from unintended side effects and exposes a controlled, predictable public interface.

---

### Data Encapsulation in JavaScript

JavaScript provides three core mechanisms for encapsulation: **Closures**, **ES2022 Private Class Fields**, and **WeakMaps / Symbols**.

#### 1. Closures & Factory Functions

Variables defined inside an outer function are inaccessible from the outside; only functions returned within the closure have access.

```javascript
function createBankAccount(initialBalance) {
  let balance = initialBalance; // Private state via lexical scope

  return {
    deposit(amount) {
      if (amount <= 0) throw new Error("Amount must be positive");
      balance += amount;
      return balance;
    },
    withdraw(amount) {
      if (amount > balance) throw new Error("Insufficient funds");
      balance -= amount;
      return balance;
    },
    getBalance() {
      return balance; // Read-only access
    }
  };
}

const account = createBankAccount(100);
account.deposit(50);
console.log(account.getBalance()); // 150
console.log(account.balance); // undefined

```

#### 2. Native Private Class Fields (`#`)

Modern JavaScript (ES2022+) provides true, hard private fields and methods using the `#` prefix. These are enforced at the language syntax level and cannot be accessed from outside the class instance (even through `Object.keys()` or reflection).

```javascript
class ShoppingCart {
  #items = []; // Hard private field
  #taxRate = 0.08;

  // Hard private method
  #calculateTax(amount) {
    return amount * this.#taxRate;
  }

  addItem(item, price) {
    this.#items.push({ item, price });
  }

  getTotal() {
    const subtotal = this.#items.reduce((sum, i) => sum + i.price, 0);
    return subtotal + this.#calculateTax(subtotal);
  }
}

const cart = new ShoppingCart();
cart.addItem("Book", 25);
console.log(cart.getTotal()); // 27
// console.log(cart.#items); // SyntaxError: Private field '#items' must be declared in an enclosing class

```

#### 3. WeakMap (Pre-ES2022 Private State)

Before `#` syntax, `WeakMap` was the idiomatic standard for private properties on class instances. Keys in a `WeakMap` are weakly held, avoiding memory leaks when the instance is garbage collected.

```javascript
const privateStore = new WeakMap();

class UserSession {
  constructor(token) {
    privateStore.set(this, { token, timestamp: Date.now() });
  }

  isValid() {
    const data = privateStore.get(this);
    return Date.now() - data.timestamp < 3600000;
  }
}

```

---

### Data Encapsulation in React

In React, encapsulation shifts from **object-oriented private fields** to **component-driven state isolation**, **custom hooks**, and **compound components**.

#### 1. Custom Hooks (Logic & State Encapsulation)

Custom hooks package private internal state, lifecycle listeners, and state setters together. The consuming component receives only the derived data and actions it needs, without knowing *how* the state is managed.

```tsx
// Encapsulated Hook
import { useState, useCallback } from 'react';

export function useCounter(initialValue = 0, { min = -Infinity, max = Infinity } = {}) {
  const [count, setCount] = useState(initialValue); // Internal state

  const increment = useCallback(() => {
    setCount((prev) => Math.min(prev + 1, max));
  }, [max]);

  const decrement = useCallback(() => {
    setCount((prev) => Math.max(prev - 1, min));
  }, [min]);

  const reset = useCallback(() => {
    setCount(initialValue);
  }, [initialValue]);

  // Expose ONLY a restricted, validated interface
  return { count, increment, decrement, reset };
}

// Consumer Component
function CounterDisplay() {
  const { count, increment, decrement } = useCounter(0, { min: 0, max: 10 });

  return (
    <div>
      <span>{count}</span>
      <button onClick={increment}>+</button>
      <button onClick={decrement}>-</button>
    </div>
  );
}

```

#### 2. Component Boundaries (Unidirectional Data Flow)

Parent components cannot directly inspect or modify a child component's internal state unless the child explicitly exposes an API via props or `useImperativeHandle`.

```tsx
import React, { useState, forwardRef, useImperativeHandle } from 'react';

// Restrict exposure to parent components
export const TextInput = forwardRef((props, ref) => {
  const [text, setText] = useState('');
  const [error, setError] = useState<string | null>(null);

  // useImperativeHandle strictly encapsulates what the parent can call via ref
  useImperativeHandle(ref, () => ({
    clear() {
      setText('');
      setError(null);
    },
    validate() {
      const isValid = text.trim().length > 0;
      setError(isValid ? null : 'Field cannot be empty');
      return isValid;
    },
  }));

  return (
    <div>
      <input value={text} onChange={(e) => setText(e.target.value)} />
      {error && <p>{error}</p>}
    </div>
  );
});

```

#### 3. Context & Compound Components (Shared Localized Encapsulation)

When multiple components need to coordinate state without leaking that state to global stores or prop-drilling, the **Compound Component** pattern encapsulates state inside a Context boundary:

```tsx
import React, { createContext, useContext, useState } from 'react';

// Context is NOT exported -> State is private to this module
const AccordionContext = createContext<{
  openIndex: number | null;
  toggleIndex: (index: number) => void;
} | null>(null);

export function Accordion({ children }: { children: React.ReactNode }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleIndex = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <AccordionContext.Provider value={{ openIndex, toggleIndex }}>
      <div className="accordion-root">{children}</div>
    </AccordionContext.Provider>
  );
}

export function AccordionItem({ index, title, children }: { index: number; title: string; children: React.ReactNode }) {
  const context = useContext(AccordionContext);
  if (!context) throw new Error("AccordionItem must be used within an Accordion");

  const isOpen = context.openIndex === index;

  return (
    <div>
      <button onClick={() => context.toggleIndex(index)}>{title}</button>
      {isOpen && <div>{children}</div>}
    </div>
  );
}

```

---

### Comparison: JavaScript vs. React

| Aspect                      | JavaScript (Core / OOP)                                       | React (Component / Functional)                                            |
| --------------------------- | ------------------------------------------------------------- | ------------------------------------------------------------------------- |
| **Primary Primitive**       | Closures, `#` private fields, WeakMaps                        | `useState`, `useReducer`, Custom Hooks                                    |
| **Encapsulation Unit**      | Class instance, factory closure, module                       | Component subtree, custom hook, Context                                   |
| **Information Hiding**      | Hiding instance properties and internal algorithms            | Hiding implementation mechanics, DOM elements, and local state lifecycles |
| **Public Interface**        | Public methods, getters/setters                               | Props (inputs) and Event Handlers (outputs)                               |
| **Imperative Escape Hatch** | Object reflection (`Reflect`, `Object.getOwnPropertySymbols`) | `useImperativeHandle` with `ref`                                          |
