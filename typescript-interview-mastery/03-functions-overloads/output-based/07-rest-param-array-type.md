# What's the error here?

```typescript
function tagResource(id: string, ...tags: string[]): void {
  console.log(id, tags);
}

const extraTags: (string | number)[] = ["featured", 5];

tagResource("res-1", ...extraTags);
```

**Answer:** Compile error: `Argument of type '(string | number)[]' is not assignable to parameter of type 'string[]'.` (more precisely, TypeScript reports that spreading `extraTags` doesn't satisfy the rest parameter `tags: string[]`, since element type `number` isn't assignable to `string`).

**Why:** `tagResource`'s rest parameter `...tags: string[]` requires every argument collected into it to be a `string`. When you spread an array into a call site with `...extraTags`, TypeScript checks the *array's element type* against the rest parameter's element type — it doesn't just check that `extraTags` "is an array," it verifies every possible element is compatible. Since `extraTags` is typed `(string | number)[]`, it could contain a `number` (and does, at index 1: `5`), which would violate `tags: string[]`'s all-strings guarantee at runtime. This is caught statically before the call ever happens. The fix is either narrowing `extraTags`'s type to `string[]` at its declaration (`const extraTags: string[] = ["featured", "5"]`), or filtering/mapping to strings before spreading (`extraTags.map(String)`), since the rest parameter's type is a hard contract on every spread element, not just the array's overall shape.
