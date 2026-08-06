### Converting Arrays of Arrays to Arrays of Objects

You've provided an example of converting an array of arrays into an array of objects in two different scenarios. Let's break down and explain each part.

---

### 1. **Converting an Array of Key-Value Pairs to Objects**

Given the array:

```javascript
const arrayOfArrays = [
  ["name", "Alice"],
  ["age", 30],
  ["city", "New York"],
];
```

You can convert this array into an array of objects using `Array.prototype.map()` in combination with destructuring:

```javascript
const arrayOfObjects = arrayOfArrays.map(([key, value]) => ({ [key]: value }));

console.log(arrayOfObjects);
// Output: [{ name: 'Alice' }, { age: 30 }, { city: 'New York' }]
```

**Explanation:**
- `map(([key, value]) => ({ [key]: value }))` destructures each sub-array into `key` and `value`, and then constructs an object where the `key` becomes the property name and the `value` becomes the property value.
- The resulting array contains multiple objects where each object has a single property.

---

### 2. **Converting an Array of Arrays to an Array of Objects with Specific Keys**

Now, given the following `users` array:

```javascript
const users = [
  ["David", "USA", 30],
  ["Billy", "Japan", 35],
  ["Mike", "Singapore", 50],
];
```

You want to map each sub-array to an object with keys like `name`, `country`, and `age`. You can achieve this in a couple of ways:

#### Option 1: Using Destructuring in the `map` Method

```javascript
const output = users.map(([name, country, age]) => {
  return { name, country, age };
});

console.log(output);
// Output:
// [
//   { name: 'David', country: 'USA', age: 30 },
//   { name: 'Billy', country: 'Japan', age: 35 },
//   { name: 'Mike', country: 'Singapore', age: 50 }
// ]
```

**Explanation:**
- `map(([name, country, age]) => ({ name, country, age }))` destructures each sub-array into `name`, `country`, and `age`, and then returns an object with these properties.
- The resulting array is an array of objects, each representing a user with the properties `name`, `country`, and `age`.

#### Option 2: Using a Separate Variable to Destructure Inside the Map

```javascript
const output = users.map((user) => {
  const [name, country, age] = user;
  return { name, country, age };
});

console.log(output);
// Output:
// [
//   { name: 'David', country: 'USA', age: 30 },
//   { name: 'Billy', country: 'Japan', age: 35 },
//   { name: 'Mike', country: 'Singapore', age: 50 }
// ]
```

**Explanation:**
- This is essentially the same as Option 1 but uses a separate `const` statement to destructure the `user` array inside the map function.
- Both approaches are valid and will give you the same result.

---

### Conclusion

You can easily convert arrays of arrays into objects by leveraging JavaScript's `map()` and array destructuring. Whether you're converting key-value pairs into objects or transforming arrays of multiple values into a structured object format, both techniques are useful for data transformation.

