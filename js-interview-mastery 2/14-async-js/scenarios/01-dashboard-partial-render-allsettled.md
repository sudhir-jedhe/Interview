**You need to fetch data from 3 independent API endpoints to render a dashboard, but the dashboard should still render partially even if one endpoint fails (showing an error state just for that widget). Which combinator do you use, and how do you structure the rendering logic?**

**Approach:**
`Promise.allSettled` is the right tool since it never short-circuits on a single failure and reports every outcome:

```js
async function loadDashboard() {
  const [users, revenue, alerts] = await Promise.allSettled([
    fetchUsers(),
    fetchRevenue(),
    fetchAlerts(),
  ]);

  return {
    users: users.status === 'fulfilled' ? users.value : { error: users.reason },
    revenue: revenue.status === 'fulfilled' ? revenue.value : { error: revenue.reason },
    alerts: alerts.status === 'fulfilled' ? alerts.value : { error: alerts.reason },
  };
}
```
Using `Promise.all` here would be a mistake — a single failing endpoint would reject the whole batch, and even the two successful results would be discarded, leaving the entire dashboard blank instead of degrading gracefully. Each widget checks its own `status` and renders either real data or a per-widget error state.
