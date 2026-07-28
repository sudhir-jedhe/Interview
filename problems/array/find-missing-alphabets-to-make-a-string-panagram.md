```js
An algorithm to find the missing alphabets to make a string Panagram.

We will find all the missing alphabets that will make the string panagram and return the missing characters in alphabetical order.

Panagram: A sentence containing every letter in the English alphabet.

let missingAlphabets = (str) => {
    //create a new array and initilize it with 0
    let arr = new Array(26);
    arr.fill(0, 0, 25);
    
    //convert the string to lowercase
    str.toLowerCase();
   
    //Mark the present string as true
    for(let i = 0; i < str.length; i++){
       if (str[i] >= 'a' && str[i] <= 'z') {
            arr[str[i].charCodeAt(0) - 'a'.charCodeAt(0)] = true; 
       }
    }
    
   //Create the string of the missing alphabets
    let missing = '';
    for(let i = 0; i < arr.length; i++){
       if(!arr[i]){
         missing += String.fromCharCode(97 + i);
       }
    }
    
   return missing;
  }

  Input:
console.log(missingAlphabets("Learn just don't study"));
console.log(missingAlphabets("Hi from learnersbucket"));

Output:
"bcfghiklmpqvwxz"
"dghjpqvwxyz"