```js
Input: "How can mirrors be real if our eyes aren't real";

Output: "How Can Mirrors Be Real If Our Eyes Aren't Real";

let toJadenCase = (str) => {
  //create an array of words
  let x = str.split(" ");

  //create an empty array to store the converted words
  let y = [];

  //loop through each words
  for (let i = 0; i < x.length; i++) {
    //splite each words to an array of characters
    let s = x[i].split("");

    //convert the first letter to uppercase
    let temp = s[0];
    s[0] = temp.toUpperCase();

    //push the converted word
    y.push(s.join(""));
  }
  //Join the converted words and return the string
  return y.join(" ");
};

/************************** */
let toJadenCase = (str) => {
  return str
    .split(" ")
    .map(function (word) {
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(" ");
};

/************************************** */
let toJadenCase = (str) => {
  return str.replace(/(^|\s)[a-z]/g, (x) => {
    return x.toUpperCase();
  });
};
