// app.js — application entrypoint.

const express = require('express');
const authRouter = require('./routes/auth');
const protectedRouter = require('./routes/protected');

const app = express();
app.use(express.json());

app.get('/health', (req, res) => res.json({ data: { status: 'ok' } }));

app.use('/', authRouter);
app.use('/', protectedRouter);

app.use((req, res) => {
  res.status(404).json({ error: { message: 'No such route' } });
});

// centralized error handler — last middleware in the stack
app.use((err, req, res, next) => { // eslint-disable-line no-unused-vars
  console.error(err.stack || err);
  res.status(err.status || 500).json({ error: { message: 'Something went wrong' } });
});

const PORT = process.env.PORT || 3000;
if (require.main === module) {
  app.listen(PORT, () => console.log(`auth-demo listening on port ${PORT}`));
}

module.exports = app;
