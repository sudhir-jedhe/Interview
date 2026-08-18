# What does TS infer inside each branch?

```typescript
interface BasicUser {
  id: number;
  role?: "admin";
}

function checkAccess(user: BasicUser): string {
  if ("role" in user) {
    return `Has a role property: ${user.role}`;
  }
  return "No role property present";
}

console.log(checkAccess({ id: 1 }));
console.log(checkAccess({ id: 2, role: "admin" }));
console.log(checkAccess({ id: 3, role: undefined }));
```

**Answer:** This compiles fine, and all three calls run without error. But the output for the third call is `"Has a role property: undefined"`, not `"No role property present"` — a subtle mismatch between what a reader might expect from `"role" in user` and what actually happens.

**Why:** The `in` operator checks whether a property **key** exists on the object, regardless of whether its value is `undefined`. Since `role` is an *optional* property (`role?: "admin"`), TypeScript's type for `role?: "admin"` genuinely permits the key to be present with an explicit `undefined` value (as covered in `02-interfaces-type-aliases/theory/03-optional-and-readonly-properties.md`) — `{ id: 3, role: undefined }` is a valid `BasicUser`. `"role" in user` only asks "does this key exist," and it does (with value `undefined`), so the `if` branch runs, printing `undefined` for `user.role`. If the intent was "does the user have an actual admin role value," the correct check is `user.role !== undefined` (or `user.role === "admin"`), not `"role" in user` — this is a common real-world gotcha when optional properties and the `in` operator are combined without considering that "key present" and "value present" are different questions.
