# Problem 1: Find 3 Bugs `strict: true` Would Catch

## The setup

Here's a small order-processing module, compiled with `strict: false`:

```typescript
// tsconfig: strict: false
interface Order {
  id: string;
  discountCode?: string;
  items: { sku: string; price: number }[];
}

const discountTable = {
  SAVE10: 0.1,
  SAVE20: 0.2,
};

class OrderProcessor {
  total: number;

  constructor(private order: Order) {}

  calculateTotal() {
    const subtotal = this.order.items.reduce((sum, i) => sum + i.price, 0);
    const discountRate = discountTable[this.order.discountCode];
    this.total = subtotal * (1 - discountRate);
    return this.total;
  }

  logSummary(formatter) {
    console.log(formatter(this.total));
  }
}

const processor = new OrderProcessor({
  id: "o1",
  items: [{ sku: "A1", price: 100 }],
});
console.log(processor.calculateTotal());
```

## Your task

1. Enable `strict: true` (mentally or in a real project) and identify the 3 real bugs it would surface as compile errors.
2. Fix each one.

## Reference solution

**Bug 1 — `strictPropertyInitialization`:** `total: number;` is declared but never assigned in the constructor. Under `strict: true`: `Property 'total' has no initializer and is not definitely assigned in the constructor.` This is a real bug: if `logSummary` is ever called before `calculateTotal`, `this.total` is `undefined`, contradicting its declared type `number`.

```typescript
class OrderProcessor {
  total = 0; // fix: give it a real default
  // ...
}
```

**Bug 2 — `strictNullChecks` on the discount lookup:** `this.order.discountCode` is `string | undefined` (it's optional), so `discountTable[this.order.discountCode]` is indexing an object with a key that might be `undefined`. Under `strict: true`, this is flagged (`Type 'undefined' cannot be used as an index type` or similar, depending on `noImplicitAny`/index signature settings) — and it's a real bug: when `discountCode` is absent, `discountTable[undefined]` is `undefined` at runtime, and `subtotal * (1 - undefined)` evaluates to `NaN`, silently corrupting every order total that has no discount code (i.e., most orders).

```typescript
calculateTotal() {
  const subtotal = this.order.items.reduce((sum, i) => sum + i.price, 0);
  const discountRate = this.order.discountCode
    ? discountTable[this.order.discountCode as keyof typeof discountTable] ?? 0
    : 0;
  this.total = subtotal * (1 - discountRate);
  return this.total;
}
```

**Bug 3 — `noImplicitAny` on `logSummary`'s parameter:** `formatter` has no type annotation, so under `strict: false` it's silently `any`, meaning `formatter(this.total)` compiles no matter what's passed — including something that isn't callable at all, or a function with an incompatible signature. Under `strict: true`: `Parameter 'formatter' implicitly has an 'any' type.` This is a real bug risk: a caller could pass a non-function or a formatter expecting a `string` instead of `number`, and it would only fail at runtime.

```typescript
logSummary(formatter: (total: number) => string) {
  console.log(formatter(this.total));
}
```

## Takeaway

None of these three bugs threw a compile error under `strict: false` — all three were silent, and two of them (`total` uninitialized, `NaN` discount) are exactly the kind of bug that surfaces intermittently in production, dependent on call order or missing optional data, making them disproportionately expensive to debug after the fact compared to fixing them at compile time.
