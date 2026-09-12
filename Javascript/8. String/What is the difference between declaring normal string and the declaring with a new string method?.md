The core difference is that declaring a string as a literal creates a **primitive value**, whereas declaring it with `new String()` creates an **object wrapper instance**.

| Feature                     | String Literal (`'hello'`)          | `new String('hello')`                     |
| --------------------------- | ----------------------------------- | ----------------------------------------- |
| **Data Type**               | Primitive (`string`)                | Object (`object`)                         |
| **`typeof` Result**         | `'string'`                          | `'object'`                                |
| **Strict Equality (`===`)** | Compares by **value**               | Compares by **memory reference**          |
| **`eval()` Behavior**       | Evaluates code directly             | Returns the `String` object               |
| **Memory Allocation**       | Optimized / interned in memory pool | Allocates a new heap object every time    |
| **Truthiness**              | `""` is falsy, non-empty is truthy  | **Always truthy** (even `new String("")`) |

---

### 1. Type Check (`typeof`)

A string literal is a primitive data type, while `new String()` produces an instance of the `String` object constructor.

```javascript
const strPrimitive = 'hello';
const strObject = new String('hello');

console.log(typeof strPrimitive); // "string"
console.log(typeof strObject);    // "object"

```

---

### 2. Strict Equality (`===`)

Primitives are compared by **value**. Objects are compared by **reference in memory**.

```javascript
const s1 = 'hello';
const s2 = 'hello';
console.log(s1 === s2); // true (identical values)

const obj1 = new String('hello');
const obj2 = new String('hello');

console.log(s1 == obj1);  // true  (loose equality coerces obj1 to primitive)
console.log(s1 === obj1); // false (different types: string vs object)
console.log(obj1 === obj2); // false (different references in memory)

```

---

### 3. The Boolean Trap with Empty Strings

An empty primitive string `""` is falsy. However, **any JavaScript object is truthy**, which causes bugs inside conditionals:

```javascript
const emptyPrimitive = "";
if (emptyPrimitive) {
  // Never runs because "" is falsy
}

const emptyObject = new String("");
if (emptyObject) {
  console.log("This executes!"); // Runs because all objects are truthy
}

```

---

### 4. `eval()` Handling

`eval()` treats primitive strings as executable JavaScript code, but treats `String` objects as raw objects.

```javascript
const code1 = '2 + 2';
const code2 = new String('2 + 2');

console.log(eval(code1)); // 4
console.log(eval(code2)); // [String: '2 + 2']

```

---

### 5. Auto-Boxing (Why Primitives Can Call Methods)

You don't need `new String()` to access methods like `.toUpperCase()` or `.slice()`. JavaScript uses **auto-boxing**: when you call a method on a primitive string, the engine temporarily wraps it in a `String` object behind the scenes, runs the method, and immediately discards the wrapper.

```javascript
const str = 'spiro';
console.log(str.toUpperCase()); // "SPIRO"

```

---

### Best Practice

Avoid `new String()`. Always use string literals (`'...'`, `"..."`, or ``...``).

If you ever need explicit type conversion, call `String()` **without** the `new` keyword to produce a clean primitive:

```javascript
const num = 123;
const str = String(num); // "123" (primitive string, typeof === "string")

```
