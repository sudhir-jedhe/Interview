'use strict';

const express = require('express');
const { requestLogger } = require('./middleware/logger');
const { notFoundHandler, errorHandler } = require('./middleware/errorHandler');
const healthRouter = require('./routes/health');
const usersRouter = require('./routes/users');

function createApp() {
  const app = express();

  // --- global middleware, order matters ---
  app.use(requestLogger());   // logs every request, including ones that 404 or error
  app.use(express.json());    // parses application/json bodies into req.body

  // --- routes ---
  app.use('/health', healthRouter);
  app.use('/users', usersRouter);

  // --- 404 + centralized error handling, always registered last ---
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}

function main() {
  const port = process.env.PORT || 3000;
  const app = createApp();
  app.listen(port, () => {
    console.log(`mini-express-api listening on http://localhost:${port}`);
  });
}

if (require.main === module) {
  main();
}

module.exports = { createApp };
