# Does this compile?

```typescript
function makePair(a: number, b: string) {
  return [a, b];
}

const pair: [number, string] = makePair(1, "one");
```

**Answer:** No, this does **not** compile. TypeScript reports: `Type '(number | string)[]' is not assignable to type '[number, string]'. Target requires 2 element(s) but source may have fewer.`

**Why:** Even though `makePair` is called with a `number` and a `string`, TypeScript infers its return type as `(number | string)[]` — a plain array — not the tuple `[number, string]`. Function return type inference does not automatically produce tuple types from array literals unless you give it a hint. Two fixes: (1) explicitly annotate the return type — `function makePair(a: number, b: string): [number, string] { return [a, b]; }` — or (2) use a `const` assertion on the returned literal: `return [a, b] as const;` (which infers `readonly [number, string]`). Without one of these, TypeScript defaults array-literal returns to the more general array type, because it can't know you intended fixed positions and length.
