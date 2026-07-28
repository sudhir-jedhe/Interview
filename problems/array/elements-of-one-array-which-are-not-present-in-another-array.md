```js
function gfg_Run() {
  var elmts = ar1.filter(function (i) {
    return this.indexOf(i) < 0;
  }, ar2);
  return elmts;
}

var ar1 = [1, 2, 3, 4];
var ar2 = [2, 4];

// 1,3
/****************************************************************** */

function gfg_Run() {
  return ar1.filter((f) => !ar2.includes(f));
}

var ar1 = [1, 2, 3, 4];
var ar2 = [2, 4];
