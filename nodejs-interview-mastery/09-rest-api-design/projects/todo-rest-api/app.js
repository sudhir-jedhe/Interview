// app.js — application entrypoint: wires up middleware, routes, and the
// centralized error handler in the correct order.

const express = require('express');
const todosRouter = require('./routes/todos');
const errorHandler = require('./middleware/errorHandler');

const app = express();
app.use(express.json());

app.get('/health', (req, res) => res.json({ data: { status: 'ok' } }));

app.use('/', todosRouter);

// catch-all for unmatched routes — same error envelope as everything else
app.use((req, res) => {
  res.status(404).json({ error: { code: 'ROUTE_NOT_FOUND', message: 'No such route' } });
});

// error-handling middleware must be registered last
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
if (require.main === module) {
  app.listen(PORT, () => console.log(`todo-rest-api listening on port ${PORT}`));
}

module.exports = app;
