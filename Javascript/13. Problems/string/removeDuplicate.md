```js
export const removeDuplicates = (str) => {
  if (str.length === 0) {
    return "";
  }

  let result = "";
  for (let i = 0; i < str.length; i++) {
    if (result.indexOf(str[i]) === -1) {
      result += str[i];
    }
  }

  return result;
};

export const removeDuplicates = (str) => {
  if (str.length === 0) {
    return "";
  }

  let set = new Set();
  let result = "";
  for (let i = 0; i < str.length; i++) {
    if (!set.has(str[i])) {
      set.add(str[i]);
      result += str[i];
    }
  }

  return result;
};
