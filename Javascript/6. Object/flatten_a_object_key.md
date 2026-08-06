The code snippets you've shared are great examples of how to work with **nested objects** in JavaScript, including how to **flatten** objects (convert nested objects into a single level) and **unflatten** them back into their original structure. Let's break down each of the examples and explain them in detail.

### 1. **Flattening an Object (First Method)**

In the first example, you are flattening an object recursively by concatenating the keys with a delimiter (e.g., `.`). The function takes an object and an optional prefix (for recursion) and flattens it into a single level of key-value pairs.

```js
const flattenObject = (obj, prefix = "") =>
  Object.keys(obj).reduce((acc, k) => {
    const pre = prefix.length ? prefix + "." : "";
    if (typeof obj[k] === "object") {
      return { ...acc, ...flattenObject(obj[k], pre + k) };
    } else {
      return { ...acc, [pre + k]: obj[k] };
    }
  }, {});

const obj = {
  a: 1,
  b: {
    c: 2,
    d: 3,
  },
  e: 4,
};

const flattenedObj = flattenObject(obj);

console.log(flattenedObj);

// Output:
// {
//     "a": 1,
//     "b.c": 2,
//     "b.d": 3,
//     "e": 4,
// }
```

#### Explanation:
- **`Object.keys(obj)`**: Iterates over the keys of the object.
- **`reduce()`**: Accumulates the results into a single object.
- **`typeof obj[k] === "object"`**: Checks if the value is an object. If true, it recursively flattens the nested object by concatenating the current key with the `prefix`.
- **Flattened Output**: This approach turns nested objects into strings of keys, concatenated by `.` (dot notation).

### 2. **Flattening an Object with Array Handling (Second Method)**

The second method extends the flattening process to handle **arrays** as well as nested objects.

```js
const flatten = (obj, prefix) => {
  let output = {};

  for (let k in obj) {
    let val = obj[k];
    const type = Object.prototype.toString.call(val);

    if (type === "[object Object]") {
      const newKey = prefix ? prefix + "." + k : k;
      const newObj = flatten(val, newKey);
      output = { ...output, ...newObj };
    }
    else if (type === "[object Array]") {
      for (let i = 0; i < val.length; i++) {
        const newKey = prefix ? prefix + "." + k + "." + i : k + "." + i;
        output = { ...output, [newKey]: val[i] };
      }
    }
    else {
      const newKey = prefix ? prefix + "." + k : k;
      output = { ...output, [newKey]: val };
    }
  }

  return output;
};
```

#### Key Enhancements:
- **Array Handling**: If a value is an array, it flattens the array by iterating over each item and appending the index to the key.
- **Object Handling**: If the value is an object, it recursively flattens the object.
- **Value Handling**: If the value is neither an object nor an array, it adds the value with its respective flattened key.

### Example:

```js
const nested = {
  A: "12",
  B: 23,
  C: {
    P: 23,
    O: { L: 56 },
    Q: [1, 2]
  }
};

console.log(flatten(nested));

// Output:
// {
//   "A": "12",
//   "B": 23,
//   "C.O.L": 56,
//   "C.P": 23,
//   "C.Q.0": 1,
//   "C.Q.1": 2
// }
```

#### Explanation:
- The array `C.Q` is flattened with the keys `"C.Q.0"` and `"C.Q.1"`, and nested objects like `C.O` are flattened into dot notation.

### 3. **Flattening with a Custom Delimiter (Third Method)**

The next example shows flattening with a customizable delimiter for keys, which makes the function more flexible.

```js
const flattenObject = (obj, delimiter = '.', prefix = '') =>
  Object.keys(obj).reduce((acc, k) => {
    const pre = prefix.length ? `${prefix}${delimiter}` : '';
    if (typeof obj[k] === 'object' && obj[k] !== null && Object.keys(obj[k]).length > 0)
      Object.assign(acc, flattenObject(obj[k], delimiter, pre + k));
    else acc[pre + k] = obj[k];
    return acc;
  }, {});
```

#### Key Enhancements:
- **Custom Delimiter**: The delimiter (e.g., `.` or `/`) is customizable, allowing you to adjust the key format in the flattened result.
- **Non-Null Objects**: Ensures that the function only recursively flattens objects, and skips over `null` values or empty objects.

### Example:

```js
const fileSizes = {
  package: 256,
  src: {
    index: 1024,
    styles: {
      main: 128,
      colors: 16
    },
  },
  assets: {
    images: {
      logo: 512,
      background: 512
    },
    fonts: {
      serif: 64
    }
  }
};

console.log(flattenObject(fileSizes, '/'));

// Output:
// {
//   'package': 256,
//   'src/index': 1024,
//   'src/styles/main': 128,
//   'src/styles/colors': 16,
//   'assets/images/logo': 512,
//   'assets/images/background': 512,
//   'assets/fonts/serif': 64
// }
```

#### Explanation:
- This time the delimiter `/` is used to separate keys in the flattened output, resulting in paths like `src/index` instead of `src.index`.

### 4. **Unflattening an Object (Reversing Flattening)**

To reverse the flattening process, you can use a function to convert the flattened object back into its original nested structure. This is done by splitting the keys at the delimiter and reconstructing the object.

```js
const unflattenObject = (obj, delimiter = '.') =>
  Object.keys(obj).reduce((res, k) => {
    k.split(delimiter).reduce(
      (acc, e, i, keys) =>
        acc[e] ||
        (acc[e] = isNaN(Number(keys[i + 1]))
          ? keys.length - 1 === i
            ? obj[k]
            : {}
          : []),
      res
    );
    return res;
  }, {});
```

#### Explanation:
- **Splitting Keys**: The keys are split at the delimiter (e.g., `.`) to create an array of key segments.
- **Reducing to Object**: Using `reduce()`, the segments are traversed to recreate the original object structure.
- **Handling Arrays**: If the next segment is a number (array index), it creates an array.

### Example:

```js
const flattenedFileSizes = {
  'package': 256,
  'src/index': 1024,
  'src/styles/main': 128,
  'src/styles/colors': 16,
  'assets/images/logo': 512,
  'assets/images/background': 512,
  'assets/fonts/serif': 64
};

console.log(unflattenObject(flattenedFileSizes));

// Output:
// {
//   package: 256,
//   src: {
//     index: 1024,
//     styles: {
//       main: 128,
//       colors: 16
//     }
//   },
//   assets: {
//     images: {
//       logo: 512,
//       background: 512
//     },
//     fonts: {
//       serif: 64
//     }
//   }
// }
```

#### Explanation:
- The function successfully reconstructs the nested object by using the flattened keys and their values.

---

### Summary of Functions:

1. **Flatten Object**:
   - Converts a nested object into a single-level object with keys represented in dot notation.
   - Can handle both objects and arrays.
   - Customizable delimiter for key formatting.

2. **Unflatten Object**:
   - Converts a flattened object back into a nested structure.
   - Handles arrays by checking for numeric keys.

Both flattening and unflattening techniques are essential when dealing with data transformation, especially when working with APIs or when the data structure needs to be compacted for storage or transmission.