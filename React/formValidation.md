For a **production Employee Information Form**, these are the most common validations asked in React/Angular/Frontend interviews.

# Employee Form Fields

```ts
interface Employee {
  employeeId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  joiningDate: string;
  gender: string;
  department: string;
  designation: string;
  salary: number;
  manager: string;
  address: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
}
```

---

# Validation Rules

## 1. Employee ID

```text
Required
Must be unique
Format: EMP001
Length: 6-10 chars
```

```js
/^[A-Z]{3}[0-9]{3,6}$/;
```

Examples:

```text
✅ EMP001
✅ EMP1234

❌ emp001
❌ 123EMP
```

---

## 2. First Name

```text
Required
Only alphabets
Minimum 2 characters
Maximum 50 characters
```

```js
/^[A-Za-z ]+$/;
```

Examples:

```text
✅ Sudhir
✅ John Smith

❌ John123
❌ @John
```

---

## 3. Last Name

```text
Required
Only alphabets
```

```js
/^[A-Za-z ]+$/;
```

---

## 4. Email

```text
Required
Valid email format
Unique
```

```js
/^[^\s@]+@[^\s@]+\.[^\s@]+$/;
```

Examples:

```text
✅ sudhir@gmail.com
✅ john@test.co.in

❌ john@
❌ test.com
```

---

## 5. Mobile Number

```text
Required
10 digits
Only numbers
```

```js
/^[0-9]{10}$/;
```

Examples:

```text
✅ 9876543210

❌ 98765
❌ abc123
```

---

## 6. Date Of Birth

```text
Required
Cannot be future date
Age >= 18
Age <= 60
```

```js
const age = new Date().getFullYear() - new Date(dob).getFullYear();
```

---

## 7. Joining Date

```text
Required
Cannot be future date
Must be after DOB
```

Examples:

```text
✅ DOB = 1990
✅ Joining = 2020

❌ Joining before DOB
```

---

## 8. Gender

```text
Required
Male/Female/Other
```

---

## 9. Department

```text
Required
```

Examples:

```text
IT
HR
Finance
Sales
Marketing
```

---

## 10. Designation

```text
Required
Minimum 2 chars
```

Examples:

```text
Developer
Manager
Architect
```

---

## 11. Salary

```text
Required

Numeric

Greater than 0

Less than company limit
```

```js
salary > 0;
```

---

## 12. Manager

```text
Optional
If selected must exist
```

---

## 13. Address

```text
Required
Minimum 10 chars
Maximum 250 chars
```

---

## 14. City

```text
Required
Only alphabets
```

```js
/^[A-Za-z ]+$/;
```

---

## 15. State

```text
Required
```

---

## 16. Country

```text
Required
```

---

## 17. Pincode / ZIP

India:

```js
/^[1-9][0-9]{5}$/;
```

Examples:

```text
✅ 411057

❌ 001234
❌ Pune
```

---

# Common Cross-Field Validation

## Joining Date > DOB

```js
joiningDate > dob;
```

---

## Age Validation

```js
18 <= age <= 60;
```

---

## Salary Based Designation

```text
Intern      < 20k

Developer   > 20k

Lead        > 80k

Manager     > 150k
```

---

# Zod Schema (Production)

```js
import { z } from "zod";

export const EmployeeSchema = z.object({
  employeeId: z.string().regex(/^[A-Z]{3}[0-9]{3,6}$/),

  firstName: z.string().min(2).max(50),

  lastName: z.string().min(2),

  email: z.string().email(),

  phone: z.string().regex(/^[0-9]{10}$/),

  joiningDate: z.string(),

  department: z.string().min(1),

  designation: z.string().min(2),

  salary: z.number().positive(),

  address: z.string().min(10),

  city: z.string().min(2),

  pincode: z.string().regex(/^[1-9][0-9]{5}$/),
});
```

# Interview Enhancements

```text
✅ Search Employee

✅ Filter By Department

✅ Filter By Status

✅ Sort By Name

✅ Sort By Joining Date

✅ Pagination

✅ Export CSV

✅ Upload Profile Picture

✅ Dynamic Form Validation

✅ React Hook Form + Zod

✅ Audit Trail
```

This covers nearly all validations expected in a real-world Employee Management System and frontend machine-coding interview.

For a **Senior React Machine Coding Round**, an **Employee Management System** with all these features is one of the most frequently asked end-to-end CRUD applications.

# Features

```text
✅ Create Employee
✅ Update Employee
✅ Delete Employee
✅ Search Employee
✅ Filter By Department
✅ Filter By Status
✅ Sort By Name
✅ Sort By Joining Date
✅ Pagination
✅ Export CSV
✅ Upload Profile Picture
✅ Dynamic Form Validation
✅ React Hook Form + Zod
✅ Audit Trail
```

---

# Recommended Project Structure

