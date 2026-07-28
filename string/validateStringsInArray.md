```js
export const validateStrings = (array) => {
  return array.every((element) => typeof element === "string");
};

export const validateStrings = (array) => {
  for (let i = 0; i < array.length; i++) {
    if (typeof array[i] !== "string") {
      return false;
    }
  }
  return true;
};

validateStrings(["hello", "world"]); // Output: true
validateStrings(["hello", 123]); // Output: false
validateStrings([]); // Output: false
```
