```js
const isLeapYear = (year) => {
  //Is divisible by 400
  if (year % 400 === 0) {
    return true;
  }

  //Is divisble by 4 and not divisible by 100
  if (year % 4 === 0 && year % 100 !== 0) {
    return true;
  }

  return false;
};

Input: console.log(isLeapYear(1888));
console.log(isLeapYear(2020));
console.log(isLeapYear(2019));

Output: true;
true;
false;
