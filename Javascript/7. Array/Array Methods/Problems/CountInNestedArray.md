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


If the goal is to **count elements in a nested array**, here's a reusable recursive solution.

## Count All Elements in a Nested Array

```javascript
function countInNestedArray(arr) {
  let count = 0;

  for (const item of arr) {
    if (Array.isArray(item)) {
      count += countInNestedArray(item);
    } else {
      count++;
    }
  }

  return count;
}
```

### Example

```javascript
const arr = [
  1,
  [2, 3],
  [4, [5, 6]],
  7
];

console.log(
  countInNestedArray(arr)
);
```

### Output

```javascript
7
```

Elements are:

```text
1
2
3
4
5
6
7
```

***

## Count Matching Elements Using Callback

```javascript
function countInNestedArray(
  arr,
  callback
) {
  let count = 0;

  for (const item of arr) {
    if (Array.isArray(item)) {
      count += countInNestedArray(
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

### Count Even Numbers

```javascript
const arr = [
  1,
  [2, 3],
  [4, [5, 6]],
  7
];

const result =
  countInNestedArray(
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

## Count Strings

```javascript
const arr = [
  "React",
  ["Node", 1],
  ["JS", ["TS"]]
];

console.log(
  countInNestedArray(
    arr,
    value =>
      typeof value === "string"
  )
);
```

### Output

```javascript
4
```

***

## Count Objects

```javascript
const arr = [
  { id: 1 },
  [
    { id: 2 },
    "React"
  ],
  [
    true,
    [{ id: 3 }]
  ]
];

console.log(
  countInNestedArray(
    arr,
    value =>
      typeof value === "object" &&
      value !== null
  )
);
```

### Output

```javascript
3
```

***

## Using `reduce()` (Interview Alternative)

```javascript
function countInNestedArray(
  arr,
  callback = () => true
) {
  return arr.reduce(
    (count, item) => {
      if (Array.isArray(item)) {
        return (
          count +
          countInNestedArray(
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

### Complexity

```text
Time Complexity: O(n)
Space Complexity: O(d)
```

where:

* `n` = total elements
* `d` = nesting depth

### Interview Version

```javascript
const countInNestedArray = (
  arr,
  predicate = () => true
) =>
  arr.reduce((count, item) => {
    if (Array.isArray(item)) {
      return count + countInNestedArray(item, predicate);
    }

    return predicate(item)
      ? count + 1
      : count;
  }, 0);
```

This is a common recursive interview problem that tests recursion, traversal, and higher-order functions.
