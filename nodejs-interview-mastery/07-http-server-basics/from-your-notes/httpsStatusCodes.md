Below is a complete production-style Express.js API example demonstrating:

✅ HTTP status handling
✅ Success responses (200, 201, 204)
✅ Validation errors (422)
✅ Authentication errors (401)
✅ Authorisation errors (403)
✅ Not Found (404)
✅ Conflict (409)
✅ Rate Limit (429)
✅ Internal Server Error (500)
✅ Global Error Middleware
✅ TraceId support
✅ Structured error responses

Internal API guidance recommends consistent HTTP status codes, standardised error responses, trace/correlation IDs, and global exception handling.

Folder Structure
src/
├── app.js
├── routes/
│ └── users.js
├── middleware/
│ ├── errorHandler.js
│ └── traceMiddleware.js
├── errors/
│ ├── AppError.js
│ ├── ValidationError.js
│ ├── NotFoundError.js
│ └── ConflictError.js

AppError.js
class AppError extends Error {
constructor(
message,
statusCode,
code,
details = null
) {
super(message);

    this.statusCode = statusCode;
    this.code = code;
    this.details = details;

    Error.captureStackTrace(
      this,
      this.constructor
    );

}
}

module.exports = AppError;

Custom Errors
const AppError = require("./AppError");

class ValidationError extends AppError {
constructor(details) {
super(
"Validation failed",
422,
"VALIDATION_ERROR",
details
);
}
}

class NotFoundError extends AppError {
constructor(resource) {
super(
`${resource} not found`,
404,
"NOT_FOUND"
);
}
}

class ConflictError extends AppError {
constructor(message) {
super(
message,
409,
"CONFLICT"
);
}
}

module.exports = {
ValidationError,
NotFoundError,
ConflictError
};

TraceId Middleware
const crypto = require("crypto");

module.exports = (
req,
res,
next
) => {

req.traceId =
crypto.randomUUID();

res.setHeader(
"X-Trace-Id",
req.traceId
);

next();
};

Global Error Middleware
module.exports = (
err,
req,
res,
next
) => {

console.error({
traceId: req.traceId,
code: err.code,
message: err.message,
stack: err.stack
});

res.status(
err.statusCode || 500
).json({
success: false,
code:
err.code ||
"INTERNAL_ERROR",

    message:
      err.statusCode === 500
        ? "Internal Server Error"
        : err.message,

    details:
      err.details || null,

    traceId:
      req.traceId,

    timestamp:
      new Date().toISOString()

});
};

This pattern aligns with internal recommendations for structured logging and standardised API error handling.

Users Route
const express = require("express");

const router = express.Router();

const {
ValidationError,
NotFoundError,
ConflictError
} = require("../errors");

let users = [
{
id: 1,
email: "john@test.com",
role: "user"
}
];

200 OK
router.get("/", (req, res) => {

res.status(200).json({
success: true,
data: users
});
});

Response:

{
"success": true,
"data": [...]
}

201 Created
router.post("/", (req, res, next) => {

try {

    const { email } = req.body;

    if (!email) {
      throw new ValidationError([
        {
          field: "email",
          message: "Email is required"
        }
      ]);
    }

    const exists =
      users.find(
        u => u.email === email
      );

    if (exists) {
      throw new ConflictError(
        "Email already exists"
      );
    }

    const user = {
      id: Date.now(),
      email
    };

    users.push(user);

    res.status(201).json({
      success: true,
      data: user
    });

} catch (err) {
next(err);
}
});

Internal REST conventions recommend 201 Created for successful resource creation.

204 No Content
router.delete(
"/:id",
(req, res, next) => {

    try {

      const index =
        users.findIndex(
          u =>
            u.id ===
            Number(req.params.id)
        );

      if (index === -1) {
        throw new NotFoundError(
          "User"
        );
      }

      users.splice(index, 1);

      res.status(204).send();

    } catch (err) {
      next(err);
    }

}
);

REST guidelines recommend 204 No Content for successful deletes.

401 Unauthorized
router.get(
"/profile",
(req, res, next) => {

    try {

      const token =
        req.headers.authorization;

      if (!token) {

        return res.status(401).json({
          success: false,
          code: "UNAUTHORIZED",
          message: "Token missing"
        });
      }

      res.json({
        profile: "user"
      });

    } catch (err) {
      next(err);
    }

}
);

403 Forbidden
router.get(
"/admin",
(req, res) => {

    const role = "USER";

    if (role !== "ADMIN") {

      return res.status(403).json({
        success: false,
        code: "FORBIDDEN",
        message:
          "Access denied"
      });
    }

    res.json({
      secureData: true
    });

}
);

404 Not Found
router.get(
"/:id",
(req, res, next) => {

    try {

      const user =
        users.find(
          u =>
            u.id ===
            Number(req.params.id)
        );

      if (!user) {
        throw new NotFoundError(
          "User"
        );
      }

      res.json(user);

    } catch (err) {
      next(err);
    }

}
);

422 Validation Error

Response:

{
"success": false,
"code": "VALIDATION_ERROR",
"message": "Validation failed",
"details": [
{
"field": "email",
"message": "Email is required"
}
],
"traceId": "abc123"
}

Structured validation responses are a recommended pattern in internal API guidance.

429 Too Many Requests
const rateLimit =
require("express-rate-limit");

app.use(
rateLimit({
windowMs: 15 _ 60 _ 1000,
max: 100,

    handler(req, res) {

      res.status(429).json({
        success: false,
        code:
          "RATE_LIMIT_EXCEEDED",
        message:
          "Too many requests",

        traceId:
          req.traceId
      });
    }

})
);

500 Internal Server Error
router.get(
"/crash",
(req, res) => {

    throw new Error(
      "Database failure"
    );

}
);

Response:

{
"success": false,
"code": "INTERNAL_ERROR",
"message": "Internal Server Error",
"traceId": "abc123"
}

Internal guidance recommends returning standardised error bodies without exposing sensitive implementation details.

app.js
const express =
require("express");

const app = express();

const routes =
require("./routes/users");

const traceMiddleware =
require("./middleware/traceMiddleware");

const errorHandler =
require("./middleware/errorHandler");

app.use(express.json());

app.use(traceMiddleware);

app.use("/api/users", routes);

app.use(errorHandler);

app.listen(3000, () =>
console.log(
"Server running on port 3000"
)
);

Expected Status Code Cheat Sheet
200 OK → GET Success
201 Created → Resource Created
204 No Content → Delete Success

400 Bad Request → Invalid Request
401 Unauthorized → Authentication Failed
403 Forbidden → Permission Denied
404 Not Found → Resource Missing
409 Conflict → Duplicate Resource
422 Validation Error → Business Validation Failed
429 Too Many Requests → Rate Limit Exceeded

500 Internal Error → Unexpected Error
503 Service Unavailable → Service Down
504 Gateway Timeout → Upstream Timeout

This is a typical Senior Node.js / Express production-ready error handling pattern that interviewers often expect for backend API design discussions.

Internal guidance recommends structured JSON logging, correlation/trace IDs, standardised error responses, and centralised observability for APIs.

1. Handling Custom Error Messages

A common pattern is to create custom error classes and let a global error middleware format the response consistently.

Custom Error Base Class
class AppError extends Error {
constructor(
message,
statusCode,
code,
details = null
) {
super(message);

    this.statusCode = statusCode;
    this.code = code;
    this.details = details;

    Error.captureStackTrace(
      this,
      this.constructor
    );

}
}

module.exports = AppError;

Validation Error
class ValidationError extends AppError {
constructor(field, message) {
super(
"Validation failed",
422,
"VALIDATION_ERROR",
[
{
field,
message
}
]
);
}
}

Route Usage
app.post("/users", (req, res, next) => {

try {

    const { email } = req.body;

    if (!email) {
      throw new ValidationError(
        "email",
        "Email is required"
      );
    }

    res.status(201).json({
      success: true
    });

} catch (err) {
next(err);
}
});

Response
{
"success": false,
"code": "VALIDATION_ERROR",
"message": "Validation failed",
"details": [
{
"field": "email",
"message": "Email is required"
}
],
"traceId": "abc123"
}

This aligns with the recommendation for standardised API error formats and structured error bodies.

2. Middleware for Logging Requests
   Simple Logging Middleware
   app.use((req, res, next) => {

const start = Date.now();

res.on("finish", () => {

    console.log({
      method: req.method,
      url: req.originalUrl,
      statusCode: res.statusCode,
      durationMs:
        Date.now() - start
    });

});

next();
});

Production Logging Middleware
const crypto = require("crypto");

app.use((req, res, next) => {

const start = Date.now();

req.traceId =
crypto.randomUUID();

res.on("finish", () => {

    logger.info({
      traceId: req.traceId,
      method: req.method,
      path: req.originalUrl,
      statusCode: res.statusCode,
      durationMs:
        Date.now() - start,
      ip: req.ip
    });

});

next();
});

Example Output:

{
"traceId":"abc123",
"method":"POST",
"path":"/api/users",
"statusCode":201,
"durationMs":45
}

Internal logging guidance specifically recommends structured logging, correlation IDs, and JSON-formatted logs.

3. Common HTTP Status Codes and Meanings
   Success Codes (2xx)
   200 OK

Request successful.

GET /users/101

Returns:

{
"id": 101
}

201 Created

New resource created.

POST /users

Internal REST conventions recommend 201 Created for resource creation.

204 No Content

Successful request with no body.

DELETE /users/101

Internal REST conventions recommend 204 No Content for delete operations.

Client Errors (4xx)
400 Bad Request

Malformed request.

{
"message": "Invalid JSON"
}

401 Unauthorized

Authentication required.

{
"message": "Invalid token"
}

403 Forbidden

Authenticated but no permission.

{
"message": "Access denied"
}

404 Not Found

Resource doesn't exist.

{
"message": "User not found"
}

Internal REST guidance uses 404 when a resource is missing.

409 Conflict

Duplicate resource or conflict.

{
"message": "Email already exists"
}

415 Unsupported Media Type

Unsupported file upload type.

{
"message": "Only PDF allowed"
}

422 Unprocessable Entity

Validation failed.

{
"message": "Email is required"
}

Internal interview examples reference 422 Unprocessable Entity for validation issues.

429 Too Many Requests

Rate limit exceeded.

{
"message": "Too many requests"
}

API security guidance recommends throttling and quotas to protect APIs.

Server Errors (5xx)
500 Internal Server Error

Unexpected server failure.

{
"message":
"Internal Server Error"
}

503 Service Unavailable

System temporarily unavailable.

{
"message":
"Service unavailable"
}

504 Gateway Timeout

Dependency service timeout.

{
"message":
"Gateway timeout"
}

Senior Interview Cheat Sheet
200 OK → Successful GET
201 Created → Resource Created
204 No Content → Successful DELETE

400 Bad Request → Invalid Request
401 Unauthorized → Authentication Failed
403 Forbidden → No Permission
404 Not Found → Resource Missing
409 Conflict → Duplicate Resource
415 Unsupported Media → Wrong File Type
422 Validation Error → Business Validation Failed
429 Too Many Requests → Rate Limited

500 Internal Error → Unexpected Error
503 Unavailable → Service Down
504 Gateway Timeout → Upstream Timeout

Senior interview tip: Always return a consistent error format:

{
"success": false,
"code": "USER_NOT_FOUND",
"message": "User not found",
"traceId": "abc123",
"timestamp": "2026-07-14T10:00:00Z"
}

This provides better debugging, observability, and client-side error handling.

I found several internal references recommending:

Custom exception hierarchies
Global exception filters/middleware
Structured JSON logging
Correlation/trace IDs
Standardised error response contracts

1.  Custom Error Middleware Example (Express.js)
    Custom Error Classes
    class AppError extends Error {
    constructor(
    message,
    statusCode,
    code,
    details = null
    ) {
    super(message);

        this.statusCode = statusCode;
        this.code = code;
        this.details = details;

        Error.captureStackTrace(
          this,
          this.constructor
        );

    }
    }

class ValidationError extends AppError {
constructor(errors) {
super(
"Validation failed",
422,
"VALIDATION_ERROR",
errors
);
}
}

class NotFoundError extends AppError {
constructor(resource) {
super(
`${resource} not found`,
404,
"NOT_FOUND"
);
}
}

Global Error Middleware
const logger = require("./logger");

function errorMiddleware(
err,
req,
res,
next
) {

logger.error({
traceId: req.traceId,
code: err.code,
message: err.message,
stack: err.stack,
endpoint: req.originalUrl
});

res.status(
err.statusCode || 500
).json({
success: false,

    code:
      err.code ||
      "INTERNAL_ERROR",

    message:
      err.statusCode === 500
        ? "Internal Server Error"
        : err.message,

    details:
      err.details || null,

    traceId:
      req.traceId,

    timestamp:
      new Date().toISOString()

});
}

module.exports = errorMiddleware;

This follows the internal recommendation of using clear exception hierarchies, global exception handling, and consistent API error response formats.

Route Usage
app.get(
"/users/:id",
async (req, res, next) => {

    try {

      const user =
        await userService.findById(
          req.params.id
        );

      if (!user) {
        throw new NotFoundError(
          "User"
        );
      }

      res.json(user);

    } catch (err) {
      next(err);
    }

}
);

Response:

{
"success": false,
"code": "NOT_FOUND",
"message": "User not found",
"traceId": "abc123"
}

2. Structured Logging Best Practices

Internal guidance explicitly recommends:

Structured logging (JSON)
Correlation IDs
Appropriate log levels
Centralised log aggregation
Distributed tracing
✅ Log JSON, Not Plain Strings
Bad
console.log(
"User 101 placed order"
);

Good
logger.info({
userId: 101,
orderId: 5001,
message: "Order placed"
});

✅ Include Trace IDs
logger.error({
traceId: req.traceId,
error: err.message
});

Internal guidance states correlation IDs should be present in log entries for distributed tracing.

✅ Log at Correct Severity
Level UsageTRACE Detailed diagnostics
DEBUG Development debugging
INFO Successful operations
WARN Retries / slow operations
ERROR Application failures
FATAL System outages

These levels are documented in internal coding guidelines.

✅ Never Log Sensitive Data

❌ Avoid

{
"password":"admin123",
"token":"jwt"
}

✅ Mask

{
"password":"**_",
"token":"_**"
}

Avoiding sensitive information in logs is a documented best practice.

✅ Log Useful Context
{
"traceId": "abc123",
"userId": "101",
"service": "user-service",
"endpoint": "/api/users",
"method": "POST",
"statusCode": 422,
"durationMs": 145
}

Internal structured logging standards identify fields such as timestamp, service name, trace ID, correlation ID, message and HTTP metadata.

✅ Use Centralised Logging

Examples:

ELK Stack
Splunk
Application Insights
Datadog

Internal architecture guidance recommends centralised logging and observability platforms.

3. HTTP Status Codes for Client Errors (4xx)

Client errors mean the client must fix the request.

Code Meaning Example400 Bad Request Invalid JSON
401 Unauthorized Missing JWT
403 Forbidden No permission
404 Not Found User doesn't exist
405 Method Not Allowed POST on GET endpoint
406 Not Acceptable Unsupported Accept header
408 Request Timeout Client timeout
409 Conflict Duplicate email
410 Gone Resource permanently removed
412 Precondition Failed ETag mismatch
413 Payload Too Large File exceeds limit
415 Unsupported Media Type Invalid file type
422 Unprocessable Entity Validation failed
423 Locked Resource locked
429 Too Many Requests Rate limit exceeded
Example 400
{
"code": "BAD_REQUEST",
"message": "Invalid request payload"
}

Example 401
{
"code": "UNAUTHORIZED",
"message": "Invalid token"
}

Example 403
{
"code": "FORBIDDEN",
"message": "Access denied"
}

Example 404
{
"code": "NOT_FOUND",
"message": "User not found"
}

Internal REST guidance specifically mentions 404 for missing resources and structured error responses.

Example 422
{
"code": "VALIDATION_ERROR",
"message": "Validation failed",
"errors": [
{
"field": "email",
"message": "Email is required"
}
]
}

Internal interview material explicitly references 422 for validation failures.

Example 429
{
"code": "RATE_LIMIT_EXCEEDED",
"message": "Too many requests",
"retryAfter": 120
}

Senior Interview Answer

Use a global error middleware that converts custom exceptions into a standard API contract. Log structured JSON with traceId, service, endpoint, statusCode, and errorCode, and centralise logs for observability. For client-side failures, use precise 4xx status codes such as 400, 401, 403, 404, 409, 422, and 429 instead of returning generic 500 errors.

HTTP Status Codes for Server Errors (5xx)

5xx status codes indicate that the request was valid, but the server failed to fulfil it due to an internal problem, a dependency failure, or a temporary outage. Internal API guidance emphasises using proper status codes, structured error responses, and well-defined error handling for server-side failures.

500 Internal Server Error

Meaning: An unexpected error occurred on the server.

Common Causes
Unhandled exceptions
Database failures
Null reference errors
Configuration issues
Example
GET /api/users/101

Response:

500 Internal Server Error

{
"code": "INTERNAL_ERROR",
"message": "Internal Server Error",
"traceId": "abc123"
}

501 Not Implemented

Meaning: The server does not support the requested functionality.

Example
POST /api/reports/export-excel

Response:

501 Not Implemented

{
"code": "NOT_IMPLEMENTED",
"message": "Feature not implemented"
}

Use Cases
Feature under development
Unsupported HTTP method
Placeholder endpoint
502 Bad Gateway

Meaning: The server (usually an API Gateway or proxy) received an invalid response from an upstream service.

Architecture
Client
↓
API Gateway
↓
Payment Service

Payment Service returns invalid response.

Response:

502 Bad Gateway

Example
{
"code": "BAD_GATEWAY",
"message": "Invalid upstream response"
}

API gateway architectures and downstream service integrations are common enterprise patterns.

503 Service Unavailable

Meaning: The service is temporarily unavailable.

Common Causes
Maintenance window
High traffic
Server overload
Dependency outage

Response:

503 Service Unavailable

{
"code": "SERVICE_UNAVAILABLE",
"message": "Service temporarily unavailable"
}

Best Practice

Include:

Retry-After: 120

504 Gateway Timeout

Meaning: An upstream service took too long to respond.

Example
Client
↓
API Gateway
↓
Order Service
↓
Payment Service (timeout)

Response:

504 Gateway Timeout

{
"code": "GATEWAY_TIMEOUT",
"message": "Upstream service timeout"
}

507 Insufficient Storage

Meaning: Server cannot store the representation required to complete the request.

Example
POST /api/upload

{
"code": "INSUFFICIENT_STORAGE",
"message": "Storage quota exceeded"
}

Recommended Error Response Format

Internal guidance recommends standardised error contracts, correlation IDs, and structured logging.

{
"success": false,
"code": "SERVICE_UNAVAILABLE",
"message": "Service temporarily unavailable",
"traceId": "abc123",
"timestamp": "2026-07-14T10:00:00Z"
}

Server Error Cheat Sheet
500 Internal Server Error
→ Unexpected application error

501 Not Implemented
→ Feature not implemented

502 Bad Gateway
→ Invalid response from downstream service

503 Service Unavailable
→ Service temporarily unavailable

504 Gateway Timeout
→ Downstream service timed out

507 Insufficient Storage
→ Storage capacity exhausted

Senior Interview Answer

500 is used for unexpected application errors, 502 when a gateway receives an invalid upstream response, 503 when the service is temporarily unavailable, and 504 when a downstream service times out. In production systems, always return structured error responses containing an error code, message, and traceId, while logging the full exception details internally.

The internal material recommends creating custom error types by extending the Error class and handling them centrally rather than adding repetitive try/catch logic everywhere.

Custom Error Handling in Async Routes (Express.js)

1.  Create Custom Error Classes
    class AppError extends Error {
    constructor(
    message,
    statusCode,
    code = "INTERNAL_ERROR"
    ) {
    super(message);

        this.statusCode = statusCode;
        this.code = code;

        Error.captureStackTrace(
          this,
          this.constructor
        );

    }
    }

class ValidationError extends AppError {
constructor(message) {
super(
message,
422,
"VALIDATION_ERROR"
);
}
}

class NotFoundError extends AppError {
constructor(resource) {
super(
`${resource} not found`,
404,
"NOT_FOUND"
);
}
}

module.exports = {
AppError,
ValidationError,
NotFoundError
};

This follows the pattern of extending the built-in Error class with custom error types.

2. Async Handler Wrapper

Instead of adding try/catch to every route:

const asyncHandler =
(fn) =>
(req, res, next) => {
Promise
.resolve(fn(req, res, next))
.catch(next);
};

module.exports = asyncHandler;

3. Async Route Example
   const express = require("express");

const router = express.Router();

const asyncHandler =
require("./asyncHandler");

const {
ValidationError,
NotFoundError
} = require("./errors");

GET User Route
router.get(
"/users/:id",

asyncHandler(
async (req, res) => {

      const user =
        await userService.findById(
          req.params.id
        );

      if (!user) {
        throw new NotFoundError(
          "User"
        );
      }

      res.status(200).json({
        success: true,
        data: user
      });
    }

)
);

POST User Route
router.post(
"/users",

asyncHandler(
async (req, res) => {

      const {
        name,
        email
      } = req.body;

      if (!email) {
        throw new ValidationError(
          "Email is required"
        );
      }

      const user =
        await userService.create(
          req.body
        );

      res.status(201).json({
        success: true,
        data: user
      });
    }

)
);

4. Global Error Middleware
   function errorMiddleware(
   err,
   req,
   res,
   next
   ) {

console.error({
error: err.message,
code: err.code
});

res.status(
err.statusCode || 500
).json({
success: false,

    code:
      err.code ||
      "INTERNAL_ERROR",

    message:
      err.message,

    timestamp:
      new Date().toISOString()

});
}

module.exports = errorMiddleware;

Register last:

app.use(errorMiddleware);

5. Validation Error Response
   422 Unprocessable Entity

{
"success": false,
"code": "VALIDATION_ERROR",
"message": "Email is required"
}

6. Not Found Response
   404 Not Found

{
"success": false,
"code": "NOT_FOUND",
"message": "User not found"
}

7. Unexpected Error Response
   500 Internal Server Error

{
"success": false,
"code": "INTERNAL_ERROR",
"message": "Internal Server Error"
}

Production-Ready Version with Trace ID
app.use((req, res, next) => {
req.traceId =
crypto.randomUUID();
next();
});

function errorMiddleware(
err,
req,
res,
next
) {

console.error({
traceId: req.traceId,
error: err.message,
stack: err.stack
});

res.status(
err.statusCode || 500
).json({
success: false,
code:
err.code ||
"INTERNAL_ERROR",

    message: err.message,

    traceId:
      req.traceId,

    timestamp:
      new Date().toISOString()

});
}

Senior Interview Answer

In Express applications, I create custom exception classes such as ValidationError, NotFoundError, and AppError, throw them from async routes or service layers, use an asyncHandler wrapper to forward promise rejections automatically, and centralise response formatting in a global error middleware. This ensures consistent error responses, cleaner route code, and easier observability.
