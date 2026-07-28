```js
let digitalRoot = (n) => {
  //calculate the sum of all the digits
  let sum = 0;
  while (parseInt(n) > 0) {
    let temp = n % 10;
    sum = sum + temp;
    n = parseInt(n / 10);
  }

  //Check if the sum is single digit
  if (sum < 10) {
    return sum;
  }

  //call the function again
  return digitalRoot(sum);
};

console.log(digitalRoot(257520643)); //7
console.log(digitalRoot(5674)); // 4
console.log(digitalRoot(493193)); // 2
console.log(digitalRoot(34758)); // 9

/******************** */
let digitalRoot = (n) => {
  return ((n - 1) % 9) + 1;
};

console.log(digitalRoot(257520643)); //7
console.log(digitalRoot(5674)); // 4
console.log(digitalRoot(493193)); // 2
console.log(digitalRoot(34758)); // 9
