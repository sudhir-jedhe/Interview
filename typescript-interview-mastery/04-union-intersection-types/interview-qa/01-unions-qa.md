# Interview Q&A: Union Types

**Q: Why can't you access a property on a union-typed value unless it exists on every member?**
A: Because without narrowing, TypeScript doesn't know which specific member of the union the value actually is at runtime — it could be any of them. If it allowed accessing a property that only exists on some members, the access would produce `undefined` (or a runtime error) whenever the value happened to be a different member, silently defeating type safety. Restricting access to the common surface forces you to prove which branch you have (via `typeof`, `instanceof`, `in`, or a discriminant check) before touching anything member-specific.

**Q: What are the main ways to narrow a union type in TypeScript?**
A: `typeof` for primitive unions (`string | number`), `instanceof` for class-instance unions, the `in` operator for checking property existence on object-shape unions, `Array.isArray` for array-vs-non-array unions, direct equality/discriminant checks (`value.status === "success"`) for discriminated unions, and custom user-defined type guard functions (`function isX(value): value is X`) for more complex narrowing logic that a simple `typeof`/`instanceof` check can't express.

**Q: What makes a union a "discriminated union," and why does it matter?**
A: A discriminated union is a union of object shapes that all share a common property (the discriminant) whose type is a unique literal for each member — e.g. every member has a `status` field, each with a different literal value. This matters because it lets TypeScript narrow the *entire* object automatically from a single check on the discriminant (typically in a `switch`), rather than requiring separate structural checks (`"data" in value`) for every property you want to access, and it enables exhaustiveness checking via `never` when combined with a `default` branch.

**Q: What's the risk of using a "bag of optional fields" instead of a proper discriminated union to model mutually exclusive states?**
A: The type system can no longer enforce that fields are only accessed in the states where they're actually meaningful — nothing stops code from reading a `data` field when a `status` field says `"error"`, since an optional field's presence isn't tied to any other field's value in the type system. You also lose exhaustiveness checking entirely, since there's no finite discriminant value set to exhaust — just a pile of loosely related optional fields with no compiler-enforced correlation between them.
