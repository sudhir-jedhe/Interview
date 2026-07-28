```js
// Input : vec[] = {1, 7, 15, 29, 11, 9}
// Output : [9, 15] [1, 7, 11, 29]
// Explanation : Average of the both the subsets is 12

// Input : vec[] = {1, 2, 3, 4, 5, 6}
// Output : [1, 6] [2, 3, 4, 5].
// Explanation : Another possible solution is [3, 4] [1, 2, 5, 6],
// but print the  solution whose first subset is lexicographically
// smallest.

// JS program to Partition an array of
// non-negative integers into two subsets
// such that average of both the subsets are equal

let dp = [];
let res = [];
let original = [];
let total_size;

// Function that returns true if it is possible to
// use elements with index = ind to construct a set of s
// ize = curr_size whose sum is curr_sum.
function possible(index, curr_sum, curr_size) {
  // base cases
  if (curr_size == 0) return curr_sum == 0;
  if (index >= total_size) return false;

  // Which means curr_sum cant be found for curr_size
  if (dp[index][curr_sum][curr_size] == false) return false;

  if (curr_sum >= original[index]) {
    res.push(original[index]);
    // Checks if taking this element at
    // index i leads to a solution
    if (possible(index + 1, curr_sum - original[index], curr_size - 1))
      return true;

    res.pop();
  }
  // Checks if not taking this element at
  // index i leads to a solution
  if (possible(index + 1, curr_sum, curr_size)) return true;

  // If no solution has been found
  dp[index][curr_sum][curr_size] = false;
  return dp[index][curr_sum][curr_size];
}

// Function to find two Partitions having equal average
function partition(Vec) {
  // Sort the vector
  Vec.sort();
  original = [];
  original = Vec;
  dp = [];
  res = [];

  let total_sum = 0;
  total_size = Vec.length;

  for (var i = 0; i < total_size; ++i) total_sum += Vec[i];

  // building the memoization table
  dp = new Array(original.length);
  for (var i = 0; i < original.length; i++) {
    dp[i] = new Array(total_sum + 1);
    for (var j = 0; j <= total_sum; j++) {
      dp[i][j] = new Array(total_size).fill(true);
    }
  }

  for (var i = 1; i < total_size; i++) {
    // Sum_of_Set1 has to be an integer
    if ((total_sum * i) % total_size != 0) continue;
    var Sum_of_Set1 = (total_sum * i) / total_size;

    // We build our solution vector if its possible
    // to find subsets that match our criteria
    // using a recursive function
    if (possible(0, Sum_of_Set1, i)) {
      // Find out the elements in Vec, not in
      // res and return the result.
      var ptr1 = 0,
        ptr2 = 0;
      var res1 = res;
      var res2 = [];
      while (ptr1 < Vec.length || ptr2 < res.length) {
        if (ptr2 < res.length && res[ptr2] == Vec[ptr1]) {
          ptr1++;
          ptr2++;
          continue;
        }
        res2.push(Vec[ptr1]);
        ptr1++;
      }

      let ans = [];
      ans.push(res1);
      ans.push(res2);
      return ans;
    }
  }
  // If we havent found any such subset.
  return -1;
}

// Driver code
let Vec = [1, 7, 15, 29, 11, 9];

let sol = partition(Vec);

console.log(sol);
