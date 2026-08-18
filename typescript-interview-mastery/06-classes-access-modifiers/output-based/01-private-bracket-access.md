```typescript
class Vault {
  private secret = "12345";
}

const v = new Vault();
console.log(v["secret"]);
```

Does this compile, and what does it print?

**Answer:** It compiles and prints `"12345"`.

**Why:** TypeScript's `private` only blocks dot-notation access (`v.secret`) from outside the class — it does not block bracket-notation access with a string literal key. This is a known, deliberate gap in the type checker's enforcement, not a bug: since `private` is erased at runtime and `v` is just a plain object under the hood, `v["secret"]` type-checks and reads the real property. This is exactly why `private` should be understood as "compile-time discipline for your own team," not a real access-control mechanism — if you need runtime-enforced privacy, use JavaScript's `#secret` field syntax instead, which rejects this kind of access entirely, at both compile time and runtime.
