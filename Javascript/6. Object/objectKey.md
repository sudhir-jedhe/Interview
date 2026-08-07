Let's break down the code you provided and understand the issue and the expected output:

```js
const obj = { name: "sudhir" };    // Object with a property 'name'
const arr = ["name"];              // Array with a single element 'name'
obj[arr] = "react";                // Assign "react" to obj[arr] key
console.log(obj.name);             // Log the value of obj.name
```

### Step-by-step explanation

1. **Define `obj`**:

   ```js
   const obj = { name: "sudhir" };
   ```

   This creates an object with a property `name` that holds the value `"sudhir"`.

2. **Define `arr`**:

   ```js
   const arr = ["name"];
   ```

   This creates an array `arr` with a single element `"name"`. So, `arr` looks like this: `["name"]`.

3. **Assign a value using `obj[arr]`**:

   ```js
   obj[arr] = "react";
   ```

   In this line, you're using `arr` as a key for the `obj` object. Since `arr` is an array, JavaScript will convert it into a string when it is used as a property key.

   The string representation of `arr` is `"name"`, because the array has a single element `"name"`, and when arrays are coerced to strings, they join their elements (in this case, just `"name"`). So effectively, you're doing:

   ```js
   obj["name"] = "react";
   ```

   This **does not modify the `name` property** inside the object; rather, it adds a new property with the key `"name"` (which is a string) and assigns it the value `"react"`.

   Now, the object `obj` looks like this:

   ```js
   {
     name: "react",
     "name": "react"
   }
   ```

   The `obj["name"]` key is overwritten with `"react"`.

4. **Log `obj.name`**:

   ```js
   console.log(obj.name);
   ```

   Now when you log `obj.name`, JavaScript will look for the `name` property on the `obj`. The key `"name"` exists in the object, and its value is now `"react"`.

### Output

```js
react
```

### Why does this happen?

- `arr` is an array with the value `["name"]`, which, when coerced into a string, becomes `"name"`.
- `obj[arr]` becomes `obj["name"]`, which overwrites the existing `name` property.
- Therefore, `obj.name` is now `"react"`.

### Summary

- `obj[arr]` assigns a new property with the string `"name"` as the key and `"react"` as the value.
- This **overwrites the `obj.name` property**.
- When you log `obj.name`, it outputs `"react"`.

Yes, in JavaScript, **object keys** can only be **strings** or **symbols**. If you attempt to use a key of a different data type, JavaScript will **automatically convert** it to a string.

### Object keys and their types

1. **String keys**: If you use a string as a key, it will be used directly.
2. **Symbol keys**: A `Symbol` is a primitive type in JavaScript that can be used as an object key. Symbols are unique and do not automatically convert to strings.
3. **Other data types (e.g., number, boolean, object, array, etc.)**: These will be **converted to strings** when used as object keys.

### Examples

#### 1. **String as Object Key**

```js
const obj = { name: "Sudhir" };
console.log(obj.name);  // "Sudhir"
```

#### 2. **Symbol as Object Key**

```js
const symbolKey = Symbol("uniqueKey");
const obj = { [symbolKey]: "Some value" };
console.log(obj[symbolKey]);  // "Some value"
```

#### 3. **Number as Object Key**

If you use a number as a key, JavaScript will convert it to a string:

```js
const obj = {};
obj[10] = "Ten";
console.log(obj["10"]);  // "Ten"
console.log(obj[10]);    // "Ten"
```

- In this case, the key `10` is automatically converted to the string `"10"`. This is why both `obj["10"]` and `obj[10]` refer to the same property.

#### 4. **Boolean as Object Key**

If you use a boolean as a key, JavaScript will convert it to the string `"true"` or `"false"`:

```js
const obj = {};
obj[true] = "Yes";
obj[false] = "No";
console.log(obj["true"]);  // "Yes"
console.log(obj["false"]); // "No"
```

#### 5. **Object (or Array) as Object Key**

If you try to use an object or array as an object key, JavaScript will convert it to a **string**. The string will be `"[object Object]"` or `""` for empty arrays. This happens because non-primitive types are automatically converted to their string representations:

```js
const obj = {};
const arr = [];
obj[arr] = "Array key";
obj[{ name: "John" }] = "Object key";

console.log(obj[""]);// "Array key" because the empty array gets converted to ""
console.log(obj["[object Object]"]); // "Object key" because the object gets converted to "[object Object]"
```

### Key Takeaways

1. **String and Symbol** are the only valid types for object keys.
2. Any other data type (such as numbers, booleans, or objects) is **automatically converted to a string** when used as an object key.
3. **Symbols** are unique and are not automatically converted to strings, unlike other types.

### Example Summary

```js
const obj = {};
obj[10] = "Ten";          // Number converted to string "10"
obj[true] = "Yes";        // Boolean converted to string "true"
obj[{a: 1}] = "Object";   // Object converted to string "[object Object]"

console.log(obj["10"]);   // "Ten"
console.log(obj["true"]); // "Yes"
console.log(obj["[object Object]"]); // "Object"
```

In all cases, JavaScript will convert the keys to strings (except when using `Symbol`).

While your step-by-step breakdown gets the final answer and primary mechanics right, there is a minor conceptual error in Step 3 that is worth clearing up.

In Step 3, you wrote:

> *Now, the object `obj` looks like this:*
>
> ```js
> {
>   name: "react",
>   "name": "react"
> }
> 
> ```
>
>
> *The `obj["name"]` key is overwritten with `"react"`.*

### Clarification on Property Keys

In JavaScript plain objects, unquoted identifier keys (like `name`) and string-literal keys (like `"name"`) are **identical**.

JavaScript doesn't keep two separate keys—unquoted keys are automatically parsed as strings. Therefore, `{ name: "sudhir" }` and `{ "name": "sudhir" }` create the exact same key in memory.

When `obj[arr] = "react"` executes:

1. `arr` coerces to the string `"name"`.
2. JavaScript looks for the key `"name"` on `obj`.
3. Because the key `"name"` already exists, its value is directly overwritten from `"sudhir"` to `"react"`.

The object never holds two separate `name` properties; it simply mutated the existing one.

---

### Additional Edge Cases for Key Coercion

To build on your list of key coercion examples, here are three classic JavaScript interview edge cases that trip up developers:

#### 1. Multiple Plain Objects as Keys

Because all plain objects coerce to the string `"[object Object]"`, using multiple objects as keys will **overwrite each other**:

```js
const obj = {};
const a = { key: "a" };
const b = { key: "b" };

obj[a] = "First";  // obj["[object Object]"] = "First"
obj[b] = "Second"; // obj["[object Object]"] = "Second"

console.log(obj[a]); // "Second"

```

#### 2. Multi-Element Arrays

An array coerces to a string by calling `Array.prototype.toString()`, which implicitly calls `.join(",")`:

```js
const obj = {};
const arr1 = [1, 2, 3];
const arr2 = ["1,2,3"];

obj[arr1] = "Array Value";

// [1, 2, 3].toString() becomes "1,2,3"
console.log(obj["1,2,3"]); // "Array Value"
console.log(obj[arr2]);    // "Array Value" (both evaluate to the same string key)

```

#### 3. How to Use Actual Objects as Keys (`Map`)

If you ever need genuine objects, arrays, or functions as keys without string coercion, use ES6 `Map` instead of plain objects:

```js
const myMap = new Map();
const keyObj = { id: 1 };

myMap.set(keyObj, "User Data");

console.log(myMap.get(keyObj));  // "User Data"
console.log(myMap.get({ id: 1 })); // undefined (references are distinct!)

```
