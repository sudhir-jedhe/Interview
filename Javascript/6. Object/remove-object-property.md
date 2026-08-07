### Explanation of Methods to Remove Properties from an Object

In JavaScript, there are several ways to **remove or set properties** in an object, depending on your needs (e.g., mutating the object, not mutating the object, etc.). Let's go over the three methods you provided: **setting a property to `undefined`**, **using the `delete` operator**, and **using object destructuring with the spread operator**.

---

### 1. **Setting a Property to `undefined`**

```javascript
const pet = {
  species: 'dog',
  age: 3,
  name: 'celeste',
  gender: 'female'
};

pet.gender = undefined;
Object.keys(pet); // ['species', 'age', 'name', 'gender']
```

#### Explanation

- When you set a property to `undefined`, the property **remains in the object**, but its value becomes `undefined`.
- **Important**: The property is still present in the object (it’s just `undefined`), so `Object.keys(pet)` will **still list the `gender` property**.
- This does **not remove** the property from the object, but rather **mutates the value** of the property.
- This approach is generally not optimal when you want to truly "remove" a property, as it might cause confusion since the property still exists in the object, even though its value is `undefined`.

---

### 2. **Using the `delete` Operator**

```javascript
const pet = {
  species: 'dog',
  age: 3,
  name: 'celeste',
  gender: 'female'
};

delete pet.gender;
Object.keys(pet); // ['species', 'age', 'name']
```

#### Explanation

- The `delete` operator **removes the property** from the object entirely.
- After using `delete`, `Object.keys(pet)` no longer lists `gender` because the property has been **removed** from the object.
- **Mutation**: The `delete` operator mutates the original object. It's **not non-mutating**, meaning it directly modifies the object by removing the property.
- This is a more "permanent" solution than setting a property to `undefined`.

---

### 3. **Using Object Destructuring with the Spread Operator**

```javascript
const pet = {
  species: 'dog',
  age: 3,
  name: 'celeste',
  gender: 'female'
};

const { gender, ...newPet } = pet;
Object.keys(pet); // ['species', 'age', 'name', 'gender']
Object.keys(newPet); // ['species', 'age', 'name']
```

#### Explanation

- **Destructuring** allows you to extract properties from an object and optionally exclude certain ones.
- In this case, `{ gender, ...newPet } = pet`:
  - The `gender` property is **extracted** from the `pet` object.
  - The rest of the properties (`species`, `age`, `name`) are gathered into a new object `newPet` using the **spread operator** (`...`).
- The **original `pet` object remains unchanged**, while a **new object (`newPet`) is created** without the `gender` property.
- **No Mutation**: This method does not mutate the original `pet` object, which makes it a safer approach when you want to avoid changing the original data.

---

### **Comparing the Approaches**

1. **Setting a property to `undefined`:**
   - The property still exists in the object but has an undefined value.
   - The object is mutated, and the property remains in `Object.keys(pet)`.
   - Not the best choice when you want to "remove" a property because it still exists in the object.

2. **Using the `delete` operator:**
   - The property is completely removed from the object.
   - The object is mutated.
   - Suitable when you want to **permanently** remove a property.

3. **Using object destructuring with the spread operator:**
   - The property is omitted from the new object, and the original object is unchanged.
   - **Non-mutating**, which is useful if you want to keep the original object intact.
   - Creates a **new object**, so if you're interested in the result of removing a property without modifying the original, this is a good choice.

---

### Summary

- **`undefined` assignment**: The property remains in the object, but its value is `undefined`. This does not remove the property.
- **`delete` operator**: Completely removes the property from the object but mutates it.
- **Object destructuring**: Creates a new object with certain properties omitted, leaving the original object unchanged.

Choose the method based on whether or not you want to mutate the original object, and whether you want the property to **still exist** or be completely **removed**.

Your breakdown of these three methods is accurate and well-articulated. To give you a complete picture, here are a few critical nuances regarding performance, edge cases, and alternative modern methods.

---

### Key Technical Nuances & Gotchas

#### 1. Performance Impact of `delete`

While `delete` is the idiomatic way to mutate an object by removing a key, it has a hidden performance cost in V8 and other modern JavaScript engines:

- **Hidden Classes (Shape):** JS engines optimize object access by assigning a hidden class ("shape") to objects with identical properties. Using `delete` changes an object's shape dynamically, causing the engine to turn off fast property access (Inline Caching) for that object and fall back to dictionary lookup mode.
- **Practical Advice:** In hot loops or high-performance code, preferred alternatives are creating a new object via destructuring or setting values to `null`/`undefined` if removing the key key-presence check (`'key' in obj`) isn't strictly required.

#### 2. Shallow Copy Limitations with Rest/Spread

Using `{ gender, ...newPet } = pet` creates a **shallow copy**:

- Top-level primitives are copied by value, but nested objects or arrays retain their memory references to the original object. Modifying nested properties on `newPet` will still mutate `pet`.

#### 3. Dynamic Key Omission with Destructuring

A common limitation with object destructuring is omitting a dynamic key (where the key name is stored in a variable):

```javascript
const keyToRemove = 'gender';

// Dynamic destructuring syntax using computed property names:
const { [keyToRemove]: omitted, ...newPet } = pet;

console.log(newPet); // { species: 'dog', age: 3, name: 'celeste' }

```

---

### Alternative: `Reflect.deleteProperty()`

ES6 introduced `Reflect.deleteProperty()`, which behaves almost identically to the `delete` operator, but returns a Boolean indicating whether the deletion succeeded.

```javascript
const pet = { name: 'celeste', gender: 'female' };

const success = Reflect.deleteProperty(pet, 'gender');

console.log(success); // true
console.log(pet);     // { name: 'celeste' }

```

- **Why use it?** It is functionally equivalent to `delete pet.gender`, but fits naturally into functional programming workflows and Proxy traps where function calls are preferred over operators.

---

### Comparison Matrix

| Method                     | Mutates Original? | Deletes Key entirely?   | Engine Performance           | Best For                                                                           |
| -------------------------- | ----------------- | ----------------------- | ---------------------------- | ---------------------------------------------------------------------------------- |
| `obj.key = undefined`      | Yes               | ❌ No                    | ⚡ Fast                       | Quick value resetting when key presence isn't checked via `in` or `Object.keys()`. |
| `delete obj.key`           | Yes               | ✅ Yes                   | 🐢 Slow (breaks optimization) | Standalone scripts, memory cleanup, or simple mutations outside hot loops.         |
| `{ key, ...rest }`         | **No**            | ✅ Yes (on returned obj) | ⚡ Fast                       | React/Redux state management, immutability patterns, and pure functions.           |
| `Reflect.deleteProperty()` | Yes               | ✅ Yes                   | 🐢 Slow                       | Metaprogramming, Proxy handlers, and functional pipelines.                         |

Show me how to write a JavaScript function that accepts an object and an array of keys to omit, returning a new object without mutating the original.

Here are the best ways to write a non-mutating `omit` function in JavaScript, ranging from modern ES6+ functional approaches to high-performance utility functions.

---

### Method 1: Using `Object.keys()` and `reduce()` (Functional & Clean)

This approach iterates through the original object's keys and builds a new object, adding only the keys that are **not** present in your exclusion array.

```javascript
function omit(obj, keysToOmit) {
  // Convert array to a Set for O(1) lookup performance
  const omitSet = new Set(keysToOmit);

  return Object.keys(obj).reduce((acc, key) => {
    if (!omitSet.has(key)) {
      acc[key] = obj[key];
    }
    return acc;
  }, {});
}

// Example usage:
const user = {
  id: 101,
  firstName: "Jane",
  lastName: "Doe",
  passwordHash: "secret123",
  ssn: "000-00-0000"
};

const publicUser = omit(user, ["passwordHash", "ssn"]);

console.log(publicUser);
// Output: { id: 101, firstName: "Jane", lastName: "Doe" }

console.log(user);
// Original object remains unchanged!

```

---

### Method 2: Using `Object.fromEntries()` and `Object.entries()` (Concise ES2019+)

If you prefer a concise single-liner, convert the object into an array of `[key, value]` entries, filter out the unwanted keys, and convert it back into an object.

