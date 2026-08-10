Here is how you can update the **Breadcrumbs component** to dynamically resolve titles from an API or cache for dynamic routes like `/users/:id` or `/products/:id`.

We'll introduce an **async label resolver system** that matches route parameters, checks a local cache (to eliminate redundant network requests), and falls back to a skeleton/loading state while fetching.

---

### Extended `Breadcrumbs.jsx`

```jsx
import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Breadcrumbs.css';

export default function Breadcrumbs({ 
  customLabels = {}, 
  resolvers = {}, 
  maxItems = 4 
}) {
  const location = useLocation();
  const [isExpanded, setIsExpanded] = useState(false);
  const [asyncLabels, setAsyncLabels] = useState({});
  const [loadingSlugs, setLoadingSlugs] = useState({});

  // In-memory cache across re-renders
  const cache = useRef({});

  const pathnames = location.pathname.split('/').filter((x) => x);

  useEffect(() => {
    pathnames.forEach((slug, index) => {
      // Determine context (e.g. parent path segment name like "users" if slug is an ID)
      const parentSegment = index > 0 ? pathnames[index - 1] : null;
      
      // Match against resolver key (e.g. resolver for "users" or direct "users/:id")
      const resolver = resolvers[parentSegment] || resolvers[slug];

      if (resolver && !asyncLabels[slug] && !cache.current[slug]) {
        // Mark slug as loading
        setLoadingSlugs((prev) => ({ ...prev, [slug]: true }));

        // Trigger dynamic resolver fetch
        resolver(slug)
          .then((title) => {
            cache.current[slug] = title;
            setAsyncLabels((prev) => ({ ...prev, [slug]: title }));
          })
          .catch(() => {
            // Fallback gracefully on error
            setAsyncLabels((prev) => ({ ...prev, [slug]: slug }));
          })
          .finally(() => {
            setLoadingSlugs((prev) => ({ ...prev, [slug]: false }));
          });
      }
    });
  }, [location.pathname, resolvers]);

  if (pathnames.length === 0) return null;

  // Helper function to resolve crumb labels
  const formatCrumbName = (slug) => {
    if (loadingSlugs[slug]) return <span className="breadcrumbs-skeleton" aria-hidden="true" />;
    if (asyncLabels[slug]) return asyncLabels[slug];
    if (cache.current[slug]) return cache.current[slug];
    if (customLabels[slug]) return customLabels[slug];

    return decodeURIComponent(slug)
      .replace(/-/g, ' ')
      .replace(/\b\w/g, (l) => l.toUpperCase());
  };

  const allCrumbs = pathnames.map((name, index) => {
    const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
    return {
      name,
      routeTo,
      label: formatCrumbName(name),
      isLast: index === pathnames.length - 1,
    };
  });

  let displayedCrumbs = allCrumbs;
  const shouldTruncate = allCrumbs.length > maxItems && !isExpanded;

  if (shouldTruncate) {
    const firstCrumb = allCrumbs[0];
    const tailCrumbs = allCrumbs.slice(allCrumbs.length - (maxItems - 2));
    displayedCrumbs = [firstCrumb, 'TRUNCATED', ...tailCrumbs];
  }

  return (
    <nav aria-label="Breadcrumb" className="breadcrumbs-nav">
      <ol className="breadcrumbs-list">
        <li className="breadcrumbs-item">
          <Link to="/" className="breadcrumbs-link">Home</Link>
          <span className="breadcrumbs-separator" aria-hidden="true">/</span>
        </li>

        {displayedCrumbs.map((crumb) => {
          if (crumb === 'TRUNCATED') {
            return (
              <li key="truncated" className="breadcrumbs-item">
                <button 
                  onClick={() => setIsExpanded(true)} 
                  className="breadcrumbs-ellipsis"
                  aria-label="Show collapsed breadcrumbs"
                >
                  ...
                </button>
                <span className="breadcrumbs-separator" aria-hidden="true">/</span>
              </li>
            );
          }

          return (
            <li key={crumb.routeTo} className="breadcrumbs-item">
              {crumb.isLast ? (
                <span className="breadcrumbs-text current" aria-current="page">
                  {crumb.label}
                </span>
              ) : (
                <>
                  <Link to={crumb.routeTo} className="breadcrumbs-link">
                    {crumb.label}
                  </Link>
                  <span className="breadcrumbs-separator" aria-hidden="true">/</span>
                </>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

```

---

### `Breadcrumbs.css` Additions

Add a pulsing skeleton animation to handle the async resolution visual phase cleanly:

```css
.breadcrumbs-skeleton {
  display: inline-block;
  width: 60px;
  height: 14px;
  background-color: #e0e0e0;
  border-radius: 4px;
  animation: breadcrumb-pulse 1.2s infinite ease-in-out;
}

@keyframes breadcrumb-pulse {
  0% { opacity: 0.6; }
  50% { opacity: 1; }
  100% { opacity: 0.6; }
}

```

---

### How to Use the `resolvers` Prop

Pass a mapping object where keys represent parent routes (`users`, `products`, etc.) and values are async functions returning a string title:

```jsx
import React from 'react';
import Breadcrumbs from './Breadcrumbs';

// Example API fetch functions
const fetchUserName = async (userId) => {
  const res = await fetch(`https://jsonplaceholder.typicode.com/users/${userId}`);
  const user = await res.json();
  return user.name; // e.g., "Leanne Graham"
};

const fetchProductName = async (productId) => {
  const res = await fetch(`/api/products/${productId}`);
  const product = await res.json();
  return product.title;
};

export default function AppLayout() {
  return (
    <Breadcrumbs
      customLabels={{
        users: "User Directory",
        products: "Product Catalog"
      }}
      resolvers={{
        // Key corresponds to parent path segment preceding dynamic :id
        users: fetchUserName,
        products: fetchProductName
      }}
    />
  );
}

```
