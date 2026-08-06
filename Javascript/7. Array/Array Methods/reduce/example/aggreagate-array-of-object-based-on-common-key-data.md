```js
const aggregate = (arr, on, who) => {
    // using reduce() method to aggregate 
    const agg = arr.reduce((a, b) => {
      // get the value of both the keys 
      const onValue = b[on];
      const whoValue = b[who];
      
      // if there is already a key present
      // merge its value
      if(a[onValue]){
        a[onValue] = {
          [on]: onValue,
          [who]: [...a[onValue][who], whoValue]
        }
      }
      // create a new entry on the key
      else{
        a[onValue] = {
          [on]: onValue,
          [who]: [whoValue]
        }
      }
      
      // return the aggregation
      return a;
    }, {});
    
    
    // return only values after aggregation 
    return Object.values(agg);
  }


Input:
const endorsements = [ 
  { skill: 'css', user: 'Bill' }, 
  { skill: 'javascript', user: 'Chad' }, 
  { skill: 'javascript', user: 'Bill' }, 
  { skill: 'css', user: 'Sue' }, 
  { skill: 'javascript', user: 'Sue' }, 
  { skill: 'html', user: 'Sue' } 
];

console.log(aggregate(endorsements, "user", "skill"));

Output:
[
  {
    "user": "Bill",
    "skill": [
      "css",
      "javascript"
    ]
  },
  {
    "user": "Chad",
    "skill": [
      "javascript"
    ]
  },
  {
    "user": "Sue",
    "skill": [
      "css",
      "javascript",
      "html"
    ]
  }
]
```


```js
function aggregateSkillEndorsements(endorsements) {
    const aggregatedEndorsements = {};
    
    endorsements.forEach(endorsement => {
        const { skill, count } = endorsement;
        if (aggregatedEndorsements[skill]) {
            aggregatedEndorsements[skill] += count; // If skill exists, add count to existing total
        } else {
            aggregatedEndorsements[skill] = count; // If skill doesn't exist, initialize with count
        }
    });

    return aggregatedEndorsements;
}

// Example usage:
const endorsements = [
    { skill: 'JavaScript', count: 5 },
    { skill: 'HTML', count: 3 },
    { skill: 'CSS', count: 7 },
    { skill: 'JavaScript', count: 2 },
    { skill: 'CSS', count: 4 }
];

const aggregatedSkills = aggregateSkillEndorsements(endorsements);
console.log(aggregatedSkills);

```


```javascript

const aggregate = (arr, on, who) => {
  // using reduce() method to aggregate 
  const agg = arr.reduce((a, b) => {
    // get the value of both the keys 
    const onValue = b[on];
    const whoValue = b[who];
    
    // if there is already a key present
    // merge its value
    if(a[onValue]){
      a[onValue] = {
        [on]: onValue,
        [who]: [...a[onValue][who], whoValue]
      }
    }
    // create a new entry on the key
    else{
      a[onValue] = {
        [on]: onValue,
        [who]: [whoValue]
      }
    }
    
    // return the aggregation
    return a;
  }, {});
  
  
  // return only values after aggregation 
  return Object.values(agg);
}
```

A common interview question is to **aggregate an array of objects based on a common key**.

***

## Example: Group by `department` and Sum Salary

### Input

```javascript
const employees = [
  { department: "IT", salary: 5000 },
  { department: "HR", salary: 3000 },
  { department: "IT", salary: 7000 },
  { department: "HR", salary: 2000 },
  { department: "Finance", salary: 8000 }
];
```

### Output

```javascript
[
  { department: "IT", salary: 12000 },
  { department: "HR", salary: 5000 },
  { department: "Finance", salary: 8000 }
]
```

***

# Using `reduce()`

```javascript
function aggregateByKey(arr, key, valueField) {
  const grouped = arr.reduce((acc, item) => {
    const groupKey = item[key];

    acc[groupKey] =
      (acc[groupKey] || 0) + item[valueField];

    return acc;
  }, {});

  return Object.entries(grouped).map(
    ([keyValue, total]) => ({
      keyValue,
      total
    })
  );
}

const result = aggregateByKey(
  employees,
  "department",
  "salary"
);

console.log(result);
```

***

## Example 2: Aggregate Product Quantities

### Input

```javascript
const products = [
  { product: "Pen", qty: 10 },
  { product: "Pencil", qty: 5 },
  { product: "Pen", qty: 15 },
  { product: "Pencil", qty: 10 }
];
```

