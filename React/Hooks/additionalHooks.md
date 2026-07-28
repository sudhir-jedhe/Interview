# Custom React Hooks Collection (Interview Must-Have)

---

# 1. useBoolean

```jsx
import { useState } from "react";

export function useBoolean(initial = false) {
  const [value, setValue] = useState(initial);

  return {
    value,
    setTrue: () => setValue(true),
    setFalse: () => setValue(false),
    toggle: () => setValue((v) => !v),
  };
}
```

---

# 2. useToggle

```jsx
import { useState } from "react";

export function useToggle(initial = false) {
  const [value, setValue] = useState(initial);

  const toggle = () => setValue((v) => !v);

  return [value, toggle];
}
```

---

# 3. useCountdown

```jsx
import { useEffect, useState } from "react";

export function useCountdown(initialSeconds) {
  const [count, setCount] = useState(initialSeconds);

  useEffect(() => {
    if (count <= 0) return;

    const timer = setTimeout(() => {
      setCount(count - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [count]);

  const reset = () => setCount(initialSeconds);

  return {
    count,
    reset,
  };
}
```

---

# 4. useWindowSize

```jsx
import { useEffect, useState } from "react";

export function useWindowSize() {
  const [size, setSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const resize = () =>
      setSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });

    window.addEventListener("resize", resize);

    return () => window.removeEventListener("resize", resize);
  }, []);

  return size;
}
```

---

# 5. useBreakpoint

```jsx
import { useWindowSize } from "./useWindowSize";

export function useBreakpoint() {
  const { width } = useWindowSize();

  if (width < 768) return "mobile";

  if (width < 1024) return "tablet";

  return "desktop";
}
```

---

# 6. useClickAnywhere

```jsx
import { useEffect } from "react";

export function useClickAnywhere(callback) {
  useEffect(() => {
    document.addEventListener("click", callback);

    return () => document.removeEventListener("click", callback);
  }, [callback]);
}
```

---

# 7. useEventListener

```jsx
import { useEffect } from "react";

export function useEventListener(event, handler, element = window) {
  useEffect(() => {
    element.addEventListener(event, handler);

    return () => element.removeEventListener(event, handler);
  }, [event, handler, element]);
}
```

---

# 8. useInputControl

```jsx
import { useState } from "react";

export function useInputControl(initial = "") {
  const [value, setValue] = useState(initial);

  const onChange = (e) => setValue(e.target.value);

  const reset = () => setValue("");

  return {
    value,
    onChange,
    reset,
  };
}
```

---

# 9. useInterval

```jsx
import { useEffect, useRef } from "react";

export function useInterval(callback, delay) {
  const savedCallback = useRef();

  useEffect(() => {
    savedCallback.current = callback;
  });

  useEffect(() => {
    if (delay == null) return;

    const id = setInterval(() => {
      savedCallback.current();
    }, delay);

    return () => clearInterval(id);
  }, [delay]);
}
```

---

# 10. useKeyPress

```jsx
import { useEffect, useState } from "react";

export function useKeyPress(targetKey) {
  const [pressed, setPressed] = useState(false);

  useEffect(() => {
    const down = (e) => {
      if (e.key === targetKey) {
        setPressed(true);
      }
    };

    const up = (e) => {
      if (e.key === targetKey) {
        setPressed(false);
      }
    };

    window.addEventListener("keydown", down);

    window.addEventListener("keyup", up);

    return () => {
      window.removeEventListener("keydown", down);

      window.removeEventListener("keyup", up);
    };
  }, [targetKey]);

  return pressed;
}
```

---

# 11. usePreviousState

```jsx
import { useEffect, useRef } from "react";

export function usePreviousState(value) {
  const ref = useRef();

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
}
```

---

# 12. useSet

```jsx
import { useState } from "react";

export function useSet(initialValue = new Set()) {
  const [set, setSet] = useState(new Set(initialValue));

  const add = (value) => setSet((prev) => new Set([...prev, value]));

  const remove = (value) =>
    setSet((prev) => {
      const copy = new Set(prev);

      copy.delete(value);

      return copy;
    });

  const clear = () => setSet(new Set());

  return {
    set,
    add,
    remove,
    clear,
    size: set.size,
  };
}
```

---

# 13. useThrottle

```jsx
import { useEffect, useState } from "react";

export function useThrottle(value, delay) {
  const [throttledValue, setThrottledValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setThrottledValue(value);
    }, delay);

    return () => clearTimeout(timer);
  }, [value, delay]);

  return throttledValue;
}
```

---

# Interview Questions Around These Hooks

### Beginner

```text
useToggle
useBoolean
useInputControl
usePreviousState
```

### Intermediate

```text
useWindowSize
useBreakpoint
useClickAnywhere
useKeyPress
useSet
```

### Advanced

```text
useThrottle
useInterval
useEventListener
useCountdown
```

### Senior-Level Follow-up

```text
✅ useDebounce
✅ useAsync
✅ useFetch
✅ useLocalStorage
✅ useUndoRedo
✅ useHover
✅ useLongPress
✅ useVirtualizedList
✅ useIntersectionObserver
✅ useInfiniteScroll
```

These hooks are frequently asked in Senior Frontend and React interview rounds because they test hook composition, side-effect management, closures, cleanup logic, and reusability.

# 1. `useDebounce`

Delays updating a value until the user stops changing it.

```jsx
import { useEffect, useState } from "react";

export function useDebounce(value, delay = 500) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}
```

### Usage

```jsx
const [search, setSearch] = useState("");

const debouncedSearch = useDebounce(search, 500);
```

---

# 2. `useAsync`

Handles async operations.

```jsx
import { useCallback, useState } from "react";

export function useAsync(asyncFunction) {
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState(null);

  const [data, setData] = useState(null);

  const execute = useCallback(
    async (...args) => {
      setLoading(true);
      setError(null);

      try {
        const result = await asyncFunction(...args);

        setData(result);

        return result;
      } catch (err) {
        setError(err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [asyncFunction],
  );

  return {
    loading,
    data,
    error,
    execute,
  };
}
```

---

# 3. `useFetch`

