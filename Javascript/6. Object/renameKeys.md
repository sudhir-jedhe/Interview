### Renaming Keys in JavaScript Objects

You've provided a series of examples for renaming keys in JavaScript objects. Let's break down and explain each approach used to rename the keys, and then summarize the final behavior.

---

### 1. **Using a `keyMap` and a `for...in` loop**

The first example uses a `keyMap` to rename keys in an object. The function `renameKeys` checks if the current key is present in `keyMap` and renames it accordingly.

```javascript
function renameKeys(obj, keyMap) {
    // Create a new object to store the renamed keys
    const renamed = {};

    // Iterate over each key in the original object
    for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
            // Check if the key exists in the keyMap
            if (keyMap.hasOwnProperty(key)) {
                // Rename the key using the keyMap
                renamed[keyMap[key]] = obj[key];
            } else {
                // Keep the key unchanged if not in keyMap
                renamed[key] = obj[key];
            }
        }
    }

    return renamed;
}

const user = {
    firstName: 'John',
    lastName: 'Doe',
    age: 30,
    email: 'john.doe@example.com'
};

const keyMap = {
    firstName: 'name',
    lastName: 'surname'
};

const renamedUser = renameKeys(user, keyMap);
console.log(renamedUser);
// Output:
// {
//     "name": "John",
//     "surname": "Doe",
//     "age": 30,
//     "email": "john.doe@example.com"
// }
```

#### Explanation:
- The `renameKeys` function:
  - Creates a new object `renamed`.
  - Iterates through all the keys of the original object (`obj`).
  - If the key exists in the `keyMap`, it renames it to the mapped value.
  - If the key does not exist in the `keyMap`, it keeps the original key.
- The function returns the new object with the renamed keys.

This is a **custom solution** using a `keyMap` that is flexible and allows you to rename multiple keys easily.

---

### 2. **Using `Object.entries` and `map` for Renaming**

In this example, you're using `Object.entries` to convert the object into an array of key-value pairs, and then you apply `map` to modify the keys based on a `mapping` object.

```javascript
const originalObj = {
    city: "Kanpur",
    state: "UP",
};

const mapping = {
    city: "location",
    state: "region"
};

const renamedObj = Object.fromEntries(
    Object.entries(originalObj).map(([key, value]) => {
        const newKey = mapping[key] || key;  // Use mapped key if available, else keep original key
        return [newKey, value];
    })
);

console.log(renamedObj);
// Output:
// { location: 'Kanpur', region: 'UP' }
```

#### Explanation:
- **`Object.entries(originalObj)`** converts the object into an array of key-value pairs.
- **`map`** iterates over each pair and uses the `mapping` object to find the new key. If a new key exists in `mapping`, it is used; otherwise, the original key is retained.
- **`Object.fromEntries`** is used to convert the array of modified key-value pairs back into an object.

This method is concise and leverages ES6's **`Object.entries`** and **`Object.fromEntries`** to achieve the renaming in a more functional way.

---

### 3. **Using `for...in` with Conditional Renaming**

In this version, a specific conditional renaming is applied when iterating over the original object using `for...in`.

```javascript
const originalObj = { name: "John", age: 30 };
const renamedObj = {};

for (const key in originalObj) {
    const newKey = key === "name" ? "fullName" : key; // Rename 'name' to 'fullName'
    renamedObj[newKey] = originalObj[key];
}

console.log(renamedObj);
// Output:
// { fullName: 'John', age: 30 }
```

#### Explanation:
- The `for...in` loop iterates through all keys of `originalObj`.
- A **conditional check** is applied: if the key is `"name"`, it gets renamed to `"fullName"`. Otherwise, the key remains unchanged.
- The result is stored in a new object `renamedObj`.

This approach is simple but is more tailored for specific renaming conditions (like renaming only a single key).

---

### 4. **Using Spread Operator and Conditional Logic**

The final example renames a key in an object conditionally, using the spread operator (`...`).

```javascript
const product = {
    name: "T-Shirt",
    price: 20,
    discount: 10
};

const renamedProduct = {
    ...product,
    [product.discount > 0 ? "discountedPrice" : "price"]: product.price,
};

console.log(renamedProduct);
// Output:
// { name: 'T-Shirt', price: 20, discountedPrice: 20 }
```

#### Explanation:
- **Spread operator (`...product`)** copies all properties from the `product` object to `renamedProduct`.
- A conditional expression is used to determine the new property name. If the `discount` is greater than 0, the new property is named `"discountedPrice"`, otherwise, it keeps the original `"price"`.
- This method is concise and works well when you need to rename or replace a property conditionally.

---

### **Comparison of Approaches**

1. **Using `keyMap` with `for...in` loop:**
   - More flexible for renaming multiple keys.
   - Requires a separate map (`keyMap`) to define the renaming rules.
   - **Mutates** the object directly.

2. **Using `Object.entries` and `map`:**
   - More functional and concise.
   - Works well for renaming based on a lookup object (`mapping`).
   - Does not mutate the original object and creates a new one.

3. **Using `for...in` with Conditional Logic:**
   - Suitable for **specific** renaming based on conditions.
   - Offers simplicity and direct control over renaming individual keys.
   - **Mutates** the object.

4. **Using Spread Operator and Conditional Logic:**
   - Elegant and concise, especially for conditional renaming.
   - **Non-mutating**, creates a new object.
   - Works well for replacing or conditionally renaming a single property.

---

### **Summary**

- If you need a **general solution** that works with multiple properties, go with the **`keyMap` method** or the **`Object.entries` approach**.
- For **conditional renaming** (like changing only one property based on a condition), **`for...in`** or the **spread operator** method are great choices.
- If you want to ensure the **original object is not mutated**, prefer using **`Object.entries`** or the **spread operator** approach.
