# Problem 2: Type a Logging Wrapper Without Redeclaring the Signature

## Task

Given the existing (already-implemented, signature fixed) function below, write a `withLogging` higher-order function that wraps *any* function of this general shape, logs its arguments and result, and returns a new function with the **exact same call signature and return type** — without redeclaring the parameter list or return type by hand.

```typescript
function calculateShipping(weightKg: number, destination: { country: string; expressDelivery: boolean }): number {
  const base = weightKg * 2.5;
  return destination.expressDelivery ? base * 1.5 : base;
}
```

Requirements:
1. `withLogging` must be generic so it works for any function, not just `calculateShipping`.
2. The wrapped function's parameter types and return type must be derived from the original function's type using `Parameters` and `ReturnType` — no manual re-typing.
3. Calling the wrapped function with wrong argument types must still fail to compile.

## Solution

```typescript
function withLogging<F extends (...args: any[]) => any>(fn: F): (...args: Parameters<F>) => ReturnType<F> {
  return (...args: Parameters<F>): ReturnType<F> => {
    console.log(`Calling ${fn.name} with`, args);
    const result = fn(...args);
    console.log(`${fn.name} returned`, result);
    return result;
  };
}

const loggedShipping = withLogging(calculateShipping);

const cost = loggedShipping(3.2, { country: "US", expressDelivery: true }); // typed as number

// loggedShipping("heavy", { country: "US", expressDelivery: true });
// Error: Argument of type 'string' is not assignable to parameter of type 'number'
```

`Parameters<F>` extracts `[weightKg: number, destination: { country: string; expressDelivery: boolean }]` and `ReturnType<F>` extracts `number`, both purely from `F`'s inferred type when `calculateShipping` is passed in — nothing about `calculateShipping`'s signature is retyped by hand, so if its signature changes later, `withLogging` and every function it wraps stay correct with zero edits.
