Given a nested array and a callback function, count all the elements that pass the test in the callback and return the count.

```js

Input:
const arr = [[1, [2, [3, 4, "foo", { a: 1, b: 2 }]], "bar"]];
const count = countInArray(arr, (e) => typeof e === "number");
console.log(count);

Output:
4
```

```js
let countInArray = function (inputArr, test) {
  //track the count
  let count = 0;

  const search = (arr, test) => {
    //iterate the array
    for (let a of arr) {
      //if not an array
      //test the element
      //if it passes the test, store its result
      if (test(a)) {
        count += 1;
      }

      //if sub-array
      if (Array.isArray(a)) {
        //recursively filter the sub-array
        search(a, test);
      }
    }
  };

  //search
  search(inputArr, test);

  //return
  return count;
};


Input:
const arr = [[1, [2, [3, 4, "foo", { a: 1, b: 2 }]], "bar"]];
const count = countInArray(arr, (e) => typeof e === "number");
console.log(count);

Output:
4

```


This is a classic **recursion + array traversal** interview question.

## Problem

Given:

* A nested array
* A callback (predicate) function

Return the **count of all elements** that satisfy the callback condition.

***

## Example

```javascript
const arr = [1, [2, 3], [4, [5, 6]], 7];

const isEven = num => num % 2 === 0;

console.log(
  countElements(arr, isEven)
);
```

### Output

```javascript
3
```

Because:

```javascript
2
4
6
```

are even.

***

# Recursive Solution

```javascript
function countElements(
  arr,
  callback
) {
  let count = 0;

  for (const item of arr) {
    if (Array.isArray(item)) {
      count += countElements(
        item,
        callback
      );
    } else {
      if (callback(item)) {
        count++;
      }
    }
  }

  return count;
}
```

***

## Usage Example

```javascript
const arr = [
  1,
  [2, 3],
  [4, [5, 6]],
  7
];

const result =
  countElements(
    arr,
    num => num % 2 === 0
  );

console.log(result);
```

### Output

```javascript
3
```

***

# Example 2: Count Strings

```javascript
const data = [
  "React",
  ["Node", 10],
  [
    "JavaScript",
    ["TypeScript", 20]
  ]
];

const result =
  countElements(
    data,
    value =>
      typeof value === "string"
  );

console.log(result);
```

### Output

```javascript
4
```

Because:

```text
React
Node
JavaScript
TypeScript
```

***

# Example 3: Count Numbers Greater Than 5

```javascript
const arr = [
  1,
  [6, 7],
  [2, [8, 10]]
];

const result =
  countElements(
    arr,
    value => value > 5
  );

console.log(result);
```

### Output

```javascript
4
```

***

# Alternative Using `reduce()`

```javascript
function countElements(
  arr,
  callback
) {
  return arr.reduce(
    (count, item) => {
      if (Array.isArray(item)) {
        return (
          count +
          countElements(
            item,
            callback
          )
        );
      }

      return callback(item)
        ? count + 1
        : count;
    },
    0
  );
}
```

***

# Dry Run

```javascript
[
  1,
  [2, 3],
  [4, [5, 6]]
]
```

Check for even numbers:

```text
1 → false

[2,3]
  2 → true
  3 → false

[4,[5,6]]
  4 → true

  [5,6]
    5 → false
    6 → true
```

Count:

```text
2
4
6
```

Result:

```javascript
3
```

***

# Complexity

Let:

```text
n = total number of elements
```

### Time Complexity

```text
O(n)
```

Each element is visited once.

### Space Complexity

```text
O(d)
```

where:

```text
d = maximum nesting depth
```

(due to recursion stack)

***

## Interview-Ready Solution

```javascript
function countElements(
  arr,
  callback
) {
  let count = 0;

  for (const item of arr) {
    if (Array.isArray(item)) {
      count += countElements(
        item,
        callback
      );
    } else if (callback(item)) {
      count++;
    }
  }

  return count;
}
```

### Test Cases

