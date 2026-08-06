```js
export const reverseSentence = (sentence) => {
  const words = sentence.split(" ");
  const reversedWords = words.reverse();
  const reversedSentence = reversedWords.join(" ");
  return reversedSentence;
};
```
