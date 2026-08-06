Yes, you're absolutely right! The `Symbol.iterator` is an integral part of the iterator protocol in JavaScript, and by defining it, you can make any object or class iterable. This gives you a lot of flexibility, as it allows you to control how an object or class should behave when iterated over with constructs like `for...of` or `spread syntax`.

Let's dive deeper into the examples you provided.

### 1. **Custom Iterator for an Object**:

In the first example, you're making a regular JavaScript object iterable by adding a `Symbol.iterator` method. This method is a generator function that yields each key-value pair in the object.

#### Explanation:
- You define a custom iterator for the object `obj` by using `Symbol.iterator` with a generator function.
- The `Object.keys(obj)` method returns an array of keys, which are then iterated over.
- For each key, you yield an object with the key and its corresponding value.

```js
const obj = { a: 1, b: 2, c: 3 };

obj[Symbol.iterator] = function* () {
  for (let key of Object.keys(obj)) yield { [key]: obj[key] };
};

console.log([...obj]); // [ { a: 1 }, { b: 2 }, { c: 3 }]
```

### 2. **Custom Iterator for a Number (IterableNumber Class)**:

In this example, you're extending the `Number` class to make it iterable by defining the `Symbol.iterator` method in the `IterableNumber` class. The `Symbol.iterator` generator function splits the number into individual digits and yields them.

#### Explanation:
- The class `IterableNumber` inherits from `Number`.
- The generator function converts the number to a string (`${this}`), then splits it into an array of individual characters, which are then parsed back into digits using `Number.parseInt`.
- Each digit is then yielded, making the number iterable.

```js
class IterableNumber extends Number {
  *[Symbol.iterator]() {
    for (let digit of [...`${this}`].map(d => Number.parseInt(d))) yield digit;
  }
}

const num = new IterableNumber(1337);
console.log([...num]); // [ 1, 3, 3, 7 ]
```

### 3. **The Power of `Symbol.iterator`**:

The `Symbol.iterator` is a powerful feature in JavaScript. It allows you to customize how objects, numbers, or even instances of custom classes behave when iterated over. Here's how it can be applied:

- **Objects**: By implementing `Symbol.iterator`, you can iterate over key-value pairs in an object in a custom order, or modify the structure of the yielded items.
- **Numbers**: With `Symbol.iterator`, you can split a number into digits, iterate over characters in a string, or perform any other custom operation on the number.
- **Classes**: You can create custom classes that behave like arrays or other iterable collections.

### Custom Iteration Use-Cases:

1. **Objects**:
   - You can define custom iteration behavior for any object. For example, you could iterate over only specific properties, or the order of the properties could be modified.
   
2. **Strings and Numbers**:
   - Strings and numbers are iterable by default (e.g., via `for...of`), but with `Symbol.iterator`, you can customize the behavior to extract or transform values.
   
3. **Classes**:
   - You can create your own iterable classes. This could be useful when building custom data structures like linked lists, trees, or graphs, where you control the iteration process.

### More Complex Example (Custom Iterable Class):

Here's an example of a custom class where you can define a more complex iteration, such as iterating over a binary tree or graph:

```js
class BinaryTree {
  constructor(value) {
    this.value = value;
    this.left = null;
    this.right = null;
  }

  insert(value) {
    if (value < this.value) {
      if (this.left) {
        this.left.insert(value);
      } else {
        this.left = new BinaryTree(value);
      }
    } else {
      if (this.right) {
        this.right.insert(value);
      } else {
        this.right = new BinaryTree(value);
      }
    }
  }

  *[Symbol.iterator]() {
    if (this.left) yield* this.left;   // Recurse into the left subtree
    yield this.value;                   // Yield current node's value
    if (this.right) yield* this.right;  // Recurse into the right subtree
  }
}

const tree = new BinaryTree(10);
tree.insert(5);
tree.insert(15);
tree.insert(2);

console.log([...tree]); // [ 2, 5, 10, 15 ] (In-order traversal)
```

### Conclusion:
Using `Symbol.iterator` and generator functions, you can create highly flexible and customizable iterators for any object, number, or class in JavaScript. It's an extremely powerful tool for making your data structures iterable, which enhances code readability, reusability, and maintainability.