Here's how you can make an asynchronous `XMLHttpRequest` (XHR) to get data from the server and handle both success and failure using callbacks:

```javascript
// Create a new XMLHttpRequest object
const xhr = new XMLHttpRequest();

// Specify the HTTP method ('GET' in this case) and the URL to which the request is sent
const url = 'https://jsonplaceholder.typicode.com/posts'; // Example API

xhr.open('GET', url);

// Define the callback function to handle the success (onload) event
xhr.onload = function() {
  if (xhr.status >= 200 && xhr.status < 300) {
    // Success: handle the response (in this case, it's a JSON response)
    const data = JSON.parse(xhr.responseText); // Assuming the server responds with JSON
    console.log('Response:', data);
  } else {
    // Failure: handle different HTTP status codes
    console.log('Error: Failed to fetch data. Status code:', xhr.status);
  }
};

// Define the callback function to handle the error (onerror) event
xhr.onerror = function() {
  // Error occurred during the request
  console.log('Request failed:', xhr.statusText);
};

// Send the request to the server
xhr.send();
```

### Explanation:
1. **Creating the XHR Object**: 
   - `const xhr = new XMLHttpRequest();` creates a new instance of the `XMLHttpRequest` object.
   
2. **Opening the Request**:
   - `xhr.open('GET', url);` prepares the request. In this case, we use the GET method to retrieve data from the server.
   
3. **Setting up the Success Callback (`onload`)**:
   - `xhr.onload = function() {...};` defines the function to be called when the request completes successfully.
   - We check the status code (`xhr.status`) to ensure the request was successful (status code 200-299 indicates success).
   - `xhr.responseText` contains the raw response data from the server, which we parse if it's JSON (`JSON.parse(xhr.responseText)`).
   
4. **Setting up the Error Callback (`onerror`)**:
   - `xhr.onerror = function() {...};` defines the function to be called if there is a network error or the request fails (e.g., server is down, timeout).
   
5. **Sending the Request**:
   - `xhr.send();` sends the actual HTTP request to the server.

### Example Output:
If the server responds with data, you'll see something like:
```javascript
Response: [ { "userId": 1, "id": 1, "title": "Title 1", "body": "Body 1" }, ... ]
```

If there's an error (e.g., network failure or invalid URL), the `onerror` function will log something like:
```javascript
Request failed: Not Found
```

This is a basic implementation of making an asynchronous HTTP request using the `XMLHttpRequest` object.