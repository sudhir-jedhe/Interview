# JS Basics & Data Types — Notes

JavaScript has exactly seven primitive types: `string`, `number`, `boolean`, `null`, `undefined`, `symbol`, and `bigint`. Everything else — objects, arrays, functions, dates, regexes, maps, sets — is a reference type, meaning under the hood it's an `object`. This split is the single most important mental model in the language because it determines two things: how values are copied, and how they're compared.

## Value semantics vs reference semantics

Primitives are copied **by value**. When you assign a primitive to a new variable or pass it into a function, you get an independent copy.

```js
let a = 10;
let b = a;
b = 20;
console.log(a); // 10 — untouched
```

Objects (and arrays, functions) are copied **by reference**. The variable doesn't hold the object itself — it holds a pointer to a location in memory. Copying the variable copies the pointer, not the data.

```js
const obj1 = { x: 1 };
const obj2 = obj1;
obj2.x = 99;
console.log(obj1.x); // 99 — same underlying object
```

This is why `const` on an object doesn't make it immutable — `const` only prevents *reassigning the variable*, not mutating what it points to. `const obj1 = {}` forbids `obj1 = {}` later, but `obj1.x = 1` is perfectly legal.

Function arguments follow the same rule: primitives are passed by value (the function gets a copy), objects are passed "by reference value" — the reference itself is copied, so reassigning the parameter inside the function doesn't affect the caller, but mutating the object it points to does.

```js
function reassign(o) { o = { x: 'new' }; }
function mutate(o) { o.x = 'mutated'; }

const original = { x: 'old' };
reassign(original);
console.log(original.x); // 'old' — reassignment inside the function is local

mutate(original);
console.log(original.x); // 'mutated' — mutation affects the shared object
```

## `typeof` and its quirks

`typeof` returns a string describing a value's type, but it has two famous inconsistencies:

```js
typeof null;        // 'object'  — a decades-old bug, kept for backward compatibility
typeof undefined;   // 'undefined'
typeof function(){}; // 'function' — functions get their own typeof result
typeof [];           // 'object'  — arrays are NOT distinguished by typeof
typeof Symbol();     // 'symbol'
typeof 10n;          // 'bigint'
```

`typeof null === 'object'` happens because in the original JS engine, values were represented with a type tag, and objects had the tag `0`. `null` was represented as the null pointer (`0x00`), so it accidentally got tagged as an object. Fixing it now would break the web, so it's permanent. To reliably check for `null`, use `value === null`. To check for arrays, use `Array.isArray(value)`, not `typeof`.

## `null` vs `undefined`

Both represent "no value," but with different intent. `undefined` means a variable has been declared but not assigned, a function parameter wasn't passed, or an object property doesn't exist. It's the *default* absence of a value, set by the engine. `null` is an *intentional* absence — you assign it explicitly to say "this is empty on purpose."

```js
let x;
console.log(x); // undefined — declared, never assigned

function f(a) { console.log(a); }
f(); // undefined — parameter not supplied

let y = null; // explicitly "nothing here"
```

Loose equality treats them as equal (`null == undefined` is `true`), but strict equality does not (`null === undefined` is `false`). Prefer `===` in almost all cases; reserve `== null` as a deliberate idiom for "is this either null or undefined."

## `NaN` and how to test for it

`NaN` ("Not a Number") is the result of an invalid numeric operation (`0/0`, `parseInt('abc')`). Its defining oddity: it's the only value in JS that is not equal to itself.

```js
NaN === NaN; // false
```

Use `Number.isNaN(value)` to test for it — it only returns `true` for the actual `NaN` value. The global `isNaN(value)` first coerces its argument to a number, which causes false positives:

```js
isNaN('hello');        // true  — coerces 'hello' to NaN, then checks
Number.isNaN('hello'); // false — 'hello' is not the NaN value, no coercion
Number.isNaN(NaN);     // true
```

## Template literals

Template literals (backticks) support interpolation and multi-line strings without concatenation:

```js
const name = 'Sam';
const greeting = `Hello, ${name}! You have ${2 + 3} messages.`;
// 'Hello, Sam! You have 5 messages.'
```

Expressions inside `${}` are evaluated, coerced to strings, and inserted — this is cleaner and less error-prone than `'Hello, ' + name + '!'` chains, especially with nested expressions or function calls.
