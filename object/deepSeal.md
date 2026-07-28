Your code provides examples of how to work with `Object.seal()` and `Object.freeze()` in JavaScript, including creating custom functions like `deepSeal()` and `deepFreeze()` for deeply sealing or freezing an object and its nested properties. Below, I'll walk you through each concept and explain the behavior:

### 1. **Using `Object.seal()`**

`Object.seal()` prevents the addition or deletion of properties in an object, but it allows modifications to existing property values, **as long as the property is writable**. Sealing is shallow by default.

```javascript
const obj = {
  prop: 42
};

Object.seal(obj);
obj.prop = 33;
console.log(obj.prop); // 33
```

- **Explanation:**  
  After calling `Object.seal()`, the `obj` properties can still be modified (as shown with `obj.prop = 33`), but you can't delete properties.

```javascript
delete obj.prop; // Cannot delete when sealed
console.log(obj.prop); // 33
```

- **Explanation:**  
  You cannot delete properties from a sealed object, so `delete obj.prop` has no effect.

### 2. **Sealing Nested Objects (`deepSeal()`)**

When an object has nested properties, `Object.seal()` only seals the top level of the object. If you want to seal nested objects, you need to apply sealing recursively, which is what your `deepSeal()` function does.

```javascript
const obj = {
  prop: 42,
  nested: {
    a: 1,
    b: 2
  }
};

Object.seal(obj);
obj.nested.a = 2; // Allowed
delete obj.nested.a; // Not allowed, but nested object is still mutable
console.log(obj.nested.a); // undefined
```

- **Explanation:**  
  Sealing the top level prevents adding or deleting properties from `obj`, but the `nested` object itself remains mutable unless it is also sealed. The `deepSeal()` function recursively seals all objects within the object structure.

### 3. **`deepSeal()` Function**

Here is your `deepSeal()` function implementation that seals the entire object, including nested objects:

```javascript
function deepSeal(object) {
  let propNames = Object.getOwnPropertyNames(object);

  for (let name of propNames) {
    let value = object[name];
    object[name] = value && typeof value === "object" ? deepSeal(value) : value;
  }

  return Object.seal(object);
}
```

This recursive function ensures that all nested objects are sealed as well. Here's how it works:

- If the property is an object, it recursively calls `deepSeal()` on that object.
- After visiting all the nested objects, it seals the current object using `Object.seal()`.

```javascript
const obj = {
  prop: 42,
  nested: {
    a: 1,
    b: 2
  }
};

deepSeal(obj);
obj.nested.a = 2; // Allowed
delete obj.nested.a; // Not allowed
console.log(obj.nested.a); // 2
```

- **Explanation:**  
  In this case, since `deepSeal()` was used, both the top-level object and the `nested` object are sealed. Attempting to delete `obj.nested.a` fails, but the property can still be modified (as shown).

### 4. **`Object.freeze()`**

`Object.freeze()` makes an object **immutable**. Once frozen:

- **Properties cannot be modified** (e.g., you can't change values).
- **New properties cannot be added**.
- **Properties cannot be deleted**.
- It is a shallow freeze by default, so it only affects the top level of the object.

```javascript
const obj = {
  prop: 42
};

Object.freeze(obj);
obj.prop = 33; // This will not modify the original object in non-strict mode
console.log(obj.prop); // 42
```

- **Explanation:**  
  The `obj` object is frozen, and any attempt to modify properties will be ignored (or cause errors in strict mode). Here, `obj.prop = 33` does not change the value of `prop`.

### 5. **Freezing Nested Objects (`deepFreeze()`)**

Just like `Object.seal()`, `Object.freeze()` is shallow. If you want to freeze an object deeply (including all nested objects), you can use the `deepFreeze()` function.

```javascript
function deepFreeze(object) {
  let propNames = Object.getOwnPropertyNames(object);

  for (let name of propNames) {
    let value = object[name];
    object[name] = value && typeof value === "object" ? deepFreeze(value) : value;
  }

  return Object.freeze(object);
}

const obj = {
  prop: 42,
  nested: {
    a: 1,
    b: 2
  }
};

deepFreeze(obj);
obj.nested.a = 33; // This will not modify the object
console.log(obj.nested.a); // 1
```

- **Explanation:**  
  After freezing, `obj.nested.a = 33` does not change the value of `a` because the entire object, including nested objects, is frozen.

### 6. **Check if Object is Frozen or Sealed**

You can check if an object is sealed or frozen using `Object.isSealed()` and `Object.isFrozen()`:

```javascript
const obj = {
  prop: 42,
  nested: {
    a: 1,
    b: 2
  }
};

deepFreeze(obj);
console.log(Object.isFrozen(obj)); // true
console.log(Object.isFrozen(obj.nested)); // true
```

- **Explanation:**  
  `Object.isFrozen(obj)` returns `true`, indicating that the object is frozen. This is true even for nested objects if you used `deepFreeze()`.

### Summary of Behavior

| Operation                  | `Object.seal()`               | `Object.freeze()`               |
| -------------------------- | ----------------------------- | ------------------------------- |
| Add properties             | Not allowed                   | Not allowed                     |
| Remove properties          | Not allowed                   | Not allowed                     |
| Modify existing properties | Allowed (if writable)         | Not allowed                     |
| Nested objects             | Not sealed unless deep-sealed | Not frozen unless deeply frozen |

- `Object.seal()` prevents property addition and deletion but allows modifications to values if the properties are writable.
- `Object.freeze()` prevents property modification, addition, and deletion.
- Both `Object.seal()` and `Object.freeze()` are shallow by default; you can recursively apply them to deeply seal or freeze all properties in an object using functions like `deepSeal()` and `deepFreeze()`.

### Conclusion

- **`Object.seal()`** is useful when you want to prevent adding or deleting properties but still allow modifying the property values.
- **`Object.freeze()`** is useful when you need complete immutability, preventing changes to the object itself and its properties.
- **`deepSeal()` and `deepFreeze()`** can be used to apply sealing or freezing recursively on nested objects to make sure everything is immutable.
