In JavaScript, object properties are not just simple key-value pairs. Under the hood, every property is backed by an internal record called a **Property Descriptor**.

A Property Descriptor is a configuration object that defines the exact behavior of a property—whether it can be overwritten, looped over, or deleted.

---

## The Four Attributes of a Data Descriptor

When you define a standard property (e.g., `obj.key = 'value'`), JavaScript creates a **Data Descriptor** containing four attributes:

| Attribute          | Type      | Default (via `defineProperty`) | Default (via Direct Assignment) | Description                                                                                       |
| ------------------ | --------- | ------------------------------ | ------------------------------- | ------------------------------------------------------------------------------------------------- |
| **`value`**        | `any`     | `undefined`                    | Assigned value                  | The actual value stored in the property.                                                          |
| **`writable`**     | `boolean` | `false`                        | `true`                          | Controls whether the property's value can be changed using an assignment operator (`=`).          |
| **`enumerable`**   | `boolean` | `false`                        | `true`                          | Controls whether the property shows up during loops (`for...in`) or inspection (`Object.keys()`). |
| **`configurable`** | `boolean` | `false`                        | `true`                          | Controls whether the property can be **deleted** or its descriptor attributes modified.           |

> ⚠️ **Crucial Default Difference:** When properties are created via direct assignment (`obj.a = 1`), `writable`, `enumerable`, and `configurable` default to `true`. When created using `Object.defineProperty()`, unspecified attributes default to `false`!

---

## Inspecting Descriptors: `Object.getOwnPropertyDescriptor`

You can inspect the property descriptor of any own property using `Object.getOwnPropertyDescriptor()`:

```javascript
const user = { name: 'Alice' };

const descriptor = Object.getOwnPropertyDescriptor(user, 'name');
console.log(descriptor);
/* Output:
{
  value: 'Alice',
  writable: true,
  enumerable: true,
  configurable: true
}
*/

```

---

## Detailed Breakdown of Attributes

### 1. `writable` (Can the value be changed?)

When `writable` is set to `false`, attempting to reassign the property value will fail. In non-strict mode, it fails silently; in strict mode (`'use strict'`), it throws a `TypeError`.

```javascript
'use strict';

const config = {};

Object.defineProperty(config, 'API_URL', {
  value: 'https://api.example.com',
  writable: false,     // Read-only!
  enumerable: true,
  configurable: true
});

console.log(config.API_URL); // "https://api.example.com"

// Attempting to overwrite:
config.API_URL = 'https://hacked.com'; 
// ❌ TypeError: Cannot assign to read only property 'API_URL' of object '#<Object>'

```

---

### 2. `enumerable` (Does it show up in loops?)

When `enumerable` is set to `false`, the property becomes "hidden" from standard iteration mechanisms like `for...in` loops, `Object.keys()`, and `JSON.stringify()`. However, it can still be accessed directly via `obj.key` or inspected using `Object.getOwnPropertyNames()`.

```javascript
const user = { username: 'alice99' };

// Define a hidden ID property
Object.defineProperty(user, 'internalId', {
  value: 'USR-891023',
  enumerable: false, // Hidden from enumeration!
  writable: true,
  configurable: true
});

console.log(user.internalId); // "USR-891023" (Direct access still works!)

// Iteration behavior:
console.log(Object.keys(user)); // ['username'] (internalId is ignored)

for (let key in user) {
  console.log(key); // Outputs ONLY 'username'
}

console.log(JSON.stringify(user)); // '{"username":"alice99"}' (internalId is omitted)

```

---

### 3. `configurable` (Can it be deleted or reconfigured?)

The `configurable` attribute is the "lock" on the property descriptor itself. When `configurable` is `false`:

1. The property **cannot be deleted** using the `delete` operator.
2. The property descriptor attributes **cannot be modified** (except changing `writable` from `true` to `false`).
3. The property type cannot be converted between a Data Descriptor and an Accessor Descriptor (getter/setter).

```javascript
'use strict';

const database = {};

Object.defineProperty(database, 'connectionString', {
  value: 'postgres://localhost:5432',
  writable: true,
  enumerable: true,
  configurable: false // Cannot be deleted or reconfigured!
});

// A. Attempting to delete:
delete database.connectionString;
// ❌ TypeError: Cannot delete property 'connectionString' of #<Object>

// B. Attempting to reconfigure descriptor:
Object.defineProperty(database, 'connectionString', {
  enumerable: false
});
// ❌ TypeError: Cannot redefine property: connectionString

```

---

## Accessor Descriptors (Getters and Setters)

Instead of a `value` and `writable` attribute, a property can be defined as an **Accessor Descriptor** using `get` and `set` functions.

```javascript
const account = {
  _balance: 1000
};

Object.defineProperty(account, 'formattedBalance', {
  get() {
    return `$${this._balance.toFixed(2)}`;
  },
  set(amount) {
    if (amount < 0) throw new Error('Balance cannot be negative');
    this._balance = amount;
  },
  enumerable: true,
  configurable: true
  // Note: 'value' and 'writable' CANNOT be present on an Accessor Descriptor!
});

console.log(account.formattedBalance); // "$1000.00"

account.formattedBalance = 2500;
console.log(account._balance); // 2500

```

---

## Object-Level Freeze & Seal Methods

JavaScript provides higher-level helper methods that modify descriptors across an entire object at once:

| Method                              | Can add new properties? | Can delete properties? (`configurable: false`) | Can modify values? (`writable: false`) |
| ----------------------------------- | ----------------------- | ---------------------------------------------- | -------------------------------------- |
| **`Object.preventExtensions(obj)`** | ❌ No                    | ✅ Yes                                          | ✅ Yes                                  |
| **`Object.seal(obj)`**              | ❌ No                    | ❌ **No** (Sets all `configurable: false`)      | ✅ Yes                                  |
| **`Object.freeze(obj)`**            | ❌ No                    | ❌ **No** (Sets all `configurable: false`)      | ❌ **No** (Sets all `writable: false`)  |

### Example: `Object.freeze()` in Action

```javascript
const immutableConfig = Object.freeze({
  env: 'production',
  port: 8080
});

// Inspecting descriptors after freezing:
console.log(Object.getOwnPropertyDescriptor(immutableConfig, 'env'));
/* Output:
{
  value: 'production',
  writable: false,      <-- Set to false automatically
  enumerable: true,
  configurable: false   <-- Set to false automatically
}
*/

```

---

## Summary Reference Table

| Goal                         | `value` / `get` / `set` | `writable` | `enumerable` | `configurable` |
| ---------------------------- | ----------------------- | ---------- | ------------ | -------------- |
| **Standard Property**        | Defined                 | `true`     | `true`       | `true`         |
| **Read-Only Constant**       | Defined                 | `false`    | `true`       | `false`        |
| **Hidden Metadata Key**      | Defined                 | `true`     | `false`      | `true`         |
| **Locked Computed Property** | `get` / `set`           | N/A        | `true`       | `false`        |
