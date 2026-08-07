**Class Decorators** and **Stage 3 Decorator Metadata** provide a standard declarative syntax for metaprogramming in modern JavaScript. They allow you to annotate, inspect, transform, or replace classes, methods, accessors, getters, setters, and fields at declaration time.

The TC33 Stage 3 Decorator specification (supported natively in modern bundlers like Vite, Esbuild, and TypeScript 5.0+) introduces a clean runtime model with a standardized `context` object and a dedicated **`Symbol.metadata`** property.

---

## 1. Structure of a Stage 3 Decorator Function

A Stage 3 decorator is a function that accepts two arguments:

1. **`target` / `value**`: The target element being decorated (e.g., class constructor, method function, or `undefined` for fields).
2. **`context`**: An object containing metadata about the decorated element:

* **`kind`**: `'class'`, `'method'`, `'getter'`, `'setter'`, `'field'`, or `'accessor'`.
* **`name`**: The string or symbol name of the element.
* **`static`**: Boolean indicating whether the element is `static`.
* **`private`**: Boolean indicating whether the element is a `#private` member.
* **`metadata`**: An object reference attached to `Symbol.metadata` shared across all decorators on the class.
* **`addInitializer()`**: A hook function to run initialization code during class definition or instance construction.

---

## 2. Types of Decorators with Code Examples

### A. Class Decorators

Class decorators receive the constructor function as their first argument. Returning a new class or constructor replaces the original target.

```javascript
// A class decorator that tracks class instantiations
function TrackedClass(target, context) {
  if (context.kind === 'class') {
    return class extends target {
      constructor(...args) {
        super(...args);
        console.log(`[Tracked] New instance of ${context.name} created at ${new Date().toISOString()}`);
      }
    };
  }
}

@TrackedClass
class UserService {
  constructor(name) {
    this.name = name;
  }
}

const user = new UserService('Alice');
// Logs: [Tracked] New instance of UserService created at ...

```

---

### B. Method Decorators

Method decorators receive the target method function. Returning a replacement function overrides the original method.

```javascript
// A method decorator that logs execution time and arguments
function measurePerformance(targetMethod, context) {
  if (context.kind === 'method') {
    return function (...args) {
      console.time(context.name);
      const result = targetMethod.apply(this, args);
      console.timeEnd(context.name);
      return result;
    };
  }
}

class MathOperations {
  @measurePerformance
  heavyCalculation(iterations) {
    let total = 0;
    for (let i = 0; i < iterations; i++) {
      total += Math.sqrt(i);
    }
    return total;
  }
}

const math = new MathOperations();
math.heavyCalculation(1000000);
// Logs: heavyCalculation: X.XXms

```

---

### C. Field Decorators

Field decorators receive `undefined` as their first argument because the field value does not exist until the class is instantiated. They return an initializer function that computes the field's default value.

```javascript
// Field decorator that automatically binds instance methods or transforms default values
function uppercase(value, context) {
  if (context.kind === 'field') {
    return function (initialValue) {
      return typeof initialValue === 'string' ? initialValue.toUpperCase() : initialValue;
    };
  }
}

class UserProfile {
  @uppercase
  username = 'john_doe';
}

const profile = new UserProfile();
console.log(profile.username); // "JOHN_DOE"

```

---

### D. Auto-Accessor Decorators (`accessor` keyword)

Stage 3 introduces auto-accessors using the `accessor` keyword. Decorating an auto-accessor allows you to intercept both reads and writes.

```javascript
function loggedAccessor(target, context) {
  if (context.kind === 'accessor') {
    const { get, set } = target;
    return {
      get() {
        console.log(`[GET] Reading ${String(context.name)}`);
        return get.call(this);
      },
      set(val) {
        console.log(`[SET] Writing ${String(context.name)} = ${val}`);
        set.call(this, val);
      }
    };
  }
}

class Account {
  @loggedAccessor
  accessor balance = 100;
}

const acc = new Account();
acc.balance = 250; // Logs: [SET] Writing balance = 250
console.log(acc.balance); // Logs: [GET] Reading balance -> 250

```

---

## 3. Stage 3 Decorator Metadata (`Symbol.metadata`)

The Stage 3 Metadata specification introduces **`context.metadata`**, a plain JavaScript object automatically assigned to **`ClassConstructor[Symbol.metadata]`**.

Every decorator applied to a class or its members receives this exact same metadata object via `context.metadata`, enabling cross-decorator state sharing, validation rules, schema definitions, and serialization annotations without external libraries like `reflect-metadata`.

### Practical Metadata Example: Building an Automatic Schema Validator

```javascript
// 1. Field Decorator that records validation metadata rules
function validateType(expectedType) {
  return function (value, context) {
    if (context.kind === 'field') {
      // Access or initialize the shared class metadata store
      context.metadata.validators = context.metadata.validators || {};
      
      // Store rule for this field name
      context.metadata.validators[context.name] = expectedType;
    }
  };
}

// 2. Class Decorator or Helper function that reads Symbol.metadata
function validateInstance(instance) {
  const constructor = instance.constructor;
  // Read the metadata object attached to the constructor
  const rules = constructor[Symbol.metadata]?.validators || {};

  for (const [field, expectedType] of Object.entries(rules)) {
    const actualValue = instance[field];
    if (typeof actualValue !== expectedType) {
      throw new TypeError(`Validation failed: Field '${field}' must be a ${expectedType}, but got ${typeof actualValue}`);
    }
  }
}

// 3. Define Class with Metadata Decorators
class Product {
  @validateType('string')
  title;

  @validateType('number')
  price;

  constructor(title, price) {
    this.title = title;
    this.price = price;
    validateInstance(this); // Validate upon creation
  }
}

// Usage:
const item = new Product('Keyboard', 49.99); // Passes validation!

console.log(Product[Symbol.metadata]);
// Output: { validators: { title: 'string', price: 'number' } }

// Invalid usage:
// const invalidItem = new Product('Keyboard', '49.99');
// Throws TypeError: Validation failed: Field 'price' must be a number, but got string

```

---

## 4. Legacy (Stage 2 / Experimental) vs Stage 3 Decorators

| Feature                       | Legacy (Stage 2 / TypeScript `experimentalDecorators`) | Standardized Stage 3                                      |
| ----------------------------- | ------------------------------------------------------ | --------------------------------------------------------- |
| **Arguments**                 | `(target, key, descriptor)`                            | `(value, context)`                                        |
| **Context Object**            | ❌ None                                                 | ✅ `context` object with name, kind, static, private flags |
| **Metadata API**              | Requires `reflect-metadata` polyfill                   | Built-in native `Symbol.metadata`                         |
| **Private Fields (`#field`)** | ❌ Not supported                                        | ✅ Native support for private fields and methods           |
| **Auto-Accessors**            | ❌ None                                                 | ✅ Native `accessor` keyword support                       |

---

## 5. Enabling Stage 3 Decorators

* **TypeScript:** Set `"target": "ES2022"` or later and ensure `"experimentalDecorators": false` (or omit it) in `tsconfig.json` (TypeScript 5.0+ defaults to Stage 3).
* **Babel:** Use `@babel/plugin-proposal-decorators` with `{ "version": "2023-11" }`.
* **Vite / Esbuild:** Supported natively in modern build pipelines.
