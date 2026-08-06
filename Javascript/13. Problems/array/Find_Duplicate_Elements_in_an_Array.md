```js
let check_duplicate_in_array = (input_array) => {
  let duplicate_elements = [];
  for (num in input_array) {
    for (num2 in input_array) {
      if (num === num2) {
        continue;
      } else {
        if (input_array[num] === input_array[num2]) {
          duplicate_elements.push(input_array[num]);
        }
      }
    }
  }
  return [...new Set(duplicate_elements)];
};
let arr = [1, 1, 2, 2, 3, 3, 4, 5, 6, 1];
console.log(check_duplicate_in_array(arr));

/****************************************************** */

let check_duplicate_in_array = (input_array) => {
  input_array = input_array.sort((a, b) => a - b);
  let duplicate_elements = [];
  for (index in input_array) {
    if (input_array[index] === input_array[index - 1]) {
      duplicate_elements.push(input_array[index]);
    }
  }
  return [...new Set(duplicate_elements)];
};
let arr = [1, 1, 2, 2, 3, 3, 4, 5, 6, 1];
console.log(check_duplicate_in_array(arr));

/********************************** */

const check_duplicate_in_array = (input_array) => {
  const duplicates = input_array.filter(
    (item, index) => input_array.indexOf(item) !== index
  );
  return Array.from(new Set(duplicates));
};
const arr = [1, 1, 2, 2, 3, 3, 4, 5, 6, 1];
console.log(check_duplicate_in_array(arr));

/************************************************** */
let check_duplicate_in_array = (input_array) => {
  let duplicate_elements = [];
  for (element of input_array) {
    if (input_array.indexOf(element) !== input_array.lastIndexOf(element)) {
      duplicate_elements.push(element);
    }
  }
  return [...new Set(duplicate_elements)];
};
let arr = [1, 1, 2, 2, 3, 3, 4, 5, 6, 1];
console.log(check_duplicate_in_array(arr));

/************************************************* */
let check_duplicate_in_array = (input_array) => {
  let unique = new Set();
  let duplicated_element = [];
  for (let i = 0; i < input_array.length; i++) {
    if (unique.has(input_array[i])) {
      duplicated_element.push(input_array[i]);
    }
    unique.add(input_array[i]);
  }
  return Array.from(new Set(duplicated_element));
};
let arr = [1, 1, 2, 2, 3, 3, 4, 5, 6, 1];
console.log(check_duplicate_in_array(arr));

/************************************************** */
let check_duplicate_in_array = (input_array) => {
  input_array = input_array.sort((a, b) => a - b);
  return input_array.reduce(
    (duplicated_elements, current_element, current_index) => {
      if (input_array[current_index] === input_array[current_index - 1]) {
        duplicated_elements.push(current_element);
      }
      return Array.from(new Set(duplicated_elements));
    },
    []
  );
};
let arr = [1, 1, 2, 2, 3, 3, 4, 5, 6, 1];
console.log(check_duplicate_in_array(arr));

/**************************************** */
let arr = [1, 2, 3, 4, 5, 2, 6, 3, 7, 8, 8];
let duplicates = [];
 
arr.forEach(function (value, index, array) {
    if (array.indexOf(value, index + 1) !== -1
        && duplicates.indexOf(value) === -1) {
        duplicates.push(value);
    }
});
 
console.log("Duplicate values:", duplicates);
