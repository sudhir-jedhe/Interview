# Scenario: deduplicating and grouping a list of orders by customer

**Prompt:** You have a flat array of order objects (`{ id, customerId, amount }`) and need to produce a summary: total amount spent per customer, sorted by total descending. How do you implement this cleanly, and what edge cases matter?

**Approach:** `reduce` to group and sum, then convert to an array and sort:

```js
const orders = [
  { id: 1, customerId: "a", amount: 50 },
  { id: 2, customerId: "b", amount: 30 },
  { id: 3, customerId: "a", amount: 20 },
];

const totals = orders.reduce((acc, order) => {
  acc[order.customerId] = (acc[order.customerId] ?? 0) + order.amount;
  return acc;
}, {});

const summary = Object.entries(totals)
  .map(([customerId, total]) => ({ customerId, total }))
  .sort((a, b) => b.total - a.total);

console.log(summary); // [{customerId:"a",total:70},{customerId:"b",total:30}]
```

Edge cases: an empty `orders` array should produce `[]`, not throw. Floating-point amounts can accumulate rounding error — for real currency, sum in integer cents. Ties in total amount are left in whatever relative order `sort` happens to produce beyond the primary key (modern engines guarantee `sort` is stable, so original relative order is preserved for equal totals, which is usually the desired tie-break).
