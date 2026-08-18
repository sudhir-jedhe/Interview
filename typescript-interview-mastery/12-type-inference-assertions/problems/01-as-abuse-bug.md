# Problem 1: Find and Fix the `as`-Abuse Bug

## The setup

A junior engineer wrote this function to normalize a "loose" payment method object coming from an older part of the codebase into a strict `PaymentMethod` shape:

```typescript
interface PaymentMethod {
  type: "card" | "paypal";
  last4: string; // only relevant for cards, but always required by this interface
}

interface LegacyPayment {
  kind: string;
  cardLast4?: string;
}

function normalize(legacy: LegacyPayment): PaymentMethod {
  return legacy as unknown as PaymentMethod;
}

function receipt(pm: PaymentMethod): string {
  return `Paid with ${pm.type} ending in ${pm.last4}`;
}

const legacyPaypalPayment: LegacyPayment = { kind: "paypal" };
console.log(receipt(normalize(legacyPaypalPayment)));
```

## Your task

1. Explain, precisely, why this compiles without any TypeScript error but crashes (or silently prints wrong data) at runtime.
2. Rewrite `normalize` so the compiler would have caught the bug, or so it fails loudly and clearly if the input is genuinely unusable, instead of producing bad data silently.

## Reference solution

**Why it's broken:** `legacy as unknown as PaymentMethod` is a double assertion that bypasses TypeScript's structural compatibility check entirely. `legacy` is `{ kind: "paypal" }` — it has neither a `type` field with the right literal values (`"card" | "paypal"`) nor a `last4` field. The compiler never verifies any of this because routing through `unknown` disables the check. At runtime, `normalize(legacyPaypalPayment)` returns an object shaped like `{ kind: "paypal" }`, and `receipt` reads `pm.type` (→ `undefined`) and `pm.last4` (→ `undefined`), producing `"Paid with undefined ending in undefined"` — a silent data-integrity bug, arguably worse than a crash because nothing alerts anyone.

**Fixed version — validate and convert explicitly instead of asserting:**

```typescript
interface PaymentMethod {
  type: "card" | "paypal";
  last4: string;
}

interface LegacyPayment {
  kind: string;
  cardLast4?: string;
}

function normalize(legacy: LegacyPayment): PaymentMethod {
  if (legacy.kind === "card") {
    if (!legacy.cardLast4) {
      throw new Error("Legacy card payment missing cardLast4");
    }
    return { type: "card", last4: legacy.cardLast4 };
  }

  if (legacy.kind === "paypal") {
    // PayPal payments have no card digits; model that explicitly
    // instead of forcing a `last4` field that doesn't apply.
    return { type: "paypal", last4: "N/A" };
  }

  throw new Error(`Unrecognized legacy payment kind: ${legacy.kind}`);
}
```

This version builds a genuine `PaymentMethod` object field-by-field with real runtime checks (`if (!legacy.cardLast4) throw ...`), so there's no gap between what the type claims and what the data actually contains — every field is either explicitly provided or the function throws a clear, traceable error instead of silently fabricating `undefined` values. Note this also surfaces a modeling problem the original code hid: `PaymentMethod.last4` being required for *all* payment types (including PayPal, which has no card number) was itself questionable — a more accurate fix would make `PaymentMethod` a discriminated union (`{ type: "card"; last4: string } | { type: "paypal" }`), removing the need for the `"N/A"` placeholder entirely.
