In a React application—including Micro-Frontend (MFE) architectures—**sharing data and triggering actions** across components or isolated apps requires picking the right communication pattern based on how closely coupled the components are.

Here are the primary strategies for sharing data and triggering actions in React, ranging from simple component trees to decoupled Micro-Frontends.

---

## 1. Summary Matrix

| Level / Boundary            | Data Sharing Mechanism                         | Action / Event Trigger Mechanism             | Best For                              |
| --------------------------- | ---------------------------------------------- | -------------------------------------------- | ------------------------------------- |
| **Parent ↔ Child**          | Props                                          | Callback Functions                           | Direct parent-child component trees   |
| **Within a Single App**     | React Context / Redux Toolkit                  | Dispatching Redux Actions / Context Handlers | Global UI state (theme, user auth)    |
| **Between Micro-Frontends** | Custom Browser Events (`window.dispatchEvent`) | Event Listener Callbacks                     | Isolated, framework-agnostic MFEs     |
| **MFE State Sync**          | Shared RxJS Observable Stores                  | Subscribing to Store Streams                 | Complex cross-MFE data streams        |
| **URL / Routing**           | Query Parameters (`?search=term`)              | React Router Navigation (`navigate()`)       | Shareable states, filters, pagination |

---

## 2. Option A: Custom Browser Events (Best for Micro-Frontends)

When two Micro-Frontends (e.g., a **Header MFE** and a **Cart MFE**) run in the same browser window but are built and deployed independently, they should not share direct React state. Instead, use native **Custom DOM Events** to keep them loosely coupled.

### Step 1: Dispatch an Action (from Header MFE)

```typescript
// Inside Header MFE: Trigger an action when user adds an item
export const emitAddToCart = (item: { id: string; name: string }) => {
  const event = new CustomEvent('app:cart:add', {
    detail: item,
  });
  window.dispatchEvent(event);
};

```

### Step 2: Listen & Update Data (in Cart MFE)

```tsx
// Inside Cart MFE: Listen for the custom event
import { useEffect, useState } from 'react';

export function CartWidget() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const handleAddToCart = (event: Event) => {
      const customEvent = event as CustomEvent;
      setItems((prev) => [...prev, customEvent.detail]);
    };

    // Subscribe to event
    window.addEventListener('app:cart:add', handleAddToCart);

    // Cleanup listener on unmount
    return () => window.removeEventListener('app:cart:add', handleAddToCart);
  }, []);

  return <div>Cart Items: {items.length}</div>;
}

```

---

## 3. Option B: Shared RxJS Event Bus / Store (For Complex MFEs)

If your Micro-Frontends need to share continuous data streams or state updates (like real-time notification feeds), create a lightweight shared event bus library using **RxJS**.

### Shared Event Bus (`packages/event-bus/index.ts`)

```typescript
import { Subject } from 'rxjs';

export interface AppAction {
  type: string;
  payload?: any;
}

// Single event stream instance shared via Module Federation
const eventBus$ = new Subject<AppAction>();

export const dispatchAction = (action: AppAction) => {
  eventBus$.next(action);
};

export const subscribeToAction = (
  actionType: string,
  callback: (payload: any) => void
) => {
  return eventBus$.subscribe((action) => {
    if (action.type === actionType) {
      callback(action.payload);
    }
  });
};

```

---

## 4. Option C: React Context (Within a Single App or Host Shell)

For components within the same React application tree, **React Context** is the cleanest way to expose shared state and action handlers together.

```tsx
import React, { createContext, useContext, useState } from 'react';

interface AuthContextType {
  user: { name: string } | null;
  login: (name: string) => void;  // Shared Action
  logout: () => void;             // Shared Action
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<{ name: string } | null>(null);

  const login = (name: string) => setUser({ name });
  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

```

---

## 5. Option D: URL Query Parameters & State

For data that should persist across page reloads or be shareable via a link (like filter settings, search queries, or active tabs), use the URL as the single source of truth.

```tsx
import { useSearchParams } from 'react-router-dom';

export function SearchFilter() {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentQuery = searchParams.get('q') || '';

  // Trigger Action: Update URL parameter
  const handleSearchChange = (newQuery: string) => {
    setSearchParams({ q: newQuery });
  };

  return (
    <input
      value={currentQuery}
      onChange={(e) => handleSearchChange(e.target.value)}
      placeholder="Search..."
    />
  );
}

```
