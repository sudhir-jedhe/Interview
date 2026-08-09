Structuring a large-scale React application requires a architecture that scales cleanly as your team and codebase grow. A **Feature-Based (Vertical Slice) Architecture** is the industry standard for large React applications. It groups code by business domain (e.g., `auth`, `checkout`, `analytics`) rather than technical role (`components`, `containers`, `services`), keeping related code co-located and decoupled.

Here is a comprehensive guide to structuring a production-ready, feature-based React application using **Redux Toolkit**, **RTK Query/Custom Hooks**, and performance best practices.

---

## 1. High-Level Folder Structure

```text
src/
├── app/                    # Application bootstrap & global configurations
│   ├── store.ts            # Redux Toolkit store setup
│   ├── rootReducer.ts      # Root reducer combining slice reducers
│   ├── router.tsx          # React Router configuration with lazy routes
│   └── providers/          # Global providers (Redux, Theme, Auth, QueryClient)
│       ├── AppProvider.tsx
│       └── AuthProvider.tsx
│
├── assets/                 # Global static files (images, SVGs, fonts, global CSS)
│   ├── icons/
│   └── styles/
│
├── components/             # Global reusable (shared/design-system) UI components
│   ├── ui/                 # Atomic design primitive UI (Button, Modal, Input, Spinner)
│   │   ├── Button/
│   │   │   ├── Button.tsx
│   │   │   ├── Button.test.tsx
│   │   │   └── index.ts
│   │   └── Modal/
│   └── feedback/           # Error Boundaries, Toast notifications, Fallbacks
│
├── hooks/                  # Global shared custom hooks
│   ├── useDebounce.ts
│   ├── useMediaQuery.ts
│   └── useLocalStorage.ts
│
├── services/               # Dedicated global API base layer / HTTP client
│   ├── apiBase.ts          # Axios / Fetch base instance with interceptors (JWT refresh)
│   └── rtkQueryBase.ts     # Base Query setup for RTK Query
│
├── utils/                  # Pure utility/helper functions
│   ├── formatters.ts       # Currency, date, string formatters
│   └── validators.ts       # Zod/Yup schemas or validation logic
│
├── types/                  # Global TypeScript type definitions
│   ├── common.ts           # Standardized API response types, pagination types
│   └── env.d.ts
│
├── features/               # 🎯 FEATURE-BASED ARCHITECTURE MODULES
│   ├── auth/               # Feature 1: Authentication module
│   │   ├── api/            # Feature-specific API endpoints / RTK Query endpoints
│   │   ├── components/     # UI components exclusive to this feature
│   │   ├── hooks/          # Business logic encapsulated in custom hooks
│   │   ├── model/          # Redux slice, selectors, types for this feature
│   │   ├── pages/          # Page-level components for routing
│   │   └── index.ts        # Public API (barrel export) exposing feature components
│   │
│   ├── products/           # Feature 2: Product Catalog
│   │   ├── api/
│   │   │   └── productApi.ts
│   │   ├── components/
│   │   │   ├── ProductCard/
│   │   │   └── ProductFilter/
│   │   ├── hooks/
│   │   │   └── useProductFilter.ts
│   │   ├── model/
│   │   │   ├── productSlice.ts
│   │   │   ├── productSelectors.ts
│   │   │   └── productTypes.ts
│   │   ├── pages/
│   │   │   ├── ProductListPage.tsx
│   │   │   └── ProductDetailPage.tsx
│   │   └── index.ts
│   │
│   └── cart/               # Feature 3: Shopping Cart module
│
├── config/                 # Environment variables and constants
│   ├── env.ts
│   └── constants.ts
│
├── App.tsx
└── main.tsx

```

---

## 2. Deep Dive: Anatomy of a Single Feature Module

Every feature inside `src/features/[feature-name]` acts as an isolated mini-application. It exposes only what other modules need via a **public API (`index.ts`)**.

