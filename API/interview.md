Here is an in-depth, comprehensive breakdown of the entire REST API masterclass curriculum illustrated in your study notes. This guide spans all core concepts, from foundational architecture and request-response cycles to security, best practices, and automated testing.

---

# Module 1: Introduction to REST API

## 1. What is an API?

* **Definition:** An **API** (Application Programming Interface) is a set of rules and protocols that allows two software applications to communicate with each other.
* **Role:** It acts as an intermediary layer between a client (such as a browser, mobile app, or desktop software) and a server.

## 2. What is REST?

* **Definition:** **REST** stands for *Representational State Transfer*. It is an architectural style designed for building networked applications.
* **Mechanism:** It relies on standard HTTP methods to perform CRUD (Create, Read, Update, Delete) operations on resources.

## 3. REST vs. SOAP Comparison

| Feature         | REST                                        | SOAP                                             |
| --------------- | ------------------------------------------- | ------------------------------------------------ |
| **Type**        | Architectural Style                         | Protocol                                         |
| **Transport**   | Uses HTTP                                   | Uses HTTP, SMTP, TCP, etc.                       |
| **Weight**      | Lightweight                                 | Heavyweight                                      |
| **Formats**     | Supports multiple formats (JSON, XML, etc.) | Supports only XML                                |
| **State**       | Stateless                                   | Can be Stateful                                  |
| **Performance** | High performance and scalability            | Lower performance compared to REST               |
| **Usage**       | Widely used in Web and Mobile Apps          | Used primarily in Enterprise/Legacy applications |

## 4. Client-Server Architecture

In REST, the client and server are completely decoupled and independent entities:

* **Client:** Handles the UI/App layer and initiates requests.
* **Server:** Processes incoming requests, manages business logic and data storage, and returns responses.

## 5. Resource-Based Architecture

* **Core Principle:** Everything in REST is treated as a **resource**.
* **Identification:** Each resource is uniquely identified by a URI (Uniform Resource Identifier).
* *Example Resources & Representations:*
* `/users` $\rightarrow$ JSON / XML / Plain Text
* `/users/1` $\rightarrow$ JSON / XML
* `/products/10` $\rightarrow$ JSON
* `/orders/100` $\rightarrow$ HTML

* **Rule:** The URI identifies the *resource*, while the representation defines its *current state*.

## 6. The 6 REST Constraints

1. **Client-Server:** Complete separation of concerns between client UI and server data processing.
2. **Stateless:** Each request from a client must contain all required authentication and context information. The server stores zero client session state between requests.
3. **Cacheable:** Server responses must explicitly define themselves as cacheable or non-cacheable to optimize network performance.
4. **Uniform Interface:** A consistent contract for client-server interaction involving resources, methods, and representations.
5. **Layered System:** A client cannot tell whether it is connected directly to the end server or an intermediary proxy/load balancer.
6. *(Code-On-Demand - Optional)*: Servers can temporarily extend client functionality by transferring executable code.

## 7. Why REST is Widely Used

* Simple, intuitive, and easy to understand.
* Leverages standard HTTP methods.
* Lightweight and flexible.
* Highly scalable due to statelessness.
* Native support for mobile and web apps.

---

# Module 2: HTTP Methods (Verbs)

HTTP methods dictate the intended action to be performed on a resource identified by a URI.

| Method      | Purpose / Description                                  | Idempotent? | Safe?   | Example URI        | Typical Use Case                                    |
| ----------- | ------------------------------------------------------ | ----------- | ------- | ------------------ | --------------------------------------------------- |
| **GET**     | Retrieve data from the server.                         | **Yes**     | **Yes** | `GET /users`       | Fetch all users or fetch a user by ID.              |
| **POST**    | Create a new resource.                                 | **No**      | **No**  | `POST /users`      | Register a new user or submit form data.            |
| **PUT**     | Update or replace an existing resource entirely.       | **Yes**     | **No**  | `PUT /users/10`    | Overwrite/update complete user record info.         |
| **PATCH**   | Partially update an existing resource.                 | **Yes**     | **No**  | `PATCH /users/10`  | Modify a single field (e.g., change user email).    |
| **DELETE**  | Delete a resource from the server.                     | **Yes**     | **No**  | `DELETE /users/10` | Remove a user account.                              |
| **OPTIONS** | Get information about supported communication methods. | **Yes**     | **Yes** | `OPTIONS /users`   | CORS preflight checks and allowed operations.       |
| **HEAD**    | Identical to GET, but returns headers only (no body).  | **Yes**     | **Yes** | `HEAD /users/10`   | Check resource existence or fetch metadata headers. |

## Key Definitions

* **Idempotent:** Making multiple identical requests produces the exact same server state as making a single request (e.g., deleting user ID 10 twice still results in user 10 being deleted).
* **Safe:** Methods that do not alter server state or trigger side effects (Read-only operations like GET, HEAD, OPTIONS).

---

# Module 3: HTTP Status Codes

Status codes are 3-digit integers returned by the server to communicate the outcome of a request.

* **`2xx` - Success:** Request was received, understood, and successfully processed.
* **200 OK:** Standard success response.
* **201 Created:** Resource successfully created (typically via POST).
* **204 No Content:** Request succeeded, but there is no body payload to return (common for DELETE).
* **205 Reset Content:** Request successful, command client to reset document view.

* **`3xx` - Redirection:** Further action needs to be taken to complete the request.
* **301 Moved Permanently:** Resource has a new permanent URI.
* **302 Found:** Temporary redirection to another URI.
* **304 Not Modified:** Cached version is still valid; payload is omitted to save bandwidth.
* **307 Temporary Redirect:** Resends request with same method and body.

* **`4xx` - Client Errors:** The request contains bad syntax or cannot be fulfilled.
* **400 Bad Request:** Malformed syntax or invalid parameters.
* **401 Unauthorized:** Missing or invalid authentication credentials.
* **403 Forbidden:** Server understands credentials, but user lacks permission to access the resource.
* **404 Not Found:** The requested URI/resource does not exist.
* **405 Method Not Allowed:** HTTP method is disabled or not supported for this resource.
* **409 Conflict:** Request could not be processed due to a state conflict (e.g., duplicate unique email registration).
* **422 Unprocessable Entity:** Syntactically correct request, but failed semantic business validation rules.

* **`5xx` - Server Errors:** The server failed to fulfill a valid request due to an internal fault.
* **500 Internal Server Error:** Generic unexpected server crash or unhandled exception.
* **502 Bad Gateway:** Upstream server returned an invalid response.
* **503 Service Unavailable:** Server is overloaded or down for maintenance.
* **504 Gateway Timeout:** Upstream server failed to respond in time.
* **505 HTTP Version Not Supported:** Server does not support the requested HTTP protocol version.

---

# Module 4: Request & Response Anatomy

## 1. Structure of an HTTP Request

* **URL / Endpoint:** Target path identifying the resource (`POST /api/users`).
* **Query Parameters:** Optional key-value pairs appended after `?` used for filtering, sorting, or pagination (`/api/users?page=1&limit=10`).
* **Path Parameters:** Dynamic variables embedded directly inside the URI path (`/api/users/10`).
* **Headers:** Metadata providing context (e.g., `Authorization: Bearer <token>`, `Content-Type: application/json`).
* **Body (Payload):** Data sent to the server in POST, PUT, or PATCH requests, formatted primarily in JSON.

## 2. Structure of an HTTP Response

* **Status Line:** HTTP Version + Status Code + Status Message (`HTTP/1.1 201 Created`).
* **Headers:** Metadata regarding the response (e.g., `Content-Type: application/json`, `Date`).
* **Body:** The returned payload containing requested data or error structures, typically structured as JSON.

---

# Module 5: REST API Best Practices

1. **Use Nouns, Not Verbs in URIs:** URIs represent things (resources), not actions.

* ❌ *Avoid:* `/getUsers`, `/deleteUser/10`
* ✅ *Use:* `GET /users`, `DELETE /users/10`

1. **Use Plural Nouns:** Keep resource collections consistent by defaulting to plural names (`/users`, `/products`, `/orders`).
2. **Filtering, Sorting, and Searching:** Use query parameters rather than complex nested paths:

* Filtering: `/users?role=admin&status=active`
* Sorting: `/users?sort=name&order=asc`
* Searching: `/users?search=john`

1. **Pagination:** Break massive data sets into manageable chunks to preserve server memory and network performance:

* Example: `/users?page=1&limit=10` or using offset pagination (`limit=20&offset=40`).

1. **API Versioning:** Always namespace your endpoints to prevent breaking changes for active mobile/web client apps (`/api/v1/users` vs `/api/v2/users`).
2. **Consistent Error Handling:** Return predictable error structures alongside appropriate status codes:

```json
{
  "success": false,
  "statusCode": 404,
  "message": "User not found",
  "errors": []
}

```

1. **Consistent Success Formatting:** Wrap responses cleanly:

```json
{
  "success": true,
  "message": "User retrieved successfully",
  "data": { "id": 10, "name": "John Doe" }
}

```

---

# Module 6: Authentication & Security

## 1. Authentication vs. Authorization

* **Authentication:** Verifying *who* the user is ("Are you who you claim to be?"). Confirms identity via Login/Credentials.
* **Authorization:** Verifying *what* the user is allowed to do ("Do you have permission to access this resource?"). Managed via Roles, Claims, and Access Control Policies.

## 2. Authentication Mechanisms

* **JWT (JSON Web Token):** A compact, URL-safe stateless token format consisting of a Header, Payload (claims), and cryptographic Signature. The server does not need to store active session maps in database tables.
* **Bearer Token:** Standard HTTP authorization schema transmitting tokens via headers (`Authorization: Bearer <token>`).
* **OAuth 2.0:** Open standard authorization framework for delegated third-party logins (e.g., "Sign in with Google/GitHub").
* **API Keys:** Unique secret strings passed in query strings or headers, primarily designed for server-to-server microservice communication.

## 3. Core Security Controls

* **HTTPS (SSL/TLS):** Mandatory encryption in transit. Protects against eavesdropping and man-in-the-middle attacks.
* **CORS (Cross-Origin Resource Sharing):** Restricts or allows web browsers to load resources from external domains using specific HTTP headers (`Access-Control-Allow-Origin`).
* **Rate Limiting & Throttling:** Restricts the number of requests a client can make in a given timeframe (e.g., `100 req / min`) to mitigate brute-force and DDoS attacks.
* **Input Validation & Sanitization:** Never trust client input. Validate data types, lengths, and ranges on the server side to prevent SQL Injection, Cross-Site Scripting (XSS), and Mass Assignment vulnerabilities.

---

# Module 7: Testing & Documentation

## 1. API Testing Ecosystem

* **Tools:** Postman, Insomnia, Thunder Client (VS Code extension), cURL, and Swagger UI.
* **Postman Testing Workflow:**

1. Define Request Method and URL (`GET /users`).
2. Input Headers (`Authorization`, `Content-Type`).
3. Provide Query Parameters or JSON Body Payload.
4. Send Request.
5. Validate Response Payload and Status Code.
6. Write automated Postman test scripts using JavaScript:

```javascript
pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

pm.test("Response time is less than 500ms", function () {
    pm.expect(pm.response.responseTime).to.be.below(500);
});

```

## 2. API Documentation & OpenAPI (Swagger)

* **What to Document:** Base URLs, Authentication schemes, Endpoints, Path/Query parameters, Request/Response bodies, Error status codes, and concrete payload examples.
* **OpenAPI Specification:** A machine-readable description format (written in YAML or JSON) used to describe REST APIs, enabling automatic generation of interactive developer documentation portals (Swagger UI) and client SDK code.

**OpenAPI** (formerly known as Swagger) is the industry-standard specification format for describing, producing, consuming, and visualizing RESTful web services.

Using OpenAPI allows you to write machine-readable API descriptions in YAML or JSON, which can then be used to automatically generate interactive documentation, client SDKs, and mock servers.

---

## 1. OpenAPI vs. Swagger: What's the Difference?

* **OpenAPI:** The official, open-source specification standard (governed by the OpenAPI Initiative under the Linux Foundation) that defines how REST APIs should be described.
* **Swagger:** A suite of tools originally created by SmartBear (and donated to the OpenAPI Initiative) used to implement and work with the OpenAPI specification (e.g., Swagger Editor, Swagger UI, Swagger Codegen).

---

## 2. Design-First vs. Code-First Approaches

When integrating OpenAPI into your workflow, teams typically choose one of two development paradigms:

### A. Design-First Approach

* **How it works:** You write the OpenAPI specification file (`openapi.yaml`) before writing any application code. Frontend and backend developers review the contract together.
* **Benefits:** Acts as a single source of truth; allows frontend teams to mock APIs and start building UI before backend logic is written.

### B. Code-First Approach

* **How it works:** You write your application code (using annotations or decorators in your framework, like `tsoa` for Node.js, FastAPI for Python, or Springfox for Java), and the tooling automatically scans your code to generate the OpenAPI spec.
* **Benefits:** Faster to set up initially; ensures documentation never drifts out of sync with actual code.

---

## 3. Anatomy of an OpenAPI Specification (`openapi.yaml`)

A standard OpenAPI 3.0+ document consists of metadata, server definitions, path routing, and reusable data schemas.

```yaml
openapi: 3.0.3
info:
  title: Task Management API
  description: A production-ready REST API for managing user tasks.
  version: 1.0.0

servers:
  - url: https://api.example.com/v1
    description: Production Server

paths:
  /tasks:
    get:
      summary: Retrieve a list of tasks
      parameters:
        - name: status
          in: query
          required: false
          schema:
            type: string
            enum: [pending, completed]
      responses:
        '200':
          description: A JSON array of task objects
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/Task'
        '401':
          description: Unauthorized

components:
  schemas:
    Task:
      type: object
      required:
        - id
        - title
      properties:
        id:
          type: string
          example: tsk_99a82b
        title:
          type: string
          example: Review API documentation
        completed:
          type: boolean
          example: false

```

---

## 4. Key Benefits of Using OpenAPI

1. **Interactive Documentation (Swagger UI / Redoc):** By feeding your `openapi.yaml` file into Swagger UI, developers get a gorgeous web interface where they can inspect schemas, view request/response examples, and test live endpoints directly ("Try it out").
2. **Automated Client SDK Generation:** Tools like **OpenAPI Generator** can parse your spec file and instantly generate fully typed client libraries in over 40 languages (TypeScript, Python, Go, Java, Swift) for your consumers.
3. **Contract Testing & Validation:** Automated testing tools can validate incoming and outgoing API payloads against your OpenAPI spec to catch breaking changes or malformed data before deployment.

---

## 5. Popular Ecosystem Tools

* **Swagger Editor:** A browser-based editor where you can write and validate OpenAPI YAML files in real-time.
* **Swagger UI:** Renders your spec into an interactive documentation website.
* **Redoc:** An alternative, highly polished three-panel documentation renderer favored for its clean aesthetic.
* **Stoplight Studio:** A modern desktop and web-based visual designer for building and maintaining OpenAPI specifications.

Production-grade **API Documentation** serves as the contract between backend services and consumer developers. Clear, structured documentation reduces integration friction, minimizes support tickets, and accelerates developer adoption.

---

**Core Pillars of Complete API Documentation**

1. **Getting Started & Authentication:**

* Step-by-step instructions to register for an API key or generate OAuth tokens.
* Clear specification of the authorization header (e.g., `Authorization: Bearer <token>`).
* Base URL structure (e.g., `[https://api.example.com/v1](https://api.example.com/v1)`).

1. **Endpoint Reference Specification:**

* **HTTP Method & Path:** Explicit HTTP verb (`GET`, `POST`, `PUT`, `PATCH`, `DELETE`) and resource path.
* **Parameters:** Path variables, query string parameters, and header options labeled with types, constraints, and requirement flags (`Required` vs. `Optional`).
* **Request Payloads:** Exact JSON schemas with sample request bodies.
* **Response Payloads:** Status code mappings (`200`, `201`, `400`, `401`, `404`, `500`) with full schema definitions.

1. **Error Handling & Standard Error Objects:**

* Predictable, machine-readable error responses to help consumers debug failures quickly.

1. **Operational Rules & Limits:**

* Rate limiting rules (e.g., requests per minute) and header indicators (`X-RateLimit-Remaining`).
* Versioning and sunset/deprecation schedules.

---

**Standard Documentation Template: Individual Endpoint**

### `POST /api/v1/orders`

Creates a new customer order and processes the initial charge.

* **Authentication:** Bearer Token (Required)
* **Headers:**
* `Authorization: Bearer <JWT_TOKEN>` (Required)
* `Content-Type: application/json` (Required)
* `Idempotency-Key: <UUID>` (Recommended for payment deduplication)

#### Request Body

| Field               | Type      | Required | Description                                            |
| ------------------- | --------- | -------- | ------------------------------------------------------ |
| `customerId`        | `string`  | **Yes**  | Unique UUID of the customer (`usr_...`).               |
| `items`             | `array`   | **Yes**  | Array of order line items (minimum 1 item).            |
| `items[].productId` | `string`  | **Yes**  | Identifier of the target product (`prd_...`).          |
| `items[].quantity`  | `integer` | **Yes**  | Must be $\ge 1$.                                       |
| `currency`          | `string`  | **Yes**  | ISO-4217 3-letter currency code (`USD`, `EUR`, `INR`). |

```json
{
  "customerId": "usr_98b72c14",
  "items": [
    {
      "productId": "prd_4410aa9",
      "quantity": 2
    }
  ],
  "currency": "USD"
}

```

#### Responses

**`201 Created`** — Order processed successfully.

```json
{
  "id": "ord_108429ab",
  "customerId": "usr_98b72c14",
  "status": "confirmed",
  "totalAmount": 199.98,
  "currency": "USD",
  "createdAt": "2026-08-18T02:00:00Z"
}

```

**`422 Unprocessable Entity`** — Validation failed.

```json
{
  "error": {
    "code": "INSUFFICIENT_STOCK",
    "message": "Product prd_4410aa9 only has 1 unit available in inventory.",
    "field": "items[0].quantity"
  }
}

```

---

**Modern Tooling & Specification Standards**

* **OpenAPI Specification (OAS 3.0 / 3.1):** Machine-readable YAML/JSON contract standard.
* **Interactive Visualizers:**
* **Swagger UI / Scalar / Redoc:** Renders OpenAPI specs into searchable, interactive "Try It Out" consoles.
* **Mintlify / GitBook:** Modern, high-performance developer documentation portals.

* **SDK & Client Generators:** **OpenAPI Generator** or **Fern** to automatically compile typed SDKs in TypeScript, Python, Go, and Java directly from your spec.
There are two standard, industry-grade ways to automate OpenAPI (Swagger) documentation in a Node.js/TypeScript stack without maintaining a detached, error-prone `openapi.yaml` file manually:

1. **JSDoc / Swagger-JSDoc Comments:** Lightweight, works directly with raw Express.js without requiring architectural refactoring.
2. **TypeScript Decorators via `tsoa`:** Type-safe, generates both route handlers and a strict OpenAPI spec directly from TypeScript types and classes.

---

### Method 1: JSDoc Comments with `swagger-jsdoc` and `swagger-ui-express`

This approach scans your route files for OpenAPI YAML blocks written inside JSDoc comments (`/** @openapi ... */`) and serves Swagger UI.

**Step 1: Install Dependencies**

```bash
npm install swagger-ui-express swagger-jsdoc express
npm install --save-dev typescript @types/express @types/swagger-ui-express @types/swagger-jsdoc ts-node

```

**Step 2: Configure OpenAPI Definition & Scanner (`src/swagger.ts`)**

```typescript
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Express } from 'express';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.3',
    info: {
      title: 'Task Management API',
      version: '1.0.0',
      description: 'Auto-generated API documentation using JSDoc comments',
    },
    servers: [
      {
        url: 'http://localhost:3000/api/v1',
        description: 'Local Development Server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  // Path to scan for JSDoc documentation comments
  apis: ['./src/routes/*.ts'],
};

const swaggerSpec = swaggerJsdoc(options);

export function setupSwagger(app: Express): void {
  // 1. Serve interactive Swagger UI
  app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  // 2. Expose raw OpenAPI JSON spec for tooling/CI
  app.get('/docs.json', (_req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });
}

```

**Step 3: Document Routes with JSDoc (`src/routes/tasks.ts`)**

```typescript
import { Router, Request, Response } from 'express';

const router = Router();

/**
 * @openapi
 * components:
 *   schemas:
 *     Task:
 *       type: object
 *       required:
 *         - title
 *       properties:
 *         id:
 *           type: string
 *           example: "tsk_109283"
 *         title:
 *           type: string
 *           example: "Implement automated API docs"
 *         completed:
 *           type: boolean
 *           example: false
 *     CreateTaskInput:
 *       type: object
 *       required:
 *         - title
 *       properties:
 *         title:
 *           type: string
 *           example: "Implement automated API docs"
 */

/**
 * @openapi
 * /tasks:
 *   get:
 *     summary: Retrieve all tasks
 *     tags:
 *       - Tasks
 *     responses:
 *       200:
 *         description: A list of tasks
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Task'
 *   post:
 *     summary: Create a new task
 *     tags:
 *       - Tasks
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateTaskInput'
 *     responses:
 *       201:
 *         description: Task created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 */
router.get('/tasks', (_req: Request, res: Response) => {
  res.json([{ id: 'tsk_109283', title: 'Implement automated API docs', completed: false }]);
});

router.post('/tasks', (req: Request, res: Response) => {
  const newTask = { id: 'tsk_109283', title: req.body.title, completed: false };
  res.status(201).json(newTask);
});

export default router;

```

**Step 4: Mount in Server (`src/app.ts`)**

```typescript
import express from 'express';
import taskRouter from './routes/tasks';
import { setupSwagger } from './swagger';

const app = express();
app.use(express.json());

// Mount routes & docs
app.use('/api/v1', taskRouter);
setupSwagger(app);

app.listen(3000, () => {
  console.log('Server running at http://localhost:3000');
  console.log('API Documentation available at http://localhost:3000/docs');
});

```

---

### Method 2: TypeScript Decorators with `tsoa` (End-to-End Type Safety)

`tsoa` is the gold standard for TypeScript teams. It uses TypeScript interfaces and class decorators (`@Route`, `@Get`, `@Body`, `@SuccessResponse`) to automatically generate both the **OpenAPI specification file** and the **Express route wiring** during compilation.

**Step 1: Install Dependencies**

```bash
npm install tsoa express swagger-ui-express
npm install --save-dev typescript @types/express @types/swagger-ui-express @types/node ts-node

```

**Step 2: Configure `tsconfig.json` and `tsoa.json**`

Ensure decorator support is enabled in `tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "commonjs",
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true,
    "strict": true,
    "outDir": "./dist"
  }
}

```

Create `tsoa.json` at the root of your project:

```json
{
  "entryFile": "src/app.ts",
  "noImplicitAdditionalProperties": "throw-on-extras",
  "controllerPathGlobs": ["src/controllers/**/*.controller.ts"],
  "spec": {
    "outputDirectory": "build",
    "specVersion": 3,
    "info": {
      "title": "Task API",
      "version": "1.0.0"
    }
  },
  "routes": {
    "routesDir": "build"
  }
}

```

**Step 3: Define Models and Controller (`src/controllers/tasks.controller.ts`)**

```typescript
import { Controller, Route, Get, Post, Body, SuccessResponse, Tags } from 'tsoa';

export interface Task {
  id: string;
  title: string;
  completed: boolean;
}

export interface TaskCreationParams {
  title: string;
}

@Tags('Tasks')
@Route('tasks')
export class TasksController extends Controller {
  @Get('')
  public async getTasks(): Promise<Task[]> {
    return [
      { id: 'tsk_101', title: 'Review PR', completed: true }
    ];
  }

  @SuccessResponse('201', 'Created')
  @Post('')
  public async createTask(@Body() requestBody: TaskCreationParams): Promise<Task> {
    this.setStatus(201);
    return {
      id: 'tsk_102',
      title: requestBody.title,
      completed: false
    };
  }
}

```

**Step 4: Generate Specs & Run Server (`src/app.ts`)**

Add a generation script to `package.json`:

```json
"scripts": {
  "build:docs": "tsoa spec-and-routes",
  "start": "npm run build:docs && ts-node src/app.ts"
}

```

Server setup (`src/app.ts`):

```typescript
import express, { json, urlencoded } from 'express';
import swaggerUi from 'swagger-ui-express';
import { RegisterRoutes } from '../build/routes'; // Generated by tsoa

const app = express();

app.use(urlencoded({ extended: true }));
app.use(json());

// Serve generated Swagger spec
app.use('/docs', swaggerUi.serve, async (_req: express.Request, res: express.Response) => {
  const swaggerSpec = await import('../build/swagger.json');
  return res.send(swaggerUi.generateHTML(swaggerSpec));
});

// Register tsoa auto-generated routes
RegisterRoutes(app);

app.listen(3000, () => {
  console.log('App running on http://localhost:3000/docs');
});

```

---

### Comparison: When to Use Which

| Feature                | `swagger-jsdoc` (Comments)                | `tsoa` (Decorators)                                    |
| ---------------------- | ----------------------------------------- | ------------------------------------------------------ |
| **Learning Curve**     | Very low (uses standard YAML/JSDoc)       | Moderate (requires specific controller patterns)       |
| **Type Safety**        | No (manual schema updates in comments)    | **Yes** (inferred directly from TypeScript interfaces) |
| **Runtime Validation** | None (requires manual Zod/Joi middleware) | **Built-in** (validates request bodies automatically)  |
| **Best For**           | Existing Express codebases                | New TypeScript microservices & enterprise projects     |
