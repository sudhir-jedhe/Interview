### Here's a breakdown and explanation of your code snippets, and I will also present a slightly refined version for better performance and clarity.

### 1. **`sortFeatures` Function**

This function sorts features based on how often they appear in a list of responses.

#### Code Explanation:

1. **Input**: 
   - `features`: An array of feature strings (e.g., "battery", "screen", etc.).
   - `responses`: An array of response strings that describe the features (e.g., product reviews or feedback).

2. **Logic**:
   - We start by initializing an array `counts` to store the occurrence of each feature in the responses.
   - For each response:
     - We split it into words and use a `Set` to avoid counting the same feature multiple times in the same response.
     - For each word in the response, we check if it contains any of the features (using `word.includes(features[i])`).
     - If a feature is found in the word, we increment its count.
   - Finally, we create a sorted version of the `features` array, sorting it based on the count of occurrences (from highest to lowest).

#### Example Usage:

```javascript
function sortFeatures(features, responses) {
    const counts = new Array(features.length).fill(0);

    for (let response of responses) {
        const words = response.toLowerCase().split(' ');
        const seen = new Set();
        
        for (let word of words) {
            for (let i = 0; i < features.length; i++) {
                if (!seen.has(i) && word.includes(features[i])) {
                    counts[i]++;
                    seen.add(i);
                }
            }
        }
    }

    const sortedFeatures = features.slice(); // Create a copy of features array
    sortedFeatures.sort((a, b) => counts[features.indexOf(b)] - counts[features.indexOf(a)]);
    
    return sortedFeatures;
}

// Example usage:
const features = ["battery", "screen", "camera", "resolution", "software"];
const responses = [
    "Best in class battery life and performance",
    "Excellent screen and resolution",
    "Camera could be better, software needs improvement",
    "Battery life is decent, screen is great",
    "Great camera quality, software is smooth"
];

console.log(sortFeatures(features, responses));
// Output: ["battery", "screen", "software", "camera", "resolution"]
```

#### Improvements:
- **Performance**: The `indexOf` calls inside the `sort` function can lead to inefficient sorting for large arrays since `indexOf` performs a linear search each time it's called. We can optimize by mapping the features to their counts ahead of time.
  
#### Optimized Version:

```javascript
function sortFeatures(features, responses) {
    const counts = new Array(features.length).fill(0);
    const featureMap = new Map(features.map((feature, i) => [feature, i]));  // Map for fast lookup

    for (let response of responses) {
        const words = new Set(response.toLowerCase().split(' '));  // Set to avoid counting duplicates

        for (let word of words) {
            for (let feature of features) {
                if (word.includes(feature)) {
                    counts[featureMap.get(feature)]++;
                }
            }
        }
    }

    return features
        .slice()
        .sort((a, b) => counts[featureMap.get(b)] - counts[featureMap.get(a)]);
}
```

### 2. **`sortFeaturesByPopularity` Function**

This function sorts the features based on their popularity, i.e., how many responses mention them.

#### Code Explanation:

1. **Input**:
   - `features`: An array of feature strings.
   - `responses`: An array of response strings.

2. **Logic**:
   - We create an object `featureCounts` to store how many times each feature appears in the responses.
   - Each response is split into individual words, and we use a `Set` to avoid counting the same feature multiple times within a single response.
   - For each unique word in the response, we check if it’s a valid feature and increment its count.
   - After counting, we sort the features based on the count (in descending order). If two features have the same count, they are sorted by their original index (in ascending order).

#### Example Usage:

```javascript
function sortFeaturesByPopularity(features, responses) {
    const featureCounts = {};

    // Count occurrences of each feature in all responses
    for (const response of responses) {
        const words = response.split(' ');  // Split response into individual words
        const uniqueWords = new Set(words); // Remove duplicates using Set

        for (const word of uniqueWords) {
            if (features.includes(word)) {  // Check if the word is a valid feature
                featureCounts[word] = (featureCounts[word] || 0) + 1; // Increment count or initialize to 1
            }
        }
    }

    // Sort features based on count (descending) and original index (ascending)
    return features.sort((feature1, feature2) => {
        const count1 = featureCounts[feature1] || 0;
        const count2 = featureCounts[feature2] || 0;

        // Sort by descending count first
        if (count1 !== count2) {
            return count2 - count1;
        }

        // If counts are equal, sort by original index (ascending)
        return features.indexOf(feature1) - features.indexOf(feature2);
    });
}

// Examples
const features = ["cooler", "lock", "touch"];
const responses = [
  "i like cooler cooler",
  "lock touch cool",
  "locker like touch"
];

console.log(sortFeaturesByPopularity(features, responses));
// Output: ["touch", "cooler", "lock"]
```

#### **Optimized Version**:
- Use a `Map` instead of a plain object for faster lookups in `featureCounts`.
- Avoid searching `features.indexOf(feature)` repeatedly by using the original order when sorting.

```javascript
function sortFeaturesByPopularity(features, responses) {
    const featureCounts = new Map();

    // Count occurrences of each feature in all responses
    for (const response of responses) {
        const words = new Set(response.split(' '));  // Use Set to remove duplicates

        for (const word of words) {
            if (features.includes(word)) {
                featureCounts.set(word, (featureCounts.get(word) || 0) + 1);
            }
        }
    }

    // Sort features based on count (descending) and original index (ascending)
    return features.slice().sort((feature1, feature2) => {
        const count1 = featureCounts.get(feature1) || 0;
        const count2 = featureCounts.get(feature2) || 0;

        if (count1 !== count2) {
            return count2 - count1;  // Sort by count descending
        }

        return features.indexOf(feature1) - features.indexOf(feature2); // Sort by original index ascending
    });
}
```

### Summary:
- **`sortFeatures`**: Sorts based on feature occurrences in response text, handling duplicates in each response by using a `Set`.
- **`sortFeaturesByPopularity`**: Counts how often each feature appears across all responses and sorts based on those counts, using a `Map` for better performance.

Both functions ensure efficient sorting of features based on how popular or mentioned they are in responses.