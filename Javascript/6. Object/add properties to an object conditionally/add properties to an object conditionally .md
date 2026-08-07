In JavaScript, you can add properties to an object conditionally by using various methods, such as `if` statements, ternary operators, or logical operators. Below are some common ways to add properties to an object conditionally:

### 1. **Using an `if` statement**

You can check a condition and add properties to the object inside an `if` block:

```javascript
let obj = {};

// Condition: If the user is an admin, add an 'isAdmin' property
let isAdmin = true;

if (isAdmin) {
  obj.isAdmin = true;
}

console.log(obj); // { isAdmin: true }
```

### 2. **Using a Ternary Operator**

You can use a ternary operator to conditionally add properties, though it's typically better for assigning values rather than adding new properties. However, it can still be useful:

```javascript
let obj = {};

// Condition: If the user is active, add an 'isActive' property
let isActive = true;

isActive ? obj.isActive = true : null;

console.log(obj); // { isActive: true }
```

### 3. **Using Logical AND (`&&`)**

You can use the logical `&&` operator to conditionally add a property. This works well if you don't need an `else` condition.

```javascript
let obj = {};

// Condition: If `isPremium` is true, add 'isPremium' property
let isPremium = false;

isPremium && (obj.isPremium = true);

console.log(obj); // {} (property is not added since isPremium is false)
```

### 4. **Using Object Spread Syntax**

If you're creating a new object or modifying an existing one, you can use the spread syntax combined with a conditional check:

```javascript
let obj = {
  name: 'Alice'
};

// Condition: If the user is active, add 'isActive' property
let isActive = true;

obj = {
  ...obj,
  ...(isActive ? { isActive: true } : {})
};

console.log(obj); // { name: 'Alice', isActive: true }
```

This method is useful when you're working with immutable objects or when you're creating a new object based on conditions.

### 5. **Using `Object.assign()`**

You can also use `Object.assign()` to add properties conditionally. It's often used for merging objects, but you can use it for conditional additions as well:

```javascript
let obj = {};

// Condition: Add 'isAdmin' property if user is an admin
let isAdmin = true;

Object.assign(obj, isAdmin ? { isAdmin: true } : {});

console.log(obj); // { isAdmin: true }
```

### 6. **Using a Function**

If the condition logic is complex or needs to be reused, you could define a function that adds properties to the object conditionally:

```javascript
function addPropertyIf(condition, obj, property, value) {
  if (condition) {
    obj[property] = value;
  }
}

let user = {};

// Condition: Add 'isAdmin' property if user has admin privileges
let isAdmin = true;
addPropertyIf(isAdmin, user, 'isAdmin', true);

console.log(user); // { isAdmin: true }
```

### 7. **Using `Array.reduce()` for Complex Conditions**

If you're working with multiple conditions or objects and want to reduce them conditionally, you can use `Array.reduce()`:

```javascript
let conditions = [
  { condition: true, property: 'isAdmin', value: true },
  { condition: false, property: 'isActive', value: true }
];

let obj = conditions.reduce((acc, curr) => {
  if (curr.condition) {
    acc[curr.property] = curr.value;
  }
  return acc;
}, {});

console.log(obj); // { isAdmin: true }
```

### Summary

- **If Statement**: Use for simple conditionals when you explicitly check and add properties.
- **Ternary Operator**: Compact, but more suited for value assignments.
- **Logical AND (`&&`)**: Ideal for simple conditional additions without needing an `else` part.
- **Object Spread/`Object.assign()`**: Useful for combining objects conditionally, especially in immutability scenarios.
- **Functions**: Good for reusable logic or more complex conditions.
- **`Array.reduce()`**: Best for iterating over multiple conditions and adding properties in a more functional style.

By using these patterns, you can add properties to an object conditionally based on specific logic in your JavaScript code.

Your overview covers all the standard patterns for conditional property assignment in JavaScript.

To help refine these patterns for production codebases and modern frameworks (like React, Vue, or Redux), here are a few technical callouts, modern operators, and subtle traps to keep in mind.

---

### Modern Alternative: Logical AND with Spread Operator

When defining objects inline (for example, in React component state or props), the **Spread operator with Logical AND (`&&`)** is the industry standard because it avoids empty object literals `{}` when the condition evaluates to `false`:

```javascript
const isActive = false;
const age = 25;

const user = {
  name: "Alice",
  age,
  // If condition is false, short-circuits to boolean false.
  // Spreading 'false' into an object evaluates to nothing!
  ...(isActive && { isActive: true }),
};

console.log(user); 
// Output: { name: 'Alice', age: 25 } (isActive property is completely omitted)

```

