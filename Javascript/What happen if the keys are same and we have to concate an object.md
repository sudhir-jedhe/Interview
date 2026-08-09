When you try to concatenate or merge two JavaScript objects that share the **same keys**, standard JavaScript object rules dictate that **the value from the second (later) object will overwrite the value from the first object**.

Unlike arrays (which append elements), JavaScript objects must have **unique keys**.

Here is how different concatenation methods handle matching keys and how you can preserve values if you don't want them overwritten.

---

### 1. Default Overwriting Behavior

Whether you use the Spread Operator (`...`) or `Object.assign()`, matching keys are overwritten by the rightmost object.

#### Example: Spread Operator (`...`)

```javascript
const obj1 = { name: "Alice", role: "Developer" };
const obj2 = { role: "Manager", age: 30 };

const merged = { ...obj1, ...obj2 };

console.log(merged);
// Output: { name: "Alice", role: "Manager", age: 30 }
// Notice "role" from obj2 ("Manager") replaced "Developer"

```

#### Example: `Object.assign()`

```javascript
const obj1 = { score: 10 };
const obj2 = { score: 20 };

const merged = Object.assign({}, obj1, obj2);

console.log(merged);
// Output: { score: 20 }

```

---

### 2. How to Preserve Values for Matching Keys

If you do not want the values overwritten, you must explicitly define how matching keys should be combined (e.g., combining into an array, adding numbers, or merging strings).

#### Strategy A: Combine Matching Values into an Array

If you want to keep both values under the same key:

```javascript
function concatObjects(obj1, obj2) {
  const result = { ...obj1 };

  for (const key in obj2) {
    if (Object.prototype.hasOwnProperty.call(obj2, key)) {
      if (key in result) {
        // If key exists in both, combine them into an array
        result[key] = Array.isArray(result[key]) 
          ? result[key].concat(obj2[key]) 
          : [result[key], obj2[key]];
      } else {
        result[key] = obj2[key];
      }
    }
  }

  return result;
}

const obj1 = { tags: "react", count: 1 };
const obj2 = { tags: "javascript", count: 5, status: "active" };

console.log(concatObjects(obj1, obj2));
// Output: { tags: ['react', 'javascript'], count: [1, 5], status: 'active' }

```

#### Strategy B: Sum/Accumulate Numeric Values

If the matching keys hold numbers that should be added together:

```javascript
const cart1 = { apples: 2, bananas: 5 };
const cart2 = { apples: 3, oranges: 4 };

const combinedCart = { ...cart1 };

for (const [key, value] of Object.entries(cart2)) {
  combinedCart[key] = (combinedCart[key] || 0) + value;
}

console.log(combinedCart);
// Output: { apples: 5, bananas: 5, oranges: 4 }

```

---

### Summary Checklist

| Method                      | Behavior on Duplicate Keys                                        |
| --------------------------- | ----------------------------------------------------------------- |
| `{ ...obj1, ...obj2 }`      | Overwrites `obj1` values with `obj2` values.                      |
| `Object.assign(obj1, obj2)` | Overwrites `obj1` values with `obj2` values.                      |
| Custom Loop / `reduce`      | Allows combining values (arrays, addition, string concatenation). |
