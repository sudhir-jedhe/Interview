There is a bug in your `serializeRow` function. The expression `serializeValue(\`value\`, delimiter)` is mistakenly passing the literal string `"value"` to `serializeValue` instead of iterating over each element in the `row` array.

### Fixed `serializeRow` Function
```javascript
const serializeRow = (row, delimiter = ',') =>
  row.map(value => serializeValue(value, delimiter)).join(delimiter);
```

### Complete Correct Code
Here is your corrected code with fixes:

```javascript
const isEmptyValue = value =>
  value === null || value === undefined || Number.isNaN(value);

const serializeValue = (value, delimiter = ',') => {
  if (isEmptyValue(value)) return '';
  value = `${value}`; // Convert value to string
  if (
    value.includes(delimiter) ||
    value.includes('\n') ||
    value.includes('"')
  )
    return `"${value.replace(/"/g, '""').replace(/\n/g, '\\n')}"`;
  return value;
};

const serializeRow = (row, delimiter = ',') =>
  row.map(value => serializeValue(value, delimiter)).join(delimiter);

const extractHeaders = (arr) =>
  [...arr.reduce((acc, obj) => {
    Object.keys(obj).forEach((key) => acc.add(key));
    return acc;
  }, new Set())];

const arrayToCSV = (arr, delimiter = ',') =>
  arr.map(row => serializeRow(row, delimiter)).join('\n');

const objectToCSV = (
  arr,
  headers = extractHeaders(arr),
  omitHeaders = false,
  delimiter = ','
) => {
  const headerRow = serializeRow(headers, delimiter);
  const bodyRows = arr.map(obj =>
    serializeRow(
      headers.map(key => obj[key]),
      delimiter
    )
  );
  return omitHeaders
    ? bodyRows.join('\n')
    : [headerRow, ...bodyRows].join('\n');
};

const JSONToCSV = (json, headers, omitHeaders, delimiter = ',') =>
  objectToCSV(JSON.parse(json), headers, omitHeaders, delimiter);
```

### Usage Examples

#### **1. Convert Array to CSV**
```javascript
const data = [['a', 'b'], ['c', 'd']];
console.log(arrayToCSV(data));
// Output: 'a,b\nc,d'
```

#### **2. Convert Object Array to CSV**
```javascript
const objects = [{ a: 1, b: 2 }, { a: 3, b: 4, c: 5 }];
console.log(objectToCSV(objects));
// Output: 'a,b,c\n1,2,\n3,4,5'
```

#### **3. Convert JSON String to CSV**
```javascript
const json = '[{"a":1,"b":2},{"a":3,"b":4,"c":5}]';
console.log(JSONToCSV(json));
// Output: 'a,b,c\n1,2,\n3,4,5'
```

This code should now work as intended, converting arrays, objects, and JSON strings into properly formatted CSV strings. Let me know if you encounter any further issues!