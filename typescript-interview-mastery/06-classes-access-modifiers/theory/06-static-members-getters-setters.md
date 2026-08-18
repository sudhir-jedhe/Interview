# Static Members and Getters/Setters

## Static members

`static` fields and methods belong to the class itself, not to any instance — there's exactly one copy, shared across every instance, accessed via the class name rather than `this` on an object.

```typescript
class IdGenerator {
  private static nextId = 1;

  static generate(): number {
    return IdGenerator.nextId++;
  }
}

console.log(IdGenerator.generate()); // 1
console.log(IdGenerator.generate()); // 2
// const g = new IdGenerator(); // would compile, but there's no instance API here
```

Static members can carry the same access modifiers as instance members — `private static`, `protected static`, `readonly static` — and they're commonly used for factory methods, singletons, and shared configuration/counters that logically belong to the class rather than any one instance.

```typescript
class Logger {
  private static instance: Logger;

  private constructor(private readonly prefix: string) {}

  static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger("[APP]");
    }
    return Logger.instance;
  }

  log(message: string): void {
    console.log(`${this.prefix} ${message}`);
  }
}

const logger = Logger.getInstance(); // only entry point — constructor is private
```

Note the `private constructor` above — combined with a `static getInstance` factory, this is the classic singleton pattern, and it's only enforceable because TypeScript checks `new Logger(...)` against the constructor's declared visibility at every call site outside the class.

## Getters and setters

`get`/`set` accessors let a property-looking API run code on read or write, which is useful for validation, computed values, or lazy initialization, while callers still use plain property syntax (`obj.prop`, `obj.prop = x`) rather than method calls.

```typescript
class Temperature {
  private _celsius: number;

  constructor(celsius: number) {
    this._celsius = celsius;
  }

  get celsius(): number {
    return this._celsius;
  }

  set celsius(value: number) {
    if (value < -273.15) {
      throw new Error("Below absolute zero");
    }
    this._celsius = value;
  }

  get fahrenheit(): number {
    return this._celsius * 9 / 5 + 32;
  }
}

const t = new Temperature(20);
console.log(t.fahrenheit); // 68 — read like a property, computed on access
t.celsius = 25;             // runs the setter's validation
// t.celsius = -300;        // throws at runtime
```

`fahrenheit` has no setter, which makes it effectively read-only from the outside — TypeScript enforces that you can't assign to an accessor property that only has a `get`. As of TypeScript 4.3+, a getter and setter for the same property are even allowed to have different types (e.g., a permissive setter that accepts `string | number` and a getter that always returns `number`), which is occasionally useful for normalization APIs.

## Why this matters in interviews

Static members and accessors both come up when interviewers ask you to model something like a connection pool, a singleton config object, or a value object with validation (like `Temperature` above) — the graders are checking that you know `static` means "one per class, not per instance" and that you understand accessors give you validation/computation hooks without changing the calling code's syntax from a plain property read/write.
