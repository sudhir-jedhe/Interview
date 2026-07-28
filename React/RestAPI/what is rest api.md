1. What is a REST API?
   A REST API exposes resources through URLs and uses HTTP semantics to operate on those resources. A frontend might call GET /products to list products, GET /products/123 to read one product, or POST /orders to create an order.

REST is an architectural style, not a single JavaScript library. In interviews, keep the answer tied to HTTP methods, resources, stateless requests, status codes, and representations such as JSON.

Interview-ready add-on: Explain one concrete resource. "Products are resources, so reading one product is GET /products/:id; creating an order is POST /orders; updating my profile can be PATCH /me."

### Mastering the REST API Interview Explanation

Structuring your explanation around **resources, HTTP semantics, and statelessness** demonstrates a strong foundational grasp of backend-frontend communication.

---

### Core Pillars to Highlight in an Interview

- **Resources over Actions:** Frame everything around nouns (`/products`, `/orders`, `/users`) rather than verbs in the URL path. Let the HTTP method define the action (`GET`, `POST`, `PUT`, `PATCH`, `DELETE`).
- **Statelessness:** Remind the interviewer that every request from the frontend must contain all necessary context (like authentication tokens or cookies) because the server does not store session state between requests.
- **Representations:** Mention that data is typically exchanged in standardized formats like JSON, decoupling the frontend client technology from the backend server implementation.

### Concrete REST API Example: E-Commerce Resource Flow

To see how REST principles map directly to frontend code and backend endpoints, consider an e-commerce application workflow:

---

### 1. Listing Resources (`GET`)

- **Action:** Fetching a list of available products.
- **Request:** `GET /api/v1/products?category=shoes&limit=10`
- **Expected Response (`200 OK`):**

```json
{
  "products": [
    { "id": 42, "name": "Running Shoes", "price": 89.99 },
    { "id": 43, "name": "Trail Sneakers", "price": 119.99 }
  ],
  "nextCursor": "abc123xyz"
}
```

---

### 2. Reading a Single Resource (`GET`)

- **Action:** Viewing the details of a specific product.
- **Request:** `GET /api/v1/products/42`
- **Expected Response (`200 OK`):**

```json
{
  "id": 42,
  "name": "Running Shoes",
  "description": "Lightweight breathable mesh sneakers for daily running.",
  "price": 89.99,
  "inStock": true
}
```

---

### 3. Creating a Resource (`POST`)

- **Action:** Submitting a new order to the backend checkout endpoint.
- **Request:**
- `POST /api/v1/orders`
- **Headers:** `Content-Type: application/json`, `Idempotency-Key: uuid-1234-5678`
- **Body:**

```json
{
  "productId": 42,
  "quantity": 1,
  "shippingAddress": "123 Main St, Cityville"
}
```

- **Expected Response (`201 Created`):**

```json
{
  "orderId": "ord_98765",
  "status": "confirmed",
  "total": 89.99
}
```

---

### 4. Updating a Resource (`PATCH`)

- **Action:** Modifying partial details of the currently authenticated user's profile.
- **Request:**
- `PATCH /api/v1/me`
- **Body:**

```json
{
  "displayName": "Alex Smith"
}
```

- **Expected Response (`200 OK`):**

```json
{
  "user": {
    "id": "usr_555",
    "email": "alex@example.com",
    "displayName": "Alex Smith",
    "timezone": "America/New_York"
  }
}
```

Connecting a **React frontend** to a **Node.js (Express) backend** is the standard full-stack architecture for modern web applications.

Below is a complete, end-to-end implementation demonstrating how to handle a REST API route (`PATCH /api/me`) across both environments, incorporating CORS, status codes, and error handling.

---

### 1. The Backend: Node.js & Express (`server.js`)

The Node.js server must handle incoming requests, validate incoming JSON payloads, set appropriate CORS headers, and return explicit status codes (`200`, `400`, `401`, `500`).

```javascript
const express = require("express");
const cors = require("cors");

const app = express();

// 1. CORS Configuration (Allows frontend origin and credentials like cookies)
app.use(
  cors({
    origin: "http://localhost:5173", // Your React app's development URL
    credentials: true,
  }),
);

// 2. Middleware to parse incoming JSON bodies
app.use(express.json());

// 3. Simulated Database / User Store
let currentUser = {
  id: "usr_123",
  displayName: "Jane Doe",
  timezone: "America/New_York",
};

// 4. PATCH Route for updating profile
app.patch("/api/me", (req, res) => {
  try {
    const { displayName, timezone } = req.body;

    // Validation check (400 Bad Request)
    const errors = {};
    if (displayName !== undefined && displayName.trim().length < 2) {
      errors.displayName = "Display name must be at least 2 characters long.";
    }

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({ errors });
    }

    // Update user record
    if (displayName) currentUser.displayName = displayName;
    if (timezone) currentUser.timezone = timezone;

    // Success response (200 OK)
    return res.status(200).json({
      message: "Profile updated successfully",
      user: currentUser,
    });
  } catch (error) {
    // Server error fallback (500 Internal Server Error)
    console.error("Server error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

app.listen(5000, () => {
  console.log("Backend server running on http://localhost:5000");
});
```

---

### 2. The Frontend: React Component (`EditProfile.jsx`)

The React component communicates with the Node.js server, manages form state, handles loading indicators, and maps backend validation errors next to their respective form fields.

```jsx
import React, { useState } from "react";

export default function EditProfile() {
  const [formData, setFormData] = useState({
    displayName: "Jane Doe",
    timezone: "America/New_York",
  });

  const [fieldErrors, setFieldErrors] = useState({});
  const [globalError, setGlobalError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear validation error for this field as user types
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFieldErrors({});
    setGlobalError("");
    setSuccessMessage("");

    try {
      // Calls the Node.js backend running on port 5000
      const response = await fetch("http://localhost:5000/api/me", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      // Explicitly check response.ok because fetch() doesn't reject on 4xx/5xx status codes
      if (!response.ok) {
        if (response.status === 400 && data.errors) {
          setFieldErrors(data.errors);
          throw new Error("Please correct the validation errors below.");
        } else {
          throw new Error(data.message || "An unexpected error occurred.");
        }
      }

      // Success state update with fresh server data
      setFormData({
        displayName: data.user.displayName,
        timezone: data.user.timezone,
      });
      setSuccessMessage(data.message);
    } catch (error) {
      setGlobalError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        maxWidth: "400px",
        margin: "2rem auto",
        fontFamily: "sans-serif",
      }}
    >
      <h2>Edit Profile (Node + React)</h2>

      {globalError && (
        <div style={{ color: "red", marginBottom: "1rem" }}>{globalError}</div>
      )}
      {successMessage && (
        <div style={{ color: "green", marginBottom: "1rem" }}>
          {successMessage}
        </div>
      )}

      <div style={{ marginBottom: "1rem" }}>
        <label>Display Name:</label>
        <input
          type="text"
          name="displayName"
          value={formData.displayName}
          onChange={handleChange}
          disabled={isSubmitting}
          style={{
            display: "block",
            width: "100%",
            padding: "8px",
            marginTop: "4px",
          }}
        />
        {fieldErrors.displayName && (
          <span style={{ color: "red", fontSize: "0.85rem" }}>
            {fieldErrors.displayName}
          </span>
        )}
      </div>

      <div style={{ marginBottom: "1rem" }}>
        <label>Timezone:</label>
        <input
          type="text"
          name="timezone"
          value={formData.timezone}
          onChange={handleChange}
          disabled={isSubmitting}
          style={{
            display: "block",
            width: "100%",
            padding: "8px",
            marginTop: "4px",
          }}
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        style={{
          padding: "10px 16px",
          cursor: isSubmitting ? "not-allowed" : "pointer",
        }}
      >
        {isSubmitting ? "Saving..." : "Save Changes"}
      </button>
    </form>
  );
}
```

**What is the difference between REST and HTTP?**
HTTP is the protocol: methods, headers, status codes, request bodies, response bodies, caching, and authentication headers. REST is a style for designing APIs that commonly uses HTTP well.

A REST-like API should make resources and actions understandable through HTTP instead of hiding everything behind one generic endpoint.
