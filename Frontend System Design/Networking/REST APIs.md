Here is the English translation of the comprehensive explanation on REST API principles and how to build a robust, scalable interface for web applications:

---

# Principles of REST APIs: Building Robust and Scalable Web Application Interfaces

**REST (Representational State Transfer)** is a popular architectural style for designing APIs, originally defined by Roy Fielding in his 2000 doctoral dissertation. It forms the foundation for creating robust, scalable, and loosely coupled communication interfaces between the client and server in web applications.

---

## 1. The 6 Core Principles of REST

An ideal RESTful API should adhere to the following six architectural constraints:

### A. Client-Server Architecture

* **Principle:** The client (such as a front-end browser or mobile app) and the server (backend and database) must remain completely independent of one another.
* **Benefit:** This allows the front-end and back-end to evolve separately. The back-end logic can be updated without requiring any changes to the user interface.

### B. Statelessness

* **Principle:** The server never stores client session state between requests. Every single request must be entirely self-contained.
* **Benefit:** All necessary context (such as an auth token or API key) must be included within the request itself. This drastically enhances server scalability because requests can be routed to any available server node.

### C. Cacheability

* **Principle:** Response data must implicitly or explicitly define whether it is cacheable or not.
* **Benefit:** Browsers or CDNs can serve responses locally from cache instead of repeatedly hitting the server for identical data, minimizing network traffic and accelerating load times.

### D. Layered System

* **Principle:** The client should remain agnostic as to whether it is communicating directly with the origin server or via intermediary layers like proxies, load balancers, or CDNs.
* **Benefit:** Security policies, caching proxies, and horizontal scaling can be cleanly introduced into the architecture without altering client code.

### E. Uniform Interface

This is the most critical constraint of REST, standardizing and simplifying the application architecture:

1. **Identification of Resources:** Individual resources are targeted using URIs (e.g., `/users/123`).
2. **Manipulation through Representations:** Clients manipulate resources via transferred representations (e.g., JSON or XML payloads).
3. **Self-Descriptive Messages:** Each response carries enough metadata and information to describe how to process it (e.g., proper HTTP status codes).
4. **HATEOAS (Hypermedia As The Engine Of Application State):** Responses should ideally include hypermedia links pointing to related downstream actions.

---

## 2. Best Practices for Building Robust & Scalable REST APIs

To construct a robust and scalable web interface, engineers adhere to several practical design patterns:

### A. Use Nouns, Not Verbs in URLs

URLs should represent resources (nouns), never actions. HTTP methods dictate the action being performed.

* **Anti-pattern:** `GET /getUsers`, `POST /createUser`, `DELETE /deleteUser?id=5`
* **RESTful Standard:**
* `GET /users` (Retrieve all users)
* `POST /users` (Create a new user)
* `GET /users/5` (Retrieve user with ID 5)
* `PUT /users/5` (Update user with ID 5)
* `DELETE /users/5` (Remove user with ID 5)

### B. Utilize Proper HTTP Status Codes

Returning explicit status codes enables front-end applications to handle responses gracefully:

* `200 OK`: Request succeeded (data retrieved or updated).
* `201 Created`: Resource successfully created (typically after a `POST`).
* `204 No Content`: Request succeeded, but there is no payload body to return (e.g., after a `DELETE`).
* `400 Bad Request`: Client-side validation failure or malformed payload.
* `401 Unauthorized`: Authentication token is missing or expired.
* `403 Forbidden`: Authenticated user lacks authorization to access the resource.
* `404 Not Found`: Target resource does not exist.
* `500 Internal Server Error`: Unhandled server-side fault or crash.

### C. Implement API Versioning

To prevent breaking legacy client applications when the API evolves, prefix endpoints with a version identifier:

* Example: `[https://api.example.com/v1/users](https://api.example.com/v1/users)` or `[https://api.example.com/v2/users](https://api.example.com/v2/users)`

### D. Pagination, Filtering, and Sorting

Returning millions of raw records simultaneously will crash both server and client performance. Always paginate large collections:

* Example: `GET /users?page=2&limit=20&sort=created_at:desc`

### E. Standardized Error Responses

Return clear, uniform error payloads structured in a predictable JSON format:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "The provided email address is invalid.",
    "status": 400
  }
}

```
