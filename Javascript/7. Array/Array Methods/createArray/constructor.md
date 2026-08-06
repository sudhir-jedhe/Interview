
# Creating Arrays in JavaScript

## 1. Using `new Array()`

### Empty Array

```javascript
const arr = new Array();

console.log(arr);
```

Output:

```javascript
[]
```

***

### Array with Values

```javascript
const arr = new Array(
  1,
  true,
  "string"
);

console.log(arr);
```

Output:

```javascript
[1, true, "string"]
```

***

### Single Numeric Argument

```javascript
const arr = new Array(5);

console.log(arr);
console.log(arr.length);
```

Output:

```javascript
[ <5 empty items> ]
5
```

Important:

```javascript
console.log(arr[0]);
```

Output:

```javascript
undefined
```

But:

```javascript
console.log(0 in arr);
```

Output:

```javascript
false
```

Because the slot does not actually exist.

***

### Single Non-Numeric Argument

```javascript
const arr = new Array("5");

console.log(arr);
console.log(arr.length);
```

Output:

```javascript
["5"]
1
```

Unlike:

```javascript
new Array(5)
```

which creates empty slots.

***

## 2. Using Array Literal `[]`

This is the preferred way.

### Empty Array 1

```javascript
const arr = [];

console.log(arr);
```

Output:

```javascript
[]
```

***

### Array with Values 1

```javascript
const arr = [
  1,
  true,
  "string"
];

console.log(arr);
```

Output:

```javascript
[1, true, "string"]
```

***

### Dynamic Addition

```javascript
const fruits = [];

fruits.push(
  "banana",
  "apple",
  "peach"
);

console.log(fruits);
console.log(fruits.length);
```

Output:

```javascript
["banana", "apple", "peach"]
3
```

***

## Empty Slots vs Undefined

This is a favourite interview topic.

## Empty Slots

```javascript
const arr = new Array(3);

console.log(arr);
```

Output:

```javascript
[ <3 empty items> ]
```

***

## Undefined Values

```javascript
const arr = [
  undefined,
  undefined,
  undefined
];

console.log(arr);
```

Output:

```javascript
[
  undefined,
  undefined,
  undefined
]
```

Although both look similar:

```javascript
arr[0]
```

returns:

```javascript
undefined
```

their behaviour differs.

***

## map() Behaviour

## Empty Slots 2

```javascript
new Array(3).map(
  (_, i) => i
);
```

Output:

```javascript
[ <3 empty items> ]
```

Callback never runs.

***

## Undefined Values 2

```javascript
[undefined, undefined, undefined]
  .map((_, i) => i);
```

Output:

```javascript
[0, 1, 2]
```

Callback executes.

***

## Creating Filled Arrays 1

### Bad

```javascript
new Array(5);
```

Creates empty slots.

***

### Good

```javascript
new Array(5).fill(0);
```

Output:

```javascript
[0, 0, 0, 0, 0]
```

***

### Generate Sequence

```javascript
Array.from(
  { length: 5 },
  (_, index) => index + 1
);
```

Output:

```javascript
[1, 2, 3, 4, 5]
```

Very common in React pagination components.

***

## `new Array(5)` vs `[5]`

```javascript
const a = new Array(5);

const b = [5];

console.log(a);
console.log(b);
```

Output:

```javascript
[ <5 empty items> ]

[5]
```

This is the biggest source of confusion.

***

## Interview Comparison Table

| Expression                  | Result                        |
| --------------------------- | ----------------------------- |
| `[]`                        | Empty array                   |
| `new Array()`               | Empty array                   |
| `new Array(5)`              | Array with 5 empty slots      |
| `[5]`                       | Array containing number 5     |
| `new Array("5")`            | Array containing string "5"   |
| `Array.of(5)`               | Array containing number 5     |
| `Array.from({ length: 5 })` | Array with 5 undefined values |

***

## Modern Best Practices

✅ Prefer:

```javascript
const arr = [];
```

✅ Generate arrays:

```javascript
Array.from(
  { length: 10 },
  (_, i) => i
);
```

✅ Initialise arrays:

```javascript
new Array(10).fill(0);
```

❌ Avoid:

```javascript
new Array(10);
```

unless you specifically need sparse arrays.

### Senior React Interview Answer

> In modern JavaScript and React applications, array literals (`[]`) are preferred because they are simpler and less error-prone than `new Array()`. The main caveat with `new Array(length)` is that it creates sparse arrays with empty slots, which behave differently from arrays containing `undefined` values and can cause issues with methods such as `map()`, `forEach()`, and `reduce()`.
