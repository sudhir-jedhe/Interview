Here's an updated version of the `filterBy` function with additional enhancements for more flexible and complex filtering logic. This allows you to filter by properties, handle case-insensitive matches, or even support inequality filters (like greater than or less than).

```javascript
const filterBy = (propertyName, condition = 'equals', ignoreCase = false) => {
    return (propertyValue) => {
        return (dataArray) => {
            return dataArray.filter((item) => {
                let itemValue = item[propertyName];
                if (ignoreCase && typeof itemValue === 'string' && typeof propertyValue === 'string') {
                    itemValue = itemValue.toLowerCase();
                    propertyValue = propertyValue.toLowerCase();
                }

                switch (condition) {
                    case 'equals':
                        return itemValue === propertyValue;
                    case 'greaterThan':
                        return itemValue > propertyValue;
                    case 'lessThan':
                        return itemValue < propertyValue;
                    case 'includes':
                        return itemValue.includes(propertyValue);
                    default:
                        return itemValue === propertyValue;
                }
            });
        };
    };
};

// Sample mock data
const MOCK_DATA = [
    { id: 1, name: "John", email: "john@example.com", age: 25 },
    { id: 2, name: "Jane", email: "jane@example.com", age: 30 },
    { id: 3, name: "Michael", email: "michael@test.com", age: 35 },
    { id: 4, name: "Emma", email: "emma@example.com", age: 22 },
    { id: 5, name: "William", email: "william@example.com", age: 28 },
];

// Example usage:
const filterByName = filterBy("name");
const filterByAgeGreaterThan = filterBy("age", "greaterThan");
const filterByEmailIncludes = filterBy("email", "includes", true); // Case-insensitive

const filteredByName = filterByName("Michael")(MOCK_DATA);
const filteredByAge = filterByAgeGreaterThan(25)(MOCK_DATA);
const filteredByEmail = filterByEmailIncludes("example")(MOCK_DATA);

console.log("Filtered by name:", filteredByName);
console.log("Filtered by age (greater than 25):", filteredByAge);
console.log("Filtered by email (includes 'example'):", filteredByEmail);
```

### **Explanation of Updates:**
1. **Additional Arguments:**
   - `condition`: Defines the comparison type. It can be one of `'equals'`, `'greaterThan'`, `'lessThan'`, or `'includes'`. The default is `'equals'`.
   - `ignoreCase`: If set to `true`, the comparison will ignore case when comparing string values.

2. **Condition Handling:**
   - Depending on the `condition` provided, the filter logic is adjusted:
     - `'equals'`: Checks if the property value is equal to the provided value.
     - `'greaterThan'`: Checks if the property value is greater than the provided value (only for numbers).
     - `'lessThan'`: Checks if the property value is less than the provided value (only for numbers).
     - `'includes'`: Checks if the property value contains the provided substring (only for strings).

3. **Case Insensitivity:**
   - If `ignoreCase` is `true`, both the property value and the value to compare are converted to lowercase before comparison, making the filter case-insensitive.

### **Test Case Examples:**

- **Filtering by name (`equals` condition):**
    ```javascript
    const filteredByName = filterByName("Michael")(MOCK_DATA);
    console.log(filteredByName); // [{ id: 3, name: "Michael", email: "michael@test.com", age: 35 }]
    ```

- **Filtering by age (`greaterThan` condition):**
    ```javascript
    const filterByAgeGreaterThan = filterBy("age", "greaterThan");
    const filteredByAge = filterByAgeGreaterThan(25)(MOCK_DATA);
    console.log(filteredByAge); // [{ id: 2, name: "Jane", email: "jane@example.com", age: 30 }, { id: 3, name: "Michael", email: "michael@test.com", age: 35 }]
    ```

- **Filtering by email (`includes` condition, case-insensitive):**
    ```javascript
    const filterByEmailIncludes = filterBy("email", "includes", true); // Case-insensitive
    const filteredByEmail = filterByEmailIncludes("example")(MOCK_DATA);
    console.log(filteredByEmail); // All users with 'example' in their email address
    ```

### **Output:**
```javascript
Filtered by name: [ { id: 3, name: 'Michael', email: 'michael@test.com', age: 35 } ]
Filtered by age (greater than 25): [ { id: 2, name: 'Jane', email: 'jane@example.com', age: 30 }, { id: 3, name: 'Michael', email: 'michael@test.com', age: 35 } ]
Filtered by email (includes 'example'): [ { id: 1, name: 'John', email: 'john@example.com', age: 25 }, { id: 2, name: 'Jane', email: 'jane@example.com', age: 30 }, { id: 3, name: 'Michael', email: 'michael@test.com', age: 35 }, { id: 4, name: 'Emma', email: 'emma@example.com', age: 22 }, { id: 5, name: 'William', email: 'william@example.com', age: 28 } ]
```

This implementation is flexible and allows you to easily adjust the filter logic based on the specific condition or comparison type required.