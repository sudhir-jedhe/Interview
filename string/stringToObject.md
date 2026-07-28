```js
function stringToObject(str, value) {
  // write your code below

  if (!str) {
    throw new TypeError("Invalid Input");
  }
  if (str.length === 1) {
    return {
      [str]: value,
    };
  }
  const isDottedKeys = str
    .replaceAll('."', "[")
    .replaceAll('".', "[")
    .replaceAll('"', "")
    .split("[");
  console.log(isDottedKeys);
  const arr = isDottedKeys.length > 1 ? isDottedKeys : str.split(".");
  const obj = {};
  arr.reduce((acc, key, index) => {
    if (index === arr.length - 1) {
      acc[key] = value;
    } else {
      acc[key] = Number.isInteger(parseInt(arr[index + 1])) ? [] : {};
    }
    return acc[key];
  }, obj);
  return obj;
}

/********************** */

function stringToObject(input, finalValue) {
  // write your code below
  const paths = [];
  let shouldEscapeDotAccessor = false;
  let currentPath = "";

  for (let c = 0; c < input.length; c++) {
    const currentCharacter = input[c];

    if (paths.length && c === input.length - 1) {
      if (currentCharacter !== '"') {
        currentPath += currentCharacter;
      }
      paths.push(currentPath);
    }

    if (currentCharacter === ".") {
      if (shouldEscapeDotAccessor) {
        currentPath += currentCharacter;
      } else {
        paths.push(currentPath);
        currentPath = "";
      }
    } else if (currentCharacter === '"') {
      shouldEscapeDotAccessor = !shouldEscapeDotAccessor;
    } else {
      currentPath += currentCharacter;
    }
  }

  if (paths.length === 0) {
    throw TypeError();
  }

  const finalObject = {};
  let currentReference = finalObject;

  for (let p = 0; p < paths.length; p++) {
    let currentPath = paths[p];

    if (p === paths.length - 1) {
      currentReference[currentPath] = finalValue;
    } else if (!Number.isNaN(Number(paths[p + 1]))) {
      currentReference[currentPath] = [];
      currentReference = currentReference[currentPath];
    } else {
      currentReference[currentPath] = {};
      currentReference = currentReference[currentPath];
    }
  }

  return finalObject;
}

/*********************************** */

function stringToObject(input, finalValue) {
  if (!input) {
    throw new TypeError("Invalid Input");
  }

  if (input.length === 1) {
    return { [input]: finalValue };
  }

  let formattedInput = input // 'a."b.c".d.e."f.g"'
    .replaceAll(/"\w+\.\w+"/g, (s) => s.replace(".", "{-}")) // 'a."b{-}c".d.e."f{-}g"'
    .replaceAll('"', "") // 'a.b{-}c.d.e.f{-}g'
    .replaceAll(".", "[-]") // 'a[-]b{-}c[-]d[-]e[-]f{-}g'
    .replaceAll("{-}", "."); // 'a[-]b.c[-]d[-]e[-]f.g'
  const keys = formattedInput.split("[-]"); // ['a','b.c','d','e','f.g']

  const obj = {};
  let temp = obj;
  for (let [index, key] of keys.entries()) {
    if (index === keys.length - 1) {
      temp[key] = finalValue;
    } else {
      temp[key] = isNaN(keys[index + 1]) ? {} : [];
      temp = temp[key];
    }
  }
  return obj;
}
```
