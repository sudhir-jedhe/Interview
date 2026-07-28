```js
/*
Input : S = "()())"
Output : 4
()() is the longest balanced subsequence 
of length 4.
Input : s = "()(((((()"
Output : 4
*/

function balancedSubsequence(s) { 
	const stack = []; 
	let maxmimum = 0; 
	let currentIndex = -1; 

	for (const char of s) { 
		currentIndex++; 

		char === '(' ? stack.push(currentIndex) : 
			char === ')' && stack.length > 0 ? ( 
				stack.pop(), 
				maxmimum = Math.max(maxmimum, currentIndex - 
					(stack.length > 0 
						? stack[stack.length - 1] : -1)) 
			) : null; 
	} 

	return maxmimum; 
} 

const input = "(()())"; 
console.log(balancedSubsequence(input));


/****************************** */
function balancedSubsequence(s, n) { 
	let invalidOpenBraces = 0; 
	let invalidCloseBraces = 0; 

	for (let i = 0; i < n; i++) { 
		if (s[i] == '(') { 
			invalidOpenBraces++; 
		} else { 
			if (invalidOpenBraces == 0) { 
				invalidCloseBraces++; 
			} else { 
				invalidOpenBraces--; 
			} 
		} 
	} 
	return n - (invalidOpenBraces + invalidCloseBraces); 
} 

let s = "()(((((()"; 
let n = s.length; 
console.log(balancedSubsequence(s, n));
