### Explanation of Non-Enumerable Properties

In JavaScript, properties of objects are **enumerable** by default unless explicitly marked as **non-enumerable**. This affects how you interact with the object through various methods like `for...in`, `Object.keys()`, `Object.getOwnPropertyNames()`, and the spread operator (`...`).

### Key Concepts

1. **Enumerable vs. Non-Enumerable Properties**:
   - **Enumerable properties**: These properties are included when enumerating over an object, such as with a `for...in` loop or methods like `Object.keys()`.
   - **Non-enumerable properties**: These are excluded from enumeration. They do not appear in `Object.keys()` or in the output of a `for...in` loop. However, they **can still be accessed** directly or with `Object.getOwnPropertyNames()`.

2. **Using `Object.defineProperty()`**:
   You can modify an object's properties using `Object.defineProperty()`, including whether the property is enumerable. If you set the `enumerable` property to `false`, the property becomes non-enumerable, and it will not show up in methods like `Object.keys()` or in `for...in` loops.

   ```javascript
   Object.defineProperty(person, 'socialSecurityNumber', {
     enumerable: false, // Make the property non-enumerable
   });
   ```

3. **Checking Property Attributes**:
   - `hasOwnProperty()`: This method checks if the property exists directly on the object (not inherited).
   - `propertyIsEnumerable()`: This method checks whether the property is enumerable.

   ```javascript
   person.hasOwnProperty('socialSecurityNumber'); // true
   person.propertyIsEnumerable('socialSecurityNumber'); // false
   ```

4. **Methods for Enumerating Object Properties**:
   - **`Object.keys()`**: Returns only the enumerable properties of the object.
   - **`Object.getOwnPropertyNames()`**: Returns **all** properties (enumerable and non-enumerable) that exist directly on the object.

   ```javascript
   Object.keys(person); // ['name', 'surname', 'age']
   Object.getOwnPropertyNames(person); // ['name', 'surname', 'age', 'socialSecurityNumber']
   ```

5. **Spread Operator and Non-Enumerable Properties**:
   When you use the spread operator (`...`) to copy properties from one object to another, only the **enumerable properties** are copied. So, in your example, even though `socialSecurityNumber` exists on the `person` object, because it's non-enumerable, it is **not** copied to the `clone`.

   ```javascript
   const clone = { ...person };
   clone.socialSecurityNumber; // undefined
   ```

### Example Code with Explanation

```javascript
const person = {
  name: 'John',
  surname: 'Doe',
  age: 30,
  socialSecurityNumber: '123-45-6789', // This will be marked as non-enumerable
};

// Making the socialSecurityNumber non-enumerable
Object.defineProperty(person, 'socialSecurityNumber', {
  enumerable: false, // This will hide the property from enumeration methods
});

console.log(person.hasOwnProperty('socialSecurityNumber')); // true
console.log(person.propertyIsEnumerable('socialSecurityNumber')); // false

// This method lists only enumerable properties
console.log(Object.keys(person)); // ['name', 'surname', 'age']

// This method lists all properties, including non-enumerable ones
console.log(Object.getOwnPropertyNames(person)); // ['name', 'surname', 'age', 'socialSecurityNumber']

// Spread operator copies only enumerable properties
const clone = { ...person };
console.log(clone.socialSecurityNumber); // undefined
```

### Key Observations

1. **Checking Existence**:
   - `person.hasOwnProperty('socialSecurityNumber')` returns `true` because the property exists directly on the object.
   - `person.propertyIsEnumerable('socialSecurityNumber')` returns `false` because the property is non-enumerable.

2. **Enumerating Properties**:
   - `Object.keys(person)` does **not** include `socialSecurityNumber` because it is non-enumerable.
   - `Object.getOwnPropertyNames(person)` **includes** `socialSecurityNumber`, as it lists all properties regardless of whether they are enumerable.

3. **Cloning with Spread Operator**:
   - When using the spread operator (`{ ...person }`), the `socialSecurityNumber` property is **not copied** because it is non-enumerable. This highlights how the spread operator only copies **enumerable** properties.

### Summary

- **Non-enumerable properties** are properties that are excluded from enumeration methods like `Object.keys()`, `for...in` loops, and the spread operator.
- You can make properties non-enumerable using `Object.defineProperty()` with the `enumerable: false` option.
- Methods like `Object.getOwnPropertyNames()` and `hasOwnProperty()` can still detect non-enumerable properties, but methods like `Object.keys()` will omit them.

Your breakdown of non-enumerable properties is thorough and accurate. To make this complete, there are two subtle edge cases regarding `Object.defineProperty` and `propertyIsEnumerable` that often trip developers up:

### Crucial Nuances & Defaults

#### 1. Default Attributes in `Object.defineProperty`

When you define a **new** property on an object via `Object.defineProperty()`, property attributes default to `false` if omitted:

```javascript
const obj = {};

Object.defineProperty(obj, 'secret', {
  value: 42
  // Missing enumerable, writable, and configurable!
});

console.log(obj.propertyIsEnumerable('secret')); // false (defaults to false!)
console.log(Object.keys(obj));                   // []

```

In your example, `socialSecurityNumber` was already defined on literal creation as `enumerable: true`, so passing `{ enumerable: false }` to `Object.defineProperty` modified only that specific attribute. However, creating properties from scratch with `Object.defineProperty` makes them non-enumerable, non-writable, and non-configurable by default unless explicitly specified as `true`.

#### 2. `propertyIsEnumerable` Ignores Symbol Keys and Prototype Chain

- `obj.propertyIsEnumerable(key)` only checks **own properties**. Inherited enumerable properties will return `false`.
- `propertyIsEnumerable` works with Symbols if passed as a Symbol reference, but standard iteration constructs (`for...in`, `Object.keys`) treat Symbols separately regardless of enumerability.

### Property Operations Quick Reference

| Method / Construct                   | Enumerable String Keys | Non-Enumerable String Keys | Symbol Keys       | Prototype Chain |
| ------------------------------------ | ---------------------- | -------------------------- | ----------------- | --------------- |
| **`for...in`**                       | ✅                      | ❌                          | ❌                 | ✅               |
| **`Object.keys()`**                  | ✅                      | ❌                          | ❌                 | ❌               |
| **`Object.getOwnPropertyNames()`**   | ✅                      | ✅                          | ❌                 | ❌               |
| **`Object.getOwnPropertySymbols()`** | ❌                      | ❌                          | ✅                 | ❌               |
| **`Reflect.ownKeys()`**              | ✅                      | ✅                          | ✅                 | ❌               |
| **Spread (`{ ...obj }`)**            | ✅                      | ❌                          | ✅ (if enumerable) | ❌               |
