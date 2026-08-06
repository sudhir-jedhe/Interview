**Callbacks, Promises, and Async/Await** are three ways to handle asynchronous operations in JavaScript. The interview preparation material in your environment explicitly lists callback functions, callback hell, promises, and async/await as key JavaScript topics.

# 1. Callback

A callback is a function passed to another function and executed later.

## Example

```javascript
function fetchUser(callback) {

  setTimeout(() => {

    callback({
      id: 1,
      name: "Sudhir"
    });

  }, 1000);
}

fetchUser(user => {
  console.log(user);
});
```

Output:

```javascript
{
  id: 1,
  name: "Sudhir"
}
```

### Problems

When multiple async operations depend on each other:

```javascript
getUser(user => {

  getOrders(user.id, orders => {

    getPayment(
      orders[0].id,
      payment => {

        console.log(payment);

      }
    );

  });

});
```

This becomes:

```text
Callback Hell
Pyramid of Doom
```

***

# 2. Promise

A Promise represents a future value.

States:

```text
Pending
Resolved
Rejected
```

## Example

```javascript
function fetchUser() {

  return new Promise(
    (resolve, reject) => {

      setTimeout(() => {

        resolve({
          id: 1,
          name: "Sudhir"
        });

      }, 1000);
    }
  );
}

fetchUser()
  .then(user => {
    console.log(user);
  })
  .catch(error => {
    console.log(error);
  });
```

Output:

```javascript
{
  id: 1,
  name: "Sudhir"
}
```

***

## Promise Chaining

```javascript
fetchUser()
  .then(user =>
    getOrders(user.id)
  )
  .then(orders =>
    getPayment(orders[0].id)
  )
  .then(payment =>
    console.log(payment)
  )
  .catch(console.error);
```

Much cleaner than nested callbacks.

***

# 3. Async/Await

Introduced in ES2017.

Built on top of Promises.

Provides synchronous-looking code.

## Example

```javascript
function fetchUser() {

  return Promise.resolve({
    id: 1,
    name: "Sudhir"
  });
}

async function loadUser() {

  const user =
    await fetchUser();

  console.log(user);
}

loadUser();
```

Output:

```javascript
{
  id: 1,
  name: "Sudhir"
}
```

***

## Multiple API Calls

### Promise Version

```javascript
fetchUser()
  .then(user =>
    getOrders(user.id)
  )
  .then(orders =>
    getPayment(orders[0].id)
  );
```

***

### Async/Await Version

```javascript
async function loadData() {

  const user =
    await fetchUser();

  const orders =
    await getOrders(
      user.id
    );

  const payment =
    await getPayment(
      orders[0].id
    );

  console.log(payment);
}
```

Looks much more readable.

***

# Error Handling

## Callback

```javascript
getUser(
  (error, user) => {

    if (error) {

      console.log(error);

      return;
    }

    console.log(user);
  }
);
```

***

## Promise

```javascript
fetchUser()
  .then(user =>
    console.log(user)
  )
  .catch(error =>
    console.log(error)
  );
```

***

## Async/Await

```javascript
async function loadUser() {

  try {

    const user =
      await fetchUser();

    console.log(user);

  } catch (error) {

    console.log(error);

  }
}
```

***

# React Example

## Callback

```jsx
<button
  onClick={() =>
    console.log("Click")
  }
>
  Click
</button>
```

***

## Promise

```jsx
useEffect(() => {

  fetchUsers()
    .then(data =>
      setUsers(data)
    );

}, []);
```

***

## Async/Await (Recommended)

```jsx
useEffect(() => {

  async function loadData() {

    const data =
      await fetchUsers();

    setUsers(data);
  }

  loadData();

}, []);
```

***

# Comparison Table

| Feature         | Callback  | Promise | Async/Await |
| --------------- | --------- | ------- | ----------- |
| Simple          | ✅         | ✅       | ✅           |
| Readability     | ❌         | ✅       | ✅✅          |
| Error Handling  | Difficult | Better  | Best        |
| Callback Hell   | ❌         | ✅       | ✅           |
| Chaining        | ❌         | ✅       | ✅           |
| Modern Standard | ❌         | ✅       | ✅✅          |
| React Usage     | Rare      | Common  | Most Common |

***

# Real Interview Example

### Callback

```javascript
fetchData(callback);
```

### Promise

```javascript
fetchData()
  .then(result => ...)
  .catch(error => ...);
```

### Async/Await

```javascript
try {

  const result =
    await fetchData();

} catch (error) {

}
```

***

# Senior React Interview Answer

```text
Callbacks were the original mechanism for handling asynchronous operations in JavaScript, but they often lead to callback hell when multiple async tasks are chained. Promises improve readability by providing chaining through then() and catch() and supporting better error handling. Async/await is built on top of Promises and offers the cleanest, most readable syntax by allowing asynchronous code to be written in a synchronous style. In modern React applications, async/await is generally preferred for API calls, while Promises remain the underlying implementation.
```
