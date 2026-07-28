```js
/**
 * 
 * Input: words= ["sss", "mmm", "tyu", "abc"];
            pattern = "aaa"
Output: ["sss" "mmm"]
Explanation: sss and mmm have,similar pattern.
Input: words = ["123", "112", "456", "133"];
            pattern = "mno"
Output: ["123" "456"]
Explanation: 123 and 456 have,similar pattern.
 */


JavaScript program to encode a string 
  
// Function to encode a given string 
function encodeString(inputString) { 
    let characterMap = new Map(); 
    let encodedString = ""; 
    let uniqueCharacterIndex = 0; 
  
    /* Iterate through each character 
       in the given string */
    for (let character of inputString) { 
      
        // If the character is encountered for 
        // the first time, assign a unique number to it 
        if (!characterMap.has(character)) { 
            characterMap. 
                set(character, uniqueCharacterIndex++); 
        } 
          
        // Append the assigned number to the encoded string 
        encodedString += characterMap.get(character); 
    } 
    return encodedString; 
} 
  
/* 
    Function to find and print all words  
    in the dictionary that match the  
    given pattern, where each character  
    in the pattern is uniquely mapped 
    to a character in the dictionary 
*/
function findMatchingWords(wordList, pattern) { 
  
    // Calculate the length of the pattern 
    let patternLength = pattern.length; 
      
    // Encode the pattern into a hash 
    let patternHash = encodeString(pattern); 
      
    // Iterate through each word in the wordList 
    for (let word of wordList) { 
      
        // If the length of the word matches the pattern 
        // and the encoded word matches the pattern's hash, 
        // print the word 
        if (word.length === patternLength 
            && encodeString(word) === patternHash) { 
            console.log(word); 
        } 
    } 
} 
  
// Driver code 
let wordList = 
    ["123", "122", "155", "177"]; 
let pattern = "rss"; 
findMatchingWords(wordList, pattern);


/******************************************************* */