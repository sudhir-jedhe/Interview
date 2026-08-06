```js
function isValidURL(url) {
  const urlPattern = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i;
  return urlPattern.test(url);
}

console.log(isValidURL("https://www.geeksforgeeks.org/"));
console.log(isValidURL("https://ide.geeksforgeeks.org/online-html-editor"));
console.log(isValidURL("invalid-url"));

/*************************************************** */

function isValidURL(url) {
  try {
    new URL(url);
    return true;
  } catch (error) {
    return false;
  }
}
console.log(isValidURL("https://www.geeksforgeeks.org/"));
console.log(isValidURL("https://ide.geeksforgeeks.org/online-html-editor"));
console.log(isValidURL("invalid-url"));

/*********************************** */
function isValidURL(url) {
  try {
    const urlObject = new URL(url);

    // Additional checks, if necessary.
    return true;
  } catch (error) {
    return false;
  }
}
console.log(isValidURL("https://www.geeksforgeeks.org/"));
console.log(isValidURL("https://ide.geeksforgeeks.org/online-html-editor"));
console.log(isValidURL("invalid-url"));
