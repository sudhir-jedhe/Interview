```js
// Function to check prime number
function p() {
  let n,
    i,
    flag = true;

  n = 4;
  for (i = 2; i <= n - 1; i++)
    if (n % i == 0) {
      flag = false;
      break;
    }

  if (flag == true) console.log(n + " is prime");
  else console.log(n + " is not prime");
}
p();
// 4 is not prime

/****************************** */

function check(p) {
  for (let i = 3; i <= Math.sqrt(p); i += 2)
    if (p % i === 0) {
      return true;
    }
  return false;
}

// Function to check prime number
function p() {
  let n = 100;

  if (n % 2 === 0) console.log(n + " is not prime");
  else if (check(n)) console.log(n + " is not prime");
  else console.log(n + " is prime");
}
p();
