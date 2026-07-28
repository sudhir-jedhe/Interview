```js
// Given an array A[] of length N. Consider that purchasing ith item will cost Ai and then
// next i number of item(s) will be free to collect. Then your task is to output the minimum
// cost to collect all items at least once.

// Examples:

// Input: A[] = {3 ,1, 2}

// Output: 4

// Explanation: Consider an imaginary array Collected[] to track collected items, collected items
//  (free and purchased) and non-collected are denoted by 1 and 0 respectively.
// Thus, initially, Collected[] = {0, 0, 0}

// Let us buy 1st item for cost A1 = 3. Then next 1 item (A2) will be available for free.
// Now, Collected[] updates to {1, 1, 0}.
// Now, Buy 2nd item for cost A2 = 1. Then next 2 items will be available for free.
// As we can see that only one item A3 is left, therefore only one item can be considered
// as free. Formally, no A4 exists. Now, updated Collected[] becomes {1, 2, 1}.
// It must be noted that we can buy ith free item as well and then Collected[i] will also increment. It can be verified that all items are collected at least once and costs 3+1 = 4. Which is minimum possible.
// Input: A[] = {1, 10, 1, 10, 10, 10}

// Output: 2

// Explanation:

// Bought first item, it costs A1 = 1 and then A2 will be available for free. Cost till now = 1.
// Buy 3rd item, it will cost A3 = 1 and next 3 items will be available for free, which are A4, A5, A6. All the items has collected at least once in total cost at 1+1 = 2. Which is minimum possible.

// Java code to implement the approach
class GFG {
	// Function to Minimum cost to buy all
	// items at least once
	static int minimumCost(int[] A, int N) {

		// DP array initialized with infinity
		int[] dp = new int[N + 1];
		for (int i = 0; i <= N; i++) {
			dp[i] = Integer.MAX_VALUE;
		}

		// Base case
		dp[0] = A[0];

		// Calculating answer for i'th item
		for (int i = 1; i < N; i++) {

			// Iterate if buying j'th item at cost
			// A[j] helps to buy i'th item for free
			for (int j = i; i <= (2 * (j + 1)) - 1; j--) {
				dp[i] = Math.min(
						dp[i],
						(j - 1 >= 0 ? dp[j - 1] : 0) + A[j]);
			}
		}

		// Returning answer minimum cost
		// to buy all items at least once
		return dp[N - 1];
	}

	// Driver Code
	public static void main(String[] args) {

		// Input
		int N1 = 6;
		int[] A1 = { 1, 10, 1, 10, 10, 10 };

		// Function Call
		System.out.println(minimumCost(A1, N1));
	}
}
