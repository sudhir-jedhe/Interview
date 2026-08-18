# Literal Type Unions as a Lightweight Enum Alternative

TypeScript has a dedicated `enum` construct, but a union of string literal types is often the preferred way to model a small, fixed set of named values — it's simpler, has zero runtime footprint, and integrates more naturally with plain JavaScript objects and JSON.

## Basic literal union

```typescript
type OrderStatus = "pending" | "processing" | "shipped" | "delivered" | "cancelled";

function canCancel(status: OrderStatus): boolean {
  return status === "pending" || status === "processing";
}

const status: OrderStatus = "shipped";
// const invalid: OrderStatus = "returned"; // Error: not assignable to OrderStatus
```

Every value is checked exactly like a plain string at runtime (`"shipped" === "shipped"`), but the type system restricts which strings are valid, catching typos (`"shiped"`) and invalid states at compile time.

## Why prefer this over `enum` in many codebases

A numeric `enum` (`enum OrderStatus { Pending, Processing, Shipped }`) generates real runtime code — an object mapping names to numbers and numbers back to names — which adds bundle size and a layer of indirection between your type and the actual value flowing through the system. A literal union has **zero runtime representation** — it's purely a compile-time construct, erased entirely after type checking, and the actual values are just plain strings, which serialize cleanly to JSON, log readably, and match naturally with data coming from APIs (which typically send `"shipped"`, not an enum's underlying number).

```typescript
// With a string enum, values ARE still real strings, closer to a literal union:
enum OrderStatusEnum {
  Pending = "pending",
  Shipped = "shipped",
}

// But usage requires qualifying with the enum name, and a plain string
// from an API response ("shipped") isn't directly assignable to OrderStatusEnum
// without a cast or a values-lookup, unlike a literal union which matches directly.
```

## Combining a literal union with an object for named access

If you want enum-like named constants (`Status.Pending` instead of the raw string `"pending"`) without the runtime overhead of `enum`, a common pattern combines a `const` object with `as const` and `typeof`/indexed access to derive the union type from the object's values:

```typescript
const OrderStatus = {
  Pending: "pending",
  Processing: "processing",
  Shipped: "shipped",
  Delivered: "delivered",
  Cancelled: "cancelled",
} as const;

type OrderStatusValue = (typeof OrderStatus)[keyof typeof OrderStatus];
// equivalent to: "pending" | "processing" | "shipped" | "delivered" | "cancelled"

function markShipped(status: OrderStatusValue): OrderStatusValue {
  return OrderStatus.Shipped;
}

console.log(OrderStatus.Pending); // "pending" — real, readable value, IDE-discoverable
```

This gives you both worlds: `OrderStatus.Shipped` reads clearly and is discoverable via autocomplete like an enum member, while `OrderStatusValue` is a plain literal union usable anywhere a union type is expected (function parameters, discriminants in discriminated unions, etc.), with the underlying values being exactly the plain strings an API would send.

## When plain literal unions are the better default

For most day-to-day domain modeling — status fields, mode flags, category tags — a bare literal union (`type Status = "a" | "b" | "c"`) is sufficient and simplest. Reach for the `const`-object-plus-derived-union pattern above specifically when you want named, autocomplete-friendly access to the individual values across a codebase (reducing the risk of a typo'd string literal slipping past review), and reach for a genuine `enum` mainly when working in a codebase that already establishes that convention, or when you specifically need enum-only features like reverse numeric mapping.