```text
features/products/
├── api/
│   └── productApi.ts       # RTK Query endpoints for products
├── components/
│   ├── ProductCard.tsx     # Feature-bound component
│   └── ProductGrid.tsx
├── hooks/
│   └── useProductCatalog.ts # Encapsulates data fetching + UI state logic
├── model/
│   ├── productSlice.ts     # Local UI state slice (e.g., view mode, active filters)
│   ├── productSelectors.ts # Reselect memoized selectors
│   └── productTypes.ts     # TypeScript interfaces for Product
├── pages/
│   └── ProductPage.tsx     # Page container
└── index.ts                # Explicitly exports components/hooks used by other features

```

### Module Public API (`features/products/index.ts`)

Avoid importing internal files from another feature directly (e.g., `import X from '../features/products/components/ProductCard'`). Instead, import from the module's root:

```typescript
// features/products/index.ts
export { ProductCard } from './components/ProductCard';
export { useProductCatalog } from './hooks/useProductCatalog';
export { productReducer } from './model/productSlice';
export { productApi } from './api/productApi';
export type { Product } from './model/productTypes';

```

---

## 3. Dedicated API Layer & State Management (Redux Toolkit)

### A. Base API Layer (`services/apiBase.ts`)

Configure an HTTP client or RTK Query `fetchBaseQuery` with global interceptors for handling authentication tokens, refreshing expired JWTs, and uniform error handling.

```typescript
// services/rtkQueryBase.ts
import { fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { RootState } from '../app/store';

export const baseQueryWithReauth = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_BASE_URL,
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.token;
    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

```

### B. Feature API Definition (`features/products/api/productApi.ts`)

Use **RTK Query** for server state management. It automatically handles caching, deduplication, loading states, and invalidation.

```typescript
// features/products/api/productApi.ts
import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from '../../../services/rtkQueryBase';
import { Product } from '../model/productTypes';

export const productApi = createApi({
  reducerPath: 'productApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Products'],
  endpoints: (builder) => ({
    getProducts: builder.query<Product[], { category?: string }>({
      query: (params) => ({
        url: '/products',
        params,
      }),
      providesTags: (result) =>
        result
          ? [...result.map(({ id }) => ({ type: 'Products' as const, id })), 'Products']
          : ['Products'],
    }),
  }),
});

export const { useGetProductsQuery } = productApi;

```

### C. Redux Slice for Client State (`features/products/model/productSlice.ts`)

Use Redux Toolkit slices **only for global client UI state** (e.g., active modal states, user preferences, theme). Server data caching should stay inside RTK Query.

```typescript
// features/products/model/productSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ProductUIState {
  selectedViewMode: 'grid' | 'list';
}

const initialState: ProductUIState = {
  selectedViewMode: 'grid',
};

export const productSlice = createSlice({
  name: 'productsUI',
  initialState,
  reducers: {
    setViewMode: (state, action: PayloadAction<'grid' | 'list'>) => {
      state.selectedViewMode = action.payload;
    },
  },
});

export const { setViewMode } = productSlice.actions;
export const productReducer = productSlice.reducer;

```

---

## 4. Separating Logic with Custom Hooks

Keep your JSX components clean and declarative ("dumb UI"). Extract complex data fetching, Redux dispatches, and business logic into custom hooks.

```typescript
// features/products/hooks/useProductCatalog.ts
import { useGetProductsQuery } from '../api/productApi';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { setViewMode } from '../model/productSlice';

export const useProductCatalog = (category?: string) => {
  const dispatch = useAppDispatch();
  const viewMode = useAppSelector((state) => state.productsUI.selectedViewMode);

  const { data: products = [], isLoading, isError, refetch } = useGetProductsQuery({ category });

  const toggleViewMode = (mode: 'grid' | 'list') => {
    dispatch(setViewMode(mode));
  };

  return {
    products,
    isLoading,
    isError,
    viewMode,
    toggleViewMode,
    refetch,
  };
};

```

---

## 5. Performance Optimization Strategy

