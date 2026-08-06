1) Explain memory allocation in JavaScript
 Sub Que: How to clear closure memory
2) List down ES6 features used in your project
 Sub Question : Where have you used destructuring and how often do you use Promises in Angular
3) What is your understanding of modules in JavaScript
4) Have you created any pure functions? Explain with use case
5) Have you created any recursive function? Explain it
6) we are working on project where use will login but even if user closed tab and again open we want to keep him still login ? how to achieve this
7) If the same dashboard data is available from multiple APIs, how would you call all APIs in JavaScript and use the response from whichever API returns first?
8) In our application, some users have very slow internet connections, so form submission APIs may take 6–8 seconds to respond. During this delay, users often click the submit button multiple times, causing duplicate records. How would you prevent this issue using JavaScript fundamentals?
9) You are working on a page that displays a table with search filters such as from date, to date, category, price range, and a search button. On search, an API call fetches the table data. Each row has an ‘Open’ button that navigates to a details page. When the user returns to the table page, the previously selected filters and the same table data should still be visible. How would you implement this using JavaScript fundamentals?
10) Difference between setValue and patchValue
11) List reusable components you have created
12) How you will create a reusable textbox whioch should support ngModel and FormControl also

13) RxJS operators — tap, race, map (asked with code explanation)
14) Logout button is in navbar but user activity is in dashboard — how will you send that data in logout API
15) Dynamic menu based on roles — one route accessible by multiple roles and Guards for role-based access
16) Project uses PrimeNG but needs migration to Angular Material — how will you plan and manage branching without affecting sprints
17) How comfortable are you with external libraries like AG Grid, PrimeNG, graph libraries

Here are thorough, senior-level explanations and practical code implementations for your technical interview preparation.

---

### 1) Memory Allocation in JavaScript

JavaScript automatically manages memory allocation using a **Garbage Collector (GC)** that operates on the **Mark-and-Sweep** algorithm:

* **Stack Memory:** Stores primitive types (strings, numbers, booleans, `null`, `undefined`, symbols) and execution contexts. Stack memory is fixed-size, fast, and managed directly by the CPU.
* **Heap Memory:** Stores non-primitive types (Objects, Arrays, Functions). Heap memory is unorganized and dynamic. When you create an object, a reference/pointer to its heap location is stored in the stack.

#### Sub Question: How to clear closure memory

A closure is created when an inner function retains access to variables in its outer lexical scope. Closure memory remains allocated as long as the inner function reference exists.

To clear closure memory, **nullify the reference** to the inner function once it is no longer needed. This drops the reference count to `0`, allowing the garbage collector to sweep it.

```javascript
function createClosure() {
  let heavyData = new Array(1000000).fill('Data'); // Allocated in Heap
  return function () {
    console.log(heavyData.length);
  };
}

let myClosure = createClosure(); // Closure active, memory retained

// CLEARING CLOSURE MEMORY:
myClosure = null; // Reference broken; heavyData is now eligible for Garbage Collection

```

---

### 2) ES6 Features Used in Projects

Modern front-end applications rely heavily on ES6+ features:

* **Arrow Functions:** Lexical `this` binding.
* **Template Literals:** Multi-line strings and interpolation (`${var}`).
* **Spread / Rest Operators (`...`):** Object/array shallow copying, immutability, and function arguments.
* **Let & Const:** Block-scoped variable declarations replacing `var`.
* **Optional Chaining (`?.`) & Nullish Coalescing (`??`):** Safe property access.
* **Modules (`import` / `export`):** Modular code architecture.

#### Sub Question: Where have you used destructuring and how often do you use Promises in Angular?

* **Where Destructuring is Used:**

1. **Component Props & State:** `const { id, name } = user;`
2. **API Responses:** `const { data, status } = await response.json();`
3. **Array Destructuring:** Extracting tuple values from custom hooks like `const [state, setState] = useState()`.

* **How Often Promises are Used in Angular:**
In Angular, **RxJS Observables** are used for 90%+ of asynchronous workflows (HTTP calls via `HttpClient`, reactive forms, route events) because Observables are cancellable and handle multiple emissions over time. However, **Promises** are specifically used in Angular for:

