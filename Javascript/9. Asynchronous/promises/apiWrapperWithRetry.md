# Implement a Timeout-Based API Wrapper with Optional Retry

This is a popular **JavaScript / React interview question** that tests:

✅ Promises

✅ Async/Await

✅ `Promise.race()`

✅ Retry Logic

✅ Error Handling

✅ Timeout Management

✅ API Resilience

Public interview discussions describe this problem as wrapping an unstable API so it never blocks longer than a defined timeout and optionally retries before failing. [\[linkedin.com\]](https://www.linkedin.com/posts/chethan2873_implement-a-timeout-based-api-wrapper-with-activity-7392098186443624448-Tox2), [\[medium.com\]](https://medium.com/@rihab.beji099/how-to-handle-api-timeouts-in-javascript-and-optimize-fetch-requests-29bd17103b3a)

***

# Requirements

```js
wrapper(apiCall, {
  timeout: 300,
  retries: 1
});
```

Behaviour:

```text
API responds within 300ms
     ↓
Return result

API exceeds 300ms
     ↓
Timeout Error

Retry Enabled?
     ↓
Yes
     ↓
Retry Once
     ↓
Success / Failure
```

***

# Basic Timeout Wrapper

```js
function withTimeout(
  promise,
  timeout
) {
  return Promise.race([
    promise,

    new Promise((_, reject) => {
      setTimeout(() => {
        reject(
          new Error(
            "Request Timeout"
          )
        );
      }, timeout);
    }),
  ]);
}
```

This uses `Promise.race()` to race the API request against a timeout promise. [\[medium.com\]](https://medium.com/@rihab.beji099/how-to-handle-api-timeouts-in-javascript-and-optimize-fetch-requests-29bd17103b3a)

***

# Complete Solution With Retry

```js
async function apiWrapper(
  apiFunction,
  {
    timeout = 1000,
    retries = 0,
  } = {}
) {
  let lastError;

  for (
    let attempt = 0;
    attempt <= retries;
    attempt++
  ) {
    try {
      const result =
        await Promise.race([
          apiFunction(),

          new Promise(
            (_, reject) => {
              setTimeout(() => {
                reject(
                  new Error(
                    "Request Timeout"
                  )
                );
              }, timeout);
            }
          ),
        ]);

      return result;
    } catch (error) {
      lastError = error;

      if (
        attempt === retries
      ) {
        throw error;
      }
    }
  }

  throw lastError;
}
```

***

# Mock API

```js
function mockApi(
  delay,
  shouldFail = false
) {
  return () =>
    new Promise(
      (
        resolve,
        reject
      ) => {
        setTimeout(() => {
          if (
            shouldFail
          ) {
            reject(
              new Error(
                "API Failed"
              )
            );
          } else {
            resolve(
              "Success"
            );
          }
        }, delay);
      }
    );
}
```

***

# Example 1: Success

```js
apiWrapper(
  mockApi(200),
  {
    timeout: 500,
    retries: 1,
  }
)
  .then(console.log)
  .catch(console.error);
```

Output

```text
Success
```

***

# Example 2: Timeout

```js
apiWrapper(
  mockApi(1000),
  {
    timeout: 300,
    retries: 0,
  }
)
  .then(console.log)
  .catch(error =>
    console.log(
      error.message
    )
  );
```

Output

```text
Request Timeout
```

***

# Example 3: Retry Once

```js
let count = 0;

function unstableApi() {
  return new Promise(
    (
      resolve,
      reject
    ) => {
      count++;

      if (count < 2) {
        reject(
          new Error(
            "Temporary Error"
          )
        );
      } else {
        resolve(
          "Recovered"
        );
      }
    }
  );
}

apiWrapper(
  unstableApi,
  {
    timeout: 500,
    retries: 1,
  }
)
  .then(console.log);
```

Output

```text
Recovered
```

***

# Production Version (AbortController)

Instead of only timing out locally, we actually cancel the request:

```js
async function fetchWithTimeout(
  url,
  options = {},
  timeout = 5000
) {
  const controller =
    new AbortController();

  const timer =
    setTimeout(() => {
      controller.abort();
    }, timeout);

  try {
    const response =
      await fetch(url, {
        ...options,
        signal:
          controller.signal,
      });

    return response;
  } finally {
    clearTimeout(timer);
  }
}
```

Timeout/abort support is a commonly recommended resilience pattern for API wrappers. [\[dev.to\]](https://dev.to/yupher/build-a-rock-solid-api-with-retry-timeout-in-10-minutes-1gje), [\[medium.com\]](https://medium.com/@rihab.beji099/how-to-handle-api-timeouts-in-javascript-and-optimize-fetch-requests-29bd17103b3a)

***

# Advanced Retry With Exponential Backoff

```js
function sleep(ms) {
  return new Promise(resolve =>
    setTimeout(resolve, ms)
  );
}

async function retryApi(
  fn,
  retries = 3
) {
  let delay = 500;

  for (
    let i = 0;
    i <= retries;
    i++
  ) {
    try {
      return await fn();
    } catch (error) {
      if (
        i === retries
      ) {
        throw error;
      }

      await sleep(delay);

      delay *= 2;
    }
  }
}
```

Exponential backoff is frequently suggested for transient failures and retry strategies. [\[javascript...english.io\]](https://javascript.plainenglish.io/building-a-resilient-api-retryrequest-utility-handling-failures-gracefully-in-javascript-4723c624db37), [\[medium.com\]](https://medium.com/jsexpert/integrating-circuit-breaker-pattern-into-api-call-retry-mechanism-6dd41f12368c)

***

# TypeScript Version

```ts
interface Options {
  timeout?: number;
  retries?: number;
}

async function apiWrapper<T>(
  apiFunction: () => Promise<T>,
  options: Options = {}
): Promise<T> {
  const {
    timeout = 1000,
    retries = 0,
  } = options;

  let lastError;

  for (
    let attempt = 0;
    attempt <= retries;
    attempt++
  ) {
    try {
      return await Promise.race([
        apiFunction(),

        new Promise<T>(
          (_, reject) =>
            setTimeout(
              () =>
                reject(
                  new Error(
                    "Timeout"
                  )
                ),
              timeout
            )
        ),
      ]);
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError;
}
```

***

# Complexity

```text
Time:
O(retries)

Space:
O(1)
```

***

# Senior Interview Follow-Ups

Interviewers often ask for:

```text
✅ Timeout
✅ Retry
✅ AbortController
✅ Exponential Backoff
✅ Circuit Breaker
✅ Retry Only On 5xx
✅ Jitter
✅ Request Deduplication
✅ Concurrency Limits
```

### Expected Architecture

```text
API Call
   │
   ▼
Timeout Wrapper
   │
   ▼
Retry Logic
   │
   ▼
Backoff Strategy
   │
   ▼
Success / Error
```

A strong interview answer is to implement **`Promise.race()` for timeout**, add **configurable retries**, and discuss **AbortController + exponential backoff** as production-grade enhancements. [\[medium.com\]](https://medium.com/@rihab.beji099/how-to-handle-api-timeouts-in-javascript-and-optimize-fetch-requests-29bd17103b3a), [\[linkedin.com\]](https://www.linkedin.com/posts/chethan2873_implement-a-timeout-based-api-wrapper-with-activity-7392098186443624448-Tox2), [\[javascript...english.io\]](https://javascript.plainenglish.io/building-a-resilient-api-retryrequest-utility-handling-failures-gracefully-in-javascript-4723c624db37)
