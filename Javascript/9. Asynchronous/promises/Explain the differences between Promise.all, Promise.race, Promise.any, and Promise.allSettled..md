JavaScript provides four concurrency combinators in the `Promise` API. Each accepts an iterable of promises (or values) and coordinates their outcomes differently depending on whether they fulfill or reject.

---

### Comparison Overview

| Method                   | Resolves When                                     | Rejects When                                    | Returned Value                                                   | Common Use Case                                       |
| ------------------------ | ------------------------------------------------- | ----------------------------------------------- | ---------------------------------------------------------------- | ----------------------------------------------------- |
| **`Promise.all`**        | **All** promises fulfill                          | **Any** promise rejects                         | Array of fulfilled values (in input order)                       | Dependent batch operations where all must succeed     |
| **`Promise.allSettled`** | **All** promises settle (fulfill or reject)       | **Never** rejects                               | Array of status objects: `{status, value}` or `{status, reason}` | Independent batch tasks where you need full reporting |
| **`Promise.race`**       | **First** promise settles (fulfills *or* rejects) | **First** promise settles (if it rejects first) | The value or reason of the fastest promise                       | Request timeouts or cancellation patterns             |
| **`Promise.any`**        | **First** promise fulfills                        | **All** promises reject                         | The value of the fastest fulfilled promise                       | Fallback redundancy (e.g., querying mirrors/CDNs)     |

---

### Detailed Breakdown

#### 1. `Promise.all` (All-or-Nothing)

Waits for every promise to resolve successfully. If even one promise rejects, the entire operation immediately rejects with that error, ignoring all pending or remaining results.

```javascript
Promise.all([fetchProfile(), fetchSettings(), fetchPreferences()])
  .then(([profile, settings, prefs]) => {
    // Runs only if ALL three succeed
  })
  .catch((err) => {
    // Triggers immediately on the FIRST failure
  });

```

* **Behavior on empty iterable:** Resolves synchronously to `[]`.
* **Ordering:** The output array preserves the original input order, regardless of which promise finished first.

---

#### 2. `Promise.allSettled` (Exhaustive Inspection)

Waits until every promise has either resolved or rejected. It never short-circuits and never enters the `.catch()` block.

```javascript
Promise.allSettled([sendEmail(userA), sendEmail(userB), sendEmail(userC)])
  .then((results) => {
    results.forEach((result) => {
      if (result.status === "fulfilled") {
        console.log("Sent:", result.value);
      } else {
        console.error("Failed:", result.reason);
      }
    });
  });

```

* **Result structure:**
* `{ status: "fulfilled", value: T }`
* `{ status: "rejected", reason: any }`

* **Behavior on empty iterable:** Resolves synchronously to `[]`.

---

#### 3. `Promise.race` (First to Cross the Line)

Settles as soon as the **first** promise settles—whether that fastest promise succeeds or fails.

```javascript
const timeout = new Promise((_, reject) =>
  setTimeout(() => reject(new Error("Request timed out")), 5000)
);

Promise.race([fetchData(), timeout])
  .then((data) => console.log("Data loaded:", data))
  .catch((err) => console.error("Failed or timed out:", err.message));

```

* **Rejection rule:** If the fastest promise rejects, `Promise.race` rejects, even if other promises in the array later resolve successfully.
* **Behavior on empty iterable:** Remains **forever pending**.

---

#### 4. `Promise.any` (First Success)

Waits for the **first successful** promise. It ignores rejections until all input promises fail.

```javascript
Promise.any([
  fetchFromPrimaryCDN(),
  fetchFromSecondaryCDN(),
  fetchFromBackupServer()
])
  .then((data) => console.log("First fast response:", data))
  .catch((err) => {
    // Only triggers if ALL failed
    console.error(err instanceof AggregateError); // true
    console.error(err.errors); // Array of individual rejection reasons
  });

```

* **Rejection rule:** If every promise rejects, it rejects with an `AggregateError`, which packages all individual failure reasons into an `.errors` array.
* **Behavior on empty iterable:** Rejects synchronously with an empty `AggregateError`.
