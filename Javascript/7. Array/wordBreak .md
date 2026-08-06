```js
Input:
s = "applepenapple";
words = ["apple", "pen"];

s = "catsandog";
words = ["cats", "dog", "sand", "and", "cat"]

Output:
true
false

```

```js

const wordBreak = (s, wordDict) => {
    // Initiate the start index to run the loop
    let start = 0;

    //Recursive functions
    return wordBreakRecursive(s, wordDict, start);
};



const wordBreakRecursive = (s, wordDict, start) =>{

    // Create a wordDic Set * not necessary we can use array itself
    let wordSet = new Set(wordDict);

    // Check for the start and s.length
    if(start == s.length) {
        return true
    }

    // run the loop from start + 1 because last index of previous recursive plus + 1 to move forward
    // ex - apple which ends at index 4 so to run the loop which should start at code which is index 5
    for(let end = start + 1; end <= s.length; end++) {

        // Check for substring exist in word Dic and also check for recursive return true where we pass end index which is start of recursive function
        if(wordSet.has(s.substring(start, end)) && wordBreakRecursive(s, wordDict, end)) {
            return true;
        }
    }

    // Return false if we did not find any match and recursive function return false
    return false;

}

```
```js

Input
console.log(wordBreak("applepenapple",["apple", "pen"]);

Output:
true

```
```js

const wordBreak = (s, wordDict) => {
    // Initiate the start index to run the loop
    let start = 0;

    // Create a memo array
    const memo = new Array(s.length);

    //Recursive functions
    return wordBreakRecursive(s, wordDict, start, memo);
};

const wordBreakRecursive = (s, wordDict, start, memo) => {

    // Create a wordDic Set * not necessary we can use array itself
    let wordSet = new Set(wordDict);

    // Check for memo value
    // If memo value exist than we can directly keep the recursive and return the value so that we don't need to repeat the recursive path where we already pass
    if(memo[start] !== undefined) {
        return memo[start];
    }

    // Check for the start and s.length
    if(start == s.length) {
        return true
    }

    // run the loop from start + 1 because last index of previous recursive plus + 1 to move forward
    // ex - apple which ends at index 4 so to run the loop which should start at code which is index 5 
    for(let end = start + 1; end <= s.length; end++) {

        // Check for substring exist in word Dic and also check for recursive return true where we pass end index which is start of recursive function
        if(wordSet.has(s.substring(start, end)) && wordBreakRecursive(s, wordDict, end, memo)) {
            return memo[start] = true;
        }
    }
	// Return the memo for start index if did not match
    return memo[start] = false;

}

```
```js


const wordBreak = (s, wordDict) => {
    // Create a wordSet for faster lookup
    const wordSet = new Set(wordDict);
    
    // Create a memo array
    const memo = new Array(s.length);

    // Recursive function call
    return wordBreakRecursive(s, wordSet, 0, memo);
};

const wordBreakRecursive = (s, wordSet, start, memo) => {
    // Check for memo value
    if (memo[start] !== undefined) {
        return memo[start];
    }

    // If start reaches the end of the string, return true
    if (start === s.length) {
        return true;
    }

    // Loop through possible substrings from start to end
    for (let end = start + 1; end <= s.length; end++) {
        // Check if substring exists in wordDict and recursively call for the rest of the string
        if (wordSet.has(s.substring(start, end)) && wordBreakRecursive(s, wordSet, end, memo)) {
            return memo[start] = true;
        }
    }

    // Memoize and return false if no valid segmentation is found
    return memo[start] = false;
};

// Test Cases
console.log(wordBreak("applepenapple", ["apple", "pen"]));  // true
console.log(wordBreak("catsandog", ["cats", "dog", "sand", "and", "cat"]));  // false
```
