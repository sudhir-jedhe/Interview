# custom concat

```js

// Define customConcat method if it doesn't already exist
if (!Array.prototype.customConcat) {
    Array.prototype.customConcat = function() {
        // Convert the current array to a new array
        var newArray = this.slice();

        // Loop through each argument passed to the customConcat method
        for (var i = 0; i < arguments.length; i++) {
            var item = arguments[i];

            // Check if the argument is an array
            if (Array.isArray(item)) {
                // Concatenate each item from the argument array to the new array
                for (var j = 0; j < item.length; j++) {
                    newArray.push(item[j]);
                }
            } else {
                // If the argument is not an array, simply push it to the new array
                newArray.push(item);
            }
        }

        // Return the concatenated array
        return newArray;
    };
}

// Example usage
const arr1 = [1, 2, 3];
const arr2 = [4, 5];
const arr3 = [6, 7, 8];

// Using customConcat to concatenate multiple arrays
const concatenatedArray = arr1.customConcat(arr2, arr3);
console.log(concatenatedArray); // Output: [1, 2, 3, 4, 5, 6, 7, 8]

```

```javascript
var getConcatenation = function (nums) {
    let ans = nums.slice();
    ans.splice(nums.length, 0, ...nums);
    return ans;
};

```

Given an integer array nums of length n, you want to create an array ans of length 2n where ans[i] == nums[i] and ans[i + n] == nums[i] for 0 <= i < n (0-indexed).

Specifically, ans is the concatenation of two nums arrays.

Return the array ans.

Example 1:

Input: nums = [1,2,1]
Output: [1,2,1,1,2,1]
Explanation: The array ans is formed as follows:

- ans = [nums[0],nums[1],nums[2],nums[0],nums[1],nums[2]]
- ans = [1,2,1,1,2,1]
Example 2:

Input: nums = [1,3,2,1]
Output: [1,3,2,1,1,3,2,1]
Explanation: The array ans is formed as follows:

- ans = [nums[0],nums[1],nums[2],nums[3],nums[0],nums[1],nums[2],nums[3]]
- ans = [1,3,2,1,1,3,2,1]

## Custom `concat()` Implementation (Polyfill Style)

If you want to understand how `Array.prototype.concat()` works internally, here's a simple custom implementation.

### Basic Version

```javascript
function customConcat(arr1, arr2) {
  const result = [];

  for (const item of arr1) {
    result.push(item);
  }

  for (const item of arr2) {
    result.push(item);
  }

  return result;
}

const arr1 = [1, 2, 3];
const arr2 = [4, 5, 6];

console.log(customConcat(arr1, arr2));
```

## Output

```javascript
[1, 2, 3, 4, 5, 6]
```

***

## Support Multiple Arrays

```javascript
function customConcat(...arrays) {
  const result = [];

  for (const arr of arrays) {
    for (const item of arr) {
      result.push(item);
    }
  }

  return result;
}

console.log(
  customConcat(
    [1, 2],
    [3, 4],
    [5, 6]
  )
);
```

## Output1

```javascript
[1, 2, 3, 4, 5, 6]
```

***

## Equivalent Using Spread

```javascript
const result = [
  ...arr1,
  ...arr2
];
```

or

```javascript
const result =
  [...arr1, ...arr2];
```

***

## Shallow Copy Behaviour

Like native `concat()`, our custom version performs a **shallow copy**.

```javascript
const users = [
  {
    id: 1,
    name: "Sudhir"
  }
];

const cloned = customConcat(
  users,
  []
);

cloned[0].name = "John";

console.log(users[0].name);
```

### Output 2

```javascript
John
```

Because:

```javascript
users[0] === cloned[0]
```

returns:

```javascript
true
```

***

## Deep Concat (Clone Objects While Merging)

```javascript
function deepConcat(arr1, arr2) {
  const result = [];

  [...arr1, ...arr2].forEach(item => {
    result.push(
      structuredClone(item)
    );
  });

  return result;
}

const users = [
  {
    id: 1,
    profile: {
      city: "Pune"
    }
  }
];

const cloned =
  deepConcat(users, []);

cloned[0].profile.city =
  "Mumbai";

console.log(
  users[0].profile.city
);
```

### Output 4

```javascript
Pune
```

✅ Deep copy created.

***

## React Example

Adding a new item using the concat pattern:

```jsx
setUsers(prev =>
  prev.concat({
    id: 3,
    name: "New User"
  })
);
```

Equivalent spread version:

```jsx
setUsers(prev => [
  ...prev,
  {
    id: 3,
    name: "New User"
  }
]);
```

Most React codebases prefer the spread version.

***

### Interview Cheat Sheet

```javascript
// Native concat
const merged =
  arr1.concat(arr2);

// Custom concat
function customConcat(a, b) {
  return [...a, ...b];
}

// Shallow clone
const clone =
  [].concat(arr);

// Deep clone
const deepClone =
  structuredClone(arr);
```

**Key Point:** `concat()` creates a **new array** but only performs a **shallow copy**. Nested objects and arrays remain shared unless you explicitly deep clone them.
