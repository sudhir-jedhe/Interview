```typescript
interface Order {
  id: string;
  shippingAddress?: {
    city: string;
  };
}

function printCity(order: Order) {
  console.log(order.shippingAddress!.city.toUpperCase());
}

printCity({ id: "o1" });
```

Does this compile? What happens when `printCity` runs?

**Answer:** It compiles cleanly (no errors), but calling `printCity({ id: "o1" })` throws at runtime: `TypeError: Cannot read properties of undefined (reading 'city')`.

**Why:** `shippingAddress` is optional (`shippingAddress?:`), so its type is `{ city: string } | undefined`. The `!` after `order.shippingAddress` tells TypeScript to treat it as definitely present, deleting `undefined` from the type — but `!` has no runtime behavior, it's purely a compile-time instruction to stop complaining. The object passed in, `{ id: "o1" }`, genuinely has no `shippingAddress`, so at runtime `order.shippingAddress` really is `undefined`, and `undefined.city` throws immediately. The `!` gave a false guarantee that the compiler then trusted blindly. A safer version would check explicitly: `if (!order.shippingAddress) return;` before accessing `.city`, or use `order.shippingAddress?.city.toUpperCase() ?? "Unknown"`.
