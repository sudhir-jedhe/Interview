```js
function findSecondMostFrequentElement(arr) {
  let frequencyMap = new Map();

  // Counting frequency of each element
  for (let i = 0; i < arr.length; i++) {
    if (frequencyMap.has(arr[i])) {
      frequencyMap.set(arr[i], frequencyMap.get(arr[i]) + 1);
    } else {
      frequencyMap.set(arr[i], 1);
    }
  }
  let maxFrequency = Number.MIN_SAFE_INTEGER;
  let frequencies = [];

  // Finding the maximum frequency
  for (let [key, value] of frequencyMap) {
    if (value > maxFrequency) {
      maxFrequency = value;
    }
  }

  for (let [key, value] of frequencyMap) {
    if (value !== maxFrequency) {
      frequencies.push(value);
    }
  }
  frequencies.sort((a, b) => a - b);

  // Returning the second most frequent element
  for (let [key, value] of frequencyMap) {
    if (value === frequencies[frequencies.length - 1]) {
      return key;
    }
  }

  return "-1";
}

let arr = ["1", "2", "3", "1", "1", "2"];
let ans = findSecondMostFrequentElement(arr);
console.log(ans);

/************************************************************** */

// Function to find the second most repeated word
function findSecondMostRepeatedWordInArray(words) {
  // Store all the words with their occurrences
  let occurrences = new Map();
  for (let i = 0; i < words.length; i++) {
    if (occurrences.has(words[i])) {
      occurrences.set(words[i], occurrences.get(words[i]) + 1);
    } else {
      occurrences.set(words[i], 1);
    }
  }

  // Find the second largest occurrence
  let firstMax = Number.MIN_VALUE,
    secondMax = Number.MIN_VALUE;
  for (let [key, value] of occurrences) {
    if (value > firstMax) {
      secondMax = firstMax;
      firstMax = value;
    } else if (value > secondMax && value !== firstMax) {
      secondMax = value;
    }
  }

  // Return the word with
  // an occurrence equal to secondMax
  for (let [key, value] of occurrences) {
    if (value === secondMax) {
      return key;
    }
  }
}

// Driver program
let wordsArray = ["a", "b", "c", "a", "a", "b"];
console.log(findSecondMostRepeatedWordInArray(wordsArray));

Input: {
  "1", "2", "1", "1", "2", "3";
}
Output: "2";

Input: {
  "a", "b", "c", "a", "a", "b";
}
Output: "b";
