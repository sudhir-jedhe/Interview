The code snippets you provided are different ways to **clear** or **empty** an array in JavaScript. Let's go through each of them one by one to understand what they do:

---

### 1. **Reassigning the array to an empty array (`a = []`)**

```javascript
var a = [1, 2, 3, 4, 5];
a = [];
```

- **Effect**: This will **reassign** the variable `a` to a new empty array.
- **Important Note**: This approach **does not affect** any other variables that might be referencing the original array. If there were other references to the array (like `b` in the next example), they would still point to the original array and **not be affected** by this reassignment.

---

### 2. **Assigning a new empty array to another variable (`b = a`)**

```javascript
var b = a;
b = [];
```

- **Effect**: This will **create a reference** to the same array in `b`. When you set `b = []`, you're making `b` point to a new empty array, but **the original array `a` remains unchanged**.
- **Key Point**: `b` is a reference to the array, so if you modify `b` (like setting it to an empty array), it won't impact `a`. The original `a` array remains as it was unless you modify it directly.

---

### 3. **Using `length = 0` to empty the array**

```javascript
a.length = 0;
```

- **Effect**: This is a **common way** to **empty** an array in place without creating a new array. Setting the `length` property of the array to `0` will remove all elements from the array.
- **Important Note**: This method **mutates the original array**, so if other variables reference `a`, those references will also see the empty array. This is a **mutative operation** that clears the array **in place**.

---

### 4. **Using `splice()` to empty the array**

```javascript
a.splice(0, a.length);
```

- **Effect**: The `splice()` method allows you to **remove elements** from an array. Here, you're using `splice(0, a.length)`, which means "remove elements starting at index 0, and remove `a.length` elements." This effectively removes all elements from the array.
- **Important Note**: Like `length = 0`, this is a **mutating operation**. It will modify the original array in place, and any other references to `a` will also reflect the change.

---

### 5. **Using a `while` loop with `pop()`**

```javascript
while (a.length) {
  a.pop();
}
```

- **Effect**: The `pop()` method removes the last element from an array. The `while` loop will continue removing elements as long as the array's `length` is greater than 0.
- **Important Note**: This method is also **mutative** and modifies the original array in place. It can be a bit less efficient compared to the other methods, especially for larger arrays, as it removes one element at a time.

---

### Summary of Differences:

| Method                           | Effect on Array               | Other References Affected | Time Complexity | Notes |
|----------------------------------|-------------------------------|---------------------------|-----------------|-------|
| `a = []`                         | Reassigns a new empty array   | No                        | O(1)            | Creates a new array, previous references still point to the original array. |
| `b = []`                         | Reassigns `b` to a new empty array | No                        | O(1)            | Does not affect `a`, `b` is now a reference to a new empty array. |
| `a.length = 0`                   | Clears the array in place     | Yes                       | O(1)            | Mutates the original array, and all references to it are affected. |
| `a.splice(0, a.length)`          | Clears the array in place     | Yes                       | O(n)            | Mutates the original array, but slightly less efficient than `length = 0`. |
| `while (a.length) { a.pop(); }`  | Clears the array in place     | Yes                       | O(n)            | Mutates the original array and removes elements one by one. |

---

### Best Practice:
- **For most cases**: `a.length = 0;` is the simplest and most efficient way to empty an array in place.
- **If you need to remove elements conditionally** (based on criteria), `splice()` can be useful.
- **If you prefer functional or non-mutating approaches**, consider using a new array (`a = []`), but be aware that this won't affect any other references to the original array.