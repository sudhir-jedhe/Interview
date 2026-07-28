### **`map` vs `filter` in JavaScript**

Both `map` and `filter` are higher-order functions that can be used to manipulate arrays. However, they serve different purposes and have different behaviors.

---

### **1. `map()` Method**:

- **Purpose**: The `map()` method is used to **transform** each element of an array into a new element based on some function you provide. It returns a new array with the results of applying the function to every element in the original array.
- **Returns**: A new array of the same length as the original array.
- **Side Effects**: The original array is **not mutated**; a new array is returned.

#### **Key Points**:

- The `map()` method transforms each item in the array and returns a new array with the transformed items.
- You cannot use `map()` if you want to remove elements from the array; it always returns a new array with the same number of elements.

#### **Syntax**:

```javascript
const newArray = arr.map(callback(element, index, array) {
    // return modified element
});
```

#### **Example**:

Let's say we have an array of numbers, and we want to multiply each element by 2:

```javascript
const numbers = [1, 2, 3, 4, 5];

const doubled = numbers.map((num) => num * 2);

console.log(doubled); // [2, 4, 6, 8, 10]
console.log(numbers); // [1, 2, 3, 4, 5]  (original array is not mutated)
```

In the example above, `map()` transforms each element by multiplying it by 2.

---

### **2. `filter()` Method**:

- **Purpose**: The `filter()` method is used to **filter out** elements from the array that don't satisfy a given condition. It returns a new array containing only the elements for which the callback function returns `true`.
- **Returns**: A new array that may contain fewer elements than the original array, or even be empty.
- **Side Effects**: The original array is **not mutated**; a new filtered array is returned.

#### **Key Points**:

- The `filter()` method checks each element against a condition and returns a new array that only includes the elements that meet the condition.
- You can use `filter()` to **remove** elements from an array based on a condition.

#### **Syntax**:

```javascript
const filteredArray = arr.filter(callback(element, index, array) {
    return condition; // return true to keep element, false to remove it
});
```

#### **Example**:

Let's say we have an array of numbers, and we want to filter out the odd numbers:

```javascript
const numbers = [1, 2, 3, 4, 5, 6];

const evenNumbers = numbers.filter((num) => num % 2 === 0);

console.log(evenNumbers); // [2, 4, 6]
console.log(numbers); // [1, 2, 3, 4, 5, 6]  (original array is not mutated)
```

In this example, `filter()` keeps only the elements that satisfy the condition (i.e., even numbers), and returns a new array with those elements.

---

### **Comparison:**

| **Feature**        | **`map()`**                                              | **`filter()`**                                        |
| ------------------ | -------------------------------------------------------- | ----------------------------------------------------- |
| **Purpose**        | Transforms every element in the array.                   | Filters out elements that do not satisfy a condition. |
| **Returned Array** | Same length as the original array.                       | May be shorter than the original array or empty.      |
| **Original Array** | Does **not mutate** the original array.                  | Does **not mutate** the original array.               |
| **Use Case**       | When you need to apply a transformation to all elements. | When you need to remove unwanted elements.            |
| **Returned Value** | A new array with transformed values.                     | A new array with elements that passed the condition.  |
| **Side Effects**   | Does not modify the original array.                      | Does not modify the original array.                   |

---

### **Use Cases for `map`**:

1. **Transforming data**: If you need to change every item in the array in some way.
   - Example: Convert an array of numbers into their string equivalents.
2. **Extracting properties**: You might want to extract one property from an array of objects.
   - Example: Extract all user names from an array of user objects.

### **Use Cases for `filter`**:

1. **Filtering out invalid data**: If you want to remove elements based on a condition.
   - Example: Filter out users who are under a certain age.
2. **Removing duplicates**: If you want to filter out duplicate elements from an array.
   - Example: Filter out all numbers greater than 10 from an array of numbers.

---

### **Key Differences in Practice**:

1. **`map()`** is useful when you want to **transform** each element.
2. **`filter()`** is useful when you want to **remove** certain elements based on a condition.

---

### **Code Example: Using Both `map` and `filter` Together**

```javascript
const users = [
  { name: "Alice", age: 25 },
  { name: "Bob", age: 17 },
  { name: "Charlie", age: 30 },
];

// First, filter out users under the age of 18
const adults = users.filter((user) => user.age >= 18);

// Then, create an array of their names
const adultNames = adults.map((user) => user.name);

console.log(adultNames); // ["Alice", "Charlie"]
```

In this example:

- We first use `filter()` to get only the users whose age is 18 or older.
- Then we use `map()` to extract only the `name` property from the filtered array.

### **Conclusion**:

- **`map()`** is used for transforming each element of an array, whereas **`filter()`** is used for selecting only the elements that pass a certain condition.
- Both methods do not modify the original array, they return a new array based on the operation.
- When you need to **change** the values, use `map()`. When you need to **remove** certain values, use `filter()`.