#### ⚠️ Trap: Be Careful with Falsy Values in Spreads

While `...(false && { prop: val })` safely evaluates to `...false` (which expands into nothing), spreading non-boolean falsy values like `0` or `NaN` directly can produce subtle bugs if not wrapped cleanly:

```javascript
const count = 0; // Falsy number

const data = {
  name: "Item",
  ...(count && { count }), // count is 0 -> evaluates to ...(0) -> expands to nothing, but can be confusing
};

```

- **Best Practice:** Always ensure the left side of the `&&` evaluates strictly to a boolean (e.g., `Boolean(count) && ...` or `count > 0 && ...`).

---

### Nuance Callout: Adding Properties vs. Setting `undefined`

In JavaScript object manipulation, there is a distinct difference between **omitting a property entirely** vs **setting its value to `undefined**`:

```javascript
// Method A: Conditional Property Addition (Omitted)
const objA = {
  name: "Bob",
  ...(false && { role: "Admin" })
};

// Method B: Ternary Value Assignment
const objB = {
  name: "Bob",
  role: false ? "Admin" : undefined
};

console.log("role" in objA); // false (Key does NOT exist)
console.log("role" in objB); // true! ⚠️ (Key exists, but value is undefined)

console.log(Object.keys(objA)); // ['name']
console.log(Object.keys(objB)); // ['name', 'role']

```

When sending JSON payloads to APIs or serializing objects via `JSON.stringify()`:

- Keys with `undefined` values are omitted during `JSON.stringify()`, matching `objA`.
- However, methods like `Object.keys()`, `hasOwnProperty()`, or `in` operators will still detect `role` in `objB`.

---

### Modern Nullish Coalescing Operator (`??=`)

Introduced in ES2021, the **Logical Nullish Assignment (`??=`)** operator allows you to assign a property to an object *only if* that property does not already exist or is currently `null` / `undefined`:

```javascript
const userConfig = {
  theme: "dark"
};

// Only set default timeout if it is null or undefined:
userConfig.timeout ??= 5000;
userConfig.theme ??= "light"; // Skipped, because theme already exists ("dark")

console.log(userConfig);
// Output: { theme: 'dark', timeout: 5000 }

```

---

### Quick Selection Matrix

| Use Case                                     | Best Method                                                       |
| -------------------------------------------- | ----------------------------------------------------------------- |
| **Inline object creation / React state**     | Spread with logical AND: `{ ...data, ...(cond && { key: val }) }` |
| **Setting a fallback / default property**    | Nullish Assignment operator: `obj.key ??= defaultValue`           |
| **Functional / Dynamic lists of conditions** | `Array.reduce()` or utility function                              |
| **Procedural multi-line logic**              | Traditional `if` statement                                        |

When conditionally spreading properties into an object in TypeScript, the compiler uses **union types**, **optional properties**, or **discriminated unions** depending on how the condition is structured and whether `exactOptionalPropertyTypes` is enabled.

Here is a breakdown of how TypeScript infers types across the three most common conditional spread patterns.

---

### 1. Pattern A: Spread with Logical AND (`...(condition && { prop })`)

This is the most common inline pattern in React and modern JavaScript:

```typescript
const hasAdminAccess = true as boolean; // Typed as boolean (true | false)

const user = {
  name: "Alice",
  ...(hasAdminAccess && { isAdmin: true }),
};

```

#### How TypeScript Infers This

1. `hasAdminAccess && { isAdmin: true }` evaluates to the union type `{ isAdmin: true } | false`.
2. Spreading `false` (`...false`) into an object produces an empty object `{}`.
3. Spreading `{ isAdmin: true }` produces `{ isAdmin: true }`.
4. TypeScript unions the results, inferring `user` as:

```typescript
{
  name: string;
  isAdmin?: boolean | undefined; // Inferred as an OPTIONAL property
}

```

#### ⚠️ The Literal Boolean Trap (`true` vs `boolean`)

If the condition is typed as a **literal boolean** rather than the broad `boolean` type, TypeScript narrows the spread statically:

```typescript
const isTrue = true as const; // Type: true
const isFalse = false as const; // Type: false

const obj1 = { name: "A", ...(isTrue && { age: 30 }) };
// Inferred type: { name: string; age: number } (Always present)

const obj2 = { name: "B", ...(isFalse && { age: 30 }) };
// Inferred type: { name: string } (Completely omitted)

```

---

### 2. Pattern B: Spread with Ternary (`...(condition ? { prop } : {})`)

