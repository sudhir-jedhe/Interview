### 1. **Using `for...in` with Arrays:**

In this example, you're using the `for...in` loop to iterate over the `words` array. Let's break it down:

```javascript
let words = ["pen", "pencil", "falcon", "rock", "sky", "earth"];

for (let idx in words) {
  console.log(`${words[idx]} has index ${idx}`);
}
```

- **Explanation**:
  - The `for...in` loop is designed for iterating over the **properties** of an object, including arrays.
  - In this case, `idx` represents the **index** of the array, and `words[idx]` accesses the value at that index.
  - However, this is generally not recommended for arrays because `for...in` will iterate over all properties, including those inherited from the prototype chain.
  
- **Recommended for Arrays**: Use `for...of`, `forEach`, or `map` to iterate over arrays, as these methods focus only on the elements, avoiding any issues with inherited properties.

### 2. **Iterating Over Object Properties:**

In this example, you're iterating over the keys of an object using `for...in`:

```javascript
function iterateObject() {
  let exampleObj = {
    book: "Sherlock Holmes",
    author: "Arthur Conan Doyle",
    genre: "Mystery",
  };

  for (let key in exampleObj) {
    if (exampleObj.hasOwnProperty(key)) {
      value = exampleObj[key];
      console.log(key, value);
    }
  }
}
iterateObject();
```

- **Explanation**:
  - `for...in` is used to loop over the **keys** of the `exampleObj`.
  - The `hasOwnProperty()` check ensures that only the object's own properties (and not inherited ones) are logged. Without this check, inherited properties from `Object.prototype` (e.g., `toString`) could also be iterated over.
  - The key-value pair is then logged inside the loop.

### 3. **Checking if a Property Exists in an Object:**

This example demonstrates how to check if a property exists in an object using the `in` operator:

```javascript
const obj = {
  foo: "bar",
};

console.log("foo" in obj);  // true
console.log(["foo"] in obj);  // false
```

- **Explanation**:
  - The `in` operator checks whether a property exists in an object, returning `true` if the property exists, and `false` otherwise.
  - In the first log statement, `"foo" in obj` returns `true` because the object `obj` has a property `foo`.
  - In the second log statement, `["foo"] in obj` returns `false`. This is because `in` is checking for a property called `["foo"]`, which is not a valid property name (since it’s an array, not a string).

### Key Points:

- **`for...in`**: 
  - Used for iterating over object keys (including arrays, but it's not recommended for arrays because of potential issues with inherited properties).
  - In the case of arrays, `for...in` will iterate over indices, but for objects, it will iterate over keys.

- **`hasOwnProperty()`**:
  - A method to check if an object contains a property directly (excluding inherited properties).
  
- **`in` Operator**:
  - It checks if a property exists in an object (including inherited properties).
  - However, using the `in` operator with an array element wrapped in square brackets (e.g., `["foo"] in obj`) can lead to unexpected results, as it interprets the array as a string property name.

### Best Practices:

- **For Arrays**: Prefer `for...of`, `forEach`, or `map` to iterate over array elements to avoid the pitfalls of `for...in`.
- **For Objects**: `for...in` is fine for object property iteration, but always use `hasOwnProperty()` to avoid including inherited properties.