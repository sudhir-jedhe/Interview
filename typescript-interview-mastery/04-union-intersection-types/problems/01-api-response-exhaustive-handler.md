# Problem: Model an API response as a discriminated union with an exhaustive handler

## Problem statement

Model a generic API response type `ApiResponse<T>` as a discriminated union: `{ status: "success"; data: T } | { status: "error"; error: string }`. Write a generic `handleResponse` function that exhaustively switches on `status` and returns a formatted string, using `never` to guarantee the switch stays exhaustive if the union ever grows a third member.

## Requirements

- `type ApiResponse<T> = { status: "success"; data: T } | { status: "error"; error: string }`
- `function handleResponse<T>(response: ApiResponse<T>, formatData: (data: T) => string): string`
- Exhaustive `switch` with a `default` branch performing a `never` check.
- Demonstrate usage with a concrete `T` (e.g. a `User` type).
- Must compile under `strict: true`.

## Solution

```typescript
type ApiResponse<T> =
  | { status: "success"; data: T }
  | { status: "error"; error: string };

function handleResponse<T>(
  response: ApiResponse<T>,
  formatData: (data: T) => string,
): string {
  switch (response.status) {
    case "success":
      return formatData(response.data);
    case "error":
      return `Error: ${response.error}`;
    default: {
      const exhaustiveCheck: never = response;
      throw new Error(`Unhandled response: ${JSON.stringify(exhaustiveCheck)}`);
    }
  }
}

interface User {
  id: number;
  email: string;
}

const success: ApiResponse<User> = {
  status: "success",
  data: { id: 1, email: "ada@example.com" },
};

const failure: ApiResponse<User> = {
  status: "error",
  error: "User not found",
};

console.log(handleResponse(success, (user) => `Loaded ${user.email}`));
console.log(handleResponse(failure, (user) => `Loaded ${user.email}`));

// --- If ApiResponse gained a third member, e.g. { status: "pending" }: ---
// The `default` branch's `response` would no longer narrow to `never`
// (it would narrow to `{ status: "pending" }` instead), so
// `const exhaustiveCheck: never = response;` would fail to compile,
// flagging every call site of handleResponse that needs an update.
```

### Why this is the correct approach

The generic `T` flows through `ApiResponse<T>` into `formatData`'s parameter, so `handleResponse` works for any resource type while keeping `data`'s type fully precise inside the `"success"` case — no `any`, no manual casting. The exhaustiveness check via `never` is the load-bearing safety mechanism: it guarantees that if `ApiResponse`'s union ever grows (a `"pending"` status added for async jobs, for instance), the compiler forces every exhaustive-switch consumer of `ApiResponse` to be updated before the codebase builds again, rather than silently falling through and returning `undefined` for the new, unhandled status at runtime.
