### Explanation of Each Example

Let's go through each example one by one, explaining what's happening and the output.

---

### 1. **Generator with `return` statement inside `finally`**

```javascript
function* gen() {
  try {
    yield 1;
    yield 2;
    return 3;
    yield 4;
  } finally {
    yield 5;
    return 6;
    yield 7;
  }
}

console.log([...gen()]);
```

**Explanation:**

- The generator first yields `1` and `2` in the `try` block.
- When the generator returns `3`, the generator will stop yielding from the `try` block.
- The `finally` block will execute when the generator exits. First, it yields `5`, and then it returns `6`.
- After the `return 6` statement in the `finally` block, the generator stops and doesn't yield further, ignoring the `yield 7` after `return 6`.

**Output:**

```
[1, 2, 5]
```

**Key Points:**

- The `finally` block is executed after the `return` in the `try` block.
- A `return` in the generator stops further execution and yields the value from the return.
- Even after a `return` in `finally`, no further yields are processed.

---

### 2. **Generator with `return()` and exception handling**

```javascript
function* g() {
  console.log(1);
  try {
    console.log(2);
    yield 2;
    console.log(3);
    throw new Error("error");
  } finally {
    console.log(4);
  }
}

const obj = g();
obj.next();
obj.return();
```

**Explanation:**

- The generator starts, and `console.log(1)` is printed when the generator is called.
- The first `yield 2` occurs, and `console.log(2)` is printed.
- `obj.next()` then returns `{ value: 2, done: false }` and pauses at `yield 2`.
- `obj.return()` is then called, which triggers the `finally` block. `console.log(4)` is printed from the `finally` block, and the generator finishes without yielding any more values.

**Output:**

```
1
2
4
```

**Key Points:**

- Calling `return()` on a generator exits it immediately.
- Any code in the `finally` block executes when `return()` is called.

---

### 3. **Using `return()` in a generator with multiple `yield`s**

```javascript
function* gen() {
  yield 1;
  try {
    yield 2;
    yield 3;
  } finally {
    yield 4;
  }
  yield 5;
}

const g = gen();
console.log(g.next().value); // 1
console.log(g.next().value); // 2
console.log(g.return(6).value); // 6
console.log(g.next().value); // 4
console.log(g.next().value); // undefined
```

**Explanation:**

- The generator first yields `1`, then `2`.
- After `g.next()` is called again, `yield 3` would have occurred, but `return(6)` is invoked. The return value of `6` will be returned immediately, and the generator is effectively stopped.
- The `finally` block then executes, and `yield 4` is returned.
- The next `next()` call returns `undefined` because the generator has finished execution after the `return`.

**Output:**

```
1
2
6
4
undefined
```

**Key Points:**

- Calling `return()` immediately halts the generator and can provide a return value.
- Code after `return()` won't be executed unless it's in the `finally` block.

---

### 4. **Generator using `yield*` for delegation**

```javascript
function* genA() {
  yield [1, 2, 3];
}

function* genB() {
  yield* [1, 2, 3];
}

console.log(genA().next().value);
console.log(genB().next().value);
```

**Explanation:**

- `genA` yields an array `[1, 2, 3]`.
- `genB` uses `yield*` to delegate the yielding process to the array `[1, 2, 3]`, which means it will yield each value of the array individually.
- `genA().next().value` returns the array `[1, 2, 3]`, while `genB().next().value` returns the first element `1` in the array.

**Output:**

```
[1, 2, 3]
1
```

**Key Points:**

- `yield*` allows one generator to delegate its yielding to another iterable, such as an array or another generator.

---

### 5. **Generator with multiple yields and value passing**

```javascript
function* gen() {
  yield 2 * (yield 100);
}

const generator = gen();
console.log(generator.next().value); // 100
console.log(generator.next(1).value); // 2
console.log(generator.next(1).value); // undefined
```

**Explanation:**

- The generator first `yield`s `100`, and `generator.next()` returns `{ value: 100, done: false }`.
- When `generator.next(1)` is called, the value `1` is passed back to the generator, and the first `yield 100` is replaced by `2 * 1`, so the next value yielded is `2`.
- The next `generator.next(1)` doesn't yield anything, so it returns `{ value: undefined, done: true }`.

**Output:**

```
100
2
undefined
```

**Key Points:**

- `yield` can take an expression, and values can be passed back into the generator via `next(value)`.
- The second `next()` call passes `1` back into the generator and continues execution.

---

### Final Summary:

- **Generator `return`**: Calling `return()` immediately stops the generator and can yield a value.
- **Delegation (`yield*`)**: You can delegate yielding to another iterable like an array or another generator.
- **Passing Values to Generators**: `next(value)` allows values to be passed back into the generator, which can be used in expressions inside the generator.
