# Rest: Collecting

Rest is the mirror image of spread — it gathers the remaining items into a new array (in destructuring or function params) or a new object (in object destructuring):

```js
function log(first, ...rest) {
  console.log(first, rest); // 1 [2, 3, 4]
}
log(1, 2, 3, 4);

const [head, ...tail] = [1, 2, 3];               // head = 1, tail = [2, 3]
const { a, ...others } = { a: 1, b: 2, c: 3 };    // others = { b: 2, c: 3 }
```

Rest parameters must be the **last** parameter — `function f(...rest, last)` is a syntax error. Rest also always produces a real, independent `Array` (unlike the old `arguments` object, which is array-*like*).

## Rest parameters vs. the `arguments` object

| Aspect | Rest Parameters (`...args`) | `arguments` |
|---|---|---|
| Type | Real `Array` (has `.map`, `.filter`, etc.) | Array-like, not a real array |
| Arrow functions | Works normally | Not available — inherits from enclosing scope |
| Scope | Only collects the parameters not otherwise named | Contains **all** arguments passed, regardless of named params |

Prefer rest parameters in all new code — they're array-methods-ready and work in arrow functions, while `arguments` is a legacy quirk that doesn't exist in arrow functions at all (a frequent source of `arguments is not defined` bugs when refactoring a regular function into an arrow function).
