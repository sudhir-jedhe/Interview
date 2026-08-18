# Object spread merge order — later keys overwrite earlier ones

```js
const defaults = { theme: 'light', size: 'md' };
const overrides = { size: 'lg' };
const merged = { ...defaults, ...overrides };
console.log(merged);
// { theme: 'light', size: 'lg' }
```
