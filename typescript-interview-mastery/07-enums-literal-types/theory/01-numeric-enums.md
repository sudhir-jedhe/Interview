# Numeric Enums

A numeric `enum` declares a named set of related constants, each backed by a number. By default, TypeScript auto-increments values starting from `0`, and it generates an actual JavaScript object at runtime — enums are one of the few TypeScript features that aren't purely type-level and produce real, inspectable output.

```typescript
enum OrderStatus {
  Pending,   // 0
  Shipped,   // 1
  Delivered, // 2
}

const status: OrderStatus = OrderStatus.Shipped;
console.log(status); // 1
```

You can override the starting value or any individual member, and auto-increment continues from the last explicit value.

```typescript
enum HttpStatusGroup {
  Success = 200,
  ClientError = 400,
  ServerError = 500,
}

enum Weekday {
  Monday = 1,
  Tuesday,   // 2
  Wednesday, // 3
}
```

## Reverse mapping

Numeric enums are special in that TypeScript generates a bidirectional lookup — you can go from name to value (`OrderStatus.Shipped` → `1`) and also from value to name (`OrderStatus[1]` → `"Shipped"`), because the compiled object has entries in both directions.

```typescript
console.log(OrderStatus.Shipped);  // 1
console.log(OrderStatus[1]);        // "Shipped"
```

The compiled JavaScript for `OrderStatus` looks roughly like this:

```javascript
var OrderStatus;
(function (OrderStatus) {
  OrderStatus[OrderStatus["Pending"] = 0] = "Pending";
  OrderStatus[OrderStatus["Shipped"] = 1] = "Shipped";
  OrderStatus[OrderStatus["Delivered"] = 2] = "Delivered";
})(OrderStatus || (OrderStatus = {}));
```

Every member is assigned twice — once as `name → number`, once as `number → name` — which is why numeric enums roughly double their footprint in the compiled bundle compared to what you'd expect from the source.

## The reverse-mapping bug

Reverse mapping is also where numeric enums become dangerous: because the compiled object has numeric keys pointing back to names, TypeScript's numeric enum *type* itself accepts any `number` without complaint, not just the declared members.

```typescript
function markStatus(status: OrderStatus): void {
  console.log(OrderStatus[status]);
}

markStatus(OrderStatus.Delivered); // fine — logs "Delivered"
markStatus(999);                    // ALSO compiles — no such member, logs undefined
```

`OrderStatus` as a type is really just `number` in disguise for assignment-checking purposes, so any arbitrary `number` is assignable to it — there's no way for TypeScript to statically confirm you passed one of the three declared members. This surprises almost everyone the first time they hit it, and it's the primary reason numeric enums have fallen out of favor for anything beyond legacy code or genuinely numeric domains (bit flags, HTTP status codes grouped numerically).

## Why this matters in interviews

Interviewers frequently ask "what's wrong with numeric enums" specifically to test whether you know about the reverse-mapping bug above — that a numeric enum type doesn't actually restrict you to its declared members the way you'd intuitively expect from something called an "enum." This single gap is the main argument for string enums or literal unions, covered in the next two files.
