```js
let permute = (str, left = 0, right = str.length - 1) => {
  //If left index is equal to right index
  //Print the string permutation
  if (left == right) {
    console.log(str);
  } else {
    for (let i = left; i <= right; i++) {
      //Swap the letters of the string
      str = swap(str, left, i);
      //Generate the permutation with swapped letters
      permute(str, left + 1, right);
      //Restore the letters back to their position
      str = swap(str, left, i);
    }
  }
};

//Function to swap the letters of the string
let swap = (str, left, right) => {
  let arr = str.split("");
  [arr[left], arr[right]] = [arr[right], arr[left]];
  return arr.join("");
};

Input: permute("AB");
permute("ABC");

Output: "AB";
("BA");

("ABC");
("ACB");
("BAC");
("BCA");
("CBA");
("CAB");
```

The permutation code is almost entirely correct and successfully generates all permutations, but it contains a subtle efficiency flaw caused by reassigning the string in the loop and backtracks in an unusual order for inputs longer than 3 characters.

Here is a breakdown of how the code behaves and how to fix it:

### The Bug in Backtracking

Strings in JavaScript are immutable. Because `swap()` returns a new string, reassigning `str = swap(...)` inside the loop causes subsequent iterations to operate on an already modified string rather than resetting to the original state for that level of recursion.

While `permute("ABC")` happened to produce all 6 permutations, the backtrack step swaps back using the modified `str`, causing duplicate paths or unexpected order for longer inputs (e.g., `"ABCD"`).

---

### Recommended Fix

Instead of reassigning the string variable during backtracking, perform the swaps using an array of characters, or pass the swapped string directly into the recursive call:

```js
let permute = (str, left = 0, right = str.length - 1) => {
  if (left === right) {
    console.log(str);
    return;
  }

  for (let i = left; i <= right; i++) {
    // Pass the swapped string directly without overwriting 'str'
    let swappedStr = swap(str, left, i);
    permute(swappedStr, left + 1, right);
  }
};

let swap = (str, i, j) => {
  let arr = str.split("");
  [arr[i], arr[j]] = [arr[j], arr[i]];
  return arr.join("");
};

// Execution
permute("ABC");

```

### Alternative: In-Place Array Mutation (Most Efficient)

To avoid creating multiple array copies with `.split("")` and `.join("")` on every swap, convert the string to an array once at the beginning:

```js
let permute = (str) => {
  let arr = str.split("");

  let helper = (left, right) => {
    if (left === right) {
      console.log(arr.join(""));
      return;
    }

    for (let i = left; i <= right; i++) {
      [arr[left], arr[i]] = [arr[i], arr[left]]; // Swap
      helper(left + 1, right);                  // Recurse
      [arr[left], arr[i]] = [arr[i], arr[left]]; // Backtrack
    }
  };

  helper(0, arr.length - 1);
};

permute("ABC");

```

To handle duplicate characters and prevent redundant permutations (e.g., generating `"AAB"` multiple times for input `"AAB"`), you need to prevent swapping the same character into the current position twice within the same recursion frame.

Here are the two best ways to do this:

### Option 1: Track Seen Characters at the Current Level (HashSet)

Use a `Set` inside the loop for the current level of recursion. Before swapping index `left` with index `i`, check if the character at index `i` has already been placed at index `left`.

```js
let permuteUnique = (str) => {
  let arr = str.split("");

  let helper = (left, right) => {
    if (left === right) {
      console.log(arr.join(""));
      return;
    }

    let seen = new Set(); // Tracks characters placed at 'left' in this branch

    for (let i = left; i <= right; i++) {
      let char = arr[i];

      // Skip if this character was already swapped into position 'left'
      if (seen.has(char)) continue;
      seen.add(char);

      [arr[left], arr[i]] = [arr[i], arr[left]]; // Swap
      helper(left + 1, right);                  // Recurse
      [arr[left], arr[i]] = [arr[i], arr[left]]; // Backtrack
    }
  };

  helper(0, arr.length - 1);
};

// Test with duplicates
permuteUnique("AAB");
// Output:
// "AAB"
// "ABA"
// "BAA"

```

---

### Option 2: Frequency Map (Used by LeetCode / Production)

Sort the characters first or create a frequency count map. This approach generates permutations in lexicographical (alphabetical) order and avoids swapping entirely by building the string character by character.

```js
let permuteUniqueFreq = (str) => {
  // Build frequency map of characters
  let freqMap = {};
  for (let char of str) {
    freqMap[char] = (freqMap[char] || 0) + 1;
  }

  let helper = (currentPermutation) => {
    if (currentPermutation.length === str.length) {
      console.log(currentPermutation);
      return;
    }

    for (let char in freqMap) {
      if (freqMap[char] > 0) {
        freqMap[char]--; // Choose
        helper(currentPermutation + char); // Recurse
        freqMap[char]++; // Backtrack
      }
    }
  };

  helper("");
};

permuteUniqueFreq("AAB");
// Output:
// "AAB"
// "ABA"
// "BAA"

```

### Which one should you use?

* **Option 1 (HashSet):** Best if you want to keep your existing swap-based structure with minimal modifications.
* **Option 2 (Frequency Map):** Best for performance when strings have many duplicate characters, as it naturally produces sorted, unique results without extra set lookups during swapping.

To return an array of permutations instead of printing them, pass a collector array down through the recursion (or collect results using an accumulator) and push the complete string into it at the base case.

Here is how to update both options:

### Updated Option 1: In-Place Swap with Collector Array

```js
let permuteUnique = (str) => {
  let result = [];
  let arr = str.split("");

  let helper = (left, right) => {
    if (left === right) {
      result.push(arr.join("")); // Push result instead of logging
      return;
    }

    let seen = new Set();

    for (let i = left; i <= right; i++) {
      let char = arr[i];

      if (seen.has(char)) continue;
      seen.add(char);

      [arr[left], arr[i]] = [arr[i], arr[left]]; // Swap
      helper(left + 1, right);                  // Recurse
      [arr[left], arr[i]] = [arr[i], arr[left]]; // Backtrack
    }
  };

  helper(0, arr.length - 1);
  return result; // Return the collected array
};

// Usage
const permutations = permuteUnique("AAB");
console.log(permutations); 
// Output: ['AAB', 'ABA', 'BAA']

```

---

### Updated Option 2: Frequency Map with Collector Array

```js
let permuteUniqueFreq = (str) => {
  let result = [];
  let freqMap = {};

  for (let char of str) {
    freqMap[char] = (freqMap[char] || 0) + 1;
  }

  let helper = (currentPermutation) => {
    if (currentPermutation.length === str.length) {
      result.push(currentPermutation); // Push result instead of logging
      return;
    }

    for (let char in freqMap) {
      if (freqMap[char] > 0) {
        freqMap[char]--; // Choose
        helper(currentPermutation + char); // Recurse
        freqMap[char]++; // Backtrack
      }
    }
  };

  helper("");
  return result; // Return the collected array
};

// Usage
const permutations = permuteUniqueFreq("AAB");
console.log(permutations);
// Output: ['AAB', 'ABA', 'BAA']

```