```text
src
│
├── components
│   ├── EmployeeForm.jsx
│   ├── EmployeeTable.jsx
│   ├── SearchBar.jsx
│   ├── Filters.jsx
│   ├── Pagination.jsx
│   ├── CSVExport.jsx
│   └── AuditTrail.jsx
│
├── hooks
│   ├── useEmployees.js
│   └── usePagination.js
│
├── schemas
│   └── employeeSchema.js
│
├── utils
│   ├── exportCSV.js
│   └── validation.js
│
└── App.jsx
```

---

# Employee Form Validation (Zod)

```jsx
import { z } from "zod";

export const EmployeeSchema = z.object({
  employeeId: z.string().regex(/^[A-Z]{3}[0-9]{3,6}$/, "Invalid Employee ID"),

  firstName: z.string().min(2),

  lastName: z.string().min(2),

  email: z.string().email(),

  phone: z.string().regex(/^[0-9]{10}$/),

  joiningDate: z.string(),

  department: z.string().min(1),

  designation: z.string().min(2),

  salary: z.number().positive(),

  city: z.string().min(2),

  pincode: z.string().regex(/^[1-9][0-9]{5}$/),

  profilePicture: z.any().optional(),

  status: z.enum(["Active", "Inactive"]),
});
```

---

# Search Employee

Search by:

```text
First Name
Last Name
Employee ID
Email
Department
Designation
```

```jsx
const searchResult = employees.filter(
  (employee) =>
    employee.firstName.toLowerCase().includes(search.toLowerCase()) ||
    employee.employeeId.toLowerCase().includes(search.toLowerCase()),
);
```

---

# Filter By Department

```jsx
<select value={department} onChange={(e) => setDepartment(e.target.value)}>
  <option>All</option>
  <option>IT</option>
  <option>HR</option>
  <option>Finance</option>
</select>
```

```jsx
if (department !== "All") {
  employees = employees.filter(
    (employee) => employee.department === department,
  );
}
```

---

# Filter By Status

```text
Active
Inactive
On Leave
```

```jsx
employees.filter((employee) => employee.status === selectedStatus);
```

---

# Sort By Name

```jsx
employees.sort((a, b) => a.firstName.localeCompare(b.firstName));
```

---

# Sort By Joining Date

Newest First

```jsx
employees.sort((a, b) => new Date(b.joiningDate) - new Date(a.joiningDate));
```

Oldest First

```jsx
employees.sort((a, b) => new Date(a.joiningDate) - new Date(b.joiningDate));
```

---

# Pagination

```jsx
const PAGE_SIZE = 10;

const start = (page - 1) * PAGE_SIZE;

const paginated = filteredEmployees.slice(start, start + PAGE_SIZE);
```

```text
Previous
1 2 3 4 5
Next
```

---

# Upload Profile Picture

```jsx
<input type="file" accept="image/*" />
```

Preview

```jsx
const imageUrl = URL.createObjectURL(file);
```

```jsx
<img src={imageUrl} alt="Employee" />
```

---

# Export CSV

```jsx
function exportCSV(data) {
  const csv = data.map((row) => Object.values(row).join(",")).join("\n");

  const blob = new Blob([csv]);

  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");

  link.href = url;
  link.download = "employees.csv";

  link.click();
}
```

Button

```jsx
<button onClick={() => exportCSV(employees)}>Export CSV</button>
```

---

# Audit Trail

Track every action.

```jsx
{
  id: 1,
  action:
    "Employee Created",
  employeeId:
    "EMP001",
  timestamp:
    "2026-07-02 10:30"
}
```

Store in state:

```jsx
const [auditLogs, setAuditLogs] = useState([]);
```

On Create

```jsx
setAuditLogs((prev) => [
  ...prev,
  {
    action: "Created",
    employeeId: employee.id,
    timestamp: new Date().toISOString(),
  },
]);
```

On Update

```text
Employee Updated
```

On Delete

```text
Employee Deleted
```

---

# Table Columns

```text
Photo

Employee ID

Name

Email

Phone

Department

Designation

Joining Date

Salary

Status

Actions
```

---

# Actions

```text
Edit

Delete

View Profile

Export
```

---

# React Hook Form

```jsx
const {
  register,
  handleSubmit,
  formState: { errors },
} = useForm({
  resolver: zodResolver(EmployeeSchema),
});
```

Input

```jsx
<input {...register("firstName")} />;

{
  errors.firstName && <span>{errors.firstName.message}</span>;
}
```

---

# Senior Interview Enhancements

```text
✅ React Query

✅ TanStack Table

✅ Server Side Pagination

✅ Server Side Sorting

✅ Role Based Access

✅ Bulk Upload CSV

✅ Bulk Delete

✅ Import Employees

✅ Dark Theme

✅ Activity Dashboard

✅ Employee Analytics

✅ Unit Tests

✅ Playwright E2E Tests

✅ Redux Toolkit
```

### Interview Answer

> Build the employee module with React Hook Form + Zod for validation, maintain employee records in a single source of truth, derive search/filter/sort/pagination results using `useMemo`, support CRUD operations, profile image uploads, CSV export, and maintain an audit log for traceability. For large datasets, move filtering, sorting, and pagination to the backend and use React Query or RTK Query for efficient data fetching and caching.
