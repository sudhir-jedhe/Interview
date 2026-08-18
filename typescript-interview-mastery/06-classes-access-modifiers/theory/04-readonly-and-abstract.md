# readonly Fields and Abstract Classes

## readonly class fields

A `readonly` field can only be assigned once — either at its declaration or inside the constructor of the declaring class — and any assignment after that is a compile error. This is different from `const` (which applies to variable bindings, not object properties) and it's checked purely at compile time, same caveat as `private`.

```typescript
class Invoice {
  readonly invoiceNumber: string;
  readonly issuedAt: Date = new Date();
  total: number;

  constructor(invoiceNumber: string, total: number) {
    this.invoiceNumber = invoiceNumber; // ok — inside the constructor
    this.total = total;
  }

  markPaid(): void {
    // this.invoiceNumber = "changed"; // Error: cannot assign to readonly property
    this.total = 0; // ok — `total` isn't readonly
  }
}
```

Like `private`, `readonly` is a compile-time-only guarantee — the compiled JavaScript has no notion of a read-only property, so bracket-notation or direct property assignment from JavaScript consumers of your compiled output can still mutate it. `Object.freeze(instance)` is the actual runtime enforcement mechanism if you need that guarantee to hold outside the type checker too.

## Abstract classes

An `abstract` class can't be instantiated directly — it exists only to be extended — and it can declare `abstract` methods that have a signature but no implementation, forcing every concrete subclass to provide one.

```typescript
abstract class Shape {
  abstract area(): number;
  abstract perimeter(): number;

  describe(): string {
    return `Area: ${this.area().toFixed(2)}, Perimeter: ${this.perimeter().toFixed(2)}`;
  }
}

class Circle extends Shape {
  constructor(private radius: number) {
    super();
  }

  area(): number {
    return Math.PI * this.radius ** 2;
  }

  perimeter(): number {
    return 2 * Math.PI * this.radius;
  }
}

// const s = new Shape(); // Error: Cannot create an instance of an abstract class
const c = new Circle(5);
console.log(c.describe());
```

`Shape` provides `describe()` as a normal, inherited, concrete method — abstract classes can freely mix abstract members (no body, must be overridden) with concrete members (real implementation, inherited as-is or optionally overridden). This is the key structural difference from interfaces: an interface can *only* declare shape, never implementation, while an abstract class can do both, making it the right tool when subclasses share real, reusable behavior in addition to a common contract.

## Abstract classes vs interfaces, briefly

Use an interface when you only need to describe a shape with no shared implementation and want a class to be able to implement several unrelated contracts at once (TypeScript classes can `implements` multiple interfaces but `extends` only one class). Use an abstract class when subclasses share meaningful concrete behavior (like `describe()` above) alongside the parts each subclass must customize.

## Why this matters in interviews

Being asked to design an abstract base class with a couple of concrete subclasses (frequently `Shape` → `Circle`/`Rectangle`, or `Employee` → `Manager`/`Engineer`) is one of the most common class-modeling interview exercises — the graders are checking that you know abstract methods have no body in the base class, that the base class can't be instantiated, and that concrete subclasses must implement every abstract member or the compiler rejects them.