```jsx
import { useEffect, useState } from "react";

export function useFetch(url) {
  const [data, setData] = useState(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;

    async function fetchData() {
      try {
        setLoading(true);

        const response = await fetch(url);

        const json = await response.json();

        if (mounted) setData(json);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();

    return () => {
      mounted = false;
    };
  }, [url]);

  return {
    data,
    loading,
    error,
  };
}
```

---

# 4. `useLocalStorage`

```jsx
import { useState } from "react";

export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    const stored = localStorage.getItem(key);

    return stored ? JSON.parse(stored) : initialValue;
  });

  const updateValue = (newValue) => {
    setValue(newValue);

    localStorage.setItem(key, JSON.stringify(newValue));
  };

  return [value, updateValue];
}
```

---

# 5. `useUndoRedo`

```jsx
import { useState } from "react";

export function useUndoRedo(initial) {
  const [history, setHistory] = useState([initial]);

  const [index, setIndex] = useState(0);

  const value = history[index];

  const set = (newValue) => {
    const copy = history.slice(0, index + 1);

    copy.push(newValue);

    setHistory(copy);
    setIndex(copy.length - 1);
  };

  const undo = () => setIndex((i) => Math.max(0, i - 1));

  const redo = () => setIndex((i) => Math.min(history.length - 1, i + 1));

  return {
    value,
    set,
    undo,
    redo,
    canUndo: index > 0,
    canRedo: index < history.length - 1,
  };
}
```

---

# 6. `useHover`

```jsx
import { useRef, useState, useEffect } from "react";

export function useHover() {
  const [hovered, setHovered] = useState(false);

  const ref = useRef(null);

  useEffect(() => {
    const node = ref.current;

    if (!node) return;

    const enter = () => setHovered(true);

    const leave = () => setHovered(false);

    node.addEventListener("mouseenter", enter);

    node.addEventListener("mouseleave", leave);

    return () => {
      node.removeEventListener("mouseenter", enter);

      node.removeEventListener("mouseleave", leave);
    };
  }, []);

  return [ref, hovered];
}
```

---

# 7. `useLongPress`

```jsx
import { useRef } from "react";

export function useLongPress(callback, delay = 500) {
  const timer = useRef();

  const start = () => {
    timer.current = setTimeout(callback, delay);
  };

  const clear = () => {
    clearTimeout(timer.current);
  };

  return {
    onMouseDown: start,
    onMouseUp: clear,
    onTouchStart: start,
    onTouchEnd: clear,
  };
}
```

### Usage

```jsx
const longPress = useLongPress(() => {
  console.log("Long pressed");
});
```

---

# 8. `useVirtualizedList`

```jsx
import { useMemo } from "react";

export function useVirtualizedList({
  items,
  itemHeight,
  containerHeight,
  scrollTop,
}) {
  const startIndex = Math.floor(scrollTop / itemHeight);

  const visibleCount = Math.ceil(containerHeight / itemHeight);

  const visibleItems = useMemo(
    () => items.slice(startIndex, startIndex + visibleCount + 1),
    [items, startIndex, visibleCount],
  );

  return {
    startIndex,
    visibleItems,
  };
}
```

---

# 9. `useIntersectionObserver`

```jsx
import { useEffect, useState } from "react";

export function useIntersectionObserver(ref) {
  const [isVisible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      setVisible(entry.isIntersecting);
    });

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [ref]);

  return isVisible;
}
```

---

# 10. `useInfiniteScroll`

```jsx
import { useEffect, useRef } from "react";

export function useInfiniteScroll(callback) {
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        callback();
      }
    });

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [callback]);

  return ref;
}
```

### Usage

```jsx
const loadMoreRef = useInfiniteScroll(fetchNextPage);

return (
  <>
    {data.map((item) => (
      <Card key={item.id} />
    ))}

    <div ref={loadMoreRef} />
  </>
);
```

---

# Senior React Hooks Cheat Sheet

### Frequently Asked

```text
✅ useDebounce
✅ useThrottle
✅ useLocalStorage
✅ usePrevious
✅ useToggle
✅ useBoolean
✅ useFetch
✅ useAsync
```

### Senior Level

```text
✅ useUndoRedo
✅ useHover
✅ useLongPress
✅ useIntersectionObserver
✅ useInfiniteScroll
✅ useVirtualizedList
✅ useEventListener
✅ useMediaQuery
```

### Staff/Architect Level

```text
✅ useQuery (custom)
✅ useMutation (custom)
✅ useWebSocket
✅ useSyncExternalStore
✅ useCommandPattern
✅ useStateMachine
✅ useActorModel
✅ useOptimisticCache
```

These hooks are among the most common custom-hook discussions in Senior React interviews because they demonstrate state management, side effects, performance optimisation, browser APIs, and reusable abstraction design.

# 1. `useQuery` (Custom React Query Style)

Features:

```text
✅ Caching
✅ Loading
✅ Error
✅ Refetch
✅ Stale State
```

```jsx
import { useEffect, useState } from "react";

const cache = new Map();

export function useQuery(key, fetcher) {
  const [data, setData] = useState(cache.get(key));

  const [loading, setLoading] = useState(!cache.has(key));

  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);

      const result = await fetcher();

      cache.set(key, result);

      setData(result);
    } catch (e) {
      setError(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!cache.has(key)) {
      fetchData();
    }
  }, [key]);

  return {
    data,
    loading,
    error,
    refetch: fetchData,
  };
}
```

---

# 2. `useMutation`

Used for:

```text
Create
Update
Delete
POST API
```

```jsx
import { useState } from "react";

export function useMutation(mutationFn) {
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState(null);

  const mutate = async (payload) => {
    try {
      setLoading(true);

      return await mutationFn(payload);
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    mutate,
    loading,
    error,
  };
}
```

### Usage

```jsx
const { mutate } = useMutation(createEmployee);

mutate(employeeData);
```

---

# 3. `useWebSocket`

```jsx
import { useEffect, useRef, useState } from "react";

export function useWebSocket(url) {
  const ws = useRef(null);

  const [messages, setMessages] = useState([]);

  useEffect(() => {
    ws.current = new WebSocket(url);

    ws.current.onmessage = (event) => {
      setMessages((prev) => [...prev, event.data]);
    };

    return () => ws.current?.close();
  }, [url]);

  const sendMessage = (message) => {
    ws.current?.send(message);
  };

  return {
    messages,
    sendMessage,
  };
}
```