### Code

```javascript
const result =
  aggregateByKey(
    products,
    "product",
    "qty"
  );

console.log(result);
```

### Output

```javascript
[
  { product: "Pen", qty: 25 },
  { product: "Pencil", qty: 15 }
]
```

***

# Group Multiple Fields

### Input

```javascript
const sales = [
  {
    region: "North",
    sales: 100,
    orders: 2
  },
  {
    region: "North",
    sales: 200,
    orders: 3
  },
  {
    region: "South",
    sales: 150,
    orders: 1
  }
];
```

### Solution

```javascript
const result = Object.values(
  sales.reduce((acc, item) => {
    const key = item.region;

    if (!acc[key]) {
      acc[key] = {
        region: key,
        sales: 0,
        orders: 0
      };
    }

    acc[key].sales += item.sales;
    acc[key].orders += item.orders;

    return acc;
  }, {})
);

console.log(result);
```

### Output

```javascript
[
  {
    region: "North",
    sales: 300,
    orders: 5
  },
  {
    region: "South",
    sales: 150,
    orders: 1
  }
]
```

***

# React Example

```javascript
const users = [
  { role: "Admin", count: 1 },
  { role: "User", count: 1 },
  { role: "Admin", count: 1 }
];

const aggregated =
  Object.values(
    users.reduce((acc, user) => {
      if (!acc[user.role]) {
        acc[user.role] = {
          role: user.role,
          count: 0
        };
      }

      acc[user.role].count += user.count;

      return acc;
    }, {})
  );

console.log(aggregated);
```

### Output

```javascript
[
  { role: "Admin", count: 2 },
  { role: "User", count: 1 }
]
```

***

# Generic Interview Solution

```javascript
function aggregate(arr, key, field) {
  return Object.values(
    arr.reduce((acc, item) => {
      const group = item[key];

      if (!acc[group]) {
        acc[group] = {
          group,
          0
        };
      }

      acc[group][field] += item[field];

      return acc;
    }, {})
  );
}
```

### Usage

```javascript
aggregate(
  employees,
  "department",
  "salary"
);
```

***

## Time Complexity

```text
O(n)
```

## Space Complexity

```text
O(k)
```

Where:

* `n` = total records
* `k` = unique keys/groups

### Interview One-Liner

> Use `Array.prototype.reduce()` to group records by a key and accumulate values. Store grouped data in an object during reduction, then convert it back to an array using `Object.values()`. This gives an efficient `O(n)` aggregation solution.


## Example 1: Aggregate by `department`, Sum `salary`

### Input

```javascript
const employees = [
  { department: "IT", salary: 5000 },
  { department: "HR", salary: 3000 },
  { department: "IT", salary: 7000 },
  { department: "HR", salary: 2000 }
];
```

### Aggregation

```javascript
const result = Object.values(
  employees.reduce((acc, employee) => {
    const key = employee.department;

    if (!acc[key]) {
      acc[key] = {
        department: key,
        salary: 0
      };
    }

    acc[key].salary += employee.salary;

    return acc;
  }, {})
);

console.log(result);
```

### Output

```javascript
[
  {
    department: "IT",
    salary: 12000
  },
  {
    department: "HR",
    salary: 5000
  }
]
```

***

# Example 2: Aggregate by Product, Sum Quantity

### Input

```javascript
const products = [
  { product: "Pen", qty: 10 },
  { product: "Pencil", qty: 5 },
  { product: "Pen", qty: 15 },
  { product: "Pencil", qty: 10 }
];
```

### Output

```javascript
[
  {
    product: "Pen",
    qty: 25
  },
  {
    product: "Pencil",
    qty: 15
  }
]
```

### Code

```javascript
const result = Object.values(
  products.reduce((acc, item) => {
    if (!acc[item.product]) {
      acc[item.product] = {
        product: item.product,
        qty: 0
      };
    }

    acc[item.product].qty += item.qty;

    return acc;
  }, {})
);
```

***

# Example 3: Aggregate Multiple Fields

### Input

```javascript
const sales = [
  {
    region: "North",
    sales: 100,
    orders: 2
  },
  {
    region: "North",
    sales: 200,
    orders: 3
  },
  {
    region: "South",
    sales: 150,
    orders: 1
  }
];
```

### Code