Using a ternary operator with an empty object fallback `{}` behaves similarly to the logical `&&` pattern, but with a slight structural difference in union evaluation:

```typescript
declare const isVIP: boolean;

const member = {
  id: 101,
  ...(isVIP ? { vipLevel: "gold" } : {}),
};

```

#### How TypeScript Infers This

TypeScript evaluates the spread as a union of two possible object types:

$$\{ \text{id}: \text{number} \} \ \ \text{SPLAT}\ \ (\{\text{vipLevel}: \text{string}\} \ \ \vert{}\ \ \{\})$$

Which collapses to:

```typescript
{
  id: number;
  vipLevel?: string | undefined; // Optional property
}

```

---

### 3. Pattern C: Discriminated Union Spreading (Mutually Exclusive Properties)

If your condition determines a set of mutually exclusive properties, spreading can create a **Discriminated Union**. This is where TypeScript's type inference shines for runtime safety:

```typescript
type AdminRights = { role: "admin"; permissions: string[] };
type UserRights = { role: "user" };

declare const isAdmin: boolean;

const account = {
  id: "usr_123",
  ...(isAdmin 
    ? ({ role: "admin", permissions: ["read", "write"] } as AdminRights)
    : ({ role: "user" } as UserRights)
  )
};

```

#### How TypeScript Infers This

Rather than marking individual properties as optional, TypeScript infers `account` as a **discriminated union**:

```typescript
type Account = 
  | { id: string; role: "admin"; permissions: string[] }
  | { id: string; role: "user" };

```

When you inspect `account.role`, TypeScript narrows the object, preventing you from accessing `permissions` when `role === "user"`:

```typescript
if (account.role === "admin") {
  console.log(account.permissions); // ✅ Valid
} else {
  console.log(account.permissions); 
  // ❌ Property 'permissions' does not exist on type '{ id: string; role: "user"; }'
}

```

---

### Strict Flag Impact: `exactOptionalPropertyTypes`

By default in TypeScript, an optional property `prop?: string` allows both `undefined` assignment AND key omission:

```typescript
{ prop?: string } // Allows { prop: "hello" }, { prop: undefined }, or {}

```

When `exactOptionalPropertyTypes: true` is enabled in `tsconfig.json`:

- `{ prop?: string }` means the key can be omitted, but if present, its value **cannot** be explicitly `undefined`.
- Conditional spreading with `&&` or ternary still produces optional properties (`prop?: string`), but prevents accidental explicit assignments of `undefined`.

---

### Summary Table

| Pattern            | Expression                                  | Inferred Property Type                                |
| ------------------ | ------------------------------------------- | ----------------------------------------------------- |
| **Logical AND**    | `{ ...a, ...(cond && { b: 1 }) }`           | `{ a: T; b?: number }` (Optional key)                 |
| **Ternary Empty**  | `{ ...a, ...(cond ? { b: 1 } : {}) }`       | `{ a: T; b?: number }` (Optional key)                 |
| **Ternary Full**   | `{ ...a, ...(cond ? { b: 1 } : { b: 2 }) }` | `{ a: T; b: number }` (Required key with union value) |
| **Typed Variants** | `{ ...a, ...(cond ? variantA : variantB) }` | `(TypeA & VariantA)                                   | (TypeA & VariantB)` (Discriminated Union) |

Handling nested object properties conditionally or merging deeply nested objects requires extra care in JavaScript because the built-in spread operator (`...`) and `Object.assign()` perform **shallow copies**.

If you use shallow spreading on a deeply nested structure, child objects will be completely overwritten rather than merged.

---

### 1. Conditionally Assigning Nested Properties

To conditionally add or update a property deep inside an object without destroying surrounding keys, you must spread every level of the object hierarchy.

#### Pattern A: Immutable Deep Spread with Logical AND (`&&`)

```javascript
const isShippingFree = true;
const discountCode = "SUMMER2026";

const initialCart = {
  id: 101,
  pricing: {
    subtotal: 100,
    currency: "USD",
  },
};

// Conditionally adding 'shipping' and 'discount' inside 'pricing'
const updatedCart = {
  ...initialCart,
  pricing: {
    ...initialCart.pricing,
    // Add shipping cost only if shipping is NOT free
    ...(!isShippingFree && { shipping: 15 }),
    // Add discount code only if present
    ...(discountCode && { discount: discountCode }),
  },
};

console.log(updatedCart);
/*
Output:
{
  id: 101,
  pricing: {
    subtotal: 100,
    currency: "USD",
    discount: "SUMMER2026"
  }
}
*/

```

---

#### Pattern B: Safe Deep Access with Optional Chaining (`?.`) & Nullish Assignment (`??=`)

