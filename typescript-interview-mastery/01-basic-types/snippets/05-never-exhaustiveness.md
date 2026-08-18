# Snippet: `never` for exhaustive switch checks

Shows a `switch` statement that uses `never` to force a compile error if a new order status is added but not handled.

```typescript
type OrderStatus = "pending" | "shipped" | "delivered";

function describeStatus(status: OrderStatus): string {
  switch (status) {
    case "pending":
      return "Order received, awaiting shipment";
    case "shipped":
      return "Order is on its way";
    case "delivered":
      return "Order has arrived";
    default:
      const exhaustiveCheck: never = status; // errors if a case is missing
      throw new Error(`Unhandled status: ${exhaustiveCheck}`);
  }
}

console.log(describeStatus("shipped"));
```
