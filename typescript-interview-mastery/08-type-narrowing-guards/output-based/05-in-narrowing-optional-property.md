```typescript
interface Base {
  id: string;
  nickname?: string;
}

function greet(user: Base): string {
  if ("nickname" in user) {
    return `Hey, ${user.nickname.toUpperCase()}`;
  }
  return `Hey, ${user.id}`;
}

greet({ id: "u1", nickname: undefined });
```

Does this compile? What happens when it runs?

**Answer:** It compiles cleanly, but throws at runtime: `TypeError: Cannot read properties of undefined (reading 'toUpperCase')`.

**Why:** The `in` operator checks whether a property *key* exists on the object, regardless of whether its value is `undefined` — and `{ id: "u1", nickname: undefined }` does have a `nickname` key, it's just set to `undefined`, so `"nickname" in user` evaluates to `true` at runtime. Inside that `if` branch, TypeScript narrows `user.nickname`'s type from `string | undefined` to `string`, because `in`-narrowing on an optional property assumes "key present" implies "value present" — which is usually true for objects built from a type where the property is either fully omitted or genuinely set, but breaks for any object that explicitly assigns `undefined` to an optional field (a pattern that shows up more than you'd expect — spreading a partial update object, `JSON.parse` output, form libraries that always include every key). The safer, more precise check narrows on the *value* instead of the key: `if (user.nickname !== undefined)` or `if (typeof user.nickname === "string")`, either of which correctly falls through to the `else` branch for this exact input instead of narrowing away a `undefined` that's actually still there.
