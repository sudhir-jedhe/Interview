// Web storage is an API that provides a mechanism by which browsers can store key/value pairs locally within the user's browser, in a much more intuitive fashion than using cookies. The web storage provides two mechanisms for storing data on the client.

// 1. **Local storage:** It stores data for current origin with no expiration date.
// 2. **Session storage:** It stores data for one session and the data is lost when the browser tab is closed.

// Why do you need web storage

// Web storage is more secure, and large amounts of data can be stored locally, without affecting website performance. Also, the information is never transferred to the server. Hence this is a more recommended approach than Cookies.

// How do you check web storage browser support

// You need to check browser support for localStorage and sessionStorage before using web storage,

```js
if (typeof Storage !== "undefined") {
  // Code for localStorage/sessionStorage.
} else {
  // Sorry! No Web Storage support..
}
```
