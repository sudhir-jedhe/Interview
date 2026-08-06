### JavaScript Iterators

**What is an Iterator?**

An **Iterator** is an object in JavaScript that allows you to iterate (loop) over a collection of values, such as arrays, strings, or objects. It exposes a method called `next()`, which provides the next value in the sequence along with a boolean (`done`) that indicates whether the iteration is complete.

The structure returned by `next()` is:
```js
{
  value: <next value>,  // The next value in the iteration.
  done: <boolean>       // Whether the iterator has been fully consumed.
}
```

A **for...of** loop works with any object that is iterable, including arrays, strings, or any object that implements the `Symbol.iterator` method. This method is what makes an object iterable.

### **How Iterators Work**

An iterator must implement the following:

1. **next()**: Returns an object with two properties: `value` (the next value in the iteration) and `done` (a boolean that tells if the iteration is complete).
2. **Symbol.iterator**: This symbol defines the default iterator for an object. If you define this method in your object, it allows it to be used in a `for...of` loop and also provides the iterator logic.

### Example 1: Simple Iterator (helper function)

```js
function helper(arr) {
  let nextIndex = 0;
  let arrLength = arr.length;
  return {
    next() {
      return nextIndex < arrLength
        ? { value: arr[nextIndex++], done: nextIndex >= arrLength }
        : { value: null, done: true };
    },
    done() {
      return nextIndex >= arrLength;
    },
  };
}

const input = [2, 4, 7, 8];
let iterator = helper(input);

console.log(iterator.next()); // { value: 2, done: false }
console.log(iterator.next()); // { value: 4, done: false }
console.log(iterator.done()); // false
console.log(iterator.next()); // { value: 7, done: false }
console.log(iterator.done()); // false
console.log(iterator.next()); // { value: 8, done: true }
console.log(iterator.done()); // true
console.log(iterator.next()); // { value: null, done: true }
```

### Example 2: LinkedList with Iterator

In this example, we implement a `LinkedList` class that provides an iterator for its elements. The `Symbol.iterator` method is defined to make this class iterable.

```js
class LinkedList {
  constructor(data) {
    this.data = data;
  }

  firstItem() {
    return this.data.find(i => i.head);
  }

  findById(id) {
    return this.data.find(i => i.id === id);
  }

  [Symbol.iterator]() {
    let item = { next: this.firstItem().id };
    return {
      next: () => {
        item = this.findById(item.next);
        if (item) {
          return { value: item.value, done: false };
        }
        return { value: undefined, done: true };
      },
    };
  }
}

const myList = new LinkedList([
  { id: 'a10', value: 'First', next: 'a13', head: true },
  { id: 'a11', value: 'Last', next: null, head: false },
  { id: 'a12', value: 'Third', next: 'a11', head: false },
  { id: 'a13', value: 'Second', next: 'a12', head: false },
]);

for (let item of myList) {
  console.log(item); // Output: 'First', 'Second', 'Third', 'Last'
}
```

### Example 3: SpecialList with Multiple Iterators

Here, we define an iterator that allows iteration over a filtered subset of items within a collection. The `SpecialList` class uses a method to iterate over only the "complete" items.

```js
class SpecialList {
  constructor(data) {
    this.data = data;
  }

  [Symbol.iterator]() {
    return this.data[Symbol.iterator](); // Use default array iterator
  }

  values() {
    return this.data
      .filter(i => i.complete) // Filter complete items
      .map(i => i.value) // Map to just values
      [Symbol.iterator](); // Return an iterator for the values
  }
}

const myList = new SpecialList([
  { complete: true, value: 'Lorem ipsum' },
  { complete: true, value: 'dolor sit amet' },
  { complete: false },
  { complete: true, value: 'adipiscing elit' },
]);

// Iterate over all items in the list
for (let item of myList) {
  console.log(item); // 'Lorem ipsum', 'dolor sit amet', undefined, 'adipiscing elit'
}

// Iterate only over complete items
for (let item of myList.values()) {
  console.log(item); // 'Lorem ipsum', 'dolor sit amet', 'adipiscing elit'
}
```

### **Where You Can Use Iterators**

Iterators are widely used in JavaScript for scenarios involving collections of data, including but not limited to:

1. **Arrays**: Arrays are iterable by default. You can loop through arrays using iterators.
2. **Custom Data Structures**: For objects like linked lists, trees, graphs, or other complex data structures, iterators help you define how to traverse them.
3. **Generators**: JavaScript's generator functions are iterators themselves. They allow for custom, lazy-loaded iteration.
4. **Streams**: In I/O operations, like reading files or processing large amounts of data, iterators can help manage streams of data.

### Conclusion

Iterators provide a standardized and efficient way of looping over elements in a collection, including custom collections. With `Symbol.iterator` and the `next()` method, JavaScript allows you to define and control how data is accessed, making iteration more flexible and powerful.