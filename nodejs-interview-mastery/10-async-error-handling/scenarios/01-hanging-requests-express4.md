# Scenario: Requests Hang Indefinitely Under Express 4, No Error Logged Anywhere

Your monitoring shows `GET /api/reports/:id` occasionally never returns — no 500, no timeout log, nothing. It only happens when the report ID doesn't exist in the database.

**Approach:**
This is almost certainly the classic async-handler bug: a `throw` (or a rejected `await`) inside an `async` route handler that Express 4 doesn't catch automatically. Audit every async route for a missing try/catch, then standardize on an `asyncHandler` wrapper repo-wide so this class of bug can't recur.

```js
// before (bug): throws inside async handler, Express 4 never sees it
app.get('/api/reports/:id', async (req, res) => {
  const report = await db.reports.findById(req.params.id);
  if (!report) throw new NotFoundError('Report'); // silently hangs the request
  res.json({ data: report });
});

// after (fixed): wrap every async route handler
const asyncHandler = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

app.get('/api/reports/:id', asyncHandler(async (req, res) => {
  const report = await db.reports.findById(req.params.id);
  if (!report) throw new NotFoundError('Report');
  res.json({ data: report });
}));

app.use((err, req, res, next) => {
  const status = err.status || 500;
  res.status(status).json({ error: { message: err.message } });
});
```
As a longer-term fix, consider migrating to Express 5, which forwards async rejections to error middleware automatically — but keep the wrapper pattern for any codebase still on Express 4.
