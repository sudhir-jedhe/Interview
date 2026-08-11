How do Micro Frontends share data?

Micro Frontends aim to remain as decoupled as possible, but some level of state sharing is inevitable (like user authentication, shopping cart counts, or theme preferences).

Because micro frontends often operate within the same browser window, they share data using established web APIs and architectural patterns rather than traditional backend network calls.

---

## Core Data Sharing Patterns

Here is a breakdown of the standard communication methods, ranked from the most decoupled to the most integrated:

### 1. Custom DOM Events (Pub/Sub)

This is the most standard approach because it is framework-agnostic. Micro frontends can emit and listen to custom events on the global `window` object without needing to know anything about the sender or receiver.

* **Best for:** Cross-framework communication (e.g., a Vue app talking to a React app).
* **How it works:**

```javascript
// App A (Publisher)
const event = new CustomEvent('theme:changed', { detail: { mode: 'dark' } });
window.dispatchEvent(event);

// App B (Subscriber)
window.addEventListener('theme:changed', (e) => {
  console.log('Theme is now:', e.detail.mode);
});

```

### 2. The URL (Query Parameters & Path)

The URL is the ultimate, universally accessible state manager in the browser. Any micro frontend on the page can read or update the URL.

* **Best for:** Deep-linking, search queries, and route-driven state (e.g., active tabs, pagination).
* **How it works:** App A pushes `?filters=active` to the URL. App B uses native browser APIs or a router to detect the change and re-render.

### 3. Web Storage (LocalStorage & SessionStorage)

Because all micro frontends on a page share the same domain origin, they share the same web storage.

* **Best for:** Persistent, non-sensitive global state like UI preferences, cached feature flags, or session IDs.
* **How it works:** You can write to `localStorage` and optionally listen for the native `storage` event to react to changes.

```javascript
// Read/Write
localStorage.setItem('cartCount', 5);

// Listen across apps
window.addEventListener('storage', (event) => {
  if (event.key === 'cartCount') updateCart(event.newValue);
});

```

### 4. Global State/Module Federation

If your micro frontends share the same ecosystem (e.g., all React apps stitched together using Webpack Module Federation), you can expose a shared state store directly.

* **Best for:** Highly integrated architectures where teams agree on specific tooling (e.g., sharing a Redux store or a Zustand hook).
* **How it works:** A "host" shell application initializes the store and injects it into "remote" micro frontends at runtime.

### 5. Props and Callbacks (Component Wrapping)

If your micro frontends are orchestrated via a shell application that mounts them as components (such as single-spa or standard React composition), data can be passed straight down.

* **Best for:** Strict parent-to-child communication.
* **How it works:** The host application fetches the data (like user profiles) and passes it into the micro frontend upon initialization as a configuration object or prop.

---

### The Golden Rule of Micro Frontend Data

**Share as little as possible.** The more data micro frontends share, the more tightly coupled they become, defeating the purpose of independent deployments. If two micro frontends constantly need to share complex data, they might actually belong in the same application.