1. `APP_INITIALIZER` factory functions (running startup tasks before app boot).
2. `firstValueFrom()` / `lastValueFrom()` when converting an Observable to a Promise inside `async/await` route guards or resolvers.

---

### 3) Understanding of Modules in JavaScript

JavaScript Modules (ESM) break code into isolated files. Variables, functions, and classes defined inside a module are scoped locally to that file and are not leaked into the global `window` scope.

* **Named Exports:** Export multiple entities per file (`export const A = ...`).
* **Default Export:** Export a single primary entity per file (`export default ClassName`).
* **Tree-Shaking Support:** ESM static analysis allows modern bundlers (Webpack, Vite) to eliminate unused code ("dead code") from production bundles.

---

### 4) Have you created pure functions? Explain with a use case

Yes. A **Pure Function** always returns the exact same output for the exact same input arguments and produces **zero side effects** (does not mutate external variables, modify DOM, or trigger HTTP calls).

#### Use Case: Shopping Cart Price & Tax Calculator

```javascript
// Pure Function: No external mutations, deterministic output
export const calculateOrderTotal = (items, taxRate, discountAmount = 0) => {
  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const discountedSubtotal = Math.max(0, subtotal - discountAmount);
  const tax = discountedSubtotal * taxRate;
  
  return Object.freeze({
    subtotal,
    discount: discountAmount,
    tax,
    grandTotal: discountedSubtotal + tax
  });
};

```

---

### 5) Have you created a recursive function? Explain it

Yes. Recursive functions call themselves until a base condition is met.

#### Use Case: Flattening a Deeply Nested Organization Tree / Folder System

```javascript
const organizationTree = [
  {
    name: 'Engineering',
    employees: ['Alice'],
    subDepartments: [
      { name: 'Frontend', employees: ['Sudhir', 'Kishori'], subDepartments: [] },
      { name: 'Backend', employees: ['John'], subDepartments: [] }
    ]
  },
  { name: 'HR', employees: ['Sarah'], subDepartments: [] }
];

// Recursive function to extract all employee names
function getAllEmployees(departments) {
  let employeeList = [];

  for (const dept of departments) {
    // Base Work
    employeeList.push(...dept.employees);

    // Recursive Step
    if (dept.subDepartments && dept.subDepartments.length > 0) {
      employeeList = employeeList.concat(getAllEmployees(dept.subDepartments));
    }
  }

  return employeeList;
}

console.log(getAllEmployees(organizationTree)); 
// Output: ['Alice', 'Sudhir', 'Kishori', 'John', 'Sarah']

```

---

### 6) Persistent Login Across Tab Closures

To keep a user logged in even after closing and reopening the browser/tab:

1. **Storage Choice:** Store the JWT **Refresh Token** in an `httpOnly`, `Secure`, `SameSite=Strict` Cookie (managed by the backend for security against XSS) OR store the JWT Access Token in `localStorage`.
2. **Auto-Login Flow:**

* When the app initializes (e.g., in Angular `APP_INITIALIZER` or React `useEffect` at app root), check `localStorage` or send a refresh token request to the backend.
* If valid, retrieve user profile info and set the authentication state in your global store (RxJS BehaviorSubject / Redux / Zustand).

---

### 7) Race Condition: Calling Multiple APIs & Using the Fastest Response

Use **`Promise.race()`** in plain JavaScript, or the **`race` operator** in RxJS.

#### JavaScript Solution (`Promise.race`)

```javascript
const api1 = fetch('https://primary-api.com/dashboard').then(r => r.json());
const api2 = fetch('https://secondary-api.com/dashboard').then(r => r.json());
const api3 = fetch('https://backup-api.com/dashboard').then(r => r.json());

async function getFastestDashboardData() {
  try {
    // Promise.race resolves as soon as the FIRST promise settles (resolves/rejects)
    const fastestData = await Promise.race([api1, api2, api3]);
    console.log('Fastest API Response Received:', fastestData);
  } catch (error) {
    console.error('The fastest API returned an error:', error);
  }
}

```

---

### 8) Preventing Duplicate Form Submissions on Slow Connections

To prevent duplicate API hits during 6–8 second server delays using JavaScript fundamentals:

1. **Disable Submit Button Immediately:** Set `button.disabled = true` on the first click.
2. **In-Flight Flag (Locking):** Set a boolean flag (`isSubmitting = true`).
3. **`AbortController` (Optional):** Cancel pending network requests if a user forces a re-trigger.

```javascript
let isSubmitting = false;

async function handleSubmit(event) {
  event.preventDefault();
  const submitBtn = document.getElementById('submit-btn');

  // Guard Clause: Prevent execution if request is already in-flight
  if (isSubmitting) return;

  // Lock State
  isSubmitting = true;
  submitBtn.disabled = true;
  submitBtn.innerText = 'Submitting...';

  try {
    await fetch('/api/submit-form', {
      method: 'POST',
      body: JSON.stringify({ data: 'payload' })
    });
    alert('Submitted successfully!');
  } catch (error) {
    console.error('Submission failed', error);
  } finally {
    // Unlock State
    isSubmitting = false;
    submitBtn.disabled = false;
    submitBtn.innerText = 'Submit';
  }
}

```

---

### 9) Retaining Table Filters and Data After Navigation

To preserve filter selections (`fromDate`, `toDate`, `category`, `priceRange`) and table data when returning from a details page:

1. **State Persistence Options:**

* **URL Query Parameters (Recommended Best Practice):** Encode filters into the URL (`/table?fromDate=2026-01-01&category=electronics`). Returning to the page via browser Back button automatically restores filters from the URL parameters.
* **Browser Storage (`sessionStorage`):** Save state on search, restore state on component load, clear state on logout/tab close.
* **Service/Global Store:** Store state in a singleton Angular Service or React Redux/Zustand store that remains alive in memory during SPA navigation.

#### Implementation Strategy (`sessionStorage`)

```javascript
// 1. On Search Button Click: Save filters
function handleSearch() {
  const filters = {
    fromDate: document.getElementById('fromDate').value,
    toDate: document.getElementById('toDate').value,
    category: document.getElementById('category').value,
  };
  
  sessionStorage.setItem('TABLE_FILTERS', JSON.stringify(filters));
  fetchTableData(filters);
}

// 2. On Page Load / Restore:
window.addEventListener('DOMContentLoaded', () => {
  const savedFilters = sessionStorage.getItem('TABLE_FILTERS');
  if (savedFilters) {
    const filters = JSON.parse(savedFilters);
    // Repopulate UI inputs
    document.getElementById('fromDate').value = filters.fromDate;
    document.getElementById('toDate').value = filters.toDate;
    document.getElementById('category').value = filters.category;
    
    // Auto-fetch using restored filters
    fetchTableData(filters);
  }
});

```

---

### 10) Angular Reactive Forms: `setValue` vs `patchValue`

| Feature                | `setValue()`                                                                               | `patchValue()`                                                   |
| ---------------------- | ------------------------------------------------------------------------------------------ | ---------------------------------------------------------------- |
| **Strictness**         | **Strict.** Requires exact matching of every control defined in the `FormGroup`.           | **Flexible.** Allows updating a partial subset of form controls. |
| **Missing Keys Error** | Throws a runtime error if any key is missing or extra.                                     | Silently ignores missing or extra keys.                          |
| **Use Case**           | Resetting forms or mapping entire API response objects where full structure is guaranteed. | Updating individual fields (e.g., updating user address only).   |

```typescript
// FormGroup Definition: { name: '', age: '', city: '' }

// setValue (Fails if 'city' is missing)
this.myForm.setValue({ name: 'Sudhir', age: 30, city: 'Pune' }); 

// patchValue (Works fine with partial data)
this.myForm.patchValue({ name: 'Sudhir' }); 

```

---

### 11) List Reusable Components Created

Common enterprise reusable components:

1. **Dynamic Data Table / Grid Component:** Supporting sorting, filtering, pagination, and custom column cell templates.
2. **Modal / Dialog Component:** Accessible popup container using Angular CDK Overlay or React Portals.
3. **Form Controls:** Custom Form Input, Auto-complete Dropdown, Date Range Picker.
4. **Toast Notification System:** Global alert system listening to a singleton store/event stream.
5. **Confirmation Dialog Guard:** Generic confirmation modal for un-saved changes.

---

### 12) Building a Reusable Custom Input Supporting `ngModel` & `FormControl` (ControlValueAccessor)

