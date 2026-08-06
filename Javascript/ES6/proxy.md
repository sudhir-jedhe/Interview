In JavaScript, **Metaprogramming** refers to writing code that inspects, intercepts, or modifies the behavior of other code at runtime.

ES6 introduced two complementary built-in features that serve as the modern foundation for metaprogramming:

* **`Proxy`**: Intercepts low-level object operations (like property reading, writing, function invocation, or deleting keys).
* **`Reflect`**: Provides standard, clean methods to forward those operations to the original target object default behavior.

Together, **Proxies trap operations**, while **Reflect forwards them cleanly**.

---

## 1. The Relationship Between Proxy and Reflect

Every trap available on a `Proxy` handler object (e.g., `get`, `set`, `deleteProperty`, `has`, `apply`) has an **identical 1-to-1 matching method** on the `Reflect` object with the exact same signature and parameters.

```
       User Action (e.g. proxy.name = "Alice")
                        │
                        ▼
┌───────────────────────────────────────────────┐
│              1. PROXY TRAP                    │
│   set(target, prop, value, receiver) {        │
│      // 1. Perform custom logic (validation,  │
│      //    logging, side effects)             │
│                                               │
│      // 2. Forward default action via Reflect │
│      return Reflect.set(...arguments);        │
│   }                                           │
└───────────────────────┬───────────────────────┘
                        │
                        ▼
┌───────────────────────────────────────────────┐
│             2. TARGET OBJECT                  │
│          { name: "Alice" }                    │
└───────────────────────────────────────────────┘

```

---

## 2. Why Use `Reflect` Inside a Proxy? (Why not target[prop]?)

It is a common temptation to bypass `Reflect` inside a Proxy trap and perform operations manually (e.g., `target[prop] = value`). However, using `Reflect` inside Proxy traps avoids subtle bugs regarding **prototype inheritance**, **getters/setters**, and **`this` binding**.

### Problem: Correct `this` Binding with Inheritance (`receiver`)

When an object inherits from a Proxy via its prototype chain, using `target[prop]` breaks the correct `this` reference inside getters. Pass `receiver` to `Reflect.get()` to preserve the correct context:

```javascript
const parentTarget = {
  _name: 'Parent',
  get name() {
    return this._name; // 'this' must refer to whatever object triggered the read!
  }
};

const proxyParent = new Proxy(parentTarget, {
  get(target, prop, receiver) {
    // ❌ BAD WAY: Using target[prop] loses the calling child context ('this' becomes parentTarget)
    // return target[prop];

    // ✅ CORRECT WAY: Passing 'receiver' preserves 'this' binding to the calling child instance
    return Reflect.get(target, prop, receiver);
  }
});

const childObj = {
  __proto__: proxyParent,
  _name: 'Child'
};

console.log(childObj.name); // Output: "Child" (Reflect correctly binds 'this' to childObj!)

```

---

## 3. Practical Metaprogramming Patterns

### Pattern A: Schema Validation & Type-Checking

You can trap `set` operations to enforce schema constraints before allowing writes to a database model or state store:

```javascript
function createValidatedUser(initialData) {
  const validator = {
    set(target, prop, value, receiver) {
      if (prop === 'age') {
        if (typeof value !== 'number' || value < 0) {
          throw new TypeError('Age must be a positive number');
        }
      }
      
      if (prop === 'email') {
        if (!value.includes('@')) {
          throw new Error('Invalid email address format');
        }
      }

      console.log(`Setting ${prop} to ${value}`);
      // Forward the mutation to the target object cleanly
      return Reflect.set(target, prop, value, receiver);
    }
  };

  return new Proxy(initialData, validator);
}

const user = createValidatedUser({ name: 'Alice', age: 25 });

user.age = 26; // Logs: "Setting age to 26"
// user.age = -5;  // ❌ Throws TypeError: Age must be a positive number
// user.email = "bad"; // ❌ Throws Error: Invalid email address format

```

---

### Pattern B: Reactive State Management (Observer Pattern)

Frameworks like Vue 3 use Proxies and Reflect under the hood to detect state mutations and trigger auto-rendering UI updates:

```javascript
function createReactiveState(data, onChange) {
  return new Proxy(data, {
    get(target, prop, receiver) {
      // Track read dependency if needed
      return Reflect.get(target, prop, receiver);
    },
    set(target, prop, value, receiver) {
      const oldValue = Reflect.get(target, prop, receiver);
      const success = Reflect.set(target, prop, value, receiver);

      if (success && oldValue !== value) {
        onChange(prop, value); // Trigger UI update callback!
      }

      return success;
    }
  });
}

const state = createReactiveState({ count: 0 }, (key, val) => {
  console.log(`[Re-render] State changed: ${key} = ${val}`);
});

state.count = 1; // Logs: "[Re-render] State changed: count = 1"
state.count = 2; // Logs: "[Re-render] State changed: count = 2"

```

---

### Pattern C: Negative Array Indexing (Python-Style)

You can trap `get` on an array to support negative indices (e.g., `arr[-1]` to read the last element):

```javascript
function createPythonArray(...items) {
  return new Proxy(items, {
    get(target, prop, receiver) {
      const index = Number(prop);

      // Handle negative array indexing:
      if (Number.isInteger(index) && index < 0) {
        prop = String(target.length + index);
      }

      return Reflect.get(target, prop, receiver);
    }
  });
}

const arr = createPythonArray('a', 'b', 'c', 'd');

console.log(arr[0]);  // "a"
console.log(arr[-1]); // "d" (Last element!)
console.log(arr[-2]); // "c"

```

---

## 4. Key Reflection Traps Reference

| Trap Name            | Intercepted Operation                 | Corresponding Reflect Signature              |
| -------------------- | ------------------------------------- | -------------------------------------------- |
| **`get`**            | Reading a property (`obj.prop`)       | `Reflect.get(target, prop, receiver)`        |
| **`set`**            | Writing a property (`obj.prop = val`) | `Reflect.set(target, prop, val, receiver)`   |
| **`has`**            | `in` operator (`'key' in obj`)        | `Reflect.has(target, prop)`                  |
| **`deleteProperty`** | `delete obj.prop`                     | `Reflect.deleteProperty(target, prop)`       |
| **`apply`**          | Function call (`fn(...args)`)         | `Reflect.apply(target, thisArg, args)`       |
| **`construct`**      | `new Fn(...args)`                     | `Reflect.construct(target, args, newTarget)` |
| **`ownKeys`**        | `Object.keys()`, `Reflect.ownKeys()`  | `Reflect.ownKeys(target)`                    |

---

## Summary Best Practices

1. **Always mirror traps with Reflect:** When building a Proxy handler, use `Reflect[methodName](...arguments)` to perform the default action safely.
2. **Always pass `receiver`:** Always pass the `receiver` parameter into `Reflect.get()` and `Reflect.set()` to guarantee correct `this` context across inheritance prototype chains.
3. **Return booleans from mutations:** Traps like `set` and `deleteProperty` expect a boolean return value indicating success (`true`) or failure (`false`). `Reflect.set()` and `Reflect.deleteProperty()` natively return these boolean flags for you.

Show how to implement a deep reactive Proxy system that handles nested object mutations in JavaScript.

Building a deep reactive system requires solving a fundamental limitation of JavaScript `Proxy` objects: **a `Proxy` only intercepts operations on the object it is directly wrapping**. If an object contains nested objects (e.g., `state.user.profile.name = "Alice"`), accessing or mutating nested properties bypasses the top-level proxy unless those nested objects are wrapped in proxies as well.

To handle nested object mutations reactively, the system must **lazily wrap child objects in proxies upon access (`get`)** and track mutations (`set` / `deleteProperty`).

---

### 1. The Core Architecture

1. **Lazy Proxy Wrapping:** Wrapping every nested object upfront when the state is initialized is slow and wastes memory. Instead, wrap nested objects on-demand when they are accessed via the `get` trap.
2. **WeakMap Cache:** Keep track of already-proxied objects using a `WeakMap`. This prevents creating duplicate proxy wrappers for the same underlying target and maintains object identity (`state.user === state.user`).
3. **Mutation Interception (`set` / `deleteProperty`):** Intercept updates and deletions, trigger notification callbacks with mutation details (path, new value, old value), and apply updates via `Reflect`.

