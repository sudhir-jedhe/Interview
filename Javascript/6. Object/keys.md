```js
function isObject(object) {
  return object && typeof object === "object";
}

function keys(object) {
  return isObject(object) ? Object.keys(object) : [];
}

module.exports = keys;

```

```js
function iterateObject() {
  let exampleObj = {
    book: "Sherlock Holmes",
    author: "Arthur Conan Doyle",
    genre: "Mystery",
  };

  Object.keys(exampleObj).forEach((key) => {
    const value = exampleObj[key];
    console.log(`${key}: ${value}`);
  });
}
iterateObject();

/************************************ */
console.log(Reflect.ownKeys([]));
console.log(Reflect.ownKeys([,]));
console.log(Reflect.ownKeys([1, , 2]));
console.log(Reflect.ownKeys([...[1, , 2]]));
```

### How `Object.keys()` Works in JavaScript

The `Object.keys()` method is used to retrieve an array of an object's **own enumerable property names**. This array of keys is created based on certain internal rules about the order of keys in JavaScript objects. Let's break down the rules and how `Object.keys()` behaves behind the scenes:

### **Key Points on `Object.keys()` Behavior:**

1. **Integer-like Keys Are Sorted First:**
   - When you call `Object.keys()` on an object with properties that have numeric keys (like `1`, `2`, `3`), these keys will appear **first** in the returned array and will be sorted in **ascending numerical order**.
   - Example:
     ```javascript
     const obj = { 10: "ten", 2: "two", 1: "one" };
     console.log(Object.keys(obj));  // Output: ['1', '2', '10']
     ```

2. **String Keys Are Added in Insertion Order:**
   - After integer-like keys, any string keys are added in the **same order** they were inserted into the object.
   - Example:
     ```javascript
     const obj = { a: "apple", b: "banana", 3: "three" };
     console.log(Object.keys(obj));  // Output: ['3', 'a', 'b']
     ```

3. **Symbol Keys Are Not Included in `Object.keys()`:**
   - If the object has properties whose keys are **symbols**, these keys are not included in the array returned by `Object.keys()`. However, they can be accessed through `Object.getOwnPropertySymbols()`.
   - Example:
     ```javascript
     const sym = Symbol('sym');
     const obj = { a: "apple", [sym]: "symbol value" };
     console.log(Object.keys(obj));  // Output: ['a']
     console.log(Object.getOwnPropertySymbols(obj));  // Output: [Symbol(sym)]
     ```

### **How `Reflect.ownKeys()` Works:**

The `Reflect.ownKeys()` method returns **all the keys** (including string and symbol properties) from an object, regardless of whether they are integers, strings, or symbols.

- It retrieves **both** string keys (including integer-like keys) and **symbol keys**.
  
#### Example:
```javascript
const sym = Symbol('sym');
const obj = {
  1: "one",
  2: "two",
  "a": "apple",
  [sym]: "symbol value"
};

console.log(Reflect.ownKeys(obj));  // Output: ['1', '2', 'a', Symbol(sym)]
```

This method gives you a complete list of the **own property keys**, unlike `Object.keys()`, which only returns string keys and ignores symbols.

### **Iterating Over Object Properties with `Object.keys()` and `forEach()`**

You can use `Object.keys()` along with `Array.prototype.forEach()` to iterate over an object’s properties. Here's an example:

#### Example of Iterating Over Object Properties:

```javascript
function iterateObject() {
  let exampleObj = {
    book: "Sherlock Holmes",
    author: "Arthur Conan Doyle",
    genre: "Mystery",
  };

  Object.keys(exampleObj).forEach((key) => {
    const value = exampleObj[key];
    console.log(`${key}: ${value}`);
  });
}

iterateObject();
// Output:
// book: Sherlock Holmes
// author: Arthur Conan Doyle
// genre: Mystery
```

This code will iterate over the **own enumerable properties** of `exampleObj` and log each property’s key and value.

### **Demonstrating `Reflect.ownKeys()` Behavior with Arrays:**

Arrays in JavaScript are also objects, so they follow the same key order rules as regular objects. However, arrays have some special characteristics when using methods like `Reflect.ownKeys()`.

#### Example 1: Empty Array:
```javascript
console.log(Reflect.ownKeys([]));  // Output: []
```
An empty array has no own keys.

