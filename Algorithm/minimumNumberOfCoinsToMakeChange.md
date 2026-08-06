// Minimum Number Of Coins To Make Change
// Given an array of coins or denominations and a target sum, calculate the minimum number of coins required to match the target. Note that the coins array will have denominations that are Infinitely available, i.e. coins can be repeated and added to calculate the target.

// Example
// Input
// coins = [1, 2, 4]
// target = 6
// Output
// 2
// Explanation
// There are many ways to make target equal to 6 using available coins of [1, 2 , 4].

// Adding $1 coin 6 times.
// Adding $1 coin 4 tumes and $2 coins 2 times.
// and so on till you get the minimum.

// Adding $4 coin 1 time and $2 coin 1 time
// The MINIMUM number of coins that can add up to the target sum is 2. This is obtained when we add $4 coin 1 time and $2 coin 1 time

// Therefore, the answer is = 2.

// Example
// Input
// const coins = [2, 3, 7, 8]
// const target = 27
// Output
// 4
// The minimum number of coins required to make a target of 27 is 4. Which is obtained by adding $8 coin 3 times and $3 coin 1 time.

// Constraints
// 1 <= coins.length <= 10
// 1 <= coins[i] <= 100
// 1 <= target <= 1000


// Time: O(nd), Space: O(n); n = target, d = coins array
const minimumNumberOfCoinsToMakeChange = (coins, target) => {
    const ways = new Array(target + 1).fill(Infinity)
    ways[0] = 0
  
    for (let i = 0; i < coins.length; i++) {
      for (let amount = 0; amount < ways.length; amount++) {
        if (coins[i] <= amount) {
          ways[amount] = Math.min(ways[amount], 1 + ways[amount - coins[i]])
        }
      }
    }
    return ways[target] !== Infinity ? ways[target] : -1
  }
  
  // driver code
  const coins = [1, 2, 4]
  const target = 6
  console.log(minimumNumberOfCoinsToMakeChange(coins, target))
  