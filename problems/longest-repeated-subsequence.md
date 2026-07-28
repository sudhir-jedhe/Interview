```js
const LRS = (str, m, n) => {
    // If there are no more characters in the string to evaluate
    if (m == 0 || n == 0) {
      return 0;
    }
  
    // incase characters at index m and n are same
    // but the index of the character are different
    if (str[m - 1] == str[n - 1] && m !== n) {
      return LRS(str, m - 1, n - 1) + 1;
    }
  
    // else, return the max of the lrs at different indexes.
    return Math.max(LRS(str, m, n - 1), LRS(str, m - 1, n));
  }


  Input:
const str = "AABEBCDD";
console.log(LRS(str, str.length, str.length));

Output:
3


const LRS = (str, m, n, lookup) => {
    // If there are no more characters in the string to evaluate
    if (m == 0 || n == 0) {
      return 0;
    }
    
    // unique key to store the cache
    const key = `${m}-${n}`;
    
    // if the solution is not present in the cache,
    // compute it and store it
    if (!lookup.has(key)){
      // incase characters at index m and n are same
      // but the index of the character are different
      if (str[m - 1] == str[n - 1] && m !== n) {
          const computed = LRS(str, m - 1, n - 1, lookup) + 1;
          lookup.set(key, computed);
      }else{
          const computed = Math.max(LRS(str, m, n - 1, lookup), LRS(str, m - 1, n, lookup));
          lookup.set(key, computed);
      }
    }
    
    // return from cache
    return lookup.get(key);
  }


  Input:
const str = "AABEBCDD";
const lookup = new Map();
console.log(LRS(str, str.length, str.length, lookup));

Output:
3



const LRS = (str, n = str.length) => {
 
    // cahce matrix stores already computed subproblem's solution,
    const T = new Array(n + 1)
    for(let i = 0; i < T.length; i++){
      T[i] = new Array(n + 1).fill(0);
    }
  
    // cache in matrix in a bottom-up way
    for (let i = 1; i <= n; i++) {
      for (let j = 1; j <= n; j++) {
        // incase characters at index m and n are same
        // but the index of the character are different
        if (str[i - 1] === str[j - 1] && i != j) {
          T[i][j] = T[i - 1][j - 1] + 1;
        }
        // else
        else {
          T[i][j] = Math.max(T[i - 1][j], T[i][j - 1]);
        }
      }
    }
  
    // LRS will be the in the last cell of the matrix
    return T[n][n];
  }



  const LRS = (str, m, n, T) => {
    // If there are no more characters in the string,
    // return an empty string
    if (m == 0 || n == 0) {
      return "";
    }
  
    // incase characters at index m and n are same
    // but the index of the character are different
    if (str[m - 1] === str[n - 1] && m != n) {
      return LRS(str, m - 1, n - 1, T) + str[m - 1];
    }
    // else
    else {
      if (T[m - 1][n] > T[m][n - 1]) {
        return LRS(str, m - 1, n, T);
      }
      else {
        return LRS(str, m, n - 1, T);
      }
    }
  }
  
  const LRSLength = (str, T, n = str.length) => {
   
    // cache in matrix in a bottom-up way
    for (let i = 1; i <= n; i++) {
      for (let j = 1; j <= n; j++) {
         // incase characters at index m and n are same
         // but the index of the character are different
        if (str[i - 1] === str[j - 1] && i != j) {
          T[i][j] = T[i - 1][j - 1] + 1;
        }
        // else
        else {
          T[i][j] = Math.max(T[i - 1][j], T[i][j - 1]);
        }
      }
    }
  }


  Input:
const str = "AABEBCDD";
const n = str.length;

  // lookup table stores already solved subproblems solution,
const T = new Array(n + 1)
for(let i = 0; i < T.length; i++){
  T[i] = new Array(n + 1).fill(0);
}

// fill lookup table
LRSLength(str, T);
 
// find the longest repeating subsequence
console.log(LRS(str, n, n, T));

Output:
"ABD"