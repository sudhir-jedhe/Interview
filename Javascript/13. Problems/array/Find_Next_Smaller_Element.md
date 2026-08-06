```js
/*
Input: inputArray=[ 11, 13, 21, 3 ]
Output: 3 3 3 -1
Explanation:
For the rightmost element (3), the next smaller is always -1 since there are no elements to its right.
Element: 3 =>  -1
Now, let's find the ISE for each element:
Element: 11: The next smaller element to its right is 3.
Element: 13: The next smaller element to its right is 3.
Element: 21: The next smaller element to its right is 3.
Element: 3:  The rightmost element, so ISE is -1.

*/

function nextSmallest(inputArray, arrayLength) { 
	let dp = new Array(arrayLength).fill(-1); 

	for (let i = 0; i < arrayLength; i++) { 
		for (let j = i + 1; j < arrayLength; j++) { 
			if ( 
				inputArray[j] < inputArray[i] && 
				(dp[i] === -1 || inputArray[j] > inputArray[dp[i]]) 
			) { 
				dp[i] = j; 
			} 
		} 
	} 
	for (let i = 0; i < arrayLength; i++) { 
		if (dp[i] !== -1) { 
			dp[i] = inputArray[dp[i]]; 
		} 
	} 
	dp[arrayLength - 1] = -1; 
	return dp; 
} 
let inputArr1 = [11, 13, 21, 3]; 
let inputArr2 = [1, 2, 3, 4]; 
console.log( 
	nextSmallest(inputArr1, inputArr1.length) 
		.join(" ")); 
console.log( 
	nextSmallest(inputArr2, inputArr2.length) 
		.join(" "));

/************************************************************************** */
function nextSmall(inputArray) { 
	let inputArrayLength = inputArray.length; 
	let outputElements = new Array(inputArrayLength); 
	let stackVar = []; 
	for (let i = 0; i < inputArrayLength; i++) { 
		while ( 
			stackVar.length > 0 && 
			stackVar[stackVar.length - 1].value > inputArray[i] 
		) { 
			let topOfStack = stackVar.pop(); 
			outputElements[topOfStack.index] = inputArray[i]; 
		} 
		stackVar.push({ index: i, value: inputArray[i] }); 
	} 
	while (stackVar.length > 0) { 
		let topOfStack = stackVar.pop(); 
		outputElements[topOfStack.index] = -1; 
	} 

	return outputElements; 
} 
let inputArr1 = [11, 13, 21, 3]; 
let inputArr2 = [1, 2, 3, 4]; 
console.log(nextSmall(inputArr1).join(" ")); 
console.log(nextSmall(inputArr2).join(" "));


/***************************************************** */
function nextSmall(inputArray) { 
	let inputArrayLength = inputArray.length; 
	let outputElements = new Array(inputArrayLength).fill(-1); 

	for (let i = inputArrayLength - 2; i >= 0; i--) { 
		let j = i + 1; 
		while (j !== -1 && inputArray[i] < inputArray[j]) { 
			j = outputElements[j]; 
		} 
		outputElements[i] = j; 
	} 

	return outputElements.join(" "); 
} 

let inputArr1 = [11, 13, 21, 3]; 
let inputArr2 = [1, 2, 3, 4]; 

console.log(nextSmall(inputArr1)); 
console.log(nextSmall(inputArr2));


/******************************************************* */

function nextSmall(inputArray) { 

	// let inputArrayLength = inputArray.length; 
	let outputElements = []; 

	inputArray.forEach((element, index) => { 
		let smallerElement = inputArray.slice(index + 1) 
			.find((e) => e < element); 
		outputElements.push(smallerElement || -1); 
	}); 

	return outputElements.join(" "); 
} 

let inputArr1 = [11, 13, 21, 3]; 
let inputArr2 = [1, 2, 3, 4]; 

console.log(nextSmall(inputArr1)); 
console.log(nextSmall(inputArr2));
