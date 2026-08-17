# Comparisons: Destructuring, Spread & Rest

## Spread vs. Rest

| Aspect | Spread (`...`) | Rest (`...`) |
|---|---|---|
| Direction | Expands an iterable/object into individual items | Collects multiple items into one array/object |
| Where it appears | Array/object literals, function call arguments | Function parameter list, destructuring pattern |
| Example | `foo(...args)` | `function foo(...args) {}` |
| Result | Values are spread out | A new array/object is created |

The syntax is identical, so the only reliable way to tell them apart is context: if it's producing values (right-hand side, call site), it's spread; if it's consuming/binding values (left-hand side, parameter list), it's rest. The most common mistake is assuming `...` always "means the same thing" and getting confused reading `function f(...args)` vs `f(...arr)` side by side.

## Array Destructuring vs. Object Destructuring

| Aspect | Array Destructuring | Object Destructuring |
|---|---|---|
| Matches by | Position/index | Property name |
| Skipping | `const [, b] = arr` (empty slot) | Not applicable — just don't name the key |
| Renaming | Rename by choosing the variable name directly | `const { key: newName } = obj` |
| Source requirement | Any iterable | Any object (or value coercible to one) |

Use array destructuring when order is meaningful and fixed (like `[state, setState] = useState()`); use object destructuring when you care about named fields regardless of order (like config objects). A common mistake is trying to skip a property in object destructuring the way you skip an array element — object destructuring has no positional "empty slot" concept, you simply omit the key.

## Object Spread `{ ...obj }` vs. `Object.assign({}, obj)`

| Aspect | Object Spread | `Object.assign` |
|---|---|---|
| Syntax | Declarative literal syntax | Function call |
| Sets vs. defines | Spread triggers setters on the target in some edge cases differently than assign in older engines* | Copies via `[[Set]]` as well |
| Getters | Spread evaluates the source's getter once and copies the resulting value | Same behavior |
| Readability | Cleaner for merging into a new literal | More flexible — can mutate an existing target (`Object.assign(target, ...)`) |

*In modern engines both behave equivalently for own-enumerable-property copying; the practical difference is that `Object.assign` can mutate an existing object in place (`Object.assign(target, src)`), whereas spread always creates a brand-new object. The common mistake is using `Object.assign(target, src)` intending an immutable update but forgetting it mutates `target` too.

## Rest Parameters vs. the `arguments` Object

| Aspect | Rest Parameters (`...args`) | `arguments` |
|---|---|---|
| Type | Real `Array` (has `.map`, `.filter`, etc.) | Array-like, not a real array |
| Arrow functions | Works normally | Not available — inherits from enclosing scope |
| Scope | Only collects the parameters not otherwise named | Contains **all** arguments passed, regardless of named params |

Prefer rest parameters in all new code — they're array methods-ready and work in arrow functions, while `arguments` is a legacy quirk that doesn't exist in arrow functions at all (a frequent source of `arguments is not defined` bugs when refactoring a regular function into an arrow function).