```javascript
countElements(
  [1, [2, 3], [4, [5, 6]], 7],
  n => n % 2 === 0
);
// 3

countElements(
  ["a", ["b", 1], ["c", ["d"]]],
  x => typeof x === "string"
);
// 4

countElements(
  [1, [2, [3, [4]]]],
  n => n > 2
);
// 2
```

This is the most common and efficient recursive solution expected in JavaScript interviews.

Assuming this implementation:

```javascript
function countElements(arr, callback) {
  let count = 0;

  for (const item of arr) {
    if (Array.isArray(item)) {
      count += countElements(item, callback);
    } else if (callback(item)) {
      count++;
    }
  }

  return count;
}
```

## 1. Count Even Numbers

```javascript
const arr = [
  1,
  [2, 3],
  [4, [5, 6]],
  7
];

const evenCount = countElements(
  arr,
  num => num % 2 === 0
);

console.log(evenCount);
```

### Output

```javascript
3
```

Matched values:

```text
2
4
6
```

***

## 2. Count Odd Numbers

```javascript
const oddCount = countElements(
  arr,
  num => num % 2 !== 0
);

console.log(oddCount);
```

### Output

```javascript
4
```

Matched values:

```text
1
3
5
7
```

***

## 3. Count Strings

```javascript
const data = [
  "React",
  ["Node", 100],
  [
    "JavaScript",
    ["TypeScript", true]
  ]
];

const stringCount = countElements(
  data,
  value =>
    typeof value === "string"
);

console.log(stringCount);
```

### Output

```javascript
4
```

Matched:

```text
React
Node
JavaScript
TypeScript
```

***

## 4. Count Numbers Greater Than 10

```javascript
const data = [
  5,
  [15, 8],
  [20, [30, 3]]
];

const result = countElements(
  data,
  num => num > 10
);

console.log(result);
```

### Output

```javascript
3
```

Matched values:

```text
15
20
30
```

***

## 5. Count Booleans

```javascript
const data = [
  true,
  [false, true],
  [1, ["hello", false]]
];

const result = countElements(
  data,
  value =>
    typeof value === "boolean"
);

console.log(result);
```

### Output

```javascript
4
```

***

## 6. Count Truthy Values

```javascript
const data = [
  0,
  [1, "", "React"],
  [null, [true, false]]
];

const result = countElements(
  data,
  value => Boolean(value)
);

console.log(result);
```

### Output

```javascript
3
```

Matched:

```text
1
React
true
```

***

## 7. Count Objects

```javascript
const data = [
  { name: "Sudhir" },
  [
    { role: "Developer" },
    "React"
  ],
  [
    true,
    [{ city: "Pune" }]
  ]
];

const result = countElements(
  data,
  value =>
    typeof value === "object" &&
    value !== null
);

console.log(result);
```

### Output

```javascript
3
```

***

## 8. Count Names Starting with "S"

```javascript
const data = [
  "Sudhir",
  ["John", "Sam"],
  ["Mike", ["Steve"]]
];

const result = countElements(
  data,
  value =>
    typeof value === "string" &&
    value.startsWith("S")
);

console.log(result);
```

### Output

```javascript
3
```

Matched:

```text
Sudhir
Sam
Steve
```

***

## 9. Count React Developers

```javascript
const users = [
  {
    name: "Sudhir",
    skill: "React"
  },
  [
    {
      name: "John",
      skill: "Angular"
    },
    {
      name: "Mike",
      skill: "React"
    }
  ]
];

const result = countElements(
  users,
  user =>
    user?.skill === "React"
);

console.log(result);
```

### Output

```javascript
2
```

***

## 10. React Usage Example

```javascript
const skills = [
  ["React", "Node"],
  ["React", "TypeScript"],
  ["Angular"]
];

const reactSkillCount =
  countElements(
    skills,
    skill => skill === "React"
  );

console.log(reactSkillCount);
```

### Output

```javascript
2
```

### Interview Tip

Because `countElements()` accepts a callback, it is very flexible:

```javascript
countElements(arr, isEven);
countElements(arr, isOdd);
countElements(arr, isString);
countElements(arr, isTruthy);
countElements(arr, isReactDeveloper);
```

This follows the same higher-order function pattern used by JavaScript methods like `filter()`, `map()`, and `reduce()`.
