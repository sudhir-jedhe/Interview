```typescript
function makeRequest(config: { method: "GET" | "POST" }) {
  return config.method;
}

const options = {
  method: "POST",
};

makeRequest(options);
```

Does this compile?

**Answer:** No — TypeScript reports an error: `Argument of type '{ method: string; }' is not assignable to parameter of type '{ method: "GET" | "POST"; }'. Types of property 'method' are incompatible. Type 'string' is not assignable to type '"GET" | "POST"'.`

**Why:** `options` is declared with `const`, but that only prevents *reassigning the binding* `options` — it does nothing to stop `options.method` from being reassigned (`options.method = "PATCH"` is legal JS/TS), so TypeScript widens the property `method` to the general type `string` when inferring the shape of the object literal. Because `makeRequest` expects the literal union `"GET" | "POST"`, and the inferred type of `options.method` is the wider `string`, the call fails. The fix is `const options = { method: "POST" } as const;` (or `{ method: "POST" } satisfies { method: "GET" | "POST" }`), either of which keeps `method` as the literal `"POST"`.
