```js
// Input : %welcome' to @geeksforgeek<s
// Output : welcome to geeksforgeeks

/*      ! " # $ % & ' ( ) * + , - . / : ; ? @ [ \ ] ^ _ ` { | } ~   */

function remove(str) {
  return str.replace(/[!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]/g, "");
}
let str = "Welcome, to the geeksforgeeks!!!";
console.log(remove(str));

/******************************** */
function remove(str) {
  let res = "";
  for (let i = 0; i < str.length; i++) {
    let character = str.charAt(i);
    if (!checkPunctuation(character)) {
      res += character;
    }
  }
  return res;
}

function checkPunctuation(char) {
  const punctuation = "!\"#$%&'()*+,-./:;<=>?@[\\]^_`{|}~";
  return punctuation.includes(char);
}
let str = "Welcome, to the geeksforgeeks!!!";
console.log(remove(str));
