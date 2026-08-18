# Class Syntax and Constructor Parameter Properties

TypeScript classes compile down to standard JavaScript classes, but the type system layers on top of them: typed fields, typed constructor parameters, and typed method signatures, all checked at compile time and erased at runtime.

```typescript
class UserAccount {
  id: number;
  email: string;

  constructor(id: number, email: string) {
    this.id = id;
    this.email = email;
  }
}

const acct = new UserAccount(1, "dev@example.com");
```

This works, but it's repetitive — every field is declared once as a class member and again as a constructor parameter, then manually assigned. TypeScript offers a shorthand specifically to cut this boilerplate: **constructor parameter properties**.

## Parameter properties

Prefixing a constructor parameter with an accessibility modifier (`public`, `private`, `protected`) or `readonly` tells TypeScript to both declare a class field with that name *and* assign it from the argument automatically — no separate declaration, no manual `this.x = x`.

```typescript
class UserAccount {
  constructor(
    public id: number,
    private email: string,
    readonly createdAt: Date = new Date()
  ) {}
}

const acct = new UserAccount(1, "dev@example.com");
console.log(acct.id);        // ok, public
console.log(acct.createdAt); // ok, readonly but publicly readable
// console.log(acct.email);  // Error: 'email' is private
```

The constructor body can be entirely empty (as above) if there's nothing beyond assignment to do, or it can mix parameter properties with additional setup logic — TypeScript still performs the automatic assignment for the flagged parameters before any hand-written statements run.

```typescript
class OrderProcessor {
  private readonly processedAt: Date;

  constructor(public readonly orderId: string, private readonly total: number) {
    this.processedAt = new Date(); // ordinary field, set explicitly
    if (total < 0) {
      throw new Error("Total cannot be negative");
    }
  }
}
```

## Mixing modifiers and defaults

Parameter properties support default values and optional markers exactly like regular parameters, and multiple modifiers can combine (`public readonly`, `private readonly`).

```typescript
class Pagination {
  constructor(
    public readonly page: number = 1,
    public readonly pageSize: number = 20
  ) {}
}

const p = new Pagination(); // page: 1, pageSize: 20
```

## Why this matters in interviews

Parameter properties are extremely common in real TypeScript codebases (Angular's dependency injection relies on them heavily, for instance), so interviewers expect familiarity with the shorthand and, more importantly, an understanding that it's purely syntactic sugar — `constructor(private name: string)` compiles to a constructor that assigns `this.name = name`, identical in behavior to writing it out longhand. Knowing this matters because it explains why you can't parameter-property-ify an inherited field, or why the shorthand doesn't work on plain functions — it's tied specifically to class constructors.
