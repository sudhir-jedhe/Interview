```typescript
interface Endpoint {
  path: string;
  method: "GET" | "POST";
}

const withAnnotation: Endpoint = { path: "/users", method: "GET" };
const withSatisfies = { path: "/users", method: "GET" } satisfies Endpoint;

function needsLiteral(m: "GET") {}

needsLiteral(withAnnotation.method);
needsLiteral(withSatisfies.method);
```

Which of the two `needsLiteral` calls fails to compile?

**Answer:** The first call, `needsLiteral(withAnnotation.method)`, fails. The second, `needsLiteral(withSatisfies.method)`, compiles fine.

**Why:** `withAnnotation`'s declared type is `Endpoint`, so `withAnnotation.method` is typed exactly as declared: `"GET" | "POST"` — the annotation replaces the inferred literal type with the broader interface type, and that broader type is what every downstream access sees, even though the runtime value is `"GET"`. `needsLiteral` requires the narrower literal `"GET"`, so passing a `"GET" | "POST"` value is rejected (it might be `"POST"` at that call site, as far as TS knows).

`withSatisfies` uses `satisfies` instead of an annotation: TypeScript checks the object against `Endpoint` for errors (same validation as the annotation) but keeps the *inferred* type of the expression — `{ path: string; method: "GET" }`, with `method` narrowed to the literal `"GET"` because that's what the value actually is. Since `"GET"` is directly assignable to the `"GET"` parameter type, the second call succeeds. This is the central practical difference between `: Type` and `satisfies Type`: both validate, but only `satisfies` preserves literal narrowing for later use.
