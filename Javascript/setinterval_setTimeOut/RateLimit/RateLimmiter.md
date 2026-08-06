```js
class RateLimiter {
  constructor(limit, interval) {
    this.limit = limit; // Maximum number of requests allowed
    this.interval = interval; // Time interval (in milliseconds)
    this.requests = []; // Queue to store timestamps of recent requests
  }

  allowRequest() {
    const now = Date.now();

    // Remove timestamps that are older than the interval
    this.requests = this.requests.filter(
      (timestamp) => now - timestamp <= this.interval,
    );

    // Check if the number of requests exceeds the limit
    if (this.requests.length < this.limit) {
      this.requests.push(now); // Add current timestamp to the queue
      return true; // Request is allowed
    } else {
      return false; // Request is not allowed
    }
  }
}

const limiter = new RateLimiter(5, 10000); // Allow 5 requests every 10 seconds

// Simulate making requests
for (let i = 0; i < 10; i++) {
  setTimeout(() => {
    if (limiter.allowRequest()) {
      console.log("Request allowed");
    } else {
      console.log("Request blocked");
    }
  }, i * 2000); // Make a request every 2 seconds
}

/*********************************** */
class RateLimiter {
  constructor(limit, interval) {
    this.limit = limit; // Maximum number of requests allowed within the interval
    this.interval = interval; // Interval (in milliseconds) within which requests are allowed
    this.requests = []; // Array to store timestamps of recent requests
  }

  // Check if the rate limit has been reached
  checkLimit() {
    const now = Date.now();
    // Remove timestamps older than the interval
    this.requests = this.requests.filter(
      (timestamp) => timestamp > now - this.interval,
    );
    // Check if the number of requests is less than the limit
    return this.requests.length < this.limit;
  }

  // Make a request and return true if allowed, false if rate limit reached
  makeRequest() {
    if (this.checkLimit()) {
      this.requests.push(Date.now());
      return true;
    }
    return false;
  }
}

// Example usage:
const rateLimiter = new RateLimiter(10, 60000); // Allow up to 10 requests per minute

for (let i = 0; i < 15; i++) {
  const allowed = rateLimiter.makeRequest();
  console.log(
    `Request ${i + 1}: ${allowed ? "Allowed" : "Rate limit reached"}`,
  );
}

/****************************************** */

class RateLimiter {
  constructor(capacity, refillRate, interval) {
    this.capacity = capacity; // Maximum number of tokens the bucket can hold
    this.tokens = capacity; // Current number of tokens in the bucket
    this.refillRate = refillRate; // Rate at which tokens are refilled (tokens per interval)
    this.interval = interval; // Interval (in milliseconds) for refilling tokens
    this.lastRefillTime = Date.now(); // Last time the tokens were refilled
    this.timer = setInterval(() => this.refillTokens(), this.interval); // Timer for refilling tokens
  }

  allowRequest() {
    // Refill tokens based on elapsed time since last refill
    this.refillTokens();

    // Check if tokens are available
    if (this.tokens > 0) {
      this.tokens--; // Consume one token
      return true; // Request allowed
    } else {
      return false; // Request not allowed
    }
  }

  refillTokens() {
    const currentTime = Date.now();
    const elapsedTime = currentTime - this.lastRefillTime;
    const tokensToAdd = Math.floor(elapsedTime * (this.refillRate / 1000)); // Tokens to add based on refill rate and elapsed time

    this.tokens = Math.min(this.capacity, this.tokens + tokensToAdd); // Refill tokens, ensuring the bucket capacity is not exceeded
    this.lastRefillTime = currentTime; // Update last refill time
  }

  stopRefill() {
    clearInterval(this.timer); // Stop the refill timer
  }
}

// Example usage:
// const rateLimiter = new RateLimiter(10, 1, 1000); // Allow 10 requests per second
// console.log(rateLimiter.allowRequest()); // Output: true (request allowed)
// console.log(rateLimiter.allowRequest()); // Output: true (request allowed)
// console.log(rateLimiter.allowRequest()); // Output: true (request allowed)
// console.log(rateLimiter.allowRequest()); // Output: true (request allowed)
// console.log(rateLimiter.allowRequest()); // Output: true (request allowed)
// console.log(rateLimiter.allowRequest()); // Output: false (request not allowed, bucket empty)
// After 1 second:
// console.log(rateLimiter.allowRequest()); // Output: true (request allowed, bucket refilled)
```
