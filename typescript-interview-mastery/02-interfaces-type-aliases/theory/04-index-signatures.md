# Index Signatures

An index signature lets you describe an object whose property *names* aren't known ahead of time but whose property *values* all share a common type — a dictionary/map-like shape. This is essential for modeling dynamic data like tag counts, feature flag maps, or lookup tables keyed by ID.

## Basic syntax

```typescript
interface WordCounts {
  [word: string]: number;
}

const counts: WordCounts = {
  the: 42,
  quick: 3,
  fox: 1,
};

counts.jumps = 1;        // any string key is allowed
console.log(counts.the); // 42
console.log(counts.missingWord); // type `number`, but actually `undefined` at runtime!
```

The `[word: string]: number` syntax says: "any property accessed with a string key has type `number`." The identifier `word` is just a label for readability in tooling — it has no semantic effect, and any name can be used.

## The limitation: arbitrary key access is unchecked

This is the sharpest edge of index signatures and a favorite interview trap: TypeScript will let you read *any* string-keyed property, even ones that were never actually set, and it will claim the result is `number` (or whatever the value type is) — not `number | undefined`. This is a soundness gap in the type system by default.

```typescript
function getCount(word: string, counts: WordCounts): number {
  return counts[word]; // TS says this is `number`
}

const result = getCount("nonexistent", counts); // runtime value: undefined
console.log(result.toFixed(2)); // runtime crash: Cannot read properties of undefined
```

The fix is enabling `noUncheckedIndexedAccess` in `tsconfig.json` (not part of `strict` by default, but highly recommended alongside it), which makes index signature reads return `T | undefined`, forcing you to check before use:

```typescript
// With noUncheckedIndexedAccess: true
function getCountSafe(word: string, counts: WordCounts): number {
  const value = counts[word]; // now correctly typed `number | undefined`
  return value ?? 0;
}
```

## Combining known and dynamic keys

You can mix specific known properties with an index signature, as long as every known property's type is compatible with the index signature's value type:

```typescript
interface ApiHeaders {
  "content-type": string;
  [header: string]: string; // all other headers are also strings
}

const headers: ApiHeaders = {
  "content-type": "application/json",
  "x-request-id": "abc-123", // allowed — matches the index signature
};
```

If a known property's type were incompatible with the index signature (e.g. `"content-type": number` alongside `[header: string]: string`), TypeScript raises a compile error, since every access through the index signature must remain type-safe.

## Record<K, V> as the more common alternative

For most dictionary use cases, the built-in utility type `Record<K, V>` is more concise and equally expressive:

```typescript
type FeatureFlags = Record<string, boolean>;

const flags: FeatureFlags = {
  newCheckout: true,
  betaDashboard: false,
};
```

`Record` also supports a union of string literals as the key type, producing an object type that *requires* every literal to be present (unlike a plain index signature) — e.g. `Record<"small" | "medium" | "large", number>` requires exactly those three keys, which an index signature cannot express. Reach for index signatures when keys are genuinely unbounded strings; reach for `Record` with a literal union when the key set is small and known ahead of time.
