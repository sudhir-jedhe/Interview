Great! You've created a mock server that simulates random delays and failures, which can be very useful during development when the real API is unavailable. Now, let's break down and explain each part of your mock server, followed by your auto-suggestion mock server.

### 1. **Random Boolean Generator (`getRandomBool`)**

The `getRandomBool` function generates a boolean (`true` or `false`) randomly based on a threshold. This function is useful for simulating random events like failure or success, or randomly generating results.

- **Threshold**: In your function, the threshold is set to `1000`, meaning there is a 1/1000 chance of getting `true`. If `n` (failure count) is greater than `1000`, the threshold is capped at `1000`.
- **`Math.floor(Math.random() * threshold) % n === 0`**: This generates a random number from 0 to `threshold-1` and checks whether it’s divisible by `n`. If it is, the function returns `true`; otherwise, it returns `false`.

```javascript
function getRandomBool(n) {
  const threshold = 1000;
  if (n > threshold) n = threshold; // Limit n to a maximum of 1000
  return Math.floor(Math.random() * threshold) % n === 0;
}
```

### 2. **Mock Server with Random Latency and Failures**

The `mockServer` function simulates an API call. It uses `setTimeout` to introduce random delays (`randomTimeout`) before resolving or rejecting a promise. Whether the promise resolves or rejects is also determined randomly based on the failure count using the `getRandomBool` function.

- **Random Timeout**: `randomTimeout` is a random number between `0` and `LATENCY`. This simulates a random delay in the API response.
- **Random Failure**: The `getRandomBool(FAILURE_COUNT)` decides whether the request will succeed or fail, where `FAILURE_COUNT` controls the likelihood of failure.

```javascript
const FAILURE_COUNT = 10; // Controls the chance of failure (higher is more likely to fail)
const LATENCY = 200; // Maximum latency in milliseconds

function mockServer() {
  return new Promise((resolve, reject) => {
    const randomTimeout = Math.random() * LATENCY; // Random timeout between 0 and LATENCY
    setTimeout(() => {
      if (getRandomBool(FAILURE_COUNT)) {
        // Random failure
        reject(); // Reject the promise
      } else {
        resolve(); // Resolve the promise
      }
    }, randomTimeout);
  });
}
```

This is a great way to simulate API failures and delays during testing.

### 3. **Auto-suggestion Mock Server**

The `getSuggestions` function simulates an API call that provides auto-suggestions based on a given text. It generates random suggestions by adding a "prefix" (`pre`) or "suffix" (`post`) to the input text. This function also uses a random delay (`randomTimeout`) and randomly fails or succeeds, just like the mock server.

- **Auto-suggestions**: Based on the random boolean from `getRandomBool(2)`, it either appends `pre` or `post` or both to the `text` to generate possible suggestions.
- **Promise with Random Timeout**: The `setTimeout` function introduces a random delay to simulate API latency, and the promise will resolve or reject based on the random result from `getRandomBool(FAILURE_COUNT)`.

```javascript
const FAILURE_COUNT = 10; // Controls the chance of failure (higher is more likely to fail)
const LATENCY = 200; // Maximum latency in milliseconds

function getRandomBool(n) {
  const threshold = 1000;
  if (n > threshold) n = threshold; // Limit n to a maximum of 1000
  return Math.floor(Math.random() * threshold) % n === 0;
}

function getSuggestions(text) {
  let pre = "pre";
  let post = "post";
  let results = [];

  // Randomly add variations of the input text
  if (getRandomBool(2)) {
    results.push(pre + text);
  }
  if (getRandomBool(2)) {
    results.push(text);
  }
  if (getRandomBool(2)) {
    results.push(text + post);
  }
  if (getRandomBool(2)) {
    results.push(pre + text + post);
  }

  return new Promise((resolve, reject) => {
    const randomTimeout = Math.random() * LATENCY; // Random timeout between 0 and LATENCY
    setTimeout(() => {
      if (getRandomBool(FAILURE_COUNT)) {
        // Random failure
        reject(); // Reject the promise
      } else {
        resolve(results); // Resolve with the generated suggestions
      }
    }, randomTimeout);
  });
}
```

### Example Usage

Let's say you want to use the `getSuggestions` function to simulate a search or auto-suggestions for a user entering text:

```javascript
getSuggestions("example")
  .then((suggestions) => {
    console.log("Auto-suggestions:", suggestions);
  })
  .catch(() => {
    console.error("Failed to get suggestions.");
  });
```

In this example:

- The `getSuggestions` function will randomly generate suggestions based on the input `'example'`.
- It will return the suggestions or fail based on the randomness controlled by the `FAILURE_COUNT` variable.

### Customizing for Your Needs

- **Failure Control**: If you want to simulate more frequent failures, reduce the value of `FAILURE_COUNT`.
- **Latency Control**: You can increase or decrease the `LATENCY` variable to control the response delay.
- **Randomization**: Adjust the logic inside `getSuggestions` to create different types of randomness, depending on your application's needs (e.g., more complex auto-suggestions, different kinds of failure scenarios).

### Conclusion

