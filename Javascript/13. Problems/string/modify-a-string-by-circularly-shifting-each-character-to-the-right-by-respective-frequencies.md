```js
// Input: S = “geeksforgeeks”
// Output: iiimugpsiiimu
// Explanation:
// Following changes are made on the string S:

// Frequency of ‘g’ is 2. Therefore, shifting the character ‘g’ by 2 becomes ‘i’.
// Frequency of ‘e’ is 4. Therefore, shifting the character ‘e’ by 4 becomes ‘i’.
// Frequency of ‘k’ is 2. Therefore, shifting the character ‘k’ by 2 becomes ‘m’.
// Frequency of ‘s’ is 2. Therefore, shifting the character ‘s’ by 2 becomes ‘u’.
// Frequency of ‘f’ is 1. Therefore, shifting the character ‘f’ by 1 becomes ‘g’.
// Frequency of ‘o’ is 1. Therefore, shifting the character ‘o’ by 1 becomes ‘p’.
// Frequency of ‘r’ is 1. Therefore, shifting the character ‘r’ by 1 becomes ‘s’.
// After the above shifting of characters, the string modifies to “iiimugpsiiimu”.

// Input: S = “aabcadb”
// Output: ddddded


<script>

// Javascript program for the above approach


// Function to replace the characters
// by its frequency of character in it
function addFrequencyToCharacter(Str)
{
	// Stores frequencies of characters
	// in the string S
	var frequency = Array.from({length: 26}, (_, i) => 0);

	var N = Str.length;
	var S = Str.split('');

	// Traverse the string S
	for (var i = 0; i < N; i++) {

		// Increment the frequency of
		// each character by 1
		frequency[S[i].charCodeAt(0) - 
		'a'.charCodeAt(0)] += 1;
	}

	// Traverse the string S
	for (var i = 0; i < N; i++) {

		// Find the frequency of
		// the current character
		var add = frequency[S[i].charCodeAt(0) - 
		'a'.charCodeAt(0)] % 26;

		// Update the character
		if ((S[i].charCodeAt(0)) +
							add <= ('z').charCodeAt(0))
			S[i] = String.fromCharCode((S[i].charCodeAt(0))
			+ add);

		else {
			add = ((S[i].charCodeAt(0)) + add) - 
			(('z').charCodeAt(0));
			S[i] = String.fromCharCode(('a'.charCodeAt(0)) + 
			add - 1);
		}
	}

	// Print the resultant string
	document.write(S.join(''));
}

// Driver Code
var S = "geeksforgeeks";
addFrequencyToCharacter(S);

// This code contributed by shikhasingrajput 

</script>
