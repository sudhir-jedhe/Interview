# call vs apply

`call` and `apply` both live on `Function.prototype`, meaning every function has access to them. Both let you explicitly set what `this` refers to when a function runs and both invoke the function **immediately** — the only difference between them is how you pass the function's own arguments.

## `call`: arguments listed individually

```js
function introduce(greeting, punctuation) {
  return `${greeting}, I'm ${this.name}${punctuation}`;
}
const user = { name: 'Ada' };
console.log(introduce.call(user, 'Hi', '!')); // "Hi, I'm Ada!"
```

The first argument to `call` becomes `this` inside the function; every argument after that is passed to the function positionally, exactly like a normal call, just listed as extra arguments to `call` itself.

## `apply`: arguments as an array

```js
console.log(introduce.apply(user, ['Hi', '!'])); // "Hi, I'm Ada!" — same result as call
```

`apply` behaves identically to `call` except the function's arguments are passed as a single array (or array-like) instead of individually. This matters when you already have your arguments as an array, or don't know how many there are ahead of time. A classic historical use case was `Math.max.apply(null, arrayOfNumbers)` to find the max of an array before the spread operator existed — `Math.max(...arrayOfNumbers)` is the modern equivalent.

## Side-by-side

| Aspect | `call` | `apply` |
|---|---|---|
| Invocation | Immediate | Immediate |
| Argument format | Comma-separated, listed individually | Single array (or array-like) |
| Syntax | `fn.call(thisArg, a, b, c)` | `fn.apply(thisArg, [a, b, c])` |
| Best when | You know the exact arguments ahead of time | Your arguments already exist as an array, or the count is dynamic |

Use `call` when writing out arguments literally is natural (a fixed, known argument list). Use `apply` when you already have an array of arguments, such as forwarding `arguments` or spreading a dynamically-built list.

## Common mistake

`apply`'s second argument must be `null`, `undefined`, or an object (an array or array-like). Internally it runs `CreateListFromArrayLike` on that argument, which requires an object type and throws a `TypeError` for a primitive like a bare string:

```js
function greet(greeting) { return `${greeting}, ${this.name}`; }
greet.apply({ name: 'Lee' }, 'Hey'); // TypeError — should be ['Hey']
```

Always wrap arguments in an array, or use the modern spread-operator equivalent (`fn(...argsArray)`), which sidesteps this entirely and reads identically for both `call`- and `apply`-style forwarding.
