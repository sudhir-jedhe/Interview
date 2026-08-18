# `typeof NaN` and `NaN === NaN`

```js
console.log(typeof NaN);
console.log(NaN === NaN);
```

**Answer:** `'number'` then `false`

**Why:** `NaN` is, perhaps confusingly, a value of type `number` — it represents "an invalid number result," not "not a number type." Per the IEEE-754 spec, `NaN` is defined to never equal anything, including itself, so `NaN === NaN` is `false`.
