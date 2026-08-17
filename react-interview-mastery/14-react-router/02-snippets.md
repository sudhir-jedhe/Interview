# Snippets

### 1. Basic route setup with a catch-all 404
```jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="*" element={<p>404 Not Found</p>} />
      </Routes>
    </BrowserRouter>
  );
}
```

### 2. `Link` for in-app navigation without a full reload
```jsx
import { Link } from 'react-router-dom';
function Nav() {
  return (
    <nav>
      <Link to="/">Home</Link>
      <Link to="/about">About</Link>
    </nav>
  );
}
```

### 3. Dynamic segment extracted with `useParams`
```jsx
// <Route path="/posts/:postId" element={<Post />} />
function Post() {
  const { postId } = useParams();
  return <h1>Post #{postId}</h1>; // /posts/7 -> "Post #7"
}
```

### 4. Programmatic navigation after a form submission
```jsx
function SignupForm() {
  const navigate = useNavigate();
  async function handleSubmit(e) {
    e.preventDefault();
    await createAccount();
    navigate('/welcome', { replace: true });
  }
  return <form onSubmit={handleSubmit}>...</form>;
}
```

### 5. Reading and updating query params with `useSearchParams`
```jsx
function ProductList() {
  const [searchParams, setSearchParams] = useSearchParams();
  const sort = searchParams.get('sort') ?? 'popularity';
  return (
    <select value={sort} onChange={e => setSearchParams({ sort: e.target.value })}>
      <option value="popularity">Popularity</option>
      <option value="price">Price</option>
    </select>
  );
}
```

### 6. Layout route with `<Outlet />` for nested pages
```jsx
function AppLayout() {
  return (
    <div>
      <Header />
      <Outlet />
      <Footer />
    </div>
  );
}
// <Route element={<AppLayout />}>
//   <Route path="/" element={<Home />} />
//   <Route path="/about" element={<About />} />
// </Route>
```

### 7. Minimal protected route wrapper
```jsx
function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return children;
}
// <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
```
