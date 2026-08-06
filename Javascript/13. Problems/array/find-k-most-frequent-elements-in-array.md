```js
/*
    Input: array = [7, 10, 11, 5, 2, 5, 5, 7, 11, 8, 9] , K = 4
    Output: [5, 7, 11, 10] or [5, 7, 11, 2]
    Explanation: 
    5 -> 3 Frequency
    7 -> 2 Frequency
    11 -> 2 Freqency
    2 -> 1 Frequency
    10 -> 1 Frequency
*/

let array = [7, 10, 11, 5, 2, 5, 5, 7, 11, 8, 9];
let K = 4;
function kFreq() {
  let fMap = new Map();
  array.forEach((n) => {
    if (fMap.has(n)) {
      fMap.set(n, fMap.get(n) + 1);
    } else {
      fMap.set(n, 1);
    }
  });
  let sort = Array.from(fMap.entries()).sort((a, b) => b[1] - a[1]);
  let res = sort.slice(0, K).map((temp) => temp[0]);
  console.log(res);
}
kFreq();

/******************* */

function freqUsingFor(ipArr, kEle) {
  let mapFreq = {};
  let FreqEle = [];
  for (let i = 0; i < ipArr.length; i++) {
    let temp = ipArr[i];
    if (mapFreq[temp]) {
      mapFreq[temp]++;
    } else {
      mapFreq[temp] = 1;
    }
    if (FreqEle.indexOf(temp) === -1) {
      FreqEle.push(temp);
    }
    FreqEle.sort((a, b) => {
      return mapFreq[b] - mapFreq[a];
    });
    if (FreqEle.length > kEle) {
      FreqEle.pop();
    }
  }
  return FreqEle;
}
let array = [7, 10, 11, 5, 2, 5, 5, 7, 11, 8, 9];
let K = 4;
let result = freqUsingFor(array, K);
console.log(result);
