To filter an array of records (objects) by excluding any record that matches one or more blacklisted property–value pairs, you test each record against the blacklist criteria using `Array.prototype.filter()`.

---

### 1. The Standard JavaScript Implementation

This implementation handles arbitrary blacklist shapes, multiple values per key (via arrays or `Set`s), and supports nested property paths.

```javascript
/**
 * Filters out records matching any blacklisted key-value pair.
 * 
 * @param {Array<Object>} records - The array of objects to filter.
 * @param {Object} blacklist - Key-value mapping of disallowed attributes.
 *                             Values can be primitives, arrays, or Sets.
 * @returns {Array<Object>} Filtered records.
 */
function filterByBlacklist(records, blacklist) {
  // Pre-normalize blacklist entries into Sets for O(1) lookup
  const normalizedRules = Object.entries(blacklist).map(([key, value]) => {
    let checkFn;

    if (value instanceof Set) {
      checkFn = (val) => value.has(val);
    } else if (Array.isArray(value)) {
      const set = new Set(value);
      checkFn = (val) => set.has(val);
    } else if (typeof value === 'function') {
      // Allows dynamic predicate matching (e.g., regex, range checks)
      checkFn = value;
    } else {
      // Exact primitive match
      checkFn = (val) => val === value;
    }

    return { key, checkFn };
  });

  return records.filter((record) => {
    // If ANY rule matches, reject (exclude) the record
    const isBlacklisted = normalizedRules.some(({ key, checkFn }) => {
      const recordValue = getNestedValue(record, key);
      return recordValue !== undefined && checkFn(recordValue);
    });

    return !isBlacklisted;
  });
}

/**
 * Resolves dot-notated paths like "user.role" or top-level keys like "status".
 */
function getNestedValue(obj, path) {
  if (!obj) return undefined;
  if (!path.includes('.')) return obj[path];
  return path.split('.').reduce((acc, part) => (acc ? acc[part] : undefined), obj);
}

```

---

### 2. Example Usage

```javascript
const users = [
  { id: 1, name: 'Alice', role: 'admin', status: 'active', country: 'US' },
  { id: 2, name: 'Bob', role: 'guest', status: 'suspended', country: 'CA' },
  { id: 3, name: 'Charlie', role: 'moderator', status: 'pending', country: 'DE' },
  { id: 4, name: 'Dave', role: 'user', status: 'banned', country: 'US' },
  { id: 5, name: 'Eve', role: 'user', status: 'active', country: 'RU' },
];

// Define blacklisted rules
const blacklist = {
  // Single primitive match
  role: 'guest',

  // Multiple matched values (via Array or Set)
  status: ['suspended', 'banned'],

  // Dynamic rule via function
  country: (c) => c === 'RU',
};

const cleanUsers = filterByBlacklist(users, blacklist);

console.log(cleanUsers);
/*
Output:
[
  { id: 1, name: 'Alice', role: 'admin', status: 'active', country: 'US' },
  { id: 3, name: 'Charlie', role: 'moderator', status: 'pending', country: 'DE' }
]
*/

```

---

### 3. Nested Objects & Deep Paths

The utility supports deep path checks without runtime errors when intermediary keys are missing:

```javascript
const transactions = [
  { id: 'tx_1', meta: { riskScore: 85, flag: 'bot' }, amount: 200 },
  { id: 'tx_2', meta: { riskScore: 10, flag: 'normal' }, amount: 450 },
  { id: 'tx_3', meta: null, amount: 15 },
];

const safeTransactions = filterByBlacklist(transactions, {
  'meta.flag': ['bot', 'suspicious'],
  'meta.riskScore': (score) => score > 80,
});

console.log(safeTransactions);
/*
Output:
[
  { id: 'tx_2', meta: { riskScore: 10, flag: 'normal' }, amount: 450 },
  { id: 'tx_3', meta: null, amount: 15 }
]
*/

```

---

### 4. Performance Optimization for Large Datasets ($10^5+$ records)

If processing very large arrays:

* **Avoid string splitting on hot paths:** Normalize dot-separated path strings into pre-split arrays once before iterating through records.
* **Use `Set.has()`:** Ensures $O(1)$ lookup rather than calling `Array.prototype.includes()` ($O(M)$) inside the nested loop.

```javascript
function compileBlacklistFilter(blacklist) {
  const compiled = Object.entries(blacklist).map(([path, target]) => {
    const keys = path.split('.');
    const lookup =
      target instanceof Set
        ? target
        : new Set(Array.isArray(target) ? target : [target]);

    return (record) => {
      let curr = record;
      for (let i = 0; i < keys.length; i++) {
        if (curr == null) return false;
        curr = curr[keys[i]];
      }
      return lookup.has(curr);
    };
  });

  return (record) => {
    for (let i = 0; i < compiled.length; i++) {
      if (compiled[i](record)) return false; // Immediate reject
    }
    return true;
  };
}

// Usage:
const isClean = compileBlacklistFilter({ status: ['banned', 'suspended'], role: 'bot' });
const filtered = largeDataset.filter(isClean);

```
