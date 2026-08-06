# Array Iteration Methods in JavaScript

Array iteration means processing each element of an array one by one.

***

# 1. Traditional `for` Loop

```javascript
const arr = [10, 20, 30];

for (let i = 0; i < arr.length; i++) {
  console.log(arr[i]);
}
```

Output:

```text
10
20
30
```

✅ Fastest

✅ Full control

✅ Can use `break` and `continue`

***

# 2. `for...of`

```javascript
const arr = [10, 20, 30];

for (const value of arr) {
  console.log(value);
}
```

Output:

```text
10
20
30
```

✅ Cleaner syntax

✅ Most commonly used for iteration

***

# 3. `forEach()`

```javascript
const arr = [10, 20, 30];

arr.forEach((value, index) => {
  console.log(value, index);
});
```

Output:

```text
10 0
20 1
30 2
```

✅ Good for side effects

❌ Cannot use `break`

❌ Returns `undefined`

***

# 4. `map()`

Used when transforming data.

```javascript
const arr = [1, 2, 3];

const doubled = arr.map(
  num => num * 2
);

console.log(doubled);
```

Output:

```javascript
[2, 4, 6]
```

✅ Returns a new array

✅ Commonly used in React rendering

***

# 5. `filter()`

Used for selecting elements.

```javascript
const arr = [1, 2, 3, 4, 5];

const evenNumbers = arr.filter(
  num => num % 2 === 0
);

console.log(evenNumbers);
```

Output:

```javascript
[2, 4]
```

***

# 6. `reduce()`

Used to accumulate values.

```javascript
const arr = [1, 2, 3, 4];

const sum = arr.reduce(
  (total, current) =>
    total + current,
  0
);

console.log(sum);
```

Output:

```javascript
10
```

***

# 7. `find()`

Returns the first matching element.

```javascript
const users = [
  { id: 1 },
  { id: 2 },
  { id: 3 }
];

const user = users.find(
  user => user.id === 2
);

console.log(user);
```

Output:

```javascript
{ id: 2 }
```

***

# 8. `findIndex()`

Returns the index of the first matching element.

```javascript
const arr = [10, 20, 30];

const index = arr.findIndex(
  value => value === 20
);

console.log(index);
```

Output:

```javascript
1
```

***

# React Example

### Rendering List Using `map()`

```jsx
function UsersList() {
  const users = [
    "Sudhir",
    "John",
    "Mike"
  ];

  return (
    <>
      {users.map(user => (
        <p key={user}>
          {user}
        </p>
      ))}
    </>
  );
}
```

***

# Interview Comparison

| Method        | Purpose           | Returns New Array        |
| ------------- | ----------------- | ------------------------ |
| `for`         | General iteration | ❌                        |
| `for...of`    | General iteration | ❌                        |
| `forEach()`   | Side effects      | ❌                        |
| `map()`       | Transform data    | ✅                        |
| `filter()`    | Select data       | ✅                        |
| `reduce()`    | Aggregate data    | ❌ (returns single value) |
| `find()`      | First match       | ❌                        |
| `findIndex()` | Index lookup      | ❌                        |

***

# Senior React Interview Answer

```text
Use for...of or forEach() when you simply need to iterate.
Use map() when transforming data or rendering JSX.
Use filter() when selecting a subset of data.
Use reduce() when aggregating values.
Use find() when you need only the first matching element.
```

### Most Common React Pattern

```jsx
users
  .filter(user => user.active)
  .map(user => (
    <UserCard
      key={user.id}
      user={user}
    />
  ));
```

This combines **filtering** and **rendering** efficiently and is frequently asked in React interviews.
