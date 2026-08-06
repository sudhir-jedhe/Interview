Integrating **Zod** schema validation with your Express error architecture gives you type-safe request validation and automatically converts validation failures into structured HTTP $400$ Bad Request responses.

Here is a complete, production-ready implementation that hooks directly into custom error classes and the centralized error-handling middleware.

---

### Step 1: Request Validation Middleware (`src/middleware/validate.js`)

Create a reusable higher-order middleware function that accepts a Zod schema containing validation rules for `body`, `query`, and/or `params`.

```javascript
// src/middleware/validate.js
const { BadRequestError } = require('../errors/domainErrors');

/**
 * Validates incoming requests against a Zod schema.
 * @param {import('zod').ZodSchema} schema 
 */
const validate = (schema) => async (req, res, next) => {
  try {
    // Parse and sanitize req input against the schema
    const parsed = await schema.parseAsync({
      body: req.body,
      query: req.query,
      params: req.params,
    });

    // Replace request properties with sanitized/coerced Zod data
    req.body = parsed.body ?? req.body;
    req.query = parsed.query ?? req.query;
    req.params = parsed.params ?? req.params;

    next();
  } catch (error) {
    if (error.name === 'ZodError') {
      // Map Zod issues into a clean, field-level error object
      const formattedErrors = error.errors.map((err) => ({
        field: err.path.join('.').replace(/^(body|query|params)\./, ''), // e.g. "body.email" -> "email"
        message: err.message,
        code: err.code,
      }));

      // Pass a custom BadRequestError with field-level metadata to next()
      return next(new BadRequestError('Invalid request parameters', formattedErrors));
    }

    next(error);
  }
};

module.exports = validate;

```

---

### Step 2: Defining Zod Validation Schemas (`src/schemas/userSchemas.js`)

Define Zod schemas matching the expected shape of HTTP payloads:

```javascript
// src/schemas/userSchemas.js
const { z } = require('zod');

const createUserSchema = z.object({
  body: z.object({
    username: z
      .string({ required_error: 'Username is required' })
      .min(3, 'Username must be at least 3 characters long')
      .max(20, 'Username cannot exceed 20 characters'),
    
    email: z
      .string({ required_error: 'Email is required' })
      .email('Invalid email address format'),
    
    age: z
      .number({ required_error: 'Age is required' })
      .int('Age must be an integer')
      .min(18, 'User must be at least 18 years old'),

    role: z
      .enum(['USER', 'ADMIN'], { invalid_type_error: 'Role must be USER or ADMIN' })
      .optional()
      .default('USER'),
  }),
});

const getUserByIdSchema = z.object({
  params: z.object({
    id: z.string().uuid('User ID must be a valid UUID v4'),
  }),
});

module.exports = {
  createUserSchema,
  getUserByIdSchema,
};

```

---

### Step 3: Application & Route Setup (`src/app.js`)

Wire the Zod schemas into Express routes using `validate(schema)` alongside your `asyncHandler` and `errorHandler`.

```javascript
// src/app.js
const express = require('express');
const validate = require('./middleware/validate');
const asyncHandler = require('./middleware/asyncHandler');
const errorHandler = require('./middleware/errorMiddleware');
const { createUserSchema, getUserByIdSchema } = require('./schemas/userSchemas');

const app = express();
app.use(express.json());

// --- Routes with Zod Middleware Protection ---

// POST /api/users (Validates body payload)
app.post(
  '/api/users',
  validate(createUserSchema),
  asyncHandler(async (req, res) => {
    // req.body is fully validated, typed, and sanitized here
    const { username, email, age, role } = req.body;

    res.status(201).json({
      success: true,
      data: { id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', username, email, age, role },
    });
  })
);

// GET /api/users/:id (Validates route params)
app.get(
  '/api/users/:id',
  validate(getUserByIdSchema),
  asyncHandler(async (req, res) => {
    const { id } = req.params;

    res.json({
      success: true,
      data: { id, username: 'Alice', email: 'alice@example.com' },
    });
  })
);

// Register Centralized Error Middleware (Handles BadRequestError from Zod automatically)
app.use(errorHandler);

app.listen(3000, () => console.log('Server listening on port 3000'));

```

---

### Sample API Responses

#### Request: `POST /api/users` (Invalid Payload)

```json
// Body sent:
{
  "username": "al",
  "email": "not-an-email",
  "age": 16
}

```

#### Response (`400 Bad Request`)

```json
{
  "success": false,
  "error": {
    "message": "Invalid request parameters",
    "details": [
      {
        "field": "username",
        "message": "Username must be at least 3 characters long",
        "code": "too_small"
      },
      {
        "field": "email",
        "message": "Invalid email address format",
        "code": "invalid_string"
      },
      {
        "field": "age",
        "message": "User must be at least 18 years old",
        "code": "too_small"
      }
    ]
  }
}

```

#### Request: `GET /api/users/123` (Invalid UUID Param)

#### Response (`400 Bad Request`)

```json
{
  "success": false,
  "error": {
    "message": "Invalid request parameters",
    "details": [
      {
        "field": "id",
        "message": "User ID must be a valid UUID v4",
        "code": "invalid_string"
      }
    ]
  }
}

```

---

### Key Architectural Advantages

1. **Fail Fast:** Requests with invalid payloads are rejected at the edge before reaching business logic or database layers.
2. **Type Coercion & Stripping:** Zod automatically coerces query string primitives (e.g., converting `"10"` to number `10`) and strips out unexpected extra fields from incoming payloads.
3. **Single Response Contract:** Zod errors flow straight into the existing `BadRequestError` $\rightarrow$ `errorHandler` pipeline, maintaining a uniform JSON error output across the entire API.
