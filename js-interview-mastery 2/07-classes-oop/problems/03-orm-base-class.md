# Problem: a simple ORM-ish base class with static create() and instance validation

## Requirements

Implement a `Model` base class that other "table" classes extend, providing:

- A static `create(data)` factory method that validates `data` against each field's rules (declared on the subclass) and either returns a new validated instance or throws a descriptive error.
- Instance-level validation logic reusable by both `create()` and a later `.validate()` call (e.g., before saving an update).
- A pattern where subclasses declare their own schema without touching the base class.

This mirrors the shape of real lightweight ORMs (a static factory + declarative field rules on each model), scaled down to something you could plausibly sketch in an interview.

## Solution

```js
class ValidationError extends Error {
  constructor(errors) {
    super(`Validation failed: ${errors.join(", ")}`);
    this.name = "ValidationError";
    this.errors = errors;
  }
}

class Model {
  // Subclasses override this static getter to declare their schema.
  static schema = {};

  constructor(data) {
    Object.assign(this, data);
  }

  // Static factory: the standard entry point for constructing a validated instance.
  static create(data) {
    const errors = this.validateData(data);
    if (errors.length > 0) throw new ValidationError(errors);
    return new this(data); // `this` here is the subclass (User, Product, ...), not Model
  }

  // Reusable validation, callable both from create() and from an existing instance.
  static validateData(data) {
    const errors = [];
    for (const [field, rules] of Object.entries(this.schema)) {
      const value = data[field];
      if (rules.required && (value === undefined || value === null)) {
        errors.push(`${field} is required`);
        continue;
      }
      if (value !== undefined && rules.type && typeof value !== rules.type) {
        errors.push(`${field} must be of type ${rules.type}`);
      }
      if (value !== undefined && rules.validate && !rules.validate(value)) {
        errors.push(`${field} failed custom validation`);
      }
    }
    return errors;
  }

  // Instance method: re-validate an existing (possibly mutated) instance.
  validate() {
    const errors = this.constructor.validateData(this);
    if (errors.length > 0) throw new ValidationError(errors);
    return true;
  }
}

class User extends Model {
  static schema = {
    name: { required: true, type: "string" },
    age: { required: true, type: "number", validate: (v) => v >= 0 },
    email: { required: false, type: "string", validate: (v) => v.includes("@") },
  };
}
```

## Verifying it works

```js
const user = User.create({ name: "Ada", age: 30, email: "ada@example.com" });
console.log(user instanceof User);  // true
console.log(user instanceof Model); // true — normal prototype-chain inheritance
console.log(user.name, user.age);   // "Ada" 30

try {
  User.create({ name: "Bad", age: -5 });
} catch (e) {
  console.log(e instanceof ValidationError); // true
  console.log(e.errors); // ["age failed custom validation"]
}

user.age = -1;
try {
  user.validate();
} catch (e) {
  console.log(e.errors); // ["age failed custom validation"]
}
```

## Key implementation notes

- **`static create(data)` uses `new this(data)`, not `new Model(data)` or `new User(data)`.** Inside a static method, `this` refers to whichever class the method was actually called on (`User.create(...)` → `this === User`), so the base class's `create` implementation automatically constructs the correct subclass — this is the same dynamic-`this` mechanism that makes static methods inheritable and reusable across every subclass without modification.
- **Schema-as-static-property** keeps validation rules declarative and colocated with the model definition, while the actual validation *logic* lives once, in the base class — a clean separation between "what to validate" (subclass) and "how to validate" (base class).
- **Both `create()` and `validate()` funnel through `validateData()`** so the two entry points (constructing new data vs. re-checking an existing instance) can never drift out of sync with different rules.
- A production ORM would add things like async validation (uniqueness checks against a database), nested/related models, and dirty-field tracking — but the static-factory + instance-validation shape scales up cleanly from this sketch.
