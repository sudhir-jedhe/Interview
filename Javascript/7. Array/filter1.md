The various examples and solutions you've shared cover a range of array manipulation tasks, from implementing custom `filter` methods to handling scenarios such as finding values, removing duplicates, and filtering based on specific conditions. Let’s break down and highlight the key points of these examples and what they are solving:

### 1. **Custom `filter` Implementation**:

The first part of the code provides a custom implementation of the `filter` method using `Array.prototype`. This example uses the basic `for` loop to iterate through the array and apply a callback function. The method pushes elements that pass the callback condition into a new array.

```javascript
Array.prototype.customFilter = function myFilter(callback, thisArg) {
  const newArray = [];
  for (let i = 0; i < this.length; i += 1) {
    if (callback.call(thisArg, this[i], i, this)) {
      newArray.push(this[i]);
    }
  }
  return newArray;
};
```

This is a great approach to replicate the behavior of `filter()`. It also supports the optional `thisArg` parameter, which can be passed as a second argument to `customFilter`.

### 2. **Generator-based Filter**:

The second code snippet defines a generator function `filter` that lazily filters elements based on a predicate. This is efficient because the filtering happens on demand as you iterate over the generator, instead of creating a whole new array.

```javascript
function* filter(collection, predicate) {
  for (const value of collection) {
    if (predicate(value)) {
      yield value;
    }
  }
}

module.exports = filter;
```

You can use this approach when you need to process a large dataset or handle filtering in a memory-efficient manner. This also prevents creating an unnecessary array if you only need to process one or a few matching elements at a time.

### 3. **Custom `filter` using `reduce`**:

Here, you're using `reduce` to create a `filter` function:

```javascript
const filter = (array, func) =>
  reduce(
    array,
    (result, item) => (func(item) ? result.concat(item) : result),
    []
  );
```

The `reduce` function accumulates a filtered result into an array by pushing items that pass the condition defined by `func`. This is a very elegant and functional programming-inspired approach.

### 4. **Removing Duplicates with `filter`**:

This is a common use case where you need to remove duplicate values from an array:

```javascript
let arr = ["apple", "mango", "apple", "orange", "mango", "mango"];
function removeDuplicates(arr) {
  return arr.filter((item, index) => arr.indexOf(item) === index);
}
console.log(removeDuplicates(arr));  // Output: ["apple", "mango", "orange"]
```

Here, `arr.indexOf(item) === index` ensures that only the first occurrence of each item is kept. This effectively removes duplicates.

### 5. **Filtering Positive Numbers**:

This is an example of filtering positive numbers from an array:

```javascript
let nums = [4, -5, 3, 2, -1, 7, -6, 8, 9];
let pos_nums = nums.filter((e) => e > 0);
console.log(pos_nums);  // Output: [4, 3, 2, 7, 8, 9]
```

This uses a simple predicate to check if the number is positive. It's a straightforward use case for filtering arrays based on conditions.

### 6. **Using `this` in Filtered Function (Range Filtering)**:

This example shows how you can filter based on an external context (like an object):

```javascript
function isInRange(val) {
  return val >= this.lower && val <= this.upper;
}

let range = {
  lower: 1,
  upper: 10,
};

let data = [-2, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
let res = data.filter(isInRange, range);
console.log(res);  // Output: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
```

Here, the filtering function uses `this` to access an external range object and apply the filtering condition. This is a good demonstration of how `this` can be used in combination with `Array.filter`.

### 7. **Filtering Only Numbers**:

This example filters out only the numbers from an array of mixed data types:

```javascript
function isNumber(value) {
  return typeof value === "number";
}

let data = [10, null, "30", 1.4, "falcon", undefined, true, 17];
let res = data.filter(isNumber);
console.log(res);  // Output: [10, 1.4, 17]
```

### 8. **Complex Filtering (Users Example)**:

You also show a real-world example of filtering an array of objects:

```javascript
const users = [
  { name: "John", city: "London", born: "2001-04-01" },
  { name: "Lenny", city: "New York", born: "1997-12-11" },
  { name: "Andrew", city: "Boston", born: "1987-02-22" },
  { name: "Peter", city: "Prague", born: "1936-03-24" },
  { name: "Anna", city: "Bratislava", born: "1973-11-18" },
  { name: "Albert", city: "Bratislava", born: "1940-12-11" },
  { name: "Adam", city: "Trnava", born: "1983-12-01" },
  { name: "Robert", city: "Bratislava", born: "1935-05-15" },
  { name: "Robert", city: "Prague", born: "1998-03-14" },
];

let res = users.filter((user) => user.city === "Bratislava");
console.log(res);  // Output: Users from Bratislava
```

You filter users based on specific conditions (e.g., city name, or even more complex logic such as age).

### 9. **Finding and Removing a Single Value**:

Finally, you also describe how to find and remove a specific value using methods like `findIndex` and `splice`:

```javascript
const arr = [1, 2, 3, 4, 5];
const index = arr.findIndex(x => x === 3);
arr.splice(index, 1);  // Output: [1, 2, 4, 5]
```

This is a common task where you want to find the index of an element and then remove it from the array. This method mutates the original array and is an efficient approach when working with small or mutable arrays.

---

### Summary:

These examples demonstrate a variety of use cases for filtering and manipulating arrays in JavaScript. From creating custom filters using `reduce` or `for` loops to handling more complex scenarios like removing duplicates and filtering objects based on conditions, these are powerful patterns to understand. Additionally, using methods like `find` and `findIndex` can offer faster, simpler alternatives when you're only looking for a single result or need to remove specific elements from an array.