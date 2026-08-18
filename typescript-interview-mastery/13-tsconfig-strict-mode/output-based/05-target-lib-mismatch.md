```jsonc
// tsconfig.json
{
  "compilerOptions": {
    "target": "ES5"
    // no explicit "lib" set
  }
}
```
```typescript
async function loadData(): Promise<string[]> {
  const res = await fetch("/data.json");
  return res.json();
}
```

Does this compile?

**Answer:** No — it fails with errors like `Cannot find name 'Promise'` and `Cannot find name 'fetch'` (exact wording varies by TS version).

**Why:** When `target` is set without an explicit `lib`, TypeScript infers a default `lib` matching that target — `target: "ES5"` implies only ES5-era global type declarations are available, which predates `Promise`, `fetch`, and most modern built-ins. The `async function` *syntax* itself is fine (TypeScript downlevels it into ES5-compatible output), but the *types* `Promise` and `fetch` simply aren't declared anywhere the checker can see, because `lib.es5.d.ts` doesn't define them and no `DOM`/`ES2015`+ lib was pulled in. The fix is to set `lib` explicitly regardless of `target`: `"lib": ["ES2020", "DOM"]` makes `Promise`, `fetch`, and other modern globals available to the type checker even while `target` stays low for broader output compatibility.
