# Problem: Raw SQL JOIN vs the N+1 Anti-Pattern, Side by Side

## Problem statement

Write a raw SQL query that fetches a list of orders along with each order's customer name using a `JOIN`. Then show the N+1-query anti-pattern that a naive ORM usage would produce for the same requirement, and its ORM eager-loading fix — all three side by side so the query-count difference is explicit.

## Requirements

- Raw SQL version using a single `JOIN`
- Naive ORM version demonstrating the N+1 anti-pattern (with an explicit query counter to make the cost visible)
- Fixed ORM version using eager loading, producing the same result with a constant number of queries
- All three must return equivalent data: a list of orders, each annotated with its customer's name

## Worked solution

### 1. Raw SQL — one query, one JOIN

```sql
SELECT
  orders.id          AS order_id,
  orders.total        AS total,
  orders.status        AS status,
  customers.name      AS customer_name
FROM orders
JOIN customers ON customers.id = orders.customer_id
ORDER BY orders.id;
```

```js
// raw pg — exactly one round-trip to the database, regardless of row count
async function getOrdersWithCustomerRaw(pool) {
  const { rows } = await pool.query(`
    SELECT orders.id AS order_id, orders.total, orders.status, customers.name AS customer_name
    FROM orders
    JOIN customers ON customers.id = orders.customer_id
    ORDER BY orders.id
  `);
  return rows;
}
```

### 2. Naive ORM usage — the N+1 anti-pattern

```js
// Sequelize models: Order.belongsTo(Customer)
let queryCount = 0;
const originalQuery = sequelize.query.bind(sequelize);
sequelize.query = (...args) => { queryCount++; return originalQuery(...args); }; // instrumentation for illustration

async function getOrdersWithCustomerSlow() {
  const orders = await Order.findAll(); // query #1
  for (const order of orders) {
    order.dataValues.customerName = (await Customer.findByPk(order.customerId)).name; // query #2..N+1
  }
  return orders;
}

// for 200 orders: queryCount ends up at 201 — 1 list query + 1 per order
```

### 3. ORM eager loading — the fix

```js
// Sequelize — single JOIN generated under the hood by `include`
async function getOrdersWithCustomerFast() {
  const orders = await Order.findAll({
    include: { model: Customer, attributes: ['name'], as: 'customer' },
  });
  return orders.map((o) => ({
    orderId: o.id, total: o.total, status: o.status, customerName: o.customer.name,
  }));
  // exactly 1 query total, regardless of how many orders are returned
}

// Prisma equivalent
async function getOrdersWithCustomerFastPrisma() {
  const orders = await prisma.order.findMany({ include: { customer: { select: { name: true } } } });
  return orders.map((o) => ({
    orderId: o.id, total: o.total, status: o.status, customerName: o.customer.name,
  }));
}
```

**Query count comparison for 200 orders:**

| Approach | Queries issued |
|---|---|
| Raw SQL JOIN | 1 |
| Naive ORM (N+1) | 201 |
| ORM with eager loading | 1 |

The raw SQL version and the eager-loaded ORM version both do the join at the database level in a single round-trip; the naive version does the join in application code across the network, one row at a time — functionally correct, but scaling linearly with the number of orders instead of staying constant.
