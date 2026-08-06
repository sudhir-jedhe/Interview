// This is a JavaScript Quiz from BFE.dev
```js
Promise.resolve(1) // 1 promise fullfilled 1 pass to then
  .then((val) => {
    console.log(val); // 1
    return val + 1; // 2  (1 + 1)
  })
  .then((val) => {
    //
    console.log(val); // 2. but not return. so next then will received undefined
  })
  .then((val) => {
    console.log(val); // undefined
    return Promise.resolve(3).then((val) => {
      // returning 3 to next then as promise returning
      console.log(val); // 3
    });
    // but not return. so next then will received undefined
  })
  .then((val) => {
    // undefined
    console.log(val);
    return Promise.reject(4); // reject promises return 4 then go to catch
  })
  .catch((val) => {
    // 4
    console.log(val);
    // not return undefined next then will received undefined
  })
  .finally((val) => {
    // finally never accept parameter
    // undefined
    console.log(val);
    return 10; // finally never return
  })
  // .then((val) => {
  //   // it will check value receive before finally
  //   console.log(val, "38"); // undefined
  // });

  console.log('Sudhir')

// 1 2 undefined 3 undefined 4 undefined undefined




Let's break down the Promise chain execution step by step:

1. First, `console.log('Sudhir')` will execute immediately because it's synchronous code.


Then the Promise chain executes in this order:

2. `Promise.resolve(1)`

1. Creates a fulfilled promise with value 1
2. Value 1 is passed to first `.then()`
3. First `.then()` logs `1`
4. Returns `val + 1` (which is 2)



3. Second `.then()`

1. Receives 2 from previous `.then()`
2. Logs `2`
3. No return statement, so implicitly returns `undefined`



4. Third `.then()`

1. Receives `undefined` from previous `.then()`
2. Logs `undefined`
3. Creates a new promise `Promise.resolve(3)`
4. Inside that promise, logs `3`
5. No return after the nested promise logs, so returns `undefined`



5. Fourth `.then()`

1. Receives `undefined` from previous `.then()`
2. Logs `undefined`
3. Returns `Promise.reject(4)`



6. `.catch()`

1. Receives rejected value `4`
2. Logs `4`
3. No return statement, so implicitly returns `undefined`



7. `.finally()`

1. Receives no value (that's how finally works)
2. Logs `undefined`
3. Return value of 10 is ignored (finally's return is always ignored)





So the final output order will be:

```plaintext
"Sudhir"
1
2
undefined
3
undefined
4
undefined
```

Key points:

1. Synchronous code (`console.log('Sudhir')`) runs before any promises
2. When no value is returned from a `.then()`, the next `.then()` receives `undefined`
3. `.finally()` never receives any parameters
4. Return values from `.finally()` are ignored
5. Nested promises (like `Promise.resolve(3)`) are resolved before continuing the chain
6. `.catch()` handles any rejections in the chain
7. If you don't return a value from `.catch()`, it returns `undefined` to the next `.then()`


This is a common interview question that tests understanding of:

- Promise chaining
- Value propagation in promises
- The behavior of `finally`
- Implicit returns in JavaScript
- Synchronous vs asynchronous execution order