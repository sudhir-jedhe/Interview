# Implement an exhaustive switch over a discriminated union with a never default

## Problem

Model a `PaymentMethod` discriminated union (`card`, `bankTransfer`, `wallet`) and write a `getProcessingFee` function that computes a fee per method using an exhaustive `switch` with a `never`-typed `default` branch, so that adding a new payment method without updating `getProcessingFee` breaks the build.

## Solution

```typescript
type PaymentMethod =
  | { kind: "card"; amount: number }
  | { kind: "bankTransfer"; amount: number }
  | { kind: "wallet"; amount: number; walletProvider: string };

function assertNever(x: never): never {
  throw new Error(`Unhandled payment method: ${JSON.stringify(x)}`);
}

function getProcessingFee(method: PaymentMethod): number {
  switch (method.kind) {
    case "card":
      return method.amount * 0.029 + 0.3;
    case "bankTransfer":
      return 0.5; // flat fee
    case "wallet":
      return method.walletProvider === "premium-wallet" ? 0 : method.amount * 0.01;
    default:
      return assertNever(method);
  }
}
```

## Usage

```typescript
console.log(getProcessingFee({ kind: "card", amount: 100 }));         // 3.2
console.log(getProcessingFee({ kind: "bankTransfer", amount: 100 })); // 0.5
console.log(getProcessingFee({ kind: "wallet", amount: 100, walletProvider: "standard" })); // 1
```

## What happens when a new method is added

```typescript
type PaymentMethod =
  | { kind: "card"; amount: number }
  | { kind: "bankTransfer"; amount: number }
  | { kind: "wallet"; amount: number; walletProvider: string }
  | { kind: "crypto"; amount: number; network: string }; // new, unhandled

// getProcessingFee's `default: return assertNever(method);` now fails to compile:
// Argument of type '{ kind: "crypto"; ... }' is not assignable to parameter of type 'never'.
```

## Discussion

The `default` branch is where the safety net lives — as long as `assertNever(method)` is the last thing in `default`, the compiler forces every member of `PaymentMethod` to be handled by an explicit `case` before the code can build. This catches the far more common and dangerous version of this bug: not a missing method entirely, but a payment method added by one team while `getProcessingFee` is owned and maintained by another — the exhaustiveness check is what makes that cross-team gap visible at compile time instead of only being discovered when a `crypto` payment silently falls through to whatever `default` would otherwise do (or, without any `default` and no exhaustiveness check at all, returns `undefined` and corrupts a fee calculation downstream).
