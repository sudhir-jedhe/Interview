An enterprise-level error handling architecture in Express.js should meet four core objectives:

1. **Centralized Error Handling:** No duplicated `try/catch` logic across controllers.
2. **Operational vs. Programmer Errors:** Distinguish expected business failures (e.g., $400$ Bad Request, $404$ Not Found) from critical system bugs (e.g., database failures, $500$ Unhandled Runtime Exceptions).
3. **Structured Logging:** Emit machine-readable JSON logs for log aggregators (e.g., Datadog, ELK, AWS CloudWatch).
4. **Security & Data Sanitization:** Never leak stack traces, internal database details, or sensitive metadata to client responses in production.

---

### Project Architecture Overview

```text
src/
├── errors/
│   ├── AppError.js            # Base custom error class
│   └── domainErrors.js        # Specialized HTTP error subclasses
├── middleware/
│   ├── asyncHandler.js         # Async route wrapper
│   └── errorMiddleware.js     # Central Express error handling middleware
├── utils/
│   └── logger.js              # Structured Winston logger configuration
└── app.js                     # Express application setup

```

---

### Step 1: Base Application Error Class (`src/errors/AppError.js`)

Create an abstract base class extending native `Error`. This class flags errors as **operational** (expected) and attaches an HTTP status code.

```javascript
// src/errors/AppError.js
class AppError extends Error {
  /**
   * @param {string} message - Human-readable error description
   * @param {number} statusCode - HTTP status code
   * @param {Object} [details=null] - Additional validation or metadata payload
   */
  constructor(message, statusCode, details = null) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.isOperational = true; // Identifies known operational errors vs unexpected runtime bugs
    this.details = details;

    // Captures the call stack while excluding the constructor frame
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;

```

---

### Step 2: Specialized Domain Error Subclasses (`src/errors/domainErrors.js`)

Create domain-specific subclasses to avoid hardcoding HTTP status codes across business logic.

```javascript
// src/errors/domainErrors.js
const AppError = require('./AppError');

class BadRequestError extends AppError {
  constructor(message = 'Bad Request', details = null) {
    super(message, 400, details);
  }
}

class UnauthorizedError extends AppError {
  constructor(message = 'Unauthorized') {
    super(message, 401);
  }
}

class ForbiddenError extends AppError {
  constructor(message = 'Forbidden') {
    super(message, 403);
  }
}

class NotFoundError extends AppError {
  constructor(message = 'Resource not found') {
    super(message, 404);
  }
}

class ConflictError extends AppError {
  constructor(message = 'Resource conflict') {
    super(message, 409);
  }
}

class InternalServerError extends AppError {
  constructor(message = 'Internal server error') {
    super(message, 500);
    this.isOperational = false; // System failures are non-operational
  }
}

module.exports = {
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  ConflictError,
  InternalServerError,
};

```

---

### Step 3: Structured Logging Setup (`src/utils/logger.js`)

Use **Winston** to format logs as JSON in production for log ingestion services, while maintaining colored human-readable logs during local development.

```javascript
// src/utils/logger.js
const { createLogger, format, transports } = require('winston');

const environment = process.env.NODE_ENV || 'development';

const logger = createLogger({
  level: environment === 'development' ? 'debug' : 'info',
  format: format.combine(
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    format.errors({ stack: true }),
    format.splat(),
    format.json() // Machine-readable JSON for production log aggregators
  ),
  defaultMeta: { service: 'user-service' },
  transports: [
    new transports.Console({
      format: environment === 'development'
        ? format.combine(
            format.colorize(),
            format.printf(({ timestamp, level, message, stack, ...meta }) => {
              const metaString = Object.keys(meta).length ? JSON.stringify(meta) : '';
              return `[${timestamp}] ${level}: ${stack || message} ${metaString}`;
            })
          )
        : format.json()
    })
  ]
});

module.exports = logger;

```

---

### Step 4: Async Handler Wrapper (`src/middleware/asyncHandler.js`)

Wrap all async controllers to automatically route uncaught promises to Express's global error middleware.

```javascript
// src/middleware/asyncHandler.js
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = asyncHandler;

```

---

### Step 5: Centralized Error Handler Middleware (`src/middleware/errorMiddleware.js`)

This middleware handles response formatting, error logging, and operational/non-operational classification.

```javascript
// src/middleware/errorMiddleware.js
const logger = require('../utils/logger');
const AppError = require('../errors/AppError');

/**
 * Normalizes unhandled non-AppError instances into AppError
 */
const normalizeError = (err) => {
  if (err instanceof AppError) return err;

  // Handle common database/syntax third-party errors (e.g., MongoDB, PostgreSQL, JWT)
  if (err.name === 'ValidationError') {
    return new AppError('Validation failed', 400, err.errors);
  }
  if (err.name === 'JsonWebTokenError') {
    return new AppError('Invalid authentication token', 401);
  }

  // Fallback for unknown runtime errors
  const fallbackError = new AppError('An unexpected internal error occurred', 500);
  fallbackError.isOperational = false;
  fallbackError.originalError = err;
  return fallbackError;
};

const errorHandler = (err, req, res, next) => {
  const error = normalizeError(err);
  const isProduction = process.env.NODE_ENV === 'production';

  // 1. Structured Logging
  const logPayload = {
    message: err.message,
    statusCode: error.statusCode,
    isOperational: error.isOperational,
    path: req.originalUrl,
    method: req.method,
    ip: req.ip,
    stack: err.stack,
  };

  if (!error.isOperational) {
    logger.error('CRITICAL UNHANDLED PROGRAMMER ERROR', logPayload);
  } else {
    logger.warn(`Operational Error: ${error.message}`, logPayload);
  }

  // 2. Client Response Formatting
  const responsePayload = {
    success: false,
    error: {
      message: isProduction && !error.isOperational
        ? 'Internal Server Error' // Hide sensitive internal system details in prod
        : error.message,
      ...(error.details && { details: error.details }),
      ...(!isProduction && { stack: err.stack }) // Only include stack traces in dev/test
    }
  };

  res.status(error.statusCode).json(responsePayload);
};

module.exports = errorHandler;

```

---

### Step 6: Server Integration (`src/app.js`)

Assemble the pipeline and handle $404$ routes and process-level crash signals.

```javascript
// src/app.js
const express = require('express');
const asyncHandler = require('./middleware/asyncHandler');
const errorHandler = require('./middleware/errorMiddleware');
const logger = require('./utils/logger');
const { NotFoundError, BadRequestError } = require('./errors/domainErrors');

const app = express();
app.use(express.json());

// --- Sample Controllers ---
app.get('/api/users/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (id === 'invalid') {
    throw new BadRequestError('Invalid user ID format', { field: 'id', expected: 'UUID string' });
  }

  if (id !== '101') {
    throw new NotFoundError(`User with ID ${id} does not exist`);
  }

  res.json({ success: true, data: { id: '101', name: 'Alice' } });
}));

// Route simulating an unexpected runtime crash (e.g., null pointer access)
app.get('/api/crash', asyncHandler(async (req, res) => {
  const obj = null;
  obj.nonExistentMethod(); // Throws TypeError (Non-operational 500 error)
}));

// --- 404 Route Handler ---
app.use((req, res, next) => {
  next(new NotFoundError(`Cannot ${req.method} ${req.originalUrl}`));
});

// --- Centralized Error Middleware (Must be registered LAST) ---
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  logger.info(`Server initialized and running on port ${PORT}`);
});

// -------------------------------------------------------------
// Global Crash Handlers (Process Safety Net)
// -------------------------------------------------------------
const handleFatalCrash = (errorType, error) => {
  logger.crit(`Fatal ${errorType}: ${error.message}`, { stack: error.stack });

  // Gracefully close server connections before exiting
  server.close(() => {
    process.exit(1);
  });

  // Force exit if connections don't close within 5 seconds
  setTimeout(() => process.exit(1), 5000).unref();
};

process.on('unhandledRejection', (reason) => {
  handleFatalCrash('Unhandled Promise Rejection', reason instanceof Error ? reason : new Error(reason));
});

process.on('uncaughtException', (error) => {
  handleFatalCrash('Uncaught Exception', error);
});

```

---

### Architecture Benefits

* **Strict Data Sanitization:** Production responses mask $500$ system bugs as generic `"Internal Server Error"` messages, while operational errors ($400, 401, 404$) safely return informative details.
* **Log Aggregator Friendly:** All outputs are formatted as single-line JSON streams in production, preserving stack traces and execution metadata.
* **Process Recovery:** Uncaught exceptions trigger graceful application shutdowns rather than leaving Node.js in an unstable state.
