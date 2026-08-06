```js
aggregate parent / child relation

// aggregate parent / child relation
const aggregate = (arr) => {
  // aggregate the values for easier processing
  return arr.reduce((a, b) => {
    const [child, parent] = b;

    // aggregating on child
    a[child] = parent;

    return a;
  }, {});
};

const arr = [
  ["lion", "cat"],
  ["cat", "mammal"],
  ["dog", "mammal"],
  ["mammal", "animal"],
  ["fish", "animal"],
  ["shark", "fish"],
];

console.log(aggregate(arr));

/*
  {
    "lion": "cat",
    "cat": "mammal",
    "dog": "mammal",
    "mammal": "animal",
    "fish": "animal",
    "shark": "fish"
  }
  */

 ```

 ```js

 
// for a relationship from the aggregated value
const convert = (obj) => {
  return Object.keys(obj).reduce((a, b) => {
    a.push(getKey(obj, b));
    return a;
  }, []);
};

// helper function to form the string
// till the last hierarchy
const getKey = (obj, key) => {
  // access the
  const val = obj[key];

  // the formation can be reversed by chaning the order of the keys
  // child -> parent | parent -> child
  if (val in obj) {
    return getKey(obj, val) + " -> " + key;
  } else {
    return val + " -> " + key;
  }
};


Input:
// map after aggregation
const map = {
  "lion": "cat",
  "cat": "mammal",
  "dog": "mammal",
  "mammal": "animal",
  "fish": "animal",
  "shark": "fish"
};

console.log(convert(map));

Output:
[
  "animal -> mammal -> cat -> lion",
  "animal -> mammal -> cat",
  "animal -> mammal -> dog",
  "animal -> mammal",
  "animal -> fish",
  "animal -> fish -> shark"
]

```

```js

/************************ */
const ancestry = (arr) => {

    // aggregate parent / child relation
    const aggregate = (arr) => {
  
      // aggregate the values for easier processing
      return arr.reduce((a, b) => {
        const [child, parent] = b;
  
        // aggregating on child
        a[child] = parent;
  
        return a;
      }, {});
    };
    
    // for a relationship from the aggregated value
    const convert = (obj) => {
      return Object.keys(obj).reduce((a, b) => {
        a.push(getKey(obj, b));
        return a;
      }, []);
    };
  
    // helper function to form the string
    // till the last hierarchy
    const getKey = (obj, key) => {
      // access the
      const val = obj[key];
  
      // the formation can be reversed by chaning the order of the keys
      // child -> parent | parent -> child
      if(val in obj){
        return getKey(obj, val) + " -> " + key;
      }else{
        return val + " -> " + key;
      }
    };
    
    // get the aggregated map
    const aggregatedMap = aggregate(arr);
    
    // return the ancestory 
    return convert(aggregatedMap);
  
  };

  Input:
const arr = [
  ["lion", "cat"],
  ["cat", "mammal"],
  ["dog", "mammal"],
  ["mammal", "animal"],
  ["fish", "animal"],
  ["shark", "fish"],
];

console.log(ancestry(arr));

Output:
[
  "animal -> mammal -> cat -> lion",
  "animal -> mammal -> cat",
  "animal -> mammal -> dog",
  "animal -> mammal",
  "animal -> fish",
  "animal -> fish -> shark"
]
```
Convert relation array to object tree in JavaScript


When aggregating **parent-child relationships**, the goal is usually to transform a flat array into a hierarchical structure or calculate aggregated values from children to parents.

***

# Example 1: Convert Flat Data into Parent-Child Tree

### Input

```javascript
const data = [
  { id: 1, name: "Electronics", parentId: null },
  { id: 2, name: "Mobile", parentId: 1 },
  { id: 3, name: "Laptop", parentId: 1 },
  { id: 4, name: "iPhone", parentId: 2 },
  { id: 5, name: "Samsung", parentId: 2 }
];
```

***

### Output

```javascript
[
  {
    id: 1,
    name: "Electronics",
    children: [
      {
        id: 2,
        name: "Mobile",
        children: [
          { id: 4, name: "iPhone", children: [] },
          { id: 5, name: "Samsung", children: [] }
        ]
      },
      {
        id: 3,
        name: "Laptop",
        children: []
      }
    ]
  }
]
```

