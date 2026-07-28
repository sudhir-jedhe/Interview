Let's walk through the questions and answers:

---

### 1. What is the output?

```javascript
console.log(1);
setTimeout(function () {
  console.log(2);
}, 1000);
setTimeout(function () {
  console.log(3);
}, 0);
console.log(4);
```

#### Output:

```
1
4
3
2
```

#### Explanation:

1. `console.log(1)` runs immediately.
2. `setTimeout(function() { console.log(2); }, 1000)` is scheduled to log `2` after 1 second.
3. `setTimeout(function() { console.log(3); }, 0)` is scheduled to log `3` as soon as the event loop is free.
4. `console.log(4)` runs immediately after `console.log(1)`, before the timeouts.
5. After the main stack finishes, the event loop processes the `setTimeout` callbacks. `console.log(3)` runs first because it was scheduled with a `0` delay, followed by `console.log(2)` after 1 second.

---

### 2. What is the output?

```javascript
function say(a) {
  alert(a);
}
say(1);
setTimeout(say(2), 5000);
setTimeout(function () {
  say(3);
}, 1000);
setTimeout(say, 2000, 4);
```

#### Output:

- First: `1` is alerted immediately.
- Then: `3` is alerted after 1 second.
- After 2 seconds: `4` is alerted due to the `setTimeout(say, 2000, 4)`.
- **The issue** is with `setTimeout(say(2), 5000)`. This will immediately call `say(2)` because of the parentheses, which is **not** the desired behavior. It should be `setTimeout(() => say(2), 5000)` to delay the call to `say(2)`.

#### Fixed Code:

```javascript
function say(a) {
  alert(a);
}
say(1);
setTimeout(() => say(2), 5000); // Fix the issue here
setTimeout(function () {
  say(3);
}, 1000);
setTimeout(say, 2000, 4);
```

---

### 3. What's wrong? How fix?

```javascript
var done = false;
$.ajax(url, function () {
  done = true;
});
while (!done) {
  someWaitingStuff();
}
```

#### Problem:

The problem is that this code creates a **blocking while loop** while waiting for the AJAX request to complete. This will lock up the browser thread, and no other tasks (like rendering UI or handling other events) will be processed.

#### Fix:

Use asynchronous programming (e.g., a callback, promise, or event loop) to handle waiting instead of blocking with `while`. Here is a solution using the **callback** from the AJAX request:

```javascript
var done = false;
$.ajax(url, function () {
  done = true;
  someWaitingStuff(); // Continue once AJAX is done
});
```

Alternatively, using **Promises**:

```javascript
$.ajax(url).then(function () {
  done = true;
  someWaitingStuff();
});
```

---

### 4. Modify functions to get output `4,3,2,1,0,0,1,2,3,4`

```javascript
var a = function (i) {
  console.log(i);
};
var b = function (i) {
  console.log(i);
};
for (var i = 0; i < 5; i++) {
  a(i);
}
for (var i = 4; i >= 0; i--) {
  b(i);
}
```

#### Solution:

We need to swap the functions `a` and `b` so that `b` starts with `4` and goes down to `0`, while `a` starts from `0` and goes up to `4`.

**Modified Code:**

```javascript
var a = function (i) {
  console.log(i);
};
var b = function (i) {
  console.log(i);
};
for (var i = 4; i >= 0; i--) {
  b(i);
}
for (var i = 0; i < 5; i++) {
  a(i);
}
```

---

### 5. Recursive Stack Overflow Fix

```javascript
var list = readHugeList();
var nextListItem = function () {
  var item = list.pop();
  if (item) {
    // process the list item...
    nextListItem();
  }
};
```

#### Problem:

This recursive approach can cause a **stack overflow** if the list is too large, as each recursive call consumes stack space.

#### Solution:

Use **tail recursion** or an **iterative approach** to avoid deep recursion. One possible fix is to use a **setTimeout** or **Promise** to defer each iteration:

```javascript
var list = readHugeList();
var nextListItem = function () {
  var item = list.pop();
  if (item) {
    // process the list item...
    setTimeout(nextListItem, 0); // Deferring the next iteration
  }
};
```

Alternatively, use an **iterative solution**:

```javascript
var list = readHugeList();
while (list.length > 0) {
  var item = list.pop();
  // process the list item...
}
```

---

### 6. Output of Code with `Promise` and `setTimeout`

```javascript
(function () {
  console.log(1);
  setTimeout(() => console.log(2), 1000);
  setTimeout(() => console.log(3), 0);
  Promise.resolve(true).then(() => console.log(4));
  console.log(5);
})();
```

#### Output:

```
1
5
3
4
2
```

#### Explanation:

1. `console.log(1)` runs immediately.
2. `setTimeout(() => console.log(3), 0)` runs next, as it is queued in the event loop with a delay of `0`.
3. `Promise.resolve(true).then(() => console.log(4))` is processed after the current stack, so `console.log(4)` runs.
4. `setTimeout(() => console.log(2), 1000)` is scheduled last and executes after 1 second.

---

### 7. Fetcher Function with Retries

**Using Recursion:**

```javascript
function fetchData(url, retries, delay = 1000) {
  return fetch(url)
    .then((response) => response.json())
    .catch((error) => {
      if (retries > 0) {
        return new Promise((resolve) =>
          setTimeout(() => resolve(fetchData(url, retries - 1, delay)), delay),
        );
      } else {
        throw error;
      }
    });
}
```

**Non-Recursion version using loops:**

```javascript
function fetchData(url, retries, delay = 1000) {
  let attempts = 0;
  function tryFetch() {
    attempts++;
    return fetch(url)
      .then((response) => response.json())
      .catch((error) => {
        if (attempts < retries) {
          return new Promise((resolve) =>
            setTimeout(() => resolve(tryFetch()), delay),
          );
        } else {
          throw error;
        }
      });
  }
  return tryFetch();
}
```

---

### 8. The following will not work because `throw` inside `setTimeout` is caught by the **setTimeout** itself and not by the surrounding `try/catch`.

```javascript
try {
  setTimeout(function () {
    throw new Error();
  }, 1000);
} catch (e) {
  alert(e);
}
```

#### Fix:

You need to handle the error inside the **callback** of `setTimeout`:

```javascript
setTimeout(function () {
  try {
    throw new Error();
  } catch (e) {
    alert(e);
  }
}, 1000);
```

---

### 9. `promisify` Function

```javascript
function promisify(fn) {
  return function (...args) {
    return new Promise((resolve, reject) => {
      fn(...args, (error, data) => {
        if (error) reject(error);
        else resolve(data);
      });
    });
  };
}
```

---

### 10. Serial List Processing

```javascript
function serialProcess(list, process, done) {
  let results = [];
  let index = 0;

  function next() {
    if (index < list.length) {
      process(list[index], index, list, function (result) {
        results.push(result);
        index++;
        next();
      });
    } else {
      done(results);
    }
  }

  next();
}
```

**Callback style:**

```javascript
serialProcess(
  [1, 2, 3, 4, 5],
  (el, index, list, done) => {
    console.log(`${el} start`);
    setTimeout(() => {
      console.log(`${el} end`);
      done(el * el);
    }, el * 100);
  },
  (list) => console.log(list),
); // [1, 4, 9, 16, 25]
```
