# Scenario: Modeling an API response as a discriminated union

You're writing a client for an internal API where every endpoint response has one of two shapes: a success response carrying typed `data`, or an error response carrying a `error` message string. You want every consumer of a response to be forced to handle both cases explicitly, with full type safety on `data`'s shape in the success case.

**Approach:** Model the response as a generic discriminated union keyed on a `status` literal, and write a handler that exhaustively switches on `status`, using `never` to guarantee new response shapes can't slip through unhandled.

```typescript
type ApiResponse<T> =
  | { status: "success"; data: T }
  | { status: "error"; error: string };

interface Product {
  id: string;
  name: string;
  priceCents: number;
}

function handleProductResponse(response: ApiResponse<Product>): string {
  switch (response.status) {
    case "success":
      // response narrowed to { status: "success"; data: Product }
      return `${response.data.name}: $${(response.data.priceCents / 100).toFixed(2)}`;
    case "error":
      // response narrowed to { status: "error"; error: string }
      return `Failed to load product: ${response.error}`;
    default: {
      const exhaustiveCheck: never = response;
      throw new Error(`Unhandled response status: ${JSON.stringify(exhaustiveCheck)}`);
    }
  }
}

const successResponse: ApiResponse<Product> = {
  status: "success",
  data: { id: "p-1", name: "Wireless Mouse", priceCents: 2999 },
};

const errorResponse: ApiResponse<Product> = {
  status: "error",
  error: "Product not found",
};

console.log(handleProductResponse(successResponse));
console.log(handleProductResponse(errorResponse));
```

Because `ApiResponse<T>` is generic, the same discriminated-union pattern is reused across every endpoint (`ApiResponse<Order>`, `ApiResponse<User>`, ...) without redefining the `status`/`error` scaffolding each time. The exhaustiveness check guarantees that if a third response shape is later added (say, a `"pending"` status for async jobs), every existing `handleXResponse` function using this pattern will fail to compile until updated — turning a "forgot to handle the new API contract" bug into a build-time signal across the whole codebase, rather than a subtle runtime gap discovered per-endpoint.