***

### Solution

```javascript
function buildTree(data) {
  const map = {};
  const roots = [];

  data.forEach(item => {
    map[item.id] = {
      ...item,
      children: []
    };
  });

  data.forEach(item => {
    if (item.parentId === null) {
      roots.push(map[item.id]);
    } else {
      map[item.parentId]?.children.push(
        map[item.id]
      );
    }
  });

  return roots;
}

console.log(buildTree(data));
```

***

# Example 2: Aggregate Child Sales into Parent

### Input

```javascript
const categories = [
  {
    id: 1,
    name: "Electronics",
    parentId: null,
    sales: 0
  },
  {
    id: 2,
    name: "Mobile",
    parentId: 1,
    sales: 1000
  },
  {
    id: 3,
    name: "Laptop",
    parentId: 1,
    sales: 2000
  }
];
```

***

### Expected Output

```javascript
[
  {
    id: 1,
    sales: 3000
  }
]
```

Parent gets total from children.

***

### Solution

```javascript
function aggregateSales(data) {
  const map = {};

  data.forEach(item => {
    map[item.id] = { ...item };
  });

  data.forEach(item => {
    if (item.parentId !== null) {
      map[item.parentId].sales +=
        item.sales;
    }
  });

  return Object.values(map);
}

console.log(
  aggregateSales(categories)
);
```

***

# Example 3: Employee → Manager Aggregation

### Input

```javascript
const employees = [
  {
    id: 1,
    name: "Manager A",
    managerId: null,
    salary: 0
  },
  {
    id: 2,
    name: "John",
    managerId: 1,
    salary: 5000
  },
  {
    id: 3,
    name: "Mike",
    managerId: 1,
    salary: 6000
  }
];
```

***

### Aggregate Team Salary

```javascript
const result = employees.reduce(
  (acc, emp) => {
    if (emp.managerId) {
      acc[emp.managerId] =
        (acc[emp.managerId] || 0) +
        emp.salary;
    }

    return acc;
  },
  {}
);

console.log(result);
```

### Output

```javascript
{
  1: 11000
}
```

***

# React Example

### Display Parent with Children

```jsx
function CategoryTree({ nodes }) {
  return (
    <ul>
      {nodes.map(node => (
        <li key={node.id}>
          {node.name}

          {node.children.length > 0 && (
            <CategoryTree
              nodes={node.children}
            />
          )}
        </li>
      ))}
    </ul>
  );
}
```

### Usage

```jsx
const tree = buildTree(data);

<CategoryTree nodes={tree} />;
```

***

# Interview Pattern

### Build Tree

```javascript
id -> lookup map
parentId -> connect child
```

### Aggregate Children

```javascript
child.value -> parent.value
```

### Complexity

Building tree:

```text
Time: O(n)
Space: O(n)
```

Aggregation:

```text
Time: O(n)
Space: O(n)
```

### Senior Interview Answer

> For parent-child aggregation, first create a lookup map keyed by `id`. Then either build a hierarchical tree using `parentId`, or aggregate child values into parent nodes by traversing the collection and updating parent totals. Using a hash map provides an efficient O(n) solution compared to nested loops.


## 1. Aggregating Numeric Values from Children to Parents

A common requirement is to sum child values and roll them up to the parent.

### Input (Tree Structure)

```javascript
const tree = [
  {
    id: 1,
    name: "Electronics",
    sales: 0,
    children: [
      {
        id: 2,
        name: "Mobile",
        sales: 1000,
        children: [
          {
            id: 4,
            name: "iPhone",
            sales: 2000,
            children: []
          },
          {
            id: 5,
            name: "Samsung",
            sales: 1500,
            children: []
          }
        ]
      },
      {
        id: 3,
        name: "Laptop",
        sales: 3000,
        children: []
      }
    ]
  }
];
```

***

### Aggregate Sales from Children Upwards

```javascript
function aggregateSales(node) {
  let total = node.sales || 0;

  for (const child of node.children) {
    total += aggregateSales(child);
  }

  node.totalSales = total;

  return total;
}

tree.forEach(aggregateSales);

console.log(tree);
```