In Angular, custom form controls must implement the **`ControlValueAccessor` (CVA)** interface to bind smoothly to both `[ngModel]` and `formControlName`.

```typescript
import { Component, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-custom-input',
  template: `
    <div class="input-wrapper">
      <input
        [value]="value"
        (input)="onInput($event)"
        (blur)="onTouched()"
        [disabled]="disabled"
        placeholder="Enter text..."
      />
    </div>
  `,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CustomInputComponent),
      multi: true
    }
  ]
})
export class CustomInputComponent implements ControlValueAccessor {
  value: string = '';
  disabled: boolean = false;

  // CVA Callbacks
  onChange: (val: string) => void = () => {};
  onTouched: () => void = () => {};

  // 1. Angular writes value from model to view
  writeValue(val: string): void {
    this.value = val || '';
  }

  // 2. Register change callback
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  // 3. Register touch callback
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  // 4. Handle disabled state
  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  onInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.value = target.value;
    this.onChange(this.value); // Notify Reactive Form / ngModel
  }
}

```

---

### 14) RxJS Operators Explanations & Code

#### `tap`

Used to perform side effects (logging, setting loading spinners) without modifying the stream value.

```typescript
this.http.get('/api/users').pipe(
  tap(users => console.log('Fetched users:', users)) // Side effect only
).subscribe();

```

#### `race`

Emits values from whichever source Observable emits **first**.

```typescript
import { race, timer } from 'rxjs';
import { mapTo } from 'rxjs/operators';

const fastApi$ = timer(1000).pipe(mapTo('Fast API Winner'));
const slowApi$ = timer(3000).pipe(mapTo('Slow API Winner'));

race(fastApi$, slowApi$).subscribe(winner => console.log(winner)); 
// Output after 1s: 'Fast API Winner'

```

#### `map`

Transforms each value emitted by the source Observable using a projection function.

```typescript
this.http.get<User[]>('/api/users').pipe(
  map(users => users.map(u => ({ id: u.id, fullName: `${u.firstName} ${u.lastName}` })))
).subscribe(formattedUsers => console.log(formattedUsers));

```

---

### 15) Passing Dashboard User Activity Payload into Navbar Logout API

To capture user activity from the `DashboardComponent` and send it inside the `NavbarComponent` logout API call:

#### Solution: RxJS State Service (Singleton Pattern)

1. Maintain a singleton `UserActivityService` holding activity logs in a `BehaviorSubject`.
2. Dashboard pushes activities to the service.
3. Navbar reads the current payload from the service when the user clicks Logout.

```typescript
// 1. Service
@Injectable({ providedIn: 'root' })
export class UserActivityService {
  private activityLogs: string[] = [];

  logActivity(action: string) {
    this.activityLogs.push(`${new Date().toISOString()}: ${action}`);
  }

  getActivities(): string[] {
    return [...this.activityLogs];
  }
}

// 2. Dashboard Component
@Component({ ... })
export class DashboardComponent {
  constructor(private activityService: UserActivityService) {}

  onButtonClick() {
    this.activityService.logActivity('Clicked Dashboard Export Button');
  }
}

// 3. Navbar Component
@Component({ ... })
export class NavbarComponent {
  constructor(
    private activityService: UserActivityService,
    private http: HttpClient
  ) {}

  onLogout() {
    const payload = {
      logoutTime: new Date(),
      activities: this.activityService.getActivities() // Gather dashboard data
    };

    this.http.post('/api/logout', payload).subscribe(() => {
      // Clear token and navigate to login
    });
  }
}

```

---

### 16) Dynamic Role-Based Menu & Route Guards

#### Role-Based Route Guard Setup

Map multiple allowed roles to a single route definition using Angular `CanActivateFn`:

```typescript
// app.routes.ts
export const routes: Routes = [
  {
    path: 'reports',
    component: ReportsComponent,
    canActivate: [RoleGuard],
    data: { roles: ['ADMIN', 'MANAGER'] } // One route accessible by multiple roles
  }
];

// role.guard.ts
export const RoleGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const userRole = authService.getUserRole();
  const allowedRoles = route.data['roles'] as Array<string>;

  if (allowedRoles.includes(userRole)) {
    return true; // Access granted
  }

  router.navigate(['/unauthorized']);
  return false;
};

```

#### Dynamic Menu Generation

Filter navigation items based on the user's active role:

```typescript
const menuConfig = [
  { label: 'Dashboard', path: '/dashboard', roles: ['USER', 'ADMIN', 'MANAGER'] },
  { label: 'Reports', path: '/reports', roles: ['ADMIN', 'MANAGER'] },
  { label: 'Settings', path: '/settings', roles: ['ADMIN'] }
];

// Filter visible menu items in Navbar Component
const visibleMenuItems = menuConfig.filter(item => item.roles.includes(userRole));

```

---

### 17) Migrating PrimeNG to Angular Material Without Affecting Sprints

Migration should be handled incrementally using the **Strangler Fig Pattern**:

```text
               ┌─────────────────────────────────────────────────┐
               │          Migration Branch Strategy              │
               ├─────────────────────────────────────────────────┤
               │  main (Production Stable - PrimeNG)             │
               │    └── feature/material-migration               │
               │          ├── Step 1: Install Angular Material    │
               │          ├── Step 2: Migrate Core Controls      │
               │          └── Step 3: Progressive Refactoring    │
               └─────────────────────────────────────────────────┘

```

#### Migration Plan & Strategy

1. **Parallel Installation:** Install `@angular/material` alongside PrimeNG in the project. Both UI libraries can safely co-exist in the same codebase.
2. **Design System / Wrapper Component Architecture:** Wrap PrimeNG components in custom component shells (e.g., `<app-button>`). During migration, change the internal implementation of `<app-button>` from `p-button` to `mat-button` without breaking consumer components across the app.
3. **Branching Strategy:**

* Keep `main` or `develop` branch stable for active sprint feature delivery.
* Create an epic branch `feature/material-migration`.
* Create small, feature-isolated PRs (e.g., `refactor/migrate-dialogs-to-material`) and merge incrementally into `develop`.

1. **Sprint Planning:** Allocate 15–20% technical debt quota per sprint to migrate modules section-by-section (e.g., Sprint 1: Auth Pages, Sprint 2: Dashboard Table).

---

### 18) Experience with AG Grid, PrimeNG, and Graph Libraries (React & JavaScript)

#### A. AG Grid (Enterprise Data Grid)

Ideal for high-performance data manipulation, filtering, and large datasets.

```tsx
// React AG Grid Implementation
import React from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

export const UserGrid = () => {
  const columnDefs = [
    { field: 'id', sortable: true, filter: true },
    { field: 'name', sortable: true, filter: true },
    { field: 'role', sortable: true, filter: true }
  ];

  const rowData = [
    { id: 1, name: 'Sudhir', role: 'UI Lead' },
    { id: 2, name: 'Kishori', role: 'Developer' }
  ];

  return (
    <div className="ag-theme-alpine" style={{ height: 400, width: 600 }}>
      <AgGridReact rowData={rowData} columnDefs={columnDefs} pagination={true} />
    </div>
  );
};

```

#### B. PrimeNG / PrimeReact

Comprehensive UI component library offering ready-made dialogs, tables, and inputs.

```tsx
// PrimeReact Table Component
import React from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

export const PrimeTableDemo = () => {
  const products = [
    { code: 'P100', name: 'Laptop', category: 'Electronics' },
    { code: 'P200', name: 'Phone', category: 'Electronics' }
  ];

  return (
    <DataTable value={products} paginator rows={5}>
      <Column field="code" header="Code"></Column>
      <Column field="name" header="Name"></Column>
      <Column field="category" header="Category"></Column>
    </DataTable>
  );
};

```

#### C. Graph / Chart Libraries (Chart.js / Recharts)

Used to render interactive dashboard charts and analytics visualizations.

```tsx
// Recharts Implementation in React
import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Jan', sales: 4000 },
  { name: 'Feb', sales: 3000 },
  { name: 'Mar', sales: 5000 }
];

export const AnalyticsChart = () => (
  <ResponsiveContainer width="100%" height={300}>
    <LineChart data={data}>
      <XAxis dataKey="name" />
      <YAxis />
      <Tooltip />
      <Line type="monotone" dataKey="sales" stroke="#3b82f6" strokeWidth={2} />
    </LineChart>
  </ResponsiveContainer>
);

```
