Managing shared state across micro-frontends (MFEs) requires a strict boundary: **micro-frontends should be as autonomous and isolated as possible.** Sharing too much state creates a "distributed frontend monolith" where changes in one app break another.

Only share **truly global state** (e.g., authentication session, user profile, active localization/theme, cross-app notifications, or a shopping cart summary). Keep domain-specific state strictly internal to each MFE.

---

### Core Communication & State Patterns

| Pattern                                                 | Best Used For                                              | Framework Agnostic? | Persistence / Replay?    | Coupling Level     |
| ------------------------------------------------------- | ---------------------------------------------------------- | ------------------- | ------------------------ | ------------------ |
| **URL Parameters / Query Strings**                      | Routing, filters, IDs, navigation context                  | Yes                 | Yes (bookmarkable)       | **Lowest (Ideal)** |
| **Custom DOM Events / EventTarget**                     | Event-driven notifications, actions (e.g., "cart updated") | Yes                 | No                       | **Low**            |
| **Browser Storage (`StorageEvent` / IndexedDB)**        | Cross-tab session sync, persistent cart, tokens            | Yes                 | Yes                      | **Low**            |
| **Module Federation Shared Store (RxJS / Nano Stores)** | Reactive, high-frequency state updates (Theme, Auth user)  | Yes                 | Yes (holds latest value) | **Medium**         |
| **Shell / App Container Props**                         | Top-down passing from container shell to child MFEs        | Depends on runtime  | Controlled by shell      | **Medium**         |

---

### 1. The URL: The Primary Source of Truth (Zero Coupling)

Before creating shared state stores, evaluate if the state belongs in the URL (path params, search queries, or hashes):

* E.g., `?tenantId=123&productId=456&theme=dark`
* **Why:** Every framework (React, Vue, Angular, Svelte) knows how to read and observe URL changes without shared dependencies, and it guarantees deep linking and page refresh resilience.

---

### 2. Custom DOM Events / Event Bus (Decoupled & Framework-Agnostic)

Use the browser's native `CustomEvent` and `window.dispatchEvent` for action-based notifications where MFE A notifies the system, and any interested MFE reacts.

```typescript
// Shared Types / Contract (shared via npm package or contract repo)
export interface CartUpdatedEvent {
  itemCount: number;
  total: number;
}

// MFE 1 (Product Page - React/Vue/Vanilla): Dispatching an event
export function publishCartUpdate(cart: CartUpdatedEvent) {
  window.dispatchEvent(
    new CustomEvent<CartUpdatedEvent>('app:cart-updated', {
      detail: cart,
      bubbles: true,
    })
  );
}

// MFE 2 (Header / Navigation Bar): Subscribing to the event
export function subscribeToCart(callback: (data: CartUpdatedEvent) => void) {
  const handler = (e: Event) => {
    const customEvent = e as CustomEvent<CartUpdatedEvent>;
    callback(customEvent.detail);
  };

  window.addEventListener('app:cart-updated', handler);
  return () => window.removeEventListener('app:cart-updated', handler);
}

```

* **Limitation:** Native custom events do not retain current values (late-loading MFEs miss events fired in the past).

---

### 3. Lightweight Shared Observable Stores (Nano Stores / RxJS BehaviorSubject)

When late-joining MFEs must immediately read the **current state** upon mounting (e.g., Auth status, User profile), a framework-agnostic micro-store like **Nano Stores** (~1 KB) or **RxJS `BehaviorSubject**` works well.

#### Implementation with Module Federation & Nano Stores

1. Create a lightweight shared module (`@my-org/shared-state`):

```typescript
// shared-state/index.ts
import { atom } from 'nanostores';

export interface UserSession {
  id: string;
  name: string;
  token: string | null;
  isAuthenticated: boolean;
}

// Holds current value and notifies subscribers on update
export const $userSession = atom<UserSession>({
  id: '',
  name: 'Anonymous',
  token: null,
  isAuthenticated: false,
});

export function setSession(user: UserSession) {
  $userSession.set(user);
}

```

1. Expose and share it as a singleton in **Webpack / Vite Module Federation**:

```javascript
// vite.config.js or webpack.config.js in both Host & Remotes
shared: {
  '@my-org/shared-state': {
    singleton: true,
    strictVersion: false,
  }
}

```

1. Consume in React, Vue, or Svelte via native adapters:

```tsx
// Inside React Remote MFE
import { useStore } from '@nanostores/react';
import { $userSession } from '@my-org/shared-state';

export function UserBadge() {
  const user = useStore($userSession);

  if (!user.isAuthenticated) return <button>Sign In</button>;
  return <span>Welcome, {user.name}</span>;
}

```

---

### 4. Cross-Tab & Cross-Origin Synchronization (`BroadcastChannel` / `StorageEvent`)

If micro-frontends run under different origins or if you want multi-tab synchronization (e.g., logging out in Tab 1 immediately logs out Tab 2):

```typescript
// BroadcastChannel API: Fast, direct cross-MFE and cross-tab bus
const authChannel = new BroadcastChannel('auth_channel');

// MFE Logout Action
export function broadcastLogout() {
  authChannel.postMessage({ type: 'LOGOUT' });
}

// Any MFE Listener
authChannel.onmessage = (event) => {
  if (event.data.type === 'LOGOUT') {
    // Clear local cache & redirect to login
    window.location.reload();
  }
};

```

---

### Architectural Rules for Micro-Frontend State

1. **Avoid Shared Redux / Pinia / Global Monolith Stores:** Sharing a single Redux store across remotes tightly couples their release lifecycles and creates strict framework lock-in.
2. **Strict Versioned Contracts:** Treat shared events and payloads like backend API contracts. Use TypeScript interfaces or JSON schema validation (e.g., Zod) so updates do not silently break sibling MFEs.
3. **Prefer Push/Pull Architecture:** If MFE A needs complex data from MFE B, MFE A should receive an identifier via URL/Event and fetch its own data from the backend/BFF rather than passing massive JSON blobs across JavaScript boundaries.
