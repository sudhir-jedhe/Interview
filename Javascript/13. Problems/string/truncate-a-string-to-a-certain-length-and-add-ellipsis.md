```js
// To truncate a string to a specific length and add an ellipsis (…)
// shortening the string to a predefined character count, indicating that the content continues beyond the truncated portion.

// This is a Geeks f...

function truncateString(str, maxLength) {
  if (str.length > maxLength) {
    return str.slice(0, maxLength - 3) + "...";
  }
  return str;
}

let inputString = "This is a Geeks for geeks article";
let truncatedString = truncateString(inputString, 20);
console.log(truncatedString);

/*************************************** */
function truncateString(str, maxLength) {
  if (str.length > maxLength) {
    return str.substring(0, maxLength - 3) + "...";
  }
  return str;
}

let inputString = "This is a Geeks for geeks article";
let truncatedString = truncateString(inputString, 25);
console.log(truncatedString);

/************************************************ */
function truncateString(str, maxLength) {
  return str.length > maxLength ? `${str.slice(0, maxLength - 3)}...` : str;
}

let inputString = "This is a Geeks for geeks article";
let truncatedString = truncateString(inputString, 30);
console.log(truncatedString);

export const truncateWithEllipsis = (str, n) => {
  if (str.length <= n) {
    return str;
  }

  return str.substring(0, n) + "...";
};
