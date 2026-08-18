# Interview Q&A: Design Patterns

**Q: What is the module pattern and what problem does it solve?**
It uses an IIFE combined with closures to create a private scope for variables and functions, exposing only a deliberately chosen public API on a returned object. It solves the problem of keeping implementation details out of the global scope in environments without native module support, preventing naming collisions and accidental external mutation of internal state.

**Q: How would you implement a Singleton in JavaScript?**
Use a static private field on a class to cache the first-created instance, and have the constructor return that cached instance on subsequent calls instead of building a new object.
```js
class Singleton {
  static #instance;
  constructor() {
    if (Singleton.#instance) return Singleton.#instance;
    Singleton.#instance = this;
  }
}
```
In practice, ES module caching already gives you singleton behavior for free when you just export a plain object, which is often simpler than the class-based approach.

**Q: What is the observer (pub-sub) pattern, and where have you seen it used in real systems?**
It's a pattern where subscribers register interest in named events on a central emitter, and a publisher broadcasts events without needing direct references to each subscriber, decoupling producers from consumers. It shows up throughout the DOM's own event system, Node's `EventEmitter`, and state-management libraries (Redux's store subscriptions are effectively pub-sub).

**Q: What's the difference between the factory pattern and just calling `new SomeClass()` directly?**
A factory function centralizes and hides the logic of *which* concrete object to construct, letting callers ask for what they want conceptually ("give me a shape") without knowing the underlying class hierarchy. Calling `new` directly requires the caller to know and import the specific class, coupling the caller to implementation details a factory would hide.

**Q: Why might you prefer the module pattern or an event emitter over just using global variables and functions?**
Global variables and functions pollute a shared namespace, risk name collisions between unrelated parts of a codebase or third-party scripts, and make it hard to reason about what can mutate shared state and from where. Encapsulating state behind closures (module pattern) or coordinating side effects through explicit events (pub-sub) makes dependencies visible and intentional instead of implicit and global.