```javascript
const omit = (obj, keysToOmit) => {
  const omitSet = new Set(keysToOmit);
  return Object.fromEntries(
    Object.entries(obj).filter(([key]) => !omitSet.has(key))
  );
};

// Example usage:
const product = { id: 1, name: "Laptop", price: 999, internalCode: "X9" };
const cleanedProduct = omit(product, ["internalCode"]);

console.log(cleanedProduct); 
// Output: { id: 1, name: "Laptop", price: 999 }

```

---

### Method 3: Using Destructuring Iteration (Fast Performance)

For large objects or performance-critical loops, a standard `for...in` loop combined with `Object.hasOwn` (or `hasOwnProperty`) avoids array allocations and performs faster than `.reduce()` or `.filter()`.

```javascript
function omit(obj, keysToOmit) {
  const omitSet = new Set(keysToOmit);
  const result = {};

  for (const key in obj) {
    // Ensure we only check own properties and skip keys in the omit list
    if (Object.hasOwn(obj, key) && !omitSet.has(key)) {
      result[key] = obj[key];
    }
  }

  return result;
}

```

---

### Key Design Considerations

1. **`Set` Lookup Optimization:** Wrapping `keysToOmit` in `new Set(keysToOmit)` changes lookup time from $O(N)$ (`Array.prototype.includes`) to $O(1)$ (`Set.prototype.has`). This guarantees linear execution time $O(K)$, where $K$ is the number of keys on the object, regardless of how many keys you pass to omit.
2. **Shallow Copy Warning:** All of these functions produce a **shallow copy**. If your object contains nested objects or arrays, the references to those inner structures are shared between the original and new objects.
3. **Inherited Properties:** Using `Object.keys()` or `Object.hasOwn()` guarantees that inherited properties from the object's prototype are excluded from the output.

Show me how to implement a deep Omit function that can handle nested objects and paths like 'user.address.zip'.
Here is a complete, non-mutating implementation of a `deepOmit` function that supports dot-notation paths (e.g., `'user.address.zip'`), handles nested arrays, and leaves the original object untouched.

---

### Implementation

```javascript
function deepOmit(obj, pathsToOmit) {
  // Edge case guard: return primitives, null, or undefined as-is
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  // Handle Arrays recursively
  if (Array.isArray(obj)) {
    return obj.map((item) => deepOmit(item, pathsToOmit));
  }

  // 1. Group paths by top-level key and target sub-paths
  // Example: ['address.city', 'address.zip', 'name']
  // becomes:
  // {
  //   address: ['city', 'zip'],
  //   name: [] // empty array means omit the key entirely
  // }
  const pathMap = {};
  for (const path of pathsToOmit) {
    const dotIndex = path.indexOf('.');
    if (dotIndex === -1) {
      // Direct property omission at current level
      pathMap[path] = pathMap[path] || [];
    } else {
      // Nested path split into current level key and remaining path
      const currentKey = path.slice(0, dotIndex);
      const remainingPath = path.slice(dotIndex + 1);
      pathMap[currentKey] = pathMap[currentKey] || [];
      pathMap[currentKey].push(remainingPath);
    }
  }

  // 2. Reconstruct object without omitted keys
  const result = {};

  for (const key in obj) {
    if (!Object.hasOwn(obj, key)) continue;

    // Skip key completely if explicitly targeted at this level without remaining sub-paths
    if (Object.hasOwn(pathMap, key) && pathMap[key].length === 0) {
      continue;
    }

    // Recursively process nested path if sub-paths exist
    if (Object.hasOwn(pathMap, key) && pathMap[key].length > 0) {
      result[key] = deepOmit(obj[key], pathMap[key]);
    } else if (typeof obj[key] === 'object' && obj[key] !== null) {
      // Deep clone untouched nested objects to guarantee immutability
      result[key] = deepOmit(obj[key], []);
    } else {
      result[key] = obj[key];
    }
  }

  return result;
}

```

---

### Example Usage

```javascript
const userData = {
  id: 101,
  profile: {
    name: "Jane Doe",
    settings: {
      theme: "dark",
      notifications: true,
      apiKey: "secret-12345"
    }
  },
  contacts: [
    { type: "email", value: "jane@example.com", verified: true },
    { type: "phone", value: "555-0199", verified: false }
  ]
};

// Paths using dot-notation
const paths = [
  "profile.settings.apiKey", // Deep key
  "contacts.verified"         // Key inside an array of objects
];

const cleanedData = deepOmit(userData, paths);

console.log(cleanedData);
/*
Output:
{
  id: 101,
  profile: {
    name: "Jane Doe",
    settings: {
      theme: "dark",
      notifications: true
      // apiKey is removed
    }
  },
  contacts: [
    { type: "email", value: "jane@example.com" }, // verified is removed
    { type: "phone", value: "555-0199" }          // verified is removed
  ]
}
*/

// Original object remains intact
console.log(userData.profile.settings.apiKey); // "secret-12345"

```

---

### Key Mechanics

1. **Path Grouping ($O(N)$ Parsing):** Instead of traversing the entire object tree repeatedly for every path, `pathMap` parses top-level segments in one pass. It routes sub-paths (`city`, `zip`) to their parent key (`address`).
2. **Recursive Cloning:** Untouched nested objects and arrays are recursively recreated rather than referenced directly, ensuring **true immutability** (modifying `cleanedData.profile` will not mutate `userData.profile`).
3. **Array Mapping:** When a path targets a collection (e.g., `'contacts.verified'`), the function automatically maps through each item in the array to strip the key from every element.

Here is how to implement a deep `pick` function in JavaScript that extracts only specified dot-notation paths (including nested objects and array indices) while preserving the original object's structure.

### Deep Pick Implementation

```javascript
function deepPick(obj, paths) {
  if (!obj || typeof obj !== 'object') return {};

  const result = {};

  for (const path of paths) {
    const keys = path.split('.');
    let currentSource = obj;
    let currentTarget = result;
    let isValidPath = true;

    // Traverse the source object along the dot-notation path
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];

      // Check if path exists in source
      if (currentSource === null || currentSource === undefined || !(key in currentSource)) {
        isValidPath = false;
        break;
      }

      // If it's the last key in the path, assign the actual value
      if (i === keys.length - 1) {
        currentTarget[key] = currentSource[key];
      } else {
        // Prepare intermediate object/array structure if it doesn't exist yet
        const nextKey = keys[i + 1];
        const isNextKeyArrayIndex = !isNaN(Number(nextKey));

        if (!(key in currentTarget)) {
          currentTarget[key] = isNextKeyArrayIndex ? [] : {};
        }

        currentTarget = currentTarget[key];
        currentSource = currentSource[key];
      }
    }
  }

  return result;
}

```

---

### Example Usage

```javascript
const user = {
  id: 101,
  profile: {
    name: {
      first: 'John',
      last: 'Doe'
    },
    contacts: [
      { type: 'email', value: 'john@example.com' },
      { type: 'phone', value: '555-0199' }
    ]
  },
  settings: {
    theme: 'dark',
    notifications: true
  }
};

const picked = deepPick(user, [
  'id',
  'profile.name.first',
  'profile.contacts.0.value',
  'settings.theme'
]);

console.log(picked);
/*
Output:
{
  id: 101,
  profile: {
    name: {
      first: 'John'
    },
    contacts: [
      { value: 'john@example.com' }
    ]
  },
  settings: {
    theme: 'dark'
  }
}
*/

```

---

### How It Works

1. **Path Splitting (`path.split('.')`):** Converts string paths like `"profile.name.first"` into an array of individual keys: `["profile", "name", "first"]`.
2. **Path Verification:** Iterates through `obj` key by key using `key in currentSource`. If any segment of the path is missing or hits a `null`/`undefined` parent, it safely aborts that path without throwing an error.
3. **Structure Reconstruction:** As it walks down the path, it builds matching dynamic target nodes (`{}` for object keys or `[]` if the next segment is a numeric index) inside `result`.
4. **Value Assignment:** Once it reaches the last key in the path array, it assigns the value directly to the deeply constructed path inside `result`.
