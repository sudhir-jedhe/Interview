The functions you've written (`setValueByPath`, `set`, etc.) are all designed to set a value in an object by providing a **path**. This kind of functionality is useful when working with deeply nested objects, especially if the structure of the object can vary.

Let’s break down the code you provided in the following parts:

### 1. **`setValueByPath` Function**:

```javascript
function setValueByPath(obj, path, value) {
  const pathArray = path.split(".");
  let currentObj = obj;

  for (let i = 0; i < pathArray.length - 1; i++) {
    const key = pathArray[i];
    if (!currentObj[key] || typeof currentObj[key] !== "object") {
      currentObj[key] = {};
    }
    currentObj = currentObj[key];
  }

  const lastKey = pathArray[pathArray.length - 1];
  currentObj[lastKey] = value;
}
```

#### **Explanation:**
- This function works by splitting the `path` string into an array (using `"."` as the separator).
- It then iterates through each part of the path, and if any intermediate property doesn't exist or is not an object, it creates an empty object to fill in that gap.
- Finally, the function sets the value at the target location (`lastKey`).
  
#### **Example:**

```javascript
const myObject = {};
setValueByPath(myObject, "user.name.first", "John");
setValueByPath(myObject, "user.name.last", "Doe");
setValueByPath(myObject, "user.age", 30);

console.log(myObject);
```

This would output:

```javascript
{
  user: {
    name: {
      first: 'John',
      last: 'Doe'
    },
    age: 30
  }
}
```

### 2. **`set` Function (with Path Parsing)**

This version of the `set` function goes a step further by handling paths in both string and array forms, as well as handling array indexes like `obj["arr[0]"]`. It also deals with edge cases where parts of the path do not exist.

```javascript
function set(object, path, value) {
  // Check if object or path is invalid
  const isObjectInvalid = !object || typeof object !== "object";
  if (isObjectInvalid || !path) return object;

  // Clean path if it is a string
  if (typeof path === "string") {
    path = path.replaceAll("[", ".");
    path = path.replaceAll("]", ".");
    path = path.split(".");
  }

  // Filter out empty parts of the path
  path = path.filter(Boolean);

  let currentItem = object;

  for (let i = 0; i < path.length; i++) {
    const currentKey = path[i];

    // If key doesn't exist, create a new object or array based on the next path part
    if (!Object.prototype.hasOwnProperty.call(currentItem, currentKey)) {
      const isNonArrayMissingIndex = isNaN(path[i + 1] && Number(path[i + 1]));
      if (isNonArrayMissingIndex) {
        currentItem[currentKey] = {};
      } else {
        currentItem[currentKey] = [];
      }
    }

    // If last part of the path, set the value
    if (i === path.length - 1) {
      currentItem[currentKey] = value;
    } else {
      // Otherwise, keep navigating deeper into the object
      currentItem = currentItem[currentKey];
    }
  }

  return object;
}
```

#### **Explanation:**
- First, the function checks if the `object` is valid and if the `path` is not an empty string.
- If the `path` is a string, it replaces `[` and `]` with `.` to properly handle array-like paths (like `obj["arr[0]"]` becomes `obj.arr.0`).
- Then, the path is split by `.` into an array, and empty elements are filtered out.
- The function iterates through the path and creates missing objects or arrays at each step.
- If it's the last part of the path, the function sets the `value`.
  
#### **Example:**

```javascript
const obj = {};
set(obj, 'user.profile.name', 'John');
set(obj, 'user.profile.age', 25);

console.log(obj); 
// Output: { user: { profile: { name: 'John', age: 25 } } }
```

This will set the `name` and `age` properties on a nested `user.profile` object.

### 3. **`set` Function (String Handling with Array Indexing)**

The third version also considers different cases like array indexing, trimming spaces, and checking for invalid paths.

```javascript
function set(object, path, value) {
  "use strict";
  
  // If the object is invalid or path is empty
  if (!object || typeof object !== "object" || path === "") return object;

  let paths;

  // If path is a string, split it into parts
  if (!Array.isArray(path)) {
    path = path.trim();
    path = path.replaceAll("[", ".");
    path = path.replaceAll("]", ".");
    paths = path.split(".").filter((part) => part !== "");
  } else paths = path;

  let obj = object;

  // Traverse the path to create missing parts of the object
  paths.forEach((path, index) => {
    if (!obj[path]) {
      if (parseInt(paths[index + 1]) >= 0) obj[path] = []; // Create array for array index
      else obj[path] = {}; // Create object for key
    }
    if (index === paths.length - 1) obj[path] = value; // Set value at the last path part
    obj = obj[path]; // Move deeper into the object
  });

  return object;
}
```

#### **Explanation:**
- The function first checks if the `object` is valid and if the `path` is a non-empty string.
- It processes the path string by converting array-style indexing (e.g., `obj["arr[0]"]`) to a dot notation (`obj.arr.0`).
- If `path` is an array, it directly processes it.
- The function navigates through the object and creates missing keys or arrays as needed.
  
#### **Example with Array Indexing:**

```javascript
const obj = {};
set(obj, 'user.profile[0].name', 'John');
set(obj, 'user.profile[1].name', 'Jane');

console.log(obj);
// Output: { user: { profile: [ { name: 'John' }, { name: 'Jane' } ] } }
```

### **Conclusion**

- **All the functions you've provided work similarly**, aiming to handle deeply nested paths and ensure missing keys/arrays are created when necessary.
- **String-based paths** can be handled with both dot notation (`user.profile.name`) and array-style indexing (`user.profile[0]`), ensuring flexibility.
- The functions ensure that, if any part of the path doesn't exist, it is created dynamically, whether it's an object or an array, before finally setting the value at the end of the path.

These functions are helpful for setting values in deeply nested objects without worrying about whether the intermediate keys or arrays already exist.