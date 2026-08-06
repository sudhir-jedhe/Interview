```js
export const sortedIndex = (arr, value) => {
  let low = 0;
  let high = arr.length;

  while (low < high) {
    const mid = Math.floor((low + high) / 2);
    if (arr[mid] < value) {
      low = mid + 1;
    } else {
      high = mid;
    }
  }

  return low;
};

const arr = [10, 20, 30, 40, 50];
const value1 = 25;
const value2 = 35;
const value3 = 10;
const index1 = sortedIndex(arr, value1); // index1 should be 2
const index2 = sortedIndex(arr, value2); // index2 should be 4
const index3 = sortedIndex(arr, value3); // index3 should be 0