---

# 4. `useSyncExternalStore`

React's official external-store subscription hook.

```jsx
import { useSyncExternalStore } from "react";

const store = {
  value: 0,

  listeners: new Set(),

  subscribe(listener) {
    this.listeners.add(listener);

    return () => this.listeners.delete(listener);
  },

  getSnapshot() {
    return this.value;
  },

  increment() {
    this.value++;

    this.listeners.forEach((listener) => listener());
  },
};

export function useCounterStore() {
  return useSyncExternalStore(
    store.subscribe.bind(store),
    store.getSnapshot.bind(store),
  );
}
```

### Usage

```jsx
const count = useCounterStore();
```

---

# 5. `useCommandPattern`

Used for:

```text
Undo
Redo
Editor
Drawing App
```

```jsx
import { useState } from "react";

export function useCommandPattern() {
  const [history, setHistory] = useState([]);

  const execute = (command) => {
    command.execute();

    setHistory((prev) => [...prev, command]);
  };

  const undo = () => {
    const last = history[history.length - 1];

    if (!last) return;

    last.undo();

    setHistory((prev) => prev.slice(0, -1));
  };

  return {
    execute,
    undo,
  };
}
```

---

# 6. `useStateMachine`

```jsx
import { useReducer } from "react";

const machine = {
  idle: {
    START: "loading",
  },

  loading: {
    SUCCESS: "success",

    ERROR: "error",
  },

  error: {
    RETRY: "loading",
  },
};

function reducer(state, action) {
  return machine[state][action] || state;
}

export function useStateMachine() {
  const [state, send] = useReducer(reducer, "idle");

  return {
    state,
    send,
  };
}
```

### Usage

```jsx
send("START");

send("SUCCESS");
```

---

# 7. `useActorModel`

Inspired by XState.

```jsx
import { useReducer } from "react";

function actorReducer(state, event) {
  switch (event.type) {
    case "INCREMENT":
      return {
        count: state.count + 1,
      };

    case "DECREMENT":
      return {
        count: state.count - 1,
      };

    default:
      return state;
  }
}

export function useActorModel() {
  const [state, dispatch] = useReducer(actorReducer, {
    count: 0,
  });

  const send = (event) => dispatch(event);

  return {
    state,
    send,
  };
}
```

---

# 8. `useOptimisticCache`

Very useful for:

```text
React Query
Optimistic Updates
Like/Unlike
Shopping Cart
```

```jsx
import { useState } from "react";

export function useOptimisticCache(initialData) {
  const [data, setData] = useState(initialData);

  const updateOptimistically = (updater, mutation) => {
    const previous = data;

    const next = updater(data);

    setData(next);

    mutation().catch(() => {
      setData(previous);
    });
  };

  return {
    data,
    updateOptimistically,
  };
}
```

### Usage

```jsx
updateOptimistically(
  (users) =>
    users.map((user) =>
      user.id === id
        ? {
            ...user,
            liked: true,
          }
        : user,
    ),

  () => api.likePost(id),
);
```

---

# Hook Architecture by Seniority

## Mid-Level

```text
✅ useToggle
✅ useBoolean
✅ useSet
✅ useMap
✅ useInput
✅ usePrevious
```

---

## Senior

```text
✅ useFetch
✅ useAsync
✅ useDebounce
✅ useThrottle
✅ useInfiniteScroll
✅ useIntersectionObserver
✅ useUndoRedo
✅ useWebSocket
```

---

## Staff / Architect

```text
✅ useQuery
✅ useMutation
✅ useOptimisticCache
✅ useCommandPattern
✅ useSyncExternalStore
✅ useActorModel
✅ useStateMachine
✅ Event Sourcing Patterns
✅ CQRS Patterns
✅ Offline-First Hooks
✅ Distributed State Hooks
```

### React Interview Question

**Difference between `useReducer`, State Machine, and Actor Model?**

```text
useReducer
→ Simple state transitions

State Machine
→ Explicit finite states
→ Prevents invalid transitions

Actor Model
→ State + Message Passing
→ Scales to complex workflows

Actor Model > State Machine > useReducer
for large enterprise applications
```

These advanced hooks are typically discussed in Senior, Staff, and Frontend Architect interviews because they represent reusable abstractions for complex state management, side effects, caching, real-time communication, and application architecture.

Here are **more advanced custom hooks** frequently discussed in **Senior React / Frontend Architecture interviews**.

# State Hooks

## `useCounter`

```jsx
export function useCounter(initial = 0) {
  const [count, setCount] = useState(initial);

  return {
    count,
    increment: () => setCount((c) => c + 1),
    decrement: () => setCount((c) => c - 1),
    reset: () => setCount(initial),
  };
}
```

---

## `useList`

```jsx
export function useList(initial = []) {
  const [list, setList] = useState(initial);

  return {
    list,
    add: (item) => setList((l) => [...l, item]),
    remove: (index) => setList((l) => l.filter((_, i) => i !== index)),
    clear: () => setList([]),
  };
}
```

---

## `useQueue`

```jsx
export function useQueue(initial = []) {
  const [queue, setQueue] = useState(initial);

  const enqueue = (item) => setQueue((q) => [...q, item]);

  const dequeue = () => {
    const first = queue[0];

    setQueue((q) => q.slice(1));

    return first;
  };

  return {
    queue,
    enqueue,
    dequeue,
  };
}
```

---

# Browser Hooks

## `useClipboard`

```jsx
export function useClipboard() {
  const [copied, setCopied] = useState(false);

  const copy = async (text) => {
    await navigator.clipboard.writeText(text);

    setCopied(true);

    setTimeout(() => setCopied(false), 2000);
  };

  return { copy, copied };
}
```

---

## `useOnlineStatus`

```jsx
export function useOnlineStatus() {
  const [online, setOnline] = useState(navigator.onLine);

  useEffect(() => {
    const online = () => setOnline(true);

    const offline = () => setOnline(false);

    window.addEventListener("online", online);

    window.addEventListener("offline", offline);

    return () => {
      window.removeEventListener("online", online);

      window.removeEventListener("offline", offline);
    };
  }, []);

  return online;
}
```

---

## `useDocumentTitle`

```jsx
export function useDocumentTitle(title) {
  useEffect(() => {
    document.title = title;
  }, [title]);
}
```

---

# Performance Hooks

## `useLatest`

Avoid stale closures.

```jsx
import { useRef } from "react";

export function useLatest(value) {
  const ref = useRef(value);

  ref.current = value;

  return ref;
}
```

---

## `useMemoizedFn`

```jsx
import { useRef, useCallback } from "react";

export function useMemoizedFn(fn) {
  const fnRef = useRef(fn);

  fnRef.current = fn;

  return useCallback((...args) => fnRef.current(...args), []);
}
```

---

# Storage Hooks

## `useSessionStorage`

```jsx
export function useSessionStorage(key, initial) {
  const [value, setValue] = useState(() => {
    const stored = sessionStorage.getItem(key);

    return stored ? JSON.parse(stored) : initial;
  });

  useEffect(() => {
    sessionStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
}
```

---

# Form Hooks

## `useForm`

```jsx
export function useForm(initialValues) {
  const [values, setValues] = useState(initialValues);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const reset = () => setValues(initialValues);

  return {
    values,
    handleChange,
    reset,
  };
}
```

---

# Media Hooks

## `useMediaQuery`

```jsx
export function useMediaQuery(query) {
  const [matches, setMatches] = useState(window.matchMedia(query).matches);

  useEffect(() => {
    const media = window.matchMedia(query);

    const listener = () => setMatches(media.matches);

    media.addEventListener("change", listener);

    return () => media.removeEventListener("change", listener);
  }, [query]);

  return matches;
}
```

---

# Animation Hooks

## `useRaf`

(requestAnimationFrame)

```jsx
export function useRaf(callback) {
  useEffect(() => {
    let frameId;

    const animate = () => {
      callback();

      frameId = requestAnimationFrame(animate);
    };

    frameId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(frameId);
  }, [callback]);
}
```

---

# Advanced Enterprise Hooks

## `usePermission`

```jsx
const permissions = {
  ADMIN: ["CREATE", "EDIT", "DELETE"],

  USER: ["VIEW"],
};

export function usePermission(role) {
  return (permission) => permissions[role]?.includes(permission);
}
```

---

## `useFeatureFlag`

```jsx
export function useFeatureFlag(feature) {
  const flags = {
    darkMode: true,
    aiSearch: false,
  };

  return flags[feature];
}
```

---

# Hooks Often Asked by Experience Level

### 3–5 Years

```text
✅ useToggle
✅ useDebounce
✅ useThrottle
✅ usePrevious
✅ useLocalStorage
✅ useFetch
```

### 5–8 Years

```text
✅ useInfiniteScroll
✅ useIntersectionObserver
✅ useUndoRedo
✅ useWebSocket
✅ useMediaQuery
✅ useHover
```

### 8–12+ Years (Lead/Architect)

```text
✅ useQuery
✅ useMutation
✅ useOptimisticCache
✅ useSyncExternalStore
✅ useStateMachine
✅ useActorModel
✅ useCommandPattern
✅ useFeatureFlag
✅ usePermission
✅ Offline-first hooks
✅ Event Sourcing hooks
✅ CQRS-style hooks
```

These are the hooks most frequently used in enterprise React applications and commonly discussed in Senior/Lead React interviews.
These are **Architect-Level React Hooks** commonly used in large-scale applications (FinTech, Banking, Healthcare, SaaS, Trading Platforms).

---

# 1. `useFeatureFlag`

Feature Toggles / A-B Testing

```jsx
import { useMemo } from "react";

const flags = {
  darkMode: true,
  aiSearch: false,
  newDashboard: true,
};

export function useFeatureFlag(flagName) {
  return useMemo(() => !!flags[flagName], [flagName]);
}
```

### Usage

```jsx
const isNewDashboard = useFeatureFlag("newDashboard");

return isNewDashboard ? <NewDashboard /> : <LegacyDashboard />;
```

---

# 2. `usePermission`

Role-Based Access Control (RBAC)

```jsx
const permissions = {
  ADMIN: ["CREATE", "EDIT", "DELETE", "VIEW"],

  MANAGER: ["EDIT", "VIEW"],

  USER: ["VIEW"],
};

export function usePermission(role) {
  const can = (permission) => permissions[role]?.includes(permission);

  return { can };
}
```

### Usage

```jsx
const { can } = usePermission("ADMIN");

{
  can("DELETE") && <DeleteButton />;
}
```

---

# 3. `useQuery` (Enterprise Cache)

```jsx
const cache = new Map();

export function useQuery(key, fetcher) {
  const [data, setData] = useState(cache.get(key));

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (cache.has(key)) return;

    async function load() {
      setLoading(true);

      const result = await fetcher();

      cache.set(key, result);

      setData(result);

      setLoading(false);
    }

    load();
  }, [key]);

  return {
    data,
    loading,
  };
}
```

---

# 4. `useMutation`

```jsx
export function useMutation(apiCall) {
  const [loading, setLoading] = useState(false);

  const mutate = async (body) => {
    setLoading(true);

    try {
      return await apiCall(body);
    } finally {
      setLoading(false);
    }
  };

  return {
    mutate,
    loading,
  };
}
```

### Usage

```jsx
const { mutate } = useMutation(createEmployee);

mutate(data);
```

---

# 5. `useOptimisticCache`

React Query style optimistic updates.

```jsx
export function useOptimisticCache(initialData) {
  const [data, setData] = useState(initialData);

  const optimisticUpdate = async (updater, mutation) => {
    const oldData = data;

    const newData = updater(data);

    setData(newData);

    try {
      await mutation();
    } catch {
      setData(oldData);
    }
  };

  return {
    data,
    optimisticUpdate,
  };
}
```

### Usage

```jsx
optimisticUpdate(
  (users) =>
    users.map((user) =>
      user.id === id
        ? {
            ...user,
            active: true,
          }
        : user,
    ),

  () => api.activateUser(id),
);
```

