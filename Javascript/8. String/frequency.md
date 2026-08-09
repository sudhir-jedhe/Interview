```js
const text = "Hello, World!";

// Convert to lowercase, filter out non-letters, and count
const frequency = text
  .toLowerCase()
  .replace(/[^a-z]/g, '') // Keep letters only
  .split('')
  .reduce((acc, char) => {
    acc[char] = (acc[char] || 0) + 1;
    return acc;
  }, {});

console.log(frequency);
// Output: { h: 1, e: 1, l: 3, o: 2, w: 1, r: 1, d: 1 }


const text = "Hello, World!";
const frequency = {};

for (const char of text.toLowerCase()) {
  // Check if character is an ASCII letter (a-z)
  if (/[a-z]/.test(char)) {
    frequency[char] = (frequency[char] || 0) + 1;
  }
}

console.log(frequency);
// Output: { h: 1, e: 1, l: 3, o: 2, w: 1, r: 1, d: 1 }



const frequency = { h: 1, e: 1, l: 3, o: 2, w: 1, r: 1, d: 1 };

// 1. Convert object to array of [key, value] entries
// 2. Sort by value in descending order (b[1] - a[1])
// 3. Rebuild object with Object.fromEntries()
const sortedFrequency = Object.fromEntries(
  Object.entries(frequency).sort((a, b) => b[1] - a[1])
);

console.log(sortedFrequency);
// Output: { l: 3, o: 2, h: 1, e: 1, w: 1, r: 1, d: 1 }



const text = "Hello world! Hello again, world. Welcome to the world of JavaScript.";

// 1. Normalize: convert to lowercase and extract words via regex
const words = text.toLowerCase().match(/\b[\w']+\b/g) || [];

// 2. Count frequency using reduce
const wordCounts = words.reduce((acc, word) => {
  acc[word] = (acc[word] || 0) + 1;
  return acc;
}, {});

console.log(wordCounts);
// Output: { hello: 2, world: 3, again: 1, welcome: 1, to: 1, the: 1, of: 1, javascript: 1 }



const text = "Hello world! Hello again, world.";

// Extract clean words
const words = text.toLowerCase().match(/\b\w+\b/g) || [];
const wordCounts = {};

for (const word of words) {
  wordCounts[word] = (wordCounts[word] || 0) + 1;
}

console.log(wordCounts);
// Output: { hello: 2, world: 2, again: 1 }
