### 4. **Insertion and Removal of Elements in Arrays Using `splice()`**

The `splice()` method in JavaScript allows you to remove, replace, and insert elements in an array at a given index. The syntax is:

```javascript
arr.splice(startIndex, deleteCount, item1, item2, ...)
```

- **startIndex**: The index at which to start changing the array.
- **deleteCount**: The number of items to remove (0 for no removal).
- **item1, item2, ...**: Items to add at the specified index.

**Examples:**

1. **Remove Elements:**
   ```javascript
   const arr = [1, 2, 2, 3];
   const position = 2;
   const count = 1;
   arr.splice(position, count); // Removes 1 element at index 2
   console.log(arr); // Output: [1, 2, 3]
   ```

2. **Insert Elements:**
   ```javascript
   const arr = [1, 2, 4, 5];
   const position = 2;
   arr.splice(position, 0, 3); // Insert 3 at index 2
   console.log(arr); // Output: [1, 2, 3, 4, 5]
   ```

### 5. **Ways to Empty an Array with Values**

You can empty an array using several methods. Here are the most common ones:

1. **Assign a New Empty Array:**
   ```javascript
   let arr = [1, 2, 3];
   arr = [];
   console.log(arr); // Output: []
   ```

2. **Set Length to 0:**
   ```javascript
   let arr = [1, 2, 3];
   arr.length = 0;
   console.log(arr); // Output: []
   ```

3. **Use `pop()` Method:**
   ```javascript
   let arr = [1, 2, 3];
   while (arr.length > 0) {
     arr.pop();
   }
   console.log(arr); // Output: []
   ```

4. **Use `shift()` Method:**
   ```javascript
   let arr = [1, 2, 3];
   while (arr.length > 0) {
     arr.shift();
   }
   console.log(arr); // Output: []
   ```

5. **Use `splice()` Method:**
   ```javascript
   let arr = [1, 2, 3];
   arr.splice(0, arr.length); // Removes all elements
   console.log(arr); // Output: []
   ```

### 6. **Check If the Given Input is an Array or Not**

To check whether a given value is an array, you can use `Array.isArray()` or `Object.prototype.toString()`.

1. **Using `Array.isArray()`**:
   ```javascript
   const arr = [1, 2, 3];
   console.log(Array.isArray(arr)); // Output: true

   const obj = {};
   console.log(Array.isArray(obj)); // Output: false
   ```

2. **Using `Object.prototype.toString.call()`**:
   ```javascript
   const arr = [1, 2, 3];
   console.log(Object.prototype.toString.call(arr) === "[object Array]"); // Output: true

   const obj = {};
   console.log(Object.prototype.toString.call(obj) === "[object Array]"); // Output: false
   ```

### 8. **Create an Array by Removing All Holes**

In JavaScript arrays, "holes" refer to undefined values, often created when elements are deleted by index using the `delete` operator.

To remove holes in an array, you can use `filter()`:

```javascript
let arr = [1, 2, , 4, , 5]; // Array with holes
let uniqueArr = arr.filter(value => value !== undefined);
console.log(uniqueArr); // Output: [1, 2, 4, 5]
```

### 9. **Optimize Logical Checks for Specific Values Using `includes()`**

Instead of writing multiple logical conditions like `browser === "chrome" || browser === "firefox"`, you can optimize it using `Array.includes()`:

1. **Example 1:**
   ```javascript
   const browserList = ["chrome", "firefox", "IE", "safari"];
   if (browserList.includes(browser)) {
     console.log("Valid browser");
   }
   ```

2. **Example 2:**
   ```javascript
   const browserList = ["chrome", "firefox", "IE", "safari"];
   if (!browserList.includes(browser)) {
     console.log("Invalid browser");
   }
   ```

### 11. **Store Values in a Set**

A `Set` in JavaScript is a collection of unique values. It can store values of any type, and it automatically eliminates duplicates.

```javascript
const set = new Set();
set.add(1);
set.add(true);
set.add("text");
set.add(1); // Duplicate value, will not be added

console.log(set); // Output: Set { 1, true, "text" }

const set2 = new Set([1, 2, 3]);
console.log(set2); // Output: Set { 1, 2, 3 }
```

### 12. **Store Key-Value Pairs in a Map**

A `Map` is a collection of key-value pairs, where keys can be of any type. Unlike objects, the keys in a `Map` are ordered.

```javascript
const map = new Map();
map.set(1, "One");
map.set("key", "Value");
map.set(true, "True");

console.log(map); // Output: Map { 1 => "One", "key" => "Value", true => "True" }

const map2 = new Map([
  [1, "One"],
  [2, "Two"],
  [3, "Three"]
]);

console.log(map2); // Output: Map { 1 => "One", 2 => "Two", 3 => "Three" }
```

### 13. **Iterating Over a Set**

You can iterate over a `Set` using a `for...of` loop or the `forEach()` method:

```javascript
const set = new Set([1, 2, 3]);

// Using for...of loop
for (let val of set) {
  console.log(val); // Output: 1, 2, 3
}

// Using forEach() method
set.forEach(value => {
  console.log(value); // Output: 1, 2, 3
});
```

### 14. **Iterating Over a Map**

You can iterate over a `Map` using a `for...of` loop or the `forEach()` method. You can also iterate over the keys using `.keys()` and values using `.values()`.

```javascript
const map = new Map([
  [1, "One"],
  [2, "Two"],
  [3, "Three"]
]);

// Using for...of loop
for (let [key, value] of map) {
  console.log(key, value); // Output: 1 "One", 2 "Two", 3 "Three"
}

// Using forEach() method
map.forEach((value, key) => {
  console.log(key, value); // Output: 1 "One", 2 "Two", 3 "Three"
});
```

### 15. **Difference Between Map and Object for Key-Value Pairs**

1. **Object:**
   - Keys are always strings (or symbols).
   - Keys are inherited from the object prototype.
   - Object keys are unordered.

2. **Map:**
   - Keys can be any value (objects, arrays, functions, primitive types).
   - Map maintains insertion order of keys.
   - `Map` has a `.size` property to easily get the number of key-value pairs.

```javascript
// Object Example
const obj = {};
obj[1] = "One"; // Key as a number (converted to string)
obj[{}] = "Object"; // Object as a key (converted to string)
console.log(obj); // Output: { '1': 'One', '[object Object]': 'Object' }

// Map Example
const map = new Map();
map.set(1, "One");
map.set("key", "Value");
map.set({}, "Object");
console.log(map); // Output: Map { 1 => 'One', 'key' => 'Value', {} => 'Object' }
```

### Conclusion:

Maps offer better performance for key-value pairs with various types of keys, whereas objects are simpler and generally better for basic data structures. Use `Map` when you need more flexibility and performance for handling key-value pairs, and `Object` for simpler key-value pair data where keys are strings.