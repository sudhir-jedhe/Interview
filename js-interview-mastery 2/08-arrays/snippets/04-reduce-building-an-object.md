# Snippet: reduce building an object, not just a number

```js
const words = ["apple", "banana", "apple", "cherry"];
const counts = words.reduce((acc, word) => {
  acc[word] = (acc[word] ?? 0) + 1;
  return acc;
}, {});
console.log(counts); // { apple: 2, banana: 1, cherry: 1 }
```

The accumulator starts as `{}` and is mutated/returned each iteration, ending up as a frequency-count object rather than a single number — showing `reduce`'s output can be any shape.