---

# 6. `useSyncExternalStore`

Redux/Zustand Internals

```jsx
import { useSyncExternalStore } from "react";

const store = {
  value: 0,
  listeners: new Set(),

  subscribe(listener) {
    this.listeners.add(listener);

    return () => this.listeners.delete(listener);
  },

  getSnapshot() {
    return this.value;
  },
};

export function useCounterStore() {
  return useSyncExternalStore(
    store.subscribe.bind(store),
    store.getSnapshot.bind(store),
  );
}
```

---

# 7. `useStateMachine`

```jsx
const machine = {
  idle: {
    START: "loading",
  },

  loading: {
    SUCCESS: "success",
    ERROR: "error",
  },

  error: {
    RETRY: "loading",
  },
};

export function useStateMachine() {
  const [state, setState] = useState("idle");

  const send = (event) => {
    const next = machine[state]?.[event];

    if (next) setState(next);
  };

  return {
    state,
    send,
  };
}
```

### Finite State Flow

```text
idle
 ↓
loading
 ↓
success
```

---

# 8. `useActorModel`

Inspired by XState.

```jsx
function reducer(state, event) {
  switch (event.type) {
    case "INCREMENT":
      return {
        count: state.count + 1,
      };

    case "DECREMENT":
      return {
        count: state.count - 1,
      };

    default:
      return state;
  }
}

export function useActorModel() {
  const [state, send] = useReducer(reducer, {
    count: 0,
  });

  return {
    state,
    send,
  };
}
```

### Usage

```jsx
send({
  type: "INCREMENT",
});
```

---

# 9. `useCommandPattern`

Perfect for:

```text
Undo
Redo
Canvas
Workflow
Editor
```

```jsx
export function useCommandPattern() {
  const [history, setHistory] = useState([]);

  const execute = (command) => {
    command.execute();

    setHistory((prev) => [...prev, command]);
  };

  const undo = () => {
    const last = history[history.length - 1];

    last?.undo();

    setHistory((prev) => prev.slice(0, -1));
  };

  return {
    execute,
    undo,
  };
}
```

---

# 10. Offline-First Hook

```jsx
export function useOfflineQueue() {
  const [queue, setQueue] = useState([]);

  const addRequest = (request) => {
    setQueue((prev) => [...prev, request]);
  };

  useEffect(() => {
    async function sync() {
      if (navigator.onLine && queue.length) {
        for (const req of queue) {
          await req();
        }

        setQueue([]);
      }
    }

    window.addEventListener("online", sync);

    return () => window.removeEventListener("online", sync);
  }, [queue]);

  return {
    addRequest,
  };
}
```

---

# 11. Event Sourcing Hook

Instead of storing state, store events.

```jsx
export function useEventSourcing() {
  const [events, setEvents] = useState([]);

  const append = (event) =>
    setEvents((prev) => [
      ...prev,
      {
        ...event,
        timestamp: Date.now(),
      },
    ]);

  return {
    events,
    append,
  };
}
```

### Example Events

```jsx
[
  {
    type: "EMPLOYEE_CREATED",
  },
  {
    type: "EMPLOYEE_UPDATED",
  },
  {
    type: "EMPLOYEE_DELETED",
  },
];
```

---

# 12. CQRS Hook

Separate Reads and Writes.

```jsx
export function useCQRS(queryFn, commandFn) {
  const query = async (params) => queryFn(params);

  const command = async (body) => commandFn(body);

  return {
    query,
    command,
  };
}
```

### Usage

```jsx
const { query, command } = useCQRS(getEmployees, createEmployee);

await query();

await command(data);
```

---

# React Hooks by Architecture Level

### Senior Developer

```text
✅ useDebounce
✅ useThrottle
✅ useFetch
✅ useAsync
✅ useUndoRedo
✅ useWebSocket
✅ useIntersectionObserver
```

### Lead Engineer

```text
✅ useQuery
✅ useMutation
✅ useOptimisticCache
✅ useFeatureFlag
✅ usePermission
✅ useSyncExternalStore
```

### Architect / Staff+

```text
✅ useStateMachine
✅ useActorModel
✅ useCommandPattern
✅ Offline-First Hooks
✅ Event Sourcing Hooks
✅ CQRS Hooks
✅ Distributed State Hooks
✅ Cache Invalidation Hooks
✅ Domain Event Hooks
```

### Senior Interview Question

**State Machine vs Actor Model vs CQRS**

```text
State Machine
→ Controls valid state transitions

Actor Model
→ State + Message passing

CQRS
→ Separate Read and Write models

Event Sourcing
→ Store Events Instead of State

Highest Scalability:

CQRS + Event Sourcing + Actor Model
```

These patterns are typically discussed in Staff Engineer, Frontend Architect, and Principal Engineer interviews when designing large-scale React applications.

# Headless UI Hooks (useTab, useAccordion, useButton, useInput)

These are **behaviour hooks** used in design systems (Material UI, Radix UI, Headless UI, Adobe Spectrum, Atlassian).

---

# 1. useTab

Manages tab navigation logic.

```jsx
import { useState } from "react";

export function useTab(tabs, initialIndex = 0) {
  const [activeIndex, setActiveIndex] = useState(initialIndex);

  const next = () => setActiveIndex((i) => Math.min(tabs.length - 1, i + 1));

  const prev = () => setActiveIndex((i) => Math.max(0, i - 1));

  return {
    activeIndex,
    activeTab: tabs[activeIndex],
    setActiveIndex,
    next,
    prev,
  };
}
```

### Usage

```jsx
const { activeIndex, setActiveIndex } = useTab([
  "Profile",
  "Settings",
  "Billing",
]);
```

---

# 2. useAccordion

Single Accordion

```jsx
import { useState } from "react";

export function useAccordion(initial = false) {
  const [expanded, setExpanded] = useState(initial);

  const toggle = () => setExpanded((v) => !v);

  return {
    expanded,
    toggle,
  };
}
```

### Multiple Accordion

```jsx
export function useAccordionGroup() {
  const [openId, setOpenId] = useState(null);

  const toggle = (id) => {
    setOpenId((current) => (current === id ? null : id));
  };

  return {
    openId,
    toggle,
  };
}
```

