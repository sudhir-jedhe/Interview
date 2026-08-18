# Optional, Default, and Rest Parameters

Real-world functions rarely have a fixed, uniform argument list — some parameters are genuinely optional, some have sensible defaults, and some accept a variable number of trailing arguments. TypeScript has dedicated syntax for all three, and understanding their interaction (especially ordering rules) is a common interview topic.

## Optional parameters (`?`)

A parameter marked with `?` may be omitted at the call site. Inside the function, its type is `T | undefined`.

```typescript
function greet(name: string, honorific?: string): string {
  return honorific ? `${honorific} ${name}` : `Hello, ${name}`;
}

greet("Ada");             // "Hello, Ada"
greet("Ada", "Dr.");        // "Dr. Ada"
```

Optional parameters must come after all required parameters — `function f(a?: string, b: string)` is a compile error, since the compiler couldn't determine which argument at a call site corresponds to which parameter if an earlier one could be skipped.

## Default parameters

A default value makes a parameter optional at the call site while giving it a concrete fallback value if omitted — no `?` needed, and its type is inferred from the default value if not explicitly annotated.

```typescript
function createPagination(page: number, pageSize = 20): { offset: number; limit: number } {
  return { offset: (page - 1) * pageSize, limit: pageSize };
}

createPagination(1);      // pageSize defaults to 20
createPagination(2, 50);  // pageSize explicitly 50
```

Unlike optional parameters, a default-valued parameter's type inside the function body is just `T` (not `T | undefined`), since TypeScript knows it's always been given a concrete value by the time the body runs — either the caller's argument or the default.

```typescript
function logLevel(level: "info" | "warn" = "info"): void {
  console.log(level.toUpperCase()); // no need to guard against undefined — level is always a string
}
```

Default parameters can also reference earlier parameters in the same list:

```typescript
function createRange(start: number, end: number = start + 10): number[] {
  return Array.from({ length: end - start }, (_, i) => start + i);
}
```

## Rest parameters

A rest parameter collects any number of trailing arguments into an array, typed as `T[]`. Only one rest parameter is allowed, and it must be the last parameter in the list.

```typescript
function sumAll(...amounts: number[]): number {
  return amounts.reduce((total, amount) => total + amount, 0);
}

sumAll(10, 20, 30); // 60
sumAll();            // 0 — rest parameters default to an empty array if nothing's passed
```

Rest parameters can follow required parameters:

```typescript
function logEvent(name: string, ...metadata: unknown[]): void {
  console.log(name, metadata);
}

logEvent("checkout_started", { userId: 1 }, { cartTotal: 4999 });
```

## Ordering rules recap

The required call-site order is: required parameters, then optional (`?`) or default-valued parameters, then at most one rest parameter last. TypeScript enforces this at the declaration level — attempting to declare a required parameter after an optional one, or more than one rest parameter, or a parameter after a rest parameter, is a compile error, since JavaScript's calling convention (positional arguments) makes any other order ambiguous or unparseable.
