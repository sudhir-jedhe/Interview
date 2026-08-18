# An unhandled rejection vs. a handled one

```js
Promise.reject(new Error("unhandled")); // triggers unhandledrejection

Promise.reject(new Error("handled")).catch(e => {
  console.log("caught:", e.message);
});
// logs: "caught: handled"
// separately (order not guaranteed relative to the above): unhandledrejection event fires for the first
```

The first rejected promise has no `.catch()` attached at all, so the runtime eventually flags it as unhandled; the second has a `.catch()` chained immediately, so it's considered handled and never triggers that warning.
