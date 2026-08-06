```js
function alpha(str) {
  var arr = str.split("");
  res = arr.sort().join("");
  rws = res.replace(/\s+/g, "");
  return rws;
}

console.log("taking geeksforgeeks portal as a string");
console.log(alpha("geeksforgeeks portal"));

/************************************ */
function alpha(str) {
  var arr = str.split(""); // splits the string
  res = arr.sort().join(""); // sort the array and joins to form a string
  return res; // returns the result
}
console.log("taking geeksforgeeks as a string");
console.log(alpha("geeksforgeeks"));
