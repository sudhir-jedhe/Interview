```js
// iven an array of integers, find two number that sums up to 0, return their
// indices.

// There might be multiple pairs, any of them would do. If not found, return
// null

findTwo([1, 2, 3, -1]);
// [0,3]

findTwo([1, 2, 3, -1, -2, 0]);
// [0,3] or [1,4] or [5, 5]

findTwo([1, 2, 3, 4]);
// null

/**
 * @param {number[]} arr
 * @return {number[]}
 */
function findTwo(arr) {
  let numberMap = new Map();
  for (let i in arr) {
    numberMap.set(arr[i], i);
  }
  for (let i in arr) {
    if (numberMap.has(-arr[i])) return [i, numberMap.get(-arr[i])];
  }
  return null;
}

console.log(findTwo([1, 2, 3, 4]));

/***************************** */
/**
 * @param {number[]} arr
 * @return {number[]}
 */
function findTwo(arr) {
  if (!arr || !arr.length) {
    return null;
  }

  const hash = new Map();

  for (let i = 0; i < arr.length; i++) {
    const num = arr[i];
    const toFound = -num;

    if (hash.has(toFound)) {
      return [hash.get(toFound), i];
    }

    hash.set(num, i);
  }

  return null;
}

/**************************************** */
function findTwo(arr) {
  const obj = {};
  for (let i in arr) obj[arr[i]] = i;
  for (let key in obj) {
    if (obj[-key]) return [obj[key], obj[-key]];
  }

  return null;
}

/********************************************** */

/**
 * @param {number[]} arr
 * @return {number[]}
 */
function findTwo(arr) {
  let mp = new Map();

  for (let i = 0; i < arr.length; i++) {
    if (mp.has(-arr[i])) {
      return [mp.get(-arr[i]), i];
    }
    mp.set(arr[i], i);
  }
  return null;
}

/******************************* */

/**
 * @param {number[]} arr
 * @return {number[]}
 */
function findTwo(arr) {
  // your code here
  let map = new Map();
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === 0) return [i, i];
    if (map.has(-arr[i])) {
      return [map.get(-arr[i]), i];
    } else {
      map.set(arr[i], i);
    }
  }
  return null;
}

/**************************************** */

/**
 * @param {number[]} arr
 * @return {number[]}
 */
function findTwo(arr) {
  const zeros = [];
  const posMap = new Map();
  const negMap = new Map();
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === 0) {
      zeros.push(i);
      continue;
    }
    if (arr[i] > 0) {
      posMap.set(arr[i], i);
    } else {
      negMap.set(arr[i], i);
    }
  }
  if (zeros.length >= 2) {
    return zeros.slice(0, 2);
  }
  for (const [value, index] of posMap) {
    if (negMap.has(-value)) {
      return [index, negMap.get(-value)];
    }
  }
  return null;
}

console.log(findTwo([0, 0, 2, 3]));
