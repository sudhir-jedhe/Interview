```js
export const validateStrings = (array) => {
  return array.every((element) => typeof element === "string");
};

export const validateStrings = (array) => {
  for (let i = 0; i < array.length; i++) {
    if (typeof array[i] !== "string") {
      return false;
    }
  }
  return true;
};

validateStrings(["hello", "world"]); // Output: true
validateStrings(["hello", 123]); // Output: false
validateStrings([]); // Output: false
```

There is a subtle bug with your test case expectation regarding empty arrays `[]`.

In JavaScript, **`Array.prototype.every()` returns `true` for empty arrays** (vacuous truth in logic), whereas your comment expects `false`. Furthermore, your manual `for` loop implementation also returns `true` for empty arrays because the loop condition `i < 0` immediately fails and hits `return true`.

Here is a breakdown of why this happens and how to update your implementations to handle empty arrays, `null`/`undefined` inputs, and non-array types safely.

---

### Why `every()` and the `for` Loop Return `true` on `[]`

In mathematical logic, a statement of the form *"Every element in set $S$ satisfies condition $P$"* is **vacuously true** if set $S$ contains no elements.

```javascript
[].every((x) => typeof x === "string"); 
// Output: true (Standard ECMAScript behavior)

```

If your application requirements specifically mandate that an empty array should return `false`, you must explicitly check for `array.length > 0`.

---

### Corrected & Production-Safe Implementations

#### Option A: Functional (`Array.prototype.every`)

```javascript
/**
 * Validates that the input is a non-empty array containing only string elements.
 * 
 * @param {Array} array
 * @returns {boolean}
 */
export const validateStrings = (array) => {
  // Guard clause: ensure input is a valid non-empty array
  if (!Array.isArray(array) || array.length === 0) {
    return false;
  }

  return array.every((element) => typeof element === "string");
};

```

#### Option B: Imperative (`for` loop with early exit)

```javascript
/**
 * Validates that the input is a non-empty array containing only string elements.
 * 
 * @param {Array} array
 * @returns {boolean}
 */
export const validateStrings = (array) => {
  if (!Array.isArray(array) || array.length === 0) {
    return false;
  }

  for (let i = 0; i < array.length; i++) {
    if (typeof array[i] !== "string") {
      return false; // Early exit on first non-string
    }
  }

  return true;
};

```

---

### Verification Test Matrix

```javascript
console.log(validateStrings(["hello", "world"])); // Output: true
console.log(validateStrings(["hello", 123]));     // Output: false
console.log(validateStrings([]));                 // Output: false ✅
console.log(validateStrings(["", " "]));          // Output: true  (Empty strings are typeof "string")
console.log(validateStrings(null));               // Output: false (Type guard handles null/undefined)

```

---

### Comparison of the Two Approaches

| Metric          | `Array.prototype.every()`                | `for` Loop                               |
| --------------- | ---------------------------------------- | ---------------------------------------- |
| **Readability** | 🟢 Declarative & concise                  | 🟡 Imperative                             |
| **Performance** | ⚡ Fast (Short-circuits on first `false`) | ⚡ Fast (Short-circuits on first `false`) |
| **Safety**      | Requires `Array.isArray()` guard         | Requires `Array.isArray()` guard         |

When using `typeof` with strings in JavaScript, there is a fundamental distinction between **primitive strings** and **String object instances** created via `new String()`:

```javascript
const primitiveString = 'hello';
const objectString = new String('hello');

console.log(typeof primitiveString); // "string"
console.log(typeof objectString);    // "object"

```

---

### Why Does This Happen?

1. **Primitive Strings (`'hello'`):** In JavaScript, primitives (`string`, `number`, `boolean`, `symbol`, `bigint`, `null`, `undefined`) are simple, immutable data values. `typeof` evaluates primitive strings directly as `"string"`.
2. **String Objects (`new String('hello')`):** Using the `new` operator with the `String` constructor creates a wrapper **Object** instance. Since it is an object in memory, `typeof` returns `"object"`.

---

### Key Behavioral Differences & Traps

Because `typeof` returns `"object"`, String instances can introduce unexpected bugs in common JavaScript operations:

#### 1. Strict Equality (`===`) Fails

Strict equality compares both value and type:

```javascript
console.log('hello' === 'hello');             // true
console.log('hello' === new String('hello')); // false ❌ (string vs object)
console.log(new String('hello') === new String('hello')); // false ❌ (different object references)

```

