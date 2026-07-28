```js
export const stringify = (value) => {
  if (value === null) {
    return "null";
  }

  if (
    typeof value === "undefined" ||
    typeof value === "function" ||
    typeof value === "symbol"
  ) {
    return undefined;
  }

  if (typeof value === "string") {
    return '"' + value + '"';
  }

  if (Array.isArray(value)) {
    return "[" + value.map(stringify).join(",") + "]";
  }

  if (typeof value === "object") {
    let result = "";
    let keys = Object.keys(value);
    keys.forEach((key, index) => {
      let val = stringify(value[key]);
      if (val !== undefined) {
        result += '"' + key + '":' + val + ",";
      }
    });
    return "{" + result.slice(0, -1) + "}";
  }

  return value.toString();
};

// 42 => '42'
// true => 'true'

// null => 'null'
// undefined => undefined
// [1, 'two', true] => '[1, 'two', true]'
