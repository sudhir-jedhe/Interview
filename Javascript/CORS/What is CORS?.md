Cross-Origin Resource Sharing (CORS) is a security feature that lets a web page from one domain request resources from a different domain:

➤ What is CORS?

CORS allows a web page to request resources (like CSS files or API data) from a different domain. For ex: if your web page is hosted on domain-A.com, it can request resources from domain-B.com.

➤ How Does CORS Work?

CORS uses HTTP headers to tell browsers whether different domains are allowed to access resources. Here are some key headers:

- Access-Control-Allow-Origin: Specifies which domains can access the response.
- Access-Control-Allow-Credentials: Indicates if the response can include credentials (like cookies).
- Access-Control-Allow-Headers: Lists which headers can be used in the request.
- Access-Control-Allow-Methods: Lists which HTTP methods (GET, POST, etc.) can be used.
- Access-Control-Expose-Headers: Lists which headers are safe to expose to the browser.
- Access-Control-Request-Headers: Used in preflight requests to list headers that will be used.
- Access-Control-Request-Method: Used in preflight requests to indicate the HTTP method that will be used.

➤ Types of CORS Requests

1. Simple Requests:

- Do not trigger a preflight check.
- Use only safelisted headers.
- Methods: GET, POST, HEAD.

1. Preflight Requests:

- Send an "OPTIONS" request before the actual request.
- The server checks if the actual request is safe to allow.
- Necessary for requests that may affect user data or make significant changes on the server.

➤ Example Flows

Simple Request:

1. Client: domain-A.com makes a GET request to domain-B.com/resource.
2. Server: domain-B.com responds with the resource and `Access-Control-Allow-Origin: domain-A.com`.
3. Browser: Checks the `Access-Control-Allow-Origin` header. If domain-A.com matches, it allows the resource to be accessed by the web page.

Preflight Request:

1. Client: domain-A.com wants to send a PUT request to domain-B.com/resource. Sends an OPTIONS request first.
2. Server: domain-B.com responds to OPTIONS request with `Access-Control-Allow-Methods: PUT` and `Access-Control-Allow-Headers: Content-Type`.
3. Client: Sends the actual PUT request if allowed.
4. Server: Responds to the PUT request and includes `Access-Control-Allow-Origin: domain-A.com`.
5. Browser: Checks the `Access-Control-Allow-Origin` header. If domain-A.com matches, it allows the resource to be accessed by the web page.

By setting up CORS correctly, your web pages can safely request resources from other domains, keeping your web applications secure.

![alt text](image-2.png)
