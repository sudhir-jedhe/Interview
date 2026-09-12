```js
function f() {
  return
  {
    name:'Sudhir'
  }
}

f()
```

The output of calling `f()` is **`undefined`**.

### Why This Happens

JavaScript features **Automatic Semicolon Insertion (ASI)**. When the JavaScript engine encounters a newline immediately after a `return` statement, it automatically places a semicolon there.

The engine parses your function like this:

```javascript
function f() {
  return; // Semicolon inserted automatically here
  {
    name: 'Sudhir' // Treated as an unreachable block with an unused label, never executed
  }
}

```

Because the `return;` executes with nothing directly following it on the same line, the function immediately terminates and returns `undefined`.

---

### How to Fix It

Keep the opening curly brace `{` on the **same line** as the `return` statement, or wrap the expression in parentheses:

```javascript
// Option 1: Brace on the same line
function f() {
  return {
    name: 'Sudhir'
  };
}

// Option 2: Using parentheses
function f() {
  return (
    {
      name: 'Sudhir'
    }
  );
}

console.log(f()); // { name: 'Sudhir' }

```
