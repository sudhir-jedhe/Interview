### Explanation of the Code

The code you shared consists of two main parts:

1. **Generating an array with random numbers using `Array.from()`**
2. **Shuffling an array using a custom algorithm**

I'll break down both parts in detail:

### Part 1: Generating Random Array Using `Array.from()`

```javascript
function gfg_Run() {
  console.log(
    Array.from(
      {
        length: 10,
      },
      () => Math.floor(Math.random() * 10)
    )
  );
}
gfg_Run();
```

**Explanation**:
- `Array.from()` is used to create a new array.
- The object `{ length: 10 }` acts as the array-like object, specifying that the array should have 10 elements.
- The second argument to `Array.from()` is a mapping function, which generates a random integer between `0` and `9` for each element in the new array.
- The `Math.random()` function generates a floating-point number between `0` (inclusive) and `1` (exclusive). By multiplying it by `10`, we scale the random number to be between `0` and `10`. Using `Math.floor()` converts it into an integer between `0` and `9`.

The output will look something like this:
```javascript
[4, 7, 3, 1, 8, 2, 9, 5, 0, 6]  // Random output each time
```

### Part 2: Shuffling the Array with a Custom Algorithm

```javascript
let a = [];
for (i = 0; i < 10; ++i) a[i] = i;

function createRandom(arr) {
  let tmp,
    cur,
    tp = arr.length;
  if (tp)
    // Run until tp becomes 0.
    while (--tp) {
      // Generating the random index.
      cur = Math.floor(Math.random() * (tp + 1));

      // Getting the index(cur) value in variable(tmp).
      tmp = arr[cur];

      // Moving the index(tp) value to index(cur).
      arr[cur] = arr[tp];

      // Moving back the tmp value to
      // index(tp), Swapping is done.
      arr[tp] = tmp;
    }
  return arr;
}

function gfg_Run() {
  console.log(createRandom(a));
}
gfg_Run();
```

**Explanation**:
- The array `a` is initialized with the numbers from `0` to `9`.
- The `createRandom()` function implements a custom **Fisher-Yates (Knuth) shuffle** algorithm to randomly shuffle the elements of the array.
  
Here’s how the **Fisher-Yates shuffle** works:
1. We iterate over the array from the last element to the first (`tp` is the length of the array, and we decrement it).
2. For each element in the array, we generate a random index (`cur`) between `0` and the current index (`tp`).
3. We swap the element at the current index (`arr[tp]`) with the element at the random index (`arr[cur]`).

This process ensures that each element has an equal chance of appearing at any position in the array, resulting in a uniformly random shuffle.

**Example Output** (will vary each time):
```javascript
[2, 0, 6, 5, 7, 3, 9, 8, 4, 1]  // Random output each time
```

### Differences Between `Array.from()` and `createRandom()`

- **`Array.from()`**: This method is great when you want to generate an array from an array-like or iterable object. It's a cleaner way to create an array with a specified size and populate it with a custom value (in this case, random numbers).
  
- **`createRandom()`**: This method is a custom algorithm to shuffle an already-existing array. It performs an in-place shuffle using the Fisher-Yates algorithm, which is widely used for randomizing arrays efficiently.

### Conclusion
- `Array.from()` is useful for generating an array from scratch, while `createRandom()` is used to shuffle an existing array.
- If you want a random array, you can use `Array.from()` to generate one, and if you want to shuffle an existing array, the `createRandom()` function (based on Fisher-Yates shuffle) is ideal.

