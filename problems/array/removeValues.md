```js
const arr1 = [1, 2, 3, 4, 5];
const arr2 = [3, 4, 6];
const remaining = removeValues(arr1, arr2);
console.log(remaining); // [1, 2, 5]

export const removeValues = (arr1, arr2) => {
  for (let i = 0; i < arr2.length; i++) {
    let index = arr1.indexOf(arr2[i]);
    while (index !== -1) {
      arr1.splice(index, 1);
      index = arr1.indexOf(arr2[i]);
    }
  }
  return arr1;
};
