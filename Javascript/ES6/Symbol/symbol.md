Let's walk through the given JavaScript code and understand the output step by step.

### Code:

```javascript
const symbol = Symbol("BFE");

const a = {
  [symbol]: "BFE",
  BFE: "BFE",
};

console.log(symbol in a); // Check if `symbol` exists in object `a`
console.log("BFE" in a); // Check if `"BFE"` exists in object `a`
console.log(Object.keys(a).length); // Get the number of own enumerable properties of object `a`
```

### Explanation:

#### 1. **`symbol in a`**

- `symbol` is a `Symbol`, which is a unique primitive value.
- `symbol` is used as a property key in the object `a`.
- `Symbols` are **not enumerable** in the same way as string keys. They are hidden from methods like `Object.keys()`, but they **do exist in the object**.

So, when checking if `symbol` is in `a` with the `in` operator:

- **The output will be `true`**, because the symbol key exists in `a`, even though it is not enumerable by default.

#### 2. **`"BFE" in a`**

- `"BFE"` is a regular string key, and it is explicitly added to `a`.
- This string key will be enumerable in `Object.keys()` and will also show up when you check with the `in` operator.

So, **the output will be `true`**, because `"BFE"` is a direct property of `a`.

#### 3. **`Object.keys(a).length`**

- `Object.keys()` returns **only the enumerable properties** of an object as an array of strings.
- The property `BFE` (the string key) is enumerable, but `symbol` (the Symbol key) is **not** enumerable by default.

Thus, `Object.keys(a)` will return an array with just the string `"BFE"`, not the symbol key.

- **The output will be `1`**, because there is only one enumerable key: `"BFE"`.

### Final Output:

```javascript
true; // symbol in a is true
true; // "BFE" in a is true
1; // Only "BFE" is enumerable, so Object.keys(a).length is 1
```

### Summary:

- The `in` operator checks both enumerable and non-enumerable properties, so both `"BFE"` and the `symbol` key exist in the object.
- `Object.keys()` only returns **enumerable string keys**, which is why it doesn't count the `symbol` property.

A **`Symbol`** is a primitive data type introduced in ES6 (2015). Every symbol value returned from `Symbol()` is **guaranteed to be unique**, making symbols ideal for creating unique object property keys that never collide with other code.

---

## 1. Uniqueness Guarantee

Even if two symbols are created with the exact same description label, they are completely distinct and unequal:

```javascript
const id1 = Symbol("id");
const id2 = Symbol("id");

console.log(id1 === id2); // false! Every Symbol() call produces a unique value.
```

> **Note:** You cannot use `new Symbol()` because it is a primitive, not a constructor object wrapper. Calling `new Symbol()` throws a `TypeError`.

---

## 2. Primary Use Case: Preventing Property Collisions

When extending objects owned by third-party libraries or internal shared code, string key names run the risk of name collisions. Symbols solve this because **no other code can create a matching key by accident**.

```javascript
const user = {
  name: "Alex",
  age: 30,
};

// Creating a hidden / collision-safe ID property
const idSymbol = Symbol("userId");

user[idSymbol] = "USR-9842";

console.log(user[idSymbol]); // 'USR-9842'
```

---

## 3. Symbol Properties Are Semi-Hidden

Symbol-keyed properties do not appear in standard loop iterations or object reflection methods.

```javascript
const secretKey = Symbol("secret");

const config = {
  apiHost: "https://api.example.com",
  [secretKey]: "TOKEN_12345",
};

// 1. Ignored by for...in loops
for (let key in config) {
  console.log(key); // Prints only 'apiHost'
}

// 2. Ignored by Object.keys() and Object.getOwnPropertyNames()
console.log(Object.keys(config)); // ['apiHost']

// 3. Ignored by JSON serialization
console.log(JSON.stringify(config)); // '{"apiHost":"https://api.example.com"}'

// 4. How to retrieve symbol keys if needed:
console.log(Object.getOwnPropertySymbols(config)); // [ Symbol(secret) ]
console.log(Reflect.ownKeys(config)); // ['apiHost', Symbol(secret)]
```

---

## 4. Global Symbol Registry (`Symbol.for`)

If you _do_ want to share a symbol across different files, modules, or iframes in your app, use `Symbol.for(key)`:

- **`Symbol.for(key)`:** Checks the global symbol registry. If a symbol with that key exists, it returns it; otherwise, it creates and registers a new one.
- **`Symbol.keyFor(sym)`:** Retrieves the string key associated with a global symbol.

```javascript
// Creates a global symbol in the registry
const globalId1 = Symbol.for("app.userId");

// Fetches the exact same symbol from the registry
const globalId2 = Symbol.for("app.userId");

console.log(globalId1 === globalId2); // true

// Retrieve the registry key string
console.log(Symbol.keyFor(globalId1)); // 'app.userId'
```

---

## 5. Well-Known Symbols (Internal Engine Customization)

JavaScript exposes built-in **Well-Known Symbols** on the `Symbol` object to let you hook into or customize low-level browser operations:

### `Symbol.iterator`

Defines how an object behaves during a `for...of` loop or spread operation (`...`).

```javascript
const customCollection = {
  items: ["Apple", "Banana", "Cherry"],

  // Custom iterator implementation
  [Symbol.iterator]() {
    let index = 0;
    return {
      next: () => {
        if (index < this.items.length) {
          return { value: this.items[index++], done: false };
        }
        return { value: undefined, done: true };
      },
    };
  },
};

for (const fruit of customCollection) {
  console.log(fruit); // Prints: Apple, Banana, Cherry
}
```

### Other Common Built-in Symbols:

- **`Symbol.hasInstance`**: Customizes the behavior of the `instanceof` operator.
- **`Symbol.toPrimitive`**: Customizes how an object converts itself to a primitive type (number, string) when coerced.
- **`Symbol.toStringTag`**: Sets the string description used by `Object.prototype.toString.call(obj)`.

---

## Summary Comparison

| Method                  | Behavior                                       | Use Case                                            |
| ----------------------- | ---------------------------------------------- | --------------------------------------------------- |
| **`Symbol('desc')`**    | Always returns a unique, un-shareable value    | Private/isolated object keys that won't collide     |
| **`Symbol.for('key')`** | Searches/creates in the global symbol registry | Shared symbols across different files or micro-apps |
| **`Symbol.iterator`**   | Built-in hook to make objects iterable         | Custom loops (`for...of`) and spread syntax support |
