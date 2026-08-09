Setting up an **End-to-End Correlation ID (`x-request-id`)** allows you to trace a single user interaction from a button click in React all the way through Node.js middleware, asynchronous backend processing, database queries, and external API requests—even when aggregating logs in Sentry, Datadog, or CloudWatch.

Here is a complete production guide to implementing correlation IDs across React (Axios / Fetch) and Node.js (Express / AsyncLocalStorage / Logger).

---

### End-to-End Architecture Flow

```text
┌────────────────────────────────────────────────────────┐
│ REACT FRONTEND                                         │
│ 1. Axios Interceptor generates unique UUID             │
│ 2. Attaches `x-request-id` header to outgoing request  │
└───────────────────────────┬────────────────────────────┘
                            │
                            │ HTTP GET /api/orders
                            │ Header: x-request-id: 9b1deb4d-3b7d...
                            ▼
┌────────────────────────────────────────────────────────┐
│ NODE.JS / EXPRESS BACKEND                              │
│ 3. Express Middleware extracts or generates ID         │
│ 4. Stores ID in `AsyncLocalStorage` (Execution Context)│
│ 5. Logger (Winston/Pino) automatically attaches ID     │
│ 6. Appends `x-request-id` to outgoing response headers │
└────────────────────────────────────────────────────────┘

```

---

### Step 1: React Frontend Setup

The frontend is responsible for generating a unique ID (UUID v4) for every outgoing request (or reusing an existing transaction ID across a session) and passing it in the HTTP headers.

#### Option A: Using Axios Interceptors

```javascript
// src/api/axiosClient.js
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || 'https://api.example.com',
});

// Request Interceptor: Attach x-request-id
api.interceptors.request.use((config) => {
  // Use existing request ID or generate a new UUID
  const requestId = config.headers['x-request-id'] || uuidv4();
  config.headers['x-request-id'] = requestId;

  return config;
});

// Response Interceptor: Capture request ID in error logs
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const requestId = error.config?.headers?.['x-request-id'];
    console.error(`[API Error] Request ID: ${requestId}`, error);
    
    // Attach to error monitoring (e.g., Sentry)
    if (window.Sentry) {
      window.Sentry.configureScope((scope) => {
        scope.setTag('request_id', requestId);
      });
    }

    return Promise.reject(error);
  }
);

export default api;

```

#### Option B: Using Custom `fetch` Wrapper

```javascript
// src/api/fetchClient.js
import { v4 as uuidv4 } from 'uuid';

export async function customFetch(url, options = {}) {
  const requestId = uuidv4();

  const headers = {
    'Content-Type': 'application/json',
    'x-request-id': requestId,
    ...options.headers,
  };

  try {
    const response = await fetch(url, { ...options, headers });
    return response;
  } catch (error) {
    console.error(`Fetch failed for Request ID [${requestId}]:`, error);
    throw error;
  }
}

```

---

### Step 2: Node.js Backend Setup

The backend uses Node's native `AsyncLocalStorage` module (from `async_hooks`). This allows any function—whether in a service layer, database model, or logger—to access the current request's ID without needing to pass `req` through every function parameter!

#### 1. Create Request Context Store (`requestContext.js`)

```javascript
// requestContext.js
const { AsyncLocalStorage } = require('async_hooks');

const asyncLocalStorage = new AsyncLocalStorage();

/**
 * Get current request ID from any deep function inside the call stack
 */
const getRequestId = () => {
  const store = asyncLocalStorage.getStore();
  return store ? store.get('requestId') : 'NO_REQUEST_ID';
};

module.exports = {
  asyncLocalStorage,
  getRequestId,
};

```

#### 2. Create Express Middleware (`requestIdMiddleware.js`)

```javascript
// requestIdMiddleware.js
const { v4 as uuidv4 } = require('uuid');
const { asyncLocalStorage } = require('./requestContext');

const requestIdMiddleware = (req, res, next) => {
  // Extract x-request-id from incoming header, or generate a new one
  const requestId = req.headers['x-request-id'] || uuidv4();

  // Set response header so frontend can correlate responses
  res.setHeader('x-request-id', requestId);

  // Initialize store context for the lifetime of this HTTP request
  const store = new Map();
  store.set('requestId', requestId);

  asyncLocalStorage.run(store, () => {
    next();
  });
};

module.exports = requestIdMiddleware;

```

#### 3. Integrate with Winston / Pino Logger (`logger.js`)

Configure your logger to automatically append `requestId` to every single log entry.

```javascript
// logger.js
const { createLogger, format, transports } = require('winston');
const { getRequestId } = require('./requestContext');

// Format plugin to inject request ID automatically
const addRequestId = format((info) => {
  info.requestId = getRequestId();
  return info;
});

const logger = createLogger({
  level: 'info',
  format: format.combine(
    addRequestId(),
    format.timestamp(),
    format.json() // Structured JSON format for Datadog / CloudWatch / ELK
  ),
  transports: [new transports.Console()],
});

module.exports = logger;

```

---

### Step 3: Server Entry Point & Usage (`server.js`)

```javascript
const express = require('express');
const requestIdMiddleware = require('./requestIdMiddleware');
const logger = require('./logger');

const app = express();

app.use(express.json());

// Attach Correlation ID Middleware BEFORE routes
app.use(requestIdMiddleware);

// Example Service Function (No need to pass req or requestId!)
async function processOrder(orderId) {
  logger.info(`Processing order ${orderId} in database...`);
  // Log output: {"level":"info","message":"Processing order 101 in database...","requestId":"9b1deb4d...","timestamp":"2026-08-10T..."}
}

app.get('/api/orders/:id', async (req, res) => {
  logger.info(`Received fetch request for order ID: ${req.params.id}`);
  
  await processOrder(req.params.id);

  res.json({ success: true, orderId: req.params.id });
});

app.listen(5000, () => logger.info('Server running on port 5000'));

```

---

### Step 4: Propagating Correlation IDs to Microservices / Downstream APIs

If your Express backend calls external microservices or third-party APIs using Axios, propagate the incoming `x-request-id` header:

```javascript
// backend/apiClient.js
const axios = require('axios');
const { getRequestId } = require('./requestContext');

const externalApiClient = axios.create({
  baseURL: 'https://payment-service.internal',
});

// Outgoing Request Interceptor: Forward correlation ID downstream
externalApiClient.interceptors.request.use((config) => {
  config.headers['x-request-id'] = getRequestId();
  return config;
});

module.exports = externalApiClient;

```

---

### Log Output Example (End-to-End Trace)

When a user clicks "Submit Order", all your log lines across services share the **exact same ID**:

```json
{"timestamp":"2026-08-10T01:47:00Z","level":"info","requestId":"c3a1029e-4a92-4e20","message":"[Frontend] User clicked Submit Order"}
{"timestamp":"2026-08-10T01:47:01Z","level":"info","requestId":"c3a1029e-4a92-4e20","message":"[Express API] Received POST /api/checkout"}
{"timestamp":"2026-08-10T01:47:02Z","level":"info","requestId":"c3a1029e-4a92-4e20","message":"[Payment Service] Processing Stripe payload"}
{"timestamp":"2026-08-10T01:47:03Z","level":"error","requestId":"c3a1029e-4a92-4e20","message":"[Payment Service] Card Declined"}

```

In Datadog, ELK, or CloudWatch, searching `requestId: "c3a1029e-4a92-4e20"` will instantly surface the complete cross-service execution path!
