# Tagged template receives string chunks + interpolated values separately

```js
function shout(strings, ...values) {
  return strings.join('').toUpperCase() + ' ' + values.join(',');
}
console.log(shout`hi ${1} there ${2}`);
// HI  THERE  1,2
```

The tag function `shout` receives `strings` (`['hi ', ' there ', '']`) and the interpolated values (`1`, `2`) as separate arguments — the literal is never assembled into a plain string before being handed to the tag.
