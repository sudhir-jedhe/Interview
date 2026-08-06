Here are solutions to the problems you listed:

---

### **1. Program to find the longest word in a given sentence:**

```javascript
function findLongestWord(sentence) {
  let words = sentence.split(" ");
  let longestWord = "";

  for (let word of words) {
    if (word.length > longestWord.length) {
      longestWord = word;
    }
  }
  return longestWord;
}

console.log(findLongestWord("The quick brown fox jumps over the lazy dog"));
```

### **2. How to check whether a string is a palindrome or not?**

```javascript
function isPalindrome(str) {
  const reversed = str.split("").reverse().join("");
  return str === reversed;
}

console.log(isPalindrome("madam")); // true
console.log(isPalindrome("hello")); // false
```

### **3. Write a program to remove duplicates from an array:**

```javascript
function removeDuplicates(arr) {
  return [...new Set(arr)];
}

console.log(removeDuplicates([1, 2, 3, 4, 4, 5, 1, 2])); // [1, 2, 3, 4, 5]
```

### **4. Program to find the reverse of a string without using built-in method:**

```javascript
function reverseString(str) {
  let reversed = "";
  for (let i = str.length - 1; i >= 0; i--) {
    reversed += str[i];
  }
  return reversed;
}

console.log(reverseString("hello")); // "olleh"
```

### **5. Find the max count of consecutive 1's in an array:**

```javascript
function maxConsecutiveOnes(arr) {
  let maxCount = 0;
  let currentCount = 0;

  for (let num of arr) {
    if (num === 1) {
      currentCount++;
      maxCount = Math.max(maxCount, currentCount);
    } else {
      currentCount = 0;
    }
  }
  return maxCount;
}

console.log(maxConsecutiveOnes([1, 1, 0, 1, 1, 1])); // 3
```

### **6. Find the factorial of a given number:**

```javascript
function factorial(num) {
  if (num === 0 || num === 1) return 1;
  let result = 1;
  for (let i = 2; i <= num; i++) {
    result *= i;
  }
  return result;
}

console.log(factorial(5)); // 120
```

### **7. Merge two sorted arrays and sort them:**

```javascript
function mergeAndSort(arr1, arr2) {
  return [...arr1, ...arr2].sort((a, b) => a - b);
}

console.log(mergeAndSort([0, 3, 4, 31], [4, 6, 30])); // [0, 3, 4, 4, 6, 30, 31]
```

### **8. Function to check if every value in arr1 has its corresponding value squared in arr2:**

```javascript
function checkSquared(arr1, arr2) {
  if (arr1.length !== arr2.length) return false;
  const arr2Squared = arr2.map((num) => Math.sqrt(num)).sort();
  const arr1Sorted = arr1.sort();
  return arr1Sorted.every((num, idx) => num === arr2Squared[idx]);
}

console.log(checkSquared([1, 2, 3], [9, 4, 1])); // true
console.log(checkSquared([1, 2, 3], [4, 5, 6])); // false
```

### **9. Find if one string can be formed by rearranging the letters of the other string:**

```javascript
function canFormString(str1, str2) {
  const sortedStr1 = str1.split("").sort().join("");
  const sortedStr2 = str2.split("").sort().join("");
  return sortedStr1 === sortedStr2;
}

console.log(canFormString("listen", "silent")); // true
console.log(canFormString("hello", "world")); // false
```

### **10. Get unique objects from an array:**

```javascript
function getUniqueObjects(arr) {
  return arr.filter(
    (value, index, self) =>
      index === self.findIndex((obj) => obj.name === value.name),
  );
}

const arr = [
  { name: "sai" },
  { name: "Nang" },
  { name: "sai" },
  { name: "Nang" },
  { name: "111111" },
];
console.log(getUniqueObjects(arr)); // [{name: "sai"},{name:"Nang"},{name: "111111"}]
```

### **11. Find the maximum number in an array:**

```javascript
function findMax(arr) {
  return Math.max(...arr);
}

console.log(findMax([1, 2, 3, 5, 4])); // 5
```

### **12. Return only the even numbers from an array:**

```javascript
function filterEvenNumbers(arr) {
  return arr.filter((num) => num % 2 === 0);
}

console.log(filterEvenNumbers([1, 2, 3, 4, 5, 6])); // [2, 4, 6]
```

### **13. Check if a number is prime:**

```javascript
function isPrime(num) {
  if (num <= 1) return false;
  for (let i = 2; i <= Math.sqrt(num); i++) {
    if (num % i === 0) return false;
  }
  return true;
}

console.log(isPrime(11)); // true
console.log(isPrime(4)); // false
```

### **14. Find the largest element in a nested array:**

```javascript
function findLargest(arr) {
  const flatArray = arr.flat(Infinity); // Flatten the array to a single level
  return Math.max(...flatArray);
}

console.log(
  findLargest([
    [3, 4, 58],
    [709, 8, 9, [10, 11]],
    [111, 2],
  ]),
); // 709
```

### **15. Fibonacci sequence up to a given number of terms:**

```javascript
function fibonacci(n) {
  const sequence = [0, 1];
  for (let i = 2; i < n; i++) {
    sequence.push(sequence[i - 1] + sequence[i - 2]);
  }
  return sequence;
}

console.log(fibonacci(5)); // [0, 1, 1, 2, 3]
```

### **16. Count the occurrences of each character in a string:**

```javascript
function countCharacterOccurrences(str) {
  const count = {};
  for (let char of str) {
    count[char] = (count[char] || 0) + 1;
  }
  return count;
}

console.log(countCharacterOccurrences("hello")); // {h: 1, e: 1, l: 2, o: 1}
```

### **17. Sort an array in ascending order:**

```javascript
function sortArrayAsc(arr) {
  return arr.sort((a, b) => a - b);
}

console.log(sortArrayAsc([3, 1, 4, 1, 2])); // [1, 1, 2, 3, 4]
```

### **18. Sort an array in descending order:**

```javascript
function sortArrayDesc(arr) {
  return arr.sort((a, b) => b - a);
}

console.log(sortArrayDesc([3, 1, 4, 1, 2])); // [4, 3, 2, 1, 1]
```

### **19. Reverse the order of words in a sentence without using the built-in `reverse()` method:**

```javascript
function reverseWords(sentence) {
  const words = sentence.split(" ");
  let reversedSentence = "";

  for (let i = words.length - 1; i >= 0; i--) {
    reversedSentence += words[i] + " ";
  }

  return reversedSentence.trim();
}

console.log(reverseWords("The quick brown fox")); // "fox brown quick The"
```

### **20. Flatten a nested array into a single-dimensional array:**

```javascript
function flattenArray(arr) {
  return arr.flat(Infinity);
}

console.log(flattenArray([1, [2, [3, 4], 5], 6])); // [1, 2, 3, 4, 5, 6]
```

### **21. Convert a dot-separated string into an object:**

```javascript
function convertToObject(str, value) {
  const keys = str.split(".");
  let obj = {};
  keys.reduce((acc, key, index) => {
    if (index === keys.length - 1) {
      acc[key] = value;
    } else {
      acc[key] = {};
    }
    return acc[key];
  }, obj);

  return obj;
}

console.log(convertToObject("a.b.c", "someValue"));
// Output: {a: {b: {c: "someValue"}}}
```

---

These are the solutions for all the problems you listed. Let me know if you need further explanations or modifications!
