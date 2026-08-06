```js
export const sumNumbers = (str) => {
  if (!str) return 0;

  const nums = str.split(",");

  return nums.reduce((acc, num) => acc + parseInt(num), 0);
};

sumNumbers(""); // Output: 0
sumNumbers("1,2,3,4,5"); // Output: 15
sumNumbers("0,0,1,2,2"); // Output: 5
sumNumbers("10,-20,30,-40,50"); // Output: 30
```
