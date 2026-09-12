During the standardization process, the TC39 proposal originally planned `Array.prototype.group`. However, because existing websites relied on older versions of libraries (notably Sugar.js) that mutated `Array.prototype.group` in incompatible ways, it caused web-compatibility breakage ("SmooshGate" style).

TC39 pivoted to static methods on `Object` and `Map`: **`Object.groupBy`** and **`Map.groupBy`** (standardized in ECMAScript 2024).

Below is the spec-compliant polyfill for **`Object.groupBy`** (and `Map.groupBy`), followed by `Array.prototype.group` if required for legacy codebases.

---

### 1. Spec-Compliant `Object.groupBy` Polyfill (ES2024)

According to the ECMAScript specification, `Object.groupBy` must:

1. Accept any iterable (not just arrays).
2. Validate that the callback is a callable function.
3. Coerce the derived key to a Property Key (`string` or `symbol`).
4. Return a null-prototype object (`Object.create(null)`) so user keys like `'toString'` or `'__proto__'` do not collide with built-in prototype methods.

```javascript
if (!Object.groupBy) {
  Object.defineProperty(Object, 'groupBy', {
    value: function groupBy(items, callbackFn) {
      // 1. Ensure items is not null or undefined
      if (items == null) {
        throw new TypeError('Object.groupBy called on null or undefined');
      }

      // 2. Ensure callbackFn is callable
      if (typeof callbackFn !== 'function') {
        throw new TypeError('callbackFn must be a function');
      }

      // 3. Create a clean null-prototype dictionary
      const result = Object.create(null);

      // 4. Iterate over any generic iterable (Arrays, Sets, Maps, NodeLists, etc.)
      let index = 0;
      for (const item of items) {
        const rawKey = callbackFn(item, index++);
        
        // Coerce key to property key (string or symbol)
        const key = typeof rawKey === 'symbol' ? rawKey : String(rawKey);

        if (Object.prototype.hasOwnProperty.call(result, key) || key in result) {
          result[key].push(item);
        } else {
          result[key] = [item];
        }
      }

      return result;
    },
    writable: true,
    enumerable: false, // Must not appear in for...in loops on Object
    configurable: true,
  });
}

```

---

### 2. Spec-Compliant `Map.groupBy` Polyfill (ES2024)

`Map.groupBy` is designed for cases where grouping keys are complex objects or where keys must preserve their original types (without being coerced into strings).

```javascript
if (!Map.groupBy) {
  Object.defineProperty(Map, 'groupBy', {
    value: function groupBy(items, callbackFn) {
      if (items == null) {
        throw new TypeError('Map.groupBy called on null or undefined');
      }
      if (typeof callbackFn !== 'function') {
        throw new TypeError('callbackFn must be a function');
      }

      const map = new Map();
      let index = 0;

      for (const item of items) {
        const key = callbackFn(item, index++);

        if (map.has(key)) {
          map.get(key).push(item);
        } else {
          map.set(key, [item]);
        }
      }

      return map;
    },
    writable: true,
    enumerable: false,
    configurable: true,
  });
}

```

---

### 3. Legacy `Array.prototype.group` Polyfill (Early Stage 3 Proposal)

If your codebase or typing setup still relies on the superseded prototype method:

```javascript
if (!Array.prototype.group) {
  Object.defineProperty(Array.prototype, 'group', {
    value: function group(callbackFn, thisArg) {
      if (this == null) {
        throw new TypeError('Array.prototype.group called on null or undefined');
      }
      if (typeof callbackFn !== 'function') {
        throw new TypeError('callbackFn must be a function');
      }

      const list = Object(this);
      const len = list.length >>> 0;
      const result = Object.create(null);

      for (let i = 0; i < len; i++) {
        // Read element (accounting for sparse arrays)
        const item = list[i];
        const rawKey = callbackFn.call(thisArg, item, i, list);
        const key = typeof rawKey === 'symbol' ? rawKey : String(rawKey);

        if (key in result) {
          result[key].push(item);
        } else {
          result[key] = [item];
        }
      }

      return result;
    },
    writable: true,
    enumerable: false,
    configurable: true,
  });
}

```

---

### Key Spec Differences & Edge Cases

| Scenario                    | Standard `reduce` Object (`{}`)                                                                  | Spec `Object.groupBy` (`Object.create(null)`)                                      |
| --------------------------- | ------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------- |
| **Reserved Prototype Keys** | Collides: e.g. grouping by `'toString'` or `'constructor'` crashes when invoking object methods. | **Safe**: Null prototype has no inherited properties.                              |
| **Symbol Keys**             | Converts symbol to `"[object Object]"` in some engines if not handled.                           | **Preserves Symbol keys**: `typeof rawKey === 'symbol' ? rawKey : String(rawKey)`. |
| **Iterables**               | `reduce` works **only** on Arrays.                                                               | Works natively on `Set`, `Generator`, `NodeList`, and custom iterables.            |
| **Object Key Coercion**     | Always turns objects to `"[object Object]"`.                                                     | Use `Map.groupBy` to preserve reference identity as grouping keys.                 |

```javascript
// Demonstrating the null-prototype safety:
const items = [{ role: 'toString' }, { role: 'admin' }];
const grouped = Object.groupBy(items, (i) => i.role);

// Safe: toString is an Array, not Object.prototype.toString
console.log(grouped.toString); // [{ role: 'toString' }]
console.log(Object.getPrototypeOf(grouped)); // null

```
