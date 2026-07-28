```js
var ar1 = [1, 2, 3, 4];
var ar2 = [2, 4];

const unCommon = ar1.filter(function (i) {
  return this.indexOf(i) < 0;
}, ar2);

// 1, 3

const unCommon = ar1.filter((f) => !ar2.includes(f));
