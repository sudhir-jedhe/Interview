```js
const toBoolean = (value, truthyValues = ["true"]) => {
  const normalizedValue = String(value).toLowerCase().trim();
  return truthyValues.includes(normalizedValue);
};

toBoolean("true"); // true
toBoolean("TRUE"); // true
toBoolean("True"); // true
toBoolean("tRue "); // true
toBoolean("false"); // false
toBoolean("FALSE"); // false
toBoolean("False"); // false
toBoolean("fAlse "); // false
toBoolean("YES", ["yes"]); // true
toBoolean("no", ["yes"]); // false
```
