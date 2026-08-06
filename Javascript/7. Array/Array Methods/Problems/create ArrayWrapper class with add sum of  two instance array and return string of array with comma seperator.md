```js
// create an ArrayWrapper class that accepts an array of integers in its constructor. The class should have the following features:

// When two instances of this class are added together with the + operator, the resulting value is the sum of all the elements in both arrays.
// When the String() function is called on the instance, it will return a comma-separated string surrounded by brackets. For example, [1,2,3].

cThis is the **LeetCode 2695 – Array Wrapper** problem.

The trick is to override:

* `valueOf()` → controls behaviour of the `+` operator
* `toString()` → controls behaviour of `String()`

***

## Solution

```javascript
class ArrayWrapper {
  constructor(nums) {
    this.nums = nums;
  }

  // Called when using +
  valueOf() {
    return this.nums.reduce(
      (sum, num) => sum + num,
      0
    );
  }

  // Called by String()
  toString() {
    return `[${this.nums.join(",")}]`;
  }
}
```

***

## Example Usage

```javascript
const obj1 = new ArrayWrapper([1, 2]);
const obj2 = new ArrayWrapper([3, 4]);

console.log(obj1 + obj2);
```

### Output

```javascript
10
```

Explanation:

```javascript
obj1.valueOf() → 3
obj2.valueOf() → 7

3 + 7 = 10
```

***

## String Conversion

```javascript
const obj = new ArrayWrapper([1, 2, 3]);

console.log(String(obj));
```

### Output

```javascript
"[1,2,3]"
```

Because:

```javascript
obj.toString()
```

returns:

```javascript
"[1,2,3]"
```

***

## More Examples

### Example 1

```javascript
const obj1 = new ArrayWrapper([1, 2, 3]);
const obj2 = new ArrayWrapper([4, 5]);

console.log(obj1 + obj2);
```

Output:

```javascript
15
```

***

### Example 2

```javascript
console.log(
  String(
    new ArrayWrapper([10, 20, 30])
  )
);
```

Output:

```javascript
"[10,20,30]"
```

***

## How JavaScript Handles It

When:

```javascript
obj1 + obj2
```

JavaScript internally tries:

```javascript
obj1.valueOf()
obj2.valueOf()
```

When:

```javascript
String(obj1)
```

JavaScript internally calls:

```javascript
obj1.toString()
```

***

## Interview Version

```javascript
class ArrayWrapper {
  constructor(nums) {
    this.nums = nums;
  }

  valueOf() {
    return this.nums.reduce(
      (sum, num) => sum + num,
      0
    );
  }

  toString() {
    return `[${this.nums.join(",")}]`;
  }
}
```

### Complexity

#### `valueOf()`

```text
Time: O(n)
Space: O(1)
```

#### `toString()`

```text
Time: O(n)
Space: O(n)
```

where `n` is the number of elements in the wrapped array.