---

### 2. Full Deep Reactive Proxy Implementation

Here is a complete, production-grade implementation of a deep reactive system:

```javascript
/**
 * Deep Reactive Proxy Implementation
 */
export function createReactiveState(target, onMutation) {
  // Cache to store and reuse proxy instances for objects to prevent duplicate wrapping
  const proxyCache = new WeakMap();
  // Reverse mapping to check if an object is already a proxy
  const rawToProxy = new WeakMap();

  function makeReactive(obj, path = []) {
    // Return primitive values directly
    if (obj === null || typeof obj !== 'object') {
      return obj;
    }

    // Return cached proxy if target is already wrapped
    if (proxyCache.has(obj)) {
      return proxyCache.get(obj);
    }

    const handler = {
      get(target, prop, receiver) {
        // Special internal symbol/property checks to prevent unnecessary proxying
        if (prop === '__isReactive') return true;
        if (prop === '__raw') return target;

        const value = Reflect.get(target, prop, receiver);

        // Ignore Symbol properties and non-configurable/non-writable properties
        if (typeof prop === 'symbol') {
          return value;
        }

        // LAZY PROXYING: If accessing a nested object or array, wrap it in a Proxy on-demand
        if (value !== null && typeof value === 'object') {
          // Construct the property path (e.g., ['user', 'profile', 'name'])
          const currentPath = [...path, prop];
          return makeReactive(value, currentPath);
        }

        return value;
      },

      set(target, prop, value, receiver) {
        // Unwrap value if a proxy was assigned to the reactive state
        const rawValue = value && value.__raw ? value.__raw : value;
        const oldValue = Reflect.get(target, prop, receiver);
        const propertyPath = [...path, prop];

        // Check if property is new or existing
        const hadKey = Array.isArray(target)
          ? Number(prop) < target.length
          : Reflect.has(target, prop);

        // Perform the mutation via Reflect
        const result = Reflect.set(target, prop, rawValue, receiver);

        // Trigger callback if the operation succeeded and value changed or property was added
        if (result && (oldValue !== rawValue || !hadKey)) {
          onMutation({
            type: hadKey ? 'UPDATE' : 'ADD',
            path: propertyPath,
            key: prop,
            newValue: rawValue,
            oldValue,
            target
          });
        }

        return result;
      },

      deleteProperty(target, prop) {
        const hadKey = Reflect.has(target, prop);
        const oldValue = Reflect.get(target, prop);
        const propertyPath = [...path, prop];

        const result = Reflect.deleteProperty(target, prop);

        if (result && hadKey) {
          onMutation({
            type: 'DELETE',
            path: propertyPath,
            key: prop,
            oldValue,
            target
          });
        }

        return result;
      }
    };

    const proxy = new Proxy(obj, handler);
    proxyCache.set(obj, proxy);
    rawToProxy.set(proxy, obj);

    return proxy;
  }

  return makeReactive(target);
}

```

---

### 3. Usage Example & Testing Deep Mutations

```javascript
// Initial State Object with deeply nested properties and arrays
const initialState = {
  user: {
    name: 'Alice',
    details: {
      age: 28,
      address: { city: 'New York', zip: '10001' }
    },
    hobbies: ['reading', 'coding']
  },
  settings: { theme: 'dark' }
};

// Create the deep reactive state wrapper
const state = createReactiveState(initialState, (change) => {
  console.log(`\n🔔 [REACTION TRIGGERED] Type: ${change.type}`);
  console.log(`   Path: state.${change.path.join('.')}`);
  console.log(`   New Value:`, change.newValue);
  console.log(`   Old Value:`, change.oldValue);
});

// --- 1. Deep Nested Property Update ---
state.user.details.address.city = 'San Francisco';
/* Output:
🔔 [REACTION TRIGGERED] Type: UPDATE
   Path: state.user.details.address.city
   New Value: San Francisco
   Old Value: New York
*/

// --- 2. Dynamically Adding a New Deep Property ---
state.user.details.country = 'USA';
/* Output:
🔔 [REACTION TRIGGERED] Type: ADD
   Path: state.user.details.country
   New Value: USA
   Old Value: undefined
*/

// --- 3. Mutating an Array element ---
state.user.hobbies.push('hiking');
/* Output:
🔔 [REACTION TRIGGERED] Type: ADD
   Path: state.user.hobbies.2
   New Value: hiking
   Old Value: undefined
*/

// --- 4. Deleting a Deep Property ---
delete state.settings.theme;
/* Output:
🔔 [REACTION TRIGGERED] Type: DELETE
   Path: state.settings.theme
   Old Value: dark
*/

// --- 5. Object Identity Check (WeakMap Cache Test) ---
console.log('\nIdentity Test:', state.user.details === state.user.details); // true

```

---

### 4. Key Architectural Design Highlights

1. **Lazy Evaluation ($O(1)$ Initialization):**
Wrapping a massive state tree eagerly on boot causes huge performance lag. Lazy proxying inside the `get` trap delays proxy creation until a property is accessed.
2. **WeakMap Memory Safety:**
`WeakMap` references targets weakly. Once an object branch is deleted or reassigned in the state tree, garbage collection automatically cleans up old target-proxy entries without leaking memory.
3. **Array Mutation Handling:**
Array operations like `.push()`, `.splice()`, or `.pop()` trigger property updates (e.g., array index keys and the `.length` property). The `set` trap handles array index updates and additions automatically.
4. **Circular Reference Protection:**
Because `proxyCache.get(obj)` returns the existing proxy if an object has already been wrapped, state objects with circular references will not cause infinite recursion loops.

Explain how Proxy.revocable works in JavaScript for memory management and secure access control.
`Proxy.revocable()` is a built-in static method in JavaScript that creates a **revocable Proxy object**.

Unlike a standard `new Proxy(target, handler)`, which remains permanently active for the entire lifetime of the application, `Proxy.revocable()` creates a proxy that can be **turned off (revoked) on demand**. Once revoked, any attempt to read, write, or call methods on the proxy throws a `TypeError`.

---

### 1. Syntax and Structure

`Proxy.revocable()` takes the same parameters as the standard `Proxy` constructor, but it returns an object containing two properties:

```javascript
const { proxy, revoke } = Proxy.revocable(target, handler);

```

* **`proxy`**: The newly created Proxy object.
* **`revoke`**: A zero-argument function that, when executed, **permanently disables** the `proxy`.

---

### 2. Basic Code Demonstration

```javascript
const sensitiveData = {
  apiKey: "secret_12345_token",
  userRole: "admin"
};

// 1. Create a revocable proxy
const { proxy, revoke } = Proxy.revocable(sensitiveData, {
  get(target, prop, receiver) {
    console.log(`Accessing property: ${prop}`);
    return Reflect.get(target, prop, receiver);
  }
});

// 2. Proxy works normally initially:
console.log(proxy.userRole); // Logs: "Accessing property: userRole" -> "admin"

// 3. Revoke the proxy!
revoke();

// 4. Any subsequent interaction with the proxy fails instantly:
try {
  console.log(proxy.apiKey);
} catch (error) {
  console.error(error.message); 
  // Output: TypeError: Cannot perform 'get' on a proxy that has been revoked
}

```

---

### 3. Primary Use Case 1: Secure Access Control & Capabilities

In secure JavaScript architectures (such as plugin ecosystems, third-party script integrations, or sandbox environments), you often need to grant untrusted code temporary access to a resource.

Using `Proxy.revocable()` allows you to implement a **Time-Limited Capability / Security Token**:

```javascript
function executeUntrustedPlugin(pluginCallback, systemResource) {
  // Create a revocable interface for the sensitive resource
  const { proxy: guardedResource, revoke } = Proxy.revocable(systemResource, {
    set(target, prop, value) {
      if (prop === 'isSystemAdmin') {
        throw new Error('Unauthorized modification attempt!');
      }
      return Reflect.set(...arguments);
    }
  });

  try {
    // Pass ONLY the revocable proxy to the plugin
    pluginCallback(guardedResource);
  } finally {
    // ALWAYS revoke access immediately after execution, 
    // even if the plugin threw an error!
    revoke();
  }
}

// System Usage:
const coreData = { isSystemAdmin: false, logs: [] };

executeUntrustedPlugin((res) => {
  res.logs.push('Plugin started');
  // Plugin attempts to store a reference to the resource for malicious late access:
  window.stolenResource = res; 
}, coreData);

// Later, the untrusted script tries to access the stolen reference:
// window.stolenResource.logs.push('Malicious late write'); 
// ❌ TypeError: Cannot perform 'get' on a proxy that has been revoked!

```

---

### 4. Primary Use Case 2: Memory Management & Leak Prevention

One of the biggest causes of memory leaks in long-running JavaScript applications (like Single Page Applications or Node.js servers) is **stale references held in event listeners or closures**.

If an untrusted module or external component keeps a reference to a Proxy, the underlying `target` object cannot be garbage collected because the Proxy holds a strong reference to its target.

#### How Revocation Helps Garbage Collection

When you call `revoke()`:

1. The internal connection between the `proxy` and its `target` object is severed.
2. The internal `handler` object is unlinked.
3. If no other parts of your app hold direct references to the original `target`, **the target object becomes eligible for Garbage Collection (GC)**—even if third-party code still holds onto the revoked `proxy` object.

```
BEFORE REVOCATION:
Untrusted Component ──► [ Revocable Proxy ] ──(strong link)──► [ Target Object in Memory ]

AFTER REVOKE():
Untrusted Component ──► [ Revoked Proxy ]     X (Severed!) X    [ Target Object ] ──► (Garbage Collected!)

```

---

### 5. Revocation Is Irreversible

* **One-Way Operation:** Once `revoke()` is executed, it cannot be undone. There is no `unrevoke()` method.
* **Idempotent:** Calling `revoke()` multiple times has no additional effect—subsequent calls simply do nothing and return `undefined`.

---

### Summary Table: Standard `Proxy` vs `Proxy.revocable`

| Feature              | Standard `Proxy`                       | `Proxy.revocable`                                     |
| -------------------- | -------------------------------------- | ----------------------------------------------------- |
| **Instantiation**    | `new Proxy(target, handler)`           | `Proxy.revocable(target, handler)`                    |
| **Return Structure** | Returns the Proxy instance directly    | Returns `{ proxy, revoke }` tuple                     |
| **Lifetime**         | Lives as long as references exist      | Can be destroyed manually at any time                 |
| **Memory Isolation** | Keeps target alive while proxy lives   | Revoking frees target for Garbage Collection          |
| **Best For**         | Application state, reactivity, logging | Plugin sandboxes, temporary access, short-lived tasks |

Sandboxing in JavaScript is the practice of executing untrusted or semi-trusted code (such as third-party plugins, user-submitted scripts, or analytics tags) in an isolated environment where it cannot access sensitive globals, steal DOM data, leak credentials, or pollute prototype chains.

As web applications have shifted from simple scripts to full operating environments, sandboxing strategies have evolved from brittle runtime mocks to native engine-level isolation.

---

## 1. The Spectrum of JavaScript Isolation Strategies

Isolation mechanisms operate at different layers of the execution stack, offering varying trade-offs between security, performance, and communication overhead.

```
┌────────────────────────────────────────────────────────┐
│                   ISOLATION SPECTRUM                   │
├───────────────────┬──────────────────┬─────────────────┤
│    LOWER BOUND    │   REALM LEVEL    │  PROCESS LEVEL  │
│                   │                  │                 │
│  Proxy / Closure  │   ShadowRealm    │  Web Workers /  │
│     Sandboxes     │   (Same Thread)  │   iframes       │
└───────────────────┴──────────────────┴─────────────────┘
  Lighter Overhead                        Stronger Isolation

```

---

## 2. In-Memory Sandboxing: Proxies & `with` (The Legacy Approach)

Historically, applications attempted to sandbox scripts in the same realm using a `Proxy` wrapped around a global target inside a `with` statement.

```javascript
function legacySandbox(code, untrustedGlobals) {
  const sandboxProxy = new Proxy(untrustedGlobals, {
    has(target, prop) {
      // Prevent code from reaching global window via scope chain
      return true; 
    },
    get(target, prop) {
      if (prop === 'window' || prop === 'globalThis') return sandboxProxy;
      return target[prop] || undefined;
    }
  });

  // Use 'with' to force scope resolution through sandboxProxy
  const runner = new Function('sandbox', `with(sandbox) { ${code} }`);
  runner(sandboxProxy);
}

```

### Why Runtime Proxies Fail for Hard Security

1. **Escape via Prototypes:** Untrusted code can access `Object.prototype` via literals (`{}.constructor.prototype`) and modify base prototypes, polluting the host context.
2. **Global Leaks:** Async tasks (`setTimeout`, `Promise.then`) run in the global microtask queue, which easily escapes the `with` block context.
3. **Performance Overhead:** The `with` statement turns off critical V8 JIT optimizations and forces every identifier lookup through a dynamic Proxy trap.

---

## 3. Native Realm Isolation: The `ShadowRealm` Proposal

To solve the limitations of Proxy sandboxes without thread/process overhead, TC39 introduced the **ShadowRealm API**.

A **Realm** in JavaScript consists of an execution context with its own distinct set of built-in global objects (`Object`, `Array`, `Function`, `Promise`, etc.).

While a standard web page has a single Global Realm, a **ShadowRealm** creates a brand-new, completely isolated Global Realm on the **same execution thread**.

### How ShadowRealms Work Under the Hood

```
┌──────────────────────────────────────────────────────────────┐
│                       SAME THREAD                            │
├──────────────────────────────┬───────────────────────────────┤
│          HOST REALM          │         SHADOW REALM          │
│                              │                               │
│  - Host globalThis           │  - Distinct globalThis        │
│  - Host Array.prototype      │  - Distinct Array.prototype   │
│  - Access to DOM & Window    │  - NO access to DOM/Window    │
│                              │                               │
│              │               │               ▲               │
│              └────────► PRIMITIVE ───────────┘               │
│                          CALL VALUE                          │
│                           WRAPPERS                           │
└──────────────────────────────────────────────────────────────┘

```

#### Code Example

```javascript
// Creating a native ShadowRealm context
const realm = new ShadowRealm();

// 1. Evaluate code directly inside the isolated realm
const result = realm.evaluate(`
  // 'globalThis' here is distinct from the host!
  globalThis.realmSecret = "inside-realm";
  
  function add(a, b) {
    return a + b;
  }
  add(5, 10);
`);

console.log(result); // 15

// 2. Import modules dynamically into the ShadowRealm
const moduleExports = await realm.importValue('./untrusted-plugin.js', 'runPlugin');

// Invoke imported function
moduleExports({ data: 42 });

```

---

### The Callable Boundary (The Security Guarantee)

The critical security model of `ShadowRealm` is the **Callable Boundary**:

* **Primitives Only:** Only primitive values (`number`, `string`, `boolean`, `symbol`, `undefined`, `null`) and **wrapped functions** can cross the boundary between the host realm and the ShadowRealm.
* **No Object References:** You cannot pass an Object, Array, or Promise directly across the boundary. Passing an object throws a `TypeError`.
* **Wrapped Functions:** When a function crosses the boundary, it is wrapped in an internal proxy structure. Invoking it converts arguments to primitives or wrapped functions before execution.

```javascript
// Inside Host Realm:
const hostObject = { token: "secret_abc" };

// ❌ Throws TypeError across Callable Boundary!
// realm.evaluate(`(obj) => obj.token`)(hostObject);

// ✅ Must serialize or pass primitives explicitly:
const getPrimitive = realm.evaluate(`(token) => "Received: " + token`);
console.log(getPrimitive(hostObject.token)); // "Received: secret_abc"

```

---

## 4. Process-Level & Hardware Isolation Strategies

When untrusted code must be strictly prevented from hogging CPU resources, crashing the main thread, or exploiting Spectre/Meltdown CPU vulnerabilities, memory-realm separation is insufficient. Process-level boundaries are required.

### A. Web Workers + Cross-Origin Isolation

Running untrusted code inside a Web Worker moves execution to a separate operating system thread:

```javascript
// Creating a isolated Worker Blob
const code = `
  self.onmessage = (e) => {
    // Untrusted computation runs off main thread
    const result = heavyCalculation(e.data);
    self.postMessage(result);
  };
`;

const blob = new Blob([code], { type: 'application/javascript' });
const worker = new Worker(URL.createObjectURL(blob));

```

#### Cross-Origin Isolation Headers

To prevent side-channel timing attacks (e.g., Spectre reading memory across threads), browsers enforce Cross-Origin Isolation via HTTP response headers:

```http
Cross-Origin-Opener-Policy: same-origin
Cross-Origin-Embedder-Policy: require-corp

```

Enabling these headers unlocks high-resolution timers (`performance.now()`) and `SharedArrayBuffer` safely by guaranteeing that the process cannot share memory with cross-origin documents.

---

### B. Sandboxed `<iframe>` with Minimal Privileges

An `<iframe>` with a restrictive `sandbox` attribute provides browser-enforced origin and DOM isolation.

```html
<iframe 
  src="about:blank"
  sandbox="allow-scripts" 
  csp="default-src 'none'; script-src 'unsafe-inline';"
  id="sandboxFrame">
</iframe>

```

By specifying `sandbox="allow-scripts"` (and omitting `allow-same-origin`), the iframe is forced into a **unique, opaque origin**. It cannot:

* Read cookies, localStorage, or IndexedDB from the parent domain.
* Access the parent DOM via `window.parent` (access is blocked by Same-Origin Policy).
* Make network requests unless explicitly permitted by CSP (`Content-Security-Policy`).

Communication between the host application and the sandboxed iframe takes place via strict `postMessage` RPC channels:

```javascript
// Host Application
const frame = document.getElementById('sandboxFrame');

window.addEventListener('message', (event) => {
  // Always verify origin for secure RPC
  if (event.origin !== "null") return; // Sandboxed iframes have origin "null"
  console.log("Result from sandbox:", event.data);
});

// Send work payload
frame.contentWindow.postMessage({ task: 'EVAL', code: '1 + 1' }, '*');

```

---

## Summary Matrix of Sandboxing Patterns

| Pattern                    | Isolation Level           | DOM / Window Access           | Prototype Pollution Protection       | Performance Overhead                          |
| -------------------------- | ------------------------- | ----------------------------- | ------------------------------------ | --------------------------------------------- |
| **Proxy / `with` Sandbox** | In-Memory Object Mocking  | Restricted via Proxy traps    | ❌ Weak (Leaked via constructors)     | High JIT impact                               |
| **ShadowRealm**            | Native Thread-Level Realm | ❌ None (`DOM` not present)    | ✅ Absolute (Separate globals)        | Very Low (Same thread)                        |
| **Sandboxed `iframe**`     | Origin Isolation          | Restricted to iframe document | ✅ Absolute (Separate global context) | Medium (DOM allocation)                       |
| **Web Worker**             | Thread Isolation          | ❌ None                        | ✅ Absolute (Separate thread)         | Low computation, Medium message serialization |

Explain how getters and setters work in ES6 Classes with practical code examples.
In ES6 classes, **getters** and **setters** are special methods that bind an object property to a function. They allow you to execute custom logic—such as validation, logging, or computed formatting—whenever a property is read or modified, while keeping the syntax looking like plain property access.

---

### Syntax Overview

* **`get keyword()`**: Defines a method that is executed when the property is accessed (read). It **must return a value** and takes **no parameters**.
* **`set keyword(value)`**: Defines a method that is executed when the property is assigned a value (written). It takes **exactly one parameter** (the value being assigned).

---

### 1. Basic Example & The Naming Trap

To prevent infinite recursion loops when using getters and setters inside a class, you **must name the backing private/internal property differently** than the getter/setter method itself.

By convention, developers prefix the backing property with an underscore (`_`), or use modern **private class fields** (`#`).

```javascript
class User {
  constructor(name) {
    // Calling the setter inside the constructor
    this.name = name;
  }

  // GETTER: Triggered when evaluating 'user.name'
  get name() {
    return this._name.toUpperCase();
  }

  // SETTER: Triggered when executing 'user.name = "..."'
  set name(value) {
    if (!value || value.trim() === '') {
      throw new Error('Name cannot be empty.');
    }
    // Store in internal backing variable '_name'
    this._name = value.trim();
  }
}

const user = new User('alice');

// Reading property (invokes get name())
console.log(user.name); // Output: "ALICE"

// Updating property (invokes set name(value))
user.name = '  bob  ';
console.log(user.name); // Output: "BOB"

// Invalid assignment
// user.name = ''; // ❌ Throws Error: Name cannot be empty.

```

> **Why the `_` backing variable is necessary:**
> If the setter assigned to `this.name = value`, assigning `this.name` inside the setter would invoke the setter again, causing infinite recursion (`RangeError: Maximum call stack size exceeded`).

---

### 2. Computed Properties (Read-Only Getters)

A getter without a corresponding setter creates a **read-only computed property**. If someone attempts to reassign it in strict mode, JavaScript will throw a `TypeError`.

```javascript
class Rectangle {
  constructor(width, height) {
    this.width = width;
    this.height = height;
  }

  // Computed Getter: Dynamically calculated on access
  get area() {
    return this.width * this.height;
  }
}

const rect = new Rectangle(10, 5);

console.log(rect.area); // Output: 50 (Read like a property, not rect.area())

// Modifying dimensions automatically updates the getter result:
rect.width = 20;
console.log(rect.area); // Output: 100

// Attempting to overwrite read-only getter:
rect.area = 500; // Silently fails in non-strict mode; throws TypeError in strict mode
console.log(rect.area); // Still 100!

```

---

### 3. Modern Pattern: Using Private Class Fields (`#field`)

In modern JavaScript (ES2022+), you can replace the `_` naming convention with true engine-enforced **private class fields** (`#`). This prevents outside code from directly accessing or modifying the backing variable.

```javascript
class BankAccount {
  // Private field declaration
  #balance = 0;

  constructor(initialBalance) {
    this.balance = initialBalance; // Calls setter for initial validation
  }

  // Getter for formatted currency read
  get balance() {
    return `$${this.#balance.toFixed(2)}`;
  }

  // Setter for deposit/withdrawal validation
  set balance(amount) {
    if (typeof amount !== 'number' || isNaN(amount)) {
      throw new TypeError('Amount must be a valid number');
    }
    if (amount < 0) {
      throw new Error('Balance cannot be negative');
    }
    this.#balance = amount;
  }
}

const account = new BankAccount(250);

console.log(account.balance); // Output: "$250.00"

account.balance = 1000;
console.log(account.balance); // Output: "$1000.00"

// Truly private: Outside code cannot bypass validation
// console.log(account.#balance); 
// ❌ SyntaxError: Private field '#balance' must be declared in an enclosing class

```

---

### 4. Under the Hood: Property Descriptors

When you declare a getter or setter in an ES6 class body, JavaScript installs an **Accessor Descriptor** on `Class.prototype` rather than creating a method on each instance object.

```javascript
class Temperature {
  constructor(celsius) {
    this.celsius = celsius;
  }

  get fahrenheit() {
    return (this.celsius * 9) / 5 + 32;
  }
}

// Inspecting prototype descriptors:
const descriptor = Object.getOwnPropertyDescriptor(Temperature.prototype, 'fahrenheit');

console.log(descriptor);
/* Output:
{
  get: [Function: get fahrenheit],
  set: undefined,
  enumerable: false,   <-- Class getters/setters are non-enumerable
  configurable: true
}
*/

```

---

### Summary Checklist

| Goal                          | Syntax Pattern                        | Key Behavior                                               |
| ----------------------------- | ------------------------------------- | ---------------------------------------------------------- |
| **Transform / Format Value**  | `get prop() { return ... }`           | Invoked like `obj.prop` (no parenthesis required).         |
| **Validate / Sanitize Input** | `set prop(val) { ... }`               | Invoked on assignment (`obj.prop = value`).                |
| **Read-Only Property**        | Implement `get` without `set`         | Reassignment is ignored or throws an error in strict mode. |
| **Encapsulate State**         | Pair `get`/`set` with `#privateField` | Protects backing variables from external tampering.        |
