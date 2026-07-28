```js
let perfectSquare = (e) => {
  //sort the array
  e.sort((a, b) => b - a);

  //Check the perfect square for each element
  for (let i = 0; i < e.length; i++) {
    if (e[i] > 0 && Math.sqrt(e[i]) % 1 === 0) {
      return e[i];
    }
  }
  return -1;
};

console.log(perfectSquare([17, 20, 27, 2, 3, 10]));
console.log(perfectSquare([16, 20, 25, 2, 3, 10]));

Output: -1;
25;

/************************ */
let perfectSquare = (e) => {
  let max = -1;
  //Check the perfect square for each element
  for (let i = 0; i < e.length; i++) {
    if (e[i] > 0 && Math.sqrt(e[i]) % 1 === 0) {
      max = Math.max(max, e[i]);
    }
  }
  return max;
};

console.log(perfectSquare([17, 20, 27, 2, 3, 10]));
console.log(perfectSquare([16, 20, 25, 2, 3, 10]));

Output: -1;
25;
