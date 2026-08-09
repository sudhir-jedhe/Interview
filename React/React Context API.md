The **React Context API** provides a way to pass data through the component tree without having to manually pass props down at every level (a problem known as **"prop drilling"**).

It is designed for sharing global or semi-global data across your application—such as user authentication status, global themes, language preferences, or shopping cart contents.

---

## 1. The Core Architecture

Context relies on three primary pieces:

1. **`createContext()`**: Creates the context object.
2. **`<Context.Provider>`**: Wraps components and provides the value to all nested children.
3. **`useContext()`**: A React Hook called by child components to read the context value.

```
       [ App Component ]
              │
    ┌─────────┴─────────┐
    │ <ThemeContext.Provider value="dark">
    │                   │
    │            [ Navigation ]
    │                   │
    │            [ HeaderButton ]
    │                   │
    │            useContext(ThemeContext) ──► "dark"
    └───────────────────┘

```

---

## 2. Step-by-Step Implementation

Here is a complete, production-ready example of creating a **Theme Context** (Light / Dark mode) with TypeScript.

### Step 1: Create the Context and Provider (`ThemeContext.tsx`)

It is best practice to bundle the Context, Provider component, and a custom consumption hook in a single file:

```tsx
// src/ThemeContext.tsx
import React, { createContext, useContext, useState } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

// 1. Create Context with an initial default value
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// 2. Create the Provider Component
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('light');

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

// 3. Custom Hook for type-safe context consumption
export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

```

---

### Step 2: Wrap Your Application with the Provider (`App.tsx`)

Wrap the parent component (or root layout) with `<ThemeProvider>` so all child components can access the state:

```tsx
// src/App.tsx
import React from 'react';
import { ThemeProvider } from './ThemeContext';
import { Header } from './Header';
import { MainContent } from './MainContent';

export function App() {
  return (
    <ThemeProvider>
      <div style={{ minHeight: '100vh' }}>
        <Header />
        <MainContent />
      </div>
    </ThemeProvider>
  );
}

export default App;

```

---

### Step 3: Consume Context in Child Components

Any component nested inside `<ThemeProvider>` can read and update the context state using `useTheme()` directly:

```tsx
// src/Header.tsx
import React from 'react';
import { useTheme } from './ThemeContext';

export function Header() {
  const { theme, toggleTheme } = useTheme();

  return (
    <header
      style={{
        padding: '16px 24px',
        backgroundColor: theme === 'light' ? '#f8fafc' : '#1e293b',
        color: theme === 'light' ? '#0f172a' : '#f8fafc',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      <h2>My Application</h2>
      <button
        onClick={toggleTheme}
        style={{
          padding: '8px 16px',
          cursor: 'pointer',
          borderRadius: '6px',
          border: 'none',
          backgroundColor: theme === 'light' ? '#0f172a' : '#f8fafc',
          color: theme === 'light' ? '#f8fafc' : '#0f172a',
        }}
      >
        Switch to {theme === 'light' ? 'Dark' : 'Light'} Mode
      </button>
    </header>
  );
}

```

---

## 3. When Should You Use Context API?

### Good Use Cases

* **Global App Themes:** Light/Dark mode toggles or accent colors.
* **User Authentication:** Logged-in user profiles, roles, and auth tokens.
* **Locale / i18n:** Preferred language and currency settings.
* **Compound Components:** Shared state within complex UI widgets (e.g., Accordion, Tabs, Dropdown menus).

### When NOT to Use Context

* **High-Frequency State Updates:** If state updates multiple times per second (e.g., text inputs, mouse coordinates, real-time animation values), Context will trigger re-renders across all consumer components.
* **To Avoid Simple Prop Drilling (1-2 levels):** Passing props down 1 or 2 components is completely fine. Don't over-engineer with Context prematurely.
* **Complex Global Data Management:** For large applications with complex side-effects, undo history, or normalized caches, specialized state management libraries (like Zustand, Redux Toolkit, or TanStack Query) are better suited.

---

## 4. Performance Optimization Tip: Splitting State & Dispatch

When a Context value changes, **every component calling `useContext(Context)` re-renders**.

To prevent unnecessary re-renders in components that only dispatch actions (e.g., buttons that call `toggleTheme` but don't need to read `theme`), split the state and dispatch into two separate Contexts:

```tsx
// Separate Contexts for value and actions
const ThemeStateContext = createContext<'light' | 'dark' | undefined>(undefined);
const ThemeDispatchContext = createContext<(() => void) | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const toggleTheme = () => setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));

  return (
    <ThemeStateContext.Provider value={theme}>
      <ThemeDispatchContext.Provider value={toggleTheme}>
        {children}
      </ThemeDispatchContext.Provider>
    </ThemeStateContext.Provider>
  );
}

```

---

## Context API vs. Zustand / Redux

| Metric                    | React Context API                                     | Zustand / Redux Toolkit                                       |
| ------------------------- | ----------------------------------------------------- | ------------------------------------------------------------- |
| **Setup Complexity**      | Zero external dependencies (built into React)         | Requires installing packages & boilerplate                    |
| **Re-render Scope**       | All consumers re-render when context object changes   | Selectors prevent re-renders (`useStore(state => state.foo)`) |
| **Middleware / DevTools** | None built-in                                         | Rich Redux DevTools support, logging, persistence             |
| **Best Used For**         | Low-frequency, broad global state (Theme, Auth, i18n) | Complex, high-frequency, or heavily mutated store state       |

Show strategies for optimizing React Context API performance and preventing unnecessary re-renders.

The primary performance bottleneck with the React Context API is that **whenever a Context provider's `value` prop changes reference, every component consuming that Context re-renders**, even if it only uses a piece of the data that didn't change.

Here are the 4 core strategies to eliminate unnecessary re-renders in React Context.

---

## Strategy 1: Memoize the Context `value` Object

If you create an object or function inline inside the `value` prop of a Provider, a new reference is generated on **every single parent render**, causing all consumers to re-render needlessly.

### ❌ The Anti-Pattern (Inline Object)

```tsx
// Every time App re-renders, a NEW object reference is passed to value.
// EVERY consumer re-renders!
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState('light');

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

```

### ✅ The Fix: `useMemo` & `useCallback`

Wrap the `value` object in `useMemo` (and setter functions in `useCallback` if defined separately) so the reference stays stable unless the actual state changes:

```tsx
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState('light');

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  }, []);

  // Stable object reference created with useMemo
  const contextValue = useMemo(
    () => ({ theme, toggleTheme }),
    [theme, toggleTheme]
  );

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
}

```

---

## Strategy 2: Split State and Dispatch into Separate Contexts

Many components only need to **trigger an action** (e.g., clicking a "Toggle Mode" button) without caring about the actual state value. If you keep state and actions in one Context, that button will re-render whenever state changes.

### ✅ The Fix: Dual Context Architecture

Split the read-only state and write-only dispatch functions into two distinct Contexts:

```tsx
import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';

// Context 1: Holds changing state
const StateContext = createContext<string | undefined>(undefined);

// Context 2: Holds stable dispatch/action methods
const DispatchContext = createContext<(() => void) | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState('light');

  // Callback is stable across re-renders
  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  }, []);

  return (
    <StateContext.Provider value={theme}>
      <DispatchContext.Provider value={toggleTheme}>
        {children}
      </DispatchContext.Provider>
    </StateContext.Provider>
  );
}

// Custom hooks
export const useAppState = () => {
  const context = useContext(StateContext);
  if (!context) throw new Error('useAppState must be used within AppProvider');
  return context;
};

export const useAppDispatch = () => {
  const context = useContext(DispatchContext);
  if (!context) throw new Error('useAppDispatch must be used within AppProvider');
  return context;
};

```

### Why this works

A button using `const toggleTheme = useAppDispatch()` will **never re-render when `theme` changes**, because `DispatchContext`'s value reference remains 100% stable.

---

## Strategy 3: Component Isolation & Internal Selectors

If a component reads a large Context object, you can isolate sub-components or extract selectors using standard `React.memo`.

### Problem Scenario

A dashboard component consumes a `UserContext` containing `{ name, email, avatar, settings }`, but only needs to render the `name`.

### ✅ The Fix: Component Extraction + `React.memo`

```tsx
// 1. Parent reads context and extracts primitive value
function UserGreetingContainer() {
  const { user } = useUserContext(); // Triggers parent render on user updates
  return <UserGreetingName name={user.name} />;
}

// 2. Child component is memoized and ONLY re-renders if `name` string changes!
const UserGreetingName = React.memo(({ name }: { name: string }) => {
  return <h1>Welcome back, {name}!</h1>;
});

```

---

## Strategy 4: Fine-Grained Provider Scope

Instead of putting all context data into one giant global `AppContext.Provider` at the root of your app (`index.tsx`), wrap only the sub-trees that actually need the data.

```tsx
// ❌ Don't wrap the entire app in every feature provider
<AppProvider>
  <DashboardProvider>
    <CartProvider>
      <App />
    </CartProvider>
  </DashboardProvider>
</AppProvider>

// ✅ Keep Context providers local to where they are consumed
function ShoppingSection() {
  return (
    <CartProvider>
      <CartDrawer />
      <CheckoutButton />
    </CartProvider>
  );
}

```

---

## Summary Decision Matrix

| Performance Problem                                             | Recommended Solution                                                                         |
| --------------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| **New object created every render**                             | Wrap `value` in `useMemo()` and methods in `useCallback()`.                                  |
| **Action-only components re-rendering on state changes**        | Split into `StateContext` and `DispatchContext`.                                             |
| **Component only uses 1 field out of a large Context object**   | Extract child component and wrap with `React.memo(Child)`.                                   |
| **Context changes re-render the entire app tree**               | Colocate Providers closer to target feature branches instead of `App.tsx`.                   |
| **High-frequency updates (e.g., inputs, drag/drop, animation)** | Move away from Context API to a store with atomic selectors (like **Zustand** or **Jotai**). |

Both **React Context API** and **Zustand** are popular choices for managing global state in React, but they are built for different use cases and scales.

* **React Context API** is a built-in React mechanism designed for broad, low-frequency data (like themes or auth tokens).
* **Zustand** is a lightweight (~1kB), unopinionated external state management library built on top of an external store with atomic subscriptions, designed for high-performance and frequent updates.

---

## 1. Feature Comparison

| Feature                   | React Context API                                                                          | Zustand                                                                                                               |
| ------------------------- | ------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------- |
| **Setup & Boilerplate**   | Native to React (no installation), requires `createContext` and `<Provider>` wrappers.     | Small third-party dependency (`npm i zustand`), zero `<Provider>` wrappers needed.                                    |
| **Re-render Behavior**    | **Coarse-grained:** Any value change re-renders **all** components calling `useContext()`. | **Fine-grained:** Components subscribe via **atomic selectors** and *only* re-render if their selected state changes. |
| **Update Frequency**      | Ideal for low-frequency updates (Theme, Locale, Auth User).                                | Suitable for high-frequency or complex updates (Inputs, Forms, Interactive Canvas, Shopping Carts).                   |
| **Usage Outside React**   | Cannot be read or modified outside React components/hooks.                                 | Can be read/updated **anywhere** (in API interceptors, utilities, or vanilla JS).                                     |
| **DevTools & Middleware** | No built-in devtools or middleware.                                                        | Native support for Redux DevTools, `persist` (localStorage auto-sync), and custom middleware.                         |

---

## 2. Code Example: Shopping Cart

Here is how to build a simple shopping cart with **items** and an **`addItem` action** in both approaches.

### Approach A: React Context API

Context requires creating a Provider, holding state inside a component, memoizing values, and wrapping the component tree.

```tsx
// CartContext.tsx
import React, { createContext, useContext, useState, useMemo, useCallback } from 'react';

export interface CartItem {
  id: string;
  name: string;
  price: number;
}

interface CartContextType {
  cart: CartItem[];
  addItem: (item: CartItem) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);

  const addItem = useCallback((item: CartItem) => {
    setCart((prev) => [...prev, item]);
  }, []);

  // Must memoize to avoid reference changes on unrelated renders
  const value = useMemo(() => ({ cart, addItem }), [cart, addItem]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
}

```

#### Consumption in Components

```tsx
// 1. Wrap parent tree
function App() {
  return (
    <CartProvider>
      <Header />
      <ProductList />
    </CartProvider>
  );
}

// 2. Add Button Component
function AddToCartButton({ product }: { product: CartItem }) {
  const { addItem } = useCart(); 
  // ⚠️ Issue: Even though this button only uses `addItem`, it will STILL 
  // re-render every time `cart` changes because it consumes the same Context!
  return <button onClick={() => addItem(product)}>Add to Cart</button>;
}

// 3. Cart Badge Component
function CartBadge() {
  const { cart } = useCart();
  return <span>Items in cart: {cart.length}</span>;
}

```

---

### Approach B: Zustand

Zustand creates a central hook-based store directly. No Providers required.

```tsx
// useCartStore.ts
import { create } from 'zustand';

export interface CartItem {
  id: string;
  name: string;
  price: number;
}

interface CartStore {
  cart: CartItem[];
  addItem: (item: CartItem) => void;
}

// Create the store hook directly
export const useCartStore = create<CartStore>((set) => ({
  cart: [],
  addItem: (item) => set((state) => ({ cart: [...state.cart, item] })),
}));

```

#### Consumption in Components

```tsx
// 1. No <Provider> required at the root!
function App() {
  return (
    <div>
      <Header />
      <ProductList />
    </div>
  );
}

// 2. Add Button Component (Atomic Selector)
function AddToCartButton({ product }: { product: CartItem }) {
  // Subscribe ONLY to the `addItem` action
  const addItem = useCartStore((state) => state.addItem);
  
  // ✅ Performance Win: This button will NEVER re-render when items are added to `cart`!
  return <button onClick={() => addItem(product)}>Add to Cart</button>;
}

// 3. Cart Badge Component
function CartBadge() {
  // Subscribe ONLY to the length of the cart
  const cartLength = useCartStore((state) => state.cart.length);
  return <span>Items in cart: {cartLength}</span>;
}

```

---

## 3. Extra Power-Up: Zustand Middleware (`persist`)

Zustand makes persistence effortless. Wrapping your store in `persist` automatically saves state to `localStorage` and rehydrates it on page reload—something that requires manual `useEffect` logic in Context API:

```typescript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useCartStore = create<CartStore>()(
  persist(
    (set) => ({
      cart: [],
      addItem: (item) => set((state) => ({ cart: [...state.cart, item] })),
    }),
    {
      name: 'shopping-cart-storage', // Key in localStorage
    }
  )
);

```

---

## Which One Should You Choose?

### Use **React Context API** if

* You want to avoid adding third-party npm packages.
* The state is static or changes infrequently (e.g., Theme, Locale/Language, User Session).
* You are building a standalone library or UI widget that shouldn't dictate global dependencies to consumers.
* You need scope isolation (e.g., each instances of a Tab/Accordion component needs its own independent state tree).

### Use **Zustand** if

* Your state updates frequently or contains complex nested collections (Shopping Carts, Dashboards, Form Wizards).
* You want to avoid "Provider Hell" (`<AuthProvider><ThemeProvider><UserProvider>...`) at the root of your application.
* You want selective re-rendering out of the box without manually writing `useMemo`, `useCallback`, or splitting Contexts.
* You need features like `localStorage` persistence, Redux DevTools tracking, or access to state outside React components (e.g., inside an Axios request interceptor).
