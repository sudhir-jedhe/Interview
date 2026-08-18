# Snippet: Index signature dictionary

Shows an index-signature type used for a dynamic tally of page-view counts by URL path.

```typescript
interface PageViewCounts {
  [path: string]: number;
}

const views: PageViewCounts = {
  "/home": 120,
  "/pricing": 45,
};

views["/about"] = 10; // any new string key works

const total = Object.values(views).reduce((sum, n) => sum + n, 0);
console.log(`Total views: ${total}`);
```
