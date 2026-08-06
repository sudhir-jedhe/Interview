```js
function splitByInitialCapital(str) {
  const parts = [];
  let currentWord = "";

  for (let i = 0; i < str.length; i++) {
    const char = str[i];

    // Check if the character is uppercase and not the first character
    if (char === char.toUpperCase() && i > 0) {
      parts.push(currentWord);
      currentWord = char;
    } else {
      currentWord += char;
    }
  }

  // Push the last accumulated word
  parts.push(currentWord);

  // Filter out any empty strings (in case there were consecutive capital letters)
  return parts.filter((part) => part !== "");
}

const name = "MyNameIsKumar";
const parts = splitByInitialCapital(name);
console.log(parts); // Output: ["My", "Name", "Is", "Kumar"]

/******************************************************************** */

const name = "MyNameIsKumar";

function insertSpaces(str) {
  let result = "";
  for (let i = 0; i < str.length; i++) {
    if (i > 0 && str[i] === str[i].toUpperCase()) {
      result += " ";
    }
    result += str[i];
  }
  return result;
}

const result = insertSpaces(name);
console.log(result);

/*************************************** */

const name = "MyNameIsKumar";

// Split the string based on initial capital letters
const formattedName = name.replace(/([A-Z])/g, " $1").trim();

console.log(formattedName); // Output: "My Name Is Kumar"

/******************************************** */

function splitByInitialCapital(str) {
  return str.match(/[A-Z][a-z]*/g) || [];
}

const name = "MyNameIsKumar";
const parts = splitByInitialCapital(name);
console.log(parts); // Output: ["My", "Name", "Is", "Kumar"]

/************************************************** */

function splitByInitialCapital(str) {
  return str.split("").reduce(
    (parts, char, index) => {
      if (char === char.toUpperCase() && index > 0) {
        parts.push("");
      }
      parts[parts.length - 1] += char;
      return parts;
    },
    [""],
  );
}

const name = "MyNameIsKumar";
const parts = splitByInitialCapital(name);
console.log(parts); // Output: ["My", "Name", "Is", "Kumar"]

/************************************************ */

function splitByInitialCapital(str) {
  const parts = [];
  let currentWord = "";

  for (let i = 0; i < str.length; i++) {
    const char = str[i];

    // Check if the character is uppercase and not the first character
    if (char === char.toUpperCase() && i > 0) {
      parts.push(currentWord);
      currentWord = char;
    } else {
      currentWord += char;
    }
  }

  // Push the last accumulated word
  parts.push(currentWord);

  // Filter out any empty strings (in case there were consecutive capital letters)
  return parts.filter((part) => part !== "");
}

const name = "MyNameIsKumar";
const parts = splitByInitialCapital(name);
console.log(parts); // Output: ["My", "Name", "Is", "Kumar"]
```
