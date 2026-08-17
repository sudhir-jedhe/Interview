Yes, that is a concise summary of the core properties and methods of the **`window.location`** object!

Here is a breakdown of how each property translates on a concrete URL, along with a few extra useful methods:

---

## 1. Property Breakdown on an Example URL

Given the URL:
`[https://example.com:8080/shop/items?category=shoes#reviews](https://example.com:8080/shop/items?category=shoes#reviews)`

```javascript
// Reading current properties
console.log(window.location.href);     
// ➔ "https://example.com:8080/shop/items?category=shoes#reviews"

console.log(window.location.protocol); 
// ➔ "https:"

console.log(window.location.hostname); 
// ➔ "example.com"

console.log(window.location.host);     
// ➔ "example.com:8080" (includes port number if non-default)

console.log(window.location.pathname); 
// ➔ "/shop/items"

console.log(window.location.search);   
// ➔ "?category=shoes" (query string)

console.log(window.location.hash);     
// ➔ "#reviews" (anchor fragment)

console.log(window.location.origin);   
// ➔ "https://example.com:8080" (protocol + hostname + port)

```

---

## 2. Navigating and Reloading Methods

In addition to **`assign()`**, `window.location` offers two other important methods for controlling navigation:

| Method / Assignment                | Action                                                    | History Behavior                                                        |
| ---------------------------------- | --------------------------------------------------------- | ----------------------------------------------------------------------- |
| **`window.location.href = url`**   | Loads a new document.                                     | Adds new entry to browser history (**Back button works**).              |
| **`window.location.assign(url)`**  | Loads a new document (identical to setting `.href`).      | Adds new entry to browser history (**Back button works**).              |
| **`window.location.replace(url)`** | Replaces current page in history stack with new document. | Overwrites current history entry (**Back button skips previous page**). |
| **`window.location.reload()`**     | Reloads the current page.                                 | Refreshes existing entry.                                               |

### Practical Navigation Examples

```javascript
// 1. Standard navigation (User can click Back)
function goToCheckout() {
  window.location.assign("https://example.com/checkout");
  // or simply: window.location.href = "https://example.com/checkout";
}

// 2. Redirect after login/logout (User CANNOT click Back to return to auth screen)
function redirectAfterLogin() {
  window.location.replace("https://example.com/dashboard");
}

// 3. Force page refresh
function refreshPage() {
  window.location.reload();
}

```

Explain URL and URLSearchParams in JavaScript with code examples

The **`URL`** and **`URLSearchParams`** modern Web APIs provide an object-oriented approach to parsing, building, and manipulating URLs and query strings without prone-to-error string concatenation or regular expressions.

---

## 1. The `URL` API

The `URL` constructor parses a URL string into structured, editable properties (such as protocol, hostname, pathname, search query, and hash fragment).

### Syntax

```javascript
const url = new URL(urlString, [baseURL]);

```

### Basic Example

```javascript
const urlString = "https://user:pass@example.com:8080/shop/items?category=shoes&page=2#reviews";
const parsedUrl = new URL(urlString);

console.log(parsedUrl.protocol); // "https:"
console.log(parsedUrl.host);     // "example.com:8080"
console.log(parsedUrl.hostname); // "example.com"
console.log(parsedUrl.port);     // "8080"
console.log(parsedUrl.pathname); // "/shop/items"
console.log(parsedUrl.search);   // "?category=shoes&page=2"
console.log(parsedUrl.hash);     // "#reviews"
console.log(parsedUrl.origin);   // "https://example.com:8080"

```

### Resolving Relative URLs

Pass a second parameter to resolve relative URLs against a base origin:

```javascript
const base = "https://api.example.com/v1/";
const relativeUrl = new URL("users/profile", base);

console.log(relativeUrl.href); // "https://api.example.com/v1/users/profile"

```

---

## 2. The `URLSearchParams` API

The `URLSearchParams` interface handles reading, writing, and mutating the query parameters of a URL (the `?key=value` portion).

Access it directly via `url.searchParams` on a `URL` object, or instantiate it independently from a query string.

### Working with `url.searchParams`

```javascript
const myUrl = new URL("https://example.com/search?category=laptops&sort=price_asc");

// 1. READ parameters
console.log(myUrl.searchParams.get("category")); // "laptops"
console.log(myUrl.searchParams.has("sort"));     // true

// 2. ADD or MODIFY parameters
myUrl.searchParams.set("sort", "rating_desc"); // Overwrites existing key
myUrl.searchParams.append("filter", "in_stock"); // Appends key (allows multi-values)

// 3. DELETE a parameter
myUrl.searchParams.delete("category");

console.log(myUrl.toString());
// Output: "https://example.com/search?sort=rating_desc&filter=in_stock"

```

---

## 3. Common `URLSearchParams` Methods

| Method                  | Description                                                | Example                         |
| ----------------------- | ---------------------------------------------------------- | ------------------------------- |
| **`get(name)`**         | Returns first value associated with `name`, or `null`.     | `params.get("q")`               |
| **`getAll(name)`**      | Returns an array of all values for a given `name`.         | `params.getAll("tag")`          |
| **`set(name, val)`**    | Sets `name` to `val`, removing duplicate occurrences.      | `params.set("page", "1")`       |
| **`append(name, val)`** | Appends a new parameter without overwriting existing ones. | `params.append("color", "red")` |
| **`has(name)`**         | Returns boolean indicating if key exists.                  | `params.has("id")`              |
| **`delete(name)`**      | Removes specified parameter.                               | `params.delete("page")`         |
| **`sort()`**            | Sorts all key/value pairs alphabetically by key.           | `params.sort()`                 |

---

## 4. Iterating and Converting Query Parameters

`URLSearchParams` implements an iterable interface, allowing `for...of` loops and conversion to standard JavaScript objects or arrays.

### Iterating over Key-Value Pairs

```javascript
const searchString = "?role=admin&status=active&tag=js&tag=web";
const params = new URLSearchParams(searchString);

for (const [key, value] of params) {
  console.log(`${key}: ${value}`);
}
// Logs:
// role: admin
// status: active
// tag: js
// tag: web

```

---

### Converting Between Objects and Query Strings

```javascript
// 1. Convert plain Object -> URLSearchParams (building query strings)
const filterObject = { page: 1, limit: 20, search: "react & vue" };
const queryParams = new URLSearchParams(filterObject);

console.log(queryParams.toString());
// Automatic encoding: "page=1&limit=20&search=react+%26+vue"

// 2. Convert URLSearchParams -> plain Object
const paramsFromUrl = new URLSearchParams("?category=books&author=king");
const obj = Object.fromEntries(paramsFromUrl);

console.log(obj); // { category: "books", author: "king" }

```

---

## 5. Practical Fetch API Example

`URLSearchParams` automatically handles percent-encoding special characters (spaces, `&`, `#`), making it reliable for API calls:

```javascript
async function fetchProducts(category, minPrice) {
  const url = new URL("https://api.example.com/products");

  // Construct query parameters safely
  url.searchParams.set("category", category);
  url.searchParams.set("min_price", minPrice);
  url.searchParams.set("in_stock", "true");

  console.log("Fetching from:", url.toString());
  // Fetching from: https://api.example.com/products?category=electronics&min_price=500&in_stock=true

  const response = await fetch(url);
  return response.json();
}

// fetchProducts("electronics", 500);

```
