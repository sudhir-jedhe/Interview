# Does this compile?

```typescript
type ApiResponse =
  | { status: "success"; data: string }
  | { status: "error"; error: string };

function handleResponse(response: ApiResponse): void {
  console.log(response.status);
}

handleResponse({ status: "success", data: "loaded", error: "none" });
```

**Answer:** No. TypeScript reports: `Argument of type '{ status: "success"; data: string; error: string; }' is not assignable to parameter of type 'ApiResponse'. Object literal may only specify known properties, and 'error' does not exist in type '{ status: "success"; data: string; }'.`

**Why:** This is the excess property check (introduced in `02-interfaces-type-aliases/output-based/01-excess-property-check.md`) interacting with a discriminated union. When you pass a **fresh object literal** directly to a parameter typed as a union of object shapes, TypeScript first figures out which union member the literal's discriminant (`status: "success"`) matches — here, the `{ status: "success"; data: string }` branch — and then applies the excess property check *specifically against that matched branch*. Since `error` isn't part of the `"success"` branch's shape (only `data` is), including it in the literal is flagged as likely a mistake, even though `error` happens to be a valid property on the *other* union member. This is a genuinely useful catch in practice: it's exactly the kind of bug that happens when merging fields from two different response shapes into one object by accident. As with the general excess property check rule, assigning the literal to a variable first (removing "freshness") would bypass this specific check, though the resulting value still wouldn't cleanly match either union branch's exact shape.
