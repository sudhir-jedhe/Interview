```js
let val = parseFloat("2.3") + parseFloat("2.4");
console.log("2.3 + 2.4 = " + val);

function gfg_Run() {
  console.log(
    "2.3 + 2.4 = " + (parseFloat("2.3") + parseFloat("2.4")).toFixed(2)
  );
}
gfg_Run();

// 2.3 + 2.4 = 4.699999999999999
// 2.3 + 2.4 = 4.70

/******************************** */
let val = parseFloat("2.3") + parseFloat("2.4");
console.log("2.3 + 2.4 = " + val);

function gfg_Run() {
  console.log(
    "2.3 + 2.4 = " +
      Math.round((parseFloat("2.3") + parseFloat("2.4")) * 100) / 100
  );
}
gfg_Run();
