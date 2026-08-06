```js
// Given the prices of stock for n number of days. Every ith day tell the price of the stock on that day.
// Find the maximum profit that you can make by buying and selling stock with the restriction of
// after you sell your stock, you cannot buy stock on the next day (i.e., cooldown one day).

// Examples:

// Input: arr[] = {1, 2, 3, 0, 2}
// Output : 3
// Explanation: You first buy on day 1, sell on day 2 then cool down, then buy on day 4, and sell on day 5.
//The total profit earned is (2-1) + (2-0) = 3, which is the maximum achievable profit.

// Input: arr[] = {3, 1, 6, 1, 2, 4}
// Output: 7
// Explanation: You first buy on day 2 and sell on day 3 then cool down, then again you buy on day 5
//and then sell on day 6. Clearly, the total profit earned is (6-1) + (4-2) = 7, which is the
// maximum achievable profit.

// Javascript program to maximize profit by buying and
// selling stock with cooldown
function maximumProfit(v) {
  var n = v.length;
  var dp = new Array(n + 1);
  for (var i = 0; i < n + 1; i++) {
    dp[i] = new Array(3);
    for (var j = 0; j < 3; j++) {
      dp[i][j] = 0;
    }
  }
  dp[0][0] = -v[0];

  for (var i = 1; i <= n; i++) {
    // Maximum of buy state profit till the previous day or
    // buying a new stock with the cooldown state of the previous day
    dp[i][0] = Math.max(dp[i - 1][0], dp[i - 1][2] - v[i - 1]);

    // Maximum of sold state profit till the previous day or
    // selling the stock on the current day with the buy state
    // of the previous day
    dp[i][1] = Math.max(dp[i - 1][1], dp[i - 1][0] + v[i - 1]);

    // Sold state of the previous day
    dp[i][2] = dp[i - 1][1];
  }
  // Return the sold state profit of the final day
  return dp[n][1];
}

var v = [1, 2, 3, 0, 2];
console.log(maximumProfit(v));

// This code is contributed by Tapesh(tapeshdua420)