### A. Lazy Loading & Code Splitting (Page Level)

Split bundles at the route/page level using `React.lazy` and `Suspense`. This ensures users only download JavaScript required for the current route.

```tsx
// app/router.tsx
import { lazy, Suspense } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import { PageSpinner } from '../components/ui/Spinner';

// Lazy loading pages from feature modules
const ProductListPage = lazy(() =>
  import('../features/products/pages/ProductListPage').then((m) => ({ default: m.ProductListPage }))
);
const CartPage = lazy(() =>
  import('../features/cart/pages/CartPage').then((m) => ({ default: m.CartPage }))
);

export const router = createBrowserRouter([
  {
    path: '/products',
    element: (
      <Suspense fallback={<PageSpinner />}>
        <ProductListPage />
      </Suspense>
    ),
  },
  {
    path: '/cart',
    element: (
      <Suspense fallback={<PageSpinner />}>
        <CartPage />
      </Suspense>
    ),
  },
]);

```

### B. Dynamic Redux Reducer & RTK Query Middleware Injection

To keep the initial bundle minimal, dynamically inject feature Redux slices and RTK Query APIs when their respective routes are loaded, rather than bundling all feature reducers upfront.

### C. Re-render Optimization

* Use **`createSelector`** from Redux Toolkit / Reselect for memoized state selection.
* Use **`React.memo`** selectively for heavily rendered list items (e.g., `ProductCard`).
* Use **`useCallback`** when passing handlers down to long virtualized lists.

---

## 6. Engineering Standards & Team Practices

### A. Strict Module Boundary Enforcement

Use ESLint rules (`eslint-plugin-import` or `@nx/eslint-plugin`) to prevent circular dependencies and restrict cross-feature internal imports.

```json
// .eslintrc.json rule constraint snippet
{
  "rules": {
    "no-restricted-imports": [
      "error",
      {
        "patterns": [
          {
            "group": ["features/*/*/**"],
            "message": "Do not import internal feature files directly. Use the feature public API (features/feature-name/index.ts) instead."
          }
        ]
      }
    ]
  }
}

```

### B. TypeScript Path Aliases

Configure path aliases in `tsconfig.json` and Vite/Webpack to eliminate fragile relative path imports like `../../../../components/ui/Button`.

```json
// tsconfig.json
{
  "compilerOptions": {
    "baseUrl": "src",
    "paths": {
      "@app/*": ["app/*"],
      "@components/*": ["components/*"],
      "@features/*": ["features/*"],
      "@services/*": ["services/*"],
      "@utils/*": ["utils/*"],
      "@hooks/*": ["hooks/*"]
    }
  }
}

```

### C. Testing Strategy per Feature

Keep tests inside the feature module right next to the code being tested:

* **Unit Tests (`*.test.ts`):** Redux slices, custom hooks (via `@testing-library/react-hooks`), utility functions.
* **Component Integration Tests (`*.test.tsx`):** Feature components using `@testing-library/react` and MSW (Mock Service Worker) for API interception.

---

## Summary Architecture Checklist

| Architectural Layer       | Responsibility                               | Technology / Tool                           |
| ------------------------- | -------------------------------------------- | ------------------------------------------- |
| **`src/app`**             | App setup, store creation, providers, router | Redux Toolkit, React Router v6+             |
| **`src/components/ui`**   | Reusable, stateless design primitives        | Tailwind CSS / Styled Components / Radix UI |
| **`src/features/[name]`** | Isolated business domain slice               | Feature-based vertical modules              |
| **`src/services`**        | Base HTTP client & interceptors              | Axios / Fetch / RTK Query Base              |
| **State Management**      | Server caching vs. Global UI state           | RTK Query (Server) + RTK Slices (UI)        |
| **Business Logic**        | Custom hooks separating logic from JSX       | React Custom Hooks                          |
| **Performance**           | Code splitting & dynamic bundle loading      | `React.lazy()` + `Suspense`                 |
