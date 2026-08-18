# Why Literal-Type Unions Are Often Preferred Over Enums

A literal union type (`"pending" | "shipped" | "delivered"`) and a string enum (`enum OrderStatus { Pending = "PENDING", ... }`) can model the exact same set of allowed values, but they behave differently enough at both the type level and the runtime level that modern TypeScript guidance (including from the TypeScript team itself) generally favors literal unions for new code.

```typescript
// Enum version
enum OrderStatus {
  Pending = "PENDING",
  Shipped = "SHIPPED",
  Delivered = "DELIVERED",
}
function handle1(status: OrderStatus) {}
handle1(OrderStatus.Pending);   // must import/reference the enum
handle1("PENDING");              // Error — even though it matches at runtime

// Literal union version
type OrderStatus2 = "pending" | "shipped" | "delivered";
function handle2(status: OrderStatus2) {}
handle2("pending"); // ok — no import needed, just the string
```

## Smaller runtime footprint

A literal union type is purely a compile-time construct — it produces zero runtime code, no object, nothing shipped in the bundle. A (non-const) enum generates a real object with all the machinery discussed in the earlier files (and doubled entries for numeric enums specifically). For a value used in dozens of files, this is a measurable, if usually small, bundle-size and allocation cost that a literal union simply doesn't have.

## Easier to combine with other unions

Literal types compose naturally with the rest of TypeScript's union/intersection machinery, since they're just ordinary types.

```typescript
type OrderStatus = "pending" | "shipped" | "delivered";
type CancelledStatus = "cancelled" | "refunded";
type AnyStatus = OrderStatus | CancelledStatus; // trivial union-of-unions

type StatusWithMetadata = { status: OrderStatus; updatedAt: string };
```

Combining two enums this way, or extracting a subset of an enum's members into a new type, is comparatively awkward — enums aren't designed to be composed with `|`/`&` the way plain literal types are, and extracting "just these three members of a five-member enum" as a distinct type has no clean built-in syntax.

## No reverse-mapping surprise, no import friction

Literal unions have no runtime object, so there's no reverse-mapping bug category to worry about at all (that issue is specific to numeric enums). They also don't require importing an enum symbol just to reference a value — any code that already has the string `"pending"` (from an API response, a database column, a URL parameter) is immediately compatible with `OrderStatus2` with zero conversion, whereas the same raw string is rejected by the enum type and must be run through `as OrderStatus` or compared against `OrderStatus.Pending.toString()` first.

## When enums still make sense

Enums aren't obsolete — they're a reasonable choice when you specifically want a *namespaced* set of related constants with IDE-discoverable dot-access (`OrderStatus.` autocompletes all members in a way a bare union doesn't always surface as clearly), or when working in a codebase/framework that already leans on enums idiomatically (many backend frameworks and ORMs do). The practical default for most new frontend/application code, though, is a literal union backed by an `as const` array or object when you also need the values at runtime (see the previous file).

## Why this matters in interviews

"When would you use a literal union instead of an enum" is a design-judgment question, not a syntax question — the strong answer names the three concrete advantages above (bundle size, composability, no reverse-mapping/import friction) rather than a vague "unions are more modern," and also acknowledges the legitimate cases where an enum's namespacing is genuinely useful.
