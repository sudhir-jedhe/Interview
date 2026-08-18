# Snippet: Prisma Transaction — Automatic Rollback on Thrown Error

```js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function createOrderWithItems(userId, items) {
  return prisma.$transaction(async (tx) => {
    const order = await tx.order.create({ data: { userId, status: 'pending' } });
    await tx.orderItem.createMany({
      data: items.map((item) => ({ orderId: order.id, sku: item.sku, qty: item.qty })),
    });
    return order;
  }); // if createMany throws, the order insert is rolled back too
}
```

**Explanation:** `prisma.$transaction(async (tx) => {...})` runs the callback with a special transactional client (`tx`) — every query issued through `tx` (never the outer `prisma` object) participates in the same database transaction. If any awaited call inside the callback throws (a constraint violation, a network blip), Prisma automatically issues a rollback for every write made through `tx` so far, including the earlier `order.create` — you never end up with an order that has no items due to a partial failure.
