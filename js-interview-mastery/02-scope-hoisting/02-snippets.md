# Scope & Hoisting — Snippets

```js
// 1. var leaks out of blocks, let/const don't
function scopeDemo() {
  if (true) {
    var leaked = 'I am function-scoped';
    let contained = 'I am block-scoped';
  }
  console.log(leaked); // 'I am function-scoped'
  // console.log(contained); // ReferenceError: contained is not defined
}
scopeDemo();
```

```js
// 2. var hoists as undefined; let/const hoist into the TDZ
console.log(hoistedVar); // undefined
var hoistedVar = 'value';

try {
  console.log(hoistedLet); // ReferenceError: Cannot access 'hoistedLet' before initialization
} catch (e) {
  console.log(e.constructor.name); // 'ReferenceError'
}
let hoistedLet = 'value';
```

```js
// 3. Function declarations are fully hoisted; function expressions are not
console.log(declared()); // 'declared works' — full hoist, callable before definition

try {
  expressed();
} catch (e) {
  console.log(e.message); // 'expressed is not a function'
}

function declared() { return 'declared works'; }
var expressed = function() { return 'expressed works'; };
```

```js
// 4. Redeclaration rules: var allows it silently, let throws
var x = 1;
var x = 2;
console.log(x); // 2 — no error

let y = 1;
try {
  eval('let y = 2;'); // SyntaxError inside eval to avoid crashing the whole snippet
} catch (e) {
  console.log(e.constructor.name); // 'SyntaxError'
}
```

```js
// 5. The var-in-loop closure bug and the let fix
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log('var loop:', i), 0);
}
// logs after sync code finishes: 'var loop: 3' x3

for (let j = 0; j < 3; j++) {
  setTimeout(() => console.log('let loop:', j), 0);
}
// logs: 'let loop: 0', 'let loop: 1', 'let loop: 2'
```

```js
// 6. Block scope creates a fresh binding each time in a loop with let
const fns = [];
for (let i = 0; i < 3; i++) {
  fns.push(() => i);
}
console.log(fns.map(fn => fn())); // [0, 1, 2] — each closure captured its own i
```

```js
// 7. Nested scope chain lookup (lexical scoping)
const level0 = 'global';
function level1() {
  const level1Var = 'level1';
  function level2() {
    console.log(level0, level1Var); // 'global' 'level1' — walks up the chain
  }
  level2();
}
level1();
```
