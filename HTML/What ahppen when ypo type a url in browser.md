**When you type a URL into a browser**, a series of steps occur behind the scenes to retrieve and display the web page. Here is a breakdown of the process:

**1. Browser Parsing the URL**
When you type a URL (Uniform Resource Locator) into the browser's address bar, the browser first parses the URL to determine various components:

`Scheme (Protocol):` This is the protocol used to access the resource, such as http://, https://, ftp://.
`Domain Name:` This refers to the website’s address, like google.com, example.com.
`Path:` This is the specific resource on the server, such as /index.html, /about, etc.
`Query Parameters (optional):` These are added after the ? symbol, like ?id=123.
`Fragment Identifier (optional):` The # symbol identifies a specific part of a page, like #section.
Example: https://www.example.com/path/to/resource?id=123#section

**2. DNS Lookup**
`What is DNS?:` DNS (Domain Name System) is like the phonebook of the internet. It converts the human-readable domain name (e.g., www.example.com) into an IP address (e.g., 192.168.1.1) that identifies the server hosting the website.

`How does DNS work?:`
The browser checks if the IP address for the domain is already cached locally (in the browser or operating system).

If it’s not cached, the browser sends a DNS query to a DNS resolver (usually provided by your ISP or a third-party service like Google DNS).

The resolver queries the authoritative DNS server for the domain to get the IP address.

The IP address is returned, and the browser can now communicate with the server.

**3. Establishing a TCP Connection**
Once the IP address is resolved, the browser establishes a connection to the web server using the Transmission Control Protocol (TCP):

The browser initiates a connection to the server via TCP three-way handshake:
`SYN (Synchronize): `The browser sends a request to the server to initiate a connection.
`SYN-ACK (Synchronize-Acknowledge):` The server acknowledges the request and prepares for the connection.
`ACK (Acknowledge):` The browser acknowledges the server’s response, and the connection is established.

If the URL uses HTTPS (secure connection), the browser will also perform a TLS/SSL handshake to encrypt the data sent between the client (browser) and the server.

**4. Sending an HTTP Request**
After the connection is established, the browser sends an HTTP request to the web server for the specified resource (e.g., the HTML page).
Example of a typical HTTP request:

```js
GET /path/to/resource?id=123 HTTP/1.1
Host: www.example.com
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8
Connection: keep-alive
```

GET: The HTTP method used to request data from the server (other methods include POST, PUT, DELETE, etc.).

The request contains various headers with metadata (such as browser type, supported content types, cookies, etc.).
`1. Server Processing and HTTP Response`
The web server receives the HTTP request and processes it. If the requested resource exists and is accessible, the server sends an HTTP response back to the browser.
Example of an HTTP response:

```js
HTTP/1.1 200 OK
Content-Type: text/html; charset=UTF-8
Content-Length: 1234
Date: Mon, 18 Dec 2024 14:23:00 GMT
```

```js
<html>
  <head>
    <title>Example Page</title>
  </head>
  <body>
    <h1>Welcome to Example.com</h1>
    <p>This is the home page.</p>
  </body>
</html>
```

The response includes:
`Status code: 200 OK` (successful request). Other codes could be 404 (Not Found), 500 (Internal Server Error), etc.
`Headers:` These provide additional information, such as content type and length.
`Body:` This contains the content of the page (HTML, CSS, JavaScript, images, etc.).

**6. Browser Rendering the Content**
Once the HTTP response is received:

`Parsing HTML: `The browser parses the HTML document into a DOM (Document Object Model). The DOM represents the page structure.
`CSS Parsing:` The browser loads and parses any linked CSS files and applies styles to the elements in the DOM.
`JavaScript Execution:` The browser loads and executes JavaScript. If there are any JavaScript files referenced in the page (e.g., <script src="app.js"></script>), they are fetched and executed.
`Building the Render Tree:` The browser creates a render tree using the DOM and CSS. This tree represents how the content should be visually rendered on the screen.
`Layout: `The browser calculates the layout, determining the size and position of each element on the page.
`Painting: `The browser paints the elements onto the screen, rendering the final visual representation of the page.

**7. Additional Network Requests (e.g., Images, CSS, JS Files)**
While the initial HTML is being rendered, the browser may initiate additional HTTP requests to fetch resources such as:

- Images (`<img>`)
- External CSS files (`<link rel="stylesheet">`)
- JavaScript files (`<script src="...">`)
- Fonts and other assets
  These resources are fetched, parsed, and rendered in sequence to complete the page.

**8. Displaying the Web Page**
After all resources are loaded and rendered, the web page appears on your browser.

**Summary of Steps**
`Parse URL:` The browser breaks down the URL into its components.
`DNS Lookup:` Resolves the domain name to an IP address.
`TCP Connection:` Establishes a TCP connection to the server.
`HTTP Request:` Sends an HTTP request to the server for the resource.
`Server Response:` The server sends back the requested resource.
`Render Content:` The browser processes the response (HTML, CSS, JS) and renders the page.
`Additional Requests:` Fetches any additional resources (images, CSS, JS) and renders them.
`Page Displayed:` The page is now visible in the browser.

This process happens quickly (often within milliseconds) so that users can experience seamless browsing.

## **Critical Rendering Path (CRP)**

The`Critical Rendering Path (CRP)`refers to the sequence of steps that a browser follows to render a web page. Understanding the CRP helps optimize a webpage's load time, as it focuses on rendering only the critical resources necessary for displaying the page.

**Critical Rendering Path: Step-by-Step Overview**
The browser follows a specific sequence of steps to display a webpage. This process includes downloading resources, parsing, and rendering, and it happens in an optimized order to minimize the time it takes to show the content to the user. Let's break down the critical rendering path into key stages:

**1. Browser Receives the Request**
When a user enters a URL in the browser’s address bar, the following happens:

`DNS Lookup:` The browser resolves the domain name into an IP address using DNS (Domain Name System).
`TCP Connection:` The browser establishes a TCP connection with the server, and if it's an HTTPS request, a TLS handshake is performed for encryption.
`HTTP Request:` The browser sends an HTTP request to fetch the HTML document (along with other resources like CSS, JavaScript, images, etc.).

**2. HTML Parsing (DOM Construction)**
Once the browser receives the HTML response, it starts parsing the document and building the DOM (Document Object Model):

The DOM represents the structure of the page (a tree of nodes, each representing an HTML element).

Parsing is done incrementally as the browser processes the HTML document, and the DOM tree is built in parallel with other processes.
Critical aspect of DOM construction:

As the HTML is parsed, the browser might encounter inline CSS and inline JavaScript that could block rendering.
Blocking resources (e.g., `<link>, <script>`) can delay the DOM construction if they are fetched after the HTML is received.

**3. CSS Parsing (CSSOM Construction)**
Next, the browser parses the CSS files and constructs the CSSOM (CSS Object Model):

The browser fetches any external CSS files referenced in the HTML` <link>` tags or inline `<style>` tags.
Like the DOM, the CSSOM is built incrementally and is combined with the DOM later in the process.
Critical aspect of CSSOM construction:

The CSSOM defines how each HTML element should be styled. Parsing CSS styles is crucial for correctly rendering the page, but if CSS is blocked or delayed, the page might render without styles or show unstyled content.

**4. JavaScript Execution (Blocking or Non-Blocking)**
JavaScript is critical in the rendering process, but its execution can block or delay rendering. The browser handles JavaScript in two main ways:

`Blocking JavaScript:` If the `<script>` tag is placed in the `<head>` or the HTML has inline scripts before the closing `</body>` tag, the browser will stop parsing HTML and CSS until the script is downloaded, parsed, and executed. This can delay rendering.

`Non-blocking JavaScript:` Scripts with the async or defer attributes do not block HTML parsing:
**async**: The script is downloaded asynchronously and executed as soon as it’s ready, potentially blocking rendering.
**defer**: The script is downloaded asynchronously, but it’s executed only after the document is fully parsed, preventing render-blocking.

Critical aspect of JavaScript execution:

Scripts that manipulate the DOM or CSSOM need to run before those resources are used to render the page, but blocking scripts delay the entire rendering process.

**5. Render Tree Construction**
Once the browser has parsed both the DOM and the CSSOM, it combines these two structures to create the render tree:

The render tree represents how each node should be displayed (taking both the structure and styles into account).
Not all DOM elements are included in the render tree. For example, elements like `<script>` or `<meta>` tags are excluded since they don’t need to be rendered.
Critical aspect of render tree:

This is a key step because it determines how the page will be displayed. Any issues in this step can result in incomplete or broken renderings (e.g., missing images or unstyled elements).

**6. Layout (Reflow)**
Layout is the process of calculating the exact position and size of each visible element in the render tree:

The browser goes through each element in the render tree and calculates its position and size based on the CSS rules (such as width, height, margin, etc.).
This process is called reflow, and it can be triggered when the content changes (e.g., when elements are added or resized).
Critical aspect of layout:

The layout process is expensive in terms of performance, especially if it needs to be recalculated frequently. Minimizing unnecessary layout recalculations is key to improving rendering speed.

**7. Painting**
Once the layout is determined, the browser paints the visual content:

Each element in the render tree is painted with the corresponding styles (such as color, borders, shadows, and text).
The browser breaks the page into smaller paint layers, and each layer is painted separately.
Critical aspect of painting:

This is where the visual representation of the page starts coming together, and it’s where the browser applies any styling to the elements.

**8. Compositing**
Compositing is the final step in the rendering process:

The painted layers are combined into a final image that is displayed on the screen.
The browser uses the compositing process to manage layers that may change independently (such as animations, scrolling, or video elements).
Critical aspect of compositing:

If the page has complex elements (e.g., overlapping layers, animations), compositing can take more time, which can delay the page from being fully rendered.

**9. Display the Page**
After the final image is composed, the browser renders the page on the screen. The user can now see and interact with the webpage.

### **Optimizing the Critical Rendering Path**

To optimize the CRP and improve page load performance, the following best practices are often used:

- `Minimize Critical Resources:` Only include the most necessary resources (HTML, CSS, JS) during the initial page load.

- `Prioritize Above-the-Fold Content:` Load and render the content that is visible above the fold first. This allows the user to start interacting with the page quickly.

- `Defer Non-Critical JavaScript:` Use async or defer attributes on `<script>` tags to prevent blocking the rendering of the page.

- `Load CSS Early:` Place CSS `<link>` tags in the `<head>` to ensure the page is styled before it's displayed.
- `Minimize Render-Blocking Resources`: Avoid inline CSS or JavaScript that could block the rendering process. Use tools like Preload and Prefetch to prioritize the loading of critical resources.
- `Lazy Load Non-Essential Resources`: Use lazy loading for images or other media content that are not immediately needed, especially if they are below the fold.
- Summary of the Critical Rendering Path
  Step Action

1. DNS Lookup Resolves the domain name into an IP address.
2. TCP Connection Establishes a connection to the server (and performs TLS handshake if using HTTPS).
3. HTML Parsing (DOM) Parses the HTML document and builds the DOM tree.
4. CSS Parsing (CSSOM) Parses external or internal CSS files and builds the CSSOM.
5. JavaScript Execution Executes JavaScript, which can block or delay rendering if not handled asynchronously.
6. Render Tree Construction Combines the DOM and CSSOM into the render tree, representing the visual structure of the page.
7. Layout Calculates the exact positions and sizes of elements in the render tree (reflow).
8. Painting Applies styles to the elements in the render tree, such as color, borders, and shadows.
9. Compositing Combines painted layers into the final display, making the page visible to the user.
10. Page Displayed The browser renders and displays the page on the screen.
    By optimizing these steps, web developers can improve the performance of web pages, reduce load times, and enhance user experience.

Here is a detailed, step-by-step breakdown of what happens under the hood when you type a URL (like `[https://www.google.com](https://www.google.com)`) into your browser and press **Enter**:

---

## 1. URL Parsing & HSTS Check

- **URL Parsing:** The browser breaks down the typed string into distinct parts:
- **Protocol:** `https://`
- **Domain Name:** `[www.google.com](https://www.google.com)`
- **Port:** Default is `443` for HTTPS (`80` for HTTP)
- **Path/Query:** `/` (or `/search?q=...`)

- **HSTS Check:** The browser checks its **HSTS (HTTP Strict Transport Security)** list to see if the site requires an encrypted HTTPS connection, automatically redirecting any HTTP request to HTTPS locally.

---

## 2. DNS Lookup (Translating Domain to IP Address)

Computers communicate using IP addresses (like `142.250.190.46`), not human-readable domain names. The browser resolves the domain through a hierarchy of caches and servers:

1. **Browser Cache:** Checks if it resolved this domain recently.
2. **OS / Hosts File Cache:** Checks the local operating system's DNS cache and `hosts` file.
3. **Router Cache:** Queries your home Wi-Fi router's cache.
4. **ISP DNS Resolver:** Queries your Internet Service Provider's DNS server.
5. **Recursive DNS Hierarchy:** If not cached anywhere, the resolver queries:

- **Root Name Server** $\rightarrow$ Points to the `.com` TLD Name Server.
- **TLD Name Server** $\rightarrow$ Points to `google.com` Authoritative Name Server.
- **Authoritative Name Server** $\rightarrow$ Returns the exact IP address for `[www.google.com](https://www.google.com)`.

---

## 3. TCP Connection Establishment (The 3-Way Handshake)

Once the IP address is known, the browser opens a TCP connection with the target server via a **3-Way Handshake**:

```
[ Client ]  ─── SYN ───►  [ Server ]   ("Can we talk?")
[ Client ]  ◄─ SYN-ACK ── [ Server ]   ("Yes, I'm ready!")
[ Client ]  ─── ACK ───►  [ Server ]   ("Great, connection established.")

```

---

## 4. TLS/SSL Handshake (Security Layer for HTTPS)

Because the request uses HTTPS, an encrypted TLS session must be established before sending data:

1. **ClientHello:** Browser sends supported TLS versions, cipher suites, and random bytes.
2. **ServerHello & Certificate:** Server responds with chosen cipher suite and its **SSL/TLS Certificate**.
3. **Verification:** The browser verifies the certificate against trusted Certificate Authorities (CAs).
4. **Key Exchange:** Both parties generate a shared asymmetric session key to encrypt all subsequent communication.

---

## 5. HTTP Request Sent

The browser constructs and sends the HTTP `GET` request over the encrypted connection:

```http
GET / HTTP/1.1
Host: www.google.com
User-Agent: Mozilla/5.0 ...
Accept: text/html,application/xhtml+xml
Cookie: session_id=xyz...

```

---

## 6. Server Processing & Response

1. The request hits a load balancer / reverse proxy (like Nginx or Cloudflare CDN).
2. It routes to a backend application server to execute database queries or application logic.
3. The server constructs an HTTP response containing headers and the HTML body payload:

```http
HTTP/1.1 200 OK
Content-Type: text/html; charset=UTF-8
Cache-Control: max-age=3600
Set-Cookie: tracking_id=123...

<!DOCTYPE html>
<html>...</html>

```

---

## 7. Critical Rendering Path (Browser Renders the Page)

Once the browser receives the raw HTML byte stream, its layout engine (like Blink or Gecko) parses and displays the UI:

1. **DOM Construction:** Parses HTML markup into the **Document Object Model (DOM)** tree.
2. **CSSOM Construction:** Downloads and parses linked CSS files into the **CSS Object Model (CSSOM)** tree.
3. **Render Tree:** Combines DOM and CSSOM to create a render tree containing only visible elements.
4. **Layout (Reflow):** Computes exact pixel dimensions and spatial positions for every visible node on the screen.
5. **Paint & Composite:** Draws pixels onto screen layers, composite layers together, and displays the fully rendered webpage to the user.

---

## Summary Overview

```
[ User Presses Enter ]
          │
          ▼
    [ DNS Lookup ] ──► (Converts domain to IP address)
          │
          ▼
 [ TCP/TLS Handshake ] ──► (Establishes secure, encrypted socket connection)
          │
          ▼
   [ HTTP GET Req ] ──► (Requests web assets from server)
          │
          ▼
  [ Server Response ] ──► (Sends HTML, CSS, JS payloads back)
          │
          ▼
   [ Browser Render ] ──► (Constructs DOM + CSSOM, Paints layout on screen)

```
