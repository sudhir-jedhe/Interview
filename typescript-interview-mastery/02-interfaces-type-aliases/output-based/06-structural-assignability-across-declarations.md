# Does this compile?

```typescript
interface Point {
  x: number;
  y: number;
}

type Vector = {
  x: number;
  y: number;
};

function addPoints(a: Point, b: Point): Point {
  return { x: a.x + b.x, y: a.y + b.y };
}

const v: Vector = { x: 1, y: 2 };
const result = addPoints(v, { x: 3, y: 4 });
```

**Answer:** Yes, this compiles without any error, and `result` has type `Point`.

**Why:** `Point` (an interface) and `Vector` (a type alias) are structurally identical shapes — both require exactly `{ x: number; y: number }`. TypeScript's structural type system doesn't care that one was declared with `interface` and the other with `type`; it only compares the actual member shape. Since `v`'s shape satisfies everything `addPoints`'s parameter `a: Point` requires, passing a `Vector`-typed value where a `Point` is expected is completely valid — there's no nominal "is declared as a Point" requirement to satisfy, unlike in nominally-typed languages like Java or C#. This reinforces a key theme across this topic: whether you reach for `interface` or `type` almost never affects whether two values are considered compatible — only their declaration-time behaviors (merging, extension conflict checking) differ, not their runtime/structural compatibility rules.
