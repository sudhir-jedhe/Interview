HTTP status codes are standardized responses sent by a server to a client (such as a browser or API client) to indicate the result of the request. Each status code is a three-digit number, where:

- The first digit indicates the **category** of the response.
- The second and third digits provide **more specific information** about the response.

HTTP status codes are grouped into five categories:

### 1. **1xx: Informational**

These status codes indicate that the request has been received and is being processed, but no response is available yet.

#### **100 Continue**

- **Purpose**: The server has received the request headers and the client should proceed to send the request body.
- **Common Use**: Used in situations where the client is sending a large amount of data, and the server wants to confirm that the request is valid before the client sends the data (e.g., in a POST request).

#### **101 Switching Protocols**

- **Purpose**: The server is switching protocols as requested by the client (e.g., upgrading from HTTP/1.1 to HTTP/2).
- **Common Use**: When a client requests to switch to a different protocol, such as WebSockets.

---

### 2. **2xx: Successful**

These status codes indicate that the client's request was successfully received, understood, and accepted by the server.

#### **200 OK**

- **Purpose**: The request was successful, and the server has sent the requested data.
- **Common Use**: This is the standard status code for a successful GET or POST request.

#### **201 Created**

- **Purpose**: The request was successful, and as a result, a new resource was created.
- **Common Use**: Typically used for POST requests, where a new resource (like a user or product) is created on the server.

#### **202 Accepted**

- **Purpose**: The request has been accepted for processing, but the processing has not been completed.
- **Common Use**: This is used in scenarios where the server will process the request asynchronously (e.g., in the case of background tasks).

#### **204 No Content**

- **Purpose**: The request was successful, but there is no content to return.
- **Common Use**: Typically used in DELETE requests or other actions where the request was successful but the server has no content to send back (e.g., after deleting a resource).

#### **205 Reset Content**

- **Purpose**: The server has processed the request, but the client should reset the view (usually in form submissions).
- **Common Use**: This is used when a form has been submitted successfully and the client should reset the form.

#### **206 Partial Content**

- **Purpose**: The server is delivering part of the resource as requested by the client.
- **Common Use**: Used in situations where the client requests only a portion of a resource (e.g., for downloading large files in chunks).

---

### 3. **3xx: Redirection**

These status codes indicate that further action is required by the client to fulfill the request, typically involving URL redirection.

#### **300 Multiple Choices**

- **Purpose**: The server offers multiple options for the resource that the client may choose from.
- **Common Use**: Rarely used, but it can be seen in some cases where multiple resources can fulfill the request.

#### **301 Moved Permanently**

- **Purpose**: The resource has been permanently moved to a new URL, and future requests should use the new URL.
- **Common Use**: Commonly used for permanent redirects (e.g., when a page has been moved to a new domain or URL).

#### **302 Found (Previously Moved Temporarily)**

- **Purpose**: The resource has been temporarily moved to a different URL, and the client should continue to use the original URL for future requests.
- **Common Use**: Commonly used for temporary redirects, such as during maintenance or A/B testing.

#### **303 See Other**

- **Purpose**: The client should perform a GET request to another URL, usually in response to a POST or PUT request.
- **Common Use**: Often used after form submissions to redirect the client to a confirmation page.

#### **304 Not Modified**

- **Purpose**: The resource has not been modified since the last request, so the client can use the cached version.
- **Common Use**: Used in cache control. The client sends a conditional request using `If-Modified-Since` or `If-None-Match` headers, and if the resource hasn’t changed, this code is returned.

#### **305 Use Proxy**

- **Purpose**: The requested resource must be accessed through a proxy.
- **Common Use**: This is now deprecated and not used in modern browsers.

#### **307 Temporary Redirect**

- **Purpose**: The resource is temporarily located at a different URL, and the client should use the new URL for the current request, but future requests should still use the original URL.
- **Common Use**: Used when temporary redirection is needed.

#### **308 Permanent Redirect**

- **Purpose**: The resource has permanently moved to a different URL, and the client should use the new URL for future requests.
- **Common Use**: Similar to `301`, but this code ensures the method used in the original request (e.g., POST) is preserved when redirected.

---

### 4. **4xx: Client Errors**

These status codes indicate that the client has made an error in their request.

#### **400 Bad Request**

- **Purpose**: The server could not understand the request due to invalid syntax or parameters.
- **Common Use**: Often used when the client sends malformed JSON or an invalid query string.

#### **401 Unauthorized**

- **Purpose**: The request lacks proper authentication credentials, or the credentials provided are invalid.
- **Common Use**: Used when an API or web page requires authentication, and the user hasn’t provided valid credentials.

#### **402 Payment Required**

- **Purpose**: Reserved for future use, but it was intended to be used for digital payments.
- **Common Use**: Not currently used by many APIs, but it was originally planned for situations involving payment.

#### **403 Forbidden**

- **Purpose**: The server understands the request, but the client does not have permission to access the resource.
- **Common Use**: Often returned when a user tries to access a resource that they do not have permission for (e.g., trying to access an admin page without being an admin).

#### **404 Not Found**

- **Purpose**: The requested resource could not be found on the server.
- **Common Use**: One of the most common error codes; typically returned when the client requests a non-existent resource.

#### **405 Method Not Allowed**

- **Purpose**: The HTTP method used (GET, POST, PUT, DELETE, etc.) is not supported for the requested resource.
- **Common Use**: Returned when the client sends an invalid HTTP method for a specific endpoint (e.g., using `GET` on a POST-only endpoint).

#### **406 Not Acceptable**

- **Purpose**: The server cannot produce a response that matches the client’s specified `Accept` headers.
- **Common Use**: Used when the server cannot provide the requested data format (e.g., the client expects XML, but the server only provides JSON).

#### **407 Proxy Authentication Required**

- **Purpose**: The client must authenticate with a proxy server before making the request.
- **Common Use**: Typically seen in corporate environments where API requests must go through a proxy.

#### **408 Request Timeout**

- **Purpose**: The server did not receive a complete request from the client in a timely manner.
- **Common Use**: Occurs when a client takes too long to send the request, or the server is overloaded.

#### **409 Conflict**

- **Purpose**: The request could not be processed because of a conflict with the current state of the resource.
- **Common Use**: Often used in REST APIs during operations like updates, where the resource has been modified since it was last fetched (e.g., concurrent updates).

#### **410 Gone**

- **Purpose**: The resource requested is no longer available and has been permanently removed.
- **Common Use**: Indicates that a resource is no longer available, and will never be available again (e.g., a deprecated API endpoint).

#### **411 Length Required**

- **Purpose**: The server requires the `Content-Length` header to be specified for the request.
- **Common Use**: This occurs when a POST request is made without providing the `Content-Length` header.

#### **412 Precondition Failed**

- **Purpose**: A condition set by the client in headers like `If-None-Match` or `If-Modified-Since` has failed.
- **Common Use**: Used in conditional requests, indicating the condition specified (such as the resource not being modified) is not true.

#### **413 Payload Too Large**

- **Purpose**: The request entity is larger than the server is willing or able to process.
- **Common Use**: Typically used when uploading large files or data that exceeds the server's limits.

#### **414 URI Too Long**

- **Purpose**: The URI provided in the request is too long for the server to process.
- **Common Use**: Occurs when a URL exceeds the maximum allowed length.

#### **415 Unsupported Media Type**

- **Purpose**: The server does not support the media type of the request payload.
- **Common Use**: Typically used when an API expects JSON but the client sends XML.

#### **416 Range Not Satisfiable**

- **Purpose**: The server cannot fulfill the range requested by the client in a `Range` header.
- **Common Use**: When partial content requests are made, and the range is not valid.

#### **417 Expectation Failed**

- **Purpose**: The server cannot meet the requirements of the `Expect` header.
- **Common Use**: Rarely used, but could occur when the server fails to handle certain expectations set by the client.

---

### 5. **5xx: Server Errors**

These status codes indicate that the server failed to fulfill a valid request.

#### **500 Internal Server Error**

- **Purpose**: The server encountered an unexpected condition that prevented it from fulfilling the request.
- **Common Use**: A generic error indicating a problem on the server-side.

#### **501 Not Implemented**

- **Purpose**: The server does not support the functionality required to fulfill the request.
- **Common Use**: Returned when the server cannot process the HTTP method or functionality the client is requesting (e.g., the server doesn’t support PUT requests).

#### **502 Bad Gateway**

- **Purpose**: The server, while acting as a gateway or proxy, received an invalid response from the upstream server.
- **Common Use**: Indicates issues in communication between proxy servers.

#### **503 Service Unavailable**

- **Purpose**: The server is currently unable to handle the request due to temporary overloading or maintenance.
- **Common Use**: Commonly used for situations like server maintenance or high traffic.

#### **504 Gateway Timeout**

- **Purpose**: The server, acting as a gateway or proxy, did not receive a timely response from the upstream server.
- **Common Use**: This occurs when there are network issues or a server taking too long to respond.

#### **505 HTTP Version Not Supported**

- **Purpose**: The server does not support the HTTP version used in the request.
- **Common Use**: Occurs if the client uses a version of HTTP that is not supported by the server (e.g., HTTP/1.1 on a server that only supports HTTP/2).

---

### Conclusion

Each HTTP status code provides useful information to both the client and server. Understanding the meaning of these codes helps developers handle errors, manage redirects, and optimize API communication effectively. The codes are essential for the design and management of RESTful APIs, ensuring smooth interaction and efficient troubleshooting.

Below are examples of how to handle and use various HTTP status codes in both **React** (frontend) and **Node.js** (backend).

### 1. **200 OK**

#### Node.js (Express)

```javascript
// Responding with 200 OK in Node.js (Express)
app.get("/api/data", (req, res) => {
  res.status(200).json({ message: "Request was successful", data: [1, 2, 3] });
});
```

#### React (Frontend)

```javascript
// Fetching data from the backend and handling the 200 OK response in React
import { useEffect, useState } from "react";

function App() {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("http://localhost:5000/api/data")
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        } else {
          throw new Error("Something went wrong!");
        }
      })
      .then((data) => setData(data))
      .catch((error) => setError(error.message));
  }, []);

  return (
    <div>
      <h1>Data</h1>
      {error ? <p>{error}</p> : <pre>{JSON.stringify(data, null, 2)}</pre>}
    </div>
  );
}

export default App;
```

---

### 2. **201 Created**

#### Node.js (Express)

```javascript
// Responding with 201 Created in Node.js (Express)
app.post("/api/resource", (req, res) => {
  const newResource = req.body; // Assume body-parser middleware is used
  // Simulate resource creation
  res
    .status(201)
    .json({ message: "Resource created successfully", data: newResource });
});
```

#### React (Frontend)

```javascript
// Sending a POST request and handling the 201 Created response in React
import { useState } from "react";

function App() {
  const [newResource, setNewResource] = useState("");
  const [responseMessage, setResponseMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/api/resource", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newResource }),
      });

      if (response.status === 201) {
        const result = await response.json();
        setResponseMessage(result.message);
      } else {
        setResponseMessage("Failed to create resource");
      }
    } catch (error) {
      setResponseMessage("Error: " + error.message);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={newResource}
          onChange={(e) => setNewResource(e.target.value)}
        />
        <button type="submit">Create Resource</button>
      </form>
      <p>{responseMessage}</p>
    </div>
  );
}

export default App;
```

---

### 3. **400 Bad Request**

#### Node.js (Express)

```javascript
// Responding with 400 Bad Request in Node.js (Express)
app.post("/api/data", (req, res) => {
  const { name } = req.body;
  if (!name) {
    return res.status(400).json({ message: "Name is required" });
  }
  // Simulate processing
  res.status(200).json({ message: "Data processed successfully", name });
});
```

#### React (Frontend)

```javascript
// Handling 400 Bad Request in React
import { useState } from "react";

function App() {
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/api/data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });

      if (response.status === 400) {
        const result = await response.json();
        setError(result.message);
      } else {
        setError("");
        // Handle successful response
      }
    } catch (error) {
      setError("An error occurred: " + error.message);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button type="submit">Submit</button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}

export default App;
```

---

### 4. **401 Unauthorized**

#### Node.js (Express)

```javascript
// Responding with 401 Unauthorized in Node.js (Express)
app.get("/api/secure-data", (req, res) => {
  const token = req.headers["authorization"];

  if (!token || token !== "valid-token") {
    return res.status(401).json({ message: "Unauthorized" });
  }

  res.status(200).json({ message: "Authorized data" });
});
```

#### React (Frontend)

```javascript
// Handling 401 Unauthorized in React
import { useEffect, useState } from "react";

function App() {
  const [data, setData] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/api/secure-data", {
      method: "GET",
      headers: { Authorization: "invalid-token" },
    })
      .then((response) => {
        if (response.status === 401) {
          throw new Error("Unauthorized access");
        }
        return response.json();
      })
      .then((result) => setData(result.message))
      .catch((err) => setError(err.message));
  }, []);

  return <div>{error ? <p>{error}</p> : <p>{data}</p>}</div>;
}

export default App;
```

---

### 5. **404 Not Found**

#### Node.js (Express)

```javascript
// Responding with 404 Not Found in Node.js (Express)
app.get("/api/nonexistent", (req, res) => {
  res.status(404).json({ message: "Resource not found" });
});
```

#### React (Frontend)

```javascript
// Handling 404 Not Found in React
import { useEffect, useState } from "react";

function App() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/api/nonexistent")
      .then((response) => {
        if (response.status === 404) {
          throw new Error("Resource not found");
        }
        return response.json();
      })
      .then((data) => setMessage("Data: " + JSON.stringify(data)))
      .catch((error) => setMessage(error.message));
  }, []);

  return (
    <div>
      <h1>{message}</h1>
    </div>
  );
}

export default App;
```

---

### 6. **500 Internal Server Error**

#### Node.js (Express)

```javascript
// Responding with 500 Internal Server Error in Node.js (Express)
app.get("/api/error", (req, res) => {
  try {
    // Simulate an internal server error
    throw new Error("Internal server error");
  } catch (err) {
    res.status(500).json({ message: "Something went wrong on the server" });
  }
});
```

#### React (Frontend)

```javascript
// Handling 500 Internal Server Error in React
import { useEffect, useState } from "react";

function App() {
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/api/error")
      .then((response) => {
        if (response.status === 500) {
          throw new Error("Server error occurred");
        }
        return response.json();
      })
      .catch((error) => setError(error.message));
  }, []);

  return <div>{error ? <p>{error}</p> : <p>No errors occurred</p>}</div>;
}

export default App;
```

---

### 7. **503 Service Unavailable**

#### Node.js (Express)

```javascript
// Responding with 503 Service Unavailable in Node.js (Express)
app.get("/api/maintenance", (req, res) => {
  res
    .status(503)
    .json({ message: "Service is temporarily unavailable due to maintenance" });
});
```

#### React (Frontend)

```javascript
// Handling 503 Service Unavailable in React
import { useEffect, useState } from "react";

function App() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/api/maintenance")
      .then((response) => {
        if (response.status === 503) {
          throw new Error("Service is unavailable due to maintenance");
        }
        return response.json();
      })
      .catch((error) => setMessage(error.message));
  }, []);

  return (
    <div>
      <h1>{message}</h1>
    </div>
  );
}

export default App;
```

---

### Conclusion

These examples show how you

can use various HTTP status codes in both **Node.js** (for API responses) and **React** (to handle responses on the frontend). The status codes represent different scenarios, from successful requests (`200 OK`, `201 Created`) to errors (`400 Bad Request`, `404 Not Found`, `500 Internal Server Error`). Handling these correctly in your application ensures better user experience and easier debugging.
