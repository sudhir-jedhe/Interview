**You need a feature flag / permission system where flags are looked up by dynamically-generated keys from third-party plugin code, and you're worried a plugin could accidentally (or maliciously) register a flag with a name like `"__proto__"` or `"toString"` and break the whole system. How do ES6 tools address this?**

**Approach:**
Two complementary defenses. First, use `Symbol()` for keys that must never collide, if the plugin identity is known ahead of time and controlled by your code:

```js
const flagKey = Symbol('feature:newCheckout');
const flags = { [flagKey]: true };
```
More realistically, for dynamic string keys from untrusted input, avoid plain objects as the store entirely and use a `Map`, which treats every key as a distinct opaque value with no special-cased string keys like `"__proto__"`:

```js
const flags = new Map();
flags.set('__proto__', true); // perfectly safe — just a normal entry
console.log(flags.get('__proto__')); // true, no prototype pollution
```
A plain object (`{}`) used as a dictionary is vulnerable because certain string keys (`"__proto__"`, `"constructor"`, `"prototype"`) interact with the prototype chain in surprising ways depending on how the object is constructed and accessed; `Map` sidesteps this entirely since it has no such special key semantics — every `.set()`/`.get()` call operates on genuinely isolated internal storage, not object property slots.
