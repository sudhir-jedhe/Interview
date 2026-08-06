These examples show **different ways to iterate over a 2D array (matrix)**.

### Sample Array

```javascript
const arr = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9]
];
```

***

# 1. Nested `for` Loops (Most Flexible)

```javascript
for (let i = 0; i < arr.length; i++) {
  for (let j = 0; j < arr[i].length; j++) {
    console.log(arr[i][j]);
  }
}
```

### Output

```text
1
2
3
4
5
6
7
8
9
```

### Advantages

✅ Fastest

✅ Access to row and column indexes

✅ Can use `break` and `continue`

### Interview Use Case

```javascript
console.log(
  `Row: ${i}, Column: ${j}`
);
```

Useful for:

* Matrix problems
* Grid traversal
* DSA interviews

***

# 2. `for...of` Loop (Cleaner)

```javascript
for (const rowArr of arr) {
  for (const value of rowArr) {
    console.log(value);
  }
}
```

### Output

```text
1
2
3
4
5
6
7
8
9
```

### Advantages

✅ Readable

✅ No index management

✅ Preferred for simple iteration

### Limitation

No direct access to indexes.

If needed:

```javascript
for (const [rowIndex, rowArr] of arr.entries()) {
  console.log(rowIndex, rowArr);
}
```

***

# 3. Nested `forEach()`

```javascript
arr.forEach(rowArr =>
  rowArr.forEach(value =>
    console.log(value)
  )
);
```

### Output

```text
1
2
3
4
5
6
7
8
9
```

### Advantages

✅ Functional style

✅ Concise

### Limitation

Cannot use:

```javascript
break;
continue;
return;
```

to stop iteration.

***

# 4. Using `flat()`

Convert 2D array to 1D array first.

```javascript
arr
  .flat()
  .forEach(value =>
    console.log(value)
  );
```

### Output

```text
1
2
3
4
5
6
7
8
9
```

***

# 5. Using `flatMap()`

```javascript
const result = arr.flatMap(
  row => row
);

console.log(result);
```

Output:

```javascript
[
  1,2,3,
  4,5,6,
  7,8,9
]
```

***

# React Example

Rendering a matrix:

```jsx
function Matrix() {
  const arr = [
    [1, 2, 3],
    [4, 5, 6]
  ];

  return (
    <>
      {arr.map((row, rowIndex) =>
        row.map((value, colIndex) => (
          <div
            key={`${rowIndex}-${colIndex}`}
          >
            {value}
          </div>
        ))
      )}
    </>
  );
}
```

***

# Interview Comparison

| Method             | Readability     | Performance  | Access Index |
| ------------------ | --------------- | ------------ | ------------ |
| Nested `for`       | Medium          | ⭐ Fastest    | ✅            |
| `for...of`         | ⭐ Best          | Fast         | Limited      |
| `forEach`          | Good            | Fast         | ✅            |
| `flat().forEach()` | Simple          | Extra Memory | ❌            |
| `map()`            | React Rendering | Fast         | ✅            |

***

# Senior JavaScript Interview Answer

> For a 2D array, nested `for` loops provide maximum control and are preferred in algorithmic problems because they give direct access to row and column indexes. For everyday iteration, `for...of` offers cleaner syntax. In React applications, nested `map()` calls are the standard approach because they return JSX elements that can be rendered directly.
