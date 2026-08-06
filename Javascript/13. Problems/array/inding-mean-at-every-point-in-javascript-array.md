```js
/*
Input: arr = [1, 2, 3, 4, 5]
Output: 
Mean at position 1: 1
Mean at position 2: 1.5
Mean at position 3: 2
Mean at position 4: 2.5
Mean at position 5: 3
Explanation: 
Cumulative Sum: 1,  Mean: 1/1 = 1
Cumulative Sum: 1 + 2 = 3, Mean: 3/2 = 1.5
Cumulative Sum: 1 + 2 + 3 = 6, Mean: 6/3 = 2
Cumulative Sum: 1 + 2 + 3 + 4 = 10, Mean: 10/4 = 2.5
Cumulative Sum: 1 + 2 + 3 + 4 + 5 = 15, Mean: 15/5 = 3

*/

const arr = [1, 2, 3, 4, 5];
let s = 0;
for (let i = 0; i < arr.length; i++) {
  s += arr[i];
  const res = s / (i + 1);
  console.log(`Mean at position ${i + 1}: ${res}`);
}

/***************************************** */

const arr = [5, 4, 3, 2, 1];
let s = 0;
const means = arr.map((value, index) => {
  s += value;
  const res = s / (index + 1);
  console.log(`Mean at position ${index + 1}: ${res}`);
  return res;
});

/********************************************* */
const arr = [1, 2, 3, 4, 5];
const means = arr.reduce(
  (acc, v, idx) => {
    const s = acc.sum + v;
    const res = s / (idx + 1);
    acc.means.push(res);
    console.log(`Mean at position ${idx + 1}: ${res}`);
    return { sum: s, means: acc.means };
  },
  { sum: 0, means: [] }
);
