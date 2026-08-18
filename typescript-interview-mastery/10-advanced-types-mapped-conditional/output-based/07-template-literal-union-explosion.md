```typescript
type Size = "xs" | "sm" | "md" | "lg" | "xl";
type Color = "red" | "blue" | "green" | "gray" | "black";
type Weight = "light" | "regular" | "bold";

type UtilityClass = `text-${Size}-${Color}-${Weight}`;

function applyClass(cls: UtilityClass): void {}
```

**Answer:** This compiles, but `UtilityClass` expands to **75 distinct string-literal members** (5 sizes × 5 colors × 3 weights). It's not an error, but it's a compiler-performance and DX trap: hovering `UtilityClass` in an editor shows all 75 literals spelled out, autocomplete has to enumerate them, and adding a couple more members to any one of the three input unions multiplies the total combinatorially (e.g., 8 sizes × 8 colors × 4 weights = 256).

**Why:** Template literal types compute the full cross-product of every interpolated union, eagerly, as a closed set of literal types — there's no lazy or pattern-based representation for "any combination of these three unions." This is fine at small scale (a handful of members each) but degrades badly past a few hundred combinations: TypeScript's compiler has documented practical limits here, and very large template literal unions can noticeably slow down type-checking or even hit internal limits. The practical fix is usually to stop trying to enumerate every valid string as a literal union and instead validate the structure with a more targeted pattern (e.g., a template literal with `${string}` for the less-constrained segments) or validate at runtime instead of the type level once the combinatorics get large.
