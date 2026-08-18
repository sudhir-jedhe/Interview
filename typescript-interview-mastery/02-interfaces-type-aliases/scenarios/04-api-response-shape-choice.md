# Scenario: Choosing interface vs type for an API client's response types

You're writing a typed wrapper around a REST API client. You need types for: (1) a generic paginated list response wrapper reused across many endpoints, (2) each endpoint's specific resource shape (`OrderResource`, `CustomerResource`), and (3) a response status union (`"ok" | "error" | "timeout"`) used for internal retry logic. You need to decide which construct fits each case.

**Approach:** Use a `type` alias with a generic parameter for the reusable paginated wrapper (generics plus non-object unions are type-alias territory), use `interface` for each concrete resource shape (these are the ones most likely to be extended later, e.g. `OrderResource` gaining a discriminated variant), and use a `type` union of string literals for the status set (interfaces can't express unions at all).

```typescript
// Generic wrapper — type alias, since it needs a type parameter and is purely structural
type PaginatedResponse<T> = {
  data: T[];
  page: number;
  totalPages: number;
};

// Concrete resource shapes — interfaces, since these are the ones consumers
// might reasonably extend or augment (e.g. a library user adding fields via merging)
interface OrderResource {
  id: string;
  customerId: string;
  totalCents: number;
}

interface CustomerResource {
  id: string;
  email: string;
}

// A literal union for internal status handling — only expressible as a type alias
type FetchStatus = "ok" | "error" | "timeout";

function describeFetch(status: FetchStatus): string {
  switch (status) {
    case "ok":
      return "Request succeeded";
    case "error":
      return "Request failed";
    case "timeout":
      return "Request timed out";
  }
}

async function fetchOrders(page: number): Promise<PaginatedResponse<OrderResource>> {
  const response = await fetch(`/api/orders?page=${page}`);
  return response.json() as Promise<PaginatedResponse<OrderResource>>;
}
```

The decision isn't arbitrary: `PaginatedResponse<T>` *must* be a `type` because interfaces, while they do support generic parameters, are less idiomatic for a pure structural wrapper with no expectation of ever being merged or extended by consumers. `OrderResource`/`CustomerResource` are `interface` because they represent stable, nameable domain entities that a consuming application might reasonably want to `extends` (e.g. `interface OrderResourceWithShipping extends OrderResource { shippingAddress: Address }`) or augment via declaration merging if the API client ships as a library. `FetchStatus` has no other option — a union of literals can only be a `type`.
