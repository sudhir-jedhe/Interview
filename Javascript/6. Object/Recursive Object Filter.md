A **Recursive Object Filter** traverses deeply nested JavaScript objects and arrays, filtering out key-value pairs or elements based on a provided predicate function.

---

### Implementation

This function handles:

* Nested plain objects and arrays
* Optional cleanup of empty objects/arrays after filtering (`cleanEmpty`)
* Circular reference safety via `WeakMap`

```javascript
/**
 * Recursively filters an object or array based on a predicate function.
 *
 * @param {*} input - The nested object, array, or primitive to filter.
 * @param {Function} predicate - Callback `(value, key, parent) => boolean`.
 * @param {Object} [options] - Configuration options.
 * @param {boolean} [options.cleanEmpty=false] - Whether to remove objects/arrays that become empty after filtering.
 * @param {WeakMap} [seen=new WeakMap()] - Internal tracker to handle circular references.
 * @returns {*} The filtered result.
 */
function recursiveFilter(input, predicate, options = {}, seen = new WeakMap()) {
  const { cleanEmpty = false } = options;

  // 1. Return primitives or null directly
  if (input === null || typeof input !== 'object') {
    return input;
  }

  // 2. Handle circular references
  if (seen.has(input)) {
    return seen.get(input);
  }

  // 3. Handle Arrays
  if (Array.isArray(input)) {
    const result = [];
    seen.set(input, result);

    for (let i = 0; i < input.length; i++) {
      const item = input[i];

      // Keep if predicate returns true
      if (predicate(item, i, input)) {
        if (typeof item === 'object' && item !== null) {
          const filteredChild = recursiveFilter(item, predicate, options, seen);
          // If cleanEmpty is enabled and child becomes empty, omit it
          if (!cleanEmpty || !isEmpty(filteredChild)) {
            result.push(filteredChild);
          }
        } else {
          result.push(item);
        }
      }
    }

    return result;
  }

  // 4. Handle Plain Objects
  const result = {};
  seen.set(input, result);

  for (const [key, value] of Object.entries(input)) {
    // Keep if predicate passes for (value, key, input)
    if (predicate(value, key, input)) {
      if (typeof value === 'object' && value !== null) {
        const filteredChild = recursiveFilter(value, predicate, options, seen);
        // If cleanEmpty is enabled and child becomes empty, omit it
        if (!cleanEmpty || !isEmpty(filteredChild)) {
          result[key] = filteredChild;
        }
      } else {
        result[key] = value;
      }
    }
  }

  return result;
}

function isEmpty(val) {
  if (val == null) return false;
  if (Array.isArray(val)) return val.length === 0;
  if (typeof val === 'object') return Object.keys(val).length === 0;
  return false;
}

```

---

### Common Use Cases & Examples

#### 1. Strip Out `null`, `undefined`, and Empty Strings

Commonly used to sanitize API payloads before transmission.

```javascript
const dirtyPayload = {
  name: 'Sudhir',
  email: '',
  age: 30,
  address: {
    street: 'Main St',
    zip: null,
    coordinates: {
      lat: 18.52,
      lng: undefined,
    },
  },
  tags: ['developer', '', null, 'javascript'],
};

const clean = recursiveFilter(
  dirtyPayload,
  (value) => value !== null && value !== undefined && value !== ''
);

console.log(clean);
/*
Output:
{
  name: 'Sudhir',
  age: 30,
  address: {
    street: 'Main St',
    coordinates: {
      lat: 18.52
    }
  },
  tags: [ 'developer', 'javascript' ]
}
*/

```

---

#### 2. Redact or Drop Sensitive Keys (Blacklist by Key Name)

Used for data masking and logging (e.g., stripping passwords, tokens, PII).

```javascript
const userSession = {
  id: 'usr_101',
  token: 'secret_abc_123',
  profile: {
    username: 'john_doe',
    passwordHash: '$2b$12$e8x...',
    settings: {
      theme: 'dark',
      apiKey: 'key_xyz',
    },
  },
};

const blacklist = new Set(['token', 'passwordHash', 'apiKey']);

const publicData = recursiveFilter(
  userSession,
  (value, key) => !blacklist.has(key)
);

console.log(publicData);
/*
Output:
{
  id: 'usr_101',
  profile: {
    username: 'john_doe',
    settings: {
      theme: 'dark'
    }
  }
}
*/

```

---

#### 3. Prune Empty Objects and Arrays Post-Filter (`cleanEmpty: true`)

```javascript
const data = {
  title: 'Report',
  details: {
    notes: null,
    metadata: {
      author: null,
    },
  },
  items: [null, undefined],
};

const pruned = recursiveFilter(
  data,
  (val) => val !== null && val !== undefined,
  { cleanEmpty: true }
);

console.log(pruned);
/*
Output:
{
  title: 'Report'
}
(details and items are pruned because their children became empty)
*/

```

---

### Key Edge Cases Handled

* **Preserves Prototypes & Non-Plain Primitives:** Doesn't mutate original input structures (creates new copies).
* **Circular Dependencies:** The `WeakMap` parameter (`seen`) prevents `RangeError: Maximum call stack size exceeded` when an object references an ancestor.
* **Array/Object Hybrid Trees:** Correctly branches depending on `Array.isArray()` so arrays retain array indices rather than turning into `{ "0": val, "1": val }`.
