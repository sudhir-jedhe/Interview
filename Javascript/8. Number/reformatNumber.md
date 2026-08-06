The task requires us to format a phone number string by removing spaces and dashes, then grouping the digits into blocks of 3, and handling the remaining digits (if any) by the rules specified: 

- If 4 digits remain, they should be split into two blocks of 2 digits each.
- If 2 or 3 digits remain, they should be grouped into one block.

### Solution Walkthrough

1. **Remove spaces and dashes**: First, we remove any spaces and dashes from the input string so that we only have the digits left.

2. **Grouping digits**: After removing unwanted characters, we need to group the digits. We process the digits in blocks of 3. 
   - If 4 digits remain, we split them into two blocks of 2 digits.
   - If 3 or fewer digits remain, we group them into one final block.

3. **Join the blocks**: Finally, we join the blocks with dashes.

### Steps to Implement the Solution

1. **Remove spaces and dashes**: This can be done using `.replace()` or `.filter()` to retain only the numeric digits.
2. **Group digits into blocks of 3**: We loop through the digits and create blocks. For the last few digits, handle them according to the special rules.
3. **Return the formatted result**: Join the blocks with dashes.

### Code Implementation

```typescript
function reformatNumber(number: string): string {
  // Remove spaces and dashes
  const digits = [...number].filter(c => c !== ' ' && c !== '-').join('');
  const n = digits.length;
  
  const result = [];
  
  // Process the string into blocks of 3 and handle the special case for the last digits
  let i = 0;
  
  // Group the digits into blocks of 3
  while (n - i > 4) {
    result.push(digits.slice(i, i + 3));
    i += 3;
  }

  // Handle the last 4 or fewer digits
  if (n - i === 4) {
    result.push(digits.slice(i, i + 2));
    result.push(digits.slice(i + 2, i + 4));
  } else {
    result.push(digits.slice(i));
  }

  // Join the blocks with dashes
  return result.join('-');
}

// Example 1:
console.log(reformatNumber("1-23-45 6"));  // Output: "123-456"

// Example 2:
console.log(reformatNumber("123 4-567")); // Output: "123-45-67"

// Example 3:
console.log(reformatNumber("123 4-5678")); // Output: "123-456-78"
```

### Explanation:

- **Step 1**: We filter out spaces and dashes from the input string, leaving us with only the digits.
- **Step 2**: We group the digits into blocks of 3, as long as we have more than 4 digits left.
- **Step 3**: If there are exactly 4 digits left, we split them into two blocks of 2 digits.
- **Step 4**: Any remaining digits are added as one last block.
- **Step 5**: We join the blocks using dashes and return the result.

### Time Complexity:
- **Time Complexity**: The time complexity is **O(n)** where **n** is the length of the input string. We go through the string once to remove spaces and dashes and once more to group the digits.
- **Space Complexity**: The space complexity is also **O(n)** due to the storage of the processed digits in an array.

### Test Cases:

1. **Input**: `"1-23-45 6"`
   - **Output**: `"123-456"`
   
2. **Input**: `"123 4-567"`
   - **Output**: `"123-45-67"`
   
3. **Input**: `"123 4-5678"`
   - **Output**: `"123-456-78"`
   
4. **Input**: `"12-3456"`
   - **Output**: `"123-456"`
   
5. **Input**: `"1-234567"`
   - **Output**: `"123-456-7"`
   
6. **Input**: `"1234"`
   - **Output**: `"12-34"`

This approach should work for all valid input strings as specified in the problem statement, formatting the phone number correctly based on the rules.