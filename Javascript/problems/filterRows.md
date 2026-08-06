function filterRows(data, filterCriteria) {
return data.filter((row) => {
for (const key in filterCriteria) {
if (row[key] !== filterCriteria[key]) {
return false; // Row doesn't match this criterion
}
}
return true; // Row matches all criteria
});
}

const tableData = [
{ name: "Alice", age: 25, city: "New York" },
{ name: "Bob", age: 30, city: "Chicago" },
{ name: "Charlie", age: 25, city: "Los Angeles" },
];

// Filter for rows where age is 25
const filteredByAge = filterRows(tableData, { age: 25 });

// Filter for rows where city is 'Chicago'
const filteredByCity = filterRows(tableData, { city: "Chicago" });

console.log(filteredByAge);
console.log(filteredByCity);

function filterRows(data, filterCriteria, columns = []) {
return data.filter((row) => {
for (const key in filterCriteria) {
// If columns are specified, only filter on those columns
if (columns.length > 0 && !columns.includes(key)) {
continue; // Skip columns not in the specified columns list
}

      // Check if the row matches the criteria for this column
      if (row[key] !== filterCriteria[key]) {
        return false; // Row doesn't match this criterion
      }
    }
    return true; // Row matches all criteria

});
}

const tableData = [
{ name: "Alice", age: 25, city: "New York" },
{ name: "Bob", age: 30, city: "Chicago" },
{ name: "Charlie", age: 25, city: "Los Angeles" },
];

// Filter for rows where age is 25 (applies to all columns)
const filteredByAge = filterRows(tableData, { age: 25 });

// Filter for rows where city is 'Chicago' (applies to all columns)
const filteredByCity = filterRows(tableData, { city: "Chicago" });

// Filter by 'age' column only, filtering for age = 25
const filteredByAgeColumn = filterRows(tableData, { age: 25 }, ['age']);

// Filter by 'city' column only, filtering for city = 'Chicago'
const filteredByCityColumn = filterRows(tableData, { city: "Chicago" }, ['city']);

console.log(filteredByAge);
console.log(filteredByCity);
console.log(filteredByAgeColumn);
console.log(filteredByCityColumn);

If you run this code as-is in a JavaScript environment (like Node.js or a modern browser console), **it will throw a SyntaxError and fail immediately.**

Here are the two main issues causing errors, followed by a clean, working version.

---

### Key Issues

1. **SyntaxError: Identifier 'filterRows' has already been declared**
   You declared `function filterRows(...)` twice in the same scope. Unlike functions defined in different blocks, re-declaring function statements in the top-level scope leads to identifier conflicts.
2. **SyntaxError: Identifier 'tableData' has already been declared**
   Variables declared with `const` cannot be re-declared in the same scope. Declaring `const tableData`, `filteredByAge`, and `filteredByCity` twice will immediately throw a syntax error.

---

### Fixed and Working Code

Here is the consolidated, working version with the updated `filterRows` function:

```javascript
function filterRows(data, filterCriteria, columns = []) {
  return data.filter((row) => {
    for (const key in filterCriteria) {
      // If columns are specified, skip any criteria keys not listed
      if (columns.length > 0 && !columns.includes(key)) {
        continue;
      }

      // Check if the row matches the criterion
      if (row[key] !== filterCriteria[key]) {
        return false;
      }
    }
    return true;
  });
}

const tableData = [
  { name: "Alice", age: 25, city: "New York" },
  { name: "Bob", age: 30, city: "Chicago" },
  { name: "Charlie", age: 25, city: "Los Angeles" },
];

// 1. Filter for age = 25 across all criteria
const filteredByAge = filterRows(tableData, { age: 25 });

// 2. Filter for city = 'Chicago' across all criteria
const filteredByCity = filterRows(tableData, { city: "Chicago" });

// 3. Filter specifically specifying the 'age' column
const filteredByAgeColumn = filterRows(tableData, { age: 25 }, ["age"]);

// 4. Filter specifically specifying the 'city' column
const filteredByCityColumn = filterRows(tableData, { city: "Chicago" }, [
  "city",
]);

console.log("Filtered by Age:", filteredByAge);
console.log("Filtered by City:", filteredByCity);
console.log("Filtered by Age Column:", filteredByAgeColumn);
console.log("Filtered by City Column:", filteredByCityColumn);
```

### Output

```json
Filtered by Age: [
  { name: 'Alice', age: 25, city: 'New York' },
  { name: 'Charlie', age: 25, city: 'Los Angeles' }
]
Filtered by City: [
  { name: 'Bob', age: 30, city: 'Chicago' }
]
Filtered by Age Column: [
  { name: 'Alice', age: 25, city: 'New York' },
  { name: 'Charlie', age: 25, city: 'Los Angeles' }
]
Filtered by City Column: [
  { name: 'Bob', age: 30, city: 'Chicago' }
]

```
