```js
let str = "learnersbucket";
let strArray = str.split("");
console.log(strArray);
// ["l", "e", "a", "r", "n", "e", "r", "s", "b", "u", "c", "k", "e", "t"]

// split(separator, limit)

let str = "is javascript wierd language";
let strArray = str.split(" ", 2);
console.log(strArray);
//["is", "javascript"]

let str = "is,javascript,wierd,language";
let strArray = str.split(",");

console.log(strArray);
//["is", "javascript", "wierd", "language"]

console.log(str);
//"is,javascript,wierd,language"

//iterative approch

let str = "learnersbucket";
let strArray = [];
for (let char of str) {
  strArray.push(char);
}

console.log(strArray);
//["l", "e", "a", "r", "n", "e", "r", "s", "b", "u", "c", "k", "e", "t"]

let str = "is,javascript,wierd,language";
let strArray = [];

//Temp string
let temp = "";

for (let char of str) {
  //if current character is ,
  if (char === ",") {
    //then push the substring
    strArray.push(temp);
    temp = "";
    continue;
  }

  //Create substring
  temp += char;
}

//Push the last substring
strArray.push(temp);

console.log(strArray);
//["is", "javascript", "wierd", "language"]
```
