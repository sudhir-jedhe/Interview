```js
// Input : str = "GeeksforGeeks@123"
// Output : trueput: Yes
// Explanation: The given string contains uppercase, lowercase,
// special characters, and numeric values.
// Input : str = “GeeksforGeeks”
// Output : No
// Explanation: The given string contains only uppercase
// and lowercase characters.

// regex = “^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)” + “(?=.*[-+_!@#$%^&*., ?]).+$”
// where,

// ^ represents the starting of the string.
// (?=.*[a-z]) represent at least one lowercase character.
// (?=.*[A-Z]) represents at least one uppercase character.
// (?=.*\\d) represents at least one numeric value.
// (?=.*[-+_!@#$%^&*., ?]) represents at least one special character.
// . represents any character except line break.
// + represents one or more times.

// JavaScript Program to Check if a string contains
// uppercase, lowercase, special characters and
// numeric values
function isAllCharPresent(str) {
  let pattern = new RegExp(
    "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[-+_!@#$%^&*.,?]).+$"
  );

  if (pattern.test(str)) return true;
  else return false;
  return;
}

// Driver Code
const str = "#GeeksForGeeks123@";

console.log(isAllCharPresent(str));