This mock server pattern is very useful for testing, simulating network latencies, and handling unpredictable API responses. The randomization allows you to test edge cases, such as slow responses or failed requests, which is often essential for developing robust error handling and timeout management strategies in real-world applications.

Creating a mock server with simulated network conditions—like randomized latency (delays) and artificial HTTP failure rates—is an excellent way to test frontend error boundaries, retry strategies, loading states, and offline capabilities.

Here is a lightweight, production-ready **Node.js (Express)** implementation, followed by a pure **Frontend Mock (MSW / Fetch Interceptor)** approach.

---

## Approach 1: Node.js Express Mock Server

This approach runs a real HTTP server locally that introduces configurable random delays and simulated error status codes (e.g., `500 Server Error`, `503 Service Unavailable`, or `429 Rate Limited`).

### 1. The Middleware Engine (`mockChaosMiddleware.js`)

```javascript
/**
 * Express middleware to simulate network latency and random failures.
 * @param {Object} options Configuration options
 * @param {number} options.minDelay Minimum latency in ms
 * @param {number} options.maxDelay Maximum latency in ms
 * @param {number} options.failureRate Decimal probability of failure (0.2 = 20%)
 * @param {number[]} options.errorCodes Array of HTTP error status codes to randomly emit
 */
function createChaosMiddleware({
  minDelay = 200,
  maxDelay = 1500,
  failureRate = 0.2, // 20% failure probability
  errorCodes = [500, 502, 503, 504, 429],
} = {}) {
  return async (req, res, next) => {
    // 1. Calculate random delay between minDelay and maxDelay
    const delay =
      Math.floor(Math.random() * (maxDelay - minDelay + 1)) + minDelay;
    await new Promise((resolve) => setTimeout(resolve, delay));

    // 2. Roll dice for simulated failure
    const shouldFail = Math.random() < failureRate;

    if (shouldFail) {
      const randomErrorCode =
        errorCodes[Math.floor(Math.random() * errorCodes.length)];

      console.log(
        `[CHAOS] 💥 Simulated ${randomErrorCode} Error on ${req.method} ${req.url} (Delay: ${delay}ms)`,
      );

      return res.status(randomErrorCode).json({
        error: "Simulated Chaos Error",
        statusCode: randomErrorCode,
        message:
          "This error was artificially triggered by mock server chaos middleware.",
      });
    }

    console.log(
      `[CHAOS] ✅ Success on ${req.method} ${req.url} (Delay: ${delay}ms)`,
    );
    next();
  };
}

module.exports = { createChaosMiddleware };
```

---

### 2. The Mock Server (`server.js`)

```javascript
const express = require("express");
const cors = require("cors");
const { createChaosMiddleware } = require("./mockChaosMiddleware");

const app = express();
app.use(cors());
app.use(express.json());

// Apply Chaos Middleware globally (or selectively per route)
app.use(
  createChaosMiddleware({
    minDelay: 300, // Minimum 300ms delay
    maxDelay: 2000, // Maximum 2000ms delay
    failureRate: 0.25, // 25% failure chance
    errorCodes: [500, 503],
  }),
);

// --- Mock Routes ---

app.get("/api/users", (req, res) => {
  res.json([
    { id: 1, name: "Alice Smith", role: "Developer" },
    { id: 2, name: "Bob Jones", role: "Designer" },
  ]);
});

app.post("/api/orders", (req, res) => {
  res.status(201).json({
    orderId: "ORD-" + Math.floor(Math.random() * 10000),
    status: "Created",
    total: 99.99,
  });
});

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`🚀 Mock Chaos Server running at http://localhost:${PORT}`);
});
```

---

## Approach 2: Mock Service Worker (MSW) for Client-Side Testing

If you don't want to run a separate backend process, **MSW (Mock Service Worker)** intercepts browser network requests at the Service Worker level.

```typescript
import { http, HttpResponse, delay } from "msw";

export const handlers = [
  http.get("/api/data", async () => {
    // 1. Simulate random latency (between 200ms and 1500ms)
    const randomLatency = Math.floor(Math.random() * 1300) + 200;
    await delay(randomLatency);

    // 2. Simulate 30% failure rate
    const isError = Math.random() < 0.3;

    if (isError) {
      return new HttpResponse(
        JSON.stringify({ error: "Service Unavailable" }),
        { status: 503, headers: { "Content-Type": "application/json" } },
      );
    }

    return HttpResponse.json({ success: true, payload: [1, 2, 3, 4] });
  }),
];
```

---

## Summary of Configuration Parameters

| Parameter         | Recommended Test Value | Purpose                                                           |
| ----------------- | ---------------------- | ----------------------------------------------------------------- |
| **`minDelay`**    | `200`–`500` ms         | Simulates typical cloud API network latency                       |
| **`maxDelay`**    | `2000`–`5000` ms       | Tests UI loading spinners, skeletons, and timeout triggers        |
| **`failureRate`** | `0.1`–`0.3` (10%–30%)  | Emulates real-world microservice flakiness and retry logic        |
| **`errorCodes`**  | `[429, 500, 502, 503]` | Tests error boundaries, toast notifications, and retry algorithms |
