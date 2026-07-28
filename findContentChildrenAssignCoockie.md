The problem you're tackling is a classic example of **greedy algorithm** where the goal is to maximize the number of children that can be content by giving them cookies that satisfy their greed factor. Let's walk through the approach and logic used in your code, and I'll provide a more detailed explanation and solution.

### Problem Breakdown:

You have two arrays:

- `g[]`: the greed factor of each child (minimum size of a cookie they require to be content).
- `s[]`: the sizes of available cookies.

The goal is to assign cookies to children such that each child gets at most one cookie, and the cookie must be at least as large as the child's greed factor.

### Approach:

1. **Sorting**:
   - **Sort the greed array `g[]`** in ascending order so that you handle the children with the smallest greed factor first. This ensures you maximize the number of children who are satisfied with a given cookie.
   - **Sort the cookie size array `s[]`** in ascending order so that you can start by trying to satisfy children with the smallest available cookies.

2. **Greedy Assignment**:
   - We iterate over the children (starting from the one with the smallest greed factor).
   - For each child, we try to find the smallest cookie (from the sorted cookies) that can satisfy the child's greed factor.
   - If such a cookie is found, the child is satisfied, and we move on to the next child and the next cookie.
   - If no suitable cookie is found for a child, that child cannot be satisfied, and we stop assigning cookies.

3. **Counting Content Children**:
   - Each time we successfully assign a cookie to a child, we increase a counter `contentChildren`.

4. **Stopping Condition**:
   - If all the children have been checked or all cookies have been exhausted, we stop.

### Code:

```javascript
function findContentChildren(g, s) {
  // Sort the greed factor array and the cookie sizes array
  g.sort((a, b) => a - b);
  s.sort((a, b) => a - b);

  let contentChildren = 0; // Counter for content children
  let cookieIndex = 0; // Pointer for the cookies array

  // Iterate over the sorted greed factors (children)
  for (let i = 0; i < g.length; i++) {
    // Find the first cookie that satisfies the current child's greed factor
    while (cookieIndex < s.length && s[cookieIndex] < g[i]) {
      cookieIndex++; // Move to the next cookie if the current one is too small
    }

    // If we found a cookie that satisfies this child's greed factor
    if (cookieIndex < s.length) {
      contentChildren++; // Assign this cookie to the child
      cookieIndex++; // Move to the next cookie
    } else {
      // No more cookies left to satisfy any remaining children
      break;
    }
  }

  return contentChildren; // Return the number of content children
}

console.log(findContentChildren([1, 2, 3], [1, 1])); // Output: 1
console.log(findContentChildren([1, 2], [1, 2, 3])); // Output: 2
console.log(findContentChildren([10, 9, 8], [5, 6, 7])); // Output: 0
```

### Explanation:

1. **Sorting**:
   - Sorting `g[]` ensures that we deal with children in the order of their greed factors. This allows us to try to satisfy the children with the smallest needs first, increasing the chances of satisfying more children.
   - Sorting `s[]` ensures that we try to assign the smallest available cookies first, minimizing the chance of wasting larger cookies when smaller ones could suffice.

2. **Two Pointer Technique**:
   - `cookieIndex` keeps track of the cookies array. We try to find the smallest cookie that satisfies the current child. If the current cookie isn't large enough (i.e., `s[cookieIndex] < g[i]`), we move to the next cookie by incrementing `cookieIndex`.

3. **Content Children Count**:
   - Each time a cookie satisfies a child's greed factor, we increment `contentChildren`.
   - If no cookies can satisfy a child's greed, we stop.

### Time Complexity:

- Sorting the arrays `g[]` and `s[]` takes \(O(n \log n)\) and \(O(m \log m)\) respectively, where \(n\) is the number of children and \(m\) is the number of cookies.
- The loop through the children takes \(O(n)\) and the inner while loop over the cookies takes \(O(m)\).
- Overall, the time complexity is dominated by the sorting steps, so it is:
  \[
  O(n \log n + m \log m)
  \]
  where \(n\) is the length of `g[]` and \(m\) is the length of `s[]`.

### Space Complexity:

- The space complexity is \(O(1)\) if you don't count the input arrays, as the sorting is done in-place, and we use only a few variables for counting and indexing.

### Example Walkthrough:

#### Example 1:

```javascript
findContentChildren([1, 2, 3], [1, 1]);
```

- `g = [1, 2, 3]`, `s = [1, 1]`
- Sort `g`: `[1, 2, 3]`, sort `s`: `[1, 1]`
- First child with greed factor 1: The smallest available cookie is of size 1, so the child gets it.
- No cookies are left for the second and third children.
- Output: `1`

#### Example 2:

```javascript
findContentChildren([1, 2], [1, 2, 3]);
```

- `g = [1, 2]`, `s = [1, 2, 3]`
- Sort `g`: `[1, 2]`, sort `s`: `[1, 2, 3]`
- First child with greed factor 1: The smallest available cookie is of size 1, so the child gets it.
- Second child with greed factor 2: The smallest available cookie is of size 2, so the child gets it.
- Output: `2`

#### Example 3:

```javascript
findContentChildren([10, 9, 8], [5, 6, 7]);
```

- `g = [10, 9, 8]`, `s = [5, 6, 7]`
- Sort `g`: `[8, 9, 10]`, sort `s`: `[5, 6, 7]`
- None of the cookies can satisfy any child's greed factor.
- Output: `0`

### Conclusion:

This solution efficiently matches children with cookies based on their greed factor and the available cookie sizes, using a greedy algorithm with sorting and a two-pointer technique. It provides the optimal number of content children that can be achieved with the given cookies.
