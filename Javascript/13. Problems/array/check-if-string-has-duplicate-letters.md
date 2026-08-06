```js
let containsDuplicates = (str) => {
  let set = new Set();

  //convert str to lowercase
  //Remove this if you want to check for incase-sensitive strings
  str = str.toLowerCase();

  //If it is not whitespace the check if aplhabet is present or not
  for (let i = 0; i < str.length; i++) {
    if (str[i] != " ") {
      if (set.has(str[i])) {
        return true;
      }

      set.add(str[i]);
    }
  }

  return false;
};

Input: "learnersbucket";
("abcdefghijk");
("I Love learnersbucket");

Output: true;
false;
true;


/************************** */
For case-sensitive letters
let containsDuplicates = (str) => {
  let set = new Set();

  //If it is not whitespace the check if aplhabet is present or not
  for (let i = 0; i < str.length; i++) {
    if (str[i] != " ") {
      if (set.has(str[i])) {
        return true;
      }

      set.add(str[i]);
    }
  }

  return false;
};
