```js
function mostUsedWord(text, bannedWords) {
    const wordCounts = {};
    const words = text.toLowerCase().match(/\w+/g);
  
    const banned = bannedWords || [];
  
    for (const word of words) {
      if (!banned.includes(word)) {
        wordCounts[word] = (wordCounts[word] || 0) + 1;
      }
    }
  
    let mostFrequentWord = '';
    let maxCount = 0;
    for (const [word, count] of Object.entries(wordCounts)) {
      if (count > maxCount) {
        mostFrequentWord = word;
        maxCount = count;
      }
    }
  
    return mostFrequentWord;
  }




  /******************************** */
  In this question, from a given paragraph return the most frequent word.

Functional Requirements
Words in the paragraph are not case sensitive.
The answer should be returned in lowercase.
If the second argument is provided i.e. list of banned words then return the most frequent word that is not in the list of banned words.
Syntax
mostUsedWord(text, bannedWords);
Arguments
text (String): The text where we need to perform the search.
bannedWords? (Array): The list of banned words. This is an optional argument.
Returns
String: Returns the most used word in lowercase.
Examples
const text = 'Bob hit a ball, the hit ball flew far after it was hit.';

const answer = mostUsedWord(text); 
// answer => hit 
const text = 'Bob hit a ball, the hit ball flew far after it was hit.';
const bannedWords = ['hit'];

const answer = mostUsedWord(text, bannedWords);
// answer => ball



/**************************** */

function mostUsedWord(text, bannedWords) {
    if (!text || typeof text !== 'string') {
      throw new TypeError("Invalid input: 'text' parameter must be a non-empty string.");
    }
  
    const newString = text.toLowerCase().replace(/[.,]/g, "");
    const wordsList = newString.split(" ");
    const banned = bannedWords || [];
    const frequencyMap = new Map();
  
    for (let word of wordsList) {
      if (!banned.includes(word)) {
        if (frequencyMap.has(word)) {
          frequencyMap.set(word, frequencyMap.get(word) + 1);
        } else {
          frequencyMap.set(word, 1);
        }
      }
    }
  
    let max_val = Number.MIN_SAFE_INTEGER;
    let mostUsedWord = "";
  
    for (const [word, count] of frequencyMap) {
      if (count > max_val) {
        max_val = count;
        mostUsedWord = word;
      }
    }
  
    return mostUsedWord;
  }

  /**************************** */

  function mostUsedWord(text, bannedWords) {
    const validCharactersforWordRegex = /^[a-zA-Z]+$/;
  
    if(!text) {
      throw new TypeError();
    }
    const record = {};
      let currentWord = "";
      for(let i = 0; i < text.length; i++) {
        if(validCharactersforWordRegex.test(text[i])) {
            currentWord += text[i].toLowerCase();
        }else if(bannedWords?.includes(currentWord)) {
          currentWord = ""
        } else if(currentWord) {
           record[currentWord] ? (record[currentWord] += 1) : (record[currentWord] = 1);
           currentWord = ""
        } 
      }
      let max = 0;
      let mostUsedWord = "";
  
      Object.keys(record).forEach(item => {
        if(record[item] > max){
          max = record[item];
          mostUsedWord = item;
        }
      });
     return mostUsedWord;
  }

  /******************************  */

  
function mostUsedWord(text, bannedWords) {

  if(!text || text.trim() === "") throw TypeError("Invalid");
  // write your code below
  let count={}
  
  text.split(" ").forEach((item)=>{
    let pureItem = item.replace(/[^a-zA-Z0-9]/g,'').trim().toLowerCase();
    if(!bannedWords || bannedWords.indexOf(pureItem) == -1){
      let pre = count[pureItem] ?? 0;
      count = {
        ...count,
        [pureItem]:pre+1
      }
    }
  })

  let ans = '';
  Object.entries(count).forEach(([key,value])=>{
    if(ans == '' || count[ans] < value)
      ans = key;
  })
  return ans;
  
}