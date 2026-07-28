```js
/*

    Input: words= ["sss", "mmm", "tyu", "abc"];
                pattern = "aaa"
    Output: ["sss" "mmm"]
    Explanation: sss and mmm have,similar pattern.
    Input: words = ["123", "112", "456", "133"];
                pattern = "mno"
    Output: ["123" "456"]
    Explanation: 123 and 456 have,similar pattern.
*/

// JavaScript program to encode a string 

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


/***************************** */

// Function to check if a pattern matches a word 
function isPatternMatch(pattern, word) { 

	// Check if the lengths of the pattern 
	// and word are different, if so, they cannot match 
	if (pattern.length !== word.length) { 
		return false; 
	} 
	
	// Create maps to store mappings from characters 
	// in pattern to characters in word and vice versa 
	const patternToWordMap = new Map(); 
	const wordToPatternMap = new Map(); 
	
	// Iterate through each character 
	// in the pattern and word 
	for (let i = 0; i < pattern.length; i++) { 
		const charInPattern = pattern[i]; 
		const charInWord = word[i]; 
		
		// Check if the character in the pattern 
		// is already mapped to a character in the word 
		if (patternToWordMap.has(charInPattern) 
			&& patternToWordMap.get(charInPattern) 
			!== charInWord) { 
			return false; // Pattern doesn't match the word 
		} 
		
		// Check if the character in the word is 
		// already mapped to a character in the pattern 
		if (wordToPatternMap.has(charInWord) 
			&& wordToPatternMap.get(charInWord) 
			!== charInPattern) { 
			return false; // Pattern doesn't match the word 
		} 
		
		// Create mappings for the 
		// character in the pattern and word 
		patternToWordMap 
			.set(charInPattern, charInWord); 
		wordToPatternMap 
			.set(charInWord, charInPattern); 
	} 
	return true; // Pattern matches the word 
} 

// Function to find and print words 
// in the dictionary that match the given pattern 
function findMatchingWords(dictionary, pattern) { 
	let result = ""; 
	
	// Iterate through each word in the dictionary 
	for (let word of dictionary) { 
	
		// Check if the word matches the pattern 
		if (isPatternMatch(pattern, word)) { 
		
		// Add matching words to the result 
			result += word + " "; 
		} 
	} 
	if (result === "") { 
		console.log("No matches found."); 
	} else { 
	
	// Print the matching words 
		console.log(result); 
	} 
} 

// Driver code 
let wordDictionary = new Set(); 
wordDictionary.add("aaa"); 
wordDictionary.add("bbb"); 
wordDictionary.add("ccc"); 
wordDictionary.add("xyr"); 
let inputPattern = "nnn"; 
findMatchingWords(wordDictionary, inputPattern)