#### 2. Conditional / Truthiness Trap

While an empty primitive string `""` is falsy, an empty String object instance `new String("")` is **truthy** because all objects in JavaScript are truthy:

```javascript
if ("") {
  // Does NOT execute
}

if (new String("")) {
  // EXECUTES! ⚠️ An empty String object evaluates to true
}

```

#### 3. `eval()` Behavior

When passed to `eval()`, primitive strings are executed as JavaScript code, whereas String objects are treated as plain objects and returned unexecuted:

```javascript
const s1 = "2 + 2";
const s2 = new String("2 + 2");

console.log(eval(s1)); // 4
console.log(eval(s2)); // [String: '2 + 2'] (Returns the String object)

```

---

### How to Safely Check for Both Primitive & Object Strings

If you are writing a library function (or validator) that needs to accept **both** primitive strings and `new String()` instances, `typeof` alone is not enough.

#### Option A: Value Extraction (`valueOf()`)

Convert the value to its primitive form before checking `typeof`:

```javascript
function isString(val) {
  return typeof (val && val.valueOf ? val.valueOf() : val) === "string";
}

console.log(isString("hello"));             // true
console.log(isString(new String("hello"))); // true
console.log(isString(123));                 // false

```

#### Option B: `Object.prototype.toString`

This inspects the internal `[[Class]]` tag of the object:

```javascript
function isString(val) {
  return Object.prototype.toString.call(val) === "[object String]";
}

console.log(isString("hello"));             // true
console.log(isString(new String("hello"))); // true

```

#### Option C: `instanceof` (For Object Instances Only)

```javascript
console.log(new String("hello") instanceof String); // true
console.log("hello" instanceof String);             // false (Primitives are not instances of constructors)

```

---

### Best Practice

**Avoid using `new String()` altogether.** There is almost no reason to instantiate string objects directly in modern JavaScript.

If you need to coerce a non-string value to a primitive string, call `String()` **without** the `new` keyword:

```javascript
const str = String(123); // "123" (Primitive string)
console.log(typeof str); // "string"

```

When you call a method like `toUpperCase()`, `slice()`, or `indexOf()` on a primitive string, JavaScript performs a mechanism known as **auto-boxing** (or primitive wrapping).

Auto-boxing allows primitive values—which have no properties or methods of their own—to temporarily behave like objects without requiring you to manually create `new String()` object wrappers.

---

### How Auto-Boxing Works Step-by-Step

Consider this single line of code:

```javascript
const result = "hello".toUpperCase();

```

Behind the scenes, when the JS engine encounters property access (`.`) on a primitive value, it executes three steps:

1. **Wrap (Boxing):** Converts the primitive string `"hello"` into a temporary `String` object instance behind the scenes (`new String("hello")`).
2. **Execute:** Accesses and executes the requested method (`toUpperCase()`) on that temporary object, returning a new primitive string (`"HELLO"`).
3. **Unbox & Trash (Garbage Collection):** Immediately discards the temporary `String` object reference so it can be reclaimed by garbage collection.

```
       "hello".toUpperCase()
                 │
  1. Box         ▼  new String("hello")
  2. Execute     ▼  .toUpperCase() -> "HELLO"
  3. Trash       ▼  Discard temp String object

```

---

### Demonstrating Auto-Boxing Lifecycle

You can prove that JavaScript creates and discards temporary wrapper objects using property assignment:

```javascript
const str = "hello";

// Attempt to set a custom property on a primitive string
str.customProp = 42;

// Inspect the property
console.log(str.customProp); // undefined ❓

```

#### Why is it `undefined`?

1. When evaluating `str.customProp = 42`, JS auto-boxes `str` into a temporary object: `tempObj.customProp = 42`.
2. As soon as the assignment statement completes, `tempObj` is discarded.
3. On the next line, `console.log(str.customProp)` creates a **brand-new** temporary object wrapper (`tempObj2`), which does not have `customProp`. Thus, it evaluates to `undefined`.

*(Note: In Strict Mode (`"use strict"`), attempting to assign properties to primitives throws a `TypeError` instead of failing silently).*

---

### Performance Engine Optimization (V8 / SpiderMonkey)

Creating and destroying heap objects on every string method call would normally be very slow. Modern JavaScript engines use heavy optimizations:

* **No Actual Allocation:** For built-in immutable methods like `.slice()`, `.length`, or `.indexOf()`, engine JIT compilers skip actual object creation entirely.
* **Direct Lookup:** They route method lookups directly to optimized internal C++ functions without instantiating a temporary `String` wrapper in JS memory.

