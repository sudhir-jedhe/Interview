```js
function countSeq(str, seq) {
  const memoTable = new Map();
  function helperFunction(strIdx, seqIdx) {
    if (seqIdx === seq.length) return 1;
    if (strIdx === str.length) return 0;
    const key = strIdx + "," + seqIdx;
    if (memoTable.has(key)) return memoTable.get(key);
    let count = 0;
    if (str[strIdx] === seq[seqIdx]) {
      count += helperFunction(strIdx + 1, seqIdx + 1);
    }
    count += helperFunction(strIdx + 1, seqIdx);
    memoTable.set(key, count);
    return count;
  }
  return helperFunction(0, 0);
}

const str = "geeksforgeeks";
const seq = "ge";
console.log(countSeq(str, seq)); // 6

/************************************* */
function countSeq(str, seq) {
  const m = str.length;
  const n = seq.length;
  const dp = Array(m + 1)
    .fill(0)
    .map(() => Array(n + 1).fill(0));
  for (let i = 0; i <= m; i++) {
    dp[i][0] = 1;
  }
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (str[i - 1] === seq[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + dp[i - 1][j];
      } else {
        dp[i][j] = dp[i - 1][j];
      }
    }
  }

  return dp[m][n];
}
const str = "geeksforgeeks";
const pattern = "ge";
console.log(countSeq(str, pattern));

/*************************************** */
function fun(str, subSeq) {
  function countSeq(strIndex, subseqIndex) {
    if (subseqIndex === subSeq.length) {
      count++;
      return;
    }
    if (strIndex === str.length) {
      return;
    }
    if (str[strIndex] === subSeq[subseqIndex]) {
      countSeq(strIndex + 1, subseqIndex + 1);
    }
    countSeq(strIndex + 1, subseqIndex);
  }
  let count = 0;
  countSeq(0, 0);
  return count;
}

const str = "geeksforgeeks";
const pattern = "ge";
console.log(fun(str, pattern));
