```js
let possibleCombinations = (str) => {
  let combinations = [];
  for (let i = 0; i < str.length; i++) {
    for (let j = i + 1; j < str.length + 1; j++) {
      combinations.push(str.slice(i, j));
    }
  }
  return combinations;
};
console.log(possibleCombinations("Dog"));
// [ 'd', 'do', 'dog', 'o', 'og', 'g' ]

/****************************************** */
let stringCombinations = (str) => {
  let strLength = str.length;
  let result = [];
  let currentIndex = 0;
  while (currentIndex < strLength) {
    let char = str.charAt(currentIndex);
    let x;
    let arrTemp = [char];
    for (x in result) {
      arrTemp.push("" + result[x] + char);
    }
    result = result.concat(arrTemp);
    currentIndex++;
  }
  return result;
};
console.log(stringCombinations("dog"));
//  [ 'd', 'o', 'do', 'g', 'dg', 'og', 'dog' ]

/************************************************************* */

let combinations = (str) => {
  let tempArr = [];
  let resultArr = [];
  for (let i = 0; i < str.length; i++) {
    tempArr = [str[i]];
    let index = 0;
    while (resultArr[index]) {
      tempArr.push("" + resultArr[index] + str[i]);
      index++;
    }
    resultArr = resultArr.concat(tempArr);
  }
  return resultArr;
};
console.log(combinations("dog"));

// ["d", "o", "do", "g", "dg", "og", "dog"];

/*********************************************** */
