Your code for finding relative ranks works well, but there’s an optimization opportunity. Specifically, the code has to find the rank index for each score using `sortedScore.indexOf(score[i])`, which involves a linear scan of `sortedScore` for every score in the input. This can be optimized to avoid unnecessary repeated scanning.

Instead of calling `indexOf` multiple times, we can first create a map of the score and its corresponding rank index during the sorting process. This way, we can look up the rank directly in constant time.

Here’s the optimized solution:

### Optimized Code:

```javascript
export function findRelativeRanks(score) {
  // Create a copy of the score array and sort it in descending order
  const sortedScore = [...score].sort((a, b) => b - a);

  // Map the score to its rank (index)
  const scoreToRank = new Map();
  for (let i = 0; i < sortedScore.length; i++) {
    scoreToRank.set(sortedScore[i], i + 1); // Store 1-based rank
  }

  // Define ranks for the top 3
  const ranks = ["Gold Medal", "Silver Medal", "Bronze Medal"];

  // Initialize the result array
  const result = new Array(score.length);

  // Assign ranks based on score using the map
  for (let i = 0; i < score.length; i++) {
    const rank = scoreToRank.get(score[i]);
    if (rank <= 3) {
      result[i] = ranks[rank - 1]; // Use the predefined ranks for top 3
    } else {
      result[i] = rank.toString(); // For other ranks, use the number as string
    }
  }

  return result;
}

import { findRelativeRanks } from "./findRelativeRanks.js";

const score1 = [5, 4, 3, 2, 1];
console.log(findRelativeRanks(score1)); // Output: ["Gold Medal", "Silver Medal", "Bronze Medal", "4", "5"]

const score2 = [10, 3, 8, 9, 4];
console.log(findRelativeRanks(score2)); // Output: ["Gold Medal", "5", "Bronze Medal", "Silver Medal", "4"]

const score3 = [50, 40, 30, 20, 10];
console.log(findRelativeRanks(score3)); // Output: ["Gold Medal", "Silver Medal", "Bronze Medal", "4", "5"]
```

### Key Changes:

1. **Map of Score to Rank**:
   - Instead of repeatedly calling `indexOf` on `sortedScore`, we create a `Map` called `scoreToRank` where the key is the score, and the value is the rank. The rank is simply the index of the score in the sorted array plus one (since ranks are 1-based).
   - This allows us to look up the rank of any score in constant time, O(1).

2. **Ranks for the Top 3**:
   - The first three places are handled separately, using the `ranks` array for "Gold Medal", "Silver Medal", and "Bronze Medal".
   - For other ranks, the number (rank) is converted to a string.

### Time Complexity:

- **Sorting the scores**: Sorting the array takes O(n log n) time.
- **Building the `scoreToRank` map**: Creating the map takes O(n) time.
- **Assigning ranks**: Iterating through the original `score` array and assigning ranks takes O(n) time.
- **Overall complexity**: The overall complexity is dominated by the sorting step, so it's O(n log n).

### Example Walkthrough:

#### Example 1:

For the input `score = [5, 4, 3, 2, 1]`:

- Sorted scores: `[5, 4, 3, 2, 1]`
- `scoreToRank` map: `{ 5 => 1, 4 => 2, 3 => 3, 2 => 4, 1 => 5 }`
- Output ranks for each score:
  - `5` → `"Gold Medal"`
  - `4` → `"Silver Medal"`
  - `3` → `"Bronze Medal"`
  - `2` → `"4"`
  - `1` → `"5"`

The final output is: `["Gold Medal", "Silver Medal", "Bronze Medal", "4", "5"]`.

#### Example 2:

For the input `score = [10, 3, 8, 9, 4]`:

- Sorted scores: `[10, 9, 8, 4, 3]`
- `scoreToRank` map: `{ 10 => 1, 9 => 2, 8 => 3, 4 => 4, 3 => 5 }`
- Output ranks for each score:
  - `10` → `"Gold Medal"`
  - `3` → `"5"`
  - `8` → `"Bronze Medal"`
  - `9` → `"Silver Medal"`
  - `4` → `"4"`

The final output is: `["Gold Medal", "5", "Bronze Medal", "Silver Medal", "4"]`.

#### Example 3:

For the input `score = [50, 40, 30, 20, 10]`:

- Sorted scores: `[50, 40, 30, 20, 10]`
- `scoreToRank` map: `{ 50 => 1, 40 => 2, 30 => 3, 20 => 4, 10 => 5 }`
- Output ranks for each score:
  - `50` → `"Gold Medal"`
  - `40` → `"Silver Medal"`
  - `30` → `"Bronze Medal"`
  - `20` → `"4"`
  - `10` → `"5"`

The final output is: `["Gold Medal", "Silver Medal", "Bronze Medal", "4", "5"]`.

### Conclusion:

The optimized solution now avoids unnecessary repeated operations (like `indexOf`) and efficiently computes the relative ranks by leveraging a map for fast lookups. This results in a cleaner and more performant implementation.
