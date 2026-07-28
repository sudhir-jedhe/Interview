Below are the answers for each problem along with code examples:

### 1. **Concatenate two arrays or duplicate if only one is passed**:

To concatenate two arrays, we can either use the spread operator (`...`) or `concat`. If only one array is passed, we duplicate it by concatenating it with itself.

```javascript
function mergeArray(arr1, arr2 = arr1) {
  return [...arr1, ...arr2];
}

// Example usage:
console.log(mergeArray([1, 2, 3])); // Output: [1, 2, 3, 1, 2, 3]
console.log(mergeArray([1, 2], [3, 4])); // Output: [1, 2, 3, 4]
```

---

### 2. **Replace 3 center elements of the first array with the 3 center elements of the second array**:

We can use `splice` and `slice` to replace the middle 3 elements of an array.

```javascript
const a = [1, 2, 3, 4, 5];
const b = [4, 0, 0, 0, 8];

// Find the starting position for the center 3 elements of both arrays
const startPositionFor1stArray = a.length / 2 - 1;
const startPositionFor2ndArray = b.length / 2 - 1;

// Replace the center elements of `a` with the center elements of `b`
a.splice(
  startPositionFor1stArray,
  3,
  ...b.slice(startPositionFor2ndArray, startPositionFor2ndArray + 3),
);

console.log(a); // Output: [1, 2, 0, 0, 0, 8, 5]
```

---

### 3. **Sort the given array of integers in ascending or descending order**:

We can use `sort` to arrange numbers in ascending or descending order by using a comparator function.

```javascript
const arr = [5, 2, 9, 1, 5, 6];

// Ascending order
arr.sort((a, b) => a - b);
console.log(arr); // Output: [1, 2, 5, 5, 6, 9]

// Descending order
arr.sort((a, b) => b - a);
console.log(arr); // Output: [9, 6, 5, 5, 2, 1]
```

For sorting objects by a property, like `age`:

```javascript
const objects = [
  { name: "Alice", age: 25 },
  { name: "Bob", age: 30 },
  { name: "Carol", age: 27 },
];

// Sort by age in ascending order
objects.sort((a, b) => a.age - b.age);
console.log(objects);
```

---

### 4. **Sort the array of objects by author's last name**:

You can extract the last name of the author and use it for sorting.

```javascript
const books = [
  { name: "Harry Potter", author: "Joanne Rowling" },
  { name: "Warcross", author: "Marie Lu" },
  { name: "The Hunger Games", author: "Suzanne Collins" },
];

books.sort((book1, book2) => {
  const authorLastName1 = book1.author.split(" ")[1];
  const authorLastName2 = book2.author.split(" ")[1];
  return authorLastName1.localeCompare(authorLastName2); // Ascending order
});

console.log(books);
```

---

### 5. **Square all the positive numbers of the array**:

Using `filter` to get positive numbers and `map` to square them.

```javascript
const arr = [-4, -1, 2, 3, 5];

const squaredPositiveArr = arr
  .filter((value) => value >= 0) // Filter positive numbers
  .map((value) => value * value); // Square the positive numbers

console.log(squaredPositiveArr); // Output: [4, 9, 25]
```

---

### 6. **Generate an array with a range of numbers and shuffle them**:

To generate a range of numbers, use a loop or a generator function, and then shuffle them using `sort` or `splice`.

```javascript
function rangeGen(start = 1, end = 0) {
  const arr = [];
  for (let i = start; i <= end; i++) {
    arr.push(i);
  }
  return arr;
}

const arr = rangeGen(1, 10); // [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
arr.sort(() => 0.5 - Math.random()); // Shuffle the array
console.log(arr);
```

Or using a generator function:

```javascript
function* rangeGen(start = 1, end = 0) {
  for (let i = start; i <= end; i++) {
    yield i;
  }
}

let arr = [...rangeGen(1, 10)]; // [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
let shuffledArr = [];
const length = arr.length;

for (let i = 0; i < length; i++) {
  shuffledArr.push(...arr.splice(Math.floor(Math.random() * arr.length), 1));
}

console.log(shuffledArr);
```

---

### 7. **Check if the user with the name "John" exists in an array of objects**:

We can use `some` or `find` to check if a user exists by name.

```javascript
const arr = [{ name: "Alice" }, { name: "Bob" }, { name: "John" }];

const doesJohnExist = arr.some((obj) => obj.name === "John");
console.log(doesJohnExist); // Output: true

const johnObject = arr.find((obj) => obj.name === "John");
console.log(johnObject); // Output: { name: 'John' }
```

---

### 8. **Generate an array of objects with `id` and `fullName` from an array of objects with `firstName` and `lastName`**:

Using `map`, you can generate the new array format.

```javascript
const arr = [
  { id: 1, firstName: "John", lastName: "Doe" },
  { id: 2, firstName: "Jane", lastName: "Smith" },
];

const employeesListWithFullName = arr.map((obj) => ({
  id: obj.id,
  fullName: `${obj.firstName} ${obj.lastName}`,
}));

console.log(employeesListWithFullName);
```

---

### 9. **Calculate the sum of all values in an array**:

You can use `reduce` to calculate the sum efficiently.

```javascript
const arr = [1, 2, 3, 4, 5];

const sum = arr.reduce((acc, value) => acc + value, 0);
console.log(sum); // Output: 15
```

---

### 10. **Get the maximum value from an array along with its index**:

Use `Math.max` and `indexOf` to get the maximum value and its index.

```javascript
const arr = [1, 3, 7, 0, 5];

const max = Math.max(...arr);
const maxIndex = arr.indexOf(max);
console.log(`Max Value: ${max}, Index: ${maxIndex}`); // Output: Max Value: 7, Index: 2
```

Alternatively, using `reduce`:

```javascript
const max = arr.reduce((a, b) => (a > b ? a : b));
const maxIndex = arr.indexOf(max);
console.log(`Max Value: ${max}, Index: ${maxIndex}`);
```

---

These solutions should handle the problems efficiently using JavaScript's array methods like `map`, `filter`, `reduce`, `sort`, `splice`, and `concat`.

Here are the solutions for the problems you've outlined:

### 11. **Find the number of occurrences of the minimum value in a numbers list**:

You can use `Math.min()` to find the minimum value and then `filter()` to count how many times that minimum value appears in the array.

```javascript
const arr = [4, 1, 3, 1, 2, 1];
const min = Math.min(...arr);
const minArr = arr.filter((value) => value === min);
console.log(minArr.length); // Output: 3
```

---

### 12. **Create an array of length `n` with all the values set to 10**:

You can use the `fill()` method to fill all elements in an array with the value 10.

```javascript
const n = 5;
const arr = new Array(n).fill(10);
console.log(arr); // Output: [10, 10, 10, 10, 10]
```

---

### 13. **Remove duplicates from an array**:

You can use `Set` to automatically remove duplicate values from the array. Convert the set back to an array with the spread operator.

```javascript
const arr = [1, 2, 2, 3, 4, 4, 5];
const distinctArr = [...new Set(arr)];
console.log(distinctArr); // Output: [1, 2, 3, 4, 5]
```

---

### 14. **Design a `flat` function to flatten an array to any depth**:

You can recursively flatten an array using `flat()` or by manually checking if an element is an array and then flattening it.

```javascript
function flat(arr) {
  const flatArr = [];
  arr.forEach((value) => {
    if (Array.isArray(value)) {
      flatArr.push(...flat(value)); // Recursively flatten nested arrays
    } else {
      flatArr.push(value);
    }
  });
  return flatArr;
}

const nestedArray = [1, [2, [3, 4], 5], 6];
console.log(flat(nestedArray)); // Output: [1, 2, 3, 4, 5, 6]
```

---

### 15. **Check if all students have passed (marks >= 40)**:

You can use the `every()` method to check if all students have passed the marks condition.

```javascript
const students = [
  { name: "Alice", marks: 50 },
  { name: "Bob", marks: 60 },
  { name: "Charlie", marks: 70 },
];

const isAllPass = students.every((student) => student.marks >= 40);
console.log(isAllPass); // Output: true
```

---

### 16. **Get the average of all salaries greater than 10,000 from the "IT" department**:

First, filter employees based on salary and department, then calculate the average salary.

```javascript
const employees = [
  { name: "John", salary: 12000, dept: "IT" },
  { name: "Jane", salary: 15000, dept: "IT" },
  { name: "Alice", salary: 8000, dept: "HR" },
];

const itEmployeesWithSalaryGT10K = employees.filter(
  (employee) => employee.salary > 10000 && employee.dept === "IT",
);
const itTotalSalaryGT10K = itEmployeesWithSalaryGT10K.reduce(
  (acc, value) => acc + value.salary,
  0,
);
const itAvgSalaryGT10K = itTotalSalaryGT10K / itEmployeesWithSalaryGT10K.length;

console.log(itAvgSalaryGT10K); // Output: 13500
```

---

### 17. **Extract the list of all elements from the two lists**:

To combine the elements from two arrays without duplicates, use the `Set` data structure.

```javascript
const arr1 = [1, 2, 3];
const arr2 = [3, 4, 5];

const unionArr = [...new Set([...arr1, ...arr2])];
console.log(unionArr); // Output: [1, 2, 3, 4, 5]
```

---

### 18. **Get the list of all distinct elements present in both lists** (Intersection of arrays):

To find common elements between two arrays, use `filter()` combined with `includes()` or `Set`.

```javascript
const arr1 = [1, 2, 3];
const arr2 = [2, 3, 4];

const intersectionArr = arr1.filter((value) => arr2.includes(value));
const distinctIntersectionArr = [...new Set(intersectionArr)];

console.log(distinctIntersectionArr); // Output: [2, 3]
```

Or using `Set` for better performance:

```javascript
const set1 = new Set(arr1);
const set2 = new Set(arr2);
const distinctIntersectionArr = [...set1].filter((value) => set2.has(value));
console.log(distinctIntersectionArr); // Output: [2, 3]
```

---

### 19. **Extract the list of elements present only in the first list**:

To get the elements that are only present in the first list, filter the elements in the first list that are not in the second list.

```javascript
const arr1 = [1, 2, 3, 4];
const arr2 = [3, 4, 5];

const onlyInFirstArr = [...new Set(arr1)].filter(
  (value) => !new Set(arr2).has(value),
);
console.log(onlyInFirstArr); // Output: [1, 2]
```

---

### 20. **Create a function named "average" to calculate the average of an array**:

To add an `average` method to the `Array.prototype`, we can do this:

```javascript
Array.prototype.average = function () {
  const total = this.reduce((acc, value) => acc + value, 0);
  return total / this.length;
};

const arr = [10, 20, 30, 40, 50];
console.log(arr.average()); // Output: 30
```

### Notes:

- The method `Array.prototype.average` will now be available to all array instances, making it accessible through `arr.average()` directly on any array.

---

These solutions cover all the problems and demonstrate how to manipulate arrays in JavaScript using various built-in methods like `map()`, `filter()`, `reduce()`, `some()`, `concat()`, `Set`, `splice()`, and `fill()`.

Here are the solutions for the additional problems you've mentioned:

---

### 21. **Eliminate duplicate objects in an array based on an 'id' property, retaining the object with the higher 'rank'**:

You can use a `Map` to store objects by their `id` and ensure that only the object with the highest rank for each `id` is retained.

```javascript
const arr = [
  { id: 1, name: "emp1", rank: 4 },
  { id: 2, name: "emp2", rank: 1 },
  { id: 2, name: "emp2", rank: 2 }, // Duplicate with lower rank
  { id: 3, name: "emp3", rank: 3 },
];

const map = new Map();

arr.forEach((obj) => {
  if (map.has(obj.id)) {
    if (obj.rank > map.get(obj.id).rank) {
      map.set(obj.id, obj); // Keep the one with the higher rank
    }
  } else {
    map.set(obj.id, obj); // Add the object if not present
  }
});

const distinctArr = [...map.values()];
console.log(distinctArr);
```

**Output:**

```javascript
[
  { id: 1, name: "emp1", rank: 4 },
  { id: 2, name: "emp2", rank: 2 }, // Retained the higher rank (rank: 2)
  { id: 3, name: "emp3", rank: 3 },
];
```

### Explanation:

- A `Map` is used to track unique `id`s.
- When a duplicate `id` is found, the one with the higher rank is retained.

---

### 22. **Create an array which will only accept string values (Homogeneous array of strings)**:

You can use a `Proxy` to enforce a rule that only strings can be added to the array.

```javascript
let stringsArr = [];

stringsArr = new Proxy(stringsArr, {
  set(target, prop, receiver) {
    if (typeof receiver === "string") {
      target[target.length] = receiver; // Only allow strings to be added
    }
    return true;
  },
});

// Test the functionality
stringsArr.push("Hello", 5, {}, "world", true, [1, 2, 3]);
console.log(stringsArr); // Output: ["Hello", "world"]
```

**Output:**

```javascript
["Hello", "world"];
```

### Explanation:

- The `set` trap in the `Proxy` checks whether the value being added is a string.
- If it is a string, it is added to the array; otherwise, it is ignored.

---

### 23. **Create a Proxy object that allows accessing array elements using negative indices**:

You can use the `get` trap of a `Proxy` to modify the behavior of array access, supporting negative indices.

```javascript
let arr = [10, 20, 30];

arr = new Proxy(arr, {
  get(target, handler) {
    if (handler < 0) {
      return target[target.length + Number(handler)]; // Map negative index to valid position
    } else {
      return target[handler];
    }
  },
});

// Test negative index access
console.log(arr[-1]); // Output: 30
console.log(arr[-2]); // Output: 20
```

**Output:**

```javascript
30;
20;
```

### Explanation:

- The `get` trap intercepts access to array elements.
- If the index is negative, it maps the negative index to the corresponding position from the end of the array.

---

These solutions leverage the power of **Proxies** in JavaScript, enabling fine-grained control over array behavior and the ability to enforce rules such as type constraints and custom index behavior.

---

### Recap:

- **Problem 21**: Uses a `Map` to eliminate duplicate objects based on `id`, keeping the object with the highest rank.
- **Problem 22**: Uses a `Proxy` to create a homogeneous array that only accepts string values.
- **Problem 23**: Uses a `Proxy` to allow access to array elements using negative indices.

These solutions demonstrate advanced use of JavaScript `Proxy` objects to enhance array and object manipulations in a flexible and powerful way.
