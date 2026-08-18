# Problem: implement chunk(arr, size)

## Requirements

Write `chunk(arr, size)` that splits an array into an array of fixed-size groups, with the last group containing any remaining elements (which may be fewer than `size`):

- `chunk([1,2,3,4,5], 2)` → `[[1,2],[3,4],[5]]`
- `size` must be a positive integer — invalid sizes should throw.
- The input array must not be mutated.

## Full solution

```js
function chunk(arr, size) {
  if (!Array.isArray(arr)) {
    throw new TypeError("chunk expects an array as the first argument");
  }
  if (!Number.isInteger(size) || size <= 0) {
    throw new RangeError("chunk size must be a positive integer");
  }

  const result = [];
  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, i + size)); // slice is non-mutating and clamps automatically at the array's end
  }
  return result;
}
```

## Verifying it works

```js
console.log(chunk([1, 2, 3, 4, 5], 2)); // [[1, 2], [3, 4], [5]]
console.log(chunk([1, 2, 3, 4], 2));    // [[1, 2], [3, 4]]
console.log(chunk([1, 2, 3], 5));       // [[1, 2, 3]] — size larger than array, one chunk with everything
console.log(chunk([], 3));              // [] — empty input, no chunks

const original = [1, 2, 3, 4];
chunk(original, 2);
console.log(original); // [1, 2, 3, 4] — untouched, chunk never mutates its input

try {
  chunk([1, 2, 3], 0);
} catch (e) {
  console.log(e instanceof RangeError); // true
}
```

## Alternative implementation with reduce

```js
function chunkReduce(arr, size) {
  if (!Number.isInteger(size) || size <= 0) {
    throw new RangeError("chunk size must be a positive integer");
  }
  return arr.reduce((chunks, item, index) => {
    const chunkIndex = Math.floor(index / size);
    (chunks[chunkIndex] ??= []).push(item);
    return chunks;
  }, []);
}

console.log(chunkReduce([1, 2, 3, 4, 5], 2)); // [[1, 2], [3, 4], [5]]
```

`Math.floor(index / size)` maps each element's original index to the chunk index it belongs to (`0, 0, 1, 1, 2, ...` for `size = 2`), and `??=` lazily creates each chunk's array the first time an element lands in it.

## Key implementation notes

- **`arr.slice(i, i + size)`** is doing most of the work in the primary solution — `slice`'s `end` argument is automatically clamped to the array's actual length, so the final, possibly-shorter chunk "just works" without any special-casing for the remainder.
- **Loop increment of `size`** (`i += size`, not `i++`) is what advances one full chunk at a time rather than one element at a time.
- Validating `size` explicitly (must be a positive integer) avoids silent nonsense results: `size = 0` would loop forever (`i` never advances), and a negative or non-integer `size` produces confusing `slice` behavior rather than a clear error.