***

### Output

```javascript
{
  id: 1,
  name: "Electronics",
  totalSales: 7500,

  children: [
    {
      id: 2,
      totalSales: 4500
    },
    {
      id: 3,
      totalSales: 3000
    }
  ]
}
```

Calculation:

```text
iPhone   = 2000
Samsung  = 1500
Mobile   = 1000 + 2000 + 1500 = 4500

Laptop   = 3000

Electronics
= 4500 + 3000
= 7500
```

***

# 2. Flatten Hierarchical Parent-Child Data

Convert:

```javascript
Parent
 ├── Child
 └── Child
      └── Grandchild
```

Into:

```javascript
[
  Parent,
  Child,
  Child,
  Grandchild
]
```

***

### Recursive Solution

```javascript
function flattenTree(nodes) {
  const result = [];

  function traverse(node) {
    result.push({
      id: node.id,
      name: node.name,
      sales: node.sales
    });

    node.children.forEach(traverse);
  }

  nodes.forEach(traverse);

  return result;
}
```

***

### Example

```javascript
const flattened =
  flattenTree(tree);

console.log(flattened);
```

### Output

```javascript
[
  {
    id: 1,
    name: "Electronics",
    sales: 0
  },
  {
    id: 2,
    name: "Mobile",
    sales: 1000
  },
  {
    id: 4,
    name: "iPhone",
    sales: 2000
  },
  {
    id: 5,
    name: "Samsung",
    sales: 1500
  },
  {
    id: 3,
    name: "Laptop",
    sales: 3000
  }
]
```

***

# 3. Flatten While Preserving Parent Information

Useful for tables and reporting.

```javascript
function flattenTree(nodes) {
  const result = [];

  function traverse(node, parentId = null) {
    result.push({
      id: node.id,
      name: node.name,
      parentId,
      sales: node.sales
    });

    node.children.forEach(child =>
      traverse(child, node.id)
    );
  }

  nodes.forEach(node =>
    traverse(node)
  );

  return result;
}
```

### Output

```javascript
[
  {
    id: 1,
    name: "Electronics",
    parentId: null
  },
  {
    id: 2,
    name: "Mobile",
    parentId: 1
  },
  {
    id: 4,
    name: "iPhone",
    parentId: 2
  },
  {
    id: 5,
    name: "Samsung",
    parentId: 2
  },
  {
    id: 3,
    name: "Laptop",
    parentId: 1
  }
]
```

***

# React Example: Display Aggregated Tree Data

```jsx
function CategoryTree({ nodes }) {
  return (
    <ul>
      {nodes.map(node => (
        <li key={node.id}>
          {node.name}
          {" - "}
          Sales:
          {" "}
          {node.totalSales}

          {node.children.length > 0 && (
            <CategoryTree
              nodes={node.children}
            />
          )}
        </li>
      ))}
    </ul>
  );
}
```

### Usage

```jsx
tree.forEach(aggregateSales);

<CategoryTree nodes={tree} />;
```

### UI

```text
Electronics - Sales: 7500
 ├─ Mobile - Sales: 4500
 │   ├─ iPhone - Sales: 2000
 │   └─ Samsung - Sales: 1500
 └─ Laptop - Sales: 3000
```

***

# Interview Pattern

### Aggregate Children → Parent

```javascript
function aggregate(node) {
  return node.value +
    node.children.reduce(
      (sum, child) =>
        sum + aggregate(child),
      0
    );
}
```

### Flatten Tree

```javascript
DFS Traversal
Parent
→ Child
→ Grandchild
```

### Complexity

#### Aggregate

```text
Time: O(n)
Space: O(h)
```

#### Flatten

```text
Time: O(n)
Space: O(n)
```

Where:

* `n` = total nodes
* `h` = height of the tree

### Senior Interview Answer

> To aggregate numeric values from children to parents, use a post-order DFS traversal where each child computes its total before the parent sums those totals. To flatten hierarchical data, perform a DFS traversal and push each visited node into a result array, optionally carrying parent metadata for reporting or table rendering.
