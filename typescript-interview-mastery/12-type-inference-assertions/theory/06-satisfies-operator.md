# The `satisfies` Operator

`satisfies` (introduced in TypeScript 4.9) validates that an expression is compatible with a given type, *without* changing the inferred type of that expression. This solves a long-standing tension between type annotations and type assertions: annotations widen and lose literal precision, while assertions skip validation entirely. `satisfies` gives you validation *and* precision at the same time.

## The problem it solves

```typescript
interface Config {
  mode: "production" | "development";
  port: number;
}

// Option A: annotation — validates, but widens
const configA: Config = { mode: "production", port: 3000 };
// configA.mode is typed as "production" | "development" (from Config),
// not narrowed to "production" specifically.

// Option B: no annotation — keeps literal types, but no validation
const configB = { mode: "production", port: 3000 };
// if you typo `mode: "prod"`, TS won't catch it against Config at all
// because nothing is checking configB against Config.
```

With an annotation, `configA.mode` reports as `"production" | "development"` even though we know it's literally `"production"` — useful information is thrown away. With no annotation, there's no validation against `Config` whatsoever.

## The `satisfies` fix

```typescript
const configC = {
  mode: "production",
  port: 3000,
} satisfies Config;

// configC.mode is typed as "production" (the literal!), not the union
// AND TypeScript verified the object is assignable to Config
```

`satisfies` checks the expression against `Config` — the same validation you'd get from an annotation, catching typos and missing properties — but then discards the *declared* type and keeps whatever TypeScript would have inferred anyway (narrowed by `as const`-like literal inference where applicable). You get the error-checking benefit without the widening cost.

## Catching real mistakes

```typescript
const badConfig = {
  mode: "prod", // typo!
  port: 3000,
} satisfies Config;
// Error: Type '"prod"' is not assignable to type '"production" | "development"'
```

Compare to a plain assertion, which would happily accept this:

```typescript
const sneaky = { mode: "prod", port: 3000 } as Config; // no error, silently wrong!
```

`as` performs a much looser compatibility check and, critically, doesn't verify every property matches — it's an override, not a validation. `satisfies` is a validation, not an override.

## `satisfies` with records and maps

A common use case is validating a lookup object where each value must conform to a shape, while keeping each key's specific value type available for downstream inference:

```typescript
type ColorName = "red" | "green" | "blue";

const themeColors = {
  red: { hex: "#ff0000", contrast: "white" },
  green: { hex: "#00ff00", contrast: "black" },
  blue: { hex: "#0000ff", contrast: "white" },
} satisfies Record<ColorName, { hex: string; contrast: "black" | "white" }>;

// themeColors.red is still narrowed to { hex: "#ff0000"; contrast: "white" }
// and TS enforces that all three keys of ColorName are present
themeColors.red.hex.toUpperCase(); // fully typed, no widening to `string`
```

If you'd used a plain annotation (`: Record<ColorName, ...>`) instead, `themeColors.red` would only be known to have type `{ hex: string; contrast: "black" | "white" }` — you'd lose the fact that `hex` is specifically `"#ff0000"`.

## Interview angle

`satisfies` is a newer feature and a favorite interview topic precisely because it's genuinely useful and shows whether a candidate keeps up with the language. The key talking point: `satisfies` separates *validation* (does this match the shape I expect?) from *the type you get to use afterward* (the narrowest type TS can infer), whereas annotations couple those two together and assertions skip validation altogether.
