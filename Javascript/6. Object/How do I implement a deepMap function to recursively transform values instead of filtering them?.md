A `deepMap` function recursively traverses nested structures (objects, arrays, Maps, Sets) and applies a transformation callback to values.

A production-ready implementation needs to handle three critical concerns:

1. **Differentiating leaf nodes from containers:** Knowing when to recurse versus when to transform.
2. **Circular reference protection:** Preventing infinite loops with a `WeakMap`.
3. **Preserving non-plain objects:** Keeping built-in instances (like `Date`, `RegExp`) intact or cloning them instead of flattening them into `{}`.

---

### Implementation

```javascript
/**
 * Recursively maps values across nested objects, arrays, Sets, and Maps.
 *
 * @param {*} input - The structure or primitive to transform.
 * @param {Function} transform - Callback: (value, keyPath, parent) => any.
 * @param {Object} [options] - Optional configurations.
 * @param {boolean} [options.transformContainers=false] - Whether to also run the transform on intermediate object/array nodes.
 * @param {Array<string|number>} [currentPath=[]] - Internal accumulator for key paths.
 * @param {WeakMap} [seen=new WeakMap()] - Prevents circular reference loops.
 * @returns {*} The deeply transformed clone.
 */
function deepMap(
  input,
  transform,
  options = {},
  currentPath = [],
  seen = new WeakMap()
) {
  const { transformContainers = false } = options;

  // 1. Return primitives directly via transform
  if (input === null || typeof input !== 'object') {
    return transform(input, currentPath, null);
  }

  // 2. Circular reference protection
  if (seen.has(input)) {
    return seen.get(input);
  }

  // 3. Preserve special built-in object instances
  if (input instanceof Date) return new Date(input.getTime());
  if (input instanceof RegExp) return new RegExp(input.source, input.flags);
  if (typeof ArrayBuffer !== 'undefined' && ArrayBuffer.isView(input)) {
    return input.slice();
  }

  // 4. Handle Arrays
  if (Array.isArray(input)) {
    const result = [];
    seen.set(input, result);

    for (let i = 0; i < input.length; i++) {
      const nextPath = [...currentPath, i];
      result[i] = deepMap(input[i], transform, options, nextPath, seen);
    }

    return transformContainers ? transform(result, currentPath, input) : result;
  }

  // 5. Handle ES6 Map
  if (input instanceof Map) {
    const result = new Map();
    seen.set(input, result);

    for (const [key, val] of input.entries()) {
      const nextPath = [...currentPath, key];
      result.set(key, deepMap(val, transform, options, nextPath, seen));
    }

    return transformContainers ? transform(result, currentPath, input) : result;
  }

  // 6. Handle ES6 Set
  if (input instanceof Set) {
    const result = new Set();
    seen.set(input, result);

    let idx = 0;
    for (const val of input.values()) {
      const nextPath = [...currentPath, idx++];
      result.add(deepMap(val, transform, options, nextPath, seen));
    }

    return transformContainers ? transform(result, currentPath, input) : result;
  }

  // 7. Handle Plain Objects
  const result = Object.create(Object.getPrototypeOf(input));
  seen.set(input, result);

  for (const [key, value] of Object.entries(input)) {
    const nextPath = [...currentPath, key];
    result[key] = deepMap(value, transform, options, nextPath, seen);
  }

  return transformContainers ? transform(result, currentPath, input) : result;
}

```

---

### Use Cases & Examples

#### 1. Sanitize or Mask Data (Trimming Strings & Redacting Secrets)

```javascript
const userData = {
  name: '  Alex Doe  ',
  auth: {
    token: 'jwt_secret_token_12345',
    refreshToken: 'refresh_token_abcde',
  },
  preferences: {
    newsletter: '  true  ',
  },
  scores: [10, ' 25 ', 30],
};

const sanitized = deepMap(userData, (val, path) => {
  // Redact any values whose key is a token
  const lastKey = path[path.length - 1];
  if (lastKey === 'token' || lastKey === 'refreshToken') {
    return '[REDACTED]';
  }

  // Auto-trim strings
  if (typeof val === 'string') {
    return val.trim();
  }

  return val;
});

console.log(sanitized);
/*
Output:
{
  name: 'Alex Doe',
  auth: { token: '[REDACTED]', refreshToken: '[REDACTED]' },
  preferences: { newsletter: 'true' },
  scores: [ 10, '25', 30 ]
}
*/

```

---

#### 2. Scale Numbers by a Factor (Currency or Unit Conversion)

```javascript
const invoice = {
  id: 'INV-2026-001',
  subtotal: 100,
  tax: 8.5,
  items: [
    { desc: 'Widget A', unitPrice: 20 },
    { desc: 'Widget B', unitPrice: 80 },
  ],
};

// Convert all numeric values from USD to EUR (e.g. rate = 0.92)
const euroInvoice = deepMap(invoice, (val, path) => {
  if (typeof val === 'number') {
    return Number((val * 0.92).toFixed(2));
  }
  return val;
});

console.log(euroInvoice);
/*
Output:
{
  id: 'INV-2026-001',
  subtotal: 92,
  tax: 7.82,
  items: [
    { desc: 'Widget A', unitPrice: 18.4 },
    { desc: 'Widget B', unitPrice: 73.6 }
  ]
}
*/

```

---

#### 3. Handling Circular References Gracefully

```javascript
const cyclicObj = { name: 'Root' };
cyclicObj.self = cyclicObj; // Self-reference

const mapped = deepMap(cyclicObj, (val) => {
  return typeof val === 'string' ? val.toUpperCase() : val;
});

console.log(mapped.name); // "ROOT"
console.log(mapped.self === mapped); // true (retains circular pointer)

```

---

### Core Mechanics

* **Path Tracking (`currentPath`):** Every invocation passes an array of keys/indices down the stack (e.g., `['items', 0, 'unitPrice']`), allowing targeted transformations based on ancestry or position.
* **Prototype Retention:** Using `Object.create(Object.getPrototypeOf(input))` preserves inheritance and custom prototype structures rather than collapsing everything into basic plain objects.
* **Container Opt-in (`transformContainers`):** By default, container structures (`[]`, `{}`) are not fed into `transform` directly, preventing containers from being replaced by primitives accidentally.
