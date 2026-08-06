The difference between a **LEFT JOIN** and a **RIGHT JOIN** comes down to which table retains all of its rows in the output.

| Feature            | LEFT JOIN (`LEFT OUTER JOIN`)                                    | RIGHT JOIN (`RIGHT OUTER JOIN`)                                  |
| ------------------ | ---------------------------------------------------------------- | ---------------------------------------------------------------- |
| **Priority Table** | The table listed **before** (to the left of) the `JOIN` keyword. | The table listed **after** (to the right of) the `JOIN` keyword. |
| **Retained Rows**  | Keeps **ALL** rows from the left table.                          | Keeps **ALL** rows from the right table.                         |
| **Unmatched Data** | Fills with `NULL` where the right table has no match.            | Fills with `NULL` where the left table has no match.             |
| **Common Use**     | Standard choice in real-world queries.                           | Rarely used (can always be rewritten as a `LEFT JOIN`).          |

---

### Example

Given two tables:

**`Users` (Left Table)**

| user_id | name    |
| ------- | ------- |
| 1       | Alice   |
| 2       | Bob     |
| 3       | Charlie |

**`Orders` (Right Table)**

| order_id | user_id | amount |
| -------- | ------- | ------ |
| 101      | 1       | $50    |
| 102      | 2       | $30    |
| 103      | 99      | $100   |

---

#### 1. LEFT JOIN

Keeps **all users**, even if they haven't placed an order.

```sql
SELECT Users.name, Orders.order_id, Orders.amount
FROM Users
LEFT JOIN Orders ON Users.user_id = Orders.user_id;

```

**Result:**

| name    | order_id | amount |
| ------- | -------- | ------ |
| Alice   | 101      | $50    |
| Bob     | 102      | $30    |
| Charlie | `NULL`   | `NULL` |

*(Charlie stays in the result set; missing order fields become `NULL`. Order 103 is dropped because user 99 isn't in `Users`.)*

---

#### 2. RIGHT JOIN

Keeps **all orders**, even if the `user_id` doesn't match an existing user.

```sql
SELECT Users.name, Orders.order_id, Orders.amount
FROM Users
RIGHT JOIN Orders ON Users.user_id = Orders.user_id;

```

**Result:**

| name   | order_id | amount |
| ------ | -------- | ------ |
| Alice  | 101      | $50    |
| Bob    | 102      | $30    |
| `NULL` | 103      | $100   |

*(Order 103 stays in the result set; missing user fields become `NULL`. Charlie is dropped because he has no orders.)*

---

### Key Takeaway

`TableA RIGHT JOIN TableB` produces the exact same result as `TableB LEFT JOIN TableA`. Because standard left-to-right reading order makes queries easier to read, developers almost exclusively stick to **`LEFT JOIN`** in production code.
