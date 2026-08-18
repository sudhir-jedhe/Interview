# A safe DOM type assertion with `as`

```typescript
// Snippet: querySelector returns a broad type; assert the specific element
const form = document.querySelector("#signup-form") as HTMLFormElement;

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const data = new FormData(form); // FormData needs an HTMLFormElement
  console.log(Object.fromEntries(data));
});
```
