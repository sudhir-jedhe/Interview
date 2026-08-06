Your implementation of the `set` function is generally well-structured and follows a solid pattern to update deeply nested properties in an object, whether the path is provided as a string or an array. Let's walk through your code and explore the different approaches, focusing on your specific goals.

### **How `set` Works:**
- **Input Parameters:**
  - `obj`: The object you want to modify.
  - `path`: A string (like `"a.b.c"`) or an array (like `["a", "b", "c"]`) representing the keys in the object.
  - `value`: The value you want to set at the specified path.

- **How the function operates:**
  - **Converting the Path:** If the path is a string, it is converted to an array of keys using `split` or regular expressions. This allows us to work uniformly with both string and array-based paths.
  - **Traversing the Object:** The function iterates through the `path` array, checking each key. If the key doesn’t exist, it creates the necessary object or array at that point in the path.
  - **Setting the Value:** When it reaches the final key in the path, it sets the `value`.

### **Comparison of Different Implementations:**

#### 1. **First Implementation:**
   - **Key Features:**
     - Handles path as a string or array.
     - Replaces square brackets in the string path (`"a.b[0]"`) to dot notation (`"a.b.0"`).
     - Creates arrays or objects depending on whether the next key is numeric or not.
     - Handles both arrays and objects in the path.

   - **Usage Example:**
     ```javascript
     set(obj, "a.b.c", "BFE");
     set(obj, "a.b.c[1]", "BFE");
     ```

#### 2. **Second Implementation (Improved TypeScript version):**
   - **Key Features:**
     - Similar to the first implementation, but with a more concise use of TypeScript's typing and better readability.
     - Replaces square brackets (`[`, `]`) with dot notation.
     - It checks whether the next part of the path is a number, and creates arrays when necessary.
     
   - **Usage Example:**
     ```typescript
     set(obj, "a.b.c", "BFE");
     ```

#### 3. **Third Implementation (Simple version with `for` loop):**
   - **Key Features:**
     - Similar logic but written more simply and iterates over the path using a `for` loop.
     - The key difference here is that it checks whether a property is an array index by looking at the `nextP` value.

   - **Usage Example:**
     ```javascript
     set(obj, "a.b.c[0]", "BFE");
     ```

#### 4. **Fourth Implementation (Custom `set` function):**
   - **Key Features:**
     - This implementation makes sure to handle both string and array-based paths.
     - It ensures that the `object` is properly initialized if the path doesn't exist yet.
     - The use of `if` checks guarantees the structure is appropriately built as the function traverses down the path.

   - **Usage Example:**
     ```javascript
     customSet(data, 'user.info.address.city', 'Wonderland');
     customSet(data, ['user', 'info', 'age'], 31);
     ```

---

### **Handling Arrays with Indices (e.g., `a.b.c[0]`):**
The challenge in all implementations is how to handle array-like indices (e.g., `a.b.c[0]`). Here are a couple of points to clarify:

1. **Array Handling with Numbers:** 
   - If the path contains numeric indices (e.g., `"a.b.c[0]"`), your `set` function should recognize that it’s an array index and handle it accordingly. Your implementations already handle this by converting `"a.b[0]"` to `"a.b.0"` and using the array behavior.

2. **Valid vs Invalid Digits:**
   - If there’s a key like `"01"`, JavaScript treats it as a string, and you’re right to treat such cases differently in your `set` function (by checking whether the next key is numeric or not).

### **Suggested Improvements/Adjustments:**

#### Handling Arrays Correctly in `set`:

- You could enhance your logic for handling arrays when an index is part of the path. This would ensure that if an index doesn’t exist, it’s initialized as an empty array. For example:
  
  ```javascript
  function set(obj, path, value) {
    const pathArray = Array.isArray(path) ? path : path.replace(/\[(.*)\]/g, ".$1").split(".");
    let current = obj;

    for (let i = 0; i < pathArray.length; i++) {
      const key = pathArray[i];
      if (i === pathArray.length - 1) {
        current[key] = value;
      } else {
        if (typeof current[key] !== "object") {
          const nextKey = pathArray[i + 1];
          if (!isNaN(nextKey)) {
            current[key] = []; // If next key is numeric, initialize as array
          } else {
            current[key] = {}; // Otherwise initialize as object
          }
        }
        current = current[key];
      }
    }
  }
  ```

### **Test Cases:**

```javascript
// Example usage
const obj = {
  a: {
    b: {
      c: [1, 2, 3],
    },
  },
};

set(obj, "a.b.c", "BFE");
console.log(obj.a.b.c); // "BFE"

set(obj, "a.b.c[0]", "BFE");
console.log(obj.a.b.c[0]); // "BFE"

set(obj, "a.b.c[1]", "BFE");
console.log(obj.a.b.c[1]); // "BFE"

set(obj, ["a", "b", "c", "2"], "BFE");
console.log(obj.a.b.c[2]); // "BFE"

set(obj, "a.b.c[3]", "BFE");
console.log(obj.a.b.c[3]); // "BFE"

console.log();
set(obj, "a.c.d[0]", "BFE");
console.log(obj.a.c.d[0]); // "BFE"

set(obj, "a.c.d.01", "BFE");
console.log(obj.a.c.d["01"]); // "BFE"
```

This handles the different types of keys (string, numeric, and array indices) and creates new structures when necessary.

### **Final Thoughts:**

Your solution is very close to a full-fledged implementation. Just make sure to keep track of numeric indices properly and initialize arrays/objects based on the path. The core logic of traversing the object and dynamically creating objects or arrays when necessary is already in place. This is an excellent approach for building deep object manipulations, and it's quite flexible with both string and array paths!