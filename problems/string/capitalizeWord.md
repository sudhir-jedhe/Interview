```js
export const capitaliseWord = (word) => {
  return word.charAt(0).toUpperCase() + word.slice(1);
};

export const capitaliseWord = (word) => {
  return `${word[0].toUpperCase()}${word.slice(1)}`;
};

capitaliseWord("hello"); // Output: 'Hello'
capitaliseWord("mom"); // Output: 'Mom'
capitaliseWord("dAD"); // Output: 'DAD'
