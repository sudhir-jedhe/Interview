To flatten a nested JavaScript object into a single level, we need to recursively explore each key and value. When we encounter an object, we need to traverse its keys, append the parent key to create a new key, and recursively flatten it. If the value is a primitive (like a string, number, etc.), we can simply add it to the resulting object.

Here are multiple ways to implement this, all of which "squash" or "flatten" an object into a single level:

### **Flatten Object Using Recursion**

#### 1. **Flattening with `for...in` Loop and Recursion**

This approach iterates over each key in the object and checks if the value is an object. If it is, it recursively flattens it and appends the parent key to the child keys.

```javascript
// Flattening an object into a single level recursively
const flattenObj = (ob) => {
  let result = {};

  // Iterate through the object's keys
  for (const i in ob) {
    if (typeof ob[i] === "object" && !Array.isArray(ob[i])) {
      // Recursively flatten the nested object
      const temp = flattenObj(ob[i]);
      for (const j in temp) {
        // Concatenate parent and child keys
        result[i + "." + j] = temp[j];
      }
    } else {
      // If value is a primitive, just assign it
      result[i] = ob[i];
    }
  }

  return result;
};

let ob = {
  Company: "GeeksforGeeks",
  Address: "Noida",
  contact: "+91-999999999",
  mentor: {
    HTML: "GFG",
    CSS: "GFG",
    JavaScript: "GFG",
  },
};

console.log(flattenObj(ob));
/* Output:
{
  Company: "GeeksforGeeks",
  Address: "Noida",
  contact: "+91-999999999",
  "mentor.HTML": "GFG",
  "mentor.CSS": "GFG",
  "mentor.JavaScript": "GFG"
}
*/
```

#### 2. **Flattening Using `Object.assign()` and Recursion**

This approach uses `Object.assign()` to merge objects at each recursive call. It is another efficient way to flatten an object, especially when working with deep objects.

```javascript
function squashObject(inputObject, parentKey = "") {
  const outputObject = {};

  // Iterate through all keys in the input object
  for (const key in inputObject) {
    const newKey = parentKey ? `${parentKey}.${key}` : key;

    if (
      typeof inputObject[key] === "object" &&
      !Array.isArray(inputObject[key])
    ) {
      // Recursively flatten the object
      Object.assign(outputObject, squashObject(inputObject[key], newKey));
    } else {
      // If it's a primitive, directly assign the value
      outputObject[newKey] = inputObject[key];
    }
  }

  return outputObject;
}

const nestedObject = {
  a: 1,
  b: {
    c: 2,
    d: {
      e: 3,
    },
  },
};

const squashedObject = squashObject(nestedObject);
console.log(squashedObject);
// Output: { a: 1, 'b.c': 2, 'b.d.e': 3 }
```

#### 3. **Flattening with `Object.assign()` Using `map()`**

This method leverages the `Object.keys()` method to iterate through the object, calling `map()` to flatten nested objects, and then merges them using `Object.assign()`.

```javascript
function squashObject(obj) {
  return Object.assign(
    {},
    ...Object.keys(obj).map((k) =>
      typeof obj[k] === "object" ? squashObject(obj[k]) : { [k]: obj[k] }
    )
  );
}

const nestedObj = {
  a: 1,
  b: {
    c: 2,
    d: {
      e: 3,
    },
  },
};

console.log(squashObject(nestedObj));
// Output: { a: 1, 'b.c': 2, 'b.d.e': 3 }
```

#### 4. **Using `reduce()` for Flattening**

Another way to flatten the object is by using `reduce()` to accumulate the flattened key-value pairs.

```javascript
function squashObject(obj) {
  return Object.keys(obj).reduce((acc, key) => {
    const value = obj[key];
    return typeof value === "object"
      ? { ...acc, ...squashObject(value) }  // Recursively flatten
      : { ...acc, [key]: value };  // Add primitive value
  }, {});
}

const nestedObj = {
  a: 1,
  b: {
    c: 2,
    d: {
      e: 3,
    },
  },
};

console.log(squashObject(nestedObj));
// Output: { a: 1, 'b.c': 2, 'b.d.e': 3 }
```

### Summary of Differences

| Approach | Description |
| --- | --- |
| **`for...in` Loop with Recursion** | Uses a loop to iterate through the object and recursively flattens nested objects. |
| **`Object.assign()` and Recursion** | Uses `Object.assign()` to merge recursively flattened objects. |
| **`Object.keys()` with `map()`** | Uses `map()` to iterate over keys and flatten nested objects. |
| **`reduce()` with Recursion** | Uses `reduce()` to accumulate the final flattened object, handling nested objects recursively. |

### Conclusion

Each of these methods can be used depending on the situation, but generally, the recursive approach using `Object.keys()` or `for...in` is the most flexible for flattening objects with nested structures.