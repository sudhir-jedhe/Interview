CORS (Cross-Origin Resource Sharing) is a mechanism that enables secure interaction between web resources from different origins. Here's a detailed breakdown of the CORS mechanism, including its requests, responses, and headers:

---

## **CORS Overview**

### **Same-Origin Policy (SOP)**
- Browsers enforce the **Same-Origin Policy** to restrict how resources from different origins interact. 
- Same-origin is determined by matching the protocol, hostname, and port.

### **Cross-Origin Resource Sharing (CORS)**
- CORS is a server-driven feature that relaxes the SOP by specifying which origins are permitted to access the server's resources.

---

## **CORS Request Types**

### **1. Simple Requests**
A request is considered "simple" if:
- It uses one of these methods:
  - `GET`
  - `POST`
  - `HEAD`
- It uses only these headers:
  - `Accept`
  - `Accept-Language`
  - `Content-Language`
  - `Content-Type` (limited to `application/x-www-form-urlencoded`, `multipart/form-data`, or `text/plain`)

### **2. Preflight Requests**
A preflight request is sent before the actual request if:
- The method is not `GET`, `POST`, or `HEAD`.
- It uses custom headers not included in the "simple" category.
- It uses the `Content-Type` header with a value other than `application/x-www-form-urlencoded`, `multipart/form-data`, or `text/plain`.

The browser sends an `OPTIONS` request to the server to determine if the actual request is safe to send.

### **3. Actual Requests**
The actual request is sent after the server allows the origin (if applicable).

---

## **CORS Headers**

### **Request Headers**
1. **Origin**
   - Specifies the origin of the request.
   - Example:
     ```
     Origin: https://example.com
     ```

2. **Access-Control-Request-Method** *(Preflight only)*
   - Specifies the HTTP method of the actual request.
   - Example:
     ```
     Access-Control-Request-Method: POST
     ```

3. **Access-Control-Request-Headers** *(Preflight only)*
   - Specifies the headers in the actual request.
   - Example:
     ```
     Access-Control-Request-Headers: X-Custom-Header
     ```

### **Response Headers**
1. **Access-Control-Allow-Origin**
   - Specifies which origins are allowed to access the resource.
   - Example:
     ```
     Access-Control-Allow-Origin: https://example.com
     ```

2. **Access-Control-Allow-Methods**
   - Lists the HTTP methods permitted for the resource.
   - Example:
     ```
     Access-Control-Allow-Methods: GET, POST, PUT, DELETE
     ```

3. **Access-Control-Allow-Headers**
   - Lists the headers the client is allowed to include in its requests.
   - Example:
     ```
     Access-Control-Allow-Headers: X-Custom-Header, Authorization
     ```

4. **Access-Control-Allow-Credentials**
   - Indicates whether credentials (cookies, HTTP authentication) are allowed.
   - Example:
     ```
     Access-Control-Allow-Credentials: true
     ```

5. **Access-Control-Expose-Headers**
   - Lists headers exposed to the client (not included by default).
   - Example:
     ```
     Access-Control-Expose-Headers: X-Total-Count, Content-Length
     ```

6. **Access-Control-Max-Age**
   - Indicates how long the results of a preflight request can be cached.
   - Example:
     ```
     Access-Control-Max-Age: 86400
     ```

### **Other Headers**
1. **Vary**
   - Indicates which request headers the response depends on.
   - Example:
     ```
     Vary: Origin
     ```

---

## **CORS Example**

### Simple Request
#### Request
```http
GET /api/resource HTTP/1.1
Host: api.example.com
Origin: https://frontend.example.com
```

#### Response
```http
HTTP/1.1 200 OK
Access-Control-Allow-Origin: https://frontend.example.com
```

---

### Preflight Request
#### Preflight Request
```http
OPTIONS /api/resource HTTP/1.1
Host: api.example.com
Origin: https://frontend.example.com
Access-Control-Request-Method: POST
Access-Control-Request-Headers: Content-Type, X-Custom-Header
```

#### Preflight Response
```http
HTTP/1.1 204 No Content
Access-Control-Allow-Origin: https://frontend.example.com
Access-Control-Allow-Methods: GET, POST
Access-Control-Allow-Headers: Content-Type, X-Custom-Header
Access-Control-Max-Age: 3600
```

---

### Actual Request
#### Request
```http
POST /api/resource HTTP/1.1
Host: api.example.com
Origin: https://frontend.example.com
Content-Type: application/json
X-Custom-Header: custom-value
```

#### Response
```http
HTTP/1.1 200 OK
Access-Control-Allow-Origin: https://frontend.example.com
Access-Control-Allow-Credentials: true
Access-Control-Expose-Headers: X-RateLimit-Limit
```

---

## **Summary**

CORS allows servers to specify:
- **Origins**: Which origins can access their resources.
- **Methods**: Which HTTP methods are permitted.
- **Headers**: Which request/response headers can be used.
- **Credentials**: Whether cookies or authentication are allowed.

By configuring these headers, developers can control cross-origin communication securely and flexibly.


# CORS (Cross-Origin Resource Sharing)

**CORS** is a browser security mechanism that allows or blocks requests from one origin to another origin. An origin is defined by:

```text
Protocol + Domain + Port
```

Examples:

```text
https://app.company.com
https://api.company.com
```

These are **different origins** because the domains differ. CORS exists because browsers enforce the **Same-Origin Policy (SOP)**, which blocks scripts from accessing resources on another origin unless explicitly allowed. [\[Cors_Intro \| Word\]](https://persistentsystems.sharepoint.com/sites/LOD_WebAPI_6Jul-18Jul/_layouts/15/Doc.aspx?sourcedoc=%7B6AD32EC4-D634-4DE1-9776-82EECDF4E5BC%7D&file=Cors_Intro.rtf&action=default&DefaultItemOpen=1)

***

# What is Same-Origin Policy (SOP)?

By default:

```javascript
fetch("https://api.company.com/users")
```

from:

```text
https://app.company.com
```

will be blocked unless the API server allows it through CORS headers. SOP helps protect users from malicious sites accessing data from other origins. [\[Cors_Intro \| Word\]](https://persistentsystems.sharepoint.com/sites/LOD_WebAPI_6Jul-18Jul/_layouts/15/Doc.aspx?sourcedoc=%7B6AD32EC4-D634-4DE1-9776-82EECDF4E5BC%7D&file=Cors_Intro.rtf&action=default&DefaultItemOpen=1)

***

# How CORS Works

Frontend:

```javascript
fetch(
  "https://api.company.com/users"
);
```

Browser sends request:

```http
Origin: https://app.company.com
```

Server responds:

```http
Access-Control-Allow-Origin:
https://app.company.com
```

Browser:

```text
✅ Allows Response
```

Without the header:

```text
❌ CORS Error
```

***

# Simple CORS Request

```javascript
fetch("/users");
```

Response:

```http
Access-Control-Allow-Origin: *
```

This means:

```text
Allow Any Origin
```

***

# Preflight Request (OPTIONS)

For requests like:

```javascript
fetch("/users", {
  method: "PUT",
  headers: {
    Authorization:
      "Bearer token"
  }
});
```

Browser first sends:

```http
OPTIONS /users
```

Server must respond:

```http
Access-Control-Allow-Origin:
https://app.company.com

Access-Control-Allow-Methods:
GET,POST,PUT,DELETE

Access-Control-Allow-Headers:
Authorization, Content-Type
```

Then the real request is sent.

***

# Express.js CORS Example

Install:

```bash
npm install cors
```

Server:

```javascript
const express =
  require("express");

const cors =
  require("cors");

const app =
  express();

app.use(
  cors({
    origin:
      "http://localhost:3000",

    credentials: true
  })
);

app.get("/users",
  (req, res) => {

    res.json([
      "Sudhir",
      "John"
    ]);
  }
);
```

***

# Manual CORS Headers

```javascript
app.use((req, res, next) => {

  res.header(
    "Access-Control-Allow-Origin",
    "http://localhost:3000"
  );

  res.header(
    "Access-Control-Allow-Methods",
    "GET,POST,PUT,DELETE"
  );

  res.header(
    "Access-Control-Allow-Headers",
    "Content-Type,Authorization"
  );

  next();
});
```

***

# Credentials (Cookies + Sessions)

Frontend:

```javascript
axios.get(
  "/profile",
  {
    withCredentials: true
  }
);
```

Backend:

```javascript
app.use(
  cors({
    origin:
      "http://localhost:3000",

    credentials: true
  })
);
```

Important:

```http
Access-Control-Allow-Origin: *
```

cannot be used with:

```http
Access-Control-Allow-Credentials: true
```

Browsers ignore that combination. [\[False Positives \| SharePoint\]](https://persistentsystemsnam.sharepoint.com/sites/KnowledgeCenter/SitePages/False-Positives.aspx?web=1)

***

# Common CORS Error

```text
Access to fetch at
'https://api.company.com'

from origin
'http://localhost:3000'

has been blocked by CORS policy
```

Reason:

```text
Server Missing
Access-Control-Allow-Origin
```

***

# React + Node Example

## React

```javascript
const users =
  await axios.get(
    "http://localhost:5000/users"
  );
```

***

## Node

```javascript
app.use(
  cors({
    origin:
      "http://localhost:3000"
  })
);
```

Now:

```text
React ✅
Node ✅
CORS ✅
```

***

# Interview Questions

### What causes a CORS error?

```text
Browser blocks a cross-origin request
because the server did not send the
required CORS headers.
```

***

### Can Postman get CORS errors?

```text
No.
```

Reason:

```text
CORS is enforced by browsers,
not by Postman.
```

***

### What is a Preflight Request?

```text
OPTIONS request sent by the browser
before certain cross-origin requests
to verify permissions.
```

***

### Is CORS a server-side feature?

```text
Partially.
```

The browser enforces it, while the server provides the headers that tell the browser whether access is allowed. [\[Cors_Intro \| Word\]](https://persistentsystems.sharepoint.com/sites/LOD_WebAPI_6Jul-18Jul/_layouts/15/Doc.aspx?sourcedoc=%7B6AD32EC4-D634-4DE1-9776-82EECDF4E5BC%7D&file=Cors_Intro.rtf&action=default&DefaultItemOpen=1), [\[persistent...epoint.com\]](https://persistentsystems.sharepoint.com/sites/POC94/Shared%20Documents/Source/node_modules/whatwg-fetch/README.md?web=1)

***

# Senior React Interview Answer

```text
CORS (Cross-Origin Resource Sharing) is a browser
security mechanism built on top of the Same-Origin
Policy. It allows a server to explicitly specify
which origins, HTTP methods, and headers are
permitted to access its resources.

When a React application calls an API hosted on a
different origin, the browser checks the server's
CORS headers. If the required headers are missing,
the request is blocked by the browser even though
the API itself may be functioning correctly.

For authenticated applications using cookies or
JWT-based sessions, the backend must also support
credentials and return the appropriate
Access-Control-Allow-* headers.
```


According to the CORS references found in your enterprise content, CORS allows a server to specify which origins, methods, and headers may access its resources across origins. Browsers enforce the Same-Origin Policy and use CORS headers to determine whether a cross-origin request is permitted.

# 1. Configure CORS for Multiple Origins

In Express, a common approach is to maintain an allow-list.

```javascript
const cors = require("cors");

const allowedOrigins = [
  "http://localhost:3000",
  "https://app.company.com",
  "https://admin.company.com"
];

app.use(
  cors({
    origin: (origin, callback) => {

      if (
        !origin ||
        allowedOrigins.includes(origin)
      ) {
        return callback(null, true);
      }

      callback(
        new Error("Origin not allowed")
      );
    },

    credentials: true
  })
);
```

### Request Flow

```text
React App
      ↓
Origin Header Sent

http://localhost:3000

      ↓

Express Checks Allow List

      ↓

Allowed ✅
Rejected ❌
```

***

# 2. CORS with Credentials (Cookies / Sessions)

The enterprise documentation notes that browsers handle credentialed CORS requests differently and that credentials require specific server-side configuration.

## React Frontend

### Axios

```javascript
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000",
  withCredentials: true
});

const response =
  await api.get("/profile");
```

### Fetch

```javascript
const response =
  await fetch(
    "http://localhost:5000/profile",
    {
      credentials: "include"
    }
  );
```

***

## Express Backend

```javascript
const cors = require("cors");

app.use(
  cors({
    origin:
      "http://localhost:3000",

    credentials: true
  })
);
```

### Response Headers

```http
Access-Control-Allow-Origin:
http://localhost:3000

Access-Control-Allow-Credentials:
true
```

### Important

Avoid:

```http
Access-Control-Allow-Origin: *
Access-Control-Allow-Credentials: true
```

The browser ignores this combination.

***

# 3. Preflight Request Example

A preflight request typically occurs when using custom headers such as `Authorization` or non-simple HTTP methods. The CORS overview in your enterprise content explains that browsers verify permissions before proceeding with certain cross-origin requests.

Frontend:

```javascript
axios.put(
  "/users/1",
  data,
  {
    headers: {
      Authorization:
        "Bearer token"
    }
  }
);
```

Browser first sends:

```http
OPTIONS /users/1
```

Server must allow:

```javascript
app.use(
  cors({
    origin:
      "http://localhost:3000",
    methods: [
      "GET",
      "POST",
      "PUT",
      "DELETE"
    ],
    allowedHeaders: [
      "Content-Type",
      "Authorization"
    ]
  })
);
```

***

# 4. Common CORS Debugging Techniques

## Check Browser Console

Typical error:

```text
Access to fetch at
'https://api.company.com'

from origin
'http://localhost:3000'

has been blocked by CORS policy
```

This usually indicates missing or incorrect CORS headers.

***

## Check Network Tab

Open:

```text
Chrome DevTools
→ Network
→ Failed Request
→ Headers
```

Verify:

```http
Origin
Access-Control-Allow-Origin
Access-Control-Allow-Headers
Access-Control-Allow-Methods
```

***

## Test Using Postman

If:

```text
Postman ✅
Browser ❌
```

the API is normally working and the issue is usually CORS configuration because browsers enforce CORS whereas Postman does not. The fetch documentation specifically notes that CORS is handled by browser mechanisms.

***

## Verify OPTIONS Response

Check that:

```http
OPTIONS /api/users
```

returns:

```http
200 OK

Access-Control-Allow-Origin
Access-Control-Allow-Methods
Access-Control-Allow-Headers
```

***

## Check Credentials Configuration

Frontend:

```javascript
withCredentials: true
```

Backend:

```javascript
credentials: true
```

Origin:

```http
Access-Control-Allow-Origin:
specific-origin
```

Not:

```http
*
```

for credentialed requests.

***

# Senior React Interview Answer

```text
CORS is a browser security mechanism that
controls cross-origin requests.

For multiple origins, use an allow-list on
the server and dynamically validate the
incoming Origin header.

For authenticated applications using cookies
or sessions, enable credentials on both the
frontend and backend and return a specific
Access-Control-Allow-Origin value.

When debugging CORS:
1. Check browser console errors.
2. Inspect Network tab headers.
3. Verify OPTIONS preflight responses.
4. Compare browser behaviour with Postman.
5. Validate credentials configuration.
```

This is the most common CORS setup used in React + Node.js/Express applications.


These are very common **React + Node.js + Express interview questions**.

# 1. Express CORS Configuration for Dynamic Origins

Instead of hardcoding one origin:

```javascript
app.use(
  cors({
    origin:
      "http://localhost:3000"
  })
);
```

use a whitelist.

```javascript
const cors = require("cors");

const allowedOrigins = [
  "http://localhost:3000",
  "https://app.company.com",
  "https://admin.company.com"
];

app.use(
  cors({
    origin: (origin, callback) => {

      // allow Postman/server requests with no origin
      if (!origin) {
        return callback(null, true);
      }

      if (
        allowedOrigins.includes(origin)
      ) {
        return callback(null, true);
      }

      return callback(
        new Error(
          "Origin not allowed by CORS"
        )
      );
    },

    credentials: true,

    methods: [
      "GET",
      "POST",
      "PUT",
      "PATCH",
      "DELETE"
    ],

    allowedHeaders: [
      "Content-Type",
      "Authorization"
    ]
  })
);
```

***

# 2. React Fetch with Credentials + Error Handling

## Login Request

```javascript
async function login(data) {

  try {

    const response =
      await fetch(
        "http://localhost:5000/login",
        {
          method: "POST",

          credentials: "include",

          headers: {
            "Content-Type":
              "application/json"
          },

          body: JSON.stringify(data)
        }
      );

    if (!response.ok) {

      throw new Error(
        `HTTP Error ${response.status}`
      );
    }

    return await response.json();

  } catch (error) {

    console.error(
      "Login Failed:",
      error.message
    );

    throw error;
  }
}
```

***

## Protected Endpoint

```javascript
async function getProfile() {

  try {

    const response =
      await fetch(
        "http://localhost:5000/profile",
        {
          credentials:
            "include"
        }
      );

    if (!response.ok) {

      throw new Error(
        "Profile fetch failed"
      );
    }

    return await response.json();

  } catch (error) {

    console.error(error);

    return null;
  }
}
```

***

# Axios Equivalent

```javascript
import axios from "axios";

const api =
  axios.create({
    baseURL:
      "http://localhost:5000",

    withCredentials:
      true
  });

try {

  const response =
    await api.get(
      "/profile"
    );

  console.log(
    response.data
  );

} catch (error) {

  console.error(
    error.response?.data ||
    error.message
  );
}
```

***

# 3. CORS Debugging in Browser Network Tab

When you get:

```text
Blocked by CORS policy
```

Follow this checklist.

***

## Step 1: Check Console

Typical error:

```text
Access to fetch at

http://localhost:5000/users

from origin

http://localhost:3000

has been blocked by CORS policy
```

This tells you:

```text
Frontend Origin
Backend Origin
```

are different.

***

## Step 2: Open Network Tab

```text
F12
 ↓
Network
 ↓
Select Failed Request
```

Look at:

```text
Request Headers
Response Headers
```

***

## Step 3: Verify Request Origin

Request Headers:

```http
Origin:
http://localhost:3000
```

Confirm it's an allowed origin.

***

## Step 4: Verify Response Headers

You should see:

```http
Access-Control-Allow-Origin:
http://localhost:3000

Access-Control-Allow-Credentials:
true
```

Missing?

```text
CORS Failure
```

***

## Step 5: Check Preflight Request

Many developers miss this.

Look for:

```text
OPTIONS
```

request before:

```text
POST
PUT
PATCH
DELETE
```

***

### Successful Preflight

```http
OPTIONS /users

200 OK

Access-Control-Allow-Origin:
http://localhost:3000

Access-Control-Allow-Headers:
Authorization,
Content-Type

Access-Control-Allow-Methods:
GET,POST,PUT,DELETE
```

***

### Failed Preflight

```http
OPTIONS

404
```

or

```http
OPTIONS

500
```

Result:

```text
Actual request never sent
```

***

## Step 6: Cookie Problems

Frontend:

```javascript
credentials: "include"
```

Backend:

```javascript
credentials: true
```

Response:

```http
Access-Control-Allow-Credentials:
true
```

Required together.

***

## Step 7: Compare Browser vs Postman

```text
Postman Works ✅

Browser Fails ❌
```

Almost always:

```text
CORS Configuration
```

because browsers enforce CORS while Postman does not.

***

# Senior React Interview Answer

> When configuring CORS in Express, use a whitelist of allowed origins and dynamically validate the incoming Origin header. For cookie-based authentication, enable `credentials: true` on both the front end and backend and avoid using `Access-Control-Allow-Origin: *`. When debugging CORS, inspect the browser Network tab, verify the `Origin` request header, check that the server returns the correct `Access-Control-Allow-*` headers, and ensure preflight (`OPTIONS`) requests succeed before the actual API request is sent.


These are excellent senior-level debugging topics for React + Node.js interviews.

***

# 1. CORS Error Handling in React

One challenge is that browsers often hide CORS failures and surface them as generic network errors.

## React Fetch Example

```javascript
async function fetchUsers() {

  try {

    const response =
      await fetch(
        "http://localhost:5000/users",
        {
          credentials: "include"
        }
      );

    if (!response.ok) {

      throw new Error(
        `HTTP ${response.status}`
      );
    }

    return await response.json();

  } catch (error) {

    // CORS errors often appear here
    if (
      error instanceof TypeError
    ) {

      console.error(
        "Possible CORS or Network Error"
      );

      return {
        error:
          "Unable to connect to server."
      };
    }

    throw error;
  }
}
```

***

## React UI Handling

```jsx
function Users() {

  const [error, setError] =
    useState("");

  async function loadUsers() {

    try {

      await fetchUsers();

    } catch (error) {

      setError(
        error.message
      );
    }
  }

  if (error) {

    return (

      <div className="error">

        Failed to load users.

        <button
          onClick={loadUsers}
        >
          Retry
        </button>

      </div>

    );
  }
}
```

***

# 2. Testing CORS Using cURL

Although browsers enforce CORS, cURL is useful for verifying server headers.

***

## Test Allowed Origin

```bash
curl -i \
-H "Origin: http://localhost:3000" \
http://localhost:5000/users
```

Expected:

```http
HTTP/1.1 200 OK

Access-Control-Allow-Origin:
http://localhost:3000
```

***

## Test Credentials Support

```bash
curl -i \
-H "Origin: http://localhost:3000" \
http://localhost:5000/profile
```

Expected:

```http
Access-Control-Allow-Origin:
http://localhost:3000

Access-Control-Allow-Credentials:
true
```

***

## Test Preflight Request

```bash
curl -X OPTIONS \
-i \
-H "Origin: http://localhost:3000" \
-H "Access-Control-Request-Method: PUT" \
-H "Access-Control-Request-Headers: Authorization" \
http://localhost:5000/users
```

Expected:

```http
200 OK

Access-Control-Allow-Origin:
http://localhost:3000

Access-Control-Allow-Methods:
GET,POST,PUT,DELETE

Access-Control-Allow-Headers:
Authorization
```

***

# 3. Server-Side Logging for CORS Issues

Logging origin information is one of the fastest ways to identify problems.

## Express Middleware

```javascript
app.use((req, res, next) => {

  console.log("Origin:",
    req.headers.origin
  );

  console.log("Method:",
    req.method
  );

  console.log("Path:",
    req.path
  );

  next();
});
```

***

## Dynamic Allow-List Logging

```javascript
const allowedOrigins = [
  "http://localhost:3000",
  "https://app.company.com"
];

app.use(
  cors({
    origin:
      (origin, callback) => {

        console.log(
          "Incoming Origin:",
          origin
        );

        if (
          !origin ||
          allowedOrigins.includes(
            origin
          )
        ) {

          console.log(
            "Origin Allowed"
          );

          return callback(
            null,
            true
          );
        }

        console.error(
          "Origin Blocked:",
          origin
        );

        callback(
          new Error(
            "CORS Rejected"
          )
        );
      },

    credentials: true
  })
);
```

***

## Log Preflight Requests

```javascript
app.options("*",
  (req, res) => {

    console.log(
      "Preflight Request:",
      req.path
    );

    res.sendStatus(200);
  }
);
```

***

# Browser Network Tab Debugging Checklist

When debugging:

### Step 1

Open:

```text
F12
 → Network
```

***

### Step 2

Select failed request.

Check:

```text
Request Headers
Response Headers
```

***

### Step 3

Verify Origin

```http
Origin:
http://localhost:3000
```

***

### Step 4

Verify Response Headers

```http
Access-Control-Allow-Origin

Access-Control-Allow-Headers

Access-Control-Allow-Methods

Access-Control-Allow-Credentials
```

***

### Step 5

Look for OPTIONS

```text
OPTIONS
↓
POST
```

If OPTIONS fails:

```text
Actual request never executes.
```

***

# Common Interview Scenarios

### Postman Works, Browser Fails

```text
Almost always CORS.
```

***

### Cookies Not Sent

Check:

```javascript
credentials: "include"
```

and

```javascript
withCredentials: true
```

***

### 401 on Protected Endpoint

Check:

```text
Authorization Header
Session Cookie
Token Expiry
```

***

# Senior React Interview Answer

> CORS issues should be handled gracefully in the frontend by detecting fetch/network failures and presenting user-friendly retry experiences. To validate server behaviour, use cURL to test normal requests, credentialed requests, and preflight (`OPTIONS`) requests while verifying the returned `Access-Control-Allow-*` headers. On the backend, logging request origins, methods, paths, and allow/deny decisions is essential for diagnosing origin mismatches, credential issues, and failed preflight requests. This combination of browser debugging, cURL verification, and server-side logging is the standard approach for troubleshooting CORS problems in React and Express applications.


## 1. Handling CORS Errors in React UI

One challenge with CORS is that browsers often surface a blocked cross-origin request as a generic network error. The browser enforces CORS and blocks access to the response when the required CORS headers are missing.

### API Layer

```jsx
export async function fetchUsers() {
  try {
    const response = await fetch(
      "http://localhost:5000/api/users",
      {
        credentials: "include"
      }
    );

    if (!response.ok) {
      throw new Error(
        `Request failed: ${response.status}`
      );
    }

    return await response.json();

  } catch (error) {

    if (error instanceof TypeError) {
      throw new Error(
        "Unable to connect to the server. This may be a network or CORS issue."
      );
    }

    throw error;
  }
}
```

***

### React Component

```jsx
import { useState } from "react";
import { fetchUsers } from "./api";

export default function UsersPage() {

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

      <button onClick={loadUsers}>
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

### Example User Message

```text
Unable to connect to the server.
This may be a network or CORS issue.

[Retry]
```

***

# 2. Express CORS Logging Middleware

Logging origins is one of the most effective ways to diagnose CORS problems.

### Request Logger

```javascript
app.use((req, res, next) => {

  console.log("------");

  console.log(
    "Origin:",
    req.headers.origin
  );

  console.log(
    "Method:",
    req.method
  );

  console.log(
    "Path:",
    req.originalUrl
  );

  next();
});
```

***

### Dynamic CORS Middleware with Logging

```javascript
const cors =
  require("cors");

const allowedOrigins = [
  "http://localhost:3000",
  "https://app.company.com"
];

app.use(
  cors({
    origin: (origin, callback) => {

      console.log(
        "CORS Origin:",
        origin
      );

      if (!origin) {

        console.log(
          "No origin provided"
        );

        return callback(
          null,
          true
        );
      }

      if (
        allowedOrigins.includes(
          origin
        )
      ) {

        console.log(
          "Origin allowed"
        );

        return callback(
          null,
          true
        );
      }

      console.error(
        "Origin blocked:",
        origin
      );

      callback(
        new Error(
          "Not allowed by CORS"
        )
      );
    },

    credentials: true
  })
);
```

***

### Log Preflight Requests

Browsers may send an `OPTIONS` preflight request before the actual request when using custom headers or certain HTTP methods. CORS allows servers to specify which methods and headers are permitted.

```javascript
app.options("*",
  (req, res) => {

    console.log(
      "Preflight request received"
    );

    console.log(
      "Origin:",
      req.headers.origin
    );

    console.log(
      "Requested Method:",
      req.headers[
        "access-control-request-method"
      ]
    );

    res.sendStatus(200);
  }
);
```

***

## Sample Logs

### Allowed Request

```text
Origin: http://localhost:3000
Method: GET
Path: /api/users

CORS Origin:
http://localhost:3000

Origin allowed
```

### Blocked Request

```text
Origin: http://malicious-site.com
Method: GET
Path: /api/users

CORS Origin:
http://malicious-site.com

Origin blocked:
http://malicious-site.com
```

***

## Quick CORS Debug Checklist

1. Open **DevTools → Network**.
2. Check the failed request.
3. Verify the `Origin` request header.
4. Verify the server returns:
   * `Access-Control-Allow-Origin`
   * `Access-Control-Allow-Methods`
   * `Access-Control-Allow-Headers`
   * `Access-Control-Allow-Credentials` (if using cookies)
5. Check whether the `OPTIONS` preflight request succeeded. Cross-origin requests require the server to explicitly permit the origin and relevant methods/headers.

These logging patterns make CORS issues much easier to diagnose in React + Express applications.


## 1. React: Handle CORS Errors with Retry UI

A browser typically reports a CORS failure as a network-related error because it blocks access to the response when the required CORS headers are missing. CORS enforcement happens in the browser, not in your React code.

### API Helper with Retry Logic

```jsx
async function fetchWithRetry(
  url,
  options = {},
  retries = 3
) {
  try {
    const response = await fetch(url, {
      ...options,
      credentials: "include"
    });

    if (!response.ok) {
      throw new Error(
        `HTTP ${response.status}`
      );
    }

    return await response.json();

  } catch (error) {

    // Browser often throws TypeError
    // for network/CORS failures
    if (
      retries > 0 &&
      error instanceof TypeError
    ) {

      console.log(
        `Retrying... ${retries}`
      );

      await new Promise(resolve =>
        setTimeout(resolve, 1000)
      );

      return fetchWithRetry(
        url,
        options,
        retries - 1
      );
    }

    throw error;
  }
}
```

***

### React Component

```jsx
import { useState } from "react";

function UsersPage() {

  const [users, setUsers] =
    useState([]);

  const [error, setError] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  async function loadUsers() {

    try {

      setLoading(true);
      setError("");

      const data =
        await fetchWithRetry(
          "http://localhost:5000/users"
        );

      setUsers(data);

    } catch (err) {

      setError(
        "Unable to connect to the server. Check CORS configuration or network connectivity."
      );

    } finally {

      setLoading(false);
    }
  }

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
          <p>{error}</p>

          <button
            onClick={loadUsers}
          >
            Retry
          </button>
        </div>
      )}

    </div>
  );
}
```

***

# 2. Express Middleware for CORS Logging

Logging origins, methods, and blocked requests is very useful when troubleshooting CORS.

## Request Logging

```javascript
app.use((req, res, next) => {

  console.log("-----");

  console.log(
    "Origin:",
    req.headers.origin
  );

  console.log(
    "Method:",
    req.method
  );

  console.log(
    "Path:",
    req.originalUrl
  );

  next();
});
```

***

## Dynamic Origin Validation + Logging

```javascript
const allowedOrigins = [
  "http://localhost:3000",
  "https://app.company.com"
];

app.use(
  cors({
    origin: (
      origin,
      callback
    ) => {

      console.log(
        "Incoming Origin:",
        origin
      );

      if (!origin) {

        console.log(
          "No Origin Header"
        );

        return callback(
          null,
          true
        );
      }

      if (
        allowedOrigins.includes(
          origin
        )
      ) {

        console.log(
          "✅ Origin Allowed"
        );

        return callback(
          null,
          true
        );
      }

      console.error(
        "❌ Origin Blocked:",
        origin
      );

      callback(
        new Error(
          "CORS Rejected"
        )
      );
    },

    credentials: true
  })
);
```

***

## Log Preflight Requests

```javascript
app.options(
  "*",
  (req, res) => {

    console.log(
      "OPTIONS Preflight"
    );

    console.log(
      "Origin:",
      req.headers.origin
    );

    console.log(
      "Requested Method:",
      req.headers[
        "access-control-request-method"
      ]
    );

    res.sendStatus(200);
  }
);
```

***

# 3. Understanding CORS Errors in Browser Tools

## Browser Console

Typical message:

```text
Access to fetch at
'http://localhost:5000/users'

from origin
'http://localhost:3000'

has been blocked by CORS policy
```

Interpretation:

```text
Frontend Origin:
http://localhost:3000

Backend Origin:
http://localhost:5000

Server did not return
required CORS headers.
```

***

## Network Tab Analysis

Open:

```text
F12
 ↓
Network
```

Select the failed request.

***

### Check Request Headers

```http
Origin:
http://localhost:3000
```

Verify this origin is expected.

***

### Check Response Headers

Successful response should contain:

```http
Access-Control-Allow-Origin:
http://localhost:3000

Access-Control-Allow-Credentials:
true
```

Missing these headers usually indicates a CORS configuration problem. Cross-origin requests require the server to explicitly permit the requesting origin.

***

### Check OPTIONS Request

Look for:

```text
OPTIONS
↓
POST
```

or

```text
OPTIONS
↓
PUT
```

If the OPTIONS request is:

```text
404
500
403
```

the real request will never be sent.

***

## Common Debugging Scenarios

### Scenario 1

```text
Postman ✅
Browser ❌
```

Likely:

```text
CORS configuration issue
```

because Postman does not enforce browser CORS restrictions.

***

### Scenario 2

```text
Cookies Missing
```

Check:

Frontend:

```javascript
credentials: "include"
```

Backend:

```javascript
credentials: true
```

Server response:

```http
Access-Control-Allow-Credentials:
true
```

***

### Scenario 3

```text
Preflight Failure
```

Verify:

```http
Access-Control-Allow-Methods

Access-Control-Allow-Headers
```

include the method and headers you're using.

***

## Senior React Interview Answer

> When debugging CORS, start with the browser console to identify the blocked origin. Then inspect the Network tab and verify the `Origin` request header and the server's `Access-Control-Allow-*` response headers. Check whether the browser is sending an `OPTIONS` preflight request and whether it succeeds. On the backend, implement logging middleware that records incoming origins, methods, preflight requests, and blocked origins. In the React UI, handle CORS failures gracefully with retry capabilities and user-friendly error messages.
