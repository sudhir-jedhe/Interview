"Explain how JWT authentication works end-to-end."

Here's a simple breakdown.

🟢 Step 1: User Logs In

The client sends login credentials (such as email and password) to the authentication server.

The server first verifies whether the credentials are valid.

🟢 Step 2: JWT is Generated

If authentication succeeds, the server creates a JWT.

The token typically contains:

✅ User ID

✅ Roles & Permissions

✅ Expiration Time

The token is digitally signed so it cannot be modified without detection.

🟢 Step 3: Token is Sent to the Client

The server returns the JWT in the response.

The client stores it securely.

A common approach is using HTTP-only cookies, which help reduce exposure to JavaScript-based attacks.

🟢 Step 4: Accessing Protected APIs

Whenever the client calls a protected endpoint, it includes the token.

Authorization: Bearer <JWT>

This allows the server to identify the requesting user without asking them to log in again.

🟢 Step 5: Server Validates the Token

Before processing the request, the server verifies:

✔ Token signature

✔ Expiration time

✔ Issuer (iss)

✔ Audience (aud)

If validation succeeds, access is granted.

Otherwise, the API returns 401 Unauthorized.

🟢 Step 6: Token Expiration & Refresh

JWTs are usually short-lived to reduce security risks.

Instead of forcing users to log in repeatedly:

• The client sends a Refresh Token.

• The server validates it.

• A new Access Token (JWT) is generated.

• The user continues working without interruption.

💡 Why JWT Is Popular

✔ Stateless authentication

✔ Scales well across distributed systems

✔ Ideal for REST APIs and microservices

✔ Reduces repeated database lookups for authentication

🚀 Interview Tip

Many candidates explain what a JWT is.

Strong candidates also explain:

Why short-lived access tokens are preferred

Why refresh tokens are used

Why HTTP-only cookies are often safer than localStorage

The trade-offs of stateless authentication
