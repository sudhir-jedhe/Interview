JWT (JSON Web Token) is one of the most widely used authentication mechanisms in modern web applications. Here’s how it works:

✅ 1. User Login
The user submits credentials (email & password).

✅ 2. Credential Validation
The server verifies the credentials against the database.

✅ 3. JWT Generation
If authentication succeeds, the server generates a JWT containing:

* Header
* Payload (user information/claims)
* Signature

✅ 4. Token Storage
The client stores the token securely (preferably in HttpOnly Cookies).

✅ 5. Authenticated Requests
The token is sent with every request using the Authorization header:

✅ 6. Token Verification
The server validates:

* Token signature
* Expiration time
* User claims/permissions

✅ 7. Access Protected Resources
If the token is valid, the user gains access to secured APIs and resources.

💡 Why JWT?
✔ Stateless Authentication
✔ Scalable for Microservices
✔ Reduced Server-Side Session Management
✔ Works seamlessly with REST APIs

⚠️ Best Practices

* Use HTTPS only
* Keep token expiration short
* Implement Refresh Tokens
* Avoid storing sensitive data in JWT payloads
* Prefer HttpOnly Secure Cookies over localStorage

![alt text](image-11.png)
