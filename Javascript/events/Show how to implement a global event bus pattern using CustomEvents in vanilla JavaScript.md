In vanilla JavaScript, you can implement a global **Event Bus** without external libraries by wrapping the native `EventTarget` interface or using a decoupled DOM node (like `window` or `document`).

Using the native **`EventTarget`** object is the cleanest modern approach because it natively supports `addEventListener`, `removeEventListener`, and `dispatchEvent` with standard `CustomEvent` objects without polluting the DOM.

---

### Implementation: Modern `EventTarget` Event Bus

```javascript
class EventBus {
  constructor() {
    // EventTarget provides native event handling without attached DOM nodes
    this.bus = new EventTarget();
  }

  /**
   * Subscribe to a custom event
   * @param {string} eventName 
   * @param {Function} callback 
   * @returns {Function} Unsubscribe function
   */
  on(eventName, callback) {
    // Wrapper to extract event.detail automatically
    const handler = (event) => callback(event.detail);
    
    this.bus.addEventListener(eventName, handler);

    // Return a cleanup function for easy unbinding
    return () => this.off(eventName, handler);
  }

  /**
   * Subscribe to an event ONCE (auto-unsubscribes after first trigger)
   * @param {string} eventName 
   * @param {Function} callback 
   */
  once(eventName, callback) {
    const handler = (event) => callback(event.detail);
    this.bus.addEventListener(eventName, handler, { once: true });
  }

  /**
   * Unsubscribe a specific listener from an event
   * @param {string} eventName 
   * @param {Function} handler 
   */
  off(eventName, handler) {
    this.bus.removeEventListener(eventName, handler);
  }

  /**
   * Publish/Dispatch a custom event with a payload
   * @param {string} eventName 
   * @param {any} payload 
   */
  emit(eventName, payload) {
    const event = new CustomEvent(eventName, {
      detail: payload
    });
    this.bus.dispatchEvent(event);
  }
}

// Export a single global instance (Singleton)
export const globalBus = new EventBus();

```

---

### Usage Example Across Components

#### Component A: Listening for Events

```javascript
import { globalBus } from './EventBus.js';

// Subscribe to 'user:login'
const unsubscribe = globalBus.on('user:login', (userData) => {
  console.log(`Welcome back, ${userData.username}! (ID: ${userData.id})`);
});

// Subscribe to a one-time notification
globalBus.once('system:ready', (data) => {
  console.log('System initialized:', data.timestamp);
});

// Clean up listener when no longer needed
// unsubscribe();

```

#### Component B: Emitting Events

```javascript
import { globalBus } from './EventBus.js';

function handleUserLogin() {
  // Simulate authentication success
  const user = { id: 42, username: 'SarahConnor', role: 'Admin' };

  // Dispatch global custom event with data payload
  globalBus.emit('user:login', user);
}

// Trigger initialization
globalBus.emit('system:ready', { timestamp: Date.now() });
handleUserLogin();

```

---

### Key Advantages of using `EventTarget` + `CustomEvent`

1. **Native Memory Management:** Leverages browser engine optimizations for listener binding and cleanup.
2. **Zero Dependencies:** No external event emitter libraries needed.
3. **Decoupled Components:** Components do not need direct references to each other—they only need access to the `globalBus` instance.
4. **Clean Abstraction:** Encapsulating `CustomEvent` creation and `event.detail` extraction keeps application code concise (`bus.emit('event', payload)` vs manually instantiating `new CustomEvent`).
