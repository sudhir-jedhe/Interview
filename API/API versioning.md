**API versioning** is the practice of managing changes to your application programming interface so that updates, refactoring, or breaking changes do not disrupt existing client applications (such as mobile apps, web frontends, or partner integrations).

---

## 1. Common API Versioning Strategies

### A. URI Path Versioning (Most Popular & Recommended)

The major version number is embedded directly into the URL path prefix.

* **Format:** `[https://api.example.com/v1/users](https://api.example.com/v1/users)` vs `[https://api.example.com/v2/users](https://api.example.com/v2/users)`
* **Pros:**
* Extremely clear, transparent, and easy to test directly in a browser or terminal.
* Trivial to route at the API Gateway or reverse proxy level (e.g., routing `/v1/*` to legacy servers and `/v2/*` to modern microservices).

* **Cons:**
* REST purists argue that URLs should identify resources (`/users`), not the representation version.

### B. Request Header Versioning

The version is passed inside a custom HTTP header rather than the URL.

* **Format:**
* Request: `GET /api/users` with header `X-API-Version: 2`

* **Pros:**
* Keeps URLs clean and focused purely on resource identification.

* **Cons:**
* Harder to test quickly without API clients like Postman or custom browser headers.
* Complicates caching at the CDN/proxy layer if headers are excluded from cache keys.

### C. Query Parameter Versioning

The version is passed as a query string parameter.

* **Format:** `[https://api.example.com/users?version=2](https://api.example.com/users?version=2)`
* **Pros:**
* Easy to implement and test.

* **Cons:**
* Makes CDN caching inefficient because query string variations create duplicate cache entries.

### D. Content Negotiation / Accept Header Versioning (Media Type Versioning)

The version is specified inside the standard `Accept` header using a custom media type.

* **Format:** `Accept: application/vnd.example.v2+json`
* **Pros:**
* The most RESTful approach according to strict HTTP specifications.

* **Cons:**
* Complex to implement, debug, and test. Offers poor developer experience (DX).

---

## 2. Breaking Changes vs. Non-Breaking Changes

Knowing *when* you actually need to bump your API version saves you from unnecessary maintenance overhead:

* **Non-Breaking (Additive) Changes — *No version bump needed*:**
* Adding new optional request or response fields.
* Adding new optional query parameters.
* Adding a brand-new endpoint (`/api/v1/posts`).
* Changing the order of JSON object keys.

* **Breaking Changes — *Requires a new API version*:**
* Renaming or deleting an existing response field.
* Changing a field's data type (e.g., changing `id` from an integer to a UUID string).
* Making an optional request field mandatory.
* Removing an endpoint or changing HTTP methods.

---

## 3. Best Practices for API Versioning

1. **Prioritize Developer Experience (DX):** URI path versioning (`/v1/`) remains the industry standard because it is immediately visible in code, logs, and documentation.
2. **Consider Date-Based Versioning:** Instead of numeric versioning (`v1`, `v2`), major platforms (like Stripe and GitHub) use date-based versioning (e.g., `2026-06-06`). This allows clients to opt into updates incrementally rather than facing massive all-at-once migrations.
3. **Enforce a Sunset Policy:** Never maintain legacy versions indefinitely. Provide a clear deprecation schedule (e.g., 6 to 12 months notice), document migrations in your changelog, and emit deprecation warnings in response headers:

```http
Warning: 299 - "API v1 is deprecated. Please migrate to v2 by December 31, 2026."

```

A **breaking change** in an API is any modification to the API contract that causes existing client applications (such as mobile apps, frontend web pages, or third-party integrations) to fail, crash, or return errors without code updates on the client side.

When you introduce a breaking change, you break the "backward compatibility" of your system. This is the primary reason why APIs increment their major version numbers (e.g., moving from `/v1/` to `/v2/`).

---

## Common Examples of Breaking Changes

Here are the most frequent ways developers accidentally introduce breaking changes:

### 1. Renaming or Deleting Existing Fields

If a client relies on a specific property name in a JSON response, changing or removing it will cause the client's code to evaluate it as `undefined`.

* **Before (v1):** `{"userId": 101, "firstName": "Sudhir"}`
* **Breaking Change (v2):** `{"userId": 101, "fullName": "Sudhir"}` *(Renaming `firstName` to `fullName` breaks any frontend code looking for `user.firstName`).*
* **Breaking Change:** Removing `firstName` entirely.

### 2. Changing Data Types

If an API changes the expected data type of a field, client-side math, string operations, or parsing logic will break.

* **Before (v1):** `"id": 12345` (Integer)
* **Breaking Change:** `"id": "12345"` (String) — *Client code doing strict comparisons (`id === 12345`) or mathematical operations will fail.*

### 3. Making an Optional Field Mandatory

If a request payload previously treated a field as optional, making it required in an update will cause all older client versions that don't send that field to receive `400 Bad Request` errors.

* **Before (v1):** `POST /posts` with just `{"title": "Hello"}` succeeds.
* **Breaking Change:** Making `category` mandatory (`{"title": "Hello", "category": "tech"}`), causing older clients omitting `category` to fail.

### 4. Removing or Relocating an Endpoint

* **Before (v1):** `GET /api/v1/users`
* **Breaking Change:** Deleting `/users` or moving it to `/api/v1/accounts/users` without keeping a redirect or legacy route.

### 5. Changing Error Codes or Structure

If an API shifts from returning errors as a string message (`{"error": "Invalid password"}`) to a nested array (`{"errors": [{"code": "INVALID_PASSWORD"}]}`), client error-handling blocks will break.

---

## What is NOT a Breaking Change? (Additive Changes)

Changes that **do not** break existing clients are called **non-breaking** or **additive changes**. You can deploy these to a live API without bumping the version number:

* Adding a brand-new endpoint (`POST /api/v1/comments`).
* Adding a new optional field to a JSON response (`{"id": 1, "name": "Sudhir", "middleName": "Arvind"}`).
* Adding a new optional query parameter (`?includeProfile=true`).
