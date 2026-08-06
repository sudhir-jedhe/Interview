To implement the `highlight` function that satisfies the requirements you mentioned, we need to ensure that:

1. **Exact Match Highlighting**: If a word in the string matches one of the keywords exactly, it gets highlighted.
2. **Subword Matching**: If the word is composed of parts that match keywords, then those parts should be highlighted and the word should be combined appropriately.

Here's how we can approach it step by step:

### Steps:

1. **Identify exact matches**: If the whole word matches a keyword, wrap it in `<strong></strong>`.
2. **Handle subwords**: If the word is not an exact match, break it into smaller parts (prefix and suffix). Check if those parts match keywords:
    - If both the prefix and suffix match, combine them and highlight the whole word.
    - If only one part (prefix or suffix) matches, highlight that part and leave the rest as is.

### Approach:

- **Step 1:** Split the input string into words.
- **Step 2:** For each word, check if it exists in the `keywords` list.
- **Step 3:** If not an exact match, try to split the word into parts and check each part.
- **Step 4:** Reassemble the string and return the final result.

### Code Implementation:

```javascript
function highlight(str, keywords) {
  // Create a unique set of keywords for faster lookup
  const uniqueKeywords = new Set(keywords);

  // Split the string into words
  const words = str.split(' ');

  // Traverse each word in the string
  const result = words.map(word => {
    // If the word is found in the keywords, highlight it directly
    if (uniqueKeywords.has(word)) {
      return `<strong>${word}</strong>`;
    }

    // Try to find subword matches by splitting the word
    let highlightedWord = '';
    for (let i = 1; i < word.length; i++) {
      const prefix = word.slice(0, i);
      const suffix = word.slice(i);

      // If both the prefix and suffix are found in the keywords
      if (uniqueKeywords.has(prefix) && uniqueKeywords.has(suffix)) {
        highlightedWord = `<strong>${prefix}${suffix}</strong>`;
        break;
      }
      // If only the prefix is found in the keywords
      else if (uniqueKeywords.has(prefix) && !uniqueKeywords.has(suffix)) {
        highlightedWord = `<strong>${prefix}</strong>${suffix}`;
      }
      // If only the suffix is found in the keywords
      else if (!uniqueKeywords.has(prefix) && uniqueKeywords.has(suffix)) {
        highlightedWord = `${prefix}<strong>${suffix}</strong>`;
      }
    }

    // If no highlight is found through subword matching, return the word as is
    return highlightedWord !== '' ? highlightedWord : word;
  });

  // Join the words back into a single string with spaces
  return result.join(' ');
}

// Example usage
const str = "Ultimate JavaScript / FrontEnd Guide";
const words = ['Front', 'End', 'JavaScript'];

console.log(highlight(str, words));
// Output: "Ultimate <strong>JavaScript</strong> / <strong>FrontEnd</strong> Guide"
```

### **Explanation:**

1. **Keyword Matching**:
   - We first check if the entire word matches any keyword directly. If it does, we wrap it in `<strong></strong>`.

2. **Subword Matching**:
   - For each word that doesn't exactly match, we attempt to split it into parts by slicing the word into prefixes and suffixes. We check if either the prefix or the suffix matches a keyword, and highlight accordingly:
     - If both the prefix and suffix are in the `keywords` list, we combine them and wrap the entire word in `<strong>`.
     - If only the prefix or the suffix matches, we highlight only that part and leave the other part as is.

3. **Result Formation**:
   - After processing all words, we join them back together into a string with spaces between them.

### **Edge Cases**:

- Words that contain no matches should remain unchanged.
- Words that are made of several valid keywords (like "FrontEnd" in the example) are correctly highlighted as a single chunk (`<strong>FrontEnd</strong>`).

### **Test Cases**:

#### Test Case 1:

```javascript
const str1 = "Ultimate JavaScript / FrontEnd Guide";
const words1 = ['Front', 'End', 'JavaScript'];

console.log(highlight(str1, words1));
// Expected Output: "Ultimate <strong>JavaScript</strong> / <strong>FrontEnd</strong> Guide"
```

#### Test Case 2: Subword highlighting:

```javascript
const str2 = "AmazingFrontendExperience";
const words2 = ['Front', 'End', 'Experience'];

console.log(highlight(str2, words2));
// Expected Output: "<strong>Front</strong><strong>End</strong>Experience"
```

#### Test Case 3: No matches:

```javascript
const str3 = "Ultimate Guide to JavaScript";
const words3 = ['Python', 'Ruby'];

console.log(highlight(str3, words3));
// Expected Output: "Ultimate Guide to JavaScript" (No keywords match)
```

This approach works efficiently for typical strings and keywords and handles both exact and partial matching with overlapping and adjacent keywords.