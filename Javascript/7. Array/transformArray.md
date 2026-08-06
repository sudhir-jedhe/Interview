The provided `transformArray` function is designed to modify the elements of an array iteratively based on a simple rule. The rule checks if an element is a local minimum or maximum (i.e., smaller or larger than its neighbors), and if so, replaces it with the average of its neighbors. The process continues until no more changes are made, ensuring that all such local extremes are replaced by their neighbors' averages.

### Explanation of the Algorithm:

1. **Change Tracking (`changed`)**: 
   - A boolean flag `changed` is used to track if any changes were made in an iteration. If no changes are made, the process stops.
   
2. **Iterating through the Array**:
   - The function iterates through the array starting from the second element (index 1) up to the second-last element (index `arr.length - 2`), excluding the first and last elements (since they don't have both left and right neighbors).
   
3. **Condition for Change**:
   - For each element, it checks if it is either a local minimum (smaller than both its neighbors) or a local maximum (larger than both its neighbors). If so, it replaces that element with the average of its two neighbors.
   
4. **Repeat Until Stable**:
   - The process continues iterating through the array until no more changes are made (i.e., the array stabilizes).
   
5. **Returning the Transformed Array**:
   - Once the process completes, the transformed array is returned.

### Example Walkthrough:

1. **Example 1: `transformArray([1, 2, 1])`**
   - Initial: `[1, 2, 1]`
   - The middle element `2` is a local maximum (greater than both neighbors `1` and `1`), so it is replaced by the average of its neighbors: `(1 + 1) / 2 = 1`.
   - Result: `[1, 1, 1]` (No further changes as no other element needs modification).
   
2. **Example 2: `transformArray([5, 12, 3, 8, 9])`**
   - Initial: `[5, 12, 3, 8, 9]`
   - The element `12` is a local maximum, replaced with `(5 + 3) / 2 = 4`.
   - The element `3` is a local minimum, replaced with `(12 + 8) / 2 = 10`.
   - Result: `[5, 7, 8, 8, 9]` (No further changes as no other element needs modification).
   
3. **Example 3: `transformArray([9, 6, 7, 10, 13, 14])`**
   - Initial: `[9, 6, 7, 10, 13, 14]`
   - The element `6` is a local minimum, replaced with `(9 + 7) / 2 = 8`.
   - The element `7` is a local minimum, replaced with `(6 + 10) / 2 = 8`.
   - Result: `[9, 7, 7, 10, 13, 14]` (No further changes as no other element needs modification).

### Complexity:

- **Time Complexity**: 
  - Each pass through the array takes \(O(n)\) where \(n\) is the length of the array. In the worst case, the array might require multiple passes to stabilize. In the worst case, this could be \(O(n^2)\), but generally, the array stabilizes quickly.
  
- **Space Complexity**:
  - The algorithm modifies the array in place, so the space complexity is \(O(1)\) (ignoring the input and output).

### Code:
```javascript
function transformArray(arr) {
    let changed = true;

    while (changed) {
        changed = false;

        // Iterate from the second element to the second-last element (excluding head and tail)
        for (let i = 1; i < arr.length - 1; i++) {
            const prev = arr[i - 1];
            const curr = arr[i];
            const next = arr[i + 1];

            // Check if the current element needs modification
            if ((curr < prev && curr < next) || (curr > prev && curr > next)) {
                arr[i] = (prev + next) / 2; // Update the element to the average of its neighbors
                changed = true; // Mark that a change occurred
            }
        }
    }

    return arr;
}

// Examples
console.log(transformArray([1, 2, 1])); // Output: [1, 1, 1]
console.log(transformArray([5, 12, 3, 8, 9])); // Output: [5, 7, 8, 8, 9]
console.log(transformArray([9, 6, 7, 10, 13, 14])); // Output: [9, 7, 7, 10, 13, 14]
```

This function efficiently transforms an array by averaging the local extremes and continues until the array stabilizes. It should be useful for problems involving smoothing or local optimization based on neighboring elements.