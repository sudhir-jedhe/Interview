# Scenario: case-insensitive property store without prototype pollution risk

**Prompt:** You need a small in-memory key-value store where keys are arbitrary user-supplied strings (could be `"toString"`, `"__proto__"`, `"constructor"`, anything). Using a plain `{}` risks either colliding with inherited properties or, worse, letting a malicious key like `"__proto__"` pollute `Object.prototype`. How do you build this safely?

**Approach:** The safest simple option is `Object.create(null)` for the backing store — it has no prototype, so there is no `__proto__` accessor to hijack and no inherited method names to collide with:

```js
function createStore() {
  const store = Object.create(null);
  return {
    set(key, value) { store[key] = value; },
    get(key) { return store[key]; },
    has(key) { return Object.hasOwn(store, key); },
  };
}

const s = createStore();
s.set("__proto__", "harmless string");
console.log(s.get("__proto__")); // "harmless string", no prototype pollution
```

An alternative is using a `Map`, which sidesteps the whole prototype-key problem entirely and is generally preferred for dynamic key sets in modern code — mention both, but `Object.create(null)` is the direct answer to "fix the object approach."
