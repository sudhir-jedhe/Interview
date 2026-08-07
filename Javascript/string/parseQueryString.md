Both versions of the `parseQueryString` function you've shared achieve the same goal: parsing a query string into an object of key-value pairs. However, they approach the problem in slightly different ways. Let’s break them down and discuss both implementations:

### 1. **First Version (Using `URLSearchParams`)**

This implementation leverages the built-in `URLSearchParams` API, which is designed specifically for parsing and manipulating query strings.

#### Code Explanation

```javascript
function parseQueryString(queryString) {
  const params = new URLSearchParams(queryString); // Create a URLSearchParams object from the query string
  const result = {};

  // Loop over all the entries (key-value pairs) in the query string
  for (const [key, value] of params) {
    result[key] = value; // Store each pair in the result object
  }

  return result; // Return the object with parsed key-value pairs
}

const queryString = "name=John&age=30&city=New%20York";
const parsedObject = parseQueryString(queryString);
console.log(parsedObject);
```

#### Explanation

- **`URLSearchParams(queryString)`**: This built-in object parses the query string and provides easy access to the parameters.
- **`for...of` loop**: Iterates over all key-value pairs (`[key, value]`) from the `URLSearchParams` object, adding them to the `result` object.

#### Output

```json
{
  "name": "John",
  "age": "30",
  "city": "New York"
}
```

#### Pros

- **Concise and efficient**: `URLSearchParams` is designed to handle query strings and automatically decodes percent-encoded characters (like `%20` for spaces).
- **Built-in functionality**: No need to manually split and decode the query string, which reduces the complexity of the code.

#### Cons

- **Browser compatibility**: While `URLSearchParams` is widely supported in modern browsers, it may not be available in older environments (like Internet Explorer), though polyfills can be used.

---

### 2. **Second Version (Manual Parsing)**

In this version, you manually split the query string into key-value pairs, process them, and return an object.

#### Code Explanation

```javascript
const parseQueryString = function (queryString) {
  // Split into key-value pairs.
  const queries = queryString.split("&"); // Split the query string by '&'

  // Convert the array of strings into an object.
  const params = {};
  for (let i = 0; i < queries.length; i++) {
    const temp = queries[i].split("="); // Split each pair by '='
    params[temp[0]] = temp[1]; // Assign the key-value pair to the object
  }

  return params; // Return the resulting object
};

// Example usage:
const queryString = "foo=bar&baz=qux";
const params = parseQueryString(queryString);

console.log(params); // { foo: "bar", baz: "qux" }
```

#### Explanation

- **`.split("&")`**: Splits the query string by the `&` character into an array of key-value pairs.
- **`.split("=")`**: Splits each key-value pair by the `=` character to separate keys and values.
- **Populating the `params` object**: Iterates through the array of key-value pairs and adds them to the `params` object.

#### Output

```json
{
  "foo": "bar",
  "baz": "qux"
}
```

#### Pros

- **Simple**: This is a straightforward, manual approach to parsing query strings.
- **No external dependencies**: It doesn't rely on browser-specific APIs, so it works in any environment, including older browsers.

#### Cons

- **Less efficient**: It doesn't automatically decode percent-encoded characters, so if the query string contains encoded spaces (like `%20`), they will remain encoded unless you manually decode them using `decodeURIComponent()`.
- **Less elegant**: The code is slightly more verbose than using `URLSearchParams`, and you have to handle edge cases like missing values or malformed query strings manually.

---

### Improvements for the Manual Approach

If you'd like the manual approach to be more robust and handle percent-encoded characters, you can add `decodeURIComponent` to ensure decoding works properly:

```javascript
const parseQueryString = function (queryString) {
  const queries = queryString.split("&");
  const params = {};

  for (let i = 0; i < queries.length; i++) {
    const temp = queries[i].split("=");
    params[decodeURIComponent(temp[0])] = decodeURIComponent(temp[1] || ""); // Decode both key and value
  }

  return params;
};
```

Now, if your query string contains values like `name=John%20Doe`, they will be decoded into `name: "John Doe"`.

---

### Comparison Summary

