# String Enums

A string enum requires every member to have an explicit string literal value — there's no auto-increment, since there's no sensible default sequence for strings. This small restriction removes an entire category of bugs that numeric enums have.

```typescript
enum OrderStatus {
  Pending = "PENDING",
  Shipped = "SHIPPED",
  Delivered = "DELIVERED",
}

const status: OrderStatus = OrderStatus.Shipped;
console.log(status); // "SHIPPED"
```

## No reverse mapping

Unlike numeric enums, string enums don't generate a value-to-name lookup — the compiled object only maps name to value, in one direction.

```typescript
console.log(OrderStatus.Shipped);       // "SHIPPED"
console.log(OrderStatus["SHIPPED"]);    // undefined — no reverse entry exists
```

The compiled JavaScript is correspondingly simpler and smaller:

```javascript
var OrderStatus;
(function (OrderStatus) {
  OrderStatus["Pending"] = "PENDING";
  OrderStatus["Shipped"] = "SHIPPED";
  OrderStatus["Delivered"] = "DELIVERED";
})(OrderStatus || (OrderStatus = {}));
```

## More predictable type-checking

Because there's no numeric backing, a string enum type genuinely restricts you to its declared members — you can't pass an arbitrary string where a string enum is expected, unlike the numeric-enum reverse-mapping hole from the previous file.

```typescript
function markStatus(status: OrderStatus): void {
  console.log(status);
}

markStatus(OrderStatus.Delivered); // ok
markStatus("DELIVERED");            // Error: string is not assignable to OrderStatus
```

This last line is the key improvement: TypeScript refuses a bare string literal even when it matches a member's runtime value exactly, because the *nominal* enum type (`OrderStatus`) and a structurally-identical `string` are treated as different types. You must go through `OrderStatus.Delivered` (or an explicit cast) to satisfy the parameter, which closes the "any number is secretly valid" hole numeric enums have.

## Debuggability

String enum values are also self-descriptive at runtime and in logs/serialized payloads — seeing `"SHIPPED"` in a network request or a debugger is immediately meaningful, whereas a numeric enum's `1` requires cross-referencing the enum declaration to understand. This matters more than it sounds: numeric enum values are also fragile under reordering — inserting a new member in the middle of a numeric enum silently reassigns every subsequent member's value, which can break serialized data (a `2` stored in a database yesterday might mean something different after a code change today), while string enum values are stable regardless of declaration order since they're explicit literals, not positional.

## Why this matters in interviews

Interviewers expect you to be able to articulate concretely why string enums are safer than numeric ones: no reverse mapping means no unintended dual-direction lookup object, and no implicit numeric backing means the type actually rejects invalid values instead of silently accepting any number. The remaining question — whether to reach for a string enum at all versus a plain literal union — is covered in the next file.
