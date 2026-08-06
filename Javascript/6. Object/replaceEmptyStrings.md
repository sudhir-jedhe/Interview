### Explanation of `replaceEmptyStrings` Function

The `replaceEmptyStrings` function iterates over the properties of an object, and for each property, it checks if the value is an **empty string** (or a string containing only whitespace). If so, it replaces that value with `null`. This is useful if you want to clean up an object by turning empty or whitespace-only strings into `null` values.

Let's break down the code and behavior:

### Code:

```javascript
function replaceEmptyStrings(obj) {
  // Iterate over the object's properties
  for (let key in obj) {
    // Check if the property is a string and is empty or only contains whitespaces
    if (typeof obj[key] === "string" && obj[key].trim() === "") {
      // Replace empty or whitespace-only string with null
      obj[key] = null;
    }
  }
  return obj;
}

// Example usage:
let data = {
  name: "John",
  age: "",
  city: "  ",
  country: "USA",
};

let updatedData = replaceEmptyStrings(data);
console.log(updatedData);
```

### Explanation:

1. **Function Definition:**
   - The `replaceEmptyStrings` function takes one parameter: `obj` (the object whose properties you want to check and modify).
   
2. **Iterating over the Object:**
   - The `for...in` loop is used to iterate over all properties of the object. For each `key`, it checks if the property value is a **string**.
   
3. **Check for Empty or Whitespace-Only Strings:**
   - The `if` condition checks two things:
     1. **`typeof obj[key] === "string"`** ensures that the property value is a string.
     2. **`obj[key].trim() === ""`** checks if the string is either empty or contains only whitespace (because `.trim()` removes leading and trailing spaces).
   
4. **Replacing with `null`:**
   - If both conditions are true (i.e., the property value is an empty string or contains only whitespace), the property is updated with `null` instead of the empty string.

5. **Returning the Object:**
   - The function returns the modified object, where empty or whitespace-only string properties are replaced with `null`.

### Example Output:

For the input object:

```javascript
let data = {
  name: "John",
  age: "",
  city: "  ",
  country: "USA",
};
```

The function would produce the following output:

```javascript
{
  name: "John",
  age: null,
  city: null,
  country: "USA"
}
```

### Key Points:
- **Empty strings and whitespace-only strings** are replaced with `null`.
- **Non-string values** (e.g., numbers, booleans) are unaffected.
- **Object mutation**: The original `data` object is directly mutated (modified in place). If you need to preserve the original object and return a new one, you can create a shallow copy of the object before modifying it. For example:

```javascript
function replaceEmptyStrings(obj) {
  // Create a shallow copy of the object to avoid mutation
  let newObj = { ...obj };

  // Iterate over the object's properties
  for (let key in newObj) {
    if (typeof newObj[key] === "string" && newObj[key].trim() === "") {
      newObj[key] = null;
    }
  }
  return newObj;
}
```

This would ensure the original `data` object remains unchanged, and the `updatedData` would be a new object.

### Conclusion:
The `replaceEmptyStrings` function is a great way to clean up an object by turning empty or whitespace-only string properties into `null`. You can easily adapt this solution depending on whether you want to modify the original object or return a new object.