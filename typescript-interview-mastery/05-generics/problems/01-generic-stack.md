# Implement a generic Stack&lt;T&gt;

## Problem

Implement a fully-typed `Stack<T>` class supporting:

- `push(item: T): void`
- `pop(): T | undefined`
- `peek(): T | undefined`
- `isEmpty(): boolean`
- `size(): number`

`pop` and `peek` must return `T | undefined` rather than `T`, since calling them on an empty stack is a valid runtime scenario the type should account for.

## Solution

```typescript
class Stack<T> {
  private items: T[] = [];

  push(item: T): void {
    this.items.push(item);
  }

  pop(): T | undefined {
    return this.items.pop();
  }

  peek(): T | undefined {
    return this.items[this.items.length - 1];
  }

  isEmpty(): boolean {
    return this.items.length === 0;
  }

  size(): number {
    return this.items.length;
  }
}
```

## Usage

```typescript
const stack = new Stack<number>();
stack.push(1);
stack.push(2);
stack.push(3);

console.log(stack.peek()); // 3
console.log(stack.pop());  // 3
console.log(stack.size()); // 2

const emptyPop = new Stack<string>().pop(); // string | undefined, correctly typed
```

## Discussion

The private backing array `items: T[]` never leaks out directly — every access goes through a method that returns the right optionality (`T | undefined` for `pop`/`peek`, hard `void`/`boolean`/`number` for the rest). A common mistake is typing `pop(): T` and reaching for a non-null assertion (`this.items.pop()!`) to make the compiler happy — that discards a real signal (the stack might be empty) instead of modeling it. Callers that know their stack is non-empty by construction can narrow with an explicit check or an assertion at the call site, where the surrounding context justifies it, rather than the class silently lying about what it returns.
