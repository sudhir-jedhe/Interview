You’ve provided various techniques to remove elements from a JavaScript array **without mutating the original array**. Let's go through each approach with a bit more clarity and detail:

### **1. Using `slice` and `concat`**

In your first example, you use the `slice` method combined with `concat` to remove elements without mutating the original array. This is a great approach for immutability.

```javascript
const shank = (arr, index = 0, delCount = 0, ...elements) =>
  arr
    .slice(0, index)  // Get the part of the array before the index
    .concat(elements)  // Add new elements, if any
    .concat(arr.slice(index + delCount)); // Get the part of the array after the deleted items

const names = ['alpha', 'bravo', 'charlie'];
const namesAndDelta = shank(names, 1, 0, 'delta');
console.log(namesAndDelta); // [ 'alpha', 'delta', 'bravo', 'charlie' ]

const namesNoBravo = shank(names, 1, 1);
console.log(namesNoBravo); // [ 'alpha', 'charlie' ]
console.log(names); // ['alpha', 'bravo', 'charlie'] - original array remains unchanged
```

This method combines slices of the array to remove elements and add new ones. It’s a non-mutating operation because it returns a new array instead of modifying the original one.

### **2. Using `slice` alone**

You can also remove an item from an array by using `slice` directly without the need for `concat`:

```javascript
let arr = ['prashant', 'sachin', 'yogesh', 'panam', 'pranav'];
let index = 2;
let newArr = arr.slice(0, index).concat(arr.slice(index + 1, arr.length));

console.log(newArr);
// ["prashant", "sachin", "panam", "pranav"]
```

Alternatively, using the **ES6 spread operator**:

```javascript
let newArr = [...arr.slice(0, index), ...arr.slice(index + 1, arr.length)];

console.log(newArr);
// ["prashant", "sachin", "panam", "pranav"]
```

### **3. Using a helper function (`removeItems`)**

You can make a reusable function for removing elements from an array based on the index:

```javascript
let arr = ['prashant', 'sachin', 'yogesh', 'panam', 'pranav'];

let removeItems = (arr, index) => {
  return [...arr.slice(0, index), ...arr.slice(index + 1)];
};

arr = removeItems(arr, 2);
console.log(arr); // ["prashant", "sachin", "panam", "pranav"]

arr = removeItems(arr, 3);
console.log(arr); // ["prashant", "sachin", "panam"]
```

This method works by creating a new array with the elements before and after the index, thus ensuring immutability.

### **4. Using `filter`**

You can filter out specific items from an array by using `filter`:

#### Removing a single element:

```javascript
let arr = ['prashant', 'sachin', 'yogesh', 'panam', 'pranav'];
let exclude = 'prashant';
let updated = arr.filter(e => e !== exclude);
console.log(updated);
// ["sachin", "yogesh", "panam", "pranav"]
```

#### Removing multiple elements:

```javascript
let arr = ['prashant', 'sachin', 'yogesh', 'panam', 'pranav'];
let exclude = ['prashant', 'yogesh'];

let updated = arr.filter(e => exclude.indexOf(e) === -1);
console.log(updated);
// ["sachin", "panam", "pranav"]
```

Using `filter`, you can create a new array without the elements that match the condition, thus maintaining immutability.

### **5. Using `splice` (Mutating) and `pop`/`shift` (Mutating)**

Although these methods are **mutating**, I'll briefly explain how they work:

#### `splice`:

```javascript
let arr = ['prashant', 'sachin', 'yogesh', 'panam', 'pranav'];
let index = 2;
arr.splice(index, 1); // Mutates the original array

console.log(arr);
// ["prashant", "sachin", "panam", "pranav"]
```

#### `pop`:

```javascript
let arr = ['prashant', 'sachin', 'yogesh', 'panam', 'pranav'];
arr.pop(); // Removes the last element

console.log(arr);
// ["prashant", "sachin", "yogesh", "panam"]
```

#### `shift`:

```javascript
let arr = ['prashant', 'sachin', 'yogesh', 'panam', 'pranav'];
arr.shift(); // Removes the first element

console.log(arr);
// ["sachin", "yogesh", "panam", "pranav"]
```

These methods mutate the array, so they are not recommended when you want to avoid side effects and maintain immutability.

### **6. Modifying Array Length (Mutating)**

```javascript
let arr = ['prashant', 'sachin', 'yogesh', 'panam', 'pranav'];
arr.length = 4; // Shrinks the array to the first 4 elements

console.log(arr);
// ["prashant", "sachin", "yogesh", "panam"]
```

This is a **mutating** way of removing elements by changing the `length` property of the array. It will discard all elements after the new length.

---

### **Summary of Non-Mutating Methods**

- **`slice` and `concat`**: These methods can be combined to create a non-mutating version of `splice()`. The original array remains unchanged.
- **`filter`**: A great way to remove elements based on a condition (e.g., matching specific values).
- **Helper Functions**: You can combine `slice` with other logic, like using the spread operator or `filter`, to create reusable, non-mutating solutions.
  
### **Mutating Methods**

- **`splice`**, **`pop`**, **`shift`**, and modifying the array's **`length`** all mutate the array in place. These are usually less preferable when immutability is desired.

Let me know if you need further explanations or examples!