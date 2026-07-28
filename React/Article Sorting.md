# Article Sorting (React)

Common machine-coding question:

✅ Sort by **Most Upvoted**

✅ Sort by **Newest**

✅ Sort by **Oldest**

✅ Toggle dropdown

✅ `useMemo` optimisation

---

## Sample Data

```jsx
const articles = [
  {
    id: 1,
    title: "React 19",
    upvotes: 150,
    date: "2026-06-01",
  },
  {
    id: 2,
    title: "Redux Toolkit",
    upvotes: 250,
    date: "2026-07-01",
  },
  {
    id: 3,
    title: "TypeScript",
    upvotes: 100,
    date: "2025-12-15",
  },
];
```

---

## Complete Code

```jsx
import { useMemo, useState } from "react";

export default function Articles() {
  const [sortBy, setSortBy] = useState("upvotes");

  const sortedArticles = useMemo(() => {
    const copy = [...articles];

    switch (sortBy) {
      case "upvotes":
        return copy.sort((a, b) => b.upvotes - a.upvotes);

      case "newest":
        return copy.sort((a, b) => new Date(b.date) - new Date(a.date));

      case "oldest":
        return copy.sort((a, b) => new Date(a.date) - new Date(b.date));

      default:
        return copy;
    }
  }, [sortBy]);

  return (
    <div>
      <h1>Articles</h1>

      <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
        <option value="upvotes">Most Upvoted</option>

        <option value="newest">Most Recent</option>

        <option value="oldest">Oldest</option>
      </select>

      <ul>
        {sortedArticles.map((article) => (
          <li key={article.id}>
            <h3>{article.title}</h3>

            <p>Upvotes: {article.upvotes}</p>

            <p>Date: {article.date}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
```

---

## Sorting Logic

### Most Upvoted

```js
b.upvotes - a.upvotes;
```

Result:

```text
250
150
100
```

---

### Most Recent

```js
new Date(b.date) - new Date(a.date);
```

Result:

```text
2026-07-01
2026-06-01
2025-12-15
```

---

### Oldest

```js
new Date(a.date) - new Date(b.date);
```

Result:

```text
2025-12-15
2026-06-01
2026-07-01
```

---

## Interview Version (HackerRank Style)

```jsx
const SORT_OPTIONS = {
  UPVOTES: "upvotes",
  NEWEST: "newest",
  OLDEST: "oldest",
};

function sortArticles(articles, sortBy) {
  const copy = [...articles];

  switch (sortBy) {
    case SORT_OPTIONS.UPVOTES:
      return copy.sort((a, b) => b.upvotes - a.upvotes);

    case SORT_OPTIONS.NEWEST:
      return copy.sort((a, b) => new Date(b.date) - new Date(a.date));

    case SORT_OPTIONS.OLDEST:
      return copy.sort((a, b) => new Date(a.date) - new Date(b.date));

    default:
      return copy;
  }
}
```

### Time Complexity

```text
Sorting: O(n log n)

Rendering: O(n)
```

### Senior Interview Answer

> Store the selected sort option in state, derive the sorted list with `useMemo`, sort by upvotes in descending order for popularity, by descending dates for most recent, and ascending dates for oldest. Avoid mutating the original array by sorting a copied array.
