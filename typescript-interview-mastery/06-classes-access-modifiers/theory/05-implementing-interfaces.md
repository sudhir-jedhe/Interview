# Implementing Interfaces with Classes

A class declares that it satisfies one or more interface contracts with the `implements` keyword. Unlike `extends` (single inheritance, one base class only), a class can `implements` any number of interfaces, and TypeScript checks structurally that every required member is present with a compatible type.

```typescript
interface Serializable {
  serialize(): string;
}

interface Comparable<T> {
  compareTo(other: T): number;
}

class Money implements Serializable, Comparable<Money> {
  constructor(private readonly cents: number) {}

  serialize(): string {
    return JSON.stringify({ cents: this.cents });
  }

  compareTo(other: Money): number {
    return this.cents - other.cents;
  }
}

const prices = [new Money(500), new Money(100), new Money(300)];
prices.sort((a, b) => a.compareTo(b));
```

`implements` is purely a compile-time obligation — leaving out `serialize` would be a compile error ("Class 'Money' incorrectly implements interface 'Serializable'"), but nothing about `implements` changes runtime behavior at all; it's not like extending a base class, there's no shared prototype chain contributed by the interface, because interfaces don't exist at runtime in the first place.

## Interfaces don't need `implements` to be satisfied

Because TypeScript is structurally typed, a class doesn't strictly need the `implements` keyword to be assignable to an interface type — if its shape matches, it matches. `implements` exists mainly for *documentation and up-front checking*: it makes the intent explicit and gives you compile errors immediately in the class body, rather than later at some arbitrary assignment site.

```typescript
class ImplicitlySerializable {
  serialize(): string {
    return "{}";
  }
}

const s: Serializable = new ImplicitlySerializable(); // ok — structurally compatible, no `implements` needed
```

## When two interfaces conflict

If two interfaces you're implementing declare a member with the same name but incompatible types, no single implementation can satisfy both simultaneously, and TypeScript will reject the class.

```typescript
interface Loggable {
  log(message: string): void;
}

interface Metric {
  log(value: number): void; // same name, incompatible parameter type
}

class Bad implements Loggable, Metric {
  log(arg: string | number): void {
    console.log(arg);
  }
}
```

Interestingly, this specific example *does* compile — TypeScript allows a single method whose parameter type is a union broad enough to satisfy both narrower signatures (`string | number` is compatible with both `(string) => void` and `(number) => void` requirements, since a wider parameter type can substitute for either narrower one). But if the incompatibility is in the *return type* rather than the parameter, there's no way to reconcile them, and the class must be rejected.

```typescript
interface HasId {
  id: string;
}
interface HasNumericId {
  id: number; // same name, genuinely incompatible property type
}

class Broken implements HasId, HasNumericId {
  id = "abc"; // Error: cannot satisfy both `id: string` and `id: number` with one value
}
```

## Why this matters in interviews

Interviewers often ask you to implement two interfaces and then push on what happens with a naming conflict — the strong answer distinguishes between conflicts resolvable with a wider parameter/property type (methods, contravariant-ish) and conflicts that are fundamentally irreconcilable (a single field can't simultaneously be `string` and `number`), and explains that in the irreconcilable case, the fix is almost always to rename one of the interface members or to have the class expose two differently-named methods instead of trying to force one implementation to serve both contracts.