---

# 3. useButton

Accessibility + Keyboard Support

```jsx
export function useButton(onClick) {
  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      onClick?.(e);
    }
  };

  return {
    role: "button",
    tabIndex: 0,
    onClick,
    onKeyDown: handleKeyDown,
  };
}
```

### Usage

```jsx
const buttonProps = useButton(() => {
  console.log("clicked");
});

<div {...buttonProps}>Save</div>;
```

---

# 4. useInput

Controlled input abstraction.

```jsx
import { useState } from "react";

export function useInput(initial = "") {
  const [value, setValue] = useState(initial);

  const onChange = (e) => setValue(e.target.value);

  const reset = () => setValue("");

  return {
    value,
    onChange,
    reset,
    setValue,
  };
}
```

---

# 5. useRadioGroup

```jsx
import { useState } from "react";

export function useRadioGroup(initial) {
  const [value, setValue] = useState(initial);

  return {
    value,
    setValue,
    isSelected: (option) => value === option,
  };
}
```

---

# 6. useCheckboxGroup

```jsx
import { useState } from "react";

export function useCheckboxGroup() {
  const [values, setValues] = useState([]);

  const toggle = (item) => {
    setValues((prev) =>
      prev.includes(item) ? prev.filter((x) => x !== item) : [...prev, item],
    );
  };

  return {
    values,
    toggle,
  };
}
```

---

# 7. useDisclosure

Used in:

```text
Modal
Drawer
Popover
Dropdown
Tooltip
```

```jsx
import { useState } from "react";

export function useDisclosure(initial = false) {
  const [isOpen, setOpen] = useState(initial);

  return {
    isOpen,

    open: () => setOpen(true),

    close: () => setOpen(false),

    toggle: () => setOpen((v) => !v),
  };
}
```

---

# 8. useDropdown

```jsx
export function useDropdown() {
  const [open, setOpen] = useState(false);

  return {
    open,
    openMenu: () => setOpen(true),
    closeMenu: () => setOpen(false),
    toggleMenu: () => setOpen((v) => !v),
  };
}
```

---

# 9. useMenu

Keyboard Accessible Menu

```jsx
export function useMenu(items) {
  const [activeIndex, setActiveIndex] = useState(0);

  const moveDown = () =>
    setActiveIndex((i) => Math.min(items.length - 1, i + 1));

  const moveUp = () => setActiveIndex((i) => Math.max(0, i - 1));

  return {
    activeIndex,
    moveUp,
    moveDown,
  };
}
```

---

# 10. useCombobox

Autocomplete / Search Dropdown

```jsx
export function useCombobox(items) {
  const [query, setQuery] = useState("");

  const filtered = items.filter((item) =>
    item.toLowerCase().includes(query.toLowerCase()),
  );

  return {
    query,
    setQuery,
    filtered,
  };
}
```

---

# 11. useFormField

Enterprise Form Hook

```jsx
export function useFormField(initial) {
  const [value, setValue] = useState(initial);

  const [error, setError] = useState("");

  const validate = (validator) => {
    const result = validator(value);

    setError(result);

    return !result;
  };

  return {
    value,
    setValue,
    error,
    validate,
  };
}
```

---

# 12. useStepper

```jsx
export function useStepper(total) {
  const [step, setStep] = useState(1);

  return {
    step,
    next: () => setStep((s) => Math.min(total, s + 1)),
    prev: () => setStep((s) => Math.max(1, s - 1)),
  };
}
```

---

# Enterprise Design System Hooks

### Input System

```text
✅ useInput
✅ useTextarea
✅ useCombobox
✅ useRadioGroup
✅ useCheckboxGroup
✅ useFormField
```

### Navigation System

```text
✅ useTab
✅ useAccordion
✅ useMenu
✅ useDropdown
✅ useStepper
```

### Overlay System

```text
✅ useModal
✅ useDialog
✅ usePopover
✅ useTooltip
✅ useDisclosure
```

### Accessibility Hooks

```text
✅ useButton
✅ useFocusTrap
✅ useKeyboard
✅ useAriaLabel
✅ useFocusVisible
```

---

# Senior React Interview Follow-up

Design systems such as:

```text
Material UI
Radix UI
Headless UI
Adobe Spectrum
Atlassian Design System
```

typically separate:

```text
Behaviour Layer (Hooks)
          ↓
Headless Components
          ↓
Styled Components
```

Example:

```text
useTab()
   ↓
<Tabs />
   ↓
StyledTabs
```

This separation gives maximum reusability, accessibility, testability, and theming flexibility.

# Headless UI + Accessibility Hooks (Production Ready)

These are the hooks typically built inside **Design Systems** like:

```text
✅ Radix UI
✅ Headless UI
✅ Material UI
✅ Adobe Spectrum
✅ Atlassian Design System
✅ Shopify Polaris
```

---

# 1. useTab

Supports:

```text
✅ Active Tab
✅ Arrow Navigation
✅ Home / End Keys
✅ Accessibility
```

```jsx
import { useState } from "react";

export function useTab(totalTabs) {
  const [activeIndex, setActiveIndex] = useState(0);

  const onKeyDown = (e) => {
    switch (e.key) {
      case "ArrowRight":
        setActiveIndex((i) => Math.min(totalTabs - 1, i + 1));
        break;

      case "ArrowLeft":
        setActiveIndex((i) => Math.max(0, i - 1));
        break;

      case "Home":
        setActiveIndex(0);
        break;

      case "End":
        setActiveIndex(totalTabs - 1);
        break;
    }
  };

  return {
    activeIndex,
    setActiveIndex,
    onKeyDown,
  };
}
```

---

# 2. useAccordion

Single Expand

```jsx
import { useState } from "react";

export function useAccordion() {
  const [expanded, setExpanded] = useState(false);

  return {
    expanded,
    toggle: () => setExpanded((v) => !v),
  };
}
```

---

# Multi Accordion

```jsx
export function useAccordionGroup() {
  const [openIds, setOpenIds] = useState([]);

  const toggle = (id) => {
    setOpenIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  return {
    openIds,
    toggle,
  };
}
```

---

# 3. useMenu

Accessible menu navigation.

