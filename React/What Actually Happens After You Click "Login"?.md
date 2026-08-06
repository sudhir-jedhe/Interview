Web Security Explained — Part 1

What actually happens after you click "Login"?
We click the Login button almost every day.
But have you ever wondered what happens behind the scenes before your dashboard appears?

Let's walk through the journey.
Step 1: Your browser sends your credentials
When you click Login, your browser sends a request to the server over HTTPS.
POST /login
Email + Password
HTTPS encrypts the data while it's traveling across the internet, protecting it from being intercepted.

Step 2: The server verifies who you are
The server:

* Finds your account.
* Compares your password with the hashed password stored in the database.
* Rejects the request if they don't match.
Important: Your actual password should never be stored in the database.

Step 3: The server creates a JWT
If your credentials are valid, the server generates a JSON Web Token (JWT).
A JWT usually contains:

* User ID
* User role (Admin/User)
* Expiration time
* Issued time

The server then digitally signs the token so it can't be modified without detection.
Step 4: The JWT is returned
The server sends the JWT back to your application.
Your frontend stores it using secure practices and includes it in future API requests.

Step 5: Every API request includes the token
Authorization: Bearer <JWT>
Instead of asking for your username and password every time, the server verifies the token and processes the request.
This makes authentication fast and scalable.

Step 6: The token eventually expires
Access Tokens are intentionally short-lived.
When one expires, a Refresh Token can be used to obtain a new Access Token without requiring the user to log in again.

A common misconception
Many developers believe JWTs are encrypted.
They're usually not.
Anyone with a JWT can decode its payload.
What keeps it secure is the digital signature, which allows the server to detect whether the token has been altered.

That's why sensitive information—such as passwords, banking details, or personal data—should never be stored inside a JWT.

Key takeaways

* HTTPS protects data while it's in transit.
* Passwords are stored as hashes, not plain text.
* JWTs prove your identity after authentication.
* JWTs are signed, not encrypted.
* Keep Access Tokens short-lived and protect Refresh Tokens carefully.

Here is a recreated, clean, and beautifully structured visual guide for **Web Security Explained: What Happens After You Click "Login"?**

---

# What Actually Happens After You Click "Login"? 🔐

We click the "Login" button every single day without thinking twice. But what actually happens under the hood before your dashboard appears? Here is the step-by-step journey of an authentication request.

---

### Step 1: Your Browser Sends Credentials Securely

When you click **Login**, your browser constructs a payload containing your credentials and dispatches an HTTP request:

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "MySuperSecretPassword123!"
}

```

* **HTTPS Enforcement:** The entire request travels over **TLS/HTTPS**, which encrypts the payload in transit to prevent Man-in-the-Middle (MitM) eavesdropping or credential sniffing.

---

### Step 2: The Server Verifies Your Identity

When the server receives the request:

1. It queries the database for the user record matching `user@example.com`.
2. It runs the incoming password through a secure password hashing algorithm (like **bcrypt**, **Argon2**, or **PBKDF2**) alongside the user's stored salt.
3. It compares the newly generated hash against the hash saved in the database.
4. **Invalid Match?** The server rejects the request with a `410/401 Unauthorized` status.

> 💡 **Golden Rule:** Plaintext passwords are **never** stored in the database.

---

### Step 3: The Server Generates and Signs a JWT

Once verified, the server constructs a **JSON Web Token (JWT)** containing claims about the session:

```json
{
  "sub": "usr_998811",
  "role": "Admin",
  "iat": 1722828000,
  "exp": 1722831600
}

```

* **Digital Signature:** The server takes the JWT Header + Payload and signs it using a private secret key (or asymmetric RSA/ECDSA key pair). If any payload claims are altered later, the signature verification will fail instantly.

---

### Step 4: The JWT Returns to the Client

The server responds with the freshly minted JWT (and typically a long-lived Refresh Token):

```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresIn": 3600
}

```

The frontend application stores the token using secure practices (such as an **`HttpOnly` cookie** or in-memory state) for subsequent API requests.

---

### Step 5: Every API Request Includes the Token

For every subsequent request to protected resources, the client attaches the token to the HTTP authorization header:

```http
GET /api/user/dashboard
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

```

Instead of querying the database for user credentials on every single page load, the server simply verifies the digital signature of the token statelessly.

---

### Step 6: Token Expiration & Silently Refreshing

To limit the blast radius if an access token is compromised, **Access Tokens are intentionally short-lived** (e.g., 15 minutes to 1 hour).

* When the Access Token expires, the client uses a **Refresh Token** (sent to a dedicated `/refresh` endpoint) to acquire a new Access Token seamlessly behind the scenes without prompting the user to type their password again.

---

### ⚠️ The Biggest Misconception About JWTs

> **"JWTs are encrypted." — ❌ FALSE**

Standard JWTs are **encoded** using Base64URL, **not encrypted**. Anyone who inspects the token can easily decode and read the JSON payload.

* **What makes it secure?** The **Digital Signature**. An attacker can read the claims, but if they change `"role": "User"` to `"role": "Admin"`, the server will detect signature mismatch and reject the token immediately.
* **Security Practice:** **Never** store sensitive data inside a JWT payload (e.g., passwords, credit card numbers, or personally identifiable information).

---

### Key Takeaways Checklist

| Phase               | Security Mechanism            | Purpose                                                  |
| ------------------- | ----------------------------- | -------------------------------------------------------- |
| **In-Transit**      | **HTTPS (TLS 1.3)**           | Prevents sniffing of passwords & tokens over the network |
| **At-Rest**         | **Bcrypt / Argon2 Hashing**   | Protects user passwords in case of database breaches     |
| **Authorization**   | **JWT Digital Signature**     | Enables stateless, tamper-proof user session checks      |
| **Session Control** | **Short-Lived Access Tokens** | Limits damage window if a token is stolen                |
