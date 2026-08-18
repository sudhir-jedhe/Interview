# What type does TS infer here?

```typescript
let status = "pending";
const readonlyStatus = "pending";

function setStatus(s: "pending" | "shipped" | "delivered") {
  // ...
}

setStatus(status);
setStatus(readonlyStatus);
```

**Answer:** The call `setStatus(status)` fails to compile with `Argument of type 'string' is not assignable to parameter of type '"pending" | "shipped" | "delivered"'`. The call `setStatus(readonlyStatus)` compiles fine.

**Why:** `let status = "pending"` infers the **widened** type `string`, because `let` bindings are mutable and TypeScript assumes you might reassign it to any other string later, so it generalizes the literal `"pending"` to the general `string` type. `const readonlyStatus = "pending"`, however, can never be reassigned, so TypeScript keeps the **narrow literal type** `"pending"`, which is assignable to the union `"pending" | "shipped" | "delivered"`. This is called **literal widening**, and it's why `const` is preferred whenever you want TypeScript to infer the most specific type possible — switching `status` from `let` to `const` (or adding an explicit annotation `let status: "pending" | "shipped" | "delivered" = "pending"`) fixes the error.
