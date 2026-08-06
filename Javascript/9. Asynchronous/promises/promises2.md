The image shows a **Promise Polyfill Test Suite** with 18 test cases covering:

```text
✅ Executor runs immediately
✅ Multiple then handlers
✅ Promise chaining
✅ Resolve once
✅ Reject handling
✅ Catch handling
✅ Error propagation
✅ Then(onFulfilled, onRejected)
✅ Catch bypass
✅ Async execution
```

To pass those tests, you need a Promise implementation that supports:

```text
Pending
Fulfilled
Rejected

then()
catch()

Promise chaining

Promise returned from then()

Error bubbling

Executor try/catch

Multiple subscribers

Async callback execution
```

***

# Complete Promise Polyfill

```js
const STATE = {
  PENDING: "pending",
  FULFILLED: "fulfilled",
  REJECTED: "rejected",
};

class MyPromise {
  #state = STATE.PENDING;
  #value = undefined;

  #thenCallbacks = [];
  #catchCallbacks = [];

  constructor(executor) {
    try {
      executor(
        this.#resolve,
        this.#reject
      );
    } catch (err) {
      this.#reject(err);
    }
  }

  #resolve = (value) => {
    queueMicrotask(() => {
      if (
        this.#state !==
        STATE.PENDING
      ) {
        return;
      }

      if (
        value instanceof
        MyPromise
      ) {
        value.then(
          this.#resolve,
          this.#reject
        );
        return;
      }

      this.#state =
        STATE.FULFILLED;

      this.#value = value;

      this.#runCallbacks();
    });
  };

  #reject = (reason) => {
    queueMicrotask(() => {
      if (
        this.#state !==
        STATE.PENDING
      ) {
        return;
      }

      if (
        reason instanceof
        MyPromise
      ) {
        reason.then(
          this.#resolve,
          this.#reject
        );
        return;
      }

      this.#state =
        STATE.REJECTED;

      this.#value = reason;

      this.#runCallbacks();
    });
  };

  then(
    onFulfilled,
    onRejected
  ) {
    return new MyPromise(
      (
        resolve,
        reject
      ) => {
        this.#thenCallbacks.push(
          result => {
            if (
              !onFulfilled
            ) {
              resolve(
                result
              );
              return;
            }

            try {
              const value =
                onFulfilled(
                  result
                );

              if (
                value instanceof
                MyPromise
              ) {
                value.then(
                  resolve,
                  reject
                );
              } else {
                resolve(
                  value
                );
              }
            } catch (
              error
            ) {
              reject(
                error
              );
            }
          }
        );

        this.#catchCallbacks.push(
          error => {
            if (
              !onRejected
            ) {
              reject(
                error
              );
              return;
            }

            try {
              const value =
                onRejected(
                  error
                );

              if (
                value instanceof
                MyPromise
              ) {
                value.then(
                  resolve,
                  reject
                );
              } else {
                resolve(
                  value
                );
              }
            } catch (
              err
            ) {
              reject(
                err
              );
            }
          }
        );

        this.#runCallbacks();
      }
    );
  }

  catch(onRejected) {
    return this.then(
      null,
      onRejected
    );
  }

  #runCallbacks() {
    if (
      this.#state ===
      STATE.FULFILLED
    ) {
      while (
        this
          .#thenCallbacks
          .length
      ) {
        const cb =
          this
            .#thenCallbacks
            .shift();

        cb(this.#value);
      }

      this.#catchCallbacks =
        [];
    }

    if (
      this.#state ===
      STATE.REJECTED
    ) {
      while (
        this
          .#catchCallbacks
          .length
      ) {
        const cb =
          this
            .#catchCallbacks
            .shift();

        cb(this.#value);
      }

      this.#thenCallbacks =
        [];
    }
  }

  static resolve(
    value
  ) {
    return new MyPromise(
      resolve =>
        resolve(
          value
        )
    );
  }

  static reject(
    reason
  ) {
    return new MyPromise(
      (
        _,
        reject
      ) =>
        reject(
          reason
        )
    );
  }
}
```

***

# Test Case 1

```js
new MyPromise(resolve => {
  console.log(
    "Executor Called"
  );

  resolve(1);
});
```

Output

```text
Executor Called
```

***

# Test Case 2

```js
new MyPromise(resolve => {
  setTimeout(() => {
    resolve("success");
  }, 500);
}).then(value => {
  console.log(value);
});
```

Output

```text
success
```

***

# Test Case 3 (Multiple Then)

```js
const p =
  new MyPromise(
    resolve =>
      resolve(10)
  );

p.then(v =>
  console.log(
    "A",
    v
  )
);

p.then(v =>
  console.log(
    "B",
    v
  )
);
```

Output

```text
A 10
B 10
```

***

# Test Case 4 (Chaining)

```js
MyPromise.resolve(5)
  .then(v => v * 2)
  .then(v => v * 3)
  .then(console.log);
```

Output

```text
30
```

***

# Test Case 5

```js
MyPromise.resolve(5)
  .then(v => {
    return v + 1;
  })
  .then(console.log);
```

Output

```text
6
```

***

# Test Case 8

```js
MyPromise.reject(
  "Error"
).catch(console.log);
```

Output

```text
Error
```

***

# Test Case 11

```js
MyPromise.resolve(10)
  .then(() => {
    throw new Error(
      "Boom"
    );
  })
  .catch(err =>
    console.log(
      err.message
    )
  );
```

Output

```text
Boom
```

***

# Test Case 14

```js
MyPromise.reject(
  "Error"
)
  .catch(() => 100)
  .then(console.log);
```

Output

```text
100
```

***

# Senior Frontend Interview Explanation

```text
Promise State Machine

PENDING
   │
   ├────────► FULFILLED
   │
   └────────► REJECTED

State change only ONCE
```

Key interview topics covered:

```text
✅ Executor executes immediately

✅ Async resolution via queueMicrotask

✅ then returns new Promise

✅ Multiple then handlers

✅ Error propagation

✅ Promise flattening

✅ Catch chaining

✅ Resolve once only

✅ Reject once only
```

This implementation is sufficient for most **Frontend Machine Coding / Promise Polyfill** interview rounds and closely matches the behaviours demonstrated by the test suite in the image.
