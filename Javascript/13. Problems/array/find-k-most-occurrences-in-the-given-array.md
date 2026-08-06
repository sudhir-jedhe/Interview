```js
/*
Input: arr[] = {3, 1, 4, 4, 5, 2, 6, 1}, K = 2
Output: 4 1
Explanation:
Frequency of 4 = 2, Frequency of 1 = 2
These two have the maximum frequency and 4 is larger than 1.
refer
Input: arr[] = {7, 10, 11, 5, 2, 5, 5, 7, 11, 8, 9}, K = 4
Output: 5 11 7 10
Explanation: 
Frequency of 5 = 3, Frequency of 11 = 2, Frequency of 7 = 2, Frequency of 10 = 1
These four have the maximum frequency and 5 is largest among rest.
*/


function frequentElements(arr, k) { 
	const frequencyMap = new Map(); 
	
	// Count the occurrences of 
	// each element in the array 
	for (let i = 0; i < arr.length; i++) { 
		const num = arr[i]; 
		frequencyMap.has(num) 
			? frequencyMap. 
				set(num, frequencyMap.get(num) + 1) 
			: frequencyMap.set(num, 1); 
	} 
	
	// Sort the entries in the frequency 
	// map by frequency in descending order 
	const sortedEntries = 
		[...frequencyMap.entries()] 
		.sort((a, b) => b[1] - a[1]); 
	const result = []; 
	
	// Extract the first k elements 
	// from the sorted entries 
	for (let i = 0; i < k && 
			i < sortedEntries.length; i++) { 
			result.push(sortedEntries[i][0]); 
	} 
	return result; 
} 
const arr = [3, 1, 4, 4, 5, 2, 6, 1]; 
const k = 2; 
const kMostFrequent = frequentElements(arr, k); 
console.log(...kMostFrequent);



/*************************** */


function frequentElements(arr, k) { 
	const frequencyMap = 
		arr.reduce((map, num) => { 
			map.set(num, (map.get(num) || 0) + 1); 
			return map; 
		}, new Map()); 
		
	// Sort the entries in the frequency 
	// map by frequency in descending order 
	const sortedEntries = 
		[...frequencyMap.entries()] 
			.sort((a, b) => b[1] - a[1]); 
	const result = []; 
	for (const [element, _] of 
		sortedEntries.slice(0, k)) { 
		result.push(element); 
	} 
	return result; 
} 
const arr = [3, 1, 4, 4, 5, 2, 6, 1]; 
const k = 2; 
const kMostFrequent = 
	frequentElements(arr, k); 
console.log(...kMostFrequent);
