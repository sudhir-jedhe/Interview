# auth-demo

A small, genuine multi-file login / protected-route demo built to demonstrate the middleware & auth principles covered in this topic: bcrypt password hashing, JWT-based authentication middleware, and role-based authorization middleware.

## Run it

```sh
npm install
JWT_SECRET=some-long-random-string npm start
# server listening on http://localhost:3000
```

## Project structure

```
auth-demo/
  app.js                    entrypoint — wires up routes and error handling
  db.js                     in-memory user store (passwords stored ONLY as bcrypt hashes)
  routes/auth.js            /register and /login
  routes/protected.js       routes requiring authentication and/or a specific role
  middleware/requireAuth.js JWT verification middleware + requireRole authorization middleware
```

## Endpoints

| Method | Path | Auth required | Description |
|---|---|---|---|
| POST | `/register` | none | Create a user (`{ email, password }`) — password is bcrypt-hashed before storage |
| POST | `/login` | none | Verify credentials, return a short-lived JWT access token |
| GET | `/me` | any authenticated user | Return the caller's own profile |
| GET | `/admin/users` | authenticated + `admin` role | List all users (401 if not authenticated, 403 if authenticated but not admin) |

## Example

```sh
curl -X POST http://localhost:3000/register \
  -H "Content-Type: application/json" \
  -d '{"email":"jed@example.com","password":"correct horse battery staple"}'
# 201 { "data": { "id": 1, "email": "jed@example.com", "role": "user" } }

curl -X POST http://localhost:3000/login \
  -H "Content-Type: application/json" \
  -d '{"email":"jed@example.com","password":"correct horse battery staple"}'
# 200 { "data": { "accessToken": "eyJhbGciOi..." } }

curl http://localhost:3000/me \
  -H "Authorization: Bearer eyJhbGciOi..."
# 200 { "data": { "id": 1, "email": "jed@example.com", "role": "user" } }

curl http://localhost:3000/admin/users \
  -H "Authorization: Bearer eyJhbGciOi..."
# 403 { "error": { "message": "Insufficient permissions" } }  (this user has role "user", not "admin")
```

## Security notes this demo illustrates

- Passwords are never stored in plaintext — `bcrypt.hash` (cost factor 12) before storage, `bcrypt.compare` on login
- Login returns the same `401 Invalid credentials` whether the email doesn't exist or the password is wrong, avoiding user enumeration
- JWT verification pins `algorithms: ['HS256']` explicitly rather than trusting the token's own header
- Authentication (`requireAuth`) always runs before authorization (`requireRole`) in the middleware chain
- `passwordHash` is never included in any JSON response
