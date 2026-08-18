I found 3,631 file-related results and 18 meeting-related results in the enterprise search for API interview preparation materials. Relevant internal resources include Java_Interview_Questions.docx, which contains REST API questions commonly asked in client/internal interviews.

Since you're a Senior React/Project Lead, here is a curated list of API Development Interview Questions (Senior Level) that are commonly asked for Node.js, Java Spring Boot, .NET, Microservices, and Full-Stack roles.

1. REST API Fundamentals
   Basic
   What is a RESTful API?
   What are the constraints of REST?
   Difference between REST and SOAP?
   What are HTTP methods?
   Difference between PUT and PATCH?
   Difference between POST and PUT?
   When should you use DELETE?
   What are idempotent APIs?
   What is statelessness in REST?
   What is HATEOAS?
   Expected Answer
   GET = Read
   POST = Create
   PUT = Replace
   PATCH = Partial Update
   DELETE = Remove
2. HTTP & Status Codes
   Questions
   What are common HTTP status codes?
   Difference between 200, 201, 202?
   Difference between 401 and 403?
   What is 404?
   What is 409 Conflict?
   What is 429 Too Many Requests?
   What is 500 vs 503?
   Follow-up

Design status codes for:

Create User
Update User
Validation Error
Duplicate Record
Unauthorized Access 3. API Design Questions
Questions
Design APIs for an e-commerce system.
How do you name resources?
Should verbs be in URLs?
How do you version APIs?
URI vs URL?
What is pagination?
Cursor vs Offset pagination?
How do you implement filtering?
How do you implement sorting?
How do you handle large responses?
Example
GET /users?page=1&size=20

GET /products?category=laptop

GET /products?sort=price,asc

4. Authentication & Authorization
   Most Asked
   Authentication vs Authorization?
   What is JWT?
   Structure of JWT?
   JWT advantages and disadvantages?
   What is OAuth 2.0?
   What is OpenID Connect?
   How do refresh tokens work?
   How would you secure APIs?
   What are API Keys?
   What is Role-Based Access Control?
   Scenario

How would you secure:

POST /transfer-money

5. Microservices API Questions
   Questions
   How do microservices communicate?
   Synchronous vs Asynchronous communication?
   API Gateway pattern?
   Service Discovery?
   Circuit Breaker?
   Retry Mechanism?
   Distributed Tracing?
   Correlation IDs?
   Saga Pattern?
   Event-driven architecture?
6. API Security
   Questions
   How do you prevent SQL Injection?
   How do you prevent XSS?
   What is CSRF?
   How do you secure file upload APIs?
   How do you encrypt communication?
   How do you store secrets?
   What is rate limiting?
   What is throttling?
   What is API abuse prevention?
   Follow-up

How would you secure APIs exposed publicly?

7. Database Related API Questions
   Questions
   Transaction handling in APIs?
   ACID Properties?
   Optimistic Locking?
   Pessimistic Locking?
   How do you avoid duplicate requests?
   How do you ensure consistency?
   Example

Same payment API called twice:

POST /payment

How do you stop duplicate payments?

Expected Answer: Idempotency Key

8. Performance & Scalability
   Questions
   How do you improve API performance?
   What is caching?
   Redis vs Database?
   API response compression?
   Lazy loading?
   ETag?
   CDN?
   Connection pooling?
   How do you scale APIs?
   Horizontal vs Vertical scaling?
9. Error Handling
   Questions
   How do you design API error responses?
   Global exception handling?
   Custom exception handling?
   How do you log failures?
   How do you troubleshoot production issues?
   Good Response Format
   {
   "code": "USER_NOT_FOUND",
   "message": "User does not exist",
   "traceId": "abc123"
   }

10. API Testing
    Questions
    Difference between Unit, Integration and E2E testing?
    How do you test APIs?
    What tools have you used?
    Postman vs Swagger?
    How do you automate API tests?
    What is contract testing?
    Consumer-driven contracts?
    Mock APIs?

Enterprise interview evaluations frequently include questions around API testing, microservices integration, and performance testing.

11. Swagger / OpenAPI
    Questions
    What is Swagger?
    OpenAPI Specification?
    Benefits of API documentation?
    How do you generate docs automatically?
    How do frontend teams use Swagger?
12. Senior-Level System Design Questions
    Questions
    Design a Payment API.
    Design a URL Shortener API.
    Design a Banking Transfer API.
    Design an Order Management API.
    Design a Notification Service API.
    Design APIs for Uber.
    Design APIs for WhatsApp.
    Design APIs for Inventory Management.
13. Real-World Scenario Questions
    Scenario 1

An API is taking 10 seconds.

How would you investigate?

Scenario 2

Production API returns:

500 Internal Server Error

What would you check first?

Scenario 3

A React UI triggers duplicate API calls.

How would you stop them?

Scenario 4

Millions of users access an API during a sale.

How would you scale it?

14. Frequently Asked Hands-On Questions
    Build APIs for
    User Management
    Login
    Logout
    Product Catalog
    Shopping Cart
    Order Placement
    Payment Processing
    File Upload
    Search Service

Be prepared to discuss:

Request/Response structure
Validation
Error Handling
Authentication
Database schema
Caching
Scaling
Top 15 Questions Most Likely for Senior API Developers
PUT vs PATCH?
JWT vs Session Authentication?
How do you secure REST APIs?
Design a scalable Payment API.
How do you implement API versioning?
Explain idempotency.
How do you handle retries safely?
How do you prevent duplicate payments?
API Gateway benefits?
Caching strategies?
Rate limiting implementation?
Global exception handling?
Microservices communication patterns?
REST vs GraphQL?
How would you troubleshoot a slow production API?

These are the questions most frequently used to evaluate API design, security, scalability, microservices, and testing knowledge, which are highlighted repeatedly in the internal interview-preparation material and evaluations.

If you're preparing for Senior React + Node.js Full Stack interviews, I can also provide 100 API interview questions with detailed answers and diagrams.

Based on the internal interview preparation material and evaluation reports, the most frequently assessed API topics include REST APIs, API design, error handling, authentication, microservices integration, performance testing, and API security.

1. PUT vs PATCH (Most Asked)
   Q: What is the difference between PUT and PATCH?
   PUT

Replaces the entire resource.

Request

PUT /users/101

{
"id": 101,
"name": "Sudhir",
"email": "sudhir@test.com"
}

If you omit a field, it may be overwritten.

PATCH

Updates only specific fields.

PATCH /users/101

{
"name": "Sudhir Jedhe"
}

Interview Answer
PUT PATCHFull update Partial update
Idempotent Usually idempotent
Sends complete object Sends changed fields only
Higher payload Smaller payload 2. JWT Authentication
Q: What is JWT?

JWT (JSON Web Token) is a compact token used for stateless authentication.

Structure:

Header.Payload.Signature

Example:

eyJhbGciOiJIUzI1Ni...

Flow
Login
↓
Validate User
↓
Generate JWT
↓
Client Stores Token
↓
Pass Token in Header
↓
API Validates Token

React Example
axios.get("/api/users", {
headers: {
Authorization: `Bearer ${token}`
}
});

Node.js Middleware
const jwt = require("jsonwebtoken");

function auth(req, res, next) {
const token = req.headers.authorization?.split(" ")[1];

if (!token) {
return res.status(401).send("Unauthorized");
}

const decoded = jwt.verify(token, process.env.JWT_SECRET);

req.user = decoded;

next();
}

3. Authentication vs Authorization
   Authentication

"Who are you?"

Examples:

Login
JWT
OAuth
SSO
Authorization

"What can you access?"

Examples:

Admin -> Create User
Manager -> Edit User
Employee -> Read User

Interview Answer

Authentication happens first. Authorization comes after user identity is verified.

4. API Versioning
   Why?

Avoid breaking existing consumers.

Methods
URL Versioning
/api/v1/users
/api/v2/users

Header Versioning
Accept-Version: v2

Query Parameter
/users?version=v2

Best Practice

Most teams use:

/api/v1

because it is simple and easily understood.

5. Idempotency
   Q: What is Idempotency?

Multiple requests produce the same result.

Idempotent Methods
GET
PUT
DELETE

Example
DELETE /users/101

Calling it 10 times still results in the user being deleted.

Payment API Scenario

Problem:

POST /payment

called twice due to network retry.

Solution:

Idempotency-Key: payment-12345

Store the key and reject duplicates.

6. REST API Design

The internal interview material specifically calls out REST APIs as a common topic.

Bad
/getUsers
/createUser

Good
GET /users
POST /users
PUT /users/101
DELETE /users/101

Design Rules
Use nouns, not verbs
Consistent naming
Proper status codes
Pagination
Filtering
Sorting 7. Global Error Handling

API design interviews often include handling errors and exceptions.

Good Response
{
"errorCode": "USER_NOT_FOUND",
"message": "User does not exist",
"traceId": "123456"
}

Node.js Example
app.use((err, req, res, next) => {
res.status(500).json({
message: err.message
});
});

Benefits
Consistent responses
Easier debugging
Better frontend integration 8. API Caching
Why?

Reduce database calls.

Options
Browser Cache
Cache-Control: max-age=3600

Redis Cache
API
↓
Redis
↓ (miss)
Database

Interview Answer

Redis is used for:

Session storage
Frequently accessed data
Product catalogues
Dashboard data
React + Node.js API Interview Questions
React Side
Basic
How do you call APIs in React?
Fetch vs Axios?
useEffect API call lifecycle?
How do you cancel API calls?
How do you handle loading and error states?
How do you avoid duplicate API requests?
React Query vs Redux?
What is optimistic UI update?
How do you implement retry logic?
How do you cache API responses?
Advanced
How do you handle token refresh?
How do you secure API calls?
Server-side pagination?
Infinite scrolling?
Debounced search API?
API polling?
Request batching?
GraphQL vs REST?
API mocking?
API performance optimisation?
Node.js Side
Basic
How do you build REST APIs in Express?
Middleware?
Request lifecycle?
Error handling?
Validation using Joi/Zod?
Authentication middleware?
JWT implementation?
Environment variables?
Async/Await?
Event Loop?
Advanced
Rate limiting?
API throttling?
Circuit breaker?
API Gateway?
Microservices communication?
Worker threads?
Redis caching?
Database connection pooling?
Message queues?
Logging and monitoring?
Key API Security Questions (Must Prepare)

API security is one of the most common senior-level interview areas.

1. How would you secure a REST API?
   Answer
   HTTPS only
   JWT Authentication
   RBAC
   Rate Limiting
   Input Validation
   API Gateway
   Logging and Monitoring
2. What is Rate Limiting?

Limit requests per user.

Example:

100 requests/minute

Tools:

Nginx
Express Rate Limit
API Gateway

Purpose:

Prevent abuse
Prevent DDoS
Protect backend resources 3. How do you prevent SQL Injection?

Bad:

SELECT \* FROM users WHERE email='${email}'

Good:

db.query(
"SELECT \* FROM users WHERE email=?",
[email]
);

4. What is XSS?

Attacker injects JavaScript.

<script>alert('hacked')</script>

Protection:

Input validation
Output encoding
CSP headers 5. What is CSRF?

Malicious site performs actions on behalf of authenticated users.

Mitigation:

CSRF tokens
SameSite cookies
Origin validation 6. How do Refresh Tokens Work?
Access Token
↓ expires
Refresh Token
↓
New Access Token

Benefits:

Short-lived access token
Better security 7. How do you secure File Upload APIs?

Validate:

File type
File size
Virus scanning

Avoid:

.exe
.bat
.js

uploads.

8. How do you protect Sensitive Data?
   Encrypt at rest
   Encrypt in transit
   Don't log secrets
   Use secret management tools
   Rotate keys regularly
   Senior-Level Scenario Question
   Q: Design a Payment API handling 1 million requests/day.
   Expected Discussion

✅ JWT Authentication
✅ API Gateway
✅ Load Balancer
✅ Redis Cache
✅ Database Replication
✅ Idempotency Key
✅ Rate Limiting
✅ Retry Strategy
✅ Monitoring & Logging
✅ Distributed Tracing

This type of design discussion combines REST APIs, security, scalability, caching, and microservices topics that commonly appear in senior API interviews.

For your Senior React + Node.js Lead interviews, focus heavily on:

JWT + OAuth2
API security
API versioning
Idempotency
Redis caching
Rate limiting
Microservices communication
Error handling
API Gateway
Designing scalable payment/order APIs

These are the areas where interviewers usually move from mid-level to senior-level evaluation.

I found 1,902 enterprise results related to API security, gateways, rate limiting, and error handling. Internal guidance highlights using quotas/throttling, API gateways, authentication, authorisation, encryption, standardised logging, and structured error responses.

1. Rate Limiting in Node.js APIs
   What is Rate Limiting?

Rate limiting restricts how many requests a client can make within a specified time period.

Example:

100 requests per minute per IP

Benefits:

Prevent brute force attacks
Protect APIs from abuse
Mitigate DoS attacks
Control infrastructure costs

Internal API security guidance recommends quotas and throttling to protect APIs from spikes and abuse.

Basic Implementation with Express Rate Limit

Install:

npm install express-rate-limit

const express = require("express");
const rateLimit = require("express-rate-limit");

const app = express();

const limiter = rateLimit({
windowMs: 15 _ 60 _ 1000,
max: 100,
message: {
error: "Too many requests"
}
});

app.use("/api", limiter);

app.listen(3000);

API Response

When limit exceeds:

429 Too Many Requests

{
"error": "Too many requests"
}

Different Limits by Endpoint

Authentication APIs need stricter controls.

app.use(
"/login",
rateLimit({
windowMs: 15 _ 60 _ 1000,
max: 5
})
);

app.use(
"/products",
rateLimit({
windowMs: 60 \* 1000,
max: 300
})
);

Redis-Based Distributed Rate Limiting

For multiple Node.js instances:

Load Balancer
↓
Node1
Node2
Node3
↓
Redis

Without Redis, each instance has its own counter.

Common approach:

rate-limit-redis
ioredis

This ensures consistent limits across all servers.

Token Bucket Strategy (Interview Favourite)
Bucket Size = 100
Refill Rate = 10/min

Each request consumes one token.

Benefits:

Handles traffic bursts
Prevents sustained abuse
Best Practices

✅ Different limits for different endpoints

✅ Use Redis in production

✅ Return HTTP 429

✅ Add Retry-After header

✅ Monitor rate-limit violations

✅ Configure limits in API Gateway when possible

Internal API governance materials also call out API gateway enforcement, monitoring, and anomaly detection.

2. Secure File Upload API Example

File uploads are a common attack vector.

Risks

Attackers may upload:

virus.exe
malware.js
shell.php

Dangerous outcomes:

Remote code execution
Malware distribution
Storage abuse
Secure Upload Architecture
Client
↓
Validation
↓
Virus Scan
↓
S3 / Blob Storage
↓
Database Metadata

Multer Example

Install:

npm install multer

const multer = require("multer");

const storage = multer.memoryStorage();

const upload = multer({
storage,
limits: {
fileSize: 5 _ 1024 _ 1024
},
fileFilter(req, file, cb) {
const allowed = [
"image/png",
"image/jpeg",
"application/pdf"
];

    cb(null, allowed.includes(file.mimetype));

}
});

Upload Endpoint
app.post(
"/upload",
upload.single("file"),
async (req, res) => {

    if (!req.file) {
      return res.status(400).json({
        message: "Invalid file"
      });
    }

    res.status(200).json({
      fileName: req.file.originalname
    });

}
);

Store Files in Cloud Storage

Avoid local disk storage.

Use:

AWS S3
Azure Blob Storage
Google Cloud Storage

Internal interview guidance references using pre-signed URLs and direct uploads to cloud storage to reduce backend load and improve scalability.

Additional Security Controls
Validate MIME Type
file.mimetype

Validate File Extension
.pdf
.png
.jpg

Virus Scanning
ClamAV
CrowdStrike
Defender

Rename Files

Never trust:

invoice.pdf.exe

Use:

UUID

instead.

Authorisation Check
if (!user.canUpload) {
return res.status(403);
}

Production-Ready Upload Checklist

✅ Max file size

✅ MIME validation

✅ Extension validation

✅ Virus scan

✅ Authentication

✅ Authorisation

✅ Cloud storage

✅ Audit logging

✅ Pre-signed URLs

✅ Encryption

These align with enterprise API security recommendations around authentication, authorisation, encryption, and access control.

3. API Error Handling Best Practices

A consistent error strategy is expected in senior API interviews. Internal API guidance recommends structured error bodies, proper status codes, request IDs, logging, observability, and RFC7807-style error responses.

Standard Response Format
{
"code": "USER_NOT_FOUND",
"message": "User does not exist",
"traceId": "req-12345"
}

Use Correct HTTP Status Codes
Status Usage200 Success
201 Created
400 Bad Request
401 Unauthenticated
403 Forbidden
404 Not Found
409 Conflict
422 Validation Error
429 Too Many Requests
500 Internal Server Error

The use of consistent status codes is specifically highlighted in internal interview evaluations and coding guidelines.

Global Error Middleware
app.use((err, req, res, next) => {

console.error(err);

res.status(err.status || 500).json({
code: err.code || "INTERNAL_ERROR",
message: err.message,
traceId: req.id
});
});

Custom Error Class
class AppError extends Error {
constructor(message, status) {
super(message);
this.status = status;
}
}

Usage:

throw new AppError(
"User not found",
404
);

Never Expose Internal Details

❌ Bad

{
"error": "SQL Exception in DB server"
}

✅ Good

{
"error": "Internal Server Error"
}

The internal API interview guidance explicitly mentions communicating errors without leaking sensitive system details.

Add Correlation IDs
req.id = crypto.randomUUID();

Return:

{
"traceId": "e4f84d6a"
}

Useful for:

Production debugging
Distributed tracing
Microservices
Log Errors Properly

Capture:

Request ID
Endpoint
User
Exception
Stack Trace
Latency

Enterprise guidelines recommend standardised logging, monitoring, observability, and alerting on error rates.

Senior Interview One-Line Answer

"I implement rate limiting using Redis-backed token bucket algorithms, secure file uploads using MIME validation, antivirus scanning and cloud storage with pre-signed URLs, and enforce standardised API error handling with global middleware, correlation IDs, proper HTTP status codes, and structured error responses."

Based on internal API security guidance, recommended controls include quotas/throttling, API gateways, authentication/authorisation, input validation, encryption, and monitoring. Internal materials also specifically mention using quotas and throttling to protect against spikes and denial-of-service attacks.

1. Redis-Based Rate Limiting Example (Node.js)
   Architecture
   Load Balancer
   |
   ***
   | | |
   Node1 Node2 Node3
   \ | /
   Redis

Using Redis ensures all application instances share the same request counter.

Install
npm install express-rate-limit rate-limit-redis ioredis

Implementation
const express = require("express");
const rateLimit = require("express-rate-limit");
const RedisStore = require("rate-limit-redis");
const Redis = require("ioredis");

const app = express();

const redisClient = new Redis({
host: "localhost",
port: 6379,
});

const limiter = rateLimit({
windowMs: 15 _ 60 _ 1000, // 15 min
max: 100, // 100 requests
standardHeaders: true,
legacyHeaders: false,

store: new RedisStore({
sendCommand: (...args) => redisClient.call(...args),
}),

message: {
success: false,
code: "RATE_LIMIT_EXCEEDED",
message: "Too many requests. Try again later."
}
});

app.use("/api", limiter);

app.get("/api/users", (req, res) => {
res.json({ success: true });
});

app.listen(3000);

Add Retry-After Header
res.set(
"Retry-After",
Math.ceil(req.rateLimit.resetTime / 1000)
);

Login Endpoint Example
app.use(
"/login",
rateLimit({
windowMs: 15 _ 60 _ 1000,
max: 5
})
);

This helps defend against brute-force attacks.

2. Common HTTP Status Codes for Error Handling

Internal coding standards recommend consistent REST status codes and structured error responses.

Success
Code Meaning200 OK
201 Created
202 Accepted
204 No Content
Client Errors (4xx)
Code Meaning Example400 Bad Request Invalid payload
401 Unauthorized Missing JWT
403 Forbidden No permission
404 Not Found User not found
405 Method Not Allowed POST on GET endpoint
409 Conflict Duplicate email
412 Precondition Failed ETag mismatch
415 Unsupported Media Type Invalid file type
422 Unprocessable Entity Validation failed
429 Too Many Requests Rate limit exceeded
Example
{
"code": "VALIDATION_ERROR",
"message": "Email is required"
}

Server Errors (5xx)
Code Meaning500 Internal Server Error
501 Not Implemented
502 Bad Gateway
503 Service Unavailable
504 Gateway Timeout
Example
{
"code": "INTERNAL_ERROR",
"message": "Unexpected error occurred",
"traceId": "abc123"
}

Internal interview guidance specifically recommends structured JSON error bodies, request/correlation IDs, and avoiding exposure of sensitive implementation details.

3. Adding Virus Scanning to File Uploads

Internal API security guidance emphasises input validation, authentication, authorisation, and protecting uploaded content. Internal examples also reference storing uploads in cloud storage and using secure access patterns.

Secure Flow
Client
|
Upload File
|
MIME Validation
|
Virus Scanner
|
Cloud Storage (S3/Blob)
|
Database Metadata

Install ClamAV
sudo apt install clamav clamav-daemon

Node package:

npm install clamscan multer

Upload + Scan Example
const multer = require("multer");
const ClamScan = require("clamscan");

const upload = multer({
dest: "uploads/",
limits: {
fileSize: 5 _ 1024 _ 1024
}
});

let scanner;

(async () => {
scanner = await new ClamScan().init({
clamdscan: {
socket: "/var/run/clamav/clamd.ctl"
}
});
})();

Scan Uploaded Files
app.post(
"/upload",
upload.single("file"),
async (req, res) => {

    const result =
      await scanner.isInfected(req.file.path);

    if (result?.isInfected) {

      fs.unlinkSync(req.file.path);

      return res.status(400).json({
        code: "VIRUS_DETECTED",
        message: "Uploaded file contains malware"
      });
    }

    res.json({
      message: "Upload successful"
    });

}
);

Additional Production Controls
Validate MIME Types
const allowed = [
"application/pdf",
"image/png",
"image/jpeg"
];

Restrict Extensions
Allowed:
.pdf
.jpg
.png

Blocked:
.exe
.bat
.sh
.php

Rename Files
const fileName = crypto.randomUUID();

JWT Protection
app.post(
"/upload",
authMiddleware,
upload.single("file")
);

Store in S3

Upload only after scan succeeds:

await s3.upload({
Bucket: "documents",
Key: fileName,
Body: fileBuffer
});

Internal interview discussions specifically reference cloud object storage and pre-signed URL patterns for scalable file uploads.

Senior Interview Answer (30 Seconds)

"For production APIs, I implement Redis-backed distributed rate limiting with HTTP 429 responses, follow RESTful status-code conventions with structured error objects and correlation IDs, and secure file uploads using MIME validation, file-size limits, antivirus scanning with ClamAV, JWT authorisation, and cloud storage such as S3 or Azure Blob Storage."

1. How to Add a Retry-After Header in Rate Limiting

When a client exceeds the allowed request limit, return HTTP 429 (Too Many Requests) along with a Retry-After header so the client knows when it can retry. Using quotas/throttling and proper rate-limit responses is a recommended API security practice.

Express Rate Limit Example
const rateLimit = require("express-rate-limit");

const limiter = rateLimit({
windowMs: 15 _ 60 _ 1000, // 15 mins
max: 100,

handler: (req, res) => {
const retryAfterSeconds = Math.ceil(
(req.rateLimit.resetTime - Date.now()) / 1000
);

    res.set("Retry-After", retryAfterSeconds);

    res.status(429).json({
      code: "RATE_LIMIT_EXCEEDED",
      message: "Too many requests",
      retryAfter: retryAfterSeconds,
      traceId: req.id
    });

}
});

Example Response
HTTP/1.1 429 Too Many Requests
Retry-After: 120

{
"code": "RATE_LIMIT_EXCEEDED",
"message": "Too many requests",
"retryAfter": 120,
"traceId": "8b5c4d02"
}

2. Best MIME Types to Allow for Secure File Uploads

Internal API security guidance recommends input validation and restricting uploads to expected file types.

Recommended Allow List
Images
image/png
image/jpeg
image/webp

Documents
application/pdf

Office Files (if required)
application/vnd.openxmlformats-officedocument.wordprocessingml.document
application/vnd.openxmlformats-officedocument.spreadsheetml.sheet
application/vnd.openxmlformats-officedocument.presentationml.presentation

CSV
text/csv

Common Types to Block
application/x-msdownload
application/x-sh
application/x-bat
application/javascript
text/javascript
application/x-php

Examples:

.exe
.bat
.cmd
.sh
.php
.jsp
.asp

MIME Validation Example
const allowedMimes = [
"image/png",
"image/jpeg",
"application/pdf"
];

if (!allowedMimes.includes(file.mimetype)) {
throw new Error("Unsupported file type");
}

3. Structured API Error Response with traceId

Internal coding guidance and interview evaluations recommend:

Structured error bodies
Proper HTTP status codes
Correlation/request IDs
Avoiding exposure of internal implementation details
Standardised logging and monitoring
Standard Error Format
{
"code": "USER_NOT_FOUND",
"message": "User does not exist",
"traceId": "d5b6c7a8",
"timestamp": "2026-07-14T10:30:00Z"
}

Validation Error Example
HTTP/1.1 422 Unprocessable Entity

{
"code": "VALIDATION_ERROR",
"message": "Email is required",
"errors": [
{
"field": "email",
"message": "Email cannot be empty"
}
],
"traceId": "3fe27ab1"
}

Unauthorised Example
HTTP/1.1 401 Unauthorized

{
"code": "UNAUTHORIZED",
"message": "Invalid or expired token",
"traceId": "90ab12cd"
}

Internal Error Example
HTTP/1.1 500 Internal Server Error

{
"code": "INTERNAL_ERROR",
"message": "An unexpected error occurred",
"traceId": "e7c2d11f"
}

Generating a Trace ID
const crypto = require("crypto");

app.use((req, res, next) => {
req.id = crypto.randomUUID();
next();
});

Global Error Handler
app.use((err, req, res, next) => {
res.status(err.status || 500).json({
code: err.code || "INTERNAL_ERROR",
message: err.message,
traceId: req.id,
timestamp: new Date().toISOString()
});
});

Senior Interview Answer (1 Minute)

"I return HTTP 429 with a Retry-After header for rate-limited requests, enforce a strict MIME allow-list for uploads (PDF, PNG, JPEG), scan files before storage, and standardise all API errors with an error code, message, timestamp, and traceId for observability and debugging." This aligns with internal guidance around throttling, API security, structured error handling, monitoring, and logging.

Internal API coding guidelines and interview materials emphasise using consistent REST status codes and structured error responses.

Common HTTP Status Codes with Usage Examples
✅ Success Responses (2xx)
200 OK

Request completed successfully.

Example

GET /users/101

Response:

{
"id": 101,
"name": "Sudhir"
}

Use for:

GET requests
Successful updates
Successful searches
201 Created

Resource successfully created.

Example

POST /users

Response:

{
"id": 101,
"name": "Sudhir"
}

Use for:

Create User
Create Order
Create Product

The internal guidelines specifically recommend returning 201 Created for successful resource creation.

202 Accepted

Request accepted for asynchronous processing.

Example

POST /reports/generate

Response:

{
"message": "Report generation started"
}

Use for:

Background jobs
Queue-based processing
Batch operations
204 No Content

Request succeeded but no response body is returned.

Example

DELETE /users/101

Response:

204 No Content

The internal REST guidelines recommend 204 No Content for successful deletes.

⚠️ Client Errors (4xx)
400 Bad Request

Invalid request payload.

Example

{
"email": ""
}

Response:

{
"code": "VALIDATION_ERROR",
"message": "Email is required"
}

Used when:

Missing fields
Invalid JSON
Invalid query parameters
401 Unauthorized

Authentication failed.

Example

Authorization: Bearer invalid-token

Response:

{
"code": "UNAUTHORIZED",
"message": "Invalid token"
}

Used when:

JWT missing
JWT invalid
Session expired

The interview evaluations explicitly reference authentication and authorization controls for REST services.

403 Forbidden

User authenticated but lacks permission.

Example

DELETE /admin/users/101

Response:

{
"code": "FORBIDDEN",
"message": "Access denied"
}

Used when:

RBAC failure
User lacks required role
404 Not Found

Requested resource does not exist.

Example

GET /users/9999

Response:

{
"code": "USER_NOT_FOUND",
"message": "User not found"
}

Internal guidelines recommend 404 when resources cannot be found.

405 Method Not Allowed

Example

POST /users/101

when endpoint only supports GET.

Response:

{
"message": "Method not allowed"
}

409 Conflict

Example

POST /users

Existing email:

{
"email": "sudhir@test.com"
}

Response:

{
"code": "EMAIL_ALREADY_EXISTS",
"message": "Duplicate email"
}

Used for:

Duplicate records
Concurrent update conflicts
415 Unsupported Media Type

Example

POST /upload

Upload:

virus.exe

Response:

{
"code": "INVALID_FILE_TYPE",
"message": "Unsupported file type"
}

422 Unprocessable Entity

Request format is valid but business validation fails.

Example

{
"age": -5
}

Response:

{
"code": "VALIDATION_ERROR",
"message": "Age cannot be negative"
}

Internal interview examples specifically call out 422 Unprocessable Entity for validation issues.

429 Too Many Requests

Rate limit exceeded.

Response:

{
"code": "RATE_LIMIT_EXCEEDED",
"message": "Too many requests"
}

Recommended header:

Retry-After: 120

Internal API security guidance recommends quotas and throttling to protect APIs from abuse and denial-of-service attacks.

🔥 Server Errors (5xx)
500 Internal Server Error

Unexpected application failure.

Response:

{
"code": "INTERNAL_ERROR",
"message": "Unexpected error occurred",
"traceId": "abc123"
}

Internal guidance recommends structured error bodies and avoiding disclosure of sensitive system details.

501 Not Implemented

Endpoint exists but functionality not yet available.

{
"message": "Feature not implemented"
}

502 Bad Gateway

Gateway received invalid response from upstream service.

Used in:

API Gateway
→ Microservice

Internal API gateway materials discuss gateway-based architectures and monitoring.

503 Service Unavailable

Service temporarily unavailable.

Response:

{
"code": "SERVICE_UNAVAILABLE",
"message": "Please try again later"
}

Use for:

Maintenance
Downstream outage
High load
504 Gateway Timeout

Upstream service did not respond within timeout period.

Example:

API Gateway
↓
Payment Service
↓
Timeout

Senior Interview Cheat Sheet
200 OK → Successful GET
201 Created → Resource created
204 No Content → Successful DELETE

400 Bad Request → Invalid request
401 Unauthorized → Authentication failed
403 Forbidden → No permission
404 Not Found → Resource missing
409 Conflict → Duplicate/conflict
415 Unsupported Media → Invalid file type
422 Validation Error → Business validation
429 Too Many Requests → Rate limit exceeded

500 Internal Error → Application failure
503 Service Unavailable → Service down
504 Gateway Timeout → Upstream timeout

For senior API interviews, the most commonly discussed codes are 200, 201, 204, 400, 401, 403, 404, 409, 422, 429, 500, 503, and 504 because they cover CRUD operations, authentication, validation, rate limiting, and microservice failure scenarios.

Internal API guidelines and interview evaluations emphasise:

Using structured error responses (ProblemDetails/RFC7807 style)
Consistent HTTP status codes
Correlation/trace IDs
Standardised logging
Avoiding exposure of internal system details in API responses
Global Error Handler Middleware (Express + Node.js)

1.  Custom Error Class
    class AppError extends Error {
    constructor(
    message,
    statusCode = 500,
    code = "INTERNAL_ERROR"
    ) {
    super(message);

        this.statusCode = statusCode;
        this.code = code;

        Error.captureStackTrace(this, this.constructor);

    }
    }

module.exports = AppError;

2. TraceId Middleware
   const crypto = require("crypto");

function requestId(req, res, next) {
req.traceId = crypto.randomUUID();

res.setHeader(
"X-Trace-Id",
req.traceId
);

next();
}

module.exports = requestId;

Usage:

app.use(requestId);

3. Async Route Wrapper

Avoid repetitive try/catch blocks.

const asyncHandler = (fn) =>
(req, res, next) =>
Promise
.resolve(fn(req, res, next))
.catch(next);

module.exports = asyncHandler;

4. Sample Route
   const AppError = require("./AppError");

app.get(
"/users/:id",
asyncHandler(async (req, res) => {

    const user = await userRepo.findById(
      req.params.id
    );

    if (!user) {
      throw new AppError(
        "User not found",
        404,
        "USER_NOT_FOUND"
      );
    }

    res.json(user);

})
);

5. Global Error Middleware
   function errorHandler(
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

const status =
err.statusCode || 500;

res.status(status).json({
success: false,
code: err.code || "INTERNAL_ERROR",
message:
status === 500
? "Internal Server Error"
: err.message,

    traceId: req.traceId,

    timestamp:
      new Date().toISOString()

});
}

module.exports = errorHandler;

Register last:

app.use(errorHandler);

Example Error Response
{
"success": false,
"code": "USER_NOT_FOUND",
"message": "User not found",
"traceId": "16eb4bbd-cf32-4a85-81a0-f7cb88d5f8d",
"timestamp": "2026-07-14T09:30:00Z"
}

This aligns with internal guidance recommending structured error bodies, request IDs and standardised error handling.

Best Practices for HTTP Status Code Usage

1. Use the Most Specific Status Code

✅ Good

404 Not Found

{
"code": "USER_NOT_FOUND"
}

❌ Bad

500 Internal Server Error

for a missing user.

2. Separate Client vs Server Errors
   Client Error (4xx)

The client can fix the request.

400 Bad Request
401 Unauthorized
403 Forbidden
404 Not Found
422 Validation Error

Server Error (5xx)

Backend issue.

500 Internal Server Error
503 Service Unavailable
504 Gateway Timeout

Internal interview material specifically discusses consistent use of HTTP status codes for API failures.

3. Always Use 201 for Resource Creation
   POST /users

201 Created

Example:

{
"id": 101,
"name": "Sudhir"
}

Internal REST guidelines specifically recommend returning 201 Created for POST resource creation.

4. Use 204 for Successful Delete
   DELETE /users/101

Response:

204 No Content

Internal guidelines recommend 204 No Content for delete operations.

5. Never Return 200 for Validation Failures

❌ Bad

200 OK

{
"success": false
}

✅ Good

422 Unprocessable Entity

{
"code": "VALIDATION_ERROR"
}

6. Use 401 vs 403 Correctly
   401

Authentication problem.

Missing JWT
Invalid JWT
Expired JWT

403

Authenticated user lacks permission.

Employee accessing Admin API

7. Use 409 for Conflicts

Example:

POST /users

Email already exists.

409 Conflict

{
"code": "EMAIL_ALREADY_EXISTS"
}

8. Use 429 for Rate Limiting
   429 Too Many Requests

Include:

Retry-After: 120

Internal API security guidance mentions quotas and throttling for protection against abuse and denial-of-service attacks.

9. Never Leak Internal Errors

❌ Avoid

{
"message":
"SQL timeout on db-server-01"
}

✅ Use

{
"code": "INTERNAL_ERROR",
"message":
"An unexpected error occurred"
}

Internal guidance explicitly recommends communicating failures without exposing sensitive implementation details.

10. Include TraceId in Every Error Response
    {
    "code": "ORDER_NOT_FOUND",
    "message": "Order not found",
    "traceId": "abc123"
    }

Benefits:

Easier debugging
Distributed tracing
Faster production support

Internal guidance highlights observability, monitoring, logging, request identifiers and tracing for API operations.

Senior Interview Cheat Sheet
GET Success → 200 OK
POST Create → 201 Created
DELETE Success → 204 No Content

Invalid Input → 400 Bad Request
Auth Failure → 401 Unauthorized
Permission Failure → 403 Forbidden
Resource Missing → 404 Not Found
Duplicate Resource → 409 Conflict
Validation Failure → 422 Unprocessable Entity
Rate Limit Hit → 429 Too Many Requests

Unexpected Error → 500 Internal Server Error
Service Down → 503 Service Unavailable
Gateway Timeout → 504 Gateway Timeout

For Senior React + Node.js interviews, interviewers often expect you not only to know the status codes but also to justify why a particular code is the most semantically correct choice.

I found 2,149 relevant enterprise results covering structured logging, correlation IDs, trace IDs, global exception handling, and standardised API error responses. Internal guidance recommends:

Structured JSON logging
Correlation/trace IDs in every request
Standardised API error contracts
Consistent error handling middleware
RFC7807/ProblemDetails-style error responses

1. Custom Error Class for APIs

A custom error class standardises all API exceptions.

Base Error Class
class AppError extends Error {
constructor({
message,
statusCode = 500,
code = "INTERNAL_ERROR",
details = null
}) {
super(message);

    this.name = this.constructor.name;
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
const AppError = require("./AppError");

class ValidationError extends AppError {
constructor(message, details) {
super({
message,
statusCode: 422,
code: "VALIDATION_ERROR",
details
});
}
}

module.exports = ValidationError;

Not Found Error
class NotFoundError extends AppError {
constructor(resource) {
super({
message: `${resource} not found`,
statusCode: 404,
code: "NOT_FOUND"
});
}
}

Usage
if (!user) {
throw new NotFoundError("User");
}

Response:

{
"success": false,
"code": "NOT_FOUND",
"message": "User not found",
"traceId": "e12345"
}

Custom exception hierarchies and standardised API error formats are explicitly recommended in internal API architecture documents.

2. Logging Errors with traceId

Internal guidelines recommend:

Correlation IDs
Structured logging
Distributed tracing
JSON log format
Centralised log aggregation
Request ID Middleware
const crypto = require("crypto");

function traceMiddleware(
req,
res,
next
) {
req.traceId =
crypto.randomUUID();

res.setHeader(
"X-Trace-Id",
req.traceId
);

next();
}

Register:

app.use(traceMiddleware);

Structured Logger (Winston)
npm install winston

const winston = require("winston");

const logger = winston.createLogger({
format: winston.format.json(),
transports: [
new winston.transports.Console()
]
});

module.exports = logger;

Log Error with traceId
logger.error({
traceId: req.traceId,
endpoint: req.originalUrl,
method: req.method,
userId: req.user?.id,
error: err.message,
stack: err.stack
});

Example log:

{
"level":"error",
"traceId":"abc123",
"endpoint":"/api/orders",
"method":"POST",
"userId":"1001",
"error":"Database timeout"
}

Internal guidance specifically recommends correlation IDs in all log entries and structured JSON logging for tracing requests across services.

Global Error Middleware
function errorHandler(
err,
req,
res,
next
) {

logger.error({
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
message:
err.statusCode === 500
? "Internal Server Error"
: err.message,

    traceId: req.traceId,

    timestamp:
      new Date().toISOString()

});
}

3. Common API Error Response Formats
   Format 1: Simple Error

Suitable for small APIs.

{
"message": "User not found"
}

Format 2: Standard Enterprise Format ✅

Most common in enterprise systems.

{
"success": false,
"code": "USER_NOT_FOUND",
"message": "User not found",
"traceId": "3a2b4c5d",
"timestamp": "2026-07-14T10:00:00Z"
}

Internal interview guidance explicitly references:

error code
message
request/correlation ID
structured JSON responses
Format 3: Validation Error
{
"success": false,
"code": "VALIDATION_ERROR",
"message": "Validation failed",
"errors": [
{
"field": "email",
"message": "Email is required"
},
{
"field": "password",
"message": "Minimum length is 8"
}
],
"traceId": "abc123"
}

Format 4: RFC 7807 Problem Details

Internal standards mention ProblemDetails for API responses.

{
"type": "https://api.company.com/errors/user-not-found",
"title": "User Not Found",
"status": 404,
"detail": "User 101 does not exist",
"instance": "/users/101",
"traceId": "abc123"
}

Format 5: Rate Limiting Error
{
"code": "RATE_LIMIT_EXCEEDED",
"message": "Too many requests",
"retryAfter": 120,
"traceId": "abc123"
}

Format 6: Authentication Error
{
"code": "UNAUTHORIZED",
"message": "Invalid JWT token",
"traceId": "abc123"
}

Format 7: Microservice Dependency Failure
{
"code": "PAYMENT_SERVICE_UNAVAILABLE",
"message": "Payment service unavailable",
"traceId": "abc123",
"retryable": true
}

Senior Interview Answer

"I use a custom exception hierarchy (AppError, ValidationError, NotFoundError), propagate a traceId through every request, log structured JSON events with correlation IDs, and return standardised error contracts containing code, message, traceId, and validation details. For enterprise APIs, I prefer RFC7807-compatible responses and centralised observability with distributed tracing."

Internal enterprise guidance recommends:

Structured JSON logging
Correlation/trace IDs on every request
Standardised API error responses
Global exception handling
Centralised logging and distributed tracing across services
Example Usage of Custom Error Classes in Routes
Error Classes
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

class NotFoundError extends AppError {
constructor(resource) {
super(
`${resource} not found`,
404,
"NOT_FOUND"
);
}
}

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

GET Route Example
app.get(
"/api/users/:id",
asyncHandler(async (req, res) => {

    const user =
      await userService.getById(
        req.params.id
      );

    if (!user) {
      throw new NotFoundError(
        "User"
      );
    }

    res.status(200).json(user);

})
);

Response:

{
"success": false,
"code": "NOT_FOUND",
"message": "User not found",
"traceId": "abc123"
}

POST Route Example
app.post(
"/api/users",
asyncHandler(async (req, res) => {

    const { email } = req.body;

    if (!email) {

      throw new ValidationError([
        {
          field: "email",
          message: "Email is required"
        }
      ]);
    }

    const user =
      await userService.create(
        req.body
      );

    res.status(201).json(user);

})
);

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

Service Layer Example

A common senior-level pattern is throwing errors from the service layer and handling them centrally.

class UserService {

async getUser(id) {

    const user =
      await userRepo.findById(id);

    if (!user) {
      throw new NotFoundError(
        "User"
      );
    }

    return user;

}
}

This keeps controllers thin and business logic in services, which aligns with internal API design guidance.

Best Practices for Structured Error Logging

Enterprise guidance explicitly recommends structured logging, correlation IDs, distributed tracing, JSON logs, and centralised observability.

1. Always Include traceId

Generate once per request:

req.traceId =
crypto.randomUUID();

Log it everywhere:

logger.error({
traceId: req.traceId
});

Benefits:

Trace requests across services
Easier production debugging
Distributed tracing support

Correlation/request IDs are specifically called out in internal logging guidance.

2. Use Structured JSON Logs

❌ Bad

console.log(
"User 123 failed login"
);

✅ Good

logger.error({
event: "LOGIN_FAILED",
userId: 123,
traceId: req.traceId
});

Internal guidance recommends structured JSON logging rather than unstructured text logs.

3. Capture Context

Include:

{
"traceId": "abc123",
"userId": "1001",
"service": "user-service",
"endpoint": "/api/users",
"method": "POST",
"errorCode": "VALIDATION_ERROR"
}

Internal recommendations include service, trace ID, user ID and event information in logs.

4. Log Appropriate Severity Levels
   Level UsageDEBUG Development diagnostics
   INFO Successful operations
   WARN Retries, slow responses
   ERROR Application errors
   FATAL/CRITICAL System outages

These logging levels are explicitly discussed in enterprise coding standards.

Example:

logger.warn({
traceId,
message:
"Rate limit threshold reached"
});

5. Never Log Sensitive Data

❌ Avoid

{
password: "admin123",
token: "jwt-token"
}

✅ Mask secrets

{
password: "**_",
token: "_**"
}

Internal API guidance stresses security, authentication and safe handling of API information.

6. Log Full Error Objects
   logger.error({
   traceId: req.traceId,
   code: err.code,
   message: err.message,
   stack: err.stack
   });

Example:

{
"level":"error",
"traceId":"abc123",
"code":"DATABASE_TIMEOUT",
"message":"Database timeout",
"stack":"..."
}

7. Propagate traceId Across Microservices

Incoming request:

X-Trace-Id: abc123

Outgoing call:

axios.get(url, {
headers: {
"X-Trace-Id":
req.traceId
}
});

Internal interview guidance specifically discusses propagating a single correlation ID across all services and outbound calls.

Production-Ready Error Log Example
{
"timestamp": "2026-07-14T10:30:00Z",
"level": "ERROR",
"traceId": "abc123",
"service": "order-service",
"endpoint": "/api/orders",
"method": "POST",
"userId": "1001",
"errorCode": "PAYMENT_FAILED",
"message": "Payment provider timeout",
"durationMs": 2500
}

Senior Interview Answer

"I use a custom exception hierarchy (AppError, ValidationError, NotFoundError) and throw domain-specific exceptions from the service layer. A global error middleware converts these into standard API responses. For logging, I use structured JSON logs, propagate a traceId through every service call, log contextual metadata such as endpoint, user and error code, use appropriate log levels, and never log sensitive information."

Internal guidance recommends global exception filters, consistent API error response formats, correlation IDs, structured JSON logging, and ProblemDetails/RFC7807-style responses. It also emphasises logging correlation IDs and using structured logging for observability and tracing.

1. Global Error Middleware Usage
   Project Structure
   src/
   ├── middleware/
   │ ├── traceMiddleware.js
   │ └── errorHandler.js
   ├── errors/
   │ ├── AppError.js
   │ ├── ValidationError.js
   │ └── NotFoundError.js
   ├── routes/
   │ └── userRoutes.js
   └── app.js

Register Middleware
const express = require("express");

const app = express();

app.use(express.json());

// Request Trace ID
app.use(traceMiddleware);

// Routes
app.use("/api/users", userRoutes);

// Must be last
app.use(errorHandler);

Route → Error → Middleware Flow
Request
↓
Route Handler
↓
Throw Error
↓
next(error)
↓
Global Error Handler
↓
JSON Response

Example Route
router.get("/:id", async (req, res, next) => {
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

} catch (error) {
next(error);
}
});

Global Error Handler
function errorHandler(
err,
req,
res,
next
) {

logger.error({
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

    traceId: req.traceId,

    timestamp:
      new Date().toISOString()

});
}

Response:

{
"success": false,
"code": "NOT_FOUND",
"message": "User not found",
"traceId": "abc123"
}

This aligns with the recommendation for global exception handling and consistent API error responses.

2.  Handling Validation Errors in Routes
    Approach 1 – Manual Validation
    router.post(
    "/users",
    async (req, res, next) => {
    try {

          const { email, name } =
            req.body;

          const errors = [];

          if (!email) {
            errors.push({
              field: "email",
              message:
                "Email is required"
            });
          }

          if (!name) {
            errors.push({
              field: "name",
              message:
                "Name is required"
            });
          }

          if (errors.length) {

            throw new ValidationError(
              errors
            );
          }

          const user =
            await userService.create(
              req.body
            );

          res.status(201).json(user);

        } catch (error) {
          next(error);
        }

    }
    );

Validation Error Class
class ValidationError
extends AppError {

constructor(errors) {
super(
"Validation failed",
422,
"VALIDATION_ERROR"
);

    this.errors = errors;

}
}

Response
{
"success": false,
"code": "VALIDATION_ERROR",
"message": "Validation failed",
"errors": [
{
"field": "email",
"message": "Email is required"
}
],
"traceId": "abc123"
}

The use of standardised error bodies, HTTP status codes and validation responses is consistent with the internal API guidance.

Approach 2 – Joi Validation (Recommended)
npm install joi

Schema:

const Joi = require("joi");

const userSchema =
Joi.object({
email: Joi.string()
.email()
.required(),

    name: Joi.string()
      .required()

});

Middleware:

function validate(schema) {

return (req, res, next) => {

    const { error } =
      schema.validate(
        req.body,
        { abortEarly: false }
      );

    if (!error) {
      return next();
    }

    next(
      new ValidationError(
        error.details.map(e => ({
          field: e.path[0],
          message: e.message
        }))
      )
    );

};
}

Use:

router.post(
"/users",
validate(userSchema),
createUser
);

3. Key Fields for Structured Error Logs

Enterprise logging guidance explicitly recommends structured logging, JSON logs, correlation IDs, and traceability across services.

Core Fields
{
"timestamp": "",
"level": "",
"traceId": "",
"message": ""
}

Recommended Production Fields
{
"timestamp": "2026-07-14T12:00:00Z",
"level": "ERROR",

"traceId": "abc123",

"service": "user-service",

"environment": "prod",

"endpoint": "/api/users",

"method": "POST",

"statusCode": 422,

"errorCode": "VALIDATION_ERROR",

"message": "Email is required",

"userId": "1001",

"durationMs": 150,

"host": "node-01"
}

Error-Specific Fields
{
"errorCode": "DB_TIMEOUT",
"stackTrace": "...",
"database": "users-db",
"retryable": true
}

Microservice Fields
{
"traceId": "abc123",
"requestId": "req001",
"parentSpanId": "span01",
"service": "payment-service",
"downstream": "bank-service"
}

Internal discussions specifically mention:

Correlation IDs
Request ID propagation
Structured JSON logs
Distributed tracing across microservices
Senior Interview Answer

"I validate requests at the route layer using Joi or Zod, throw typed exceptions such as ValidationError and NotFoundError, and let a global error middleware generate consistent responses. For observability, I log structured JSON containing timestamp, traceId, endpoint, method, status code, user ID, error code, duration and stack trace, enabling end-to-end tracing across microservices."
