```typescript
interface User {
  id: string;
  name: string;
}

const raw: unknown = { id: "u1" }; // missing `name`!

const user = raw as unknown as User;

console.log(user.name.toUpperCase());
```

Does this compile, and what happens when it runs?

**Answer:** It compiles with zero errors, but it throws at runtime: `TypeError: Cannot read properties of undefined (reading 'toUpperCase')`.

**Why:** `raw as unknown as User` is a double assertion — first widening to `unknown` (which is assignable to/from anything), then narrowing to `User`. This bypasses TypeScript's normal single-step assertion compatibility check entirely, so the compiler never verifies that `raw`'s actual shape has a `name` property. At runtime, `user` is really just `{ id: "u1" }`, so `user.name` is `undefined`, and calling `.toUpperCase()` on `undefined` throws. This is the textbook "as-abuse" bug: the type system reports full confidence (`user.name` is typed as `string`) while the actual data disagrees, and nothing catches the gap until production. See `problems/01-as-abuse-bug.md` for the safe alternative using a type guard or validation library.
