Let's go through the concepts you're working on and refine the functions to handle deep comparison correctly.

### Issue with JSON.stringify-based equality

The `JSON.stringify` method has limitations when comparing complex objects:

1. **Order of keys**: It depends on the order of keys in the objects. For example, `{ a: 1, b: 2 }` is considered different from `{ b: 2, a: 1 }`, even though they contain the same keys and values.
2. **Undefined values**: `undefined` values are ignored in objects when stringified. This causes issues when comparing objects with `undefined` values. For example:
   - `{ name: 'John' }` is considered equal to `{ name: 'John', age: undefined }`, which isn't correct.

### Using `JSON.stringify` in the `equals` function

The first approach of using `JSON.stringify(a) === JSON.stringify(b)` works well for simple, flat objects but fails when there are `undefined` values or different key orders. Let's improve that with a **deep comparison function**.

### Deep Comparison Function

You already implemented a deep comparison function, and it looks almost correct. Let's break it down and clarify how it works.

1. **Primitive Comparison**: First, it checks if `a` and `b` are the same using strict equality (`===`).
2. **Date Comparison**: If both are `Date` objects, it compares their time values (`getTime()`).
3. **Type and Object Check**: If either is not an object (or is null), it compares their values directly.
4. **Prototype Comparison**: It checks that both `a` and `b` have the same prototype. This ensures that the two objects have the same type (e.g., both are plain objects or arrays).
5. **Key Length Comparison**: It ensures both objects have the same number of keys.
6. **Recursion on Nested Values**: It then compares each key recursively, using `equals` to handle nested structures.

Here’s your `equals` function in action:

```javascript
const equals = (a, b) => {
  // Primitive comparison
  if (a === b) return true;

  // Date comparison
  if (a instanceof Date && b instanceof Date)
    return a.getTime() === b.getTime();

  // Handle null or non-objects (like primitive values)
  if (!a || !b || (typeof a !== 'object' && typeof b !== 'object'))
    return a === b;

  // Prototype comparison (ensures both objects are of the same type)
  if (a.prototype !== b.prototype) return false;

  // Compare the number of keys
  const keys = Object.keys(a);
  if (keys.length !== Object.keys(b).length) return false;

  // Compare the values of each key recursively
  return keys.every(k => equals(a[k], b[k]));
};

// Example usage:

const a = { name: 'John', age: 26 };
const b = { name: 'John', age: 26 };
console.log(equals(a, b)); // true

const c = { name: 'John' };
const d = { name: 'John', age: undefined };
console.log(equals(c, d)); // false

// Nested object comparison
const obj1 = { a: [2, { e: 3 }], b: [4], c: 'foo' };
const obj2 = { a: [2, { e: 3 }], b: [4], c: 'foo' };
console.log(equals(obj1, obj2)); // true

// Arrays vs Objects
console.log(equals([1, 2, 3], { 0: 1, 1: 2, 2: 3 })); // true
```

### Explanation

1. **Primitive Comparison**: If `a` and `b` are the exact same value (or both `null`), return `true`.
2. **Date Comparison**: Special case for `Date` objects. If both `a` and `b` are instances of `Date`, compare their timestamps.
3. **Type and Object Check**: If one is not an object (or is `null`), perform a direct comparison. If they are primitive values like strings or numbers, this step ensures they are compared properly.
4. **Prototype Comparison**: This ensures both objects have the same constructor and prototype chain.
5. **Key Length Comparison**: If they don't have the same number of properties, they can't be equal, so return `false`.
6. **Recursive Comparison**: For each key in `a`, check if `b` has the same key with an equal value. This is where the recursion happens for nested objects.

### Additional Considerations

1. **Order of Properties**:
   - The function checks for keys' length and the recursive comparison for each key, so it handles different key orderings correctly (unlike `JSON.stringify`, which is sensitive to order).

2. **Handling Undefined**:
   - Unlike `JSON.stringify`, which ignores `undefined`, your function will correctly identify when `undefined` is part of an object (since `undefined` is falsy, but the comparison for `undefined` itself will return `false`).

### Why Use Deep Equality?

