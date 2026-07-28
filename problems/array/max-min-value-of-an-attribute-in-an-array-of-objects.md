```js
let Arr = [
  { x: "3/10/2003", y: 0.023452007 },
  { x: "8/12/2002", y: 0.02504234 },
  { x: "1/16/2001", y: 0.024533546 },
  { x: "8/19/2006", y: 0.03123423457 },
];

console.log(JSON.stringify(Arr));

function gfg_Run() {
  console.log(
    "Maximum value of y = " +
      Math.max.apply(
        Math,
        Arr.map(function (event) {
          return event.y;
        })
      )
  );
}

gfg_Run();
// [{"x":"3/10/2003","y":0.023452007},{"x":"8/12/2002","y":0.02504234},{"x":"1/16/2001","y":0.024533546},{"x":"8/19/2006","y":0.03123423457}]
// Maximum value of y = 0.03123423457

let Arr = [
  { x: "3/10/2003", y: 0.023452007 },
  { x: "8/12/2002", y: 0.02504234 },
  { x: "1/16/2001", y: 0.024533546 },
  { x: "8/19/2006", y: 0.03123423457 },
];

console.log(JSON.stringify(Arr));

function gfg_Run() {
  console.log(
    JSON.stringify(
      Arr.reduce(function (prev, current) {
        return prev.y < current.y ? prev : current;
      })
    )
  );
}

gfg_Run();
