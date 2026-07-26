### Production-Ready RESTful API: Node.js, Express, Postgres (pg), & JWT Authentication

This complete, modular implementation covers all core requirements: scalable Express routing, custom error handling middleware, CRUD operations via a PostgreSQL database (`pg` driver), and secure JWT authentication.

---

### Phase 1: Database Setup & Schema (`db/database.js` & `schema.sql`)

#### 1. SQL Schema (`schema.sql`)

Run this in your PostgreSQL instance to initialize tables:

```sql
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS posts (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  body TEXT NOT NULL,
  user_id INT REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

```

#### 2. Postgres Connection Pool (`db/database.js`)

```javascript
const { Pool } = require("pg");

const pool = new Pool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD || "password",
  database: process.env.DB_NAME || "rest_api_db",
  port: process.env.DB_PORT || 5432,
});

module.exports = {
  query: (text, params) => pool.query(text, params),
};
```

---

### Phase 2: Middleware Architecture (`middleware/`)

#### 1. Auth Middleware (`middleware/auth.js`)

```javascript
const jwt = require("jsonwebtoken");

const verifyJWT = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Bearer <token>

  if (!token) {
    return res.status(401).json({ error: "Access token missing or malformed" });
  }

  jwt.verify(
    token,
    process.env.JWT_SECRET || "super-secret-key",
    (err, decoded) => {
      if (err) {
        return res.status(403).json({ error: "Invalid or expired token" });
      }
      req.user = decoded; // Attach { userId, email } to request context
      next();
    },
  );
};

module.exports = { verifyJWT };
```

#### 2. Global Error Handling Middleware (`middleware/errorHandler.js`)

```javascript
const errorHandler = (err, req, res, next) => {
  console.error(`[Error] ${err.message}`, err.stack);

  // Handle specific database unique constraint violations (Postgres Error Code: 23505)
  if (err.code === "23505") {
    return res
      .status(409)
      .json({ error: "Conflict: Resource already exists." });
  }

  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    error: err.message || "Internal Server Error",
  });
};

module.exports = { errorHandler };
```

---

### Phase 3: Controllers / Business Logic (`controllers/`)

#### 1. Auth Controller (`controllers/authController.js`)

```javascript
const db = require("../db/database");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "super-secret-key";

exports.register = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const query = `INSERT INTO users (email, password) VALUES ($1, $2) RETURNING id, email, created_at`;
    const { rows } = await db.query(query, [email, hashedPassword]);

    res
      .status(201)
      .json({ message: "User registered successfully", user: rows[0] });
  } catch (error) {
    next(error); // Forward to global error handler
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const { rows } = await db.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);

    if (
      rows.length === 0 ||
      !(await bcrypt.compare(password, rows[0].password))
    ) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const user = rows[0];
    const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, {
      expiresIn: "1h",
    });

    res.json({ message: "Login successful", accessToken: token });
  } catch (error) {
    next(error);
  }
};
```

#### 2. Post CRUD Controller (`controllers/postController.js`)

```javascript
const db = require("../db/database");

exports.createPost = async (req, res, next) => {
  try {
    const { title, body } = req.body;
    const userId = req.user.userId; // Extracted from verified JWT

    const query = `INSERT INTO posts (title, body, user_id) VALUES ($1, $2, $3) RETURNING *`;
    const { rows } = await db.query(query, [title, body, userId]);

    res.status(201).json(rows[0]);
  } catch (error) {
    next(error);
  }
};

exports.getPosts = async (req, res, next) => {
  try {
    const query = `SELECT posts.*, users.email as author_email FROM posts JOIN users ON posts.user_id = users.id`;
    const { rows } = await db.query(query);
    res.json(rows);
  } catch (error) {
    next(error);
  }
};

exports.updatePost = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, body } = req.body;
    const userId = req.user.userId;

    // Ensure the post belongs to the authenticated user
    const checkQuery = `SELECT * FROM posts WHERE id = $1 AND user_id = $2`;
    const checkResult = await db.query(checkQuery, [id, userId]);
    if (checkResult.rows.length === 0) {
      return res
        .status(403)
        .json({ error: "Unauthorized to update this post" });
    }

    const updateQuery = `UPDATE posts SET title = $1, body = $2 WHERE id = $3 RETURNING *`;
    const { rows } = await db.query(updateQuery, [title, body, id]);

    res.json(rows[0]);
  } catch (error) {
    next(error);
  }
};

exports.deletePost = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    const checkQuery = `SELECT * FROM posts WHERE id = $1 AND user_id = $2`;
    const checkResult = await db.query(checkQuery, [id, userId]);
    if (checkResult.rows.length === 0) {
      return res
        .status(403)
        .json({ error: "Unauthorized to delete this post" });
    }

    await db.query(`DELETE FROM posts WHERE id = $1`, [id]);
    res.json({ message: "Post deleted successfully" });
  } catch (error) {
    next(error);
  }
};
```

---

### Phase 4: Routers & Main Server Setup (`routes/` & `server.js`)

#### 1. API Routing Configuration (`routes/apiRoutes.js`)

```javascript
const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const postController = require("../controllers/postController");
const { verifyJWT } = require("../middleware/auth");

// Auth Endpoints
router.post("/auth/register", authController.register);
router.post("/auth/login", authController.login);

// Post CRUD Endpoints (Protected via verifyJWT middleware)
router.get("/posts", postController.getPosts);
router.post("/posts", verifyJWT, postController.createPost);
router.put("/posts/:id", verifyJWT, postController.updatePost);
router.delete("/posts/:id", verifyJWT, postController.deletePost);

module.exports = router;
```

#### 2. Express Server Root (`server.js`)

```javascript
const express = require("express");
const cors = require("cors");
const apiRoutes = require("./routes/apiRoutes");
const { errorHandler } = require("./middleware/errorHandler");

const app = express();

// Core Middleware
app.use(express.json());
app.use(cors());

// Mount API Routes
app.use("/api", apiRoutes);

// Catch-All 404 Route Not Found Middleware
app.use((req, res, next) => {
  res.status(404).json({ error: "Endpoint not found" });
});

// Global Error Handler Middleware (Must be defined last)
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```
