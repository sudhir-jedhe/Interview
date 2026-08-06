# SOLID Principles in JavaScript

The **SOLID** principles are a set of five design principles that help developers create software that is easy to maintain, understand, and extend. These principles were originally defined for object-oriented programming (OOP), but they can be applied to JavaScript as well.

---

## 1. **Single Responsibility Principle (SRP)**

**A class should have only one reason to change**, meaning it should have one job or responsibility. When a class has more than one responsibility, it becomes harder to maintain and extend.

### Example:

```javascript
// Bad Example - Violates SRP
class User {
  constructor(name) {
    this.name = name;
  }

  saveUser() {
    console.log('Saving user to the database...');
  }

  logUserAction() {
    console.log('Logging user action...');
  }
}

// Good Example - Follows SRP
class User {
  constructor(name) {
    this.name = name;
  }
}

class UserRepository {
  saveUser(user) {
    console.log('Saving user to the database...');
  }
}

class UserLogger {
  logUserAction(user) {
    console.log('Logging user action...');
  }
}
```

**Bad Example:** The User class is doing too much: saving the user and logging actions.
**Good Example:** We separate responsibilities into different classes (UserRepository for saving, UserLogger for logging).


## 2. **Open/Closed Principle (OCP)**
Software entities (classes, modules, functions) should be open for extension, but closed for modification. This principle allows you to add new functionality to a class without modifying its existing code.

Example:
```js
// Bad Example - Violates OCP
class Rectangle {
  constructor(width, height) {
    this.width = width;
    this.height = height;
  }
}

class AreaCalculator {
  calculateArea(shape) {
    if (shape instanceof Rectangle) {
      return shape.width * shape.height;
    }
  }
}

// Good Example - Follows OCP
class Shape {
  calculateArea() {
    throw new Error("Method 'calculateArea' should be implemented.");
  }
}

class Rectangle extends Shape {
  constructor(width, height) {
    super();
    this.width = width;
    this.height = height;
  }
  
  calculateArea() {
    return this.width * this.height;
  }
}

class Circle extends Shape {
  constructor(radius) {
    super();
    this.radius = radius;
  }

  calculateArea() {
    return Math.PI * this.radius * this.radius;
  }
}

class AreaCalculator {
  calculateArea(shape) {
    return shape.calculateArea();
  }
}

```
**Bad Example:** The AreaCalculator needs to be modified every time a new shape is added.
**Good Example:** Each shape class implements calculateArea, and AreaCalculator doesn't need to change when new shapes are added.


## 3. Liskov Substitution Principle (LSP)
Objects of a superclass should be replaceable with objects of a subclass without affecting the correctness of the program.

Example:
```js
// Bad Example - Violates LSP
class Bird {
  fly() {
    console.log('Flying...');
  }
}

class Ostrich extends Bird {
  fly() {
    throw new Error('Ostriches can\'t fly!');
  }
}

// Good Example - Follows LSP
class Bird {
  move() {
    console.log('Moving...');
  }
}

class Sparrow extends Bird {
  move() {
    console.log('Flying...');
  }
}

class Ostrich extends Bird {
  move() {
    console.log('Running...');
  }
}
```
**Bad Example:** Ostrich violates LSP because it can't fly but inherits from Bird.
**Good Example:** Both Sparrow and Ostrich extend Bird, but override move according to their behavior.

## 4. Interface Segregation Principle (ISP)
Clients should not be forced to depend on interfaces they do not use. This principle suggests that large, unwieldy interfaces should be split into smaller, more specific ones.

Example:
```js
// Bad Example - Violates ISP
class Printer {
  print() {
    console.log('Printing...');
  }
  
  scan() {
    console.log('Scanning...');
  }
  
  fax() {
    console.log('Faxing...');
  }
}

class MultiFunctionPrinter extends Printer {
  print() {
    console.log('Printing...');
  }

  scan() {
    console.log('Scanning...');
  }

  fax() {
    console.log('Faxing...');
  }
}

class OldPrinter extends Printer {
  print() {
    console.log('Printing...');
  }

  scan() {
    throw new Error('OldPrinter does not support scanning');
  }

  fax() {
    throw new Error('OldPrinter does not support faxing');
  }
}

// Good Example - Follows ISP
class Printer {
  print() {
    console.log('Printing...');
  }
}

class Scanner {
  scan() {
    console.log('Scanning...');
  }
}

class FaxMachine {
  fax() {
    console.log('Faxing...');
  }
}

class MultiFunctionPrinter extends Printer {
  constructor() {
    super();
    this.scanner = new Scanner();
    this.faxMachine = new FaxMachine();
  }
}

class OldPrinter extends Printer {
  print() {
    console.log('Printing...');
  }
}
.
```
**Bad Example:** The OldPrinter class is forced to implement methods it doesn't need (like scan() and fax()).
**Good Example:** We split the responsibilities into separate classes (Printer, Scanner, FaxMachine).

## 5. Dependency Inversion Principle (DIP)
High-level modules should not depend on low-level modules. Both should depend on abstractions. Abstractions should not depend on details. Details should depend on abstractions. This principle aims to reduce the coupling between high-level and low-level modules.

Example:
```js
// Bad Example - Violates DIP
class FileReader {
  readFile() {
    // Reads file directly
  }
}

class FileProcessor {
  constructor() {
    this.fileReader = new FileReader(); // High-level class depends directly on low-level class
  }

  process() {
    this.fileReader.readFile();
  }
}

// Good Example - Follows DIP
class FileReader {
  readFile() {
    throw new Error('Not implemented');
  }
}

class TextFileReader extends FileReader {
  readFile() {
    console.log('Reading text file...');
  }
}

class PDFFileReader extends FileReader {
  readFile() {
    console.log('Reading PDF file...');
  }
}

class FileProcessor {
  constructor(fileReader) {
    this.fileReader = fileReader; // Now the high-level class depends on abstraction
  }

  process() {
    this.fileReader.readFile();
  }
}

const textFileReader = new TextFileReader();
const fileProcessor = new FileProcessor(textFileReader);
fileProcessor.process();  // Output: Reading text file...

```
**Bad Example:** FileProcessor directly depends on FileReader, a low-level class.
**Good Example:** FileProcessor depends on the abstraction FileReader, and specific file readers (TextFileReader, PDFFileReader) are passed to it.

**Conclusion**
The SOLID principles help developers write clean, maintainable, and flexible code. Here's a quick recap:

`SRP (Single Responsibility Principle):` A class should have one reason to change.
`OCP (Open/Closed Principle):` A class should be open for extension but closed for modification.
`LSP (Liskov Substitution Principle):` Subtypes must be substitutable for their base types without affecting correctness.
`ISP (Interface Segregation Principle):` Clients should not be forced to depend on methods they do not use.
`DIP (Dependency Inversion Principle):` High-level modules should depend on abstractions, not low-level modules.


# SOLID Principles in React.js

**SOLID** is a set of 5 object-oriented design principles that help build:

✅ Scalable Applications

✅ Maintainable Code

✅ Reusable Components

✅ Testable Architecture

✅ Clean React Applications

***

# S → Single Responsibility Principle (SRP)

> A component should have only one reason to change.

***

## ❌ Bad

One component doing everything.

```jsx
function UsersPage() {

  const [users, setUsers] =
    useState([]);

  useEffect(() => {
    fetch("/users")
      .then(res => res.json())
      .then(setUsers);
  }, []);

  const exportUsers = () => {
    console.log("Export");
  };

  return (
    <>
      <button
        onClick={exportUsers}
      >
        Export
      </button>

      {users.map(user => (
        <div>{user.name}</div>
      ))}
    </>
  );
}
```

Component is handling:

```text
API Calls
UI Rendering
Export Logic
```

***

## ✅ Good

Separate responsibilities.

### Hook

```jsx
function useUsers() {

  const [users, setUsers] =
    useState([]);

  useEffect(() => {

    fetch("/users")
      .then(res => res.json())
      .then(setUsers);

  }, []);

  return users;
}
```

### Component

```jsx
function UsersPage() {

  const users =
    useUsers();

  return (
    <>
      {users.map(user => (
        <div
          key={user.id}
        >
          {user.name}
        </div>
      ))}
    </>
  );
}
```

***

# O → Open/Closed Principle (OCP)

> Open for extension, closed for modification.

You should add new functionality without modifying existing code.

***

## ❌ Bad

```jsx
if(type === "admin"){
 ...
}

if(type === "manager"){
 ...
}
```

Adding a new role requires editing existing code.

***

## ✅ Good

```jsx
const roleComponents = {
  admin: AdminPanel,
  manager: ManagerPanel,
  user: UserPanel
};

const Component =
  roleComponents[type];
```

Adding a role:

```javascript
guest: GuestPanel
```

No existing code changes.

***

# L → Liskov Substitution Principle (LSP)

> Child components should be replaceable with parent components.

***

## Good Example

```jsx
function Button({
  children,
  onClick
}) {

  return (
    <button
      onClick={onClick}
    >
      {children}
    </button>
  );
}
```

***

```jsx
function PrimaryButton(
  props
) {

  return (
    <Button
      {...props}
    />
  );
}
```

Usage:

```jsx
<Button />

<PrimaryButton />
```

Both behave correctly.

***

# I → Interface Segregation Principle (ISP)

> Don't force consumers to depend on things they don't use.

***

## ❌ Bad

```jsx
function DataTable({
  sorting,
  filtering,
  export,
  printing,
  pagination,
  charts
}) {
 ...
}
```

Every page must know about every feature.

***

## ✅ Good

Break into small components.

```jsx
<Table />

<TableFilter />

<TablePagination />

<TableExport />
```

Use only what is needed.

***

# D → Dependency Inversion Principle (DIP)

> Depend on abstractions, not concrete implementations.

***

## ❌ Bad

```jsx
function UsersPage() {

  useEffect(() => {

    fetch("/users")
      .then(...);

  }, []);
}
```

Component depends directly on API.

***

## ✅ Good

### Service

```javascript
class UserService {

  async getUsers() {

    return fetch("/users")
      .then(res =>
        res.json()
      );
  }
}

export default new UserService();
```

***

### Hook

```jsx
import UserService
from "./UserService";

function useUsers() {

  const [users,
         setUsers] =
    useState([]);

  useEffect(() => {

    UserService
      .getUsers()
      .then(setUsers);

  }, []);

  return users;
}
```

Now:

```text
React Component
      ↓
Hook
      ↓
Service
      ↓
API
```

Much easier to test.

***

# Complete Enterprise Architecture Using SOLID

```text
UsersPage
     ↓
useUsers()
     ↓
UserService
     ↓
ApiClient
     ↓
Backend
```

Each layer has:

```text
Single Responsibility
Open for Extension
Easy to Replace
Small Interfaces
Abstraction-Based Dependencies
```

***

# SOLID + React Examples

| Principle | React Example                        |
| --------- | ------------------------------------ |
| SRP       | Separate Hooks from Components       |
| OCP       | Widget Registry / Dynamic Components |
| LSP       | Button → PrimaryButton               |
| ISP       | Small Focused Components             |
| DIP       | Service Layer + API Client           |

***

# Real React Folder Structure

```text
src/
│
├── components/
│   ├── Button.jsx
│   ├── Card.jsx
│
├── hooks/
│   ├── useUsers.js
│
├── services/
│   ├── UserService.js
│
├── api/
│   ├── ApiClient.js
│
├── pages/
│   ├── UsersPage.jsx
```

This structure naturally supports SOLID.

***

# Common React Interview Question

### Why is SOLID useful in React?

Because it helps:

```text
✅ Scale large applications
✅ Write reusable components
✅ Improve testability
✅ Reduce coupling
✅ Increase maintainability
✅ Support team collaboration
```

***

# Senior React Interview Answer

> SOLID principles help structure React applications into small, reusable, and maintainable units. SRP is achieved by separating UI, hooks, and services. OCP is applied through configurable components and plugin architectures. LSP is respected by designing components that can be safely substituted. ISP encourages building small focused components and hooks rather than large monolithic APIs. DIP is commonly implemented through service layers and API clients, allowing components to depend on abstractions instead of direct API calls. A React architecture built around components, hooks, services, and API clients naturally aligns with SOLID principles.


Because you're preparing for **Senior React / Project Lead interviews**, here's the **SOLID principles explained with React Hooks**, common anti-patterns, and a scalable folder structure.

***

# S - Single Responsibility Principle (SRP)

> A hook/component should have only one responsibility.

## ❌ Bad

```jsx
function UsersPage() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch("/users")
      .then(res => res.json())
      .then(setUsers);
  }, []);

  const exportUsers = () => {
    console.log("Export");
  };

  return (
    <>
      <button onClick={exportUsers}>
        Export
      </button>
      {users.map(user => (
        <div key={user.id}>
          {user.name}
        </div>
      ))}
    </>
  );
}
```

Responsibilities:

```text
API Fetching
Rendering
Export Logic
```

***

## ✅ Good

### useUsers Hook

```jsx
function useUsers() {
  const [users, setUsers] =
    useState([]);

  useEffect(() => {
    fetch("/users")
      .then(res => res.json())
      .then(setUsers);
  }, []);

  return users;
}
```

### Component

```jsx
function UsersPage() {
  const users = useUsers();

  return (
    <>
      {users.map(user => (
        <div key={user.id}>
          {user.name}
        </div>
      ))}
    </>
  );
}
```

***

# O - Open/Closed Principle (OCP)

> Open for extension, closed for modification.

## ❌ Bad

```jsx
if (type === "user") {
  return <UserCard />;
}

if (type === "product") {
  return <ProductCard />;
}

if (type === "order") {
  return <OrderCard />;
}
```

Every new type means modifying code.

***

## ✅ Good

```jsx
const components = {
  user: UserCard,
  product: ProductCard,
  order: OrderCard
};

const Component =
  components[type];

return <Component />;
```

Add:

```jsx
invoice: InvoiceCard
```

No existing code changes.

***

# L - Liskov Substitution Principle (LSP)

> Components should be interchangeable.

## Base Component

```jsx
function Button({
  children,
  onClick
}) {
  return (
    <button
      onClick={onClick}
    >
      {children}
    </button>
  );
}
```

***

## Extended Component

```jsx
function PrimaryButton(
  props
) {
  return (
    <Button
      {...props}
    />
  );
}
```

Usage:

```jsx
<Button />

<PrimaryButton />
```

Both behave consistently.

***

# I - Interface Segregation Principle (ISP)

> Components should not receive props they don't need.

## ❌ Bad

```jsx
<DataTable
  sorting
  filtering
  pagination
  grouping
  exporting
  charts
/>
```

Most pages use only 1-2 features.

***

## ✅ Good

```jsx
<Table />

<TableFilter />

<TablePagination />
```

Use only what you need.

***

# D - Dependency Inversion Principle (DIP)

> Depend on abstractions, not concrete implementations.

## ❌ Bad

```jsx
function UsersPage() {
  useEffect(() => {
    fetch("/users")
      .then(res => res.json());
  }, []);
}
```

Component directly depends on API.

***

## ✅ Good

### Service

```jsx
class UserService {
  async getUsers() {
    const response =
      await fetch("/users");

    return response.json();
  }
}

export default new UserService();
```

### Hook

```jsx
import UserService
from "./UserService";

function useUsers() {
  const [users, setUsers] =
    useState([]);

  useEffect(() => {
    UserService
      .getUsers()
      .then(setUsers);
  }, []);

  return users;
}
```

### Component

```jsx
function UsersPage() {
  const users =
    useUsers();

  return (
    <>
      {users.map(user => (
        <div key={user.id}>
          {user.name}
        </div>
      ))}
    </>
  );
}
```

***

# Common SOLID Anti-Patterns in React

## ❌ God Component

```jsx
UsersPage
```

contains:

```text
10 API Calls
Validation
Export Logic
State Management
UI Rendering
```

500+ lines.

***

## ❌ Direct API Calls in Components

```jsx
fetch("/users")
```

inside every component.

Use services/hooks.

***

## ❌ Massive Custom Hooks

```jsx
useUsers(
  caching,
  retry,
  pagination,
  sorting,
  filtering,
  export
);
```

Too many responsibilities.

***

## ❌ Huge Prop Interfaces

```jsx
<Table
  sorting
  filtering
  pagination
  export
  print
  charts
  grouping
/>
```

Violates ISP.

***

## ❌ Switching Everywhere

```jsx
if(role==="admin")
if(role==="manager")
if(role==="user")
```

Violates OCP.

Use configuration maps.

***

## ❌ Duplicate Business Logic

```jsx
validation copied
API calls copied
formatting copied
```

Violates SRP and DRY.

***

# SOLID Folder Structure for React

For the type of enterprise React projects you've worked on (Intuit, HSBC, Microsoft, Prudential), a SOLID-friendly structure looks like:

```text
src/
│
├── api/
│   ├── apiClient.js
│
├── services/
│   ├── UserService.js
│   ├── AuthService.js
│   ├── OrderService.js
│
├── hooks/
│   ├── useUsers.js
│   ├── useAuth.js
│
├── providers/
│   ├── AuthProvider.jsx
│   ├── ThemeProvider.jsx
│
├── components/
│   ├── Button/
│   ├── Table/
│   ├── Modal/
│
├── pages/
│   ├── Users/
│   ├── Dashboard/
│
├── utils/
│   ├── validators.js
│   ├── formatters.js
│
├── constants/
│
└── App.jsx
```

***

# Senior React Interview Answer

> SOLID principles help structure React applications into reusable, scalable, and maintainable layers. SRP is achieved through focused hooks and components, OCP through extensible component registries and configuration-driven UI, LSP through interchangeable component contracts, ISP through small focused props and APIs, and DIP through service layers and custom hooks that abstract implementation details. A common enterprise architecture is Component → Hook → Service → API Client, which naturally aligns with SOLID and improves testing, maintainability, and scalability.
# SOLID Principles with React Components – Complete Example

Let's build a **Users Dashboard** that follows SOLID principles.

***

# Project Structure

```text
src/
│
├── api/
│   └── apiClient.js
│
├── services/
│   └── UserService.js
│
├── hooks/
│   └── useUsers.js
│
├── components/
│   ├── UserCard.jsx
│   ├── UserList.jsx
│   └── Button.jsx
│
├── pages/
│   └── UsersPage.jsx
```

***

# S - Single Responsibility Principle

Each component should do one thing.

## UserCard.jsx

```jsx
function UserCard({ user }) {
  return (
    <div className="card">
      <h3>{user.name}</h3>
      <p>{user.email}</p>
    </div>
  );
}

export default UserCard;
```

Responsibility:

```text
Display User
```

Only one reason to change.

***

## UserList.jsx

```jsx
import UserCard from "./UserCard";

function UserList({ users }) {
  return (
    <>
      {users.map(user => (
        <UserCard
          key={user.id}
          user={user}
        />
      ))}
    </>
  );
}

export default UserList;
```

Responsibility:

```text
Render List
```

***

# D - Dependency Inversion Principle

UI should depend on abstractions.

***

## apiClient.js

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

## UserService.js

```javascript
import apiClient
  from "../api/apiClient";

class UserService {
  getUsers() {
    return apiClient.get(
      "/users"
    );
  }
}

export default new UserService();
```

***

## useUsers.js

```jsx
import {
  useEffect,
  useState
} from "react";

import UserService
  from "../services/UserService";

export function useUsers() {

  const [users, setUsers] =
    useState([]);

  useEffect(() => {
    UserService
      .getUsers()
      .then(setUsers);
  }, []);

  return users;
}
```

***

# UsersPage.jsx

```jsx
import UserList
  from "../components/UserList";

import { useUsers }
  from "../hooks/useUsers";

function UsersPage() {

  const users = useUsers();

  return (
    <div>
      <h1>Users</h1>

      <UserList users={users} />
    </div>
  );
}

export default UsersPage;
```

Flow:

```text
UsersPage
     ↓
useUsers
     ↓
UserService
     ↓
ApiClient
```

***

# O - Open Closed Principle

Suppose we need to support multiple card types.

***

## ❌ Bad

```jsx
if (type === "user") {
  return <UserCard />;
}

if (type === "admin") {
  return <AdminCard />;
}
```

***

## ✅ Good

```jsx
const cards = {
  user: UserCard,
  admin: AdminCard,
  manager: ManagerCard
};

const Card =
  cards[type];

return (
  <Card data={data} />
);
```

Adding:

```jsx
guest: GuestCard
```

requires no modification.

***

# L - Liskov Substitution Principle

Components should be interchangeable.

***

## Base Button

```jsx
function Button({
  children,
  onClick
}) {

  return (
    <button
      onClick={onClick}
    >
      {children}
    </button>
  );
}
```

***

## Primary Button

```jsx
function PrimaryButton(
  props
) {
  return (
    <Button
      {...props}
    />
  );
}
```

Usage:

```jsx
<Button>
  Save
</Button>

<PrimaryButton>
  Save
</PrimaryButton>
```

Both work identically.

***

# I - Interface Segregation Principle

Don't pass unnecessary props.

***

## ❌ Bad

```jsx
<DataTable
  sorting
  filtering
  pagination
  grouping
  export
  charts
/>
```

50 props.

***

## ✅ Good

```jsx
<Table />

<TablePagination />

<TableFilter />
```

Small focused interfaces.

***

# Real Enterprise Example

Imagine an application like:

```text
TurboTax
HSBC
Prudential
Microsoft Dashboard
```

***

## Bad Architecture

```jsx
UsersPage.jsx

800 Lines

API Calls
Filtering
Sorting
Export
UI Rendering
Validation
```

***

## SOLID Architecture

```text
UsersPage
     ↓
useUsers
     ↓
UserService
     ↓
ApiClient

UserList
     ↓
UserCard
```

Each piece:

```text
Reusable
Testable
Maintainable
```

***

# Common SOLID Anti-Patterns

## God Component

```jsx
Dashboard.jsx

1500 lines
```

Handles everything.

***

## Direct API Calls

```jsx
fetch(...)
```

inside every component.

***

## Large Hooks

```jsx
useDashboardEverything()
```

1000+ lines.

***

## Huge Components

```jsx
<DataTable
  sorting
  filtering
  grouping
  exporting
  charts
  ...
/>
```

Too many responsibilities.

***

## Tight Coupling

```jsx
Component
     ↓
fetch()
```

No service layer.

***

# Senior React Interview Answer

> SOLID in React means creating small focused components, isolating business logic into hooks and services, and depending on abstractions rather than implementations. A typical SOLID React architecture follows:
>
> ```text
> Component
>      ↓
> Hook
>      ↓
> Service
>      ↓
> API Client
> ```
>
> This improves reusability, testability, maintainability, and scalability. SRP is achieved with focused components/hooks, OCP with configuration-based rendering, LSP with interchangeable components, ISP with small prop interfaces, and DIP through services and API clients.
