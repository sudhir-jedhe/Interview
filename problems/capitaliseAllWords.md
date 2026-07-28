```js
export const capitaliseAllWords = (input) => {
  if (!input) return "";
  return input
    .split(" ")
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(" ");
};

/************************ */
export const capitaliseAllWords = (input) => {
  if (!input) return "";

  let result = "";
  let words = input.split(" ");
  for (let i = 0; i < words.length; i++) {
    result += words[i][0].toUpperCase() + words[i].slice(1);
    if (i < words.length - 1) {
      result += " ";
    }
  }
  return result;
};