| Feature                   | **Using `URLSearchParams`**                       | **Manual Approach**                             |
| ------------------------- | ------------------------------------------------- | ----------------------------------------------- |
| **Conciseness**           | More concise and elegant                          | More verbose                                    |
| **Ease of Use**           | Built-in browser functionality                    | Manual handling needed                          |
| **Automatic Decoding**    | Automatically decodes percent-encoded characters  | Needs manual decoding (`decodeURIComponent`)    |
| **Browser Compatibility** | Works in modern browsers (may require a polyfill) | Works in all environments, including older ones |
| **Efficiency**            | More efficient for parsing and decoding           | Less efficient (more lines of code)             |

### Conclusion

- If you're working with modern browsers or a JavaScript environment that supports `URLSearchParams`, the first version is **recommended** because it's **more concise**, **easier to use**, and **automatically handles decoding**.
- If you need compatibility with **older browsers** or you want a more **manual control over the parsing process**, the second version works just fine, but you'd need to handle percent-decoding explicitly.

Let me know if you'd like further clarification or improvements!

In modern JavaScript, parsing a query string into a key-value object depends on whether you are running code in the **browser**, **Node.js**, or building a custom implementation.

Here are the best ways to parse query strings.

---

### 1. Browser Native Approach (`URLSearchParams`)

In modern browsers (and Node.js 10+), the built-in `URLSearchParams` API is the cleanest standard solution.

```javascript
/**
 * Parses a query string into a JavaScript object
 * @param {string} queryString - e.g., "?name=Alice&age=25&hobbies=coding&hobbies=hiking"
 * @returns {Record<string, string | string[]>}
 */
function parseQueryString(queryString) {
  const params = new URLSearchParams(queryString);
  const result = {};

  for (const [key, value] of params.entries()) {
    if (key in result) {
      // Convert duplicate keys (like hobbies=a&hobbies=b) into an array
      if (Array.isArray(result[key])) {
        result[key].push(value);
      } else {
        result[key] = [result[key], value];
      }
    } else {
      result[key] = value;
    }
  }

  return result;
}

// Example usage:
const qs = "?search=javascript&page=2&tags=js&tags=web";
console.log(parseQueryString(qs));
/*
Output:
{
  search: "javascript",
  page: "2",
  tags: ["js", "web"]
}
*/
```

---

### 2. Custom Vanilla JavaScript (Zero Dependencies)

If you need a lightweight helper function without relying on DOM APIs:

```javascript
function parseQueryStringCustom(queryString) {
  if (!queryString || typeof queryString !== "string") return {};

  // Strip leading '?' or '#' if present
  const cleanQs = queryString.replace(/^[?#]/, "");

  return cleanQs.split("&").reduce((acc, pair) => {
    if (!pair) return acc;

    const [rawKey, rawValue = ""] = pair.split("=");
    const key = decodeURIComponent(rawKey.trim());
    const value = decodeURIComponent(rawValue.replace(/\+/g, " ").trim());

    if (key in acc) {
      if (Array.isArray(acc[key])) {
        acc[key].push(value);
      } else {
        acc[key] = [acc[key], value];
      }
    } else {
      acc[key] = value;
    }

    return acc;
  }, {});
}

// Example:
console.log(parseQueryStringCustom("name=John+Doe&role=admin&active=true"));
/*
Output:
{
  name: "John Doe",
  role: "admin",
  active: "true"
}
*/
```

---

### 3. Node.js Native Module (`querystring`)

If you are writing server-side code in Node.js, you can use the built-in `querystring` module:

```javascript
const querystring = require("querystring");

const parsed = querystring.parse(
  "user=Bob&age=30&interests=music&interests=tech",
);

console.log(parsed);
/*
Output:
{
  user: 'Bob',
  age: '30',
  interests: ['music', 'tech']
}
*/
```

---

### 4. Advanced / Nested Query Strings (`qs` library)

If your query strings contain nested objects or arrays (e.g., `filter[user][id]=10&filter[user][name]=Alice`), the native solutions above won't parse them into nested objects. Use the popular **`qs`** library instead:

```bash
npm install qs

```

```javascript
import qs from "qs";

const parsed = qs.parse(
  "user[name]=Alice&user[age]=25&items[0]=apple&items[1]=banana",
);

console.log(parsed);
/*
Output:
{
  user: {
    name: 'Alice',
    age: '25'
  },
  items: ['apple', 'banana']
}
*/
```

Your comparison and breakdown of query string parsing methods cover all the core practical solutions in JavaScript—from standard DOM APIs to custom reducers, Node modules, and third-party libraries like `qs`.

However, when manually parsing query strings or handling real-world production data, there are **two critical edge cases** that often introduce security vulnerabilities or runtime bugs if unhandled:

---

### 1. The `+` Plus-Sign Encoding Edge Case

In URL query strings (per the `application/x-www-form-urlencoded` standard), spaces can be encoded as either `%20` or a plus sign `+` (e.g., `q=javascript+tutorial`).

- **`decodeURIComponent("javascript+tutorial")`** returns `"javascript+tutorial"` (it leaves the `+` untouched!).
- **`URLSearchParams`** handles this automatically: `new URLSearchParams("q=javascript+tutorial").get("q")` correctly yields `"javascript tutorial"`.

#### The Fix for Manual Parsing

Before passing a value to `decodeURIComponent`, always convert `+` characters to spaces:

```javascript
const safeDecode = (str) => decodeURIComponent(str.replace(/\+/g, " "));

```

---

### 2. Prototype Pollution Security Vulnerability

If a query string contains malicious keys like `__proto__`, `constructor`, or `toString`, directly writing `acc[key] = value` on a plain Object can overwrite object prototype properties, leading to security vulnerabilities or runtime crashes.

```javascript
// Malicious query string attempting Prototype Pollution
const dangerousQs = "__proto__[polluted]=true&role=admin";

// Naive implementation:
const acc = {};
// acc["__proto__"]["polluted"] = true; <-- Corrupts Object.prototype globally!

```

#### How to Prevent Prototype Pollution

1. **Use `Object.create(null)`:** Creates a dictionary object without a prototype (`__proto__` loses its special meaning).
2. **Key Blacklisting / Validation:** Ignore unsafe keys (`__proto__`, `constructor`, `prototype`) during iteration.

```javascript
/**
 * Safe, zero-dependency, prototype-pollution-proof query string parser
 */
function parseQueryStringSafe(queryString) {
  if (!queryString || typeof queryString !== "string") return {};

  const cleanQs = queryString.replace(/^[?#]/, "");
  // Create a prototype-less object dictionary
  const result = Object.create(null);

  for (const pair of cleanQs.split("&")) {
    if (!pair) continue;

    const [rawKey, rawValue = ""] = pair.split("=");
    const key = decodeURIComponent(rawKey.replace(/\+/g, " ")).trim();
    
    // Prevent Prototype Pollution
    if (key === "__proto__" || key === "constructor" || key === "prototype") {
      continue;
    }

    const value = decodeURIComponent(rawValue.replace(/\+/g, " "));

    if (Object.prototype.hasOwnProperty.call(result, key)) {
      if (Array.isArray(result[key])) {
        result[key].push(value);
      } else {
        result[key] = [result[key], value];
      }
    } else {
      result[key] = value;
    }
  }

  // Convert back to standard plain object if needed
  return { ...result };
}

// Verification
console.log(parseQueryStringSafe("name=John+Doe&__proto__[polluted]=true&page=2"));
// Output: { name: "John Doe", page: "2" } (Malicious payload safely discarded!)

```

---

### Modern Query String Parser Comparison Matrix

| Environment / Approach     | Handles `%20` & `+` | Handles Duplicate Keys | Handles Nested Objects | Security (Proto-Safe) |
| -------------------------- | ------------------- | ---------------------- | ---------------------- | --------------------- |
| **`URLSearchParams`**      | ✅ Yes               | ⚠️ Manual loop needed   | ❌ No                   | ✅ Safe                |
| **Naive `.split('&')**`    | ❌ Fails on `+`      | ❌ Overwrites keys      | ❌ No                   | ❌ Vulnerable          |
| **`parseQueryStringSafe`** | ✅ Yes               | ✅ Arrays               | ❌ No                   | ✅ Safe                |
| **Node `querystring**`     | ✅ Yes               | ✅ Arrays               | ❌ No                   | ✅ Safe                |
| **`qs` (npm package)**     | ✅ Yes               | ✅ Arrays               | ✅ Yes (`user[name]`)   | ✅ Configurable        |

Converting a JavaScript object back into a URL query string (known as **serialization**) can be done using native browser/Node APIs or custom logic depending on whether you need simple flat parameters or complex nested objects.

---

### 1. Native Approach (`URLSearchParams`)

