Here is the full code, including additional examples and explanations, for filtering JSON data using the `findMatches` function:

```javascript
function findMatches(data, match) {
    return data.filter(item => {
        // Check if all key-value pairs in the match object exist in the current item
        for (const key in match) {
            if (match.hasOwnProperty(key)) {
                if (item[key] !== match[key]) {
                    return false; // If any key-value pair doesn't match, exclude the item
                }
            }
        }
        return true; // Include the item if all key-value pairs match
    });
}

// Example JSON data
const data = [
    { id: 1, name: 'John', age: 30 },
    { id: 2, name: 'Alice', age: 25 },
    { id: 3, name: 'Bob', age: 35 },
    { id: 4, name: 'John', age: 40 }
];

// Example 1: Filter by age
const match1 = { age: 30 };
const matches1 = findMatches(data, match1);
console.log('Example 1: Filter by age 30');
console.log(matches1);
// Output: [ { id: 1, name: 'John', age: 30 } ]

// Example 2: Filter by name
const match2 = { name: 'John' };
const matches2 = findMatches(data, match2);
console.log('\nExample 2: Filter by name "John"');
console.log(matches2);
// Output: [ { id: 1, name: 'John', age: 30 }, { id: 4, name: 'John', age: 40 } ]

// Example 3: Filter by multiple criteria (name and age)
const match3 = { name: 'John', age: 30 };
const matches3 = findMatches(data, match3);
console.log('\nExample 3: Filter by name "John" and age 30');
console.log(matches3);
// Output: [ { id: 1, name: 'John', age: 30 } ]

// Example 4: Match criteria with a key not in the data
const match4 = { gender: 'male' };
const matches4 = findMatches(data, match4);
console.log('\nExample 4: Match criteria with non-existent key "gender"');
console.log(matches4);
// Output: []

// Example 5: Empty match object (returns all items)
const match5 = {};
const matches5 = findMatches(data, match5);
console.log('\nExample 5: Empty match object (returns all items)');
console.log(matches5);
// Output: All items in the data array

// Example 6: Case-sensitive matching
const match6 = { name: 'john' }; // Notice lowercase 'john'
const matches6 = findMatches(data, match6);
console.log('\nExample 6: Case-sensitive matching for "john"');
console.log(matches6);
// Output: []
```

### How It Works
1. **Iterating through data**: The `filter` function checks each object in the `data` array.
2. **Matching keys**: For every key in the `match` object, the code verifies if the corresponding key-value pair exists in the current `item`.
3. **Including/excluding items**: Items that pass all key-value comparisons are included in the result array.

### Output for the Examples
```plaintext
Example 1: Filter by age 30
[ { id: 1, name: 'John', age: 30 } ]

Example 2: Filter by name "John"
[ { id: 1, name: 'John', age: 30 }, { id: 4, name: 'John', age: 40 } ]

Example 3: Filter by name "John" and age 30
[ { id: 1, name: 'John', age: 30 } ]

Example 4: Match criteria with non-existent key "gender"
[]

Example 5: Empty match object (returns all items)
[
  { id: 1, name: 'John', age: 30 },
  { id: 2, name: 'Alice', age: 25 },
  { id: 3, name: 'Bob', age: 35 },
  { id: 4, name: 'John', age: 40 }
]

Example 6: Case-sensitive matching for "john"
[]
```

This code is ready to run and illustrates how to filter JSON data based on specific criteria using `findMatches`.