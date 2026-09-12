Redux is built on three foundational architectural principles that directly guarantee applications remain **predictable**, **testable**, and **debuggable**.

---

### 1. Single Source of Truth

The global state of your entire application is stored in an object tree within a single **store**.

* **What it means:** Instead of distributing state across isolated component lifecycles, disparate controllers, or disjointed models, the complete application status lives in one centralized place.
* **Why it makes apps Predictable:** Having a unified snapshot means there is never disagreement between different parts of the application about what the "current state" is.
* **Why it makes apps Debuggable:** Because the entire state is represented as a single plain object, serializing it, persisting it across page reloads, or logging it directly to tools like Redux DevTools is trivial.

---

### 2. State Is Read-Only

The only way to change the state is to dispatch an **action**—a plain JavaScript object describing what happened.

* **What it means:** Neither the UI view layer nor network callbacks can write directly to the state tree (no `state.user.name = 'Alex'`). Any mutation intent must be formally wrapped in an action with a `type` property (e.g., `{ type: 'cart/itemAdded', payload: item }`).
* **Why it makes apps Predictable:** Centralizing mutations behind discrete intents ensures that writes are serialized and never happen in arbitrary, conflicting order across parallel UI events.
* **Why it makes apps Debuggable:** Every change creates an explicit paper trail. You can inspect the exact timeline of actions that led to a specific state or bug, and even step backwards and forwards using time-travel debugging.

---

### 3. Changes Are Made with Pure Functions

To specify how the state tree is transformed by actions, you write pure functions called **reducers**.

* **What it means:** Reducers take the previous state and an action as arguments, and return the next state:

$$\text{Reducer}(\text{previousState}, \text{action}) \longrightarrow \text{newState}$$

They must remain completely **pure**: no side effects, no API calls, no mutations of the input arguments, and no non-deterministic logic (like calling `Math.random()` or `Date.now()`).

* **Why it makes apps Testable:** Pure functions are the easiest units of code to test. A unit test for a reducer requires zero mocking of network layers, timers, or the DOM—you pass an input state and an action, and assert the returned output object:

```javascript
expect(counterReducer(0, { type: 'counter/increment' })).toBe(1);

```

* **Why it makes apps Predictable:** Given the exact same starting state and action, a reducer will always return the exact same output, eliminating race conditions or hidden side-effect traps.
