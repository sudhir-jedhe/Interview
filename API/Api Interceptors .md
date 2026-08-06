### **Interceptors in API Requests (Fetch / Axios)**

An **Interceptor** is a middleware-like mechanism that allows you to manipulate HTTP requests or responses before they are sent to the server or processed by your application. Both `Axios` and `Fetch` provide support for interceptors, although they are more commonly associated with `Axios`.

Interceptors are useful for adding functionality globally to API requests or responses, such as adding authentication tokens, logging, error handling, or modifying headers.

---

### **Interceptors in Axios**

In Axios, interceptors allow you to run custom logic before a request is sent or after a response is received. Axios provides two types of interceptors:

1. **Request Interceptor**: This allows you to modify the request before it is sent.
2. **Response Interceptor**: This allows you to modify the response before it is passed to your code.

Example of how interceptors work in Axios:

```js
// Request Interceptor
axios.interceptors.request.use(
  (config) => {
    // Modify the request before sending (e.g., add Authorization token)
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response Interceptor
axios.interceptors.response.use(
  (response) => {
    // Modify response before passing to your code (e.g., transform data)
    if (response.data) {
      // Optionally modify the response data before returning
    }
    return response;
  },
  (error) => {
    // Handle errors (e.g., show notification on 401 error)
    if (error.response && error.response.status === 401) {
      // Handle Unauthorized Access
      console.log("Unauthorized. Redirecting to login...");
    }
    return Promise.reject(error);
  },
);
```

---

### **Interceptors in Fetch**

Fetch does not have built-in support for interceptors. However, you can create custom middleware-like logic using JavaScript to achieve the same results.

You can create a wrapper around the `fetch` function to handle request and response transformations globally:

Example:

```js
// Custom Fetch Wrapper with Interceptors
function fetchWithInterceptors(url, options = {}) {
  // Modify request (e.g., add Authorization header)
  const token = localStorage.getItem("authToken");
  if (token) {
    options.headers = {
      ...options.headers,
      Authorization: `Bearer ${token}`,
    };
  }

  // Proceed with the request
  return fetch(url, options).then((response) => {
    // Handle response (e.g., transform data)
    if (response.ok) {
      return response.json();
    } else {
      // Handle errors (e.g., show notification for 401)
      if (response.status === 401) {
        console.log("Unauthorized access. Please log in again.");
      }
      return Promise.reject("Request failed");
    }
  });
}
```

---

### **Use Case Scenarios for Interceptors**

1. **Adding Authorization Headers (JWT, OAuth Tokens)**:
   - **When to use**: Add an authentication token (JWT or OAuth) to every request header to authorize API calls.
   - **Use Case**: In a secure web application, each API request to access resources should carry a valid authorization token. This is typically stored in the browser's `localStorage` or `sessionStorage`.
   - **Example**: Add a token to every API request:

     ```js
     axios.interceptors.request.use((config) => {
       const token = localStorage.getItem("authToken");
       if (token) {
         config.headers["Authorization"] = `Bearer ${token}`;
       }
       return config;
     });
     ```

2. **Handling Global Error Responses (e.g., 401 Unauthorized)**:
   - **When to use**: When you need to catch common errors (like 401 Unauthorized or 500 Internal Server Error) globally and show custom messages or actions (such as redirecting to the login page).
   - **Use Case**: If the server returns a 401 Unauthorized error (due to an expired or invalid token), you can handle it in the response interceptor to redirect the user to the login page.
   - **Example**:

     ```js
     axios.interceptors.response.use(
       (response) => response,
       (error) => {
         if (error.response && error.response.status === 401) {
           window.location.href = "/login"; // Redirect to login page
         }
         return Promise.reject(error);
       },
     );
     ```

3. **Logging API Requests and Responses for Debugging**:
   - **When to use**: When you want to log all outgoing requests and their responses for debugging or monitoring purposes.
   - **Use Case**: In a development or production environment, logging API requests and responses helps trace the sequence of network events, track errors, and monitor performance.
   - **Example**:

     ```js
     axios.interceptors.request.use((config) => {
       console.log("Request Sent:", config);
       return config;
     });

     axios.interceptors.response.use((response) => {
       console.log("Response Received:", response);
       return response;
     });
     ```

4. **Transforming API Response Data**:
   - **When to use**: Modify the API response globally before passing it to the application. This is useful when you need to transform or standardize the data received from the API.
   - **Use Case**: If the API response is structured in different ways, you can normalize or modify it consistently using a response interceptor.
   - **Example**:

     ```js
     axios.interceptors.response.use((response) => {
       // If response.data contains data in a nested structure, we can flatten or modify it
       if (response.data && response.data.result) {
         response.data = response.data.result; // Standardizing the response format
       }
       return response;
     });
     ```

5. **Handling Retrying Requests on Failure**:
   - **When to use**: Automatically retry failed API requests (e.g., retry failed requests due to network instability or server unavailability).
   - **Use Case**: In scenarios where network issues or server errors (e.g., 500 Internal Server Error) occur, you might want to retry the request before notifying the user.
   - **Example**:

     ```js
     axios.interceptors.response.use(
       (response) => response,
       (error) => {
         if (error.response.status === 500 && !error.config._retry) {
           error.config._retry = true;
           return axios(error.config); // Retry the request
         }
         return Promise.reject(error);
       },
     );
     ```

---

### **Summary of Interceptors Use Cases**

1. **Adding Authorization Token**: Automatically add an authorization token to every outgoing request to access secure endpoints.
2. **Error Handling (Global)**: Intercept common error responses (e.g., 401, 500) and handle them globally (e.g., redirect to login).
3. **Logging Requests and Responses**: Log request and response data for debugging, monitoring, or analytics.
4. **Transforming Response Data**: Normalize or modify API response data before passing it to the application (e.g., flatten nested response objects).
5. **Retrying Failed Requests**: Automatically retry failed API requests due to network or server issues before alerting the user.

By using interceptors, you can centralize the logic for requests and responses, making your API interactions more efficient and maintainable. This allows for better separation of concerns, ensuring that business logic and UI logic aren't coupled with repetitive network-related code.