```jsx
import { useState } from "react";

export function useMenu(items) {
  const [active, setActive] = useState(0);

  const onKeyDown = (e) => {
    switch (e.key) {
      case "ArrowDown":
        setActive((index) => Math.min(items.length - 1, index + 1));
        break;

      case "ArrowUp":
        setActive((index) => Math.max(0, index - 1));
        break;
    }
  };

  return {
    active,
    onKeyDown,
  };
}
```

---

# 4. useDropdown

```jsx
import { useState } from "react";

export function useDropdown() {
  const [open, setOpen] = useState(false);

  return {
    open,
    openMenu: () => setOpen(true),
    closeMenu: () => setOpen(false),
    toggleMenu: () => setOpen((v) => !v),
  };
}
```

---

# 5. useStepper

```jsx
import { useState } from "react";

export function useStepper(total) {
  const [step, setStep] = useState(1);

  return {
    step,

    next: () => setStep((current) => Math.min(total, current + 1)),

    prev: () => setStep((current) => Math.max(1, current - 1)),

    reset: () => setStep(1),
  };
}
```

---

# 6. useDisclosure

Foundation Hook

Used for:

```text
Modal
Popover
Tooltip
Drawer
Dropdown
Accordion
```

```jsx
import { useState } from "react";

export function useDisclosure(initial = false) {
  const [isOpen, setOpen] = useState(initial);

  return {
    isOpen,

    open: () => setOpen(true),

    close: () => setOpen(false),

    toggle: () => setOpen((v) => !v),
  };
}
```

---

# 7. useModal

```jsx
export function useModal() {
  const { isOpen, open, close } = useDisclosure();

  return {
    isOpen,
    open,
    close,
  };
}
```

---

# 8. useDialog

Adds accessibility.

```jsx
export function useDialog() {
  return {
    role: "dialog",
    "aria-modal": true,
  };
}
```

---

# 9. usePopover

```jsx
export function usePopover() {
  const { isOpen, open, close, toggle } = useDisclosure();

  return {
    isOpen,
    open,
    close,
    toggle,
  };
}
```

---

# 10. useTooltip

```jsx
import { useState } from "react";

export function useTooltip() {
  const [visible, setVisible] = useState(false);

  return {
    visible,

    show: () => setVisible(true),

    hide: () => setVisible(false),
  };
}
```

---

# 11. useButton

Accessibility-friendly button.

```jsx
export function useButton(onClick) {
  const onKeyDown = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      onClick?.();
    }
  };

  return {
    role: "button",
    tabIndex: 0,
    onClick,
    onKeyDown,
  };
}
```

---

# 12. useFocusTrap

Modal Accessibility.

```jsx
import { useEffect } from "react";

export function useFocusTrap(ref) {
  useEffect(() => {
    const container = ref.current;

    if (!container) return;

    const elements = container.querySelectorAll("button,input,a[href]");

    const first = elements[0];

    const last = elements[elements.length - 1];

    const handleTab = (e) => {
      if (e.key !== "Tab") return;

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      }

      if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleTab);

    return () => document.removeEventListener("keydown", handleTab);
  }, [ref]);
}
```

---

# 13. useKeyboard

Global Keyboard Shortcuts

```jsx
import { useEffect } from "react";

export function useKeyboard(key, callback) {
  useEffect(() => {
    const handler = (e) => {
      if (e.key === key) {
        callback(e);
      }
    };

    window.addEventListener("keydown", handler);

    return () => window.removeEventListener("keydown", handler);
  }, [key, callback]);
}
```

### Usage

```jsx
useKeyboard("Escape", closeModal);
```

---

# 14. useAriaLabel

```jsx
export function useAriaLabel(label) {
  return {
    "aria-label": label,
  };
}
```

---

# 15. useFocusVisible

Show focus ring only for keyboard users.

```jsx
import { useEffect, useState } from "react";

export function useFocusVisible() {
  const [keyboardMode, setKeyboardMode] = useState(false);

  useEffect(() => {
    const keyboard = () => setKeyboardMode(true);

    const mouse = () => setKeyboardMode(false);

    window.addEventListener("keydown", keyboard);

    window.addEventListener("mousedown", mouse);

    return () => {
      window.removeEventListener("keydown", keyboard);

      window.removeEventListener("mousedown", mouse);
    };
  }, []);

  return keyboardMode;
}
```

---

# Design System Architecture

```text
Accessible Hooks
        ↓

useButton
useTab
useAccordion
useMenu
useDialog
useTooltip

        ↓

Headless Components

<Tabs />
<Accordion />
<Menu />
<Dialog />

        ↓

Styled Components

Material UI
Tailwind
Emotion
Styled Components
```

---

# Hooks Commonly Asked in Senior React Interviews

### Component Behaviour

```text
✅ useTab
✅ useAccordion
✅ useDropdown
✅ useMenu
✅ useStepper
```

### Overlay System

```text
✅ useModal
✅ useDialog
✅ usePopover
✅ useTooltip
✅ useDisclosure
```

### Accessibility

```text
✅ useButton
✅ useFocusTrap
✅ useKeyboard
✅ useAriaLabel
✅ useFocusVisible
```

### Staff / Architect Level

```text
✅ useRovingTabIndex
✅ useTypeAheadSearch
✅ useCompositeNavigation
✅ useTreeView
✅ useCommandPalette
✅ useHotkeys
✅ useAccessibleGrid
✅ useDragAndDrop
```

These are the hooks that form the foundation of enterprise-grade, accessible component libraries.

These are **Staff/Principal Engineer level accessibility hooks** used in building components like:

```text
VS Code Explorer
Command Palette
Tree View
Data Grid
Dropdown Menu
File Explorer
IDE Navigation
Keyboard Accessible Menus
```

---

# 1. useRovingTabIndex

Only one item in a list should have:

```text
tabIndex=0
```

Others:

```text
tabIndex=-1
```

Used in:

```text
Tabs
Menu
Radio Group
Toolbar
```

## Hook

