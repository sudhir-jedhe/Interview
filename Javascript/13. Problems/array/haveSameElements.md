```js
export const haveSameElements = (array1, array2) => {
  if (array1.length !== array2.length) {
    return false;
  }

  const frequencyCounter1 = {};
  for (const item of array1) {
    frequencyCounter1[item] = (frequencyCounter1[item] || 0) + 1;
  }

  const frequencyCounter2 = {};
  for (const item of array2) {
    frequencyCounter2[item] = (frequencyCounter2[item] || 0) + 1;
  }

  for (const key in frequencyCounter1) {
    if (!frequencyCounter2[key]) {
      return false;
    }
    if (frequencyCounter2[key] !== frequencyCounter1[key]) {
      return false;
    }
  }
  return true;
};

/********************************* */
export const haveSameElements = (array1, array2) => {
  if (array1.length !== array2.length) {
    return false;
  }
  const sortArray1 = array1.sort();
  const sortArray2 = array2.sort();
  for (let i = 0; i < sortArray1.length; i++) {
    if (sortArray1[i] !== sortArray2[i]) {
      return false;
    }
  }
  return true;
};
