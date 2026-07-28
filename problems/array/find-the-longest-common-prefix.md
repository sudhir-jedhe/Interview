```js
Given an array of strings we have to find the longest common prefix between them. If there is no prefix then return empty string.

Input: ["flower","flow","flight"]
Output: "fl"

Input: ["dog","racecar","car"]
Output: ""
There is no common prefix among the input strings.


const longestCommonPrefix = (strs) => {
    //If empty array return empty string
    if(strs.length === 0){
        return "";
    }
    
    //To track the prefix
    let lc = "";
    
    //Sort the string in ascending order
    strs.sort((a, b) => ('' + a).localeCompare(b));
    
    //Get the smallest string.
    let smallest = strs[0];
   
    //so that we have to iterate for it only.
    for(let i = 0; i < smallest.length; i++){
          //Get the first letter
          let current = smallest[i];
         
          //Flag to check if prefix is present in the remaining string
          let isPresent = true;
          
         for(let values of strs){
            //Break if different letter
            if(values[i] !== current){
               isPresent = false;
               break;
            }
         }
         
         //Break the loop if no prefix
         if(i === 0 && !isPresent){
             break;
         }
         
         //Add the prefix
         lc += isPresent ? current : ''; 
    }
    
   //return the prefix
   return lc;
};


/****************************** */

const longestCommonPrefix = (strs) => {
    //If empty array
    if(strs.length == 0) {
        return "";
    }
    
    //Get the first word
    let str = strs[0];
    
    //look for prefix in each word
    for (const word of strs) {
        while (word.indexOf(str) !== 0) {
            // remove one character from the end
            str = str.substring(0, str.length - 1);
            if (str === ""){
                break;
            }
        }
    }
    return str;
};


Input:
console.log(longestCommonPrefix(["flower","flow","flight"]));

Output:
"f1"