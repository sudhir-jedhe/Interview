You can customize the `fetch()` API in JavaScript to suit your specific needs by adding options such as custom headers, credentials, or methods. Here's how to use the `fetch()` method and customize it for various scenarios:

### Basic `fetch()` Example:
The `fetch()` API makes an HTTP request and returns a Promise that resolves to the response.

```javascript
fetch('https://api.example.com/data')
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Error:', error));
```

### Customizing `fetch()`

You can customize the request by passing an options object as the second argument to `fetch()`. This allows you to set various options, such as the HTTP method, headers, body, etc.

### Example 1: Custom Headers
If you need to add custom headers (e.g., for authentication or content type), you can do so by specifying the `headers` property.

```javascript
fetch('https://api.example.com/data', {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer your_token_here'
  }
})
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Error:', error));
```

### Example 2: POST Request with a JSON Body
If you're sending data to a server, you can specify the `method` as `POST` and provide a `body` in the request, typically in JSON format.

```javascript
const postData = {
  name: 'John Doe',
  email: 'johndoe@example.com'
};

fetch('https://api.example.com/submit', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(postData)
})
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Error:', error));
```

### Example 3: Handling `credentials` (for cookies or sessions)
You may need to send or receive cookies with requests, in which case you can use the `credentials` option to control whether cookies should be included in requests.

```javascript
fetch('https://api.example.com/data', {
  method: 'GET',
  credentials: 'include', // This will include cookies with the request
})
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Error:', error));
```

- `credentials: 'include'`: Sends cookies for both same-origin and cross-origin requests.
- `credentials: 'same-origin'`: Sends cookies only for same-origin requests (default behavior).
- `credentials: 'omit'`: Never sends cookies.

### Example 4: Handling Timeout with `AbortController`
You can use the `AbortController` to cancel the fetch request after a certain amount of time, which is useful for implementing a timeout mechanism.

```javascript
const controller = new AbortController();
const timeout = setTimeout(() => controller.abort(), 5000); // Abort after 5 seconds

fetch('https://api.example.com/data', {
  method: 'GET',
  signal: controller.signal // Pass the signal to the fetch request
})
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => {
    if (error.name === 'AbortError') {
      console.log('Request timed out');
    } else {
      console.error('Error:', error);
    }
  })
  .finally(() => clearTimeout(timeout)); // Clean up the timeout
```

### Example 5: Handling Response Status
You can customize the behavior depending on the response status. For example, you may want to check if the request was successful before proceeding with the response data.

```javascript
fetch('https://api.example.com/data')
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok ' + response.statusText);
    }
    return response.json();
  })
  .then(data => console.log(data))
  .catch(error => console.error('Fetch error:', error));
```

### Example 6: Using `fetch()` with `async/await`
You can also use `async/await` syntax to handle asynchronous code in a more readable way.

```javascript
async function getData() {
  try {
    const response = await fetch('https://api.example.com/data', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.error('Fetch error:', error);
  }
}

getData();
```

### Example 7: Customizing Request Headers for CORS
In case you're working with Cross-Origin Resource Sharing (CORS) and need to specify certain headers, you can include the `mode`, `headers`, and `credentials` in the request options.

```javascript
fetch('https://api.example.com/data', {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer your_token_here'
  },
  mode: 'cors', // Ensure CORS is enabled
  credentials: 'same-origin' // Or 'include' for cross-origin requests
})
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Error:', error));
```

### Summary:
By customizing the `fetch()` API, you can:
- Set custom HTTP methods (e.g., GET, POST, PUT).
- Add custom headers (e.g., for authentication).
- Pass data in the request body (e.g., for POST requests).
- Handle CORS and credentials for cross-origin requests.
- Implement timeouts and abort requests when needed.
- Easily check and handle response statuses and errors.

These customizations allow you to fine-tune your network requests based on your application's requirements.


# Custom Headers in HTTP, React, and Node.js

A **custom header** is an additional HTTP header sent with a request or response to carry metadata such as:

```text
✅ Authentication Tokens
✅ Correlation IDs
✅ Tenant IDs
✅ Client Version
✅ Feature Flags
✅ Request Tracking
```

Enterprise API documentation in your environment shows examples such as **`Authorization`** and **`X-Request-ID`** headers used for authentication and distributed tracing. [\[persistent...epoint.com\]](https://persistentsystems.sharepoint.com/sites/PersistentLearningandDevelopment/Propeller%20Program/Batch%2023/Propeller%20group%204/Propeller_Team4/architecture/SaaS_Tenant_Management_Service_API.md?web=1), [\[Persistent...P_20260306 \| Word\]](https://persistentsystems.sharepoint.com/sites/EIS-SE-UserExperience/_layouts/15/Doc.aspx?sourcedoc=%7B21E7DD10-27FE-46E8-A412-5F30413CDDF6%7D&file=Persistent%20Proposal%20for%20Garuda%20Aerospace%20RFP_20260306.docx&action=default&mobileredirect=true&DefaultItemOpen=1)

***

# Common Custom Headers

```http
Authorization: Bearer jwt-token

X-Request-ID: 12345

X-Tenant-ID: tenant-001

X-Client-Version: 1.0.0
```

Example API specifications explicitly include:

```http
Authorization: Bearer <token>
X-Request-ID: <uuid>
```

for authentication and tracing. [\[persistent...epoint.com\]](https://persistentsystems.sharepoint.com/sites/PersistentLearningandDevelopment/Propeller%20Program/Batch%2023/Propeller%20group%204/Propeller_Team4/architecture/SaaS_Tenant_Management_Service_API.md?web=1)

***

# React Fetch Example

```javascript
const response =
  await fetch(
    "https://api.company.com/users",
    {
      headers: {
        Authorization:
          "Bearer abc123",

        "X-Request-ID":
          crypto.randomUUID(),

        "X-Client-Version":
          "1.0.0"
      }
    }
  );
```

Request:

```http
GET /users

Authorization: Bearer abc123
X-Request-ID: 3f11aef4
X-Client-Version: 1.0.0
```

***

# Axios Example

```javascript
import axios from "axios";

const api =
  axios.create({
    baseURL:
      "https://api.company.com"
  });

api.get("/users", {
  headers: {
    Authorization:
      "Bearer token",

    "X-Request-ID":
      crypto.randomUUID()
  }
});
```

***

# Global Axios Headers

Very common enterprise pattern.

```javascript
api.interceptors.request.use(
  config => {

    config.headers.Authorization =
      `Bearer ${localStorage.getItem("token")}`;

    config.headers["X-Request-ID"] =
      crypto.randomUUID();

    return config;
  }
);
```

Now every request automatically includes:

```http
Authorization
X-Request-ID
```

***

# Express Read Custom Headers

```javascript
app.get(
  "/users",
  (req, res) => {

    console.log(
      req.headers.authorization
    );

    console.log(
      req.headers["x-request-id"]
    );

    res.send("OK");
  }
);
```

***

# Express Send Custom Headers

```javascript
app.use((req, res, next) => {

  res.setHeader(
    "X-API-Version",
    "v1"
  );

  next();
});
```

Client receives:

```http
X-API-Version: v1
```

***

# Custom Headers and CORS

This is a favourite interview question.

If you send:

```javascript
headers: {
  Authorization: "Bearer xxx",
  "X-Request-ID": "123"
}
```

the server must allow them.

```javascript
app.use(
  cors({
    origin:
      "http://localhost:3000",

    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "X-Request-ID"
    ]
  })
);
```

Otherwise:

```text
Blocked by CORS policy
```

because custom headers trigger a **preflight OPTIONS request**.

***

# Request Tracing Example

API design documents in your environment use:

```http
X-Request-ID: <uuid>
```

for distributed tracing. [\[persistent...epoint.com\]](https://persistentsystems.sharepoint.com/sites/PersistentLearningandDevelopment/Propeller%20Program/Batch%2023/Propeller%20group%204/Propeller_Team4/architecture/SaaS_Tenant_Management_Service_API.md?web=1)

Backend:

```javascript
app.use((req, res, next) => {

  const requestId =
    req.headers["x-request-id"];

  console.log(
    `[${requestId}] Request Received`
  );

  next();
});
```

Output:

```text
[1234-abcd]
GET /users
```

Useful for:

```text
Microservices
Kubernetes
Distributed Systems
API Gateway
```

***

# Custom API Key Header Example

Enterprise integration examples reference API keys being passed through request headers such as `Authorization` or `X-API-Key`. [\[Persistent...P_20260306 \| Word\]](https://persistentsystems.sharepoint.com/sites/EIS-SE-UserExperience/_layouts/15/Doc.aspx?sourcedoc=%7B4E7CCBA4-17D4-4751-A929-1C47C7E940C7%7D&file=Persistent%20Proposal%20for%20Garuda%20Aerospace%20RFP_20260306.docx&action=default&mobileredirect=true&DefaultItemOpen=1), [\[Persistent...P_20260306 \| Word\]](https://persistentsystems.sharepoint.com/sites/EIS-SE-UserExperience/_layouts/15/Doc.aspx?sourcedoc=%7B21E7DD10-27FE-46E8-A412-5F30413CDDF6%7D&file=Persistent%20Proposal%20for%20Garuda%20Aerospace%20RFP_20260306.docx&action=default&mobileredirect=true&DefaultItemOpen=1)

Frontend:

```javascript
fetch("/weather", {
  headers: {
    "X-API-Key":
      "secret-key"
  }
});
```

Backend:

```javascript
app.use(
  (req, res, next) => {

    const apiKey =
      req.headers[
        "x-api-key"
      ];

    if (
      apiKey !==
      process.env.API_KEY
    ) {

      return res
        .status(401)
        .send("Unauthorized");
    }

    next();
  }
);
```

***

# Interview Questions

### Why use custom headers?

```text
Authentication
Correlation IDs
Tracing
Versioning
Multi-tenancy
Feature Flags
```

### Why do custom headers cause OPTIONS requests?

```text
Because they are non-simple headers
and trigger a CORS preflight check.
```

### Header vs Query Parameter?

```text
Header
✅ Hidden from URL
✅ Better for auth

Query Param
✅ Easy debugging
❌ Visible in logs/history
```

***

# Senior React Interview Answer

> Custom headers are used to send metadata along with HTTP requests. Common examples include `Authorization`, `X-Request-ID`, `X-Tenant-ID`, and API keys. In React applications, custom headers are typically added through Fetch or Axios interceptors. On the server side, Express can read these headers from `req.headers`. When using custom headers across origins, the backend must include them in `Access-Control-Allow-Headers`; otherwise, the browser will block the request during the CORS preflight check. Enterprise systems frequently use headers like `Authorization` and `X-Request-ID` for security and distributed request tracing. [\[persistent...epoint.com\]](https://persistentsystems.sharepoint.com/sites/PersistentLearningandDevelopment/Propeller%20Program/Batch%2023/Propeller%20group%204/Propeller_Team4/architecture/SaaS_Tenant_Management_Service_API.md?web=1), [\[Persistent...P_20260306 \| Word\]](https://persistentsystems.sharepoint.com/sites/EIS-SE-UserExperience/_layouts/15/Doc.aspx?sourcedoc=%7B21E7DD10-27FE-46E8-A412-5F30413CDDF6%7D&file=Persistent%20Proposal%20for%20Garuda%20Aerospace%20RFP_20260306.docx&action=default&mobileredirect=true&DefaultItemOpen=1)



# 1. React Example with Custom Headers + Error Handling

Custom headers such as `Authorization` and `X-Request-ID` are commonly used for authentication and request tracing in enterprise APIs.

## API Helper

```jsx
async function fetchUsers() {
  try {
    const response = await fetch(
      "http://localhost:5000/api/users",
      {
        method: "GET",

        credentials: "include",

        headers: {
          Authorization:
            `Bearer ${localStorage.getItem("token")}`,

          "X-Request-ID":
            crypto.randomUUID(),

          "X-Client-Version":
            "1.0.0"
        }
      }
    );

    if (!response.ok) {
      throw new Error(
        `HTTP Error: ${response.status}`
      );
    }

    return await response.json();

  } catch (error) {

    if (
      error instanceof TypeError
    ) {

      throw new Error(
        "Network or CORS error."
      );
    }

    throw error;
  }
}
```

***

## React Component

```jsx
import { useState } from "react";

function UsersPage() {

  const [users, setUsers] =
    useState([]);

  const [error, setError] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const loadUsers = async () => {

    try {

      setLoading(true);
      setError("");

      const data =
        await fetchUsers();

      setUsers(data);

    } catch (err) {

      setError(
        err.message
      );

    } finally {

      setLoading(false);
    }
  };

  return (
    <div>

      <button
        onClick={loadUsers}
      >
        Load Users
      </button>

      {loading && (
        <p>Loading...</p>
      )}

      {error && (
        <div
          style={{
            color: "red"
          }}
        >
          {error}
        </div>
      )}

      {users.map(user => (
        <div key={user.id}>
          {user.name}
        </div>
      ))}

    </div>
  );
}
```

***

# 2. Express CORS Configuration for Custom Headers

When sending custom headers, Express must explicitly allow them during CORS validation.

## Express Server

```javascript
const express =
  require("express");

const cors =
  require("cors");

const app =
  express();

app.use(
  cors({
    origin: [
      "http://localhost:3000"
    ],

    credentials: true,

    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "X-Request-ID",
      "X-Client-Version"
    ],

    methods: [
      "GET",
      "POST",
      "PUT",
      "PATCH",
      "DELETE"
    ]
  })
);
```

***

## Dynamic Origin Example

```javascript
const allowedOrigins = [
  "http://localhost:3000",
  "https://app.company.com"
];

app.use(
  cors({
    origin:
      (origin, callback) => {

        if (
          !origin ||
          allowedOrigins.includes(origin)
        ) {

          return callback(
            null,
            true
          );
        }

        callback(
          new Error(
            "CORS blocked"
          )
        );
      },

    credentials: true,

    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "X-Request-ID"
    ]
  })
);
```

***

# 3. Impact of Custom Headers on CORS Preflight

This is one of the most common interview questions.

***

## Without Custom Headers

```javascript
fetch("/users");
```

Browser:

```text
GET /users
```

Request goes directly.

***

## With Custom Headers

```javascript
fetch("/users", {
  headers: {
    Authorization:
      "Bearer xyz",

    "X-Request-ID":
      "123"
  }
});
```

Browser first sends:

```http
OPTIONS /users

Origin:
http://localhost:3000

Access-Control-Request-Method:
GET

Access-Control-Request-Headers:
authorization,x-request-id
```

***

## Server Response

```http
HTTP 200 OK

Access-Control-Allow-Origin:
http://localhost:3000

Access-Control-Allow-Headers:
Authorization,
X-Request-ID

Access-Control-Allow-Methods:
GET,POST,PUT,DELETE
```

***

## Then Actual Request

```http
GET /users

Authorization:
Bearer xyz

X-Request-ID:
123
```

***

# Why Preflight Happens

Custom headers are considered **non-simple headers**.

Examples:

```text
Authorization
X-Request-ID
X-Tenant-ID
X-API-Key
```

These headers trigger:

```text
OPTIONS Request
      ↓
Server Validation
      ↓
Actual Request
```

***

# Common Failure

Frontend:

```javascript
headers: {
  Authorization:
    "Bearer token"
}
```

Backend:

```javascript
allowedHeaders: [
  "Content-Type"
]
```

Result:

```text
Blocked by CORS policy
```

because:

```text
Authorization
is not allowed
```

***

# Enterprise Example

Enterprise APIs commonly use headers such as:

```http
Authorization: Bearer <token>

X-Request-ID: <uuid>
```

for authentication and distributed tracing.

A typical flow is:

```text
React
  ↓
Custom Header

Authorization
X-Request-ID

  ↓

Browser OPTIONS

  ↓

Express CORS Validation

  ↓

API Request

  ↓

Response
```

***

# Senior React Interview Answer

> Custom headers such as `Authorization`, `X-Request-ID`, and `X-Tenant-ID` are frequently used for authentication, tracing, and multi-tenant applications. Because these headers are classified as non-simple headers, browsers send a CORS preflight (`OPTIONS`) request before the actual API request. The Express server must explicitly include these headers in `Access-Control-Allow-Headers`; otherwise the browser blocks the request. When implementing React applications, it is good practice to centralise custom header handling through Fetch wrappers or Axios interceptors and provide user-friendly error handling for CORS and network failures.


When a **CORS preflight (`OPTIONS`) request fails**, React cannot directly catch the actual preflight response because the browser blocks the request before your application receives it.

The goal in React is to:

```text
✅ Detect probable CORS failures
✅ Show a user-friendly message
✅ Allow retry
✅ Log useful debugging information
```

The enterprise CORS proof-of-concept documentation also highlights distinguishing CORS issues from authentication or policy issues and recommends routing sensitive third-party API calls through a backend proxy. [\[Small_POC \| HTML\]](https://persistentsystems.sharepoint.com/sites/VivaDev/ResponsiveAssets/HTML/Small_POC.html?web=1)

# React Example: Handling Preflight Failures

## API Helper

```jsx
async function fetchUsers() {
  try {

    const response =
      await fetch(
        "http://localhost:5000/api/users",
        {
          method: "GET",

          credentials: "include",

          headers: {
            Authorization:
              `Bearer ${localStorage.getItem("token")}`,

            "X-Request-ID":
              crypto.randomUUID()
          }
        }
      );

    if (!response.ok) {

      throw new Error(
        `HTTP ${response.status}`
      );
    }

    return await response.json();

  } catch (error) {

    // Browser usually throws TypeError
    // for CORS/preflight failures

    if (
      error instanceof TypeError
    ) {

      throw new Error(
        "Request blocked. Possible CORS or network issue."
      );
    }

    throw error;
  }
}
```

***

# React Component with Retry

```jsx
import {
  useState
} from "react";

function UsersPage() {

  const [users, setUsers] =
    useState([]);

  const [error, setError] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const loadUsers = async () => {

    try {

      setLoading(true);
      setError("");

      const data =
        await fetchUsers();

      setUsers(data);

    } catch (err) {

      setError(err.message);

    } finally {

      setLoading(false);
    }
  };

  return (
    <div>

      <button
        onClick={loadUsers}
      >
        Load Users
      </button>

      {loading && (
        <p>Loading...</p>
      )}

      {error && (
        <div
          style={{
            color: "red",
            border:
              "1px solid red",
            padding: "10px"
          }}
        >
          <h4>
            Request Failed
          </h4>

          <p>{error}</p>

          <button
            onClick={loadUsers}
          >
            Retry
          </button>
        </div>
      )}

      {users.map(user => (
        <div key={user.id}>
          {user.name}
        </div>
      ))}
    </div>
  );
}
```

***

# Add Retry Logic

```jsx
async function fetchWithRetry(
  apiCall,
  retries = 3
) {

  try {

    return await apiCall();

  } catch (error) {

    if (
      retries > 0 &&
      error instanceof TypeError
    ) {

      await new Promise(
        resolve =>
          setTimeout(
            resolve,
            1000
          )
      );

      return fetchWithRetry(
        apiCall,
        retries - 1
      );
    }

    throw error;
  }
}
```

Usage:

```jsx
const data =
  await fetchWithRetry(
    fetchUsers
  );
```

***

# How Preflight Failure Appears

Suppose React sends:

```javascript
fetch("/users", {
  headers: {
    Authorization:
      "Bearer token",

    "X-Request-ID":
      "1234"
  }
});
```

Browser sends:

```http
OPTIONS /users
```

If Express does not allow:

```http
Authorization
X-Request-ID
```

the browser blocks the request before the actual API call.

React usually receives:

```text
TypeError:
Failed to fetch
```

or

```text
NetworkError
```

***

# What Users Should See

Instead of:

```text
TypeError: Failed to fetch
```

Show:

```text
Unable to connect to the server.

Possible causes:
• Network problem
• CORS configuration issue
• Authentication problem

[Retry]
```

***

# Debugging a Failed Preflight

Open:

```text
F12
↓
Network
```

Look for:

```text
OPTIONS request
```

If you see:

```text
OPTIONS
↓
403

or

OPTIONS
↓
404
```

the actual request never runs.

Check whether the server returns:

```http
Access-Control-Allow-Origin

Access-Control-Allow-Headers

Access-Control-Allow-Methods
```

and whether custom headers such as:

```http
Authorization
X-Request-ID
```

are included in `Access-Control-Allow-Headers`.

***

# Senior React Interview Answer

> React cannot directly handle a CORS preflight failure because the browser blocks the request before the application receives the response. The recommended approach is to catch fetch/network failures, display a friendly error message, offer retry functionality, and inspect the browser Network tab for failed `OPTIONS` requests. Preflight failures are typically caused by missing `Access-Control-Allow-Origin`, `Access-Control-Allow-Headers`, or `Access-Control-Allow-Methods` headers on the server.
