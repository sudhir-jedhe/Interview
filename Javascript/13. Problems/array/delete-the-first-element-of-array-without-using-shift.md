```js
let Arr = ["Geeks", "GFG", "Geek", "GeeksForGeeks"];

console.log("Array: [" + Arr + "]");

function myGFG() {
  Arr.splice(0, 1);
  console.log("Elements of Array: [" + Arr + "]");
}

myGFG();

/******************************* */
let Arr = ["Geeks", "GFG", "Geek", "GeeksForGeeks"];

console.log("Array: [" + Arr + "]");

function removeFirst(element, index) {
  return index > 0;
}

function myGFG() {
  Arr = Arr.filter(removeFirst);
  console.log("Elements of array = [" + Arr + "]");
}

myGFG();
