Converting JavaScript objects into `Map` instances allows you to handle complex merging logic—such as preserving duplicate key histories, merging nested objects, or aggregating numeric metrics—because Maps provide built-in iteration methods (`.entries()`, `.get()`, `.set()`) and allow non-string keys.

---

## 1. Converting Objects to Maps and Vice Versa

You can initialize a `Map` directly from an object using `Object.entries()`, and convert it back to an object using `Object.fromEntries()`.

```javascript
const obj1 = { apples: 2, bananas: 5 };

// Convert Object -> Map
const map = new Map(Object.entries(obj1));

// Convert Map -> Object
const mergedObj = Object.fromEntries(map);

```

---

## 2. Generic Map Merging Function with Custom Rules

By using a `Map`, you can write a clean loop that checks if a key already exists (`map.has(key)`), retrieves the current value (`map.get(key)`), applies your custom merging logic, and updates the key (`map.set(key, mergedValue)`).

Here is a complete utility function that merges any number of objects into a single object or `Map` using a custom merge handler:

```javascript
/**
 * Merges multiple objects using a Map and a custom resolver for matching keys.
 * 
 * @param {Function} mergeStrategy - Function (key, existingVal, newVal) => mergedVal
 * @param {...Object} objects - Objects to merge
 * @returns {Map} - Merged Map instance
 */
function mergeObjectsWithMap(mergeStrategy, ...objects) {
  const map = new Map();

  for (const obj of objects) {
    for (const [key, value] of Object.entries(obj)) {
      if (map.has(key)) {
        // Resolve conflict using custom logic
        const existingValue = map.get(key);
        map.set(key, mergeStrategy(key, existingValue, value));
      } else {
        // Set new key
        map.set(key, value);
      }
    }
  }

  return map;
}

```

---

## 3. Practical Use Cases for Map Merging

### Scenario A: Accumulating / Combining Values into Arrays

If keys overlap, combine their values into an array (preserving duplicate values rather than overwriting them).

```javascript
const obj1 = { role: "admin", tags: "v1" };
const obj2 = { role: "editor", tags: "v2", active: true };

// Strategy: Push matching keys into an array
const mergeIntoArray = (key, existingVal, newVal) => {
  return Array.isArray(existingVal)
    ? [...existingVal, newVal]
    : [existingVal, newVal];
};

const mergedMap = mergeObjectsWithMap(mergeIntoArray, obj1, obj2);

// Convert back to Object
const result = Object.fromEntries(mergedMap);

console.log(result);
// Output:
// {
//   role: ['admin', 'editor'],
//   tags: ['v1', 'v2'],
//   active: true
// }

```

---

### Scenario B: Summing Numeric Totals Across Objects

Useful for shopping carts, inventory tracking, or analytics aggregations.

```javascript
const cart1 = { apples: 2, bananas: 5, oranges: 1 };
const cart2 = { apples: 3, bananas: 2, grapes: 4 };

// Strategy: Add numbers together
const sumStrategy = (key, existingVal, newVal) => existingVal + newVal;

const aggregatedCartMap = mergeObjectsWithMap(sumStrategy, cart1, cart2);

console.log(Object.fromEntries(aggregatedCartMap));
// Output: { apples: 5, bananas: 7, oranges: 1, grapes: 4 }

```

---

### Scenario C: Deep Merging Nested Objects Inside Map

If object properties contain nested objects, you can recursively merge them:

```javascript
const userProfile1 = {
  id: 101,
  preferences: { theme: "dark", notifications: true },
};

const userProfile2 = {
  id: 101,
  preferences: { fontSize: "large", notifications: false },
};

// Strategy: If both values are objects, merge them recursively
const deepMergeStrategy = (key, existingVal, newVal) => {
  if (
    typeof existingVal === 'object' && existingVal !== null &&
    typeof newVal === 'object' && newVal !== null &&
    !Array.isArray(existingVal)
  ) {
    // Perform deep merge
    return Object.fromEntries(
      mergeObjectsWithMap(deepMergeStrategy, existingVal, newVal)
    );
  }
  return newVal; // Fallback to latest value for primitive types
};

const mergedProfiles = mergeObjectsWithMap(deepMergeStrategy, userProfile1, userProfile2);

console.log(Object.fromEntries(mergedProfiles));
// Output:
// {
//   id: 101,
//   preferences: { theme: 'dark', notifications: false, fontSize: 'large' }
// }

```

---

## Why Use `Map` Over Plain Objects for Merging?

1. **Explicit API:** `.has()`, `.get()`, and `.set()` make conflict checks explicit and clean.
2. **Performance:** `Map` is optimized for frequent key additions, lookups, and updates compared to plain objects.
3. **No Prototype Conflicts:** Plain objects inherit properties like `toString` or `valueOf`, which can cause key collisions if object keys match prototype method names. `Map` holds zero inherited key collisions.
