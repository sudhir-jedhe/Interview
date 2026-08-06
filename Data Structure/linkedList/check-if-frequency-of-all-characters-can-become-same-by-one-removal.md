// Input: str = “xyyz”
// Output: Yes
// We can remove character ’y’ from above
// string to make the frequency of each
// character same.

// Input: str = “xyyzz”
// Output: Yes
// We can remove character ‘x’ from above
// string to make the frequency of each
// character same.

// Input: str = “xxxxyyzz”
// Output: No
// It is not possible to make frequency of
// each character same just by removing at
// most one character from above string.

// Javascript program to get same
// frequency character string by
// removal of at most one char
let M = 26;

// Utility method to get index of character
// ch in lower alphabet characters
function getIdx(ch) {
  return ch - "a";
}

// Returns true if all non-zero elements
// values are same
function allSame(freq, N) {
  let same = 0;

  // Get first non-zero element
  let i;
  for (i = 0; i < N; i++) {
    if (freq[i] > 0) {
      same = freq[i];
      break;
    }
  }

  // Check equality of each element with
  // variable same
  for (let j = i + 1; j < N; j++)
    if (freq[j] > 0 && freq[j] != same) return false;

  return true;
}

// Returns true if we can make all character
// frequencies same
function possibleSameCharFreqByOneRemoval(str) {
  let l = str.length;

  // Fill frequency array
  let freq = new Array(M);
  for (let i = 0; i < M; i++) {
    freq[i] = 0;
  }

  for (let i = 0; i < l; i++) freq[getIdx(str[i])]++;

  // If all frequencies are same,
  // then return true
  if (allSame(freq, M)) return true;

  // Try decreasing frequency of all character
  // by one and then check all equality of all
  // non-zero frequencies
  for (let c = "a"; c <= "z"; c++) {
    let i = getIdx(c);

    // Check character only if
    // it occurs in str
    if (freq[i] > 0) {
      freq[i]--;

      if (allSame(freq, M)) return true;

      freq[i]++;
    }
  }
  return false;
}

// Driver code
let str = "xyyzz";

if (possibleSameCharFreqByOneRemoval(str)) document.write("Yes");
else document.write("No");

/********************************************** */

function sameFreq(s) {
  // create two empty maps for storing character
  // frequencies and frequency counts
  let h = new Map();
  let a = new Map();

  // iterate through each character in the input string
  for (let i = 0; i < s.length; i++) {
    // increment the count for the current character in
    // the frequency map
    h.set(s[i], (h.get(s[i]) || 0) + 1);
  }

  // iterate through each key-value pair in the frequency
  // map
  for (let [key, value] of h) {
    // increment the count for the current frequency in
    // the frequency count map
    a.set(value, (a.get(value) || 0) + 1);
  }

  // check if there is only one unique frequency count
  if (a.size === 1) {
    return true;
  }
  // check if there are only two unique frequency counts
  else if (a.size === 2) {
    let list = [];
    let l = [];

    // iterate through each key-value pair in the
    // frequency count map
    for (let [key, value] of a) {
      // add the current frequency and frequency count
      // to their respective vectors
      list.push(key);
      l.push(value);
    }

    // check if there is a single occurrence of a
    // frequency count of 1
    if ((list[1] === 1 && l[1] === 1) || (list[0] === 1 && l[0] === 1)) {
      return true;
    }
    // check if the difference between the two frequency
    // counts is 1
    else if (Math.abs(list[1] - list[0]) === 1) {
      return true;
    } else {
      return false;
    }
  } else {
    return false;
  }
}

let str = "xxxyyz";
if (sameFreq(str)) {
  console.log("YES");
} else {
  console.log("NO");
}
