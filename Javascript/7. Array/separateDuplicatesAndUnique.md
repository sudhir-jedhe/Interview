Your solution for separating duplicates and unique values from an array is effective and well-structured. Below is an explanation and slight comparison of the three approaches you've provided. Each one is valid, and the choice between them depends on the specific requirements and constraints of your use case.

### **1. Using `reduce` with an accumulator (Object-based counting)**

This approach uses `reduce` to count occurrences of each element and then separates them into duplicates and uniques based on their counts.

```javascript
function separateDuplicatesAndUnique(arr) {
    const counts = arr.reduce((acc, num) => {
        acc[num] = (acc[num] || 0) + 1; // Count occurrences of each number
        return acc;
    }, {});

    const duplicates = Object.keys(counts).filter(key => counts[key] > 1).map(Number);
    const uniques = Object.keys(counts).filter(key => counts[key] === 1).map(Number);

    return {
        duplicates,
        uniques
    };
}

// Example usage:
const input = [1, 2, 3, 4, 4, 5, 1, 6, 7, 2];
const result = separateDuplicatesAndUnique(input);
console.log(result);
// Output: { duplicates: [1, 2, 4], uniques: [3, 5, 6, 7] }
```

#### **Pros:**
- **Compact and elegant**: Uses `reduce` to accumulate counts and filters using `Object.keys`.
- **No external data structures**: Uses plain objects, which are simple and performant.
  
#### **Cons:**
- **Object keys are always strings**: This approach converts the numbers to strings (`Object.keys(counts)`), then maps them back to numbers, which could introduce minor inefficiency if the dataset is very large.

---

### **2. Using `Map` for counting occurrences**

In this approach, a `Map` is used to store the counts of each element. This has a more predictable behavior, especially when dealing with non-string keys.

```javascript
function separateDuplicatesAndUnique(arr) {
    const counts = new Map();

    // Count occurrences of each number
    arr.forEach(num => {
        counts.set(num, (counts.get(num) || 0) + 1);
    });

    const duplicates = [];
    const uniques = [];

    // Separate duplicates and unique values
    counts.forEach((count, num) => {
        if (count > 1) {
            duplicates.push(num);
        } else {
            uniques.push(num);
        }
    });

    return {
        duplicates,
        uniques
    };
}

// Example usage:
const input = [1, 2, 3, 4, 4, 5, 1, 6, 7, 2];
const result = separateDuplicatesAndUnique(input);
console.log(result);
// Output: { duplicates: [1, 2, 4], uniques: [3, 5, 6, 7] }
```

#### **Pros:**
- **More precise**: `Map` ensures that the keys maintain their types, avoiding unnecessary type coercion like in the object approach.
- **More flexible**: Can handle other types as keys (like objects) if needed.

#### **Cons:**
- **Slightly more verbose**: Requires initializing an array for duplicates and uniques, adding another step compared to the first approach.

---

### **3. Using `Set` to track seen elements**

This approach makes two passes: the first identifies duplicates using a `Set`, and the second collects unique values by filtering the original array.

```javascript
function separateDuplicatesAndUnique(arr) {
    const seen = new Set();
    const duplicates = new Set();
    
    // First pass: Identify duplicates
    arr.forEach(num => {
        if (seen.has(num)) {
            duplicates.add(num); // If it's already seen, it's a duplicate
        } else {
            seen.add(num); // Otherwise, add it to seen
        }
    });

    // Second pass: Separate unique values
    const uniques = arr.filter(num => !duplicates.has(num));

    // Convert duplicates back to an array
    return {
        duplicates: Array.from(duplicates),
        uniques
    };
}

// Example usage:
const input = [1, 2, 3, 4, 4, 5, 1, 6, 7, 2];
const result = separateDuplicatesAndUnique(input);
console.log(result);
// Output: { duplicates: [1, 2, 4], uniques: [3, 5, 6, 7] }
```

#### **Pros:**
- **Efficiency**: The `Set` operations (`has` and `add`) are generally O(1) on average, making this method potentially more efficient for very large arrays, as it only iterates through the array twice.
- **Clear separation of concerns**: The two passes (first for duplicates, second for unique values) are simple and easy to follow.

#### **Cons:**
- **Requires multiple passes**: First for tracking duplicates and then filtering, which means this is a bit more "manual" compared to the `reduce` or `Map` approaches.
- **Memory usage**: Uses extra space for both the `Set` of seen and duplicate values.

---

### **Comparison and Recommendations:**

1. **If you need simplicity and compactness**: Go with the **first approach** using `reduce`. It's concise and easy to read.
2. **If you're dealing with larger datasets** or want to maintain the **exact types of the elements**, use the **`Map` approach**. It's flexible and more predictable with types.
3. **If performance is critical**, particularly when working with large arrays, the **`Set` approach** might be the most efficient. However, it involves two passes through the array, which could be a concern if performance is extremely tight.

### **Final Thoughts:**

All three solutions are solid and would work well in most use cases. The main trade-off here comes down to **conciseness** vs **performance**, and **type safety** (for numbers vs objects). Each approach has its merits and can be chosen based on specific requirements.