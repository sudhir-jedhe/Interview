```js
let str = 'I am prashant yadav';
str.split(' '); // splitting at white space
['I', 'am', 'prashant', 'yadav']


let strArr = ['I', 'am', 'prashant', 'yadav'];
strArr.join(' '); // joining with white space
'I am prashant yadav';


let str = 'I am prashant yadav'.split('prashant').join('golu');
console.log(str); // 'I am golu yadav'


String.replace(/EXPR/g, '');  //case sensitive
String.replace(/EXPR/gi, ''); //case insensitive

// Replace case sensitive string
let str = 'String first, string second'.replace(/string/g, 'random');
console.log(str); // 'String first, random second'


// Replace case in-sensitive string
let str = 'String first, string second'.replace(/string/gi, 'random');
console.log(str); // 'random first, random second'

Regular expression efficiency depends upon its implementation so in some cases it can run fast and in some cases it can run slow also they do not perform good with some special characters so it is better to escape them.

let escapeString = (string) => {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }
```
