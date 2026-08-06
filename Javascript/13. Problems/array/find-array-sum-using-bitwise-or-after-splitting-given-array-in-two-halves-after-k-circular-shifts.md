```js
// Input: A[] = {12, 23, 4, 21, 22, 76}, Q = 1, K = 2
// Output: 117
// Explanation:
// Since K is 2, modified array A[]={22, 76, 12, 23, 4, 21}.
// Bitwise OR of first half of array = (22 | 76 | 12) = 94
// Bitwise OR of second half of array = (21 | 23 | 4) = 23
// Sum of OR values is 94 + 23 = 117

// Input: A[] = {7, 44, 19, 86, 65, 39, 75, 101}, Q = 1, K = 4
// Output: 238
// Since K is 4, modified array A[]={65, 39, 75, 101, 7, 44, 19, 86}.
// Bitwise OR of first half of array = 111
// Bitwise OR of second half of array = 127
// Sum of OR values is 111 + 127 = 238


<script>
// javascript program to find Bitwise OR of two
// equal halves of an array after performing
// K right circular shifts
	const MAX = 100005;

	// Array for storing
	// the segment tree
	var seg = Array(4 * MAX).fill(0);

	// Function to build the segment tree
	function build(node , l , r , a) {
		if (l == r)
			seg[node] = a[l];

		else {
			var mid = parseInt((l + r) / 2);

			build(2 * node, l, mid, a);
			build(2 * node + 1, mid + 1, r, a);

			seg[node] = (seg[2 * node] | seg[2 * node + 1]);
		}
	}

	// Function to return the OR
	// of elements in the range [l, r]
	function query(node , l , r , start , end , a) {

		// Check for out of bound condition
		if (l > end || r < start)
			return 0;

		if (start <= l && r <= end)
			return seg[node];

		// Find middle of the range
		var mid = parseInt((l + r) / 2);

		// Recurse for all the elements in array
		return ((query(2 * node, l, mid, start, end, a)) | (query(2 * node + 1, mid + 1, r, start, end, a)));
	}

	// Function to find the OR sum
	function orsum(a , n , q , k) {

		// Function to build the segment Tree
		build(1, 0, n - 1, a);

		// Loop to handle q queries
		for (j = 0; j < q; j++) {

			// Effective number of
			// right circular shifts
			var i = k[j] % (n / 2);

			// Calculating the OR of
			// the two halves of the
			// array from the segment tree

			// OR of second half of the
			// array [n/2-i, n-1-i]
			var sec = query(1, 0, n - 1, n / 2 - i, n - i - 1, a);

			// OR of first half of the array
			// [n-i, n-1]OR[0, n/2-1-i]
			var first = (query(1, 0, n - 1, 0, n / 2 - 1 - i, a) | query(1, 0, n - 1, n - i, n - 1, a));

			var temp = sec + first;

			// Print final answer to the query
			document.write(temp + "<br/>");
		}
	}

	// Driver Code
		var a = [ 7, 44, 19, 86, 65, 39, 75, 101 ];
		var n = a.length;
		var q = 2;

		var k = [ 4, 2 ];

		orsum(a, n, q, k);

// This code is contributed by Rajput-Ji. 
</script>