If you are mutating an existing object imperatively, use **Optional Chaining (`?.`)** to safely read nested paths and the **Nullish Assignment Operator (`??=`)** (or logical AND) to conditionally set properties:

```javascript
const userProfile = {
  name: "Alice",
  settings: {
    theme: "dark",
  },
};

const newNotificationSetting = "email";

// Ensure the nested path exists before assigning
userProfile.settings ??= {}; 

if (newNotificationSetting) {
  userProfile.settings.notifications = newNotificationSetting;
}

console.log(userProfile);
// Output: { name: 'Alice', settings: { theme: 'dark', notifications: 'email' } }

```

---

### 2. Merging Deeply Nested Objects

#### The Problem with Shallow Copying (`Object.assign` & `{ ...a, ...b }`)

Shallow operations overwrite nested object references entirely:

```javascript
const defaultConfig = {
  theme: { mode: "light", font: "Helvetica" },
  features: { analytics: true }
};

const userConfig = {
  theme: { mode: "dark" } // ⚠️ Missing 'font'
};

// ❌ Shallow Spread Overwrites 'theme.font'!
const badMerge = { ...defaultConfig, ...userConfig };
console.log(badMerge.theme); 
// Output: { mode: 'dark' } ('font' is completely LOST!)

```

---

#### Solution 1: Vanilla Recursive Deep Merge Function (Pure JS)

To combine deeply nested objects without external libraries, use a recursive merge function that handles plain objects, arrays, and primitives:

```javascript
/**
 * Recursively merges target and source objects.
 */
function deepMerge(target, source) {
  // Return source if target/source are not objects
  if (!isObject(target) || !isObject(source)) {
    return source;
  }

  const output = { ...target };

  Object.keys(source).forEach((key) => {
    if (isObject(source[key]) && key in target && isObject(target[key])) {
      // Recurse if both target and source contain nested objects at key
      output[key] = deepMerge(target[key], source[key]);
    } else {
      // Overwrite or add new primitive / array / object
      output[key] = source[key];
    }
  });

  return output;
}

function isObject(item) {
  return item && typeof item === "object" && !Array.isArray(item);
}

// --- Verification ---
const defaultConfig = {
  theme: { mode: "light", font: "Helvetica" },
  features: { analytics: true, logging: false }
};

const userConfig = {
  theme: { mode: "dark" },
  features: { logging: true }
};

const merged = deepMerge(defaultConfig, userConfig);
console.log(merged);
/*
Output:
{
  theme: { mode: 'dark', font: 'Helvetica' },  ✅ Merged!
  features: { analytics: true, logging: true } ✅ Merged!
}
*/

```

---

#### Solution 2: Standard Utility Libraries (Lodash / Structured Clone)

In large production apps, writing custom recursive logic can lead to unhandled edge cases (like cyclic references, Date objects, or Map/Set types). Using well-tested utilities is recommended:

##### A. Lodash `merge` (Mutates Target) / `mergeWith`

`lodash.merge` recursively merges properties from source objects into the target object:

```javascript
import merge from "lodash/merge";

const defaultConfig = { theme: { color: "blue", size: "large" } };
const userConfig = { theme: { color: "red" } };

const result = merge({}, defaultConfig, userConfig);
console.log(result);
// Output: { theme: { color: 'red', size: 'large' } }

```

##### B. Modern `structuredClone()` (Deep Copying First)

If you just need to clone an object deeply before making manual conditional edits, modern JS includes `structuredClone()` natively across all modern runtimes:

```javascript
const original = { a: { b: 1 } };

// Deep clone without Lodash or JSON.parse/stringify
const cloned = structuredClone(original);
cloned.a.b = 2;

console.log(original.a.b); // 1 (Original remains untouched)

```

---

### Summary Checklist

| Goal                                   | Technique                                                     | Pros & Cons                       |
| -------------------------------------- | ------------------------------------------------------------- | --------------------------------- |
| **1-2 Levels Deep Conditional Spread** | `{ ...obj, nested: { ...obj.nested, ...(cond && { key }) } }` | 🟢 No dependencies, immutable.<br> |

<br>🔴 Verbose for 3+ nested levels. |
| **Deep Object Merging** | Recursive `deepMerge()` function OR `lodash.merge()` | 🟢 Preserves default values deep in tree.<br>

<br>🔴 Watch out for array merging strategies (replace vs append). |
| **Safe Deep Mutation** | `obj.path ??= {}; obj.path.key = val;` | 🟢 Concise procedural logic.<br>

<br>🔴 Mutates input object. |
