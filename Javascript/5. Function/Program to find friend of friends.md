The `friends` function you've implemented is quite good, but it could be improved slightly to ensure that we don't add duplicates to the list. Additionally, you can use a `Set` to keep track of all the unique friends, ensuring that a person isn't added multiple times.

### Improved version:

```javascript
const friends = (mapping, person) => {
  const seen = new Set(); // A Set to track unique friends
  const findFriends = (person) => {
    // Check if the person exists in the mapping
    const friendsList = mapping[person];
    if (friendsList) {
      // Iterate over each friend
      for (let friend of friendsList) {
        // If the friend has not been seen before, add them
        if (!seen.has(friend)) {
          seen.add(friend);
          findFriends(friend); // Recursively find their friends
        }
      }
    }
  };

  findFriends(person); // Start the recursive search from the initial person
  return Array.from(seen); // Convert the Set to an array
};

// Example usage:

const mapping = {
  a: ['b', 'c'],
  b: ['d', 'g'],
  d: ['p', 'q'],
  l: ['x', 'y']
};

console.log(friends(mapping, 'a'));
// Output: ["b", "c", "d", "g", "p", "q"]
```

### Explanation:
1. **Using a `Set`**: The `Set` automatically ensures that each friend is only added once, preventing duplicates.
2. **Recursive `findFriends` function**: The function goes through each friend and, for each friend, recursively adds their friends to the `Set`.
3. **Base case**: If the person doesn't have any friends in the mapping (i.e., they aren't in the `mapping` object), the recursion stops.
4. **Conversion to array**: After gathering all unique friends, we convert the `Set` to an array before returning it.

### Output:
```javascript
["b", "c", "d", "g", "p", "q"]
```

### Why this works:
- The recursion traverses the graph of friends, ensuring that we get all the friends of the initial person as well as their friends, their friends' friends, etc.
- Using a `Set` helps avoid adding the same person multiple times, ensuring the final result only contains unique names.