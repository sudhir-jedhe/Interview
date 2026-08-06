```js

let arr = [23, 0, "gfg", false, true, NaN, 12, "hi", undefined, [], ""];

function removeFalse(arr) {
  return arr.reduce((acc, curr) => {
    // Check if the truthy then return concatenated value acc with curr.
    // else return only acc.
    if (curr) {
      return [...acc, curr];
    } else {
      return acc;
    }
  }, []); // Initialize with an empty array
}

console.log(removeFalse(arr));
```


If you want to **remove only `false` values** from an object or array, there are several JavaScript approaches.

***

# 1. Using `Object.entries()` + `filter()`

### Object

```javascript
const obj = {
  name: "Sudhir",
  active: false,
  verified: true,
  admin: false
};

const result = Object.fromEntries(
  Object.entries(obj).filter(
    ([_, value]) => value !== false
  )
);

console.log(result);
```

### Output

```javascript
{
  name: "Sudhir",
  verified: true
}
```

***

# 2. Using `reduce()`

```javascript
function removeFalse(obj) {
  return Object.entries(obj).reduce(
    (acc, [key, value]) => {
      if (value !== false) {
        acc[key] = value;
      }

      return acc;
    },
    {}
  );
}
```

### Usage

```javascript
console.log(
  removeFalse({
    a: 1,
    b: false,
    c: true
  })
);
```

### Output

```javascript
{
  a: 1,
  c: true
}
```

***

# 3. Remove False from Array

```javascript
const arr = [
  1,
  false,
  true,
  false,
  "React"
];

const result = arr.filter(
  item => item !== false
);

console.log(result);
```

### Output

```javascript
[
  1,
  true,
  "React"
]
```

***

# 4. Recursive Removal (Nested Objects)

### Input

```javascript
const data = {
  name: "Sudhir",

  active: false,

  profile: {
    verified: false,
    city: "Pune",
    premium: true
  }
};
```

### Solution

```javascript
function removeFalse(obj) {
  if (Array.isArray(obj)) {
    return obj
      .filter(item => item !== false)
      .map(removeFalse);
  }

  if (
    obj &&
    typeof obj === "object"
  ) {
    const result = {};

    for (const [key, value] of Object.entries(obj)) {
      if (value !== false) {
        result[key] = removeFalse(value);
      }
    }

    return result;
  }

  return obj;
}
```

### Output

```javascript
{
  name: "Sudhir",

  profile: {
    city: "Pune",
    premium: true
  }
}
```

***

# 5. Remove All Falsy Values

This removes:

```javascript
false
0
""
null
undefined
NaN
```

```javascript
const obj = {
  a: false,
  b: 0,
  c: "",
  d: "React"
};

const result = Object.fromEntries(
  Object.entries(obj).filter(
    ([_, value]) => Boolean(value)
  )
);

console.log(result);
```

### Output

```javascript
{
  d: "React"
}
```

⚠️ This removes more than just `false`.

***

# 6. React Example

Before sending API payload:

```javascript
const formData = {
  firstName: "Sudhir",
  newsletter: false,
  city: "Pune"
};

const payload = Object.fromEntries(
  Object.entries(formData).filter(
    ([_, value]) => value !== false
  )
);

console.log(payload);
```

### Output

```javascript
{
  firstName: "Sudhir",
  city: "Pune"
}
```

***

# Interview Comparison

### Remove Only `false`

```javascript
value !== false
```

### Remove `null` & `undefined`

```javascript
value != null
```

### Remove All Falsy Values

```javascript
Boolean(value)
```

***

## Interview One-Liner

```javascript
const result = Object.fromEntries(
  Object.entries(obj).filter(
    ([_, value]) => value !== false
  )
);
```

This is the most concise and commonly accepted way to remove only `false` values from an object while keeping `0`, `""`, `null`, and `undefined` intact.
