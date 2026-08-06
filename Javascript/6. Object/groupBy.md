Here is a complete, production-ready implementation of a custom `groupBy` utility function in JavaScript and TypeScript, supporting both **property keys** and **custom callback functions** (similar to Lodash's `_.groupBy` or `Object.groupBy`).

---

### JavaScript Implementation

```javascript
/**
 * Groups the elements of an array based on a given key or callback function.
 *
 * @param {Array} collection - The array to iterate over.
 * @param {Function|string|number} iteratee - The key or function transforming elements to keys.
 * @returns {Object} Returns the composed aggregate object.
 */
function groupBy(collection, iteratee) {
  // Edge case: Handle invalid input gracefully
  if (!Array.isArray(collection) || collection.length === 0) {
    return {};
  }

  // Determine how to resolve the grouping key
  const getKey = typeof iteratee === 'function' 
    ? iteratee 
    : (item) => item?.[iteratee];

  return collection.reduce((result, item) => {
    // Resolve the key for the current item
    const key = getKey(item);

    // Ensure array exists for the given key, then push the item
    if (!Object.prototype.hasOwnProperty.call(result, key)) {
      result[key] = [];
    }
    result[key].push(item);

    return result;
  }, {});
}

```

---

### TypeScript Implementation (Type-Safe)

```typescript
type KeySelector<T, K extends PropertyKey> = (item: T) => K;

/**
 * Type-safe groupBy implementation supporting selector functions or key strings.
 */
function groupBy<T, K extends PropertyKey>(
  collection: T[],
  iteratee: KeySelector<T, K> | keyof T
): Record<K, T[]> {
  if (!Array.isArray(collection) || collection.length === 0) {
    return {} as Record<K, T[]>;
  }

  const getKey: KeySelector<T, K> = 
    typeof iteratee === 'function'
      ? iteratee
      : (item: T) => item[iteratee] as unknown as K;

  return collection.reduce((acc, item) => {
    const key = getKey(item);

    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(item);

    return acc;
  }, {} as Record<K, T[]>);
}

```

---

### Usage Examples

#### 1. Grouping by Callback Function (e.g., `Math.floor`)

```javascript
const numbers = [6.1, 4.2, 6.3, 4.8];
console.log(groupBy(numbers, Math.floor));
// Output:
// {
//   '4': [4.2, 4.8],
//   '6': [6.1, 6.3]
// }

```

#### 2. Grouping by Object Property String

```javascript
const users = [
  { name: 'Alice', role: 'admin' },
  { name: 'Bob', role: 'user' },
  { name: 'Charlie', role: 'admin' },
  { name: 'David', role: 'user' }
];

console.log(groupBy(users, 'role'));
// Output:
// {
//   admin: [
//     { name: 'Alice', role: 'admin' },
//     { name: 'Charlie', role: 'admin' }
//   ],
//   user: [
//     { name: 'Bob', role: 'user' },
//     { name: 'David', role: 'user' }
//   ]
// }

```

#### 3. Dynamic Property Computation (e.g., length or condition)

```javascript
const words = ['one', 'two', 'three', 'four', 'five'];

console.log(groupBy(words, 'length'));
// Output:
// {
//   '3': ['one', 'two'],
//   '5': ['three'],
//   '4': ['four', 'five']
// }

```

---

### Native JavaScript Note (`Object.groupBy`)

If you are targeting modern JavaScript runtimes, ECMAScript includes the native **`Object.groupBy()`** static method:

```javascript
const inventory = [
  { name: "asparagus", type: "vegetables", quantity: 5 },
  { name: "bananas", type: "fruit", quantity: 0 },
  { name: "goat", type: "meat", quantity: 23 },
];

const result = Object.groupBy(inventory, ({ type }) => type);

```
