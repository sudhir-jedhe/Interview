```js
const str = "Hello Geeks!";

console.log(str.startsWith("Hello")); // true
console.log(str.startsWith("Geeks", 6)); // true
console.log(str.startsWith("Geeks", 7)); // false

/********************************************** */
let x = "Hello World!";
function myfunc() {
  if (x.startsWith("Hello")) {
    result = true;
  } else {
    result = false;
  }
  console.log(result);
}
myfunc();
```