```javascript
const result = Object.values(
  sales.reduce((acc, item) => {
    const key = item.region;

    if (!acc[key]) {
      acc[key] = {
        region: key,
        sales: 0,
        orders: 0
      };
    }

    acc[key].sales += item.sales;
    acc[key].orders += item.orders;

    return acc;
  }, {})
);

console.log(result);
```

### Output

```javascript
[
  {
    region: "North",
    sales: 300,
    orders: 5
  },
  {
    region: "South",
    sales: 150,
    orders: 1
  }
]
```

***

# Generic Aggregation Utility

```javascript
function aggregateByKey(
  data,
  groupKey,
  aggregateFields
) {
  return Object.values(
    data.reduce((acc, item) => {
      const key = item[groupKey];

      if (!acc[key]) {
        acc[key] = {
          key
        };

        aggregateFields.forEach(field => {
          acc[key][field] = 0;
        });
      }

      aggregateFields.forEach(field => {
        acc[key][field] += item[field];
      });

      return acc;
    }, {})
  );
}
```

### Usage

```javascript
const result = aggregateByKey(
  sales,
  "region",
  ["sales", "orders"]
);

console.log(result);
```

***

# React Example Using Aggregated Data

### Aggregating Employees by Department

```jsx
import { useMemo } from "react";

function EmployeeSummary() {
  const employees = [
    { department: "IT", salary: 5000 },
    { department: "HR", salary: 3000 },
    { department: "IT", salary: 7000 },
    { department: "HR", salary: 2000 }
  ];

  const summary = useMemo(() => {
    return Object.values(
      employees.reduce((acc, employee) => {
        const dept =
          employee.department;

        if (!acc[dept]) {
          acc[dept] = {
            department: dept,
            totalSalary: 0,
            employeeCount: 0
          };
        }

        acc[dept].totalSalary +=
          employee.salary;

        acc[dept].employeeCount++;

        return acc;
      }, {})
    );
  }, [employees]);

  return (
    <table border="1">
      <thead>
        <tr>
          <th>Department</th>
          <th>Employees</th>
          <th>Total Salary</th>
        </tr>
      </thead>

      <tbody>
        {summary.map(item => (
          <tr
            key={item.department}
          >
            <td>
              {item.department}
            </td>

            <td>
              {item.employeeCount}
            </td>

            <td>
              {item.totalSalary}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default EmployeeSummary;
```

### UI Output

```text
+------------+-----------+--------------+
| Department | Employees | Total Salary |
+------------+-----------+--------------+
| IT         |     2     |    12000     |
| HR         |     2     |     5000     |
+------------+-----------+--------------+
```

***

## Interview Pattern (Most Important)

```javascript
const aggregated = Object.values(
  data.reduce((acc, item) => {
    const key = item.department;

    if (!acc[key]) {
      acc[key] = {
        department: key,
        total: 0
      };
    }

    acc[key].total += item.salary;

    return acc;
  }, {})
);
```

### Time Complexity

```text
O(n)
```

### Space Complexity

```text
O(k)
```

Where:

* `n` = total records
* `k` = unique groups

### Senior React Interview Answer

> Use `reduce()` to group records by a common key and aggregate one or more numeric fields. Store intermediate results in an object for O(1) lookup and convert them back to an array using `Object.values()`. In React, wrap aggregation logic in `useMemo()` to avoid recalculating grouped data on every render.


Let’s go deeper with **different keys + multiple aggregation fields** and then a clean **React example**.

***

# 1. Example: Group by `category` and Aggregate Multiple Fields

### Input

```javascript
const orders = [
  { category: "Electronics", price: 1000, quantity: 2 },
  { category: "Clothing", price: 500, quantity: 3 },
  { category: "Electronics", price: 1500, quantity: 1 },
  { category: "Clothing", price: 700, quantity: 2 },
  { category: "Furniture", price: 2000, quantity: 1 }
];
```

***

## Aggregation

* Group by: `category`
* Aggregate:
  * `totalRevenue = price * quantity`
  * `totalQuantity`
  * `orderCount`

```javascript
const aggregated = Object.values(
  orders.reduce((acc, item) => {
    const key = item.category;

    if (!acc[key]) {
      acc[key] = {
        category: key,
        totalRevenue: 0,
        totalQuantity: 0,
        orderCount: 0
      };
    }

    acc[key].totalRevenue += item.price * item.quantity;
    acc[key].totalQuantity += item.quantity;
    acc[key].orderCount++;

    return acc;
  }, {})
);

console.log(aggregated);
```

***

### Output

```javascript
[
  {
    category: "Electronics",
    totalRevenue: 3500,
    totalQuantity: 3,
    orderCount: 2
  },
  {
    category: "Clothing",
    totalRevenue: 2900,
    totalQuantity: 5,
    orderCount: 2
  },
  {
    category: "Furniture",
    totalRevenue: 2000,
    totalQuantity: 1,
    orderCount: 1
  }
]
```

***

# 2. Example: Group by Multiple Keys (`region + product`)

### Input

```javascript
const sales = [
  { region: "North", product: "Pen", amount: 100 },
  { region: "North", product: "Pen", amount: 200 },
  { region: "South", product: "Pen", amount: 150 },
  { region: "North", product: "Pencil", amount: 50 }
];
```

***

### Aggregation

```javascript
const result = Object.values(
  sales.reduce((acc, item) => {
    const key = `${item.region}-${item.product}`;

    if (!acc[key]) {
      acc[key] = {
        region: item.region,
        product: item.product,
        totalAmount: 0
      };
    }

    acc[key].totalAmount += item.amount;

    return acc;
  }, {})
);

console.log(result);
```

***

### Output

```javascript
[
  { region: "North", product: "Pen", totalAmount: 300 },
  { region: "South", product: "Pen", totalAmount: 150 },
  { region: "North", product: "Pencil", totalAmount: 50 }
]
```

***

# 3. Generic Aggregator (Flexible)

```javascript
function aggregate(data, keyFn, reducers) {
  return Object.values(
    data.reduce((acc, item) => {
      const key = keyFn(item);

      if (!acc[key]) {
        acc[key] = reducers.init(item);
      }

      reducers.update(acc[key], item);

      return acc;
    }, {})
  );
}
```

### Usage

```javascript
const result = aggregate(
  orders,
  item => item.category,
  {
    init: (item) => ({
      category: item.category,
      totalRevenue: 0,
      totalQuantity: 0
    }),

    update: (acc, item) => {
      acc.totalRevenue += item.price * item.quantity;
      acc.totalQuantity += item.quantity;
    }
  }
);
```

***

# 4. React Example Using Aggregated Data

## Dashboard Table

```jsx
import { useMemo } from "react";

function OrdersDashboard() {
  const orders = [
    { category: "Electronics", price: 1000, quantity: 2 },
    { category: "Clothing", price: 500, quantity: 3 },
    { category: "Electronics", price: 1500, quantity: 1 },
    { category: "Clothing", price: 700, quantity: 2 }
  ];

  const summary = useMemo(() => {
    return Object.values(
      orders.reduce((acc, item) => {
        const key = item.category;

        if (!acc[key]) {
          acc[key] = {
            category: key,
            revenue: 0,
            quantity: 0,
            orders: 0
          };
        }

        acc[key].revenue += item.price * item.quantity;
        acc[key].quantity += item.quantity;
        acc[key].orders++;

        return acc;
      }, {})
    );
  }, [orders]);

  return (
    <div>
      <h2>Order Summary</h2>

      <table border="1">
        <thead>
          <tr>
            <th>Category</th>
            <th>Orders</th>
            <th>Quantity</th>
            <th>Revenue</th>
          </tr>
        </thead>

        <tbody>
          {summary.map(item => (
            <tr key={item.category}>
              <td>{item.category}</td>
              <td>{item.orders}</td>
              <td>{item.quantity}</td>
              <td>{item.revenue}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default OrdersDashboard;
```

***

# 5. React Chart-Friendly Data

```javascript
const chartData = summary.map(item => ({
  name: item.category,
  value: item.revenue
}));
```

Use with:

* Recharts
* Chart.js
* D3

***

# Key Interview Takeaways

✅ Use `reduce()` for grouping  
✅ Use object as hashmap for O(1) lookup  
✅ Convert back with `Object.values()`  
✅ Use `useMemo()` in React for performance  
✅ Support multiple aggregations in one pass

***

## One-Liner (Senior Level)

> Use `reduce()` to group data by a key, accumulate multiple fields in a single pass, and convert the grouped object into an array using `Object.values()`. In React, wrap this logic in `useMemo()` to avoid unnecessary recomputation.
