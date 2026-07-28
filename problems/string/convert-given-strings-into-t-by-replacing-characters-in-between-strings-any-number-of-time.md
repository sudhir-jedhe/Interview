```js
// Input: arr[] = {“abc”, “abb”, “acc”}, T = “abc”
// Output: Yes
// Explanation:
// Below is one of the possible way to make the all strings in the array to the string T is:

// Remove character at index 2 of the string arr[1](= “abb”) and then insert it at the index 1 of the string arr[2](= “acc”). After this the array modifies to {“abc”, “”ab”, “abcc”}.
// Remove character at index 3 of the string arr[2](= “abcc”) and then insert it at the index 2 of the string arr[1]( = “ab”). After this the array modifies to {“abc”, “”abc”, “abc”}.
// After the above steps, all the strings of the array arr[] are equal to the string T(= abc). Therefore, print Yes.

// Input: arr[] = {“abc”, “bbb”, “ccc”}, T = “abc”
// Output: No

// Javascript program for the above approach

// Function to check if it possible
// to make all the strings equal to
// the string T
function checkIfPossible(N, arr, T) {
  // Stores the frequency of all
  // the strings in the array arr[]
  let freqS = new Array(256).fill(0);

  // Stores the frequency of the
  // string T
  let freqT = new Array(256).fill(0);

  // Iterate over the characters
  // of the string T
  for (let ch of T) {
    freqT[ch.charCodeAt(0) - "a".charCodeAt(0)]++;
  }

  // Iterate in the range [0, N-1]
  for (let i = 0; i < N; i++) {
    // Iterate over the characters
    // of the string arr[i]
    for (let ch of arr[i]) {
      freqS[ch.charCodeAt(0) - "a".charCodeAt(0)]++;
    }
  }

  for (let i = 0; i < 256; i++) {
    // If freqT[i] is 0 and
    // freqS[i] is not 0
    if (freqT[i] == 0 && freqS[i] != 0) {
      return "No";
    }

    // If freqS[i] is 0 and
    // freqT[i] is not 0
    else if (freqS[i] == 0 && freqT[i] != 0) {
      return "No";
    }

    // If freqS[i] is not freqT[i]*N
    else if (freqT[i] != 0 && freqS[i] != freqT[i] * N) {
      return "No";
    }
  }

  // Otherwise, return "Yes"
  return "Yes";
}

// Driver Code

let arr = ["abc", "abb", "acc"];
let T = "abc";
let N = arr.length;
document.write(checkIfPossible(N, arr, T));
