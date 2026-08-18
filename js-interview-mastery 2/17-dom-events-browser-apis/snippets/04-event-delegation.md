# Snippet: Event delegation — one listener handles clicks on any current or future `<li>`

*(Browser-only — run in a browser console on a real page.)*

```js
const list = document.createElement("ul");
list.innerHTML = "<li>Apples</li><li>Bananas</li>";
document.body.append(list);

list.addEventListener("click", (e) => {
  const li = e.target.closest("li");
  if (li) console.log("clicked:", li.textContent);
});

list.querySelector("li").click();
// logs: "clicked: Apples"

// A new <li> added later still works, no new listener needed:
const newItem = document.createElement("li");
newItem.textContent = "Cherries";
list.append(newItem);
newItem.click();
// logs: "clicked: Cherries"
```
