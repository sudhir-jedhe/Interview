```js
const chop = (str, size = str.length) => {
  const arr = [];
  let i = 0;

  //iterate the string
  while (i < str.length) {
    //slice the characters of given size
    //and push them in output array
    arr.push(str.slice(i, i + size));
    i = i + size;
  }

  return arr;
};

Input: console.log(chop("javascript", 3));

Output: ["jav", "asc", "rip", "t"];

str.match(/.{1,n}/g); // Replace n with the size of the substring

str.match(/(.|[\r\n]){1,n}/g); // Replace n with the size of the substring

const chop = (str, size = str.length) => {
  return str.match(new RegExp(".{1," + size + "}", "g"));
};
```
