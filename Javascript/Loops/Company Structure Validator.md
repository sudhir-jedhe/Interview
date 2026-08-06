# Company Structure Validator (Uber Frontend Interview)

Based on public references, **Company Structure Validator** is an organisational hierarchy validation problem that tests:

- Graphs
- DFS
- Cycle Detection
- Tree Validation
- Data Structures
- Recursion [\[linkedin.com\]](https://www.linkedin.com/posts/yomeshgupta_sharing-some-interesting-frontend-interview-activity-7353997366212907010-7bJR), [\[github.com\]](https://github.com/anshpayal/org-hierarchy-validator)

---

## Problem Statement

Given employee data:

```js
const employees = [
  {
    id: 1,
    name: "CEO",
    managerId: null,
  },
  {
    id: 2,
    name: "Manager A",
    managerId: 1,
  },
  {
    id: 3,
    name: "Developer",
    managerId: 2,
  },
];
```

Validate that:

### Rules

✅ Exactly one CEO

✅ Every manager exists

✅ No circular reporting

✅ Employee cannot manage himself

✅ Organisation is connected

✅ No orphan employees

---

# Expected Output

```js
{
  valid: true,
  errors: []
}
```

or

```js
{
  valid: false,
  errors: [
    "Employee 7 reports to non-existing manager",
    "Cycle detected"
  ]
}
```

---

# Complete Solution

```js
function validateCompanyStructure(employees) {
  const errors = [];

  const employeeMap = new Map();

  for (const employee of employees) {
    employeeMap.set(employee.id, employee);
  }

  /*
   -------------------------
   Rule 1: One CEO
   -------------------------
  */

  const ceos = employees.filter((employee) => employee.managerId === null);

  if (ceos.length !== 1) {
    errors.push("There must be exactly one CEO");
  }

  /*
   -------------------------
   Rule 2: Manager Exists
   -------------------------
  */

  for (const employee of employees) {
    if (employee.managerId !== null && !employeeMap.has(employee.managerId)) {
      errors.push(`Employee ${employee.id} reports to non-existing manager`);
    }
  }

  /*
   -------------------------
   Rule 3: Self Reporting
   -------------------------
  */

  for (const employee of employees) {
    if (employee.id === employee.managerId) {
      errors.push(`Employee ${employee.id} reports to himself`);
    }
  }

  /*
   -------------------------
   Rule 4: Cycle Detection
   -------------------------
  */

  const visiting = new Set();

  const visited = new Set();

  function hasCycle(id) {
    if (visiting.has(id)) {
      return true;
    }

    if (visited.has(id)) {
      return false;
    }

    visiting.add(id);

    const employee = employeeMap.get(id);

    if (employee && employee.managerId !== null) {
      if (hasCycle(employee.managerId)) {
        return true;
      }
    }

    visiting.delete(id);
    visited.add(id);

    return false;
  }

  for (const employee of employees) {
    if (hasCycle(employee.id)) {
      errors.push("Cycle detected in hierarchy");
      break;
    }
  }

  /*
   -------------------------
   Rule 5: Connected Org
   -------------------------
  */

  if (ceos.length === 1) {
    const ceo = ceos[0];

    const graph = new Map();

    for (const employee of employees) {
      graph.set(employee.id, []);
    }

    for (const employee of employees) {
      if (employee.managerId !== null) {
        graph.get(employee.managerId).push(employee.id);
      }
    }

    const seen = new Set();

    function dfs(id) {
      seen.add(id);

      const reports = graph.get(id);

      for (const child of reports) {
        if (!seen.has(child)) {
          dfs(child);
        }
      }
    }

    dfs(ceo.id);

    if (seen.size !== employees.length) {
      errors.push("Organization contains orphan employees");
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
```

---

# Example 1 (Valid)

```js
const employees = [
  {
    id: 1,
    managerId: null,
  },
  {
    id: 2,
    managerId: 1,
  },
  {
    id: 3,
    managerId: 2,
  },
];

console.log(validateCompanyStructure(employees));
```

Output:

```js
{
  valid: true,
  errors: []
}
```

---

# Example 2 (Cycle)

```js
const employees = [
  {
    id: 1,
    managerId: 2,
  },
  {
    id: 2,
    managerId: 1,
  },
];
```

Output:

```js
{
  valid: false,
  errors: [
    "Cycle detected in hierarchy"
  ]
}
```

---

# Example 3 (Missing Manager)

```js
const employees = [
  {
    id: 1,
    managerId: null,
  },
  {
    id: 2,
    managerId: 99,
  },
];
```

Output:

```js
{
  valid: false,
  errors: [
    "Employee 2 reports to non-existing manager"
  ]
}
```

---

# TypeScript Version

```ts
interface Employee {
  id: number;
  name: string;
  managerId: number | null;
}
```

Everything else remains the same.

---

# Complexity

### Building Map

```text
O(n)
```

### Manager Validation

```text
O(n)
```

### DFS Cycle Check

```text
O(n)
```

### Connectivity Check

```text
O(n)
```

### Total

```text
Time: O(n)

Space: O(n)
```

---

# Senior Interview Follow-ups

Interviewers often extend with:

### Find CEO

```js
getCEO();
```

### Get Direct Reports

```js
getDirectReports(id);
```

### Get Entire Reporting Tree

```js
getHierarchy(id);
```

### Find Lowest Common Manager

```text
Developer A
Developer B

→ Common Manager
```

### Maximum Hierarchy Depth

```js
getMaxDepth();
```

### Salary Validation

Some company hierarchy validator variants add rules such as checking manager salary ranges and reporting depth limits. [\[github.com\]](https://github.com/luckylowkesh/company-hierarchy-validator), [\[deepwiki.com\]](https://deepwiki.com/pankajofksms/salary-analysis/3-validation)

This solution demonstrates the key concepts interviewers usually want to see: **Map-based lookup, graph modelling, DFS traversal, cycle detection, connectivity validation, and hierarchy integrity checks**.

Here's my take: Validating a company structure—whether expressed as a JSON hierarchy, an adjacency list, or an organizational tree—is a classic graph problem.

To be considered a **valid hierarchy**, an organizational chart must form a directed tree or forest (a collection of trees) with **no reporting cycles**, **at most one direct manager per employee**, and **exactly one designated root node** (like a CEO) per independent hierarchy.

---

### Core Structural Validation Rules

When validating employee reporting lines (e.g., `id`, `name`, `managerId`), a robust validator checks for four specific violations:

1. **Self-Reporting:** An employee cannot report to themselves (`employee.id === employee.managerId`).
2. **Circular Reporting (Cycles):** A loop where A manages B, B manages C, and C manages A.
3. **Orphan / Missing Manager:** An employee references a `managerId` that does not exist in the employee database.
4. **Multiple CEOs / Roots:** Every employee except the top leader must have a `managerId`. If multiple employees have `managerId = null`, there are disjointed companies or invalid leadership setup.

---

### Interactive Company Structure Validator Tool

Below is an interactive validator sandbox. You can adjust employee counts, adjust max span of control, or toggle structural errors (like cycles or broken manager IDs) to see real-time validation checks and detect structural flaws:

---

### Production JavaScript Validator Implementation

If you are implementing this on a backend or in a JavaScript/TypeScript frontend, here is a complete, cycle-detecting validation algorithm using Depth-First Search (DFS):

```javascript
/**
 * Validates a company reporting hierarchy.
 * @param {Array<{id: string, name: string, managerId: string|null}>} employees
 */
function validateCompanyStructure(employees) {
  const errors = [];
  const warnings = [];
  const employeeMap = new Map();
  let ceoCount = 0;

  // 1. Map lookup and Self-Reporting Check
  employees.forEach((emp) => {
    employeeMap.set(emp.id, emp);
    if (emp.managerId === null) {
      ceoCount++;
    } else if (emp.id === emp.managerId) {
      errors.push(
        `Self-Reporting Error: ${emp.name} (ID: ${emp.id}) is set as their own manager.`,
      );
    }
  });

  // 2. Validate Root CEO count
  if (ceoCount === 0) {
    errors.push(
      "Missing Root Error: No CEO / root manager found (everyone has a managerId).",
    );
  } else if (ceoCount > 1) {
    warnings.push(
      `Multiple Roots Warning: Found ${ceoCount} employees with no manager. Organization is fragmented.`,
    );
  }

  // 3. Check for Missing Manager References & Detect Cycles via DFS
  const visited = new Set();
  const recursionStack = new Set();

  function detectCycle(empId, path = []) {
    if (!empId) return false;

    // Missing Manager ID check
    if (!employeeMap.has(empId)) {
      errors.push(
        `Dangling Reference Error: Manager ID '${empId}' does not exist in employee list.`,
      );
      return false;
    }

    if (recursionStack.has(empId)) {
      const cyclePath = [...path, empId].join(" -> ");
      errors.push(
        `Circular Dependency Error: Reporting loop detected (${cyclePath}).`,
      );
      return true;
    }

    if (visited.has(empId)) return false;

    visited.add(empId);
    recursionStack.add(empId);
    path.push(empId);

    const emp = employeeMap.get(empId);
    if (emp.managerId) {
      detectCycle(emp.managerId, path);
    }

    recursionStack.delete(empId);
    path.pop();
  }

  // Run DFS from all employees to catch cycles in disconnected subgraphs
  employees.forEach((emp) => {
    if (!visited.has(emp.id)) {
      detectCycle(emp.id);
    }
  });

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

// Example Execution:
const companyData = [
  { id: "1", name: "Alice (CEO)", managerId: null },
  { id: "2", name: "Bob (VP Tech)", managerId: "1" },
  { id: "3", name: "Charlie (Dev Lead)", managerId: "2" },
  { id: "4", name: "Diana (Dev)", managerId: "3" },
  // Cycle bug: Charlie reports back to Diana!
  // { id: "3", name: "Charlie", managerId: "4" }
];

console.log(validateCompanyStructure(companyData));
```

How do you write a function to convert a flat array of employees with managerIds into a nested tree structure for rendering org charts?

Here's my take: Converting a flat array of employees into a nested tree structure is one of the most common data transformation tasks in front-end development, especially when building org charts, multi-level dropdowns, or file trees.

The optimal approach accomplishes this in **$\mathcal{O}(n)$ time complexity** (a single pass to map references, and a second pass to assemble parent-child links) using JavaScript object references.

---

### The $\mathcal{O}(n)$ Object-Reference Algorithm

Instead of using recursive searching or repeated `.filter()` operations (which take $\mathcal{O}(n^2)$ quadratic time), we use a `Map` (or standard object) to store references to all employees. Because objects in JavaScript are passed by reference, pushing a child to `manager.children` immediately updates the tree everywhere that manager appears.

```javascript
/**
 * Transforms a flat employee array into a nested organizational tree.
 *
 * @param {Array<Object>} employees - Array of employee objects with id and managerId
 * @param {string|null} [rootId=null] - The managerId value that denotes top-level nodes (usually null or undefined)
 * @returns {Array<Object>} Array of top-level root node(s) with nested `children`
 */
function buildOrgTree(employees, rootId = null) {
  const nodeMap = new Map();
  const roots = [];

  // Step 1: Create a shallow copy of each employee object and add a children array
  employees.forEach((emp) => {
    nodeMap.set(emp.id, { ...emp, children: [] });
  });

  // Step 2: Assemble the tree by linking children to their respective manager
  employees.forEach((emp) => {
    const node = nodeMap.get(emp.id);
    const managerId = emp.managerId;

    // Check if this employee is a root node (e.g. CEO with managerId = null)
    if (managerId === rootId || managerId === undefined || managerId === null) {
      roots.push(node);
    } else {
      const parentNode = nodeMap.get(managerId);
      if (parentNode) {
        parentNode.children.push(node);
      } else {
        // Fallback: If managerId points to an ID that doesn't exist, treat as an orphan/root
        console.warn(
          `Orphan node detected: ${emp.name} (ID: ${emp.id}) references missing manager ${managerId}`,
        );
        roots.push(node);
      }
    }
  });

  return roots;
}
```

---

### Input vs. Output Example

#### Input Data (Flat Array)

```javascript
const flatEmployees = [
  { id: "1", name: "Alice", role: "CEO", managerId: null },
  { id: "2", name: "Bob", role: "VP of Engineering", managerId: "1" },
  { id: "3", name: "Charlie", role: "VP of Sales", managerId: "1" },
  { id: "4", name: "Diana", role: "Engineering Lead", managerId: "2" },
  { id: "5", name: "Evan", role: "Senior Developer", managerId: "4" },
  { id: "6", name: "Fiona", role: "Account Executive", managerId: "3" },
];

const tree = buildOrgTree(flatEmployees);
console.log(JSON.stringify(tree, null, 2));
```

#### Transformed Output (Nested Tree)

```json
[
  {
    "id": "1",
    "name": "Alice",
    "role": "CEO",
    "managerId": null,
    "children": [
      {
        "id": "2",
        "name": "Bob",
        "role": "VP of Engineering",
        "managerId": "1",
        "children": [
          {
            "id": "4",
            "name": "Diana",
            "role": "Engineering Lead",
            "managerId": "2",
            "children": [
              {
                "id": "5",
                "name": "Evan",
                "role": "Senior Developer",
                "managerId": "4",
                "children": []
              }
            ]
          }
        ]
      },
      {
        "id": "3",
        "name": "Charlie",
        "role": "VP of Sales",
        "managerId": "1",
        "children": [
          {
            "id": "6",
            "name": "Fiona",
            "role": "Account Executive",
            "managerId": "3",
            "children": []
          }
        ]
      }
    ]
  }
]
```

---

### Alternative: One-Pass Functional Approach (`Array.prototype.reduce`)

If you prefer a concise functional approach, you can perform both steps inside a single `.reduce()` call:

```javascript
function buildOrgTreeReduce(employees) {
  const map = {};
  const roots = [];

  // Initialize all nodes in map first to handle out-of-order data
  for (const emp of employees) {
    map[emp.id] = { ...emp, children: [] };
  }

  for (const emp of employees) {
    if (emp.managerId && map[emp.managerId]) {
      map[emp.managerId].children.push(map[emp.id]);
    } else {
      roots.push(map[emp.id]);
    }
  }

  return roots;
}
```

---

### Performance & Edge Case Comparison

| Feature / Scenario      | Map Reference Approach                                           | Recursive `.filter()` Approach                            |
| ----------------------- | ---------------------------------------------------------------- | --------------------------------------------------------- |
| **Time Complexity**     | $\mathcal{O}(n)$ — Linear pass                                   | $\mathcal{O}(n^2)$ or $\mathcal{O}(n \log n)$ — Quadratic |
| **Space Complexity**    | $\mathcal{O}(n)$                                                 | $\mathcal{O}(n)$ plus call stack space                    |
| **Unordered Input**     | Works automatically (handles children appearing before managers) | Order dependent                                           |
| **Dangling References** | Safe fallback handling                                           | Can silently drop elements                                |

Show how to calculate total direct and indirect report counts for every manager in a company hierarchy.

Here's my take: To calculate the total number of **direct** and **indirect** reports for every manager in a company hierarchy, you can use a post-order tree traversal (Depth-First Search).

By starting at the bottom leaf nodes (individual contributors) and bubbling up the totals to their managers, you calculate the entire company's reporting metrics in **$\mathcal{O}(n)$ linear time** with zero redundant work.

---

### The Two Core Metrics

1. **Direct Reports (`directCount`):** The number of employees who report _immediately_ to this manager (`managerId === manager.id`). This is simply `node.children.length`.
2. **Indirect Reports (`indirectCount`):** The total number of employees in the entire reporting tree below this manager, _excluding_ direct reports.

- **Total Headcount Managed (`totalCount`):** $\text{directCount} + \text{indirectCount}$.

---

### Implementation: Bottom-Up Dynamic Aggregation

The function below takes a nested org tree (or converts a flat array into one on the fly) and recursively attaches `.directCount`, `.indirectCount`, and `.totalCount` to every employee node in the tree.

```javascript
/**
 * Recursively calculates direct and indirect report counts for an org tree.
 * Modifies nodes in-place (or returns copies) with reporting metrics.
 *
 * @param {Object} node - The current employee/manager node in the tree
 * @returns {number} The total count of reports (direct + indirect) under this node
 */
function calculateReportMetrics(node) {
  // Base Case: Leaf node (Individual contributor with no children)
  if (!node.children || node.children.length === 0) {
    node.directCount = 0;
    node.indirectCount = 0;
    node.totalCount = 0;
    return 0; // Contributes 0 reports below itself
  }

  // Direct reports count is simply the length of immediate children
  node.directCount = node.children.length;

  let totalReportsUnderChildren = 0;

  // Post-order traversal: Process all children first to gather their totals
  for (const child of node.children) {
    // Each child adds 1 (the child itself) + all reports managed under that child
    const childTotalSubtree = calculateReportMetrics(child);
    totalReportsUnderChildren += 1 + childTotalSubtree;
  }

  node.totalCount = totalReportsUnderChildren;
  node.indirectCount = node.totalCount - node.directCount;

  return node.totalCount;
}

/**
 * Wrapper function that accepts either a flat array or a nested tree.
 */
function annotateOrgMetrics(treeOrFlatArray) {
  // If array input, build tree first
  const tree = Array.isArray(treeOrFlatArray)
    ? buildOrgTree(treeOrFlatArray)
    : [treeOrFlatArray];

  // Process all root nodes (e.g. CEO or independent department heads)
  tree.forEach((rootNode) => calculateReportMetrics(rootNode));

  return tree;
}
```

---

### Example Execution & Output

Given a 4-level organization:

- **Alice (CEO)**
- **Bob (VP of Eng)**
- **Diana (Tech Lead)** $\to$ **Evan (Dev)**, **Frank (Dev)**

- **Charlie (VP of Sales)** $\to$ **Grace (Account Exec)**

```javascript
const orgTree = [
  {
    id: "1",
    name: "Alice",
    role: "CEO",
    children: [
      {
        id: "2",
        name: "Bob",
        role: "VP Eng",
        children: [
          {
            id: "4",
            name: "Diana",
            role: "Tech Lead",
            children: [
              { id: "5", name: "Evan", role: "Dev", children: [] },
              { id: "6", name: "Frank", role: "Dev", children: [] },
            ],
          },
        ],
      },
      {
        id: "3",
        name: "Charlie",
        role: "VP Sales",
        children: [{ id: "7", name: "Grace", role: "AE", children: [] }],
      },
    ],
  },
];

annotateOrgMetrics(orgTree);

// Let's inspect the calculated metrics:
console.log(orgTree[0]);
```

#### Metrics Result Summary:

| Employee                 | Direct Reports       | Indirect Reports                  | Total Subtree Managed |
| ------------------------ | -------------------- | --------------------------------- | --------------------- |
| **Alice (CEO)**          | **2** (Bob, Charlie) | **4** (Diana, Evan, Frank, Grace) | **6**                 |
| **Bob (VP Eng)**         | **1** (Diana)        | **2** (Evan, Frank)               | **3**                 |
| **Charlie (VP Sales)**   | **1** (Grace)        | **0**                             | **1**                 |
| **Diana (Tech Lead)**    | **2** (Evan, Frank)  | **0**                             | **2**                 |
| **Evan / Frank / Grace** | **0**                | **0**                             | **0**                 |

---

### Working directly with Flat Arrays (Alternative)

If you need to query metrics for specific employees without building the full tree, you can maintain a **parent map** and increment counts for all ancestor nodes when iterating through each employee:

```javascript
function calculateMetricsFromFlatArray(employees) {
  const metricsMap = new Map();
  const parentMap = new Map();

  // Step 1: Initialize metrics and map parent links
  employees.forEach((emp) => {
    metricsMap.set(emp.id, { directCount: 0, indirectCount: 0, totalCount: 0 });
    parentMap.set(emp.id, emp.managerId);
  });

  // Step 2: For each employee, walk UP the management chain
  employees.forEach((emp) => {
    let currentManagerId = emp.managerId;
    let distance = 1;

    while (currentManagerId && metricsMap.has(currentManagerId)) {
      const managerMetrics = metricsMap.get(currentManagerId);

      if (distance === 1) {
        managerMetrics.directCount += 1;
      } else {
        managerMetrics.indirectCount += 1;
      }
      managerMetrics.totalCount += 1;

      // Move one level up
      currentManagerId = parentMap.get(currentManagerId);
      distance++;
    }
  });

  return metricsMap;
}
```

---

### Algorithm Efficiency Comparison

| Approach                   | Time Complexity          | Space Complexity                                       | Best For                                             |
| -------------------------- | ------------------------ | ------------------------------------------------------ | ---------------------------------------------------- |
| **Tree Post-Order DFS**    | $\mathcal{O}(n)$         | $\mathcal{O}(h)$ call stack ($h = \text{tree height}$) | UI org chart trees and hierarchical component state  |
| **Flat Parent-Chain Walk** | $\mathcal{O}(n \cdot h)$ | $\mathcal{O}(n)$ hash map                              | Database query batch processing & fast lookup tables |

How do you render a nested org tree structure recursively in React with expandable/collapsible nodes?

Here's my take: Rendering a nested org tree recursively in React requires breaking the tree down into a self-referential `TreeNode` component.

To handle **expand/collapse state**, each node manages its own local boolean state (`isOpen`). When toggled, it conditionally renders its `children` array—which automatically handles arbitrarily deep hierarchies without needing complex global state management.

---

### Complete Working React Implementation

Here is a modern, styled component example using standard HTML/CSS and Lucide icons (represented here with standard SVG/text symbols for clean portability).

```jsx
import React, { useState } from "react";

// Sample Nested Org Data
const initialOrgData = {
  id: "1",
  name: "Alice Johnson",
  role: "Chief Executive Officer",
  department: "Executive",
  children: [
    {
      id: "2",
      name: "Bob Smith",
      role: "VP of Engineering",
      department: "Engineering",
      children: [
        {
          id: "4",
          name: "Diana Prince",
          role: "Engineering Lead",
          department: "Engineering",
          children: [
            {
              id: "5",
              name: "Evan Wright",
              role: "Senior Dev",
              department: "Engineering",
            },
            {
              id: "6",
              name: "Fiona Gallagher",
              role: "Frontend Dev",
              department: "Engineering",
            },
          ],
        },
        {
          id: "7",
          name: "George Clark",
          role: "QA Lead",
          department: "Engineering",
        },
      ],
    },
    {
      id: "3",
      name: "Charlie Davis",
      role: "VP of Sales",
      department: "Sales",
      children: [
        {
          id: "8",
          name: "Hannah Abbott",
          role: "Account Executive",
          department: "Sales",
        },
      ],
    },
  ],
};

// 1. Recursive Tree Node Component
function OrgTreeNode({ node, level = 0 }) {
  const [isOpen, setIsOpen] = useState(true);
  const hasChildren = node.children && node.children.length > 0;

  const toggleExpand = (e) => {
    e.stopPropagation();
    setIsOpen((prev) => !prev);
  };

  return (
    <div
      className="org-node-container"
      style={{ marginLeft: level > 0 ? "24px" : "0px" }}
    >
      {/* Node Card UI */}
      <div className="node-card">
        {/* Toggle Button for Expand/Collapse */}
        {hasChildren ? (
          <button
            onClick={toggleExpand}
            className="toggle-btn"
            aria-label={isOpen ? "Collapse branch" : "Expand branch"}
          >
            {isOpen ? "▼" : "►"}
          </button>
        ) : (
          <span className="toggle-spacer" />
        )}

        <div className="node-details">
          <div className="node-header">
            <span className="node-name">{node.name}</span>
            {hasChildren && (
              <span className="badge">{node.children.length} direct</span>
            )}
          </div>
          <div className="node-role">{node.role}</div>
          <div className="node-dept">{node.department}</div>
        </div>
      </div>

      {/* 2. Recursive Step: Render Children if Expanded */}
      {hasChildren && isOpen && (
        <div className="node-children-branch">
          {node.children.map((childNode) => (
            <OrgTreeNode
              key={childNode.id}
              node={childNode}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// 2. Main Org Tree Container
export default function OrgTree() {
  return (
    <div className="org-tree-wrapper">
      <h2>Company Hierarchy</h2>
      <OrgTreeNode node={initialOrgData} />
    </div>
  );
}
```

---

### Accompanying CSS Styles (`OrgTree.css`)

Add this styling to provide clear visual depth, visual tree lines (indents), and clean card layout:

```css
.org-tree-wrapper {
  font-family:
    -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  max-width: 600px;
  margin: 20px auto;
  padding: 20px;
  background: #0f172a;
  color: #f8fafc;
  border-radius: 12px;
}

.org-node-container {
  position: relative;
  margin-top: 8px;
}

/* Optional connector line on the left side of expanded branches */
.node-children-branch {
  border-left: 2px dashed #334155;
  margin-left: 12px;
  padding-left: 8px;
}

.node-card {
  display: flex;
  align-items: center;
  gap: 12px;
  background: #1e293b;
  border: 1px solid #334155;
  padding: 10px 14px;
  border-radius: 8px;
  transition: border-color 0.2s ease;
}

.node-card:hover {
  border-color: #38bdf8;
}

.toggle-btn {
  background: #334155;
  color: #38bdf8;
  border: none;
  width: 24px;
  height: 24px;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
}

.toggle-spacer {
  width: 24px;
}

.node-details {
  display: flex;
  flex-direction: column;
}

.node-header {
  display: flex;
  align-items: center;
  gap: 8px;
}

.node-name {
  font-weight: 600;
  font-size: 0.95rem;
}

.node-role {
  font-size: 0.8rem;
  color: #94a3b8;
}

.node-dept {
  font-size: 0.7rem;
  color: #38bdf8;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-top: 2px;
}

.badge {
  background: #0f172a;
  color: #94a3b8;
  font-size: 0.7rem;
  padding: 2px 6px;
  border-radius: 10px;
  border: 1px solid #334155;
}
```

---

### Key React Concepts at Work

1. **Self-Referencing Component:** Inside `OrgTreeNode`, the component calls itself (`<OrgTreeNode node="{childNode}"/>`) for every child object.
2. **Local State Isolation:** Placing `const [isOpen, setIsOpen] = useState(true)` inside `OrgTreeNode` ensures that clicking "expand" or "collapse" on one branch **only affects that specific subtree**, leaving parent and sibling nodes untouched.
3. **Base Termination Condition:** The recursion terminates naturally when `node.children` is empty or `undefined`.
4. **Performance optimization:** For massive trees (thousands of employees), you can pass a top-level `expandedNodeIds` `Set` or wrap individual nodes with `React.memo` to prevent re-rendering unaffected branches during updates.

Show how to calculate total direct and indirect report counts for every manager in a company hierarchy.

Here's my take: To calculate the total number of **direct** and **indirect** reports for every manager in a company hierarchy, you can use a post-order tree traversal (Depth-First Search).

By starting at the bottom leaf nodes (individual contributors) and bubbling up the totals to their managers, you calculate the entire company's reporting metrics in **$\mathcal{O}(n)$ linear time** with zero redundant work.

---

### The Two Core Metrics

1. **Direct Reports (`directCount`):** The number of employees who report _immediately_ to this manager (`managerId === manager.id`). This is simply `node.children.length`.
2. **Indirect Reports (`indirectCount`):** The total number of employees in the entire reporting tree below this manager, _excluding_ direct reports.

- **Total Headcount Managed (`totalCount`):** $\text{directCount} + \text{indirectCount}$.

---

### Implementation: Bottom-Up Dynamic Aggregation

The function below takes a nested org tree (or converts a flat array into one on the fly) and recursively attaches `.directCount`, `.indirectCount`, and `.totalCount` to every employee node in the tree.

```javascript
/**
 * Recursively calculates direct and indirect report counts for an org tree.
 * Modifies nodes in-place (or returns copies) with reporting metrics.
 *
 * @param {Object} node - The current employee/manager node in the tree
 * @returns {number} The total count of reports (direct + indirect) under this node
 */
function calculateReportMetrics(node) {
  // Base Case: Leaf node (Individual contributor with no children)
  if (!node.children || node.children.length === 0) {
    node.directCount = 0;
    node.indirectCount = 0;
    node.totalCount = 0;
    return 0; // Contributes 0 reports below itself
  }

  // Direct reports count is simply the length of immediate children
  node.directCount = node.children.length;

  let totalReportsUnderChildren = 0;

  // Post-order traversal: Process all children first to gather their totals
  for (const child of node.children) {
    // Each child adds 1 (the child itself) + all reports managed under that child
    const childTotalSubtree = calculateReportMetrics(child);
    totalReportsUnderChildren += 1 + childTotalSubtree;
  }

  node.totalCount = totalReportsUnderChildren;
  node.indirectCount = node.totalCount - node.directCount;

  return node.totalCount;
}

/**
 * Wrapper function that accepts either a flat array or a nested tree.
 */
function annotateOrgMetrics(treeOrFlatArray) {
  // If array input, build tree first
  const tree = Array.isArray(treeOrFlatArray)
    ? buildOrgTree(treeOrFlatArray)
    : [treeOrFlatArray];

  // Process all root nodes (e.g. CEO or independent department heads)
  tree.forEach((rootNode) => calculateReportMetrics(rootNode));

  return tree;
}
```

---

### Example Execution & Output

Given a 4-level organization:

- **Alice (CEO)**
- **Bob (VP of Eng)**
- **Diana (Tech Lead)** $\to$ **Evan (Dev)**, **Frank (Dev)**

- **Charlie (VP of Sales)** $\to$ **Grace (Account Exec)**

```javascript
const orgTree = [
  {
    id: "1",
    name: "Alice",
    role: "CEO",
    children: [
      {
        id: "2",
        name: "Bob",
        role: "VP Eng",
        children: [
          {
            id: "4",
            name: "Diana",
            role: "Tech Lead",
            children: [
              { id: "5", name: "Evan", role: "Dev", children: [] },
              { id: "6", name: "Frank", role: "Dev", children: [] },
            ],
          },
        ],
      },
      {
        id: "3",
        name: "Charlie",
        role: "VP Sales",
        children: [{ id: "7", name: "Grace", role: "AE", children: [] }],
      },
    ],
  },
];

annotateOrgMetrics(orgTree);

// Inspect the calculated metrics:
console.log(orgTree[0]);
```

#### Metrics Result Summary:

| Employee                 | Direct Reports       | Indirect Reports                  | Total Subtree Managed |
| ------------------------ | -------------------- | --------------------------------- | --------------------- |
| **Alice (CEO)**          | **2** (Bob, Charlie) | **4** (Diana, Evan, Frank, Grace) | **6**                 |
| **Bob (VP Eng)**         | **1** (Diana)        | **2** (Evan, Frank)               | **3**                 |
| **Charlie (VP Sales)**   | **1** (Grace)        | **0**                             | **1**                 |
| **Diana (Tech Lead)**    | **2** (Evan, Frank)  | **0**                             | **2**                 |
| **Evan / Frank / Grace** | **0**                | **0**                             | **0**                 |

---

### Working directly with Flat Arrays (Alternative)

If you need to query metrics for specific employees without building the full tree, you can maintain a **parent map** and increment counts for all ancestor nodes when iterating through each employee:

```javascript
function calculateMetricsFromFlatArray(employees) {
  const metricsMap = new Map();
  const parentMap = new Map();

  // Step 1: Initialize metrics and map parent links
  employees.forEach((emp) => {
    metricsMap.set(emp.id, { directCount: 0, indirectCount: 0, totalCount: 0 });
    parentMap.set(emp.id, emp.managerId);
  });

  // Step 2: For each employee, walk UP the management chain
  employees.forEach((emp) => {
    let currentManagerId = emp.managerId;
    let distance = 1;

    while (currentManagerId && metricsMap.has(currentManagerId)) {
      const managerMetrics = metricsMap.get(currentManagerId);

      if (distance === 1) {
        managerMetrics.directCount += 1;
      } else {
        managerMetrics.indirectCount += 1;
      }
      managerMetrics.totalCount += 1;

      // Move one level up
      currentManagerId = parentMap.get(currentManagerId);
      distance++;
    }
  });

  return metricsMap;
}
```

---

### Algorithm Efficiency Comparison

| Approach                   | Time Complexity          | Space Complexity                                       | Best For                                             |
| -------------------------- | ------------------------ | ------------------------------------------------------ | ---------------------------------------------------- |
| **Tree Post-Order DFS**    | $\mathcal{O}(n)$         | $\mathcal{O}(h)$ call stack ($h = \text{tree height}$) | UI org chart trees and hierarchical component state  |
| **Flat Parent-Chain Walk** | $\mathcal{O}(n \cdot h)$ | $\mathcal{O}(n)$ hash map                              | Database query batch processing & fast lookup tables |
