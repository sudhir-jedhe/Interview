```js
let Arr = [1, 4, 56, 43, 67, 98];

function gfg_Run() {
  let strArr = Arr.map(function (e) {
    return e.toString();
  });

  console.log("Array - " + strArr + "\ntypeof(Array[0]) - " + typeof strArr[0]);
}

gfg_Run();

/*************************** */
let Arr = [1, 4, 56, 43, 67, 98];

function gfg_Run() {
  let strArr = Arr.join().split(", ");

  console.log("Array - " + strArr + "\ntypeof(Array[0]) - " + typeof strArr[0]);
}

gfg_Run();

/*********************** */
const Arr = [1, 2, 3, 4, 5];
const strArr = [];

Arr.forEach(function (num) {
  strArr.push(String(num));
});
console.log("Array - " + strArr + "\ntypeof(Array[0]) - " + typeof strArr[0]);
