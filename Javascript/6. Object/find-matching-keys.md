This is a great series of examples showing how to work with JavaScript objects and find keys based on specific conditions, whether it's for **all matching keys**, the **first matching key**, or the **last matching key**. Let's walk through each approach in detail and discuss the solutions.

### 1. **Find All Matching Keys** (`findKeys`)

To find **all the keys** in an object that match a certain condition, we can use `Object.keys()` to retrieve the keys of the object as an array. Then, we apply `filter()` to iterate over the keys and test whether the values meet the desired condition.

```js
const findKeys = (obj, fn) =>
  Object.keys(obj).filter(key => fn(obj[key], key, obj));

const ages = {
  Leo: 20,
  Zoey: 21,
  Jane: 20,
};

console.log(findKeys(ages, x => x === 20));  // Output: [ 'Leo', 'Jane' ]
```

### Explanation

- **`Object.keys(obj)`**: This method returns an array of keys from the given object `obj`.
- **`.filter()`**: We filter the keys by applying the provided condition in the callback function (`fn`). The callback receives the value (`obj[key]`), the key (`key`), and the full object (`obj`).
- The result is an array of keys whose values match the condition (in this case, `x === 20`).

### Simplified Version for Matching Against a Specific Value

If you're only interested in matching a specific value (instead of using a more complex condition), you can simplify the `findKeys` function to this:

```js
const findKeys = (obj, value) =>
  Object.keys(obj).filter(key => obj[key] === value);

console.log(findKeys(ages, 20));  // Output: [ 'Leo', 'Jane' ]
```

This makes the implementation more concise by removing the need for a callback function, and instead directly comparing the value against `obj[key]`.

---

### 2. **Find the First Matching Key** (`findKey`)

When you only need to find the **first key** that matches a given condition, `Array.prototype.find()` is a better option than using `filter()`, as it stops once it finds the first match. This can improve performance in cases where the match is found early.

```js
const findKey = (obj, fn) =>
  Object.keys(obj).find(key => fn(obj[key], key, obj));

const data = {
  barney: { age: 36, active: true },
  fred: { age: 40, active: false },
  pebbles: { age: 1, active: true }
};

console.log(findKey(data, x => x['active']));  // Output: 'barney'
```

### Explanation

- **`Object.keys(obj)`**: Retrieves all keys from the object `obj`.
- **`.find()`**: It returns the **first key** where the condition is true. The condition is tested with the callback `fn`, which takes the value (`obj[key]`), the key, and the full object.

In the example above, it returns `'barney'` because `barney` is the first person who is `active`.

---

### 3. **Find the Last Matching Key** (`findLastKey`)

JavaScript versions that support `Array.prototype.findLast()` allow us to easily find the **last matching key**. However, for older versions of JavaScript (ES2019 and earlier), we can reverse the keys and use `find()` to simulate this functionality.

#### With `findLast()` (ES2022 and newer)

```js
const findLastKey = (obj, fn) =>
  Object.keys(obj).findLast(key => fn(obj[key], key, obj));

console.log(findLastKey(data, x => x['active']));  // Output: 'pebbles'
```

### Explanation

- **`findLast()`**: This method returns the last element in the array that satisfies the condition (as opposed to `find()`, which returns the first match).

In the example above, it returns `'pebbles'` because `pebbles` is the last object with `active: true`.

#### For older versions of JavaScript (before ES2022), we can simulate `findLast()`

```js
const findLastKey = (obj, fn) =>
  Object.keys(obj).reverse().find(key => fn(obj[key], key, obj));

console.log(findLastKey(data, x => x['active']));  // Output: 'pebbles'
```

### Explanation

- **Reversing the keys**: `Object.keys(obj).reverse()` reverses the array of keys so that we can search for the **last** match instead of the first.
- **`.find()`**: Once the keys are reversed, we can apply `find()` to return the first match from the reversed array, which will be the last matching key in the original object.

---

### Summary of the Three Functions

| Function      | Description                                  | Example Input                                                                                       | Example Output      |
| ------------- | -------------------------------------------- | --------------------------------------------------------------------------------------------------- | ------------------- |
| `findKeys`    | Find all keys that match a condition.        | `{ Leo: 20, Zoey: 21, Jane: 20 }`, `20`                                                             | `[ 'Leo', 'Jane' ]` |
| `findKey`     | Find the first key that matches a condition. | `{ barney: { age: 36, active: true }, fred: { age: 40, active: false } }`, `x => x.active`          | `'barney'`          |
| `findLastKey` | Find the last key that matches a condition.  | `{ barney: { active: true }, fred: { active: false }, pebbles: { active: true } }`, `x => x.active` | `'pebbles'`         |

---

### Performance Considerations

- **`findKeys`**: Since this uses `filter()`, it will always iterate over all keys in the object. This is fine for small objects but can become inefficient for large objects or complex nested structures.
- **`findKey`**: Uses `find()`, so it will stop as soon as a match is found, making it more efficient when you're only interested in the **first match**.
- **`findLastKey`**: For modern environments, `findLast()` provides a more concise solution, but if you're targeting older JavaScript versions, reversing the keys and using `find()` is an effective workaround.

---

### Conclusion

These utilities provide an elegant way to find keys in JavaScript objects based on specific conditions, whether you need all matching keys, the first match, or the last match. By leveraging `Object.keys()` and array methods like `filter()`, `find()`, and `findLast()`, you can efficiently perform searches on your objects.