---

### Primitives vs. Auto-Boxing Summary

| Primitive Type       | Auto-Boxed Object Wrapper | Example Method Call                   |
| -------------------- | ------------------------- | ------------------------------------- |
| `string`             | `String`                  | `"hello".charAt(0)`                   |
| `number`             | `Number`                  | `(42.55).toFixed(1)`                  |
| `boolean`            | `Boolean`                 | `true.toString()`                     |
| `symbol`             | `Symbol`                  | `Symbol("id").description`            |
| `bigint`             | `BigInt`                  | `10n.toString()`                      |
| `null` / `undefined` | ❌ None                    | Throws `TypeError` on property access |

In TypeScript, the fundamental difference between `string` (lowercase) and `String` (uppercase) mirrors JavaScript's distinction between primitive values and wrapper objects.

---

### Key Differences Overview

| Feature                       | `string` (Lowercase)                            | `String` (Uppercase)                                    |
| ----------------------------- | ----------------------------------------------- | ------------------------------------------------------- |
| **What It Represents**        | The **primitive value** type (`"hello"`)        | The **wrapper object** instance (`new String("hello")`) |
| **Usage Recommendation**      | ✅ **Always use this** for type annotations      | ❌ **Never use this** as a type annotation               |
| **Accepts Primitives?**       | Yes                                             | Yes (Primitives auto-box into wrapper objects)          |
| **Accepts Object Instances?** | ❌ No (`new String()` cannot assign to `string`) | Yes                                                     |

---

### 1. The Lowercase `string` Type

The lowercase `string` type represents primitive string literals and variables. This is the type produced by standard string creation:

```typescript
let name: string = "Alice";
let template: string = `Hello, ${name}`;

// Assigning a String object to a string type FAILS:
let objectStr: String = new String("Bob");
let primitiveStr: string = objectStr; 
// ❌ Error: Type 'String' is not assignable to type 'string'.

```

---

### 2. The Uppercase `String` Type

The uppercase `String` type refers to the global JavaScript interface matching instances created by `new String(...)`.

While you can assign a primitive string to a variable typed as `String` (because primitives inherit methods from `String.prototype`), doing so causes subtle bugs:

```typescript
let wrapped: String = "Hello"; // Works due to auto-boxing

// Danger: String objects do not pass strict primitive type checks
function printPrimitive(val: string) {
  console.log(val.toLowerCase());
}

printPrimitive(wrapped); 
// ❌ Type error: Argument of type 'String' is not assignable to parameter of type 'string'.

```

---

### Why You Should Avoid `String` (and `Number`, `Boolean`, `Object`)

TypeScript official guidelines explicitly advise against using capitalized primitive wrapper types (`String`, `Number`, `Boolean`, `Symbol`, `BigInt`).

#### 1. Breaks Type Precision

Using `String` allows wrapper objects where primitives are expected, leading to runtime bugs (such as `===` strict equality comparisons failing or truthiness checks behaving differently on empty object instances).

#### 2. Breaks Common Utility Types

TypeScript utilities like `Record<string, any>` or conditional type checks expect primitive types:

```typescript
type Check<T> = T extends string ? "is primitive" : "not primitive";

type T1 = Check<string>; // "is primitive"
type T2 = Check<String>; // "not primitive"

```

---

### Summary Checklist

```typescript
// ❌ Bad / Anti-pattern:
function greet(name: String): String {
  return "Hello " + name;
}

// ✅ Good / Standard TypeScript:
function greet(name: string): string {
  return "Hello " + name;
}

```

Introduced in TypeScript 4.1, **Template Literal Types** build on string literal types to produce new string literal types via syntax identical to JavaScript's template strings. When combined with union types, they expand automatically into every possible string permutation.

---

### 1. Basic Template Literal Types

At their simplest, template literal types allow you to interpolate other types (such as `string`, `number`, `boolean`, or literal types) into a string structure:

```typescript
type World = "world";
type Greeting = `hello ${World}`; 
// Type is exactly: "hello world"

type ID = `user_${number}`;
const id1: ID = "user_123"; // ✅ Valid
const id2: ID = "user_abc"; // ❌ Error: Type '"user_abc"' is not assignable to type '`user_${number}`'

```

---

### 2. Unions & Combinatorial Expansion

The real power of template literal types emerges when interpolating **unions**. TypeScript computes the **Cartesian product** of all union members, automatically generating a new string union containing every possible combination:

```typescript
type Vertical = "top" | "bottom";
type Horizontal = "left" | "right";

// Automatically expands into all 4 combinations:
type Alignment = `${Vertical}-${Horizontal}`;
// Equivalent to: "top-left" | "top-right" | "bottom-left" | "bottom-right"

// Combining 3 unions (2 x 2 x 2 = 8 combinations):
type Size = "sm" | "lg";
type Variant = "primary" | "secondary";
type Element = "button" | "card";

type BEMClass = `${Size}-${Variant}-${Element}`;
// "sm-primary-button" | "sm-primary-card" | "sm-secondary-button" | ...

```

---

### 3. Built-in String Intrinsic Utilities

TypeScript provides four intrinsic generic types specifically for manipulating string casing inside template literals:

1. **`Uppercase<S>`**: Converts string to uppercase.
2. **`Lowercase<S>`**: Converts string to lowercase.
3. **`Capitalize<S>`**: Capitalizes the first character.
4. **`Uncapitalize<S>`**: Uncapitalizes the first character.

```typescript
type Event = "click" | "hover" | "focus";

// Automatically generates strongly typed event handler names:
type OnEvent = `on${Capitalize<Event>}`;
// Type: "onClick" | "onHover" | "onFocus"

type Action = "SET_USER" | "FETCH_DATA";
type ReducerName = `handle_${Lowercase<Action>}`;
// Type: "handle_set_user" | "handle_fetch_data"

```

---

### 4. Practical Real-World Patterns

#### A. Generating Strongly Typed Event Emitters / Subscriptions

```typescript
type PropName = "name" | "age" | "email";

// Generates listener events: "onNameChanged" | "onAgeChanged" | "onEmailChanged"
type OnChangeEvent = `on${Capitalize<PropName>}Changed`;

interface Person {
  name: string;
  age: number;
  email: string;
}

type PersonWatcher = {
  on<K extends PropName>(
    event: `on${Capitalize<K>}Changed`,
    callback: (newValue: Person[K]) => void
  ): void;
};

declare const watcher: PersonWatcher;

// Perfectly typed callbacks based on event name!
watcher.on("onNameChanged", (val) => {
  // TypeScript infers 'val' as string
  console.log(val.toUpperCase());
});

watcher.on("onAgeChanged", (val) => {
  // TypeScript infers 'val' as number
  console.log(val.toFixed(2));
});

```

#### B. Mapping CSS Utility Classes or Design System Tokens

```typescript
type Color = "red" | "blue" | "green";
type Intensity = 100 | 200 | 300;

type TailWindColor = `bg-${Color}-${Intensity}` | `text-${Color}-${Intensity}`;

const bg: TailWindColor = "bg-red-200";   // ✅ Valid
const text: TailWindColor = "text-blue-100"; // ✅ Valid
const invalid: TailWindColor = "bg-purple-100"; 
// ❌ Error: Type '"bg-purple-100"' is not assignable to type 'TailWindColor'

```

---

### 5. String Pattern Matching & Inference with `infer`

You can use `infer` inside conditional types with template literals to parse or extract parts of string types at compile time:

```typescript
// Extracts the route param from a path string like "/users/:id"
type ExtractParam<Path extends string> = Path extends `${string}/:${infer Param}`
  ? Param
  : never;

type UserParam = ExtractParam<"/users/:userId">; 
// Type: "userId"

type PostParam = ExtractParam<"/posts/:postId">; 
// Type: "postId"

```

---

### Performance Caution: Union Limit Expansion

Because union expansion computes the Cartesian product ($A \times B \times C$), combining large unions can hit TypeScript's union limit threshold ($14,999$ total elements) and cause compiler performance degradation:

```typescript
type Digits = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

// Creates 1,000 types (10 x 10 x 10)
type ThreeDigits = `${Digits}${Digits}${Digits}`; 

// ⚠️ Attempting 5 digits produces 100,000 combinations and throws a compiler error!

```

Type narrowing is the process by which TypeScript refines a broad type (like `string`, a union of string literals, or `unknown`) into a more specific string type within a conditional code block.

Here is how `typeof`, `in`, and custom type guards perform string narrowing.

---

### 1. Narrowing with `typeof`

The `typeof` operator is used to narrow broader types (like `unknown`, `any`, `string | number`, or `string | null`) down to a primitive `string`.

```typescript
function processInput(input: string | number | boolean) {
  if (typeof input === "string") {
    // TypeScript knows 'input' is strictly 'string' here
    console.log(input.toUpperCase()); 
  } else {
    // TypeScript knows 'input' is 'number | boolean'
    console.log(input);
  }
}

```

#### Discriminating String Literals with Equality

When working with string types, equality checks (`===`, `!==`, `switch`) narrow union types down to specific **string literal types**:

```typescript
type Status = "pending" | "success" | "error";

function handleStatus(status: Status) {
  if (status === "success") {
    // 'status' is narrowed to the literal type "success"
  } else if (status === "error") {
    // 'status' is narrowed to "error"
  } else {
    // 'status' is narrowed to "pending"
  }
}

```

---

### 2. Narrowing with the `in` Operator

The `in` operator checks if a property exists on an object. When dealing with **tagged unions** (where objects share a common string literal property), `in` or property access narrows the parent object based on that string property.

#### Tagged Union Property Check

```typescript
interface TextResponse {
  type: "text";
  body: string;
}

interface ImageResponse {
  type: "image";
  url: string;
}

type ApiResponse = TextResponse | ImageResponse;

function handleResponse(response: ApiResponse) {
  // Option A: Checking the string literal field directly
  if (response.type === "text") {
    console.log(response.body); // Narrowed to TextResponse
  }

  // Option B: Using 'in' operator to check for unique property
  if ("url" in response) {
    console.log(response.url); // Narrowed to ImageResponse
  }
}

```

---

### 3. Narrowing with Custom Type Guards (`is`)

Standard `typeof` checks only narrow down to the general primitive `string`. If you need to verify whether a generic string belongs to a specific string union or format (like an ISO Date, Email, or Valid CSS Color), use a **custom type guard** with a type predicate (`arg is Type`).

#### Example A: Narrowing `string` to a String Literal Union

```typescript
type Theme = "light" | "dark" | "system";

// Type Guard Function using 'val is Theme'
function isTheme(val: string): val is Theme {
  return ["light", "dark", "system"].includes(val);
}

function setTheme(userChoice: string) {
  if (isTheme(userChoice)) {
    // 'userChoice' is narrowed from generic 'string' to 'Theme'
    applyTheme(userChoice); 
  } else {
    console.error("Invalid theme provided");
  }
}

function applyTheme(theme: Theme) {
  // Accepts only "light" | "dark" | "system"
}

```

#### Example B: Branded / Nominated String Types

TypeScript's type system is structural. If you want to enforce at compile time that a string is a validated format (e.g., a validated `EmailAddress`), you can combine custom type guards with **Branded Types**:

```typescript
// Create a Nominal/Branded String Type
type EmailAddress = string & { readonly __brand: unique symbol };

// Custom Type Guard for Email
function isValidEmail(email: string): email is EmailAddress {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function sendWelcomeEmail(to: EmailAddress) {
  console.log(`Sending email to ${to}`);
}

const inputStr = "user@example.com";

// sendWelcomeEmail(inputStr); 
// ❌ Error: Argument of type 'string' is not assignable to parameter of type 'EmailAddress'.

if (isValidEmail(inputStr)) {
  sendWelcomeEmail(inputStr); // ✅ Validated and narrowed to EmailAddress!
}

```

---

### 4. Narrowing Template Literal Types with Assertion Functions

You can also use TypeScript `asserts` functions to validate and narrow string formats:

```typescript
type Route = `/${string}`;

function assertValidRoute(path: string): asserts path is Route {
  if (!path.startsWith("/")) {
    throw new Error(`Invalid route: ${path} must start with /`);
  }
}

function navigate(path: string) {
  assertValidRoute(path);
  // Beyond this line, 'path' is narrowed to `/${string}`
  console.log(`Navigating to ${path}`);
}

```

---

### Summary Checklist

| Technique                   | Used For                                                                | Output Type                               |
| --------------------------- | ----------------------------------------------------------------------- | ----------------------------------------- |
| **`typeof x === "string"`** | Disambiguating primitives from objects, numbers, or `unknown`.          | Primitive `string`                        |
| **`x === "literal"`**       | Checking specific values inside string unions.                          | Literal string (`"pending"`, `"success"`) |
| **`"prop" in obj`**         | Distinguishing object variants in tagged unions based on property keys. | Specific object interface                 |
| **`val is UnionType`**      | Validating runtime string inputs against known TypeScript types/enums.  | Custom Union or Branded String            |
