```js
/*
Input : test
Output : tesu
Explanation : The last character 't' is changed to 'u'.
Input : xyz
Output : xzz
Explanation : Since we can't increase last character, 
we increment previous character.
Input :  z
Output : za
Explanation : If string is empty, we return ‘a’. If string contains all characters as ‘z’, we append ‘a’ at the end.
Otherwise we find first character from end which is not z and increment it.
*/

function nextWord(s) { 
  
    // If string is empty. 
    if (s == "") 
        return "a"; 
  
    // Find first character from right 
    // which is not z. 
  
    let i = s.length - 1; 
    while (s[i] == 'z' && i >= 0) 
        i--; 
  
    // If all characters are 'z', append 
    // an 'a' at the end. 
    if (i == -1) 
        s = s + 'a'; 
  
    // If there are some non-z characters 
    else
        s[i] = String.fromCharCode(s[i] 
            .charCodeAt(0) + 1); 
  
    return s.join(''); 
} 
  
// Driver code 
let str = "abcd".split(''); 
console.log(nextWord(str));