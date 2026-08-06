```js
/*
Input: a[] = {20, -5, -1}, K = 3
Output: 14
Explanation: All sum of contiguous subarrays are (20, 15, 14, -5, -6, -1)  so the 3rd largest sum is 14.
Input: a[] = {10, -10, 20, -40}, k = 6
Output: -10
Explanation: The 6th largest sum among sum of all contiguous subarrays is -10.
*/

// Javascript program to find the K-th largest sum 
// of subarray 

// Function to calculate Kth largest element 
// in contiguous subarray sum 
function kthLargestSum(arr, N, K) 
{ 
	let result=[]; 

	// Generate all subarrays 
	for (let i = 0; i < N; i++) { 
		let sum = 0; 
		for (let j = i; j < N; j++) { 
			sum += arr[j]; 
			result.push(sum); 
		} 
	} 

	// Sort in decreasing order 
	result.sort(); 
	result.reverse(); 

	// return the Kth largest sum 
	return result[K - 1]; 
} 

// Driver's code 
	let a = [20, -5, -1 ]; 
	let N = a.length; 
	let K = 3; 

	// Function call 
	console.log(kthLargestSum(a, N, K));


/********************************** */
// Javascript program to find the k-th largest sum 
// of subarray 

// Function to calculate kth largest element 
// in contiguous subarray sum 
function kthLargestSum(arr, n, k) { 
	// Array to store prefix sums 
	let sum = new Array(n + 1); 
	sum[0] = 0; 
	sum[1] = arr[0]; 
	for (let i = 2; i <= n; i++) 
		sum[i] = sum[i - 1] + arr[i - 1]; 

	// Priority_queue of min heap 
	let Q = []; 

	// Loop to calculate the contiguous subarray 
	// sum position-wise 
	for (let i = 1; i <= n; i++) { 

		// Loop to traverse all positions that 
		// form contiguous subarray 
		for (let j = i; j <= n; j++) { 
			// calculates the contiguous subarray 
			// sum from j to i index 
			let x = sum[j] - sum[i - 1]; 

			// If queue has less than k elements, 
			// then simply push it 
			if (Q.length < k) 
				Q.push(x); 

			else { 
				// If the min heap has equal to 
				// k elements then just check 
				// if the largest kth element is 
				// smaller than x then insert 
				// else its of no use 
				Q.sort(); 
				if (Q[0] < x) { 
					Q.pop(); 
					Q.push(x); 
				} 
			} 

			Q.sort(); 
		} 
	} 

	// The top element will be then kth 
	// largest element 
	return Q[0]; 
} 

// Driver program to test above function 
let a = [10, -10, 20, -40]; 
let n = a.length; 
let k = 6; 

// Calls the function to find out the 
// k-th largest sum 
console.log(kthLargestSum(a, n, k));

/************************************* */
function kthLargestSum(arr, k) { 
	let n = arr.length; 

	// Create a prefix sum array. 
	let prefixSum = new Array(n + 1).fill(0); 
	prefixSum[0] = 0; 
	for (let i = 1; i <= n; i++) { 
		prefixSum[i] = prefixSum[i - 1] + arr[i - 1]; 
	} 

	// Create an array to store all possible subarray sums. 
	let subarraySums = []; 
	for (let i = 0; i <= n; i++) { 
		for (let j = i + 1; j <= n; j++) { 
			subarraySums.push(prefixSum[j] - prefixSum[i]); 
		} 
	} 

	// Sort the subarray sums in decreasing order. 
	subarraySums.sort((a, b) => b - a); 

	// Return the K-th largest sum of contiguous subarray. 
	return subarraySums[k - 1]; 
} 

// Driver Code 
let arr = [10, -10, 20, -40]; 
let k = 6; 
console.log(kthLargestSum(arr, k));
.
