## **RY Principle in JavaScript**
The DRY (Don't Repeat Yourself) principle is a key concept in software development, aimed at reducing the repetition of code patterns and logic. By following the DRY principle, we aim to write code that is more maintainable, readable, and easier to extend, which ultimately reduces the chances of errors and bugs.

In essence, the DRY principle encourages us to avoid duplicating logic and functionality within our codebase. If a piece of logic needs to be reused, it should be abstracted into a single, reusable unit, such as a function, class, or module.

### **Why is DRY Important?**
`Maintainability`: If a change is needed in multiple places, you only need to make the change in one place, making the code easier to maintain.

`Readability`: Avoiding repetition makes your code clearer and easier to read, as repeated code can be harder to follow.

`Avoid Errors`: Repeated code is more prone to bugs and inconsistencies. If you forget to update one part, it could lead to hard-to-track errors.
How to Apply the DRY Principle in JavaScript

Here are some common strategies to avoid repetition and apply the DRY principle:

**1. Use Functions to Reuse Logic**
If you have a block of code that needs to be used in multiple places, put that logic inside a function and call it when needed.

```js
// Bad Example - Repeating code
function calculateTotal(price, tax) {
  return price + price * tax;
}

const total1 = calculateTotal(100, 0.15);
const total2 = calculateTotal(200, 0.15);

// Repeated code for calculating taxes
console.log(total1); // 115
console.log(total2); // 230

// Good Example - DRY using a function
function calculateTotal(price, tax) {
  return price + price * tax;
}

function displayTotal(price, tax) {
  const total = calculateTotal(price, tax);
  console.log(total);
}

displayTotal(100, 0.15); // 115
displayTotal(200, 0.15); // 230
```
**Explanation**: By placing the logic for calculating the total price inside a function (calculateTotal), we avoid repeating the same logic in multiple places. This makes the code more concise and easier to manage.

**1. Use Loops to Avoid Repetition**
When dealing with repetitive tasks or operations on a set of data, use loops to iterate over the data instead of manually repeating the same logic.

Example:
```js
// Bad Example - Repeating code for multiple products
const products = [100, 200, 300];
const total1 = 100 + 100 * 0.15;
const total2 = 200 + 200 * 0.15;
const total3 = 300 + 300 * 0.15;

// Good Example - DRY with a loop
const products = [100, 200, 300];
const taxRate = 0.15;

let totals = products.map(product => product + product * taxRate);
console.log(totals); // [115, 230, 345]
```
**Explanation**: Instead of manually calculating the total for each product, we use the map function to iterate through the array and calculate the total for each product. This reduces repetition and allows for easy extension if more products are added in the future.

**3. Use Objects and Classes to Group Repeated Properties**
When you have repeating properties or methods, group them together using objects or classes.

Example:
```js
// Bad Example - Repeating the same properties
const user1 = { name: 'John', age: 30, email: 'john@example.com' };
const user2 = { name: 'Jane', age: 25, email: 'jane@example.com' };

// Good Example - DRY using a class
class User {
  constructor(name, age, email) {
    this.name = name;
    this.age = age;
    this.email = email;
  }

  displayInfo() {
    console.log(`${this.name} is ${this.age} years old. Email: ${this.email}`);
  }
}

const user1 = new User('John', 30, 'john@example.com');
const user2 = new User('Jane', 25, 'jane@example.com');

user1.displayInfo(); // John is 30 years old. Email: john@example.com
user2.displayInfo(); // Jane is 25 years old. Email: jane@example.com
```

**Explanation**: Instead of repeating user properties for each individual object, we use a class (User) to group properties and methods. This makes it easier to create new user instances and reduces duplication.

**4. Use Constants and Variables for Repeated Values**
When you have values that are used repeatedly, store them in variables or constants.

Example:
```js
// Bad Example - Repeating values
const price1 = 100;
const price2 = 200;
const taxRate = 0.15;

const total1 = price1 + price1 * taxRate;
const total2 = price2 + price2 * taxRate;

// Good Example - DRY using variables
const price1 = 100;
const price2 = 200;
const taxRate = 0.15;

function calculateTotal(price, taxRate) {
  return price + price * taxRate;
}

const total1 = calculateTotal(price1, taxRate);
const total2 = calculateTotal(price2, taxRate);
```
**Explanation**: By storing the repeated values in variables and using a function to calculate totals, we reduce redundancy and make the code easier to modify.

**5. Avoid Repeating Conditional Lo**gic
If you have complex conditions or checks that are repeated, refactor them into reusable functions.

Example:
```js
// Bad Example - Repeating conditional logic
const age = 25;
if (age >= 18) {
  console.log('Adult');
} else {
  console.log('Minor');
}

const age2 = 15;
if (age2 >= 18) {
  console.log('Adult');
} else {
  console.log('Minor');
}

// Good Example - DRY using a function
function checkAge(age) {
  return age >= 18 ? 'Adult' : 'Minor';
}

console.log(checkAge(25)); // Adult
console.log(checkAge(15)); // Minor
```
**Explanation**: By extracting the conditional logic into a function (checkAge), we eliminate the need to write the same condition multiple times.

**6. Use Libraries or Frameworks to Avoid Repeating Patterns**
In many cases, JavaScript libraries and frameworks (like Lodash, React, Vue.js, etc.) provide built-in solutions for common tasks, reducing the need to write custom code.

Example with Lodash:
```js
// Bad Example - Repeating array manipulation code
const array = [1, 2, 3, 4, 5];
const doubled = array.map(num => num * 2);
const squared = array.map(num => num * num);

// Good Example - DRY using Lodash
const _ = require('lodash');
const array = [1, 2, 3, 4, 5];

const doubled = _.map(array, num => num * 2);
const squared = _.map(array, num => num * num);
```
**Explanation**: Using libraries like Lodash can simplify your code and eliminate the need for writing common operations like mapping or filtering manually.

**Conclusion**
The DRY principle helps to:

- Reduce redundancy in your codebase.
- Improve maintainability and readability.
- Minimize the chances of introducing bugs and errors.

# DRY Principle (Don't Repeat Yourself) in React.js

The **DRY Principle** means:

> **Every piece of knowledge or logic should have a single, authoritative representation within a system.**

In simple terms:

```text
❌ Don't Repeat Yourself
✅ Reuse Yourself
```

***

# Example Without DRY

Imagine you're building forms.

```jsx
function LoginForm() {
  return (
    <>
      <input type="text" />
      <input type="password" />
    </>
  );
}
```

```jsx
function SignupForm() {
  return (
    <>
      <input type="text" />
      <input type="email" />
      <input type="password" />
    </>
  );
}
```

Problems:

```text
Repeated Input Logic
Repeated Validation
Hard to Maintain
```

***

# DRY Solution: Reusable Input Component

```jsx
function Input({
  label,
  type,
  value,
  onChange
}) {
  return (
    <div>
      <label>{label}</label>

      <input
        type={type}
        value={value}
        onChange={onChange}
      />
    </div>
  );
}
```

Usage:

```jsx
<Input
  label="Username"
  type="text"
/>

<Input
  label="Email"
  type="email"
/>
```

***

# DRY for API Calls

## ❌ Bad

```javascript
async function getUsers() {
  return fetch("/users");
}

async function getProducts() {
  return fetch("/products");
}

async function getOrders() {
  return fetch("/orders");
}
```

***

## ✅ Better

```javascript
class ApiClient {
  get(url) {
    return fetch(url);
  }
}

const apiClient =
  new ApiClient();

apiClient.get("/users");

apiClient.get("/products");
```

***

# DRY with Custom Hooks

## ❌ Repeated Loading State

```jsx
const [loading,
       setLoading] =
  useState(false);

const [error,
       setError] =
  useState(null);
```

every component.

***

## ✅ Custom Hook

```jsx
function useApi(apiCall) {

  const [data, setData] =
    useState(null);

  const [loading,
         setLoading] =
    useState(false);

  const [error,
         setError] =
    useState(null);

  const execute =
    async () => {

      try {

        setLoading(true);

        const result =
          await apiCall();

        setData(result);

      } catch (error) {

        setError(error);

      } finally {

        setLoading(false);
      }
    };

  return {
    data,
    loading,
    error,
    execute
  };
}
```

***

# DRY with Table Components

## ❌ Repeated Tables

```jsx
<UserTable />

<ProductTable />

<OrderTable />
```

Same markup repeatedly.

***

## ✅ Generic Table

```jsx
function Table({
  columns,
  data
}) {

  return (
    <table>

      <thead>
        <tr>
          {columns.map(col => (
            <th
              key={col.key}
            >
              {col.title}
            </th>
          ))}
        </tr>
      </thead>

      <tbody>
        {data.map(row => (
          <tr key={row.id}>
            {columns.map(col => (
              <td
                key={col.key}
              >
                {
                  row[col.key]
                }
              </td>
            ))}
          </tr>
        ))}
      </tbody>

    </table>
  );
}
```

***

# DRY with Form Validation

## ❌ Repeat Validation

```javascript
if (!email) {
  errors.email =
    "Required";
}

if (!password) {
  errors.password =
    "Required";
}
```

every form.

***

## ✅ Shared Validator

```javascript
export function validateEmail(
  email
) {

  return /\S+@\S+\.\S+/
    .test(email);
}
```

Usage:

```javascript
if (
  !validateEmail(email)
) {
  errors.email =
    "Invalid";
}
```

***

# DRY with Provider Pattern

Instead of:

```jsx
<ComponentA
  theme={theme}
/>

<ComponentB
  theme={theme}
/>
```

Use:

```jsx
<ThemeProvider>
```

and consume:

```jsx
const { theme } =
  useTheme();
```

***

# Enterprise React Example

```text
Components
    ↓
Custom Hooks
    ↓
Providers
    ↓
Services
    ↓
API Client
```

Reusable layers eliminate duplication.

***

# Benefits of DRY

### ✅ Easier Maintenance

Change once.

```javascript
ApiClient
```

updates all APIs.

***

### ✅ Less Code

```text
Smaller Codebase
```

***

### ✅ Fewer Bugs

One implementation.

```text
One Fix
```

***

### ✅ Better Reusability

```text
Hooks
Components
Services
Providers
```

***

# Common React DRY Candidates

```text
✅ API Calls
✅ Forms
✅ Validation
✅ Tables
✅ Modals
✅ Pagination
✅ Loading States
✅ Error Handling
✅ Theme Logic
✅ Authentication
✅ Notification Logic
```

***

# When NOT to Over-Apply DRY

A common mistake:

```text
Over-Abstracting
```

Example:

```javascript
createUltraGenericComponent()
```

that nobody understands.

Rule:

```text
DRY ≠ Everything Generic
```

Sometimes a little duplication is more readable.

***

# Interview Questions

### Q1. What is DRY?

**Don't Repeat Yourself** — avoid duplicating logic, code, or knowledge.

***

### Q2. How is DRY applied in React?

```text
Reusable Components
Custom Hooks
Providers
Services
Utility Functions
```

***

### Q3. DRY vs KISS?

**DRY**

```text
Avoid Duplication
```

**KISS**

```text
Keep It Simple
```

***

### Q4. What are common DRY opportunities?

```text
Forms
Validation
API Calls
Tables
Authentication
Theme Management
```

***

# Senior React Interview Answer

> DRY (Don't Repeat Yourself) is a fundamental software engineering principle that encourages keeping logic, configuration, and business rules in a single place. In React applications, DRY is achieved through reusable components, custom hooks, context providers, service layers, utility functions, and shared API clients. Proper application of DRY improves maintainability, reduces bugs, and promotes consistency across the codebase. However, DRY should be balanced with readability and simplicity to avoid excessive abstraction.


# DRY Principle in React – Practical Example

As a Senior React Developer, you'll often be asked:

> **"How do you apply DRY (Don't Repeat Yourself) in React?"**

***

# ❌ Without DRY

Imagine you have three forms.

## Login Form

```jsx
function LoginForm() {
  const [email, setEmail] = useState("");

  return (
    <input
      value={email}
      onChange={(e) =>
        setEmail(e.target.value)
      }
    />
  );
}
```

***

## Signup Form

```jsx
function SignupForm() {
  const [email, setEmail] = useState("");

  return (
    <input
      value={email}
      onChange={(e) =>
        setEmail(e.target.value)
      }
    />
  );
}
```

***

## Profile Form

```jsx
function ProfileForm() {
  const [email, setEmail] = useState("");

  return (
    <input
      value={email}
      onChange={(e) =>
        setEmail(e.target.value)
      }
    />
  );
}
```

### Problem

```text
Repeated Code
Repeated Validation
Repeated Styling
```

***

# ✅ DRY Solution – Reusable Input Component

## Input.jsx

```jsx
function Input({
  label,
  type = "text",
  value,
  onChange,
  error
}) {
  return (
    <div>
      <label>{label}</label>

      <input
        type={type}
        value={value}
        onChange={onChange}
      />

      {error && (
        <p style={{ color: "red" }}>
          {error}
        </p>
      )}
    </div>
  );
}

export default Input;
```

***

## Usage

```jsx
<Input
  label="Email"
  type="email"
  value={email}
  onChange={(e) =>
    setEmail(e.target.value)
  }
/>
```

Now one component is reused everywhere.

***

# DRY with Custom Hook

## ❌ Repeated API Logic

```jsx
const [loading, setLoading] =
  useState(false);

const [error, setError] =
  useState(null);

const [data, setData] =
  useState(null);
```

Repeated in:

```text
Users Page
Products Page
Orders Page
```

***

# ✅ Custom Hook

```jsx
import {
  useState
} from "react";

function useApi(apiFunc) {

  const [data, setData] =
    useState(null);

  const [loading,
         setLoading] =
    useState(false);

  const [error,
         setError] =
    useState(null);

  const execute =
    async () => {

      try {

        setLoading(true);

        const result =
          await apiFunc();

        setData(result);

      } catch (err) {

        setError(err);

      } finally {

        setLoading(false);
      }
    };

  return {
    data,
    loading,
    error,
    execute
  };
}
```

***

## Usage

```jsx
const {
  data,
  loading,
  error,
  execute
} = useApi(
  UserService.getUsers
);
```

***

# DRY with Table Component

Instead of:

```jsx
<UserTable />
<ProductTable />
<OrderTable />
```

Create one table.

***

## Reusable Table

```jsx
function Table({
  columns,
  data
}) {

  return (
    <table>

      <thead>
        <tr>
          {columns.map(col => (
            <th key={col.key}>
              {col.title}
            </th>
          ))}
        </tr>
      </thead>

      <tbody>

        {data.map(row => (
          <tr key={row.id}>

            {columns.map(col => (
              <td key={col.key}>
                {row[col.key]}
              </td>
            ))}

          </tr>
        ))}

      </tbody>

    </table>
  );
}
```

***

## Users Table

```jsx
<Table
  columns={[
    {
      key: "name",
      title: "Name"
    },
    {
      key: "email",
      title: "Email"
    }
  ]}
  data={users}
/>
```

***

# DRY with Form Validation

## validation.js

```javascript
export const validators = {

  required(value) {
    return !!value;
  },

  email(value) {

    return /\S+@\S+\.\S+/
      .test(value);
  }
};
```

***

## Usage

```javascript
if (
  !validators.email(
    email
  )
) {

  errors.email =
    "Invalid Email";
}
```

No duplicate regex everywhere.

***

# DRY with Services

Instead of:

```javascript
fetch("/users");

fetch("/products");

fetch("/orders");
```

***

## ApiClient

```javascript
class ApiClient {

  async get(url) {

    const response =
      await fetch(url);

    return response.json();
  }
}

export default new ApiClient();
```

***

## Usage

```javascript
apiClient.get("/users");

apiClient.get("/products");

apiClient.get("/orders");
```

***

# DRY in Enterprise React Architecture

```text
Components
     ↓
Reusable Components
     ↓
Custom Hooks
     ↓
Providers
     ↓
Services
     ↓
Api Client
```

Examples:

```text
✅ Input Component
✅ Table Component
✅ Modal Component
✅ useApi Hook
✅ usePagination Hook
✅ UserService
✅ ApiClient
✅ Validation Utilities
```

***

# Interview Example

### Question

How do you apply DRY in React?

### Answer

> I apply DRY by extracting common functionality into reusable components, custom hooks, utility functions, context providers, and service layers. For example, instead of duplicating API loading/error handling logic across pages, I create a `useApi` custom hook. Instead of creating multiple tables or forms, I use configurable reusable components. This improves maintainability, consistency, and reduces bugs across large React applications.

***

# Quick DRY Checklist for React

```text
✅ Reusable Components

✅ Custom Hooks

✅ Utility Functions

✅ Common Validators

✅ Shared API Client

✅ Context Providers

✅ Reusable Tables

✅ Reusable Forms

✅ Reusable Modals

✅ Shared Theme System
```

These are exactly the patterns commonly used in enterprise React projects and Senior React interviews.
