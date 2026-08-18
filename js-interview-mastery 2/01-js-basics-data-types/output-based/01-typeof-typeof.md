# `typeof typeof`

```js
console.log(typeof typeof 1);
```

**Answer:** `'string'`

**Why:** `typeof 1` evaluates first and returns the string `'number'`. Then `typeof 'number'` is evaluated, and since it's operating on a string, it returns `'string'`. `typeof` always returns a string, so `typeof typeof anything` is always `'string'`.
