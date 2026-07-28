The **Breadcrumb Chain Problem** is a popular Frontend/JavaScript machine coding interview question.

---

# Problem Statement

Given a URL:

```text
/home/products/electronics/mobile/iphone-15
```

Generate breadcrumbs:

```text
Home > Products > Electronics > Mobile > iPhone 15
```

Output:

```js
[
  { label: "Home", url: "/" },
  { label: "Products", url: "/products" },
  { label: "Electronics", url: "/products/electronics" },
  { label: "Mobile", url: "/products/electronics/mobile" },
  { label: "iPhone 15", url: null },
];
```

The last item represents the current page and is not clickable.

Breadcrumbs are a common UI pattern used to show the current location within a hierarchy, typically in the form `Home → Category → Subcategory → Current Page`. [\[eleken.co\]](https://www.eleken.co/blog-posts/breadcrumbs-ux), [\[martinuke0.github.io\]](https://martinuke0.github.io/posts/2025-12-17-breadcrumbs-in-ux-and-seo-a-complete-guide-to-design-implementation-and-best-practices/)

---

# Approach

### Step 1

Split URL

```js
"/products/electronics/mobile";
```

↓

```js
["products", "electronics", "mobile"];
```

---

### Step 2

Build cumulative paths

```js
products;

products / electronics;

products / electronics / mobile;
```

---

### Step 3

Generate breadcrumb objects

```js
[
  {
    label: "Products",
    url: "/products",
  },
];
```

---

# Solution

```js
function generateBreadcrumbs(path) {
  const segments = path.split("/").filter(Boolean);

  const breadcrumbs = [
    {
      label: "Home",
      url: "/",
    },
  ];

  let currentPath = "";

  segments.forEach((segment, index) => {
    currentPath += `/${segment}`;

    breadcrumbs.push({
      label: formatLabel(segment),
      url: index === segments.length - 1 ? null : currentPath,
    });
  });

  return breadcrumbs;
}

function formatLabel(str) {
  return str
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

console.log(generateBreadcrumbs("/products/electronics/mobile/iphone-15"));
```

---

# Output

```js
[
  {
    label: "Home",
    url: "/",
  },
  {
    label: "Products",
    url: "/products",
  },
  {
    label: "Electronics",
    url: "/products/electronics",
  },
  {
    label: "Mobile",
    url: "/products/electronics/mobile",
  },
  {
    label: "Iphone 15",
    url: null,
  },
];
```

---

# React Component

```jsx
function Breadcrumbs({ path }) {
  const items =
    generateBreadcrumbs(path);

  return (
    <div>
      {items.map(
        (item, index) => (
          <span key={index}>
            {item.url ? (
              {item.url}
                {item.label}
              </a>
            ) : (
              <strong>
                {item.label}
              </strong>
            )}

            {index <
              items.length -
                1 && " > "}
          </span>
        )
      )}
    </div>
  );
}
```

---

# Follow-Up Interview Questions

### 1. Dynamic Routes

```text
/products/:id
```

Convert:

```text
/products/123
```

to

```text
Products > iPhone 15
```

Need API lookup.

---

### 2. Collapse Long Breadcrumbs

```text
Home > ... > Mobile > iPhone 15
```

Used for deep hierarchies.

---

### 3. Nested Menu Structure

Input:

```js
{
  id: 5,
  name: "iPhone",
  parentId: 4
}
```

Build breadcrumb by traversing parents:

```text
Home
 └─ Products
     └─ Electronics
         └─ Mobile
             └─ iPhone
```

---

# Hard Variant (Parent Chain)

Given:

```js
const categories = [
  { id: 1, name: "Home", parentId: null },
  { id: 2, name: "Products", parentId: 1 },
  { id: 3, name: "Electronics", parentId: 2 },
  { id: 4, name: "Mobile", parentId: 3 },
  { id: 5, name: "iPhone", parentId: 4 },
];
```

Build:

```text
Home > Products > Electronics > Mobile > iPhone
```

### Optimized Solution

```js
function getBreadcrumb(categories, currentId) {
  const map = new Map();

  categories.forEach((item) => map.set(item.id, item));

  const result = [];

  let current = map.get(currentId);

  while (current) {
    result.unshift(current.name);

    current = map.get(current.parentId);
  }

  return result;
}
```

### Complexity

```text
Time: O(n)
Space: O(n)
```

This parent-chain variant is very common in React/Frontend Lead interviews because it tests HashMap usage, tree traversal, and hierarchy reconstruction.

/********\*\*\*\*********/

Yes. In a React application, a better approach is to generate breadcrumbs directly from the **route configuration** instead of parsing the URL string manually.

This is the approach used in large applications because it supports:

- Dynamic routes (`/products/:id`)
- Permission-based routes
- Lazy-loaded modules
- Nested layouts
- Internationalisation

---

# Solution 1: Route Configuration Driven Breadcrumbs

## Route Config

```tsx
export const routes = [
  {
    path: "/",
    label: "Home",
  },
  {
    path: "/products",
    label: "Products",
  },
  {
    path: "/products/electronics",
    label: "Electronics",
  },
  {
    path: "/products/electronics/mobile",
    label: "Mobile",
  },
  {
    path: "/products/electronics/mobile/:id",
    label: "Product Details",
  },
];
```

---

## Generate Breadcrumbs

```tsx
import { matchPath } from "react-router-dom";

function getBreadcrumbs(pathname) {
  return routes.filter((route) =>
    matchPath(
      {
        path: route.path,
        end: false,
      },
      pathname,
    ),
  );
}
```

### Example

```js
pathname:

/products/electronics/mobile/123
```

Output:

```js
["Home", "Products", "Electronics", "Mobile", "Product Details"];
```

---

# Solution 2: Nested Routes + React Router v6

This is what I would use in a production React application.

## Route Definition

```tsx
const routes = [
  {
    path: "/",
    element: <Home />,
    handle: {
      crumb: () => "Home",
    },
  },

  {
    path: "products",
    element: <Products />,
    handle: {
      crumb: () => "Products",
    },

    children: [
      {
        path: "electronics",

        element: <Electronics />,

        handle: {
          crumb: () => "Electronics",
        },

        children: [
          {
            path: "mobile",

            element: <Mobile />,

            handle: {
              crumb: () => "Mobile",
            },
          },
        ],
      },
    ],
  },
];
```

---

## Breadcrumb Component

```tsx
import { useMatches } from "react-router-dom";

function Breadcrumbs() {
  const matches = useMatches();

  return (
    <nav>
      {matches
        .filter((match) => match.handle?.crumb)
        .map((match) => (
          <span key={match.pathname}>
            {match.handle.crumb(match.data)}
            {" > "}
          </span>
        ))}
    </nav>
  );
}
```

Benefits:

```text
✅ No URL Parsing
✅ Dynamic Routes
✅ Nested Layouts
✅ Server Data
✅ Type Safe
```

---

# Solution 3: Dynamic Breadcrumbs From API

### URL

```text
/products/123
```

You don't want:

```text
Home > Products > 123
```

You want:

```text
Home > Products > iPhone 15
```

---

```tsx
{
  path: "products/:id",

  loader: async ({ params }) =>
      getProduct(params.id),

  handle: {
     crumb: (product) =>
         product.name
  }
}
```

Loader:

```js
{
  id: 123,
  name: "iPhone 15 Pro"
}
```

Breadcrumb:

```text
Home > Products > iPhone 15 Pro
```

---

# Solution 4: Tree-Based Breadcrumbs

If menus come from backend:

```js
const menu = [
  {
    id: 1,
    title: "Products",

    children: [
      {
        id: 2,
        title: "Electronics",

        children: [
          {
            id: 3,
            title: "Mobile",
          },
        ],
      },
    ],
  },
];
```

Find path using DFS:

```js
Products
   ↓
Electronics
   ↓
Mobile
```

Output:

```text
Products > Electronics > Mobile
```

This is common in CMS/Admin Dashboard applications.

---

# Senior React Interview Answer

If asked in an interview:

> "How would you implement breadcrumbs?"

A strong answer is:

> "For simple applications I'd derive breadcrumbs from the URL. For enterprise React applications I'd keep breadcrumb metadata inside the route configuration and use React Router's nested routes with `useMatches()`. That gives automatic breadcrumb generation, supports dynamic route parameters, API-driven labels, permissions, and lazy-loaded modules without duplicating navigation logic."

This is generally the most scalable routing-based solution for modern React applications.
