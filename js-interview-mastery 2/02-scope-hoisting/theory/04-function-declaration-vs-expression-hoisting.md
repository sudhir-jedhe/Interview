# Function Declaration Hoisting vs Function Expression Hoisting

Function *declarations* are fully hoisted — both the name and the function body — so you can call them before their line in the source:

```js
greet(); // 'hi' — works, fully hoisted
function greet() { console.log('hi'); }
```

Function *expressions* (including arrow functions) assigned to a variable follow that variable's hoisting rules. If assigned via `var`, the variable is hoisted as `undefined`, so calling it early throws "not a function":

```js
sayHi(); // TypeError: sayHi is not a function
var sayHi = function() { console.log('hi'); };
```

If assigned via `let`/`const`, it's in the TDZ, so calling it early throws a `ReferenceError` instead.

## Comparison table

| Aspect | Function Declaration (`function foo() {}`) | Function Expression (`const foo = function() {}` or arrow) |
|---|---|---|
| Hoisting | Entire function (name + body) hoisted | Only the variable declaration is hoisted, following `var`/`let`/`const` rules |
| Callable before definition line? | Yes | No — throws `TypeError` (if `var`, calling `undefined`) or `ReferenceError` (if `let`/`const`, TDZ) |
| Typical use | Utility functions used before their definition, self-documenting top-level functions | Conditional definitions, callbacks, anything assigned dynamically |

Use function declarations when you want a function usable anywhere in its scope regardless of source order (common for top-level helpers). Use function expressions when the function is conditionally created, passed around, or assigned to an object/array. The common mistake is assuming a `const`-assigned arrow function is hoisted like a declaration — it isn't, and calling it early throws.
