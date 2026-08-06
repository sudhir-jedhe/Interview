// maxProfit.js

```js
export function maxProfit(prices) {
  let minPrice = Infinity;
  let maxProfit = 0;

  for (const price of prices) {
    minPrice = Math.min(minPrice, price); // Update minimum price
    maxProfit = Math.max(maxProfit, price - minPrice); // Update maximum profit
  }

  return maxProfit;
}

// main.js
import { maxProfit } from "./maxProfit.js";

const prices = [7, 1, 5, 3, 6, 4];
console.log(maxProfit(prices)); // Output: 5
```

// Example 1:

// Input: prices = [7,1,5,3,6,4] Output: 5 Explanation: Buy on day 2 (price = 1)
// and sell on day 5 (price = 6), profit = 6-1 = 5.

// Note that buying on day 2 and selling on day 1 is not allowed because you
// must buy before you sell.

// Example 2:

// Input: prices = [7,6,4,3,1] Output: 0 Explanation: In this case, no
// transactions are done and the max profit = 0.

// Example 3:

// Input: prices = [3,3,5,0,0,3,1,4] Output: 4 Explanation: Buy on day 4 (price
// = 0) and sell on day 8 (price = 4), profit = 4-0 = 4. This is the maximum
// profit we can achieve.

The **Max Profit** problem (commonly known as **Best Time to Buy and Sell Stock**) is a classic algorithmic challenge on LeetCode.

Here are the most common variations of the problem, complete with optimal solutions in JavaScript / TypeScript.

---

## 1. Single Transaction (LeetCode #121)

You are given an array `prices` where `prices[i]` is the price of a given stock on the $i^{\text{th}}$ day. You want to maximize your profit by choosing a **single day** to buy one stock and choosing a **different day in the future** to sell that stock.

### Solution: Single Pass (Greedy / Kadane's Variant)

Maintain the **minimum price seen so far** and calculate the potential profit at each step.

- **Time Complexity:** $\mathcal{O}(n)$
- **Space Complexity:** $\mathcal{O}(1)$

```javascript
/**
 * @param {number[]} prices
 * @return {number}
 */
function maxProfit(prices) {
  let minPrice = Infinity;
  let maxProfit = 0;

  for (let i = 0; i < prices.length; i++) {
    if (prices[i] < minPrice) {
      minPrice = prices[i]; // Track the lowest buying price
    } else if (prices[i] - minPrice > maxProfit) {
      maxProfit = prices[i] - minPrice; // Update maximum profit
    }
  }

  return maxProfit;
}

// Example usage:
console.log(maxProfit([7, 1, 5, 3, 6, 4])); // Output: 5 (Buy at 1, sell at 6)
console.log(maxProfit([7, 6, 4, 3, 1])); // Output: 0 (No profit possible)
```

---

## 2. Unlimited Transactions (LeetCode #122)

You may complete as many transactions as you like (i.e., buy one and sell one share of the stock multiple times). You can only hold at most one share at any given time.

### Solution: Greedy Choice

Accumulate profit whenever the price on day $i$ is higher than on day $i - 1$.

- **Time Complexity:** $\mathcal{O}(n)$
- **Space Complexity:** $\mathcal{O}(1)$

```javascript
/**
 * @param {number[]} prices
 * @return {number}
 */
function maxProfitMulti(prices) {
  let maxProfit = 0;

  for (let i = 1; i < prices.length; i++) {
    // Add profit whenever price increases
    if (prices[i] > prices[i - 1]) {
      maxProfit += prices[i] - prices[i - 1];
    }
  }

  return maxProfit;
}

// Example usage:
console.log(maxProfitMulti([7, 1, 5, 3, 6, 4])); // Output: 7 (Buy @ 1 -> Sell @ 5 + Buy @ 3 -> Sell @ 6)
```

---

## 3. At Most $k$ Transactions (LeetCode #188)

You can complete at most $k$ transactions.

### Solution: Dynamic Programming

Track maximum profit with state arrays for `buy` and `sell` for up to $k$ transactions.

- **Time Complexity:** $\mathcal{O}(n \cdot k)$
- **Space Complexity:** $\mathcal{O}(k)$

```javascript
/**
 * @param {number} k
 * @param {number[]} prices
 * @return {number}
 */
function maxProfitK(k, prices) {
  if (!prices.length || k === 0) return 0;

  // If k >= n/2, it's equivalent to unlimited transactions
  if (k >= Math.floor(prices.length / 2)) {
    return maxProfitMulti(prices);
  }

  const buy = new Array(k + 1).fill(-Infinity);
  const sell = new Array(k + 1).fill(0);

  for (const price of prices) {
    for (let i = 1; i <= k; i++) {
      buy[i] = Math.max(buy[i], sell[i - 1] - price);
      sell[i] = Math.max(sell[i], buy[i] + price);
    }
  }

  return sell[k];
}

// Example usage:
console.log(maxProfitK(2, [3, 2, 6, 5, 0, 3])); // Output: 7
```

---

## Summary Matrix

| Variation                             | Max Transactions          | Key Concept                         | Time Complexity          |
| ------------------------------------- | ------------------------- | ----------------------------------- | ------------------------ |
| **Stock I (#121)**                    | $1$                       | Track `minPrice` & `maxProfit`      | $\mathcal{O}(n)$         |
| **Stock II (#122)**                   | Unlimited                 | Greedy sum of all positive deltas   | $\mathcal{O}(n)$         |
| **Stock III (#123)**                  | $2$                       | Dynamic Programming (4 states)      | $\mathcal{O}(n)$         |
| **Stock IV (#188)**                   | $k$                       | Dynamic Programming ($k$ states)    | $\mathcal{O}(n \cdot k)$ |
| **Stock with Cooldown (#309)**        | Unlimited ($1$ day delay) | DP States (`held`, `sold`, `reset`) | $\mathcal{O}(n)$         |
| **Stock with Transaction Fee (#714)** | Unlimited (Fee per sale)  | DP States (`hold`, `free`)          | $\mathcal{O}(n)$         |
