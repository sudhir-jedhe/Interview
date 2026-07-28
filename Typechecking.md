The JavaScript type system can be quite tricky when trying to distinguish between primitive and non-primitive types. Here's an overview of the methods and approaches you can use to perform type checking for both primitive and non-primitive types. I'll walk through the methods you outlined, including key examples and explanations.

### **Primitive Type Checking**

Primitive types are values that are immutable, meaning their values cannot be changed. JavaScript has several primitive types: `undefined`, `null`, `boolean`, `number`, `bigint`, `string`, and `symbol`. Here are some utility functions to check for these types.

#### **Checking for `undefined`**

The simplest way to check if a value is `undefined` is by directly comparing it to `undefined`.

```javascript
const isUndefined = (val) => val === undefined;

console.log(isUndefined(undefined)); // true
console.log(isUndefined(null)); // false
```

#### **Checking for `null`**

Since `typeof null returns 'object'`, we cannot use `typeof` for null directly. Instead, compare directly to `null`.

```javascript
const isNull = (val) => val === null;

console.log(isNull(null)); // true
console.log(isNull(undefined)); // false
```

#### **Checking for `nil` (null or undefined)**

In some languages, `nil` is used to represent absence. JavaScript uses both `null` and `undefined` for this purpose. So, we can check for either.

```javascript
const isNil = (val) => val === undefined || val === null;

console.log(isNil(null)); // true
console.log(isNil(undefined)); // true
console.log(isNil("")); // false
```

#### **Checking for `boolean`**

To check if a value is a boolean (`true` or `false`), we can use `typeof`.

```javascript
const isBoolean = (val) => typeof val === "boolean";

console.log(isBoolean(true)); // true
console.log(isBoolean(false)); // true
console.log(isBoolean("true")); // false
console.log(isBoolean(null)); // false
```

#### **Checking for `number`**

We can use `typeof` to check for numbers, but we also need to ensure the value is not `NaN`, which is a special numeric value.

```javascript
const isNumber = (val) => typeof val === "number" && !Number.isNaN(val);

console.log(isNumber(1)); // true
console.log(isNumber("1")); // false
console.log(isNumber(NaN)); // false
```

#### **Checking for `bigint`**

BigInts are new in JavaScript and are checked using `typeof`.

```javascript
const isBigInt = (val) => typeof val === "bigint";

console.log(isBigInt(1n)); // true
console.log(isBigInt(1)); // false
```

#### **Checking for `string`**

Strings are checked using `typeof`.

```javascript
const isString = (val) => typeof val === "string";

console.log(isString("Hello!")); // true
console.log(isString(1)); // false
```

#### **Checking for `symbol`**

Symbols are checked using `typeof`.

```javascript
const isSymbol = (val) => typeof val === "symbol";

console.log(isSymbol(Symbol("x"))); // true
console.log(isSymbol("x")); // false
```

#### **Checking if a value is `primitive`**

You can use `Object(val)` to check if a value is a primitive type. Primitives are not equal to their object wrappers.

```javascript
const isPrimitive = (val) => Object(val) !== val;

console.log(isPrimitive(null)); // true
console.log(isPrimitive(undefined)); // true
console.log(isPrimitive(50)); // true
console.log(isPrimitive("Hello!")); // true
console.log(isPrimitive([])); // false
console.log(isPrimitive({})); // false
```

### **Non-Primitive Type Checking**

Non-primitive types include `object` (which encompasses arrays, objects, functions, etc.), and `function`.

#### **Checking for `object`**

You can check for objects using `Object(val)` but avoid `null` because `typeof null` returns 'object'. Here's how we can do it:

```javascript
const isObject = (obj) => obj === Object(obj);

console.log(isObject([1, 2, 3, 4])); // true
console.log(isObject([])); // true
console.log(isObject(["Hello!"])); // true
console.log(isObject({ a: 1 })); // true
console.log(isObject(null)); // false
console.log(isObject(undefined)); // false
```

#### **Checking for `function`**

You can check if a value is a function using `typeof`.

```javascript
const isFunction = (val) => typeof val === "function";

console.log(isFunction(() => {})); // true
console.log(isFunction("x")); // false
```

#### **Checking for `plain object`**

A "plain object" is an object created directly via `new Object()` or using `{}`. This excludes other object-like structures like arrays, functions, and instances of built-in classes.

```javascript
const isPlainObject = (val) =>
  !!val && typeof val === "object" && val.constructor === Object;

console.log(isPlainObject({ a: 1 })); // true
console.log(isPlainObject(new Map())); // false
```

#### **Checking for `async function`**

To check if a function is asynchronous, we use `Object.prototype.toString.call()`.

```javascript
const isAsyncFunction = (val) =>
  Object.prototype.toString.call(val) === "[object AsyncFunction]";

console.log(isAsyncFunction(function () {})); // false
console.log(isAsyncFunction(async function () {})); // true
```

#### **Checking for `generator function`**

Similarly, to check if a function is a generator, use `Object.prototype.toString.call()`.

```javascript
const isGeneratorFunction = (val) =>
  Object.prototype.toString.call(val) === "[object GeneratorFunction]";

console.log(isGeneratorFunction(function () {})); // false
console.log(isGeneratorFunction(function* () {})); // true
```

### **Getting the Type of a Value**

If all else fails, you can use `Object.prototype.constructor` or `Function.prototype.name` to get the type of a value. Here's a utility that checks for types more reliably:

```javascript
const getType = (v) =>
  v === undefined ? "undefined" : v === null ? "null" : v.constructor.name;

console.log(getType(undefined)); // 'undefined'
console.log(getType(null)); // 'null'
console.log(getType(true)); // 'Boolean'
console.log(getType(1)); // 'Number'
console.log(getType(1n)); // 'BigInt'
console.log(getType("Hello!")); // 'String'
console.log(getType(Symbol())); // 'Symbol'
console.log(getType([])); // 'Array'
console.log(getType({})); // 'Object'
console.log(getType(() => {})); // 'Function'
```

### **Checking if a Value is of a Specific Type**

You can also check if a value is of a specific type by comparing the constructor name.

```javascript
const isOfType = (type, val) =>
  ([undefined, null].includes(val) && val === type) ||
  val.constructor.name === type;

console.log(isOfType("Boolean", true)); // true
console.log(isOfType("Number", 1)); // true
console.log(isOfType("BigInt", 1n)); // true
console.log(isOfType("String", "Hello!")); // true
console.log(isOfType("Array", [])); // true
console.log(isOfType("Object", {})); // true
console.log(isOfType("Function", () => {})); // true
```

---

### **Summary**

- **Primitive types** (e.g., `undefined`, `null`, `boolean`, `number`, `bigint`, `string`, `symbol`) are straightforward to check using `typeof` and direct comparisons.
- **Non-primitive types** (e.g., `object`, `function`) often require more nuanced checks using `Object` methods, `Array.isArray()`, and `Object.prototype.toString()`.
- The `getType()` and `isOfType()` functions provide a flexible approach to check a value's type dynamically based on its constructor name.
