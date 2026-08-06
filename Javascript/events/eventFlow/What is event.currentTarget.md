The event.currentTarget is the element on which we attach the event handler explicitly.

Copying the markup in Question 12.
Sample HTML Markup.
```html
<div onclick="clickFunc(event)" style="text-align: center;margin:15px;
border:1px solid red;border-radius:3px;">
    <div style="margin: 25px; border:1px solid royalblue;border-radius:3px;">
        <div style="margin:25px;border:1px solid skyblue;border-radius:3px;">
          <button style="margin:10px">
             Button
          </button>
        </div>
    </div>
  </div>

  ```
And changing our the JS a little bit.

```js
function clickFunc(event) {
  console.log(event.currentTarget);
}

```
If you click the button it will log the outermost div markup even though we click the button. In this example, we can conclude that the event.currentTarget is the element on which we attach the event handler.



<div onclick="clickFunc(event)" style="text-align: center;margin:15px;
border:1px solid red;border-radius:3px;">
    <div style="margin: 25px; border:1px solid royalblue;border-radius:3px;">
        <div style="margin:25px;border:1px solid skyblue;border-radius:3px;">
          <button style="margin:10px">
             Button
          </button>
        </div>
    </div>
  </div>