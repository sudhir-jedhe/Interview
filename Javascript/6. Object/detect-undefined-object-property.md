### Understanding the Difference Between `undefined` and Non-Existent Properties in JavaScript

In JavaScript, the way to check if a property exists or if its value is `undefined` can sometimes lead to ambiguity. The issue arises because a property that exists on an object can have a value of `undefined`, but you also have properties that are not defined at all (i.e., they don't exist on the object).

Let’s break down the different cases in your example:

### 1. **Checking for `undefined` Values**

Consider the following example:

```javascript
const obj = { prop: undefined };

console.log(obj.prop === undefined);  // true
console.log(typeof obj.prop === 'undefined');  // true
```

**Explanation**:

- `obj.prop === undefined` checks if the property `prop` is explicitly assigned the value `undefined`. In this case, the value is `undefined`, so this comparison returns `true`.
- `typeof obj.prop === 'undefined'` checks the type of `obj.prop`, which is `undefined`. Since `obj.prop` is explicitly set to `undefined`, this also returns `true`.

Both checks confirm that the property `prop` exists, but its value is `undefined`.

### 2. **Checking for Non-Existent Properties**

If a property does not exist on the object, the result is slightly different:

```javascript
console.log(obj.porp === undefined);  // true
console.log(typeof obj.porp === 'undefined');  // true
```

**Explanation**:

- `obj.porp === undefined` returns `true` because `porp` is not a property of `obj`, so JavaScript implicitly considers it `undefined`. This is due to the fact that accessing a non-existent property on an object will return `undefined`.
- `typeof obj.porp === 'undefined'` also returns `true` for the same reason: the property `porp` doesn't exist, and `typeof` a non-existent property also evaluates to `'undefined'`.

So, both checks return `true`, but this could be confusing because it might seem like the property exists, but it’s actually non-existent on the object.

### 3. **Using `Object.prototype.hasOwnProperty()`**

To avoid ambiguity and accurately determine whether a property exists, it is recommended to use `Object.prototype.hasOwnProperty()`:

```javascript
const hasUndefinedProperty = (obj, prop) =>
  obj.hasOwnProperty(prop) && obj[prop] === undefined;

const obj = { prop: undefined };

console.log(hasUndefinedProperty(obj, 'prop'));  // true
console.log(hasUndefinedProperty(obj, 'porp'));  // false
```

**Explanation**:

- **`obj.hasOwnProperty(prop)`** checks if the `prop` is **actually a property** on the object `obj` (it checks if the property exists directly on the object and is not inherited from the prototype).
- **`obj[prop] === undefined`** checks if the value of the property is `undefined`.

Together, these checks ensure that:

1. The property `prop` **exists** on the object.
2. The property `prop` has the value `undefined`.

Thus, the `hasUndefinedProperty` function will:

- Return `true` if the property exists and its value is `undefined`.
- Return `false` if the property doesn’t exist on the object.

### Example Breakdown

```javascript
const obj = { prop: undefined };

console.log(hasUndefinedProperty(obj, 'prop'));  // true
console.log(hasUndefinedProperty(obj, 'porp'));  // false
```

- **For `obj.prop`**: The property `prop` exists on `obj`, and its value is explicitly set to `undefined`. Therefore, `hasUndefinedProperty(obj, 'prop')` returns `true`.
- **For `obj.porp`**: The property `porp` does not exist on `obj`, so `hasUndefinedProperty(obj, 'porp')` returns `false`.

### Why Use `hasOwnProperty()`?

Using `hasOwnProperty()` helps distinguish between properties that are explicitly set to `undefined` and properties that do not exist at all. This can be critical in situations where you want to handle both cases differently.

### Summary

- **`obj[prop] === undefined`** checks if the property is either undefined or non-existent.
- **`typeof obj[prop] === 'undefined'`** behaves the same as the first check for non-existent properties.
- **`hasOwnProperty()`** is useful for checking whether a property exists directly on the object, preventing confusion between properties that are explicitly set to `undefined` and those that don't exist on the object at all.
