# Snippet: Awaited unwrapping an async function's resolved type

```typescript
// Awaited<ReturnType<F>> is the standard combo for typing an async result.

async function loadDashboard(userId: string) {
  return {
    userId,
    widgets: ["revenue", "signups", "churn"],
    generatedAt: new Date(),
  };
}

type DashboardResult = Awaited<ReturnType<typeof loadDashboard>>;
// { userId: string; widgets: string[]; generatedAt: Date }

function renderDashboard(data: DashboardResult): string {
  return `Dashboard for ${data.userId} with ${data.widgets.length} widgets`;
}

loadDashboard("u42").then(renderDashboard);
```
