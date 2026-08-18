# Snippet: Client-side validation is trivially bypassable — never the only line of defense

```js
function submitForm(age) {
  if (age < 18) {
    console.log("Blocked client-side: must be 18+");
    return;
  }
  sendToServer({ age }); // server MUST re-validate `age` independently
}
// Anyone can call sendToServer({ age: -5 }) directly via devtools console or curl,
// completely bypassing this function and its check.
```
