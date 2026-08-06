### HTTP Status Codes Cheat Sheet with Detailed Descriptions

#### **1xx - Informational**
- **100: Continue**
  - The client should continue with the request. This interim response indicates that everything is OK so far, and the client can proceed with the request or ignore if it's already complete.

- **102: Processing**
  - The server has received and is processing the request, but no response is available yet. This status prevents the client from timing out when waiting for a response.

---

#### **2xx - Success**
- **200: OK**
  - The request has succeeded. The response depends on the method used (e.g., GET will return the requested resource, POST will return the result of the action).

- **201: Created**
  - The request has been fulfilled, and a new resource has been created. The server should include the URL of the created resource in the `Location` header.

---

#### **3xx - Redirection**
- **301: Moved Permanently**
  - The requested resource has been assigned a new permanent URI. Any future references to this resource should use one of the returned URIs.

- **302: Found (Moved Temporarily)**
  - The requested resource resides temporarily under a different URI. The client should use the same method to access the URI as used in the original request.

---

#### **4xx - Client Error**
- **400: Bad Request**
  - The server cannot understand or process the request due to invalid syntax, missing parameters, or other client-side issues.

- **401: Unauthorized**
  - The client must authenticate itself to get the requested response. Typically returned when authentication credentials are missing or invalid.

- **403: Forbidden**
  - The server understands the request but refuses to authorize it. This status is often returned when permissions are insufficient.

- **404: Not Found**
  - The server cannot find the requested resource. This could be because the resource doesn't exist or the endpoint is incorrect.

- **410: Gone**
  - The requested resource is no longer available and will not be available again. This status is used when resources have been intentionally removed and no forwarding address is provided.

---

#### **5xx - Server Error**
- **500: Internal Server Error**
  - A generic error message when the server encounters a situation it doesn't know how to handle. This indicates an issue with the server.

- **502: Bad Gateway**
  - The server, acting as a gateway or proxy, received an invalid response from an upstream server.

- **503: Service Unavailable**
  - The server is temporarily unable to handle the request. This could be due to server overload or maintenance. Retry after a specified delay, if given.

- **504: Gateway Timeout**
  - The server, acting as a gateway or proxy, did not receive a timely response from an upstream server. This typically indicates network or server issues on the backend.

---

### Additional Notes
- **Caching with Redirects (3xx):** Some clients may cache redirection responses. Use `Cache-Control` or similar headers to control this behavior.
- **Authentication-Related Errors (4xx):** `401 Unauthorized` specifically indicates missing/invalid credentials, whereas `403 Forbidden` suggests valid credentials but insufficient permissions.
- **5xx Errors and Retry:** Often accompanied by `Retry-After` headers, allowing clients to understand when to retry the request.



Below is a comprehensive **JavaScript implementation** of handling all the HTTP status codes with corresponding explanations and actions. This includes a `handleHttpStatus` function that takes a status code as input and performs relevant actions for each status. This is followed by a fixed implementation for retry mechanisms for `5xx` status codes and specific handling of `4xx` errors.

### **Code Implementation**

```javascript
/**
 * Handle HTTP Status Codes
 * @param {number} statusCode - HTTP status code to handle
 * @param {object} options - Additional options (e.g., retry config, logging)
 */
function handleHttpStatus(statusCode, options = {}) {
  switch (true) {
    // 1xx - Informational
    case statusCode === 100:
      console.log("100: Continue - Proceed with the request.");
      break;
    case statusCode === 102:
      console.log("102: Processing - Request is being processed.");
      break;

    // 2xx - Success
    case statusCode === 200:
      console.log("200: OK - Request succeeded.");
      break;
    case statusCode === 201:
      console.log("201: Created - New resource created.");
      break;

    // 3xx - Redirection
    case statusCode === 301:
      console.log("301: Moved Permanently - Update resource URL.");
      break;
    case statusCode === 302:
      console.log("302: Found - Resource temporarily moved.");
      break;

    // 4xx - Client Errors
    case statusCode === 400:
      console.error("400: Bad Request - Check request syntax and parameters.");
      break;
    case statusCode === 401:
      console.error("401: Unauthorized - Authentication required.");
      break;
    case statusCode === 403:
      console.error("403: Forbidden - Insufficient permissions.");
      break;
    case statusCode === 404:
      console.error("404: Not Found - Verify resource URL.");
      break;
    case statusCode === 410:
      console.error("410: Gone - Resource permanently removed.");
      break;

    // 5xx - Server Errors
    case statusCode === 500:
      console.error("500: Internal Server Error - Retry later.");
      retryRequest(options);
      break;
    case statusCode === 502:
      console.error("502: Bad Gateway - Check upstream server.");
      retryRequest(options);
      break;
    case statusCode === 503:
      console.error("503: Service Unavailable - Server overloaded, retrying.");
      retryRequest(options);
      break;
    case statusCode === 504:
      console.error("504: Gateway Timeout - Upstream server unresponsive.");
      retryRequest(options);
      break;

    default:
      console.warn(`Unhandled status code: ${statusCode}`);
  }
}

/**
 * Retry logic for 5xx errors
 * @param {object} options - Retry configuration
 * @param {number} options.retries - Max retries
 * @param {number} options.delay - Delay between retries (ms)
 */
async function retryRequest({ retries = 3, delay = 1000 } = {}) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    console.log(`Retrying request... Attempt ${attempt}/${retries}`);
    await new Promise((resolve) => setTimeout(resolve, delay));
    // Simulate retry request logic here (e.g., re-fetching data)
    const success = simulateRequest(); // Replace with actual request logic
    if (success) {
      console.log("Request succeeded after retry.");
      return;
    }
  }
  console.error("All retry attempts failed.");
}

/**
 * Simulates a retryable request (for demonstration purposes).
 * Replace this with actual request logic (e.g., fetch or axios call).
 */
function simulateRequest() {
  return Math.random() > 0.5; // Random success/failure
}

/**
 * Example Usage
 */
function main() {
  const statusCodes = [100, 200, 301, 400, 401, 500, 502, 503];
  statusCodes.forEach((code) => {
    handleHttpStatus(code, { retries: 3, delay: 1000 });
  });
}

main();
```

---

### **Key Features of the Code**
1. **Flexible Status Code Handling:**
   - Comprehensive switch case for each status code group (1xx, 2xx, 3xx, 4xx, 5xx).
   - Logs appropriate messages and executes actions for each status.

2. **Retry Logic for 5xx Status Codes:**
   - Configurable retry mechanism with options for retries and delays.
   - Simulates retries using a `simulateRequest` function that can be replaced with real-world request logic.

3. **Dynamic Error Handling:**
   - Clear error messages and suggested actions for `4xx` errors.
   - Retry mechanism for transient errors (`5xx`) to improve resiliency.

4. **Scalable Design:**
   - Easily extendable to handle additional status codes or custom logic.
   - Retry logic encapsulated in a reusable function.

5. **Clear Separation of Concerns:**
   - Separate functions for handling statuses, retrying requests, and simulating behavior.

This implementation ensures robust handling of HTTP status codes and provides a retry mechanism for transient failures, reducing the chance of service disruption.