Deep equality is useful when you need to compare objects that might have nested structures or when objects have complex data types like arrays or dates. A shallow comparison (using `===` or `JSON.stringify`) will fail when objects have nested properties or when comparing arrays and objects with the same values but different reference types.

### Examples

#### Example 1: Handling Undefined

```javascript
const c = { name: 'John' };
const d = { name: 'John', age: undefined };

console.log(equals(c, d)); // false
```

- The function correctly returns `false` because `undefined` is not the same as an omitted property.

#### Example 2: Nested Objects

```javascript
const obj1 = { a: [2, { e: 3 }], b: [4], c: 'foo' };
const obj2 = { a: [2, { e: 3 }], b: [4], c: 'foo' };

console.log(equals(obj1, obj2)); // true
```

- The function recursively compares the nested objects (`a` and `b` arrays), ensuring that all nested properties are checked.

#### Example 3: Arrays vs Objects

```javascript
console.log(equals([1, 2, 3], { 0: 1, 1: 2, 2: 3 })); // true
```

- This example shows that arrays and objects with the same values (but different structures) are considered equal because `equals` compares the values and key names properly.

### Conclusion

Your deep equality function works well for a variety of use cases, from basic primitive types to deeply nested objects. It handles different edge cases like `undefined`, `null`, and `Date` objects while ensuring correct comparison even with differing key orders.

When working with JavaScript objects, distinguishing between an object's **own properties** (directly assigned to the object) and **inherited properties** (coming from its prototype chain) is a common requirement.

Here is a comprehensive breakdown of how `Object.hasOwn`, `Object.prototype.hasOwnProperty`, `Object.keys`, and `for...in` behave regarding prototype properties, property enumeration, and edge cases.

---

## Quick Comparison Matrix

| Method / Operator             | Checks Own Properties?    | Checks Prototype Properties? | Checks Non-Enumerable Properties? | Safe for Null-Prototype Objects? |
| ----------------------------- | ------------------------- | ---------------------------- | --------------------------------- | -------------------------------- |
| **`Object.hasOwn(obj, key)`** | ✅ **Yes**                 | ❌ No                         | ✅ **Yes**                         | ✅ **Yes**                        |
| **`obj.hasOwnProperty(key)`** | ✅ **Yes**                 | ❌ No                         | ✅ **Yes**                         | ❌ No (Throws Error)              |
| **`Object.keys(obj)`**        | ✅ **Yes** (Returns array) | ❌ No                         | ❌ No                              | ✅ **Yes**                        |
| **`for...in` Loop**           | ✅ **Yes**                 | ✅ **Yes**                    | ❌ No                              | ✅ **Yes**                        |

---

## 1. `Object.hasOwn(obj, propertyKey)` (Modern Standard)

Introduced in **ES2022**, `Object.hasOwn()` is a static method that returns `true` if the specified object has the indicated property as its **own property**. It completely ignores inherited properties on the prototype chain.

### Key Characteristics

- **Ignores Prototypes:** Returns `false` for prototype properties.
- **Includes Non-Enumerables:** Returns `true` even if the own property is non-enumerable (`enumerable: false`).
- **Null-Safe:** It is a static method on `Object`, so it works safely on objects created with `Object.create(null)` or objects where `hasOwnProperty` was overridden.

```javascript
const parent = { inheritedProp: 'I am inherited' };
const child = Object.create(parent);
child.ownProp = 'I am own';

console.log(Object.hasOwn(child, 'ownProp'));        // true
console.log(Object.hasOwn(child, 'inheritedProp')); // false
console.log(Object.hasOwn(child, 'toString'));      // false (Object.prototype method)

```

---

## 2. `Object.prototype.hasOwnProperty(propertyKey)` (Legacy Method)

This is the traditional method inherited from `Object.prototype`. It behaves identically to `Object.hasOwn()` for standard objects, but carries **two major edge cases**:

### The Pitfalls of `hasOwnProperty`

#### Pitfall A: Objects Created with `Object.create(null)`

Objects created via `Object.create(null)` do not inherit from `Object.prototype`, meaning `hasOwnProperty` is `undefined`:

```javascript
const nullObj = Object.create(null);
nullObj.name = 'Alice';

// ❌ Throws TypeError: nullObj.hasOwnProperty is not a function
// nullObj.hasOwnProperty('name'); 

// ✅ Object.hasOwn works safely:
console.log(Object.hasOwn(nullObj, 'name')); // true

```

#### Pitfall B: Overridden `hasOwnProperty` Property

If an object defines its own property named `hasOwnProperty`, calling the method invokes the property value instead:

```javascript
const badObj = {
  hasOwnProperty: false, // Property overrides prototype method!
  foo: 'bar'
};

// ❌ Throws TypeError: badObj.hasOwnProperty is not a function
// badObj.hasOwnProperty('foo');

// ✅ Object.hasOwn works safely:
console.log(Object.hasOwn(badObj, 'foo')); // true

```

> **Best Practice:** Use `Object.hasOwn()` everywhere in modern JavaScript. If you must support legacy environments, write `Object.prototype.hasOwnProperty.call(obj, key)` instead of calling `obj.hasOwnProperty(key)`.

---

## 3. `Object.keys(obj)` (Enumerable Own Keys Array)

`Object.keys()` returns an array of an object's **own enumerable string-keyed property names**.

### Key Characteristics

- **Ignores Prototypes:** Does **not** include inherited properties from the prototype chain.
- **Ignores Non-Enumerables:** Skips properties defined with `enumerable: false` (such as methods on ES6 classes or built-in prototype methods).
- **Returns Array:** Allows using array methods like `.filter()`, `.map()`, or `.forEach()`.

```javascript
const prototypeObj = { protoProp: 'proto' };
const myObj = Object.create(prototypeObj);

myObj.a = 1;
myObj.b = 2;

// Hide property 'b' from enumeration:
Object.defineProperty(myObj, 'c', { value: 3, enumerable: false });

console.log(Object.keys(myObj)); 
// Output: ['a', 'b']  ('protoProp' and non-enumerable 'c' are excluded)

```

---

## 4. `for...in` Loop (Enumerable Own + Prototype Keys)

The `for...in` loop iterates over all **enumerable property keys** of an object, **including enumerable properties inherited from its prototype chain**.

### Key Characteristics

- **Includes Prototypes:** Walks up the entire prototype chain and visits all enumerable properties.
- **Ignores Non-Enumerables:** Ignores built-in prototype methods like `Object.prototype.toString` because they are marked `enumerable: false`.
- **Requires Safeguards:** To process only an object's own properties in a `for...in` loop, you must wrap the body with an `Object.hasOwn()` check:

```javascript
const vehicle = { wheels: 4 };
const car = Object.create(vehicle);
car.brand = 'Toyota';

for (let key in car) {
  console.log(key); 
}
// Output:
// "brand"
// "wheels"  <-- Inherited from vehicle prototype!

// Safe usage with Object.hasOwn filter:
for (let key in car) {
  if (Object.hasOwn(car, key)) {
    console.log('Own key:', key); // Outputs ONLY "brand"
  }
}

```

---

## Summary Code Example

Here is a single snippet demonstrating how all 4 approaches handle a multi-level prototype object:

```javascript
// 1. Setup Prototype
const grandparent = { gProp: 'Grandparent' };
const parent = Object.create(grandparent);
parent.pProp = 'Parent';

// 2. Setup Instance Object
const child = Object.create(parent);
child.cProp = 'Child';

// Add non-enumerable own property
Object.defineProperty(child, 'hiddenProp', { value: 'Secret', enumerable: false });

// --- EVALUATIONS ---

// A. Object.hasOwn / hasOwnProperty (Checks own only, includes non-enumerable)
console.log(Object.hasOwn(child, 'cProp'));      // true  (Own enumerable)
console.log(Object.hasOwn(child, 'hiddenProp')); // true  (Own non-enumerable)
console.log(Object.hasOwn(child, 'pProp'));      // false (Inherited)

// B. Object.keys (Own enumerable only)
console.log(Object.keys(child)); 
// Output: ['cProp']

// C. for...in (Own + Prototype enumerable)
const keysInLoop = [];
for (let key in child) {
  keysInLoop.push(key);
}
console.log(keysInLoop); 
// Output: ['cProp', 'pProp', 'gProp']

```
