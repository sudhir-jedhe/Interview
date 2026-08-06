# Custom Array Class

```js
// JavaScript code for concat() method
class CustomArray extends Array {
  constructor(...args) {
    super(...args);
  }

  customConcat(...arrays) {
    const newArray = new CustomArray(...this);

    for (const arr of arrays) {
      if (Array.isArray(arr)) {
        newArray.push(...arr);
      } else {
        newArray.push(arr);
      }
    }

    return newArray;
  }
}

// Example usage:
const arr1 = new CustomArray(1, 2, 3);
const arr2 = [4, 5];
const arr3 = new CustomArray(6, 7);

const result = arr1.customConcat(arr2, arr3, 8, [9, 10]);

console.log(result); // Output: CustomArray [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

/************************************** */

// Example usage:
const arr1 = new CustomArray(1, 2, 3);
const arr2 = [4, 5];
const arr3 = new CustomArray(6, 7);

const result = arr1.customConcat(arr2, arr3, 8, [9, 10]);

console.log(result); // Output: CustomArray [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

function func() {
  let num1 = [11, 12, 13],
    num2 = [14, 15, 16],
    num3 = [17, 18, 19];
  console.log(num1.concat(num2, num3));
}
func();

```