The cleanest standard way in modern JavaScript is using the built-in `URLSearchParams` API. It handles URL percent-encoding (spaces $\rightarrow$ `+` or `%20`, special characters, etc.) automatically.

#### Simple Objects (Single Values & Arrays)

```javascript
/**
 * Serializes a flat object into a query string using URLSearchParams
 * @param {Record<string, any>} obj
 * @return {string} Query string starting with '?' (or empty string if empty)
 */
function stringifyQueryString(obj) {
  if (!obj || Object.keys(obj).length === 0) return "";

  const params = new URLSearchParams();

  for (const [key, value] of Object.entries(obj)) {
    if (value === undefined || value === null) continue; // Skip empty values

    if (Array.isArray(value)) {
      // Append duplicate keys for arrays: tags=js&tags=web
      value.forEach((item) => params.append(key, item));
    } else {
      params.append(key, value);
    }
  }

  const queryString = params.toString();
  return queryString ? `?${queryString}` : "";
}

// Example usage:
const params = {
  search: "javascript & node",
  page: 2,
  tags: ["js", "web"],
  filter: null, // Skipped
};

console.log(stringifyQueryString(params));
// Output: "?search=javascript+%26+node&page=2&tags=js&tags=web"

```

---

### 2. Custom Vanilla JavaScript (Zero Dependencies)

If you are working in an environment without DOM/Node global APIs or need custom encoding rules (e.g., using `%20` instead of `+` for spaces):

```javascript
/**
 * Custom zero-dependency query string serializer
 */
function serializeCustom(obj, prefix = "?") {
  if (!obj || typeof obj !== "object") return "";

  const pairs = [];

  for (const key of Object.keys(obj)) {
    const value = obj[key];

    // Ignore null, undefined, and functions
    if (value === null || value === undefined || typeof value === "function") {
      continue;
    }

    const encodedKey = encodeURIComponent(key);

    if (Array.isArray(value)) {
      value.forEach((val) => {
        pairs.push(`${encodedKey}=${encodeURIComponent(val)}`);
      });
    } else {
      pairs.push(`${encodedKey}=${encodeURIComponent(value)}`);
    }
  }

  return pairs.length > 0 ? `${prefix}${pairs.join("&")}` : "";
}

// Example usage:
console.log(serializeCustom({ category: "frontend tools", page: 1 }));
// Output: "?category=frontend%20tools&page=1"

```

---

### 3. Handling Nested Objects (Recursive Serialization)

Standard `URLSearchParams` turns nested objects into `"[object Object]"`. If your backend expects bracket-notation nested query parameters (e.g., `filter[user][id]=10`), you need a recursive serializer:

```javascript
/**
 * Recursively serializes nested objects into bracket notation query strings
 * e.g., { user: { name: "Alice" } } -> "user%5Bname%5D=Alice" (user[name]=Alice)
 */
function serializeNested(obj, prefix = "") {
  const str = [];

  for (const p in obj) {
    if (!Object.prototype.hasOwnProperty.call(obj, p)) continue;

    const k = prefix ? `${prefix}[${p}]` : p;
    const v = obj[p];

    if (v === null || v === undefined) continue;

    if (typeof v === "object") {
      str.push(serializeNested(v, k));
    } else {
      str.push(`${encodeURIComponent(k)}=${encodeURIComponent(v)}`);
    }
  }

  return str.filter(Boolean).join("&");
}

// Example usage:
const complexParams = {
  filter: {
    user: "Alice",
    status: "active",
  },
  sort: "desc",
};

console.log("?" + serializeNested(complexParams));
// Output: "?filter%5Buser%5D=Alice&filter%5Bstatus%5D=active&sort=desc"
// Decodes to: ?filter[user]=Alice&filter[status]=active&sort=desc

```

---

### Solution Selection Matrix

| Use Case                               | Recommended Solution                            | Handles Arrays?              | Handles Nested Objects? |
| -------------------------------------- | ----------------------------------------------- | ---------------------------- | ----------------------- |
| **Modern Browser / Node.js**           | `URLSearchParams` (Native)                      | ✅ Duplicates key (`a=1&a=2`) | ❌ No                    |
| **Custom Encoding / Lightweight**      | `serializeCustom`                               | ✅ Handled via loop           | ❌ No                    |
| **Nested Structures (`user[name]=x`)** | Recursive `serializeNested` or `qs` npm library | ✅ Bracket indexing           | ✅ Yes                   |
