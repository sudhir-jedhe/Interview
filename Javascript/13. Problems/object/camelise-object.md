```js
export const camelise = (obj) => {
  if (typeof obj !== "object" || obj === null) {
    return obj;
  }
  if (Array.isArray(obj)) {
    return obj.map(camelise);
  }
  return Object.keys(obj).reduce((acc, key) => {
    const camelKey = key.replace(/_([a-z])/g, (match, p1) => p1.toUpperCase());
    const camelisedValue = camelise(obj[key]);
    acc[camelKey] = camelisedValue;
    return acc;
  }, {});
};

test("Camelise an object with one key", () => {
  const obj = { foo_bar: 42 };
  const expectedOutput = { fooBar: 42 };
  expect(camelise(obj)).toEqual(expectedOutput);
});

/************************** */

export const camelise = (obj) => {
  const result = {};
  const keys = Object.keys(obj);

  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    const value = obj[key];

    if (Array.isArray(value)) {
      result[camelCase(key)] = value.map((v) => {
        if (typeof v === "object" && v !== null) {
          return camelise(v);
        } else {
          return v;
        }
      });
    } else if (typeof value === "object" && value !== null) {
      result[camelCase(key)] = camelise(value);
    } else {
      result[camelCase(key)] = value;
    }
  }

  return result;
};

function camelCase(str) {
  return str.replace(/_([a-z])/g, (match, letter) => letter.toUpperCase());
}
