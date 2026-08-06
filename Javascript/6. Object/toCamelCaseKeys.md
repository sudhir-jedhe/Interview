Your implementation of the `toCamelCase` function is almost perfect! It recursively converts object keys from `snake_case` or `kebab-case` to `camelCase`. Let's walk through it and explain the logic:

### Explanation of the `toCamelCase` Function:

1. **Base Case Check**:
   - The function starts by checking whether the provided value is an object and not `null`. If it's not an object, it simply returns the value as it is. This is the base case for recursion.

2. **Iterating Over Object Entries**:
   - The function uses `Object.entries(obj)` to loop over each key-value pair in the object. For each entry, it processes the key.

3. **Regex for Conversion**:
   - It uses a regular expression to match characters like `-` or `_` followed by a lowercase letter. The regex `([-_][a-z])` captures this pattern.
   - In the callback function, `group.toUpperCase().replace("-", "").replace("_", "")`:
     - Converts the matched group to uppercase.
     - Removes the hyphen (`-`) or underscore (`_`) to form the camel-cased key.
   
4. **Recursion**:
   - After transforming the key, if the value is an object, it recursively applies the `toCamelCase` function to it.
   - This ensures that nested objects also have their keys converted to camel case.

5. **Return New Object**:
   - The transformed key-value pairs are stored in a new object, `newObj`, which is returned at the end.

### Example

Let's walk through the example provided:

```javascript
const obj = {
  snake_case_key: "value",
  another_snake_case_key: {
    nested_snake_case_key: "nested value",
  },
};

const camelCasedObj = toCamelCase(obj);

console.log(camelCasedObj);
```

**Step-by-Step Execution**:

- The function starts with the object:
  ```javascript
  {
    snake_case_key: "value",
    another_snake_case_key: {
      nested_snake_case_key: "nested value",
    },
  }
  ```

- The first key, `"snake_case_key"`, is transformed into `"snakeCaseKey"`.
- The second key, `"another_snake_case_key"`, is transformed into `"anotherSnakeCaseKey"`.
- Inside the nested object, the key `"nested_snake_case_key"` is transformed into `"nestedSnakeCaseKey"`.

Final output:

```javascript
{
  snakeCaseKey: 'value',
  anotherSnakeCaseKey: {
    nestedSnakeCaseKey: 'nested value'
  }
}
```

### Final Code:

Here's the code for `toCamelCase` again for clarity:

```javascript
function toCamelCase(obj) {
  if (typeof obj !== "object" || obj === null) {
    return obj;
  }

  const newObj = {};
  for (const [key, value] of Object.entries(obj)) {
    const newKey = key.replace(/([-_][a-z])/gi, (group) =>
      group.toUpperCase().replace("-", "").replace("_", "")
    );
    newObj[newKey] = toCamelCase(value);
  }

  return newObj;
}

const obj = {
  snake_case_key: "value",
  another_snake_case_key: {
    nested_snake_case_key: "nested value",
  },
};

const camelCasedObj = toCamelCase(obj);

console.log(camelCasedObj);
// Output:
// {
//   snakeCaseKey: 'value',
//   anotherSnakeCaseKey: {
//     nestedSnakeCaseKey: 'nested value'
//   }
// }
```

### Notes:
- The `replace` function ensures that both `snake_case` and `kebab-case` are handled properly (by matching `-` and `_`).
- This function works for both flat and deeply nested objects, recursively converting all keys.

This is a clean and efficient solution for converting an object from snake_case (or kebab-case) to camelCase!