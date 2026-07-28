```js
/*
    Input: arr[] = {12, 35, 1, 10, 34, 1}
    Output: The second largest element is 34.
    Explanation: The largest element of the array is 35 and the second largest element is 34
    Input: arr[] = {10, 5, 10}
    Output: The second largest element is 5. Explanation: The largest element of the array is 10 
    and the second largest element is 5
    Input: arr[] = {10, 10, 10}
    Output: The second largest does not exist.
    Explanation: Largest element of the array is 10 there is no second largest element
*/

function findSecondLargest(arr) { 
	let first, second; 

	// There should be at least two elements 
	if (arr.length < 2) { 
		return "Invalid Input"; 
	} 

	// Sort the array in ascending order 
	arr.sort(); 

	// Start from the second last element as 
	// the largest element is at last 
	for (let i = arr.length - 2; i >= 0; i--) { 
		// If the element is not equal to the 
		// largest element 
		if (arr[i] !== arr[arr.length - 1]) { 
			return "The second largest element is " + arr[i]; 
		} 
	} 

	return "There is no second largest element"; 
} 

// Driver program to test the function 
const arr = [12, 35, 10, 35, 10, 34, 1]; 

// Output: The second largest element is 34 
console.log(findSecondLargest(arr));


/************************************************************ */


function findSecondLargestUsingSet(arr) { 

	// Create a Set to store unique elements 
	const uniqueElements = new Set(arr); 

	// Check if there are at least two unique elements 
	if (uniqueElements.size < 2) { 
		return "No second largest element exists"; 
	} 

	// Convert the Set back to an array and sort it 
	const sortedUnique = Array.from(uniqueElements) 
		.sort((a, b) => a - b); 

	// Return the second-to-last element 
	return "The second largest element is "
		+ sortedUnique[sortedUnique.length - 2]; 
} 

// Example usage: 
const numbers = [12, 35, 35, 2, 10, 10, 34, 12]; 
const number = [10, 10, 10]; 

// Output: The second largest element is 34 
console.log(findSecondLargestUsingSet(numbers)); 
console.log(findSecondLargestUsingSet(number));

/********************************************************* */

function findSecondLargestUsingIteration(arr) { 
	let firstMax = -Infinity; 
	let secondMax = -Infinity; 

	for (let num of arr) { 
		if (num > firstMax) { 
			secondMax = firstMax; 
			firstMax = num; 
		} else if (num > secondMax && num !== firstMax) { 
			secondMax = num; 
		} 
	} 

	if (secondMax === -Infinity) { 
		return "No second largest element exists"; 
	} 

	return "The second largest element is " + secondMax; 
} 

// Example usage: 
const numbers = [12, 35 ,35 , 2, 10, 10, 34, 12]; 
const number = [10, 10 , 10]; 

// Output: The second largest element is 34 
console.log(findSecondLargestUsingIteration(numbers)); 
console.log(findSecondLargestUsingIteration(number));

