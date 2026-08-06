```js
// Function to count the frequency of letters in a chunk of text
function countFrequency(text) {
  const frequency = {};
  for (let char of text) {
    if (/[a-zA-Z]/.test(char)) {
      char = char.toLowerCase();
      frequency[char] = (frequency[char] || 0) + 1;
    }
  }
  return frequency;
}

// Listen for messages from the main thread
self.onmessage = function (event) {
  const { text } = event.data;
  const frequency = countFrequency(text);
  // Send the frequency count back to the main thread
  self.postMessage(frequency);
};
```
