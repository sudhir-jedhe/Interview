```typescript
function addToList<T>(list: T[], item: T): void {
  list.push(item);
}

const numbers: number[] = [1, 2, 3];
const wider: (number | string)[] = numbers;

addToList(wider, "surprise");

console.log(numbers);
```

What does this print, and does it compile cleanly?

**Answer:** It compiles without error, and it prints `[1, 2, 3, "surprise"]` at runtime — a `string` has silently ended up inside an array that was declared `number[]`.

**Why:** `wider` and `numbers` reference the *same array object* — assigning `numbers` to `wider: (number | string)[]` is allowed because TypeScript arrays are covariant (a narrower array type is treated as assignable to a wider one, for ergonomic reasons, even though it isn't fully sound). `addToList<T>` then infers `T` from `wider`'s declared type, `number | string`, so pushing a `string` into it type-checks perfectly from `addToList`'s point of view. But `wider` is not a separate array — it's an alias to the same underlying array `numbers` points to, so the mutation is visible through `numbers` too, and now `numbers: number[]` contains a string at runtime despite TypeScript never flagging it. This is a well-known unsoundness in structurally-typed, mutable-array languages, and it's why many teams prefer `ReadonlyArray<T>` for anything passed into a function that shouldn't mutate it, and treat wider-than-declared array assignments (or spreads into wider unions) with suspicion in code review.
