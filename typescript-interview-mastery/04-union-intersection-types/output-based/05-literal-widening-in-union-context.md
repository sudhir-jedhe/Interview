# Does this compile?

```typescript
type Direction = "up" | "down" | "left" | "right";

function move(direction: Direction): void {
  console.log(`Moving ${direction}`);
}

function getDefaultDirection() {
  return "up";
}

move(getDefaultDirection());
```

**Answer:** No. TypeScript reports: `Argument of type 'string' is not assignable to parameter of type 'Direction'.`

**Why:** `getDefaultDirection` has no explicit return type annotation, so TypeScript infers it from the `return "up";` statement — and because this is a function return (conceptually similar to a `let`-bound value, not a `const` literal), the literal `"up"` **widens** to the general type `string`, not the narrow literal `"up"`. `move` requires a `Direction` (a union of specific literals), and a general `string` isn't assignable to a narrower literal union — the reverse direction (`Direction` to `string`) would be fine, but not this one. Two fixes: either annotate the function's return type explicitly (`function getDefaultDirection(): Direction { return "up"; }`), or use a `const` assertion at the return site (`return "up" as const;`), both of which preserve the literal `"up"` instead of letting it widen. This mirrors the exact same literal-widening behavior covered for variables in `01-basic-types/output-based/01-array-literal-widening.md`, applied here to function return type inference feeding into a union-typed parameter.
