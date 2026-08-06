// Input: Machine
// Output: True
// Explanation: “Machine” does not have any character repeating, it is an Isogram

// Input : Geek
// Output : False
// Explanation: “Geek” has ‘e’ as repeating character, it is not an Isogram

// Javascript program to check if a given
// string is isogram or not

// Function to check if a given
// string is isogram or not
function is_isogram(str) {
  // Convert the string in lower case letters
  str = str.toLowerCase();
  let len = str.length;

  let arr = str.split("");

  arr.sort();
  for (let i = 0; i < len - 1; i++) {
    if (arr[i] == arr[i + 1]) return false;
  }
  return true;
}

let str1 = "Machine";
if (is_isogram(str1)) {
  document.write("True" + "</br>");
} else {
  document.write("False" + "</br>");
}

let str2 = "isogram";
if (is_isogram(str2)) {
  document.write("True" + "</br>");
} else {
  document.write("False" + "</br>");
}

let str3 = "GeeksforGeeks";
if (is_isogram(str3)) {
  document.write("True" + "</br>");
} else {
  document.write("False" + "</br>");
}

let str4 = "Alphabet";
if (is_isogram(str4)) {
  document.write("True" + "</br>");
} else {
  document.write("False" + "</br>");
}

// This code is contributed by suresh07.
/***************************************** */

// Javascript code to check string is isogram or not

// function to check isogram
function check_isogram(str) {
  let length = str.length;
  let mapHash = new Array(26);
  mapHash.fill(0);

  // loop to store count of chars and
  // check if it is greater than 1
  for (let i = 0; i < length; i++) {
    mapHash[str[i].charCodeAt() - "a".charCodeAt()]++;

    // if count > 1, return false
    if (mapHash[str[i].charCodeAt() - "a".charCodeAt()] > 1) {
      return false;
    }
  }

  return true;
}

let str = "geeks";
let str2 = "computer";

// checking str as isogram
if (check_isogram(str)) document.write("True" + "</br>");
else document.write("False" + "</br>");

// checking str2 as isogram
if (check_isogram(str2)) document.write("True" + "</br>");
else document.write("False" + "</br>");
