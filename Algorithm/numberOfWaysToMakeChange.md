// Number of Ways To Make Change
// Given a target amount and a set of denominations (coins), find the total number of ways the given target amount can be expressed by using the denominations provided. Consider you have an infinite supply of each denomination given in the array.

// Example
// Input
// target = 10, coins = [1, 5, 10, 25]

// Output
// 4
// Explanation
// To get the target sum of 10, we can have multiple ways of adding the given denominations. Those 4 ways are:

// Adding 1 coin, 10 times.
// Adding 1 coin, 5 times AND 5 coin, 1 time.
// Adding 5 coin, 2 times.
// Adding 10 coin, ` time

function numberOfWaysToMakeChange(n, denoms) {
    const ways = new Array(n + 1).fill(0)
    ways[0] = 1
    for (let denom of denoms) {
      for (let amount = 1; amount < n + 1; amount++) {
        if (denom <= amount) {
          ways[amount] += ways[amount - denom]
        }
      }
    }
    return ways[n]
  }
  
  let target = 10;
  let denominations = [1, 5, 10, 25];
  console.log(numberOfWaysToMakeChange(target, denominations));