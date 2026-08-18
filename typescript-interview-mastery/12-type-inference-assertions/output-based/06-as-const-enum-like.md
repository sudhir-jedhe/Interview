```typescript
const HttpStatus = {
  OK: 200,
  NOT_FOUND: 404,
  SERVER_ERROR: 500,
} as const;

type HttpStatus = (typeof HttpStatus)[keyof typeof HttpStatus];

function handle(status: HttpStatus) {
  return status;
}

handle(200);
handle(201);
```

Which `handle` call fails, and what is the type `HttpStatus` equivalent to?

**Answer:** `handle(201)` fails to compile with `Argument of type '201' is not assignable to parameter of type '200 | 404 | 500'`. `handle(200)` compiles. The type `HttpStatus` is equivalent to the literal union `200 | 404 | 500`.

**Why:** `as const` makes every property of the `HttpStatus` object `readonly` and narrows every value to its specific literal type (`200`, `404`, `500` instead of `number`). `typeof HttpStatus` gives the object's type shape (`{ readonly OK: 200; readonly NOT_FOUND: 404; readonly SERVER_ERROR: 500 }`), and indexing that with `keyof typeof HttpStatus` (which is `"OK" | "NOT_FOUND" | "SERVER_ERROR"`) produces a union of the *value* types: `200 | 404 | 500`. This "as const + typeof + keyof" pattern is a common way to build a type-safe enum-like object from a plain JS object without using TypeScript's `enum` keyword, and is frequently asked about because it combines three separate features (`as const`, `typeof`, `keyof`) into one idiom.