```jsx
import { useState } from "react";

export function useRovingTabIndex(count) {
  const [activeIndex, setActiveIndex] = useState(0);

  const getItemProps = (index) => ({
    tabIndex: index === activeIndex ? 0 : -1,

    onKeyDown: (e) => {
      switch (e.key) {
        case "ArrowRight":
        case "ArrowDown":
          setActiveIndex((i) => Math.min(count - 1, i + 1));
          break;

        case "ArrowLeft":
        case "ArrowUp":
          setActiveIndex((i) => Math.max(0, i - 1));
          break;
      }
    },
  });

  return {
    activeIndex,
    getItemProps,
  };
}
```

---

# 2. useTypeAheadSearch

Used in:

```text
Dropdown
Select
Menu
Combobox
```

Example

```text
A
↓
Apple highlighted

B
↓
Banana highlighted
```

## Hook

```jsx
import { useEffect, useState } from "react";

export function useTypeAheadSearch(items) {
  const [query, setQuery] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setQuery("");
    }, 500);

    return () => clearTimeout(timer);
  }, [query]);

  const search = (key) => {
    const nextQuery = query + key;

    setQuery(nextQuery);

    return items.findIndex((item) =>
      item.toLowerCase().startsWith(nextQuery.toLowerCase()),
    );
  };

  return { search };
}
```

---

# 3. useCompositeNavigation

For:

```text
Toolbar
Spreadsheet
Grid
Menu
```

Supports both:

```text
Horizontal
Vertical
```

## Hook

```jsx
import { useState } from "react";

export function useCompositeNavigation(rows, cols) {
  const [position, setPosition] = useState({
    row: 0,
    col: 0,
  });

  const onKeyDown = (e) => {
    setPosition((pos) => {
      switch (e.key) {
        case "ArrowRight":
          return {
            ...pos,
            col: Math.min(cols - 1, pos.col + 1),
          };

        case "ArrowLeft":
          return {
            ...pos,
            col: Math.max(0, pos.col - 1),
          };

        case "ArrowDown":
          return {
            ...pos,
            row: Math.min(rows - 1, pos.row + 1),
          };

        case "ArrowUp":
          return {
            ...pos,
            row: Math.max(0, pos.row - 1),
          };

        default:
          return pos;
      }
    });
  };

  return {
    position,
    onKeyDown,
  };
}
```

---

# 4. useTreeView

Used by:

```text
VSCode Explorer
File Tree
Folders
Categories
```

## Hook

```jsx
import { useState } from "react";

export function useTreeView() {
  const [expanded, setExpanded] = useState(new Set());

  const toggle = (id) => {
    setExpanded((prev) => {
      const next = new Set(prev);

      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }

      return next;
    });
  };

  return {
    expanded,
    toggle,
  };
}
```

---

# 5. useCommandPalette

Used by:

```text
VS Code
Cursor
ChatGPT Desktop
Notion
Slack
```

## Hook

```jsx
import { useState } from "react";

export function useCommandPalette(commands) {
  const [query, setQuery] = useState("");

  const filtered = commands.filter((command) =>
    command.label.toLowerCase().includes(query.toLowerCase()),
  );

  return {
    query,
    setQuery,
    filtered,
  };
}
```

### Example

```text
Input:
"open"

Results:
Open File
Open Folder
Open Settings
```

---

# 6. useHotkeys

Used by:

```text
VS Code
Photoshop
Figma
```

## Hook

```jsx
import { useEffect } from "react";

export function useHotkeys(shortcut, callback) {
  useEffect(() => {
    const handler = (e) => {
      const ctrl = shortcut.includes("Ctrl");

      const key = shortcut.split("+").pop();

      if (ctrl && e.ctrlKey && e.key.toLowerCase() === key.toLowerCase()) {
        e.preventDefault();
        callback();
      }
    };

    window.addEventListener("keydown", handler);

    return () => window.removeEventListener("keydown", handler);
  }, [shortcut, callback]);
}
```

### Usage

```jsx
useHotkeys("Ctrl+K", openPalette);

useHotkeys("Ctrl+S", saveDocument);
```

---

# 7. useAccessibleGrid

Used by:

```text
Spreadsheet
Editable Grid
Excel Clone
```

## Hook

```jsx
export function useAccessibleGrid(rows, cols) {
  const [cell, setCell] = useState({
    row: 0,
    col: 0,
  });

  const move = (e) => {
    switch (e.key) {
      case "ArrowDown":
        setCell((c) => ({
          ...c,
          row: Math.min(rows - 1, c.row + 1),
        }));
        break;

      case "ArrowUp":
        setCell((c) => ({
          ...c,
          row: Math.max(0, c.row - 1),
        }));
        break;
    }
  };

  return {
    cell,
    move,
  };
}
```

---

# 8. useDragAndDrop

Used by:

```text
Kanban Board
Trello
Jira
Task Management
```

## Hook

```jsx
import { useState } from "react";

export function useDragAndDrop() {
  const [dragged, setDragged] = useState(null);

  const onDragStart = (item) => setDragged(item);

  const onDrop = (target, callback) => {
    callback(dragged, target);

    setDragged(null);
  };

  return {
    dragged,
    onDragStart,
    onDrop,
  };
}
```

---

# Real Products Using These Patterns

| Hook                   | Real Product     |
| ---------------------- | ---------------- |
| useRovingTabIndex      | Tabs, Toolbars   |
| useTypeAheadSearch     | Select, Dropdown |
| useCompositeNavigation | Menus, Toolbars  |
| useTreeView            | VS Code Explorer |
| useCommandPalette      | VS Code, Cursor  |
| useHotkeys             | Figma, Photoshop |
| useAccessibleGrid      | Excel, Airtable  |
| useDragAndDrop         | Jira, Trello     |

---

# Staff Engineer Interview Follow-up

A complete design-system accessibility layer usually contains:

```text
✅ useRovingTabIndex
✅ useCompositeNavigation
✅ useFocusTrap
✅ useTreeView
✅ useCommandPalette
✅ useTypeAheadSearch
✅ useHotkeys
✅ useDragAndDrop

Built on top of:

✅ useSyncExternalStore
✅ State Machines
✅ Actor Models
✅ Command Pattern
✅ Accessibility APIs
✅ ARIA Standards
```

These hooks are the foundation of enterprise-grade component libraries and highly interactive applications.
