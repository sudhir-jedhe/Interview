```js
function customEveryFunction(arrayElements, conditionFunction) {
  for (let i = 0; i < arrayElements.length; i++) {
    if (!conditionFunction(arrayElements[i])) {
      return false;
    }
  }
  return true;
}
let numbersInput = [2, 4, 6, 8, 10];
let allEvenResult = customEveryFunction(numbersInput, (num) => num % 2 === 0);
console.log(allEvenResult);

let geekInput = ["geeksforgeeks", "forgeeks", "geek"];
let allStartingWithAResult = customEveryFunction(geekInput, (word) =>
  word.startsWith("g")
);
console.log(allStartingWithAResult);
// true
// false

/************************************************* */
function customEveryUsingFilter(arrayInput, conditionFunction) {
  return arrayInput.length === arrayInput.filter(conditionFunction).length;
}

let marksInput = [85, 92, 78, 95, 55];
let allPassingOutput = customEveryUsingFilter(
  marksInput,
  (grade) => grade >= 50
);
console.log(allPassingOutput);

let AgeInput = [25, 30, 42, 16];
let allowVoting = customEveryUsingFilter(AgeInput, (age) => age >= 18);
console.log(allowVoting);
// false
// false
