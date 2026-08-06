Here’s a detailed explanation of the provided code snippets:

---

### **First Approach**
This implementation calculates all left-shifted rotations of a number using arithmetic operations.

#### **Code**
```javascript
// Function to return the count of digits of n
function numberOfDigits(n) {
  let cnt = 0;
  while (n > 0) {
    cnt++;
    n = parseInt(n / 10, 10); // Remove the last digit
  }
  return cnt;
}
```

#### **Explanation**
1. **Purpose**: Counts the number of digits in the given number.
2. **Logic**: In a loop:
   - Divide the number by 10 to remove the last digit.
   - Increment a counter `cnt` for every digit removed.
3. **Return Value**: The number of digits in the input number.

---

```javascript
// Function to print the left shift numbers
function cal(num) {
  let digits = numberOfDigits(num); // Count the digits
  let powTen = Math.pow(10, digits - 1); // Calculate 10^(digits - 1)

  for (let i = 0; i < digits - 1; i++) {
    let firstDigit = parseInt(num / powTen, 10); // Extract the leftmost digit

    // Formula to calculate the left shift from the previous number
    let left = num * 10 + firstDigit - firstDigit * powTen * 10;

    console.log(left);

    // Update the original number
    num = left;
  }
}
```

#### **Explanation**
1. **Initialization**:
   - `digits`: Number of digits in the number.
   - `powTen`: \(10^{\text{digits}-1}\), used to isolate the leftmost digit.

2. **Logic**:
   - Extract the leftmost digit using \( \text{num} / \text{powTen} \).
   - Compute the rotated number using the formula:
     \[
     \text{new number} = (\text{num} \times 10 + \text{leftmost digit}) - (\text{leftmost digit} \times \text{powTen} \times 10)
     \]
   - Print the left-rotated number.

3. **Update**:
   - Assign the rotated number back to `num` for the next iteration.

4. **Loop**:
   - Continue for \( \text{digits} - 1 \) times to cover all rotations.

---

### **Second Approach**
This implementation uses string manipulation to calculate rotations.

#### **Code**
```javascript
// Function to print the left shift numbers
function cal(num) {
  var temp = "" + num; // Convert number to string
  var len = temp.length; // Find the length of the string
  temp += temp; // Concatenate the string to itself

  for (let i = 1; i * 2 < temp.length; i++) {
    console.log(temp.slice(i, i + len)); // Extract substring of length `len`
  }
}
```

#### **Explanation**
1. **Convert Number to String**:
   - Convert the input number `num` to a string for easier manipulation.

2. **Concatenate the String**:
   - Append the string to itself (`temp += temp`) to handle rotations circularly.

3. **Extract Rotations**:
   - Use the `slice` method to extract substrings of length `len`, starting from index `i`.

4. **Loop**:
   - Iterate over indices from `1` to \( \text{len} - 1 \), slicing and printing the rotated substrings.

---

### **Comparison**

| Feature                          | First Approach                    | Second Approach                |
|----------------------------------|-----------------------------------|--------------------------------|
| **Method**                       | Arithmetic operations             | String manipulation            |
| **Complexity**                   | \(O(\text{digits})\) per rotation | \(O(\text{digits})\) per rotation |
| **Flexibility**                  | Works with integers only          | Works with integers as strings |
| **Readability**                  | More mathematical                 | Easier to understand           |

---

### Example Outputs
#### Input: `1445`
**First Approach Output**:
```plaintext
4451 4514 5144
```

**Second Approach Output**:
```plaintext
4451
4514
5144
```


Here’s the JavaScript implementation with the example code:

```javascript
// Function to generate and print all rotations of a number
function allRotations(num) {
  // Convert the number to a string
  const strNum = num.toString();
  const rotations = [];

  // Generate rotations
  for (let i = 0; i < strNum.length; i++) {
    // Create a rotation by slicing and concatenating
    const rotation = strNum.slice(i) + strNum.slice(0, i);
    rotations.push(rotation);
  }

  // Output all rotations
  console.log(`All rotations of ${num}:`, rotations.join(" "));
}

// Example usage
let num = 1445;
allRotations(num); // Output: All rotations of 1445: 1445 4451 4514 5144

num = 123;
allRotations(num); // Output: All rotations of 123: 123 231 312
```

### Explanation of Code
1. **Convert Number to String**: The number is converted to a string to manipulate its digits easily.
2. **Loop Through the Digits**:
   - For each digit, create a new string where the digits are rotated by slicing the string from the current index `i` to the end and appending the substring from the start to `i`.
3. **Store Rotations**: Each rotation is added to an array.
4. **Display Rotations**: The array of rotations is joined into a single space-separated string for output.

### Example Output
```text
All rotations of 1445: 1445 4451 4514 5144
All rotations of 123: 123 231 312
```