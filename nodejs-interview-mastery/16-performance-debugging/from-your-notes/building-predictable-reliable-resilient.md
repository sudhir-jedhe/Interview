// Developers want their APIs to be reliable and resilient.

// But there is an area that is often overlooked: are your APIs predictable and retriable?

// Let’s explore some examples.

// Customers getting double charged: A classic example
// A customer is using your payment APIs, and as soon as the process is initiated, there is a network issue on the customer’s end, and he is unable to receive a response. As soon as the network is back, they click on the pay button again. What should happen now?

// If the payment process is restarted, the customer will be double-charged. Which will dent the credibility of the payment processor.

// Order and Inventory Management Systems
// Similarly, let’s say you have an e-commerce OMS app. The store owners process some orders but, for some reason, again perform the same actions. The system should not reprocess but instead, return the original response.

// These problems can be resolved by introducing idempotency in the APIs.

// What is idempotency?
// Idempotency is a mathematical and computer science concept that refers to the quality of some operations or functions in which performing them several times has the same effect as performing them once.

// An idempotent operation can be repeated an infinite number of times and still provide the same outcome.

// Idempotent APIs enable API users to retry calls in the event of a network outage or other problems without having to worry about producing duplicate rows in a database or charging the client several times.

// HTTP Methods ensuring idempotency
// HTTP methods such as PUT, DELETE, and GET are idempotent in nature.

// GET: Repeating a GET request will return the same resource representation without changing the resource on the server.

// HEAD: The HEAD method, like GET, obtains metadata about a resource but not the resource itself. It can be used to check for the existence of a resource, get headers, or find the last change date without modifying the resource itself.

// PUT: If the resource at the specified URL already exists, a PUT request will replace it with the new representation sent in the request body. PUT will build the resource if it does not already exist. PUT is idempotent in the sense that repeating the same PUT request with the same data does not affect the resource in any way other than the initial request.

// DELETE: When you issue a DELETE request, the server deletes the resource if it exists, and it simply provides a successful answer if it does not. Multiple DELETE operations on the same resource will not have different outcomes beyond the first deletion, making it an idempotent operation.

// Loving reading Zero To Architect? Subscribe for free to receive new posts and support my work.

// Type your email...
// Subscribe
// How can a developer build idempotent APIs?
// A developer can add idempotency in various ways.

// 1. Idempotency Keys
// Idempotency keys are the building blocks of idempotent keys. A key, preferably a UUID, is used to identify a request. Whenever the API is called again with the same key, it will return the original response.

// The keys are either external or internal.

// External Idempotency Keys: If the API is integrated into 3rd-party apps, then that system can pass the key to be identified as the idempotency key.

// Internal Idempotency Keys: If the system generates a key against each request and attaches that on the basis of an ID, then that key will be called an idempotent key.

// Saving Idempotency Keys
// The idempotency keys are usually short-lived and can be reused with new requests after a specified time.

// Redis: Redis or other caching solutions can be used to save short-lived idempotency keys.

// TTL indexing: Time-to-live indexes are often used to save a value in a database to be deleted later after a given time interval.

// 2. Using HTTP Methods
// Using HTTP methods such as GET, PUT, and DELETE will ensure that the API resources are by default idempotent.

// Let’s write some code
// Here's an example of how to utilize the Express.js framework to create an idempotent API endpoint in Node.js, including the use of an idempotency key to ensure that repeated requests do not have unintended consequences.


// For upgrading a user's email address, we establish an Express.js application and configure a POST request endpoint (/users/:userId/email).

// To uniquely identify each request, we develop and employ an Idempotency-Key header. If you use the same idempotency key in many requests, the server will recognize it as a duplicate and reply accordingly.

// The server determines whether the idempotency key has previously been processed. If it has, the server responds with a response indicating that it has already handled the request.

// To prevent duplicate processing of the same key, processed idempotency keys are placed in a Set.

// Final Thoughts
// It is critical to consider the probability of failure in a distributed system and how to address it while developing APIs that are both resilient and predictable. Retry logic on clients and server idempotency are two strategies that can help achieve this goal and are reasonably easy to implement in any technological stack.

// Here are a few fundamental principles to remember while building clients and APIs:

// Ensure that failures are dealt with consistently. Request that clients retry activities on remote services. Failure to do so may result in inconsistent data, which may cause problems in the future.

// Make certain that failures are handled in a safe manner. Allow clients to pass a unique value and retry requests as needed by using idempotency and idempotency keys.