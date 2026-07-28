Managing global state in a React application without using **Redux** or the **Context API** can be achieved through various methods and libraries. Here are some strategies for managing global state:

### 1. **Custom Hook for Global State Management**

You can create a custom hook to manage global state locally and share it across your app. This custom hook can use `useState`, `useReducer`, or any other state management technique to manage shared state.

#### Example: Custom Hook Using `useState`

```javascript
import { useState } from "react";

let globalState = {}; // This will store the state globally
let listeners = []; // Array of listeners to notify state changes

function useGlobalState(key, initialValue) {
  // Set initial state if not already set
  if (!globalState[key]) {
    globalState[key] = initialValue;
  }

  // Subscribe to state changes
  const [state, setState] = useState(globalState[key]);

  // Update state and notify listeners
  const setGlobalState = (newState) => {
    globalState[key] = newState;
    setState(newState);
    listeners.forEach((listener) => listener());
  };

  // Add a listener to be notified on state change
  const subscribe = (listener) => {
    listeners.push(listener);
    return () => {
      listeners = listeners.filter((l) => l !== listener);
    };
  };

  return [state, setGlobalState, subscribe];
}

export default useGlobalState;
```

Now you can use this hook in any component to share state across your app.

#### Example Usage:

```javascript
import React from "react";
import useGlobalState from "./useGlobalState";

function ComponentA() {
  const [globalState, setGlobalState] = useGlobalState("user", {
    name: "John",
  });

  return (
    <div>
      <h1>{globalState.name}</h1>
      <button onClick={() => setGlobalState({ name: "Jane" })}>
        Change Name
      </button>
    </div>
  );
}

function ComponentB() {
  const [globalState] = useGlobalState("user", { name: "John" });

  return <h1>{globalState.name}</h1>;
}

export default function App() {
  return (
    <div>
      <ComponentA />
      <ComponentB />
    </div>
  );
}
```

This method allows you to manage global state in a simpler way without relying on Redux or the Context API. However, this can become complex if you need to manage large state structures.

---

### 2. **External State Management Libraries (without Redux or Context)**

#### **2.1. Zustand**

**Zustand** is a minimalistic state management library for React. It allows you to create stores that hold global state and can be used in multiple components.

- **Installation**:

  ```bash
  npm install zustand
  ```

- **Example**:

  ```javascript
  import create from "zustand";

  // Create a store
  const useStore = create((set) => ({
    user: { name: "John" },
    setUser: (newUser) => set((state) => ({ user: newUser })),
  }));

  function ComponentA() {
    const { user, setUser } = useStore();
    return (
      <div>
        <h1>{user.name}</h1>
        <button onClick={() => setUser({ name: "Jane" })}>Change Name</button>
      </div>
    );
  }

  function ComponentB() {
    const { user } = useStore();
    return <h1>{user.name}</h1>;
  }

  export default function App() {
    return (
      <div>
        <ComponentA />
        <ComponentB />
      </div>
    );
  }
  ```

Zustand is small, simple to use, and doesn’t require context or boilerplate code like Redux. It can be very helpful in projects where you need a simpler approach to global state.

---

#### **2.2. Recoil**

**Recoil** is another state management library developed by Facebook that is designed to work with React's concurrent mode. It allows you to manage shared state in a way similar to Redux, but with less boilerplate.

- **Installation**:

  ```bash
  npm install recoil
  ```

- **Example**:

  ```javascript
  import { atom, selector, useRecoilState } from "recoil";

  // Define an atom (global state unit)
  const userState = atom({
    key: "userState", // Unique key for this atom
    default: { name: "John" },
  });

  function ComponentA() {
    const [user, setUser] = useRecoilState(userState);
    return (
      <div>
        <h1>{user.name}</h1>
        <button onClick={() => setUser({ name: "Jane" })}>Change Name</button>
      </div>
    );
  }

  function ComponentB() {
    const user = useRecoilState(userState)[0];
    return <h1>{user.name}</h1>;
  }

  export default function App() {
    return (
      <div>
        <ComponentA />
        <ComponentB />
      </div>
    );
  }
  ```

Recoil uses **atoms** to represent global state, and **selectors** to compute derived state. It’s a more powerful approach, particularly if your app needs more complex state interactions.

---

#### **2.3. Jotai**

**Jotai** is another lightweight state management library, similar to Recoil but simpler. It uses **atoms** (which are pieces of state) and allows you to create global stores.

- **Installation**:

  ```bash
  npm install jotai
  ```

- **Example**:

  ```javascript
  import { atom, useAtom } from "jotai";

  const userAtom = atom({ name: "John" });

  function ComponentA() {
    const [user, setUser] = useAtom(userAtom);
    return (
      <div>
        <h1>{user.name}</h1>
        <button onClick={() => setUser({ name: "Jane" })}>Change Name</button>
      </div>
    );
  }

  function ComponentB() {
    const [user] = useAtom(userAtom);
    return <h1>{user.name}</h1>;
  }

  export default function App() {
    return (
      <div>
        <ComponentA />
        <ComponentB />
      </div>
    );
  }
  ```

Jotai is small and provides a very straightforward API. It’s perfect for simpler global state management needs and doesn’t require any global providers or boilerplate.

---

### 3. **LocalStorage or SessionStorage for Global State**

In certain scenarios, you may use **localStorage** or **sessionStorage** for persisting global state. This approach can be useful if you need the state to persist across page reloads, but it's typically not the best option for dynamic UI state.

#### Example:

```javascript
import { useState, useEffect } from "react";

function usePersistentState(key, defaultValue) {
  const [state, setState] = useState(() => {
    const storedValue = localStorage.getItem(key);
    return storedValue ? JSON.parse(storedValue) : defaultValue;
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(state));
  }, [state, key]);

  return [state, setState];
}

function App() {
  const [name, setName] = usePersistentState("name", "John");

  return (
    <div>
      <h1>{name}</h1>
      <button onClick={() => setName("Jane")}>Change Name</button>
    </div>
  );
}
```

This approach allows global state to persist even if the page is reloaded, but it may not be suitable for complex or interactive state management.

---

### 4. **Event Emitters**

If you need a way for components to communicate without using context or a third-party library, you can create an event emitter. This is particularly useful when you need decoupled communication between components.

```javascript
import EventEmitter from "events";

const emitter = new EventEmitter();

function ComponentA() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const handleData = (newData) => {
      setData(newData);
    };

    emitter.on("dataChange", handleData);
    return () => {
      emitter.removeListener("dataChange", handleData);
    };
  }, []);

  return (
    <div>
      <h1>{data}</h1>
      <button onClick={() => emitter.emit("dataChange", "New Data")}>
        Change Data
      </button>
    </div>
  );
}
```

In this example, an event emitter allows communication between different parts of the app without needing global state management systems like Redux or Context.

---

### Conclusion

There are several ways to manage global state without using Redux or the Context API in React:

- **Custom Hooks**: Create your own custom state management solution with hooks.
- **Libraries**: Use lightweight state management libraries like **Zustand**, **Recoil**, or **Jotai**.
- **Persistent Storage**: Use **localStorage** or **sessionStorage** for persistence across reloads.
- **Event Emitters**: Use event emitters to communicate between components.

Each approach has its strengths and trade-offs, so the right choice depends on your application's needs.
