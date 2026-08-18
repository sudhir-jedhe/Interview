When making HTTP requests using the browser's built-in **`fetch` API**, header options are configured inside the second argument (the `options` configuration object) using the `headers` property.

Here is a comprehensive guide and reference on how to set, format, and use headers with `fetch`.

---

## 1. Syntax & Basic Usage

You can pass headers as a standard JavaScript object or using the `Headers` constructor.

### Method A: Using a Plain Object (Most Common)

```javascript
fetch('https://api.example.com/data', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer YOUR_TOKEN_HERE',
    'Accept': 'application/json'
  },
  body: JSON.stringify({ key: 'value' })
})
.then(response => response.json())
.then(data => console.log(data));

```

### Method B: Using the `Headers` Constructor

You can also instantiate a `Headers` object and append values dynamically. This is useful when you need to manipulate or check headers before sending the request.

```javascript
const myHeaders = new Headers();
myHeaders.append('Content-Type', 'application/json');
myHeaders.append('Authorization', 'Bearer YOUR_TOKEN_HERE');

fetch('https://api.example.com/data', {
  method: 'GET',
  headers: myHeaders
})
.then(response => response.json());

```

---

## 2. Common Header Options

| Header Name         | Purpose                                                        | Example Value                                               |
| ------------------- | -------------------------------------------------------------- | ----------------------------------------------------------- |
| **`Content-Type`**  | Tells the server what format the request body is in.           | `'application/json'`, `'application/x-www-form-urlencoded'` |
| **`Authorization`** | Sends credentials, API keys, or JWT tokens for authentication. | `'Bearer eyJhbGciOi...` or `'Basic dXNlcjpwYXNz'`           |
| **`Accept`**        | Tells the server what data format the client expects back.     | `'application/json'`, `'text/html'`                         |
| **`Cache-Control`** | Manages browser caching behavior.                              | `'no-cache'`, `'max-age=3600'`                              |

---

## 3. Advanced Usage: Sending Custom Headers & Handling Responses

### Sending JSON Data with Authorization

```javascript
async function sendData() {
  try {
    const response = await fetch('https://api.example.com/posts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.API_TOKEN}`
      },
      body: JSON.stringify({ title: 'Hello World', content: 'Fetch headers guide' })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Request failed:', error);
  }
}

```

### Reading Response Headers

Once the server responds, you can inspect response headers using the `response.headers` API:

```javascript
fetch('https://api.example.com/data')
  .then(response => {
    // Check a specific response header
    const contentType = response.headers.get('content-type');
    const cacheHeader = response.headers.get('cache-control');
    
    console.log('Content-Type:', contentType);
    
    return response.json();
  });

```

Here is a curated list of top-tier **`fetch` API Interview Questions** ranging from fundamentals to advanced edge cases commonly asked in frontend and full-stack JavaScript interviews.

---

### ## 1. Core Behavior & Fundamentals

#### Q1: What is the primary difference between `fetch()` and older libraries like `axios` regarding HTTP error handling?

* **Answer:**
* **`axios`** automatically rejects the promise (triggers `.catch()`) if the server returns an HTTP error status code like `400 Bad Request`, `404 Not Found`, or `500 Internal Server Error`.
* **`fetch()` only rejects the promise on network failures** (e.g., DNS lookup failure, offline, or CORS network block). If the server successfully responds with a `404` or `500` status code, `fetch()` resolves successfully (`response.ok` is `false`, and `response.status` contains the error code). You must manually check `response.ok` to throw errors.

#### Q2: How do you send JSON data in a `POST` request using `fetch()`?

* **Answer:** You must specify `method: 'POST'`, set the `Content-Type` header to `'application/json'`, and pass your data through `JSON.stringify()` inside the `body` option.

```javascript
fetch('/api/users', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ name: 'Sudhir', role: 'Developer' })
});

```

---

### ## 2. Advanced Features & Performance

#### Q3: How do you cancel an ongoing `fetch` request?

* **Answer:** You use the **`AbortController`** API. You create a controller instance, pass its `signal` to the `fetch` options, and call `controller.abort()` when you want to cancel the request.

```javascript
const controller = new AbortController();
const { signal } = controller;

fetch('/api/heavy-data', { signal })
  .then(res => res.json())
  .catch(err => {
    if (err.name === 'AbortError') {
      console.log('Fetch aborted successfully');
    }
  });

// Cancel the request immediately
controller.abort();

```

*Common use case:* Canceling pending search requests in an autocomplete dropdown when the user types a new letter.

#### Q4: How do you handle authentication credentials (like cookies or HTTP-only sessions) with `fetch()`?

* **Answer:** By default, `fetch()` **does not** send or receive cookies across domains (or even same-origin depending on CORS policies). To include cookies or authorization credentials, you must explicitly set `credentials: 'include'` in the options object:

```javascript
fetch('/api/profile', {
  method: 'GET',
  credentials: 'include' // Sends cookies with the request
});

```

*Options for `credentials`:* `'same-origin'` (default), `'include'`, or `'omit'`.

---

### ## 3. Common Interview Coding Gotchas

#### Q5: Spot the bug in this error-handling code

```javascript
fetch('/api/data')
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('An error occurred:', error));

```

* **Answer:** If the server returns a `404 Not Found` or `500 Server Error`, `fetch()` will **not** trigger the `.catch()` block because the network request succeeded. Furthermore, `response.json()` will throw a syntax error because the server likely returned an HTML error page instead of valid JSON, making the failure hard to debug.
* **The Fix:** Always check `response.ok` before parsing:

```javascript
fetch('/api/data')
  .then(response => {
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return response.json();
  })
  .then(data => console.log(data))
  .catch(error => console.error('Caught:', error));

```

Here is a set of advanced, **scenario-based interview questions** for the `fetch` API. These test your ability to handle real-world production challenges such as race conditions, retries, file uploads, and timeouts.

---

### Scenario 1: Preventing Race Conditions in Autocomplete Search

**The Scenario:**
You are building an autocomplete search input. As the user types `"R"`, `"Re"`, `"Rea"`, `"React"`, you fire a `fetch` request for each keystroke. Because of network latency, the request for `"R"` finishes *after* the request for `"React"`, causing stale results from `"R"` to overwrite the correct results on the screen.

**Question:** How do you solve this race condition using `AbortController`?

**Answer:**
You store the active `AbortController` in a reference or variable. Every time the input changes, you abort the *previous* request before launching a new one.

```javascript
let activeController = null;

async function handleSearch(query) {
  // 1. Cancel the previous ongoing request if it exists
  if (activeController) {
    activeController.abort();
  }

  // 2. Create a new controller for this request
  activeController = new AbortController();

  try {
    const response = await fetch(`/api/search?q=${query}`, {
      signal: activeController.signal
    });
    const results = await response.json();
    updateUI(results);
  } catch (error) {
    if (error.name === 'AbortError') {
      console.log('Stale request aborted:', query);
    } else {
      console.error('Network error:', error);
    }
  }
}

```

---

### Scenario 2: Implementing a Request Timeout

**The Scenario:**
By default, the browser's `fetch` API does not have a built-in timeout option (unlike Axios). If a user has a poor mobile connection, a `fetch` request can hang indefinitely in a pending state, leaving your loading spinner spinning forever.

**Question:** How would you implement a custom timeout wrapper around `fetch()` that aborts the request if it takes longer than 5 seconds?

**Answer:**
You can combine `AbortController` with `setTimeout`.

```javascript
async function fetchWithTimeout(url, options = {}, timeoutMs = 5000) {
  const controller = new AbortController();
  const { signal } = controller;

  // Set a timer to abort the request
  const timer = setTimeout(() => {
    controller.abort();
  }, timeoutMs);

  try {
    const response = await fetch(url, { ...options, signal });
    clearTimeout(timer); // Clear timeout if request succeeds in time
    return response;
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new Error('Request timed out after 5 seconds');
    }
    throw error;
  }
}

// Usage:
try {
  const res = await fetchWithTimeout('/api/data', {}, 3000);
  const data = await res.json();
} catch (err) {
  console.error(err.message);
}

```

---

### Scenario 3: Uploading Files with Progress Tracking

**The Scenario:**
Your user is uploading a massive 50MB video file using `fetch`. You need to show a dynamic progress bar (e.g., 0% to 100%) in the UI.

**Question:** Can you track upload progress directly with `fetch()`? How?

**Answer:**

* **The Catch:** The standard `fetch` API (`response.json()`, `response.text()`) only tracks **download** progress via `response.body.getReader()`. It does **not** natively provide an upload progress event handler out of the box (unlike `XMLHttpRequest`'s `upload.onprogress`).
* **The Solution:** To track upload progress with modern APIs, you use **`ReadableStream`** or fall back to **`XMLHttpRequest`** (or modern libraries like Axios which wrap XHR/streams).
* *Alternative approach using streams:* If your server accepts chunked transfer encoding, you can stream the file body using a custom `ReadableStream` and count the chunks as they are sent, though it requires advanced stream controller logic.

---

### Scenario 4: Automatic Retry Mechanism for Flaky Networks

**The Scenario:**
Your application occasionally makes API requests that fail due to brief network hiccups. Instead of immediately crashing or showing an error to the user, you want to automatically retry the failed `fetch` request up to 3 times before giving up.

**Question:** How would you write a reusable retry wrapper function for `fetch`?

**Answer:**
You write a recursive or loop-based helper function that catches network or 5xx server errors and retries.

```javascript
async function fetchWithRetry(url, options = {}, retries = 3, delay = 1000) {
  try {
    const response = await fetch(url, options);

    // If server returned a 5xx error, treat it as failure and retry
    if (response.status >= 500 && retries > 0) {
      throw new Error(`Server error: ${response.status}`);
    }

    return response;
  } catch (error) {
    if (retries === 0) {
      throw new Error(`Failed after maximum retries: ${error.message}`);
    }

    console.warn(`Request failed. Retrying in ${delay}ms... (${retries} attempts left)`);
    
    // Wait for the delay (exponential backoff recommended in production)
    await new Promise(resolve => setTimeout(resolve, delay));

    // Recursive call with decremented retries and increased delay
    return fetchWithRetry(url, options, retries - 1, delay * 2);
  }
}

```

A comprehensive, in-depth guide to making **all HTTP request types** using the browser's native `fetch` API covers how each method works, when to use it, and complete implementation examples using modern `async/await`.

---

## Overview of the `fetch` Options Object

Every `fetch` request follows this structural signature:

```javascript
const response = await fetch(url, {
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'HEAD' | 'OPTIONS',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer TOKEN'
  },
  body: JSON.stringify(data), // Used for POST, PUT, PATCH
  credentials: 'include',     // For sending cookies
  signal: abortController.signal // For cancellation/timeouts
});

```

---

## 1. `GET` Request (Retrieving Data)

* **Purpose:** Requests a representation of the specified resource. `GET` requests should only retrieve data and should **never** alter server state (they are "safe" and idempotent).
* **Query Parameters:** Since `GET` requests do not have a request body, parameters must be appended directly to the URL query string.

### In-Depth Example

```javascript
async function fetchUserById(userId) {
  try {
    // Construct URL with query parameters using URLSearchParams
    const url = new URL(`https://api.example.com/users`);
    url.searchParams.append('id', userId);
    url.searchParams.append('includeProfile', 'true');

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP Error! Status: ${response.status}`);
    }

    const userData = await response.json();
    return userData;
  } catch (error) {
    console.error('Failed to fetch user:', error);
  }
}

```

---

## 2. `POST` Request (Creating Resources)

* **Purpose:** Submits an entity to the specified resource, often causing a change in state or side effects on the server (e.g., creating a new user account, submitting a form, or placing an order).
* **Body:** Usually contains JSON data (`JSON.stringify()`) or `FormData`.

### In-Depth Example

```javascript
async function createUser(userData) {
  try {
    const response = await fetch('https://api.example.com/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(userData)
    });

    if (!response.ok) {
      const errorDetails = await response.json();
      throw new Error(errorDetails.message || 'Creation failed');
    }

    const newEntity = await response.json();
    return newEntity;
  } catch (error) {
    console.error('POST request failed:', error);
  }
}

// Usage:
// createUser({ name: 'Sudhir', email: 'sudhir@example.com' });

```

---

## 3. `PUT` Request (Replacing Resources)

* **Purpose:** Replaces *all* current representations of the target resource with the request payload. If the resource does not exist, some APIs will create it (upsert).
* **Difference from PATCH:** `PUT` sends the complete updated object, whereas `PATCH` sends only the changed fields.

### In-Depth Example

```javascript
async function replaceUser(userId, completeUserData) {
  try {
    const response = await fetch(`https://api.example.com/users/${userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(completeUserData)
    });

    if (!response.ok) {
      throw new Error(`PUT failed with status ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error replacing user:', error);
  }
}

```

---

## 4. `PATCH` Request (Partial Updates)

* **Purpose:** Applies partial modifications to a resource. You only send the specific fields you want to change, leaving the rest of the server record untouched.

### In-Depth Example

```javascript
async function updateEmail(userId, newEmail) {
  try {
    const response = await fetch(`https://api.example.com/users/${userId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      // Only sending the email field, not the whole user object
      body: JSON.stringify({ email: newEmail })
    });

    if (!response.ok) {
      throw new Error(`PATCH failed: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error updating user email:', error);
  }
}

```

---

## 5. `DELETE` Request (Removing Resources)

* **Purpose:** Deletes the specified resource from the server.
* **Response:** Depending on the API design, a successful `DELETE` request might return `204 No Content` (empty body) or a confirmation JSON object.

### In-Depth Example

```javascript
async function deleteUser(userId) {
  try {
    const response = await fetch(`https://api.example.com/users/${userId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': 'Bearer YOUR_TOKEN_HERE'
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to delete resource: ${response.status}`);
    }

    // Handle 204 No Content responses where body is empty
    if (response.status === 204) {
      return { success: true, message: 'Deleted successfully' };
    }

    return await response.json();
  } catch (error) {
    console.error('DELETE error:', error);
  }
}

```

---

## 6. `HEAD` Request (Metadata Inspection)

* **Purpose:** Identical to a `GET` request, but the server returns **only the HTTP headers** with **no response body**.
* **Use Cases:** Checking if a large file exists, checking its size (`Content-Length`) or last-modified date (`Last-Modified`) before committing to a full download.

### In-Depth Example

```javascript
async function checkFileSize(fileUrl) {
  try {
    const response = await fetch(fileUrl, {
      method: 'HEAD'
    });

    if (!response.ok) {
      throw new Error('Resource not accessible');
    }

    const fileSizeInBytes = response.headers.get('content-length');
    const contentType = response.headers.get('content-type');

    console.log(`File Size: ${fileSizeInBytes} bytes`);
    console.log(`Content Type: ${contentType}`);

    return { size: fileSizeInBytes, type: contentType };
  } catch (error) {
    console.error('HEAD request failed:', error);
  }
}

```

---

## 7. `OPTIONS` Request (CORS & Server Capabilities)

* **Purpose:** Used by browsers during CORS preflight checks or by clients to determine the communication options, supported methods (`Allow` header), or features available for a specific URL.

### In-Depth Example

```javascript
async function checkServerCapabilities(endpointUrl) {
  try {
    const response = await fetch(endpointUrl, {
      method: 'OPTIONS'
    });

    if (!response.ok) {
      throw new Error('OPTIONS request failed');
    }

    // Retrieve allowed methods from the server header
    const allowedMethods = response.headers.get('allow');
    console.log('Allowed HTTP Methods:', allowedMethods);

    return allowedMethods;
  } catch (error) {
    console.error('Error checking options:', error);
  }
}

```

Here are the four standard implementations for fetching data from local text and JSON files using the browser's `fetch` API, demonstrated with both **Promise `.then()**` and **`async/await`** syntax.

---

### 1. Fetch Data From Text File using Promise `.then()`

```javascript
function fetchTextWithThen() {
  fetch('./data.txt')
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.text(); // Parse response as plain text
    })
    .then(textData => {
      console.log('Text Data (Promise):', textData);
    })
    .catch(error => {
      console.error('Failed to fetch text:', error);
    });
}

// Usage:
fetchTextWithThen();

```

---

### 2. Fetch Data From Text File using Async/Await

```javascript
async function fetchTextWithAsyncAwait() {
  try {
    const response = await fetch('./data.txt');

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const textData = await response.text(); // Parse response as plain text
    console.log('Text Data (Async/Await):', textData);
    return textData;
  } catch (error) {
    console.error('Failed to fetch text:', error);
  }
}

// Usage:
fetchTextWithAsyncAwait();

```

---

### 3. Fetch Data From JSON File using Promise `.then()`

```javascript
function fetchJsonWithThen() {
  fetch('./data.json')
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json(); // Parse response directly into a JavaScript object/array
    })
    .then(jsonData => {
      console.log('JSON Data (Promise):', jsonData);
    })
    .catch(error => {
      console.error('Failed to fetch JSON:', error);
    });
}

// Usage:
fetchJsonWithThen();

```

---

### 4. Fetch Data From JSON File using Async/Await

```javascript
async function fetchJsonWithAsyncAwait() {
  try {
    const response = await fetch('./data.json');

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const jsonData = await response.json(); // Parse response directly into a JavaScript object/array
    console.log('JSON Data (Async/Await):', jsonData);
    return jsonData;
  } catch (error) {
    console.error('Failed to fetch JSON:', error);
  }
}

// Usage:
fetchJsonWithAsyncAwait();

```
