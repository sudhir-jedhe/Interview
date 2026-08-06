How does TypeScript's Generics feature help in large-scale applications?
11. Explain utility types like Partial, Pick, Omit, and Record.

TypeScript’s Generics and Utility Types are essential tools for building scalable, type-safe, and maintainable large-scale applications. They allow you to write reusable code while preserving strict type contracts.

---

### How Generics Help in Large-Scale Applications

In large applications, thousands of components, API endpoints, and state stores interact with each other. Generics allow you to write **reusable, component-agnostic code without losing type safety or falling back to `any**`.

#### Key Benefits at Scale

1. **Type-Safe API & Network Layers:**
Instead of writing separate fetch functions for every data model, a single generic API wrapper guarantees that response types match the model being fetched.

```typescript
// A single scalable API client wrapper
interface ApiResponse<TData> {
  data: TData;
  status: number;
  message: string;
}

async function fetchApi<T>(url: string): Promise<ApiResponse<T>> {
  const response = await fetch(url);
  const data = await response.json();
  return { data, status: response.status, message: response.statusText };
}

// Usage in feature modules:
const userResponse = await fetchApi<UserProfile>('/api/user');
// userResponse.data is strictly typed as UserProfile!

```

1. **Reusable UI Components & Hooks:**
Generics enable components (like Virtualized Tables, Dropdowns, or Autocomplete inputs) and custom React hooks (like `useFetch` or `useForm`) to operate on arbitrary data models while retaining strict autocomplete and type-checking for field names.
2. **DRY State Management:**
Store engines (like Zustand, Redux Toolkit, or custom cache adapters) use generics to manage entity normalized tables without duplicating store logic.

---

### Utility Types: `Partial`, `Pick`, `Omit`, and `Record`

Utility types are built-in generic types in TypeScript that transform existing types. They eliminate duplicate interface definitions across large codebases.

To illustrate these utility types, let's start with a base interface:

```typescript
interface User {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'EDITOR' | 'VIEWER';
  createdAt: Date;
}

```

---

#### 1. `Partial<Type>`

Constructs a type with all properties of `Type` set to **optional** (`?`).

* **Primary Use Case:** Form updates (PATCH operations) where a payload only contains the specific fields the user modified.

```typescript
// All fields become optional: { id?: string; name?: string; email?: string; ... }
type UpdateUserPayload = Partial<User>;

function updateUser(userId: string, changes: Partial<User>) {
  // Can pass just { name: 'New Name' } without satisfying the full User interface
}

updateUser('user-123', { email: 'newemail@domain.com' });

```

---

#### 2. `Pick<Type, Keys>`

Constructs a type by selecting a specific set of properties (`Keys`) from `Type`.

* **Primary Use Case:** Creating lightweight payloads, preview cards, or public views from a larger entity.

```typescript
// Selects ONLY 'id', 'name', and 'email'
type UserSummary = Pick<User, 'id' | 'name' | 'email'>;

const userCard: UserSummary = {
  id: 'usr_1',
  name: 'Sudhir',
  email: 'sudhir@domain.com',
  // Error! 'role' or 'createdAt' are not allowed here.
};

```

---

#### 3. `Omit<Type, Keys>`

Constructs a type by picking all properties from `Type` and then **removing** specific `Keys`.

* **Primary Use Case:** Form creation payloads (where server-generated fields like `id` and `createdAt` do not exist yet) or stripping sensitive fields.

```typescript
// Removes 'id' and 'createdAt' from the User interface
type CreateUserPayload = Omit<User, 'id' | 'createdAt'>;

const newUser: CreateUserPayload = {
  name: 'Kishori',
  email: 'kishori@domain.com',
  role: 'EDITOR',
  // No 'id' or 'createdAt' needed when creating a new record!
};

```

---

#### 4. `Record<Keys, Type>`

Constructs an object type whose property keys are `Keys` and whose property values are `Type`.

* **Primary Use Case:** Defining dictionaries, lookup maps, or mapping enums/roles to specific configurations.

```typescript
type UserRole = 'ADMIN' | 'EDITOR' | 'VIEWER';

interface RolePermissions {
  canRead: boolean;
  canWrite: boolean;
  canDelete: boolean;
}

// Maps every single UserRole key strictly to a RolePermissions object
const PERMISSION_MATRIX: Record<UserRole, RolePermissions> = {
  ADMIN: { canRead: true, canWrite: true, canDelete: true },
  EDITOR: { canRead: true, canWrite: true, canDelete: false },
  VIEWER: { canRead: true, canWrite: false, canDelete: false },
};

```

---

### Quick Comparison Summary

| Utility Type       | What It Does                         | Common Application                                     |
| ------------------ | ------------------------------------ | ------------------------------------------------------ |
| **`Partial<T>`**   | Makes all properties optional (`?`). | Form updates / PATCH requests.                         |
| **`Pick<T, K>`**   | Keeps **only** specified keys `K`.   | Card previews, table rows, public sub-views.           |
| **`Omit<T, K>`**   | Removes specified keys `K`.          | Entity creation payloads (omitting `id`, `createdAt`). |
| **`Record<K, T>`** | Creates a key-value dictionary type. | Enum maps, lookup tables, normalized cache maps.       |