#### Example 2: Sparse Array:
```javascript
console.log(Reflect.ownKeys([,]));  // Output: ['0']
```
Sparse arrays (arrays with missing elements) have numeric keys (like `0`), and `Reflect.ownKeys()` includes those.

#### Example 3: Non-Sparse Array:
```javascript
console.log(Reflect.ownKeys([1, , 2]));  // Output: ['0', '2']
```
In a non-sparse array, `Reflect.ownKeys()` includes only the "present" indices (keys for non-empty slots).

#### Example 4: Using Spread Operator:
```javascript
console.log(Reflect.ownKeys([...[1, , 2]]));  // Output: ['0', '1', '2']
```
The spread operator expands the array to include its actual values, and `Reflect.ownKeys()` reflects those values as array indices.

### **How To Iterate Over Object Properties:**

You can create your own custom iterator for objects using `Object.keys()` or `Reflect.ownKeys()`:

```javascript
function forOwn(obj, fn) {
  Object.keys(obj).forEach(key => {
    fn(obj[key], key, obj);
  });
}

const exampleObj = { foo: "bar", age: 25, name: "John" };

forOwn(exampleObj, (value, key) => {
  console.log(`${key}: ${value}`);
});
// Output:
// foo: bar
// age: 25
// name: John
```

This iterates over an object's **own properties** and applies a function to each key-value pair.

### **Summary:**

- `Object.keys()` returns an array of an object's own **string** keys, in order where integer-like keys are sorted first.
- `Reflect.ownKeys()` returns **all keys** of an object, including both string and symbol keys.
- `Object.keys()` ignores properties with `undefined` values and symbols, while `Reflect.ownKeys()` includes everything.
- Iterating over object properties can be done easily using `Object.keys()` or `Reflect.ownKeys()` with `forEach()`.

By understanding these behaviors, you can make informed decisions about how to access and iterate over object properties in JavaScript!


ShortHand

It looks like you're trying to create an object in JavaScript with some shorthand for property definitions and dynamic key names. There are a couple of issues with the code you've provided. Let's break it down and explain the correct way to write this code.

### Code Review and Corrections

Here are the two object definitions you've shown:

### First Object:
```javascript
const lang = "JS";
const lib = "react";
const key = 'version';

// Create an object using the variables
const obj = {
  lang: lang, // This is a regular property assignment
  getLang: function () {} // A method defined inside the object
};
```

### Second Object (with shorthand and dynamic keys):
```javascript
const obj = {
  lang,          // Shorthand for `lang: lang`
  [key],         // Using the variable `key` ('version') to dynamically create a property
  getLang() {}   // Shorter method shorthand
};
```

### Explanation:

1. **Shorthand Property Assignment:**
   - When the property name matches the variable name, JavaScript allows you to use shorthand syntax.
   - `lang: lang` can be simplified to just `lang`. This is equivalent to writing `lang: lang`.

   So:
   ```javascript
   const obj = {
     lang,  // Equivalent to lang: lang
     getLang() {}  // This is shorthand for getLang: function() {}
   };
   ```

2. **Dynamic Property Names (Computed Property Names):**
   - `[key]` will compute the property name from the value of the `key` variable. Since `key = 'version'`, the property will be named `"version"`.
   
   This means that:
   ```javascript
   [key]: "value" // becomes 'version': "value"
   ```

### Final Code:
Here's the correct version of the code based on your intent:

```javascript
const lang = "JS";
const lib = "react";
const key = 'version';

// Create an object using the variables
const obj = {
  lang,           // Shorthand for lang: lang
  [key]: lib,     // Dynamically set the key as 'version' with the value 'react'
  getLang() {     // Method shorthand
    return this.lang;
  }
};

console.log(obj);
```

### Output:

```javascript
{
  lang: "JS",
  version: "react",
  getLang: [Function: getLang]
}
```

### Explanation:
- `lang`: The `lang` property is set to `"JS"` using shorthand syntax.
- `[key]`: This uses the value of `key` (which is `"version"`) to dynamically create a property. This sets the `version` property to the value of `lib`, which is `"react"`.
- `getLang()`: This is a method defined using shorthand syntax, and it will return the value of the `lang` property.

### Why This Works:
- **Shorthand properties**: If the property name matches the variable name, you can omit the colon (`:`) and just use the variable name.
- **Computed properties**: You can use square brackets (`[]`) to dynamically compute property names from a variable.
- **Method shorthand**: In modern JavaScript (ES6+), methods inside objects can be written without the `function` keyword.

Let me know if you have any more questions!