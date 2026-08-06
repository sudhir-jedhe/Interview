A **JWT (JSON Web Token)** is a compact, URL-safe means of representing claims to be transferred between two parties. It is commonly used in authentication and authorization systems, where the server generates a token after validating a user's credentials and sends it to the client. The client can then send this token in subsequent requests to prove its identity and authorize access to protected resources.

A JWT typically consists of three parts:
1. **Header**: Information about how the JWT is signed (e.g., the algorithm used).
2. **Payload**: Claims about the user or other data you want to store. It can contain custom user information (e.g., user ID, role).
3. **Signature**: Used to verify the authenticity of the token and ensure it wasn't tampered with.

### JWT Structure:
A JWT is made up of three parts, separated by dots (`.`):
```
<Header>.<Payload>.<Signature>
```

#### 1. Header:
The header typically consists of two parts:
- The **type** of the token, which is JWT.
- The **signing algorithm** (e.g., HMAC SHA256 or RSA).

Example:
```json
{
  "alg": "HS256",
  "typ": "JWT"
}
```

#### 2. Payload:
The payload contains the claims (statements about an entity, typically the user, and additional data). These claims are divided into three categories:
- **Registered claims**: Predefined claims such as `iat` (issued at), `exp` (expiration time), etc.
- **Public claims**: Custom claims that can be defined freely, such as user roles.
- **Private claims**: Claims shared between parties that agree on their meaning.

Example of payload (for authentication and authorization):
```json
{
  "sub": "1234567890",   // Subject (User ID)
  "name": "John Doe",     // User Name
  "iat": 1516239022,      // Issued At (Time)
  "exp": 1716239022,      // Expiration Time
  "role": "admin"         // User role (can be used for authorization)
}
```

#### 3. Signature:
The signature is used to verify that the sender of the JWT is who it says it is and to ensure that the message wasn't changed along the way. It is created using the header and payload, a secret key, and the algorithm specified in the header.

Example of how the signature is created:
```
HMACSHA256(
  base64UrlEncode(header) + "." +
  base64UrlEncode(payload),
  secretKey)
```

### Example of a JWT:
Let's assume the following header, payload, and secret key:
- Header: `{ "alg": "HS256", "typ": "JWT" }`
- Payload: `{ "sub": "1234567890", "name": "John Doe", "iat": 1516239022, "exp": 1716239022, "role": "admin" }`
- Secret Key: `"your-256-bit-secret"`

The encoded JWT might look like this:
```
eyJhbGciOiAiSFMyNTYiLCJ0eXAiOiAiSldUIn0.eyJzdWIiOiAiMTIzNDU2Nzg5MCIsICJuYW1lIjogIkpvaG4gRG9lIiwgImlhdCI6IDE1MTYyMzkwMjIsICJleHBpcmVkX3RpbWUiOiAxNzE2MjM5MDIyLCAicm9sZSI6ICJhZG1pbiJ9.Y0QfDbQe9h2NVzOCIKjpHfNd2GxwbbvfWBh9Q2cY5aw
```

### Authentication and Authorization with JWT

#### 1. **Authentication**:
Authentication refers to verifying the identity of a user. In the context of JWT:
- A user logs in with their credentials (e.g., username and password).
- The server validates the credentials and generates a JWT that includes the user's information.
- The server sends the JWT to the client, which stores it (usually in `localStorage` or `sessionStorage`).
- The client includes this JWT in subsequent requests to access protected resources.

#### Example: User Login and Token Generation (Backend - Node.js with Express)

```javascript
const express = require('express');
const jwt = require('jsonwebtoken');
const app = express();
const SECRET_KEY = 'your-256-bit-secret';

// Simulate a database of users
const users = [
  { id: 1, username: 'john', password: 'password123', role: 'admin' },
  { id: 2, username: 'jane', password: 'password456', role: 'user' }
];

app.use(express.json());

// Login endpoint (authentication)
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  
  // Find user by username
  const user = users.find(u => u.username === username && u.password === password);

  if (user) {
    // User found, generate JWT
    const token = jwt.sign(
      { sub: user.id, name: user.username, role: user.role },
      SECRET_KEY,
      { expiresIn: '1h' }  // Token expiration time
    );

    res.json({ token });
  } else {
    res.status(401).send('Invalid credentials');
  }
});

// Protected route
app.get('/protected', (req, res) => {
  const token = req.headers['authorization']?.split(' ')[1]; // Bearer token

  if (!token) {
    return res.status(403).send('Token is required');
  }

  // Verify the JWT
  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(403).send('Invalid or expired token');
    }

    // Token is valid
    res.json({ message: 'Welcome to the protected route!', user: decoded });
  });
});

app.listen(3000, () => console.log('Server started on port 3000'));
```

#### 2. **Authorization**:
Authorization is the process of checking if the authenticated user has permission to perform a certain action. You can use the information stored in the JWT (e.g., role) to enforce authorization rules.

#### Example: Protecting Routes Based on User Role
You can use the role information from the payload to restrict access to certain routes. For example:

```javascript
// Admin route (authorization)
app.get('/admin', (req, res) => {
  const token = req.headers['authorization']?.split(' ')[1];

  if (!token) {
    return res.status(403).send('Token is required');
  }

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(403).send('Invalid or expired token');
    }

    // Check if the user has the 'admin' role
    if (decoded.role === 'admin') {
      res.json({ message: 'Welcome to the admin dashboard' });
    } else {
      res.status(403).send('You are not authorized to access this route');
    }
  });
});
```

### How JWT Improves Security:
- **Stateless Authentication**: The server doesn't need to store session information. The client stores the JWT and sends it with each request.
- **Data Integrity**: Since the token is signed, it ensures that the token has not been tampered with.
- **Cross-Domain Authorization**: JWTs can be passed between domains (ideal for single-page applications or cross-origin APIs).

### JWT Expiration and Refresh Tokens:
JWTs typically expire after a set period. To maintain a session, you can implement refresh tokens:
- **Refresh Token**: A long-lived token that can be used to get a new access token without requiring the user to log in again.

### Summary:
- **JWT** consists of three parts: Header, Payload, and Signature.
- Used for **authentication** and **authorization** by embedding user information and claims inside the token.
- **Authentication**: Verifying user identity (typically with credentials).
- **Authorization**: Checking if the user has permission to access certain resources (based on claims like role).
- It is **stateless** and **secure**, reducing the need for server-side session management.



# 1. JWT Refresh Token Rotation (Advanced Interview Scenario)

This is one of the most asked **Senior React / System Design / Security** questions.

## Problem Without Rotation

### Login Flow

```text
User Login
    ↓
Access Token (15 mins)
Refresh Token (30 days)
```

Stored:

```text
Access Token → Browser

Refresh Token → Cookie
```

***

### Attack Scenario

Attacker steals:

```text
RefreshToken_123
```

Even if:

```text
Access token expires
```

Attacker can continuously generate:

```text
New Access Tokens
```

for 30 days.

***

# Refresh Token Rotation Solution

Instead of reusing the same refresh token:

### Login

```text
AccessToken_A
RefreshToken_1
```

Database:

```text
RefreshToken_1
Active = true
```

***

### First Refresh

Client sends:

```text
RefreshToken_1
```

Server:

```text
Validate token
```

Generate:

```text
AccessToken_B

RefreshToken_2
```

Database:

```text
RefreshToken_1
Active = false

RefreshToken_2
Active = true
```

***

### Second Refresh

Client sends:

```text
RefreshToken_2
```

Server returns:

```text
AccessToken_C

RefreshToken_3
```

Database:

```text
RefreshToken_2 → Disabled

RefreshToken_3 → Active
```

***

# Security Benefit

Suppose:

```text
Attacker stole
RefreshToken_1
```

After user refreshes:

```text
RefreshToken_1
becomes invalid
```

If attacker later uses:

```text
RefreshToken_1
```

Server detects:

```text
Token Reuse
```

Action:

```text
Force Logout

Invalidate Session

Security Alert
```

***

# Senior Interview Answer

> Refresh Token Rotation means issuing a brand-new refresh token whenever the old refresh token is used. The previous token is immediately invalidated. This prevents long-term abuse if a refresh token is stolen and allows detection of token reuse attacks.

***

# 2. JWT Role-Based Authorization (RBAC)

## Scenario

E-commerce Application

Users:

```text
Customer

Admin

Super Admin
```

***

# JWT Payload

Customer

```json
{
  "userId": "101",
  "role": "CUSTOMER"
}
```

***

Admin

```json
{
  "userId": "1",
  "role": "ADMIN"
}
```

***

# Flow

```text
Login
   ↓
JWT Generated
   ↓
Role Added
   ↓
JWT Sent To Client
```

***

# React Frontend Example

```javascript
const token = jwtDecode(jwt);

if (
  token.role === "ADMIN"
) {

  showAdminMenu();

}
```

***

## Backend Validation

```javascript
function checkAdmin(
  req,
  res,
  next
) {

  const role =
    req.user.role;

  if (
    role !== "ADMIN"
  ) {

    return res
      .status(403)
      .send("Forbidden");
  }

  next();
}
```

***

# Access Control Example

| API            | Customer | Admin |
| -------------- | -------- | ----- |
| View Products  | ✅        | ✅     |
| Create Product | ❌        | ✅     |
| Delete Product | ❌        | ✅     |
| Manage Users   | ❌        | ✅     |

***

# Real Banking Example

Roles:

```text
Customer

Relationship Manager

Branch Manager

System Admin
```

JWT:

```json
{
  "role": "BRANCH_MANAGER"
}
```

Authorization:

```text
Approve Loan
✅

Delete User
❌
```

***

# Permission-Based JWT (Advanced)

Instead of role:

```json
{
  "permissions": [
    "create_order",
    "view_reports",
    "manage_users"
  ]
}
```

Check:

```javascript
if (
  permissions.includes(
    "manage_users"
  )
) {
  allow();
}
```

Used in:

```text
Enterprise SaaS

Azure

AWS IAM

Large Banking Apps
```

***

# 3. Securely Storing JWT in Web Applications

This is a favourite interview question.

***

# Option 1: localStorage ❌

```javascript
localStorage.setItem(
  "token",
  jwt
);
```

Problem:

```text
XSS Attack
```

Example:

```javascript
localStorage.getItem(
  "token"
);
```

Malicious script can steal it.

***

# Option 2: sessionStorage ⚠️

```javascript
sessionStorage.setItem(
  "token",
  jwt
);
```

Better than localStorage.

But still vulnerable to:

```text
XSS
```

***

# Option 3: HttpOnly Secure Cookie ✅

Best practice.

Server:

```http
Set-Cookie:

refreshToken=abc123

HttpOnly
Secure
SameSite=Strict
```

***

# Why HttpOnly?

JavaScript cannot read:

```javascript
document.cookie
```

for HttpOnly cookies.

Attacker cannot easily steal token through XSS.

***

# Modern Enterprise Architecture

```text
Access Token
   ↓
Memory (React State)

Refresh Token
   ↓
HttpOnly Cookie
```

Flow:

```text
Login
 ↓
Access Token

Refresh Token Cookie
 ↓
Token Expired
 ↓
Cookie Sent Automatically
 ↓
New Access Token
```

***

# Additional Security Measures

## HTTPS

```text
Prevent MITM attacks
```

***

## Short-Lived Access Tokens

```text
5–15 minutes
```

***

## SameSite Cookies

```text
SameSite=Strict
```

Protects against:

```text
CSRF attacks
```

***

## Token Expiry

```json
{
  "exp": 1719980000
}
```

***

## Key Rotation

```text
Rotate signing keys
```

***

# Complete Enterprise Architecture

```text
React App
     ↓
Login

     ↓

Access Token
(5 mins)

     ↓

Memory

     ↓

Refresh Token
(7 Days)

     ↓

HttpOnly Secure Cookie


Access Expired
      ↓

Refresh Endpoint
      ↓

New Access Token

New Refresh Token
(Token Rotation)
```

***

# Senior-Level Interview Answer (2 Minutes)

> In production applications I avoid storing JWTs in localStorage because they are vulnerable to XSS attacks. I prefer storing refresh tokens in HttpOnly Secure SameSite cookies and keeping short-lived access tokens in memory. I implement refresh-token rotation so that every token refresh generates a new refresh token and invalidates the previous one. For authorization, I use role-based or permission-based JWT claims and always enforce access control on the backend rather than relying solely on frontend checks. This approach provides strong protection against token theft, replay attacks, session hijacking, and privilege escalation.
