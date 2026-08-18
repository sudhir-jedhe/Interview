# Scenario: You Need to Run 3 Related Writes Atomically

Placing an order requires: creating the order row, decrementing inventory for each item, and recording a payment charge. If any step fails, you must not end up with a partially-placed order (e.g. inventory decremented but no order or payment recorded).

**Approach:**
Wrap all three writes in a single database transaction so they commit or roll back together. Use the ORM's transaction API (or raw `BEGIN`/`COMMIT`/`ROLLBACK` if you're on the raw driver) and make sure every query inside the block uses the same transaction handle — a common mistake is starting a transaction but then issuing one of the writes through the untransacted default connection.

```js
// Prisma — interactive transaction, automatic rollback on any thrown error
async function placeOrder(userId, items) {
  return prisma.$transaction(async (tx) => {
    const order = await tx.order.create({ data: { userId, status: 'pending' } });

    for (const item of items) {
      const updated = await tx.inventory.updateMany({
        where: { sku: item.sku, quantity: { gte: item.qty } },
        data: { quantity: { decrement: item.qty } },
      });
      if (updated.count === 0) {
        throw new Error(`Insufficient stock for ${item.sku}`); // triggers full rollback
      }
    }

    await tx.payment.create({ data: { orderId: order.id, amount: item.total, status: 'charged' } });
    return order;
  });
}
```
If any step throws — insufficient stock, a payment provider error, a DB constraint violation — Prisma rolls back every write made through `tx` inside the callback, so you never end up with a half-placed order. On raw `pg`, the equivalent is explicit `BEGIN`/`COMMIT`, with a `try/catch` issuing `ROLLBACK` and always `client.release()`-ing the connection in `finally`.
