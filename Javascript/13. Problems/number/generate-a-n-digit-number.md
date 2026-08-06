```js
function gfg() {
  // 5digit
  var minm = 10000;
  var maxm = 99999;
  return Math.floor(Math.random() * (maxm - minm + 1)) + minm;
}

// 6 digit
// Math.random()).substring(2, 8)
