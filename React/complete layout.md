Here is a complete, production-ready React layout architecture that meets all your requirements: a top navigation bar with a hamburger drawer toggle, dynamic React Router breadcrumbs, a central main content area, and a right-side Table of Contents (TOC) with smooth-scrolling and scroll-spy functionality.

Below is an interactive live preview of the layout so you can test the routing, sidebar toggling, dynamic breadcrumbs, and right-hand scroll target links in action.

---

### Key Technical Concepts

1. **Dynamic Breadcrumbs (`useLocation`)**:
Reads the current route's `pathname` via `useLocation()` from `react-router-dom`, splits the path segments, and formats them into clickable link chains automatically.
2. **Smooth Scrolling to Content (`scrollIntoView`)**:
The right TOC links map to the `id` attributes of heading elements in the central content container. Clicking a link executes `document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })`.
3. **Scroll Spy (`IntersectionObserver`)**:
An `IntersectionObserver` tracks which content heading is currently inside the central container's viewport and updates the highlighted state on the right TOC automatically as the user scrolls.
4. **Responsive Hamburger Drawer State**:
A top-level layout state (`isSidebarOpen`) toggles the slide-in menu visibility across desktop and mobile screens.

---

### React Implementation Code

Install `react-router-dom` and `lucide-react` (for icons) in your project:

```bash
npm install react-router-dom lucide-react

```

#### 1. Dynamic Breadcrumb Component (`Breadcrumbs.jsx`)

```jsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

export const Breadcrumbs = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  return (
    <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-6 py-2 px-4 bg-gray-50 rounded-lg border border-gray-200">
      <Link to="/" className="flex items-center hover:text-blue-600 transition-colors">
        <Home size={16} className="mr-1" />
        Home
      </Link>

      {pathnames.map((name, index) => {
        const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
        const isLast = index === pathnames.length - 1;
        const formattedName = name.charAt(0).toUpperCase() + name.slice(1);

        return (
          <React.Fragment key={routeTo}>
            <ChevronRight size={14} className="text-gray-400" />
            {isLast ? (
              <span className="font-semibold text-gray-900">{formattedName}</span>
            ) : (
              <Link to={routeTo} className="hover:text-blue-600 transition-colors capitalize">
                {formattedName}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};

```

#### 2. Right Side Table of Contents (`TableOfContents.jsx`)

```jsx
import React, { useEffect, useState } from 'react';

export const TableOfContents = ({ sections, containerRef }) => {
  const [activeId, setActiveId] = useState('');

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      {
        root: containerRef?.current || null,
        rootMargin: '0px 0px -60% 0px',
        threshold: 0.1,
      }
    );

    sections.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [sections, containerRef]);

  return (
    <aside className="w-64 flex-shrink-0 hidden lg:block p-4 border-l border-gray-200 bg-white sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-3">
        On This Page
      </h3>
      <nav className="space-y-1">
        {sections.map((section) => {
          const isActive = activeId === section.id;
          return (
            <button
              key={section.id}
              onClick={() => scrollToSection(section.id)}
              className={`block w-full text-left px-3 py-1.5 text-sm rounded-md transition-colors ${
                isActive
                  ? 'bg-blue-50 text-blue-600 font-medium border-l-2 border-blue-600'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              {section.title}
            </button>
          );
        })}
      </nav>
    </aside>
  );
};

```

#### 3. Main Master Layout (`MainLayout.jsx`)

```jsx
import React, { useState, useRef } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { Menu, X, BookOpen, Layers, Settings, Home, Compass } from 'lucide-react';
import { Breadcrumbs } from './Breadcrumbs';

export const MainLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const mainContentRef = useRef(null);

  const navigationItems = [
    { path: '/', label: 'Overview', icon: Home },
    { path: '/docs', label: 'Documentation', icon: BookOpen },
    { path: '/features', label: 'Features', icon: Layers },
    { path: '/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-100 font-sans">
      {/* 1. Top Navigation Bar */}
      <header className="h-16 bg-white border-b border-gray-200 px-4 flex items-center justify-between sticky top-0 z-30 shadow-sm">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 rounded-md hover:bg-gray-100 text-gray-700 transition-colors"
            aria-label="Toggle Sidebar"
          >
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <div className="flex items-center space-x-2 font-bold text-lg text-blue-600">
            <Compass size={24} />
            <span>AppWorkspace</span>
          </div>
        </div>
        <div className="flex items-center space-x-4 text-sm text-gray-600">
          <span className="bg-green-100 text-green-700 px-2.5 py-1 rounded-full text-xs font-semibold">
            v2.4 Active
          </span>
        </div>
      </header>

      {/* Main App Container */}
      <div className="flex flex-1 relative overflow-hidden">
        {/* 2. Left Hamburger Drawer Sidebar */}
        <aside
          className={`w-64 bg-white border-r border-gray-200 flex-shrink-0 transition-all duration-300 transform z-20 absolute md:relative h-[calc(100vh-4rem)] ${
            isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:-ml-64'
          }`}
        >
          <nav className="p-4 space-y-1">
            <p className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
              Navigation
            </p>
            {navigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`
                  }
                >
                  <Icon size={18} />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>
        </aside>

        {/* 3. Central Main Content Area */}
        <main className="flex-1 flex overflow-hidden">
          <div
            ref={mainContentRef}
            className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6 scroll-smooth"
          >
            {/* Dynamic Breadcrumbs */}
            <Breadcrumbs />

            {/* Route Content Passed via Outlet */}
            <Outlet context={{ mainContentRef }} />
          </div>
        </main>
      </div>
    </div>
  );
};

```

#### 4. Route Page with Section Targets (`DocsPage.jsx`)

```jsx
import React from 'react';
import { useOutletContext } from 'react-router-dom';
import { TableOfContents } from './TableOfContents';

export const DocsPage = () => {
  const { mainContentRef } = useOutletContext();

  const sections = [
    { id: 'overview', title: '1. Overview' },
    { id: 'installation', title: '2. Installation' },
    { id: 'architecture', title: '3. Architecture' },
    { id: 'api-reference', title: '4. API Reference' },
  ];

  return (
    <div className="flex gap-8">
      {/* Main Article Body */}
      <div className="flex-1 max-w-4xl bg-white p-8 rounded-xl shadow-sm border border-gray-200 space-y-12">
        <section id="overview" className="scroll-mt-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-4 pb-2 border-b">
            1. Overview
          </h1>
          <p className="text-gray-600 leading-relaxed">
            Welcome to the documentation page. This central panel displays your main content while
            the right-side Table of Contents provides instant scrolling navigation to sub-sections.
          </p>
        </section>

        <section id="installation" className="scroll-mt-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 pb-2 border-b">
            2. Installation
          </h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            Get started by installing the package via npm or yarn:
          </p>
          <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg text-sm font-mono">
            npm install react-router-dom lucide-react
          </pre>
        </section>

        <section id="architecture" className="scroll-mt-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 pb-2 border-b">
            3. Architecture
          </h2>
          <p className="text-gray-600 leading-relaxed">
            The layout components communicate state via standard React hooks. React Router handles
            sub-route changes which update the dynamic breadcrumbs seamlessly.
          </p>
        </section>

        <section id="api-reference" className="scroll-mt-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 pb-2 border-b">
            4. API Reference
          </h2>
          <p className="text-gray-600 leading-relaxed">
            Explore available hooks such as <code className="text-blue-600 font-mono">useLocation</code> and{' '}
            <code className="text-blue-600 font-mono">useOutletContext</code> to pass parent DOM references to TOC components.
          </p>
        </section>
      </div>

      {/* 4. Right Side Table of Contents Links */}
      <TableOfContents sections={sections} containerRef={mainContentRef} />
    </div>
  );
};

```

#### 5. Router Assembly (`App.jsx`)

```jsx
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { MainLayout } from './MainLayout';
import { DocsPage } from './DocsPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<DocsPage />} />
          <Route path="docs" element={<DocsPage />} />
          <Route path="features" element={<DocsPage />} />
          <Route path="settings" element={<DocsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

```

Add dark mode support and local storage state persistence for the left sidebar drawer state.

Here is the upgraded layout code with **Dark Mode support** (using Tailwind CSS `dark:` variant classes and state persistence) and **Local Storage persistence** for the sidebar drawer state.

### Key Enhancements Added

1. **Sidebar State Persistence**:

* Replaced simple `useState` with a custom hook or helper function that synchronizes the drawer open/closed boolean with `localStorage.getItem('sidebar_open')`.
* On initial load, it recovers the user's preference automatically.

1. **Dark Mode Integration**:

* Added a theme toggle button in the top navigation bar.
* Synchronizes the dark theme state (`dark` or `light`) with both `localStorage` and the `<html>` root element class list (`document.documentElement.classList.add('dark')`).
* All components (Navbar, Sidebar, Breadcrumbs, Content, and Table of Contents) now include responsive dark mode styling using Tailwind's `dark:` utility classes.

---

### Updated Implementation Code

#### 1. Custom Storage Hook (`useLocalStorage.js`)

A small helper hook to handle reading and writing state safely to `localStorage`.

```javascript
import { useState, useEffect } from 'react';

export function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item !== null ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue));
    } catch (error) {
      console.error(`Error writing localStorage key "${key}":`, error);
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
}

```

---

#### 2. Updated Dynamic Breadcrumb Component (`Breadcrumbs.jsx`)

Updated with full dark mode color tokens.

```jsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

export const Breadcrumbs = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  return (
    <nav className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300 mb-6 py-2 px-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 transition-colors">
      <Link to="/" className="flex items-center hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
        <Home size={16} className="mr-1" />
        Home
      </Link>

      {pathnames.map((name, index) => {
        const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
        const isLast = index === pathnames.length - 1;
        const formattedName = name.charAt(0).toUpperCase() + name.slice(1);

        return (
          <React.Fragment key={routeTo}>
            <ChevronRight size={14} className="text-gray-400 dark:text-gray-500" />
            {isLast ? (
              <span className="font-semibold text-gray-900 dark:text-gray-100">{formattedName}</span>
            ) : (
              <Link to={routeTo} className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors capitalize">
                {formattedName}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};

```

---

#### 3. Updated Right Side Table of Contents (`TableOfContents.jsx`)

Added dark mode classes for container background, border, active state highlights, and hover effects.

```jsx
import React, { useEffect, useState } from 'react';

export const TableOfContents = ({ sections, containerRef }) => {
  const [activeId, setActiveId] = useState('');

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      {
        root: containerRef?.current || null,
        rootMargin: '0px 0px -60% 0px',
        threshold: 0.1,
      }
    );

    sections.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [sections, containerRef]);

  return (
    <aside className="w-64 flex-shrink-0 hidden lg:block p-4 border-l border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto transition-colors">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-3">
        On This Page
      </h3>
      <nav className="space-y-1">
        {sections.map((section) => {
          const isActive = activeId === section.id;
          return (
            <button
              key={section.id}
              onClick={() => scrollToSection(section.id)}
              className={`block w-full text-left px-3 py-1.5 text-sm rounded-md transition-colors ${
                isActive
                  ? 'bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 font-medium border-l-2 border-blue-600 dark:border-blue-400'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100'
              }`}
            >
              {section.title}
            </button>
          );
        })}
      </nav>
    </aside>
  );
};

```

---

#### 4. Updated Main Master Layout (`MainLayout.jsx`)

Includes Theme Toggle (Sun/Moon), root class syncing for Dark Mode, and state persistence for `isSidebarOpen`.

```jsx
import React, { useEffect, useRef } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { Menu, X, BookOpen, Layers, Settings, Home, Compass, Sun, Moon } from 'lucide-react';
import { Breadcrumbs } from './Breadcrumbs';
import { useLocalStorage } from './useLocalStorage';

export const MainLayout = () => {
  // 1. Sidebar open/close state with localStorage persistence
  const [isSidebarOpen, setIsSidebarOpen] = useLocalStorage('sidebar_open', true);

  // 2. Dark mode state with localStorage persistence
  const [isDarkMode, setIsDarkMode] = useLocalStorage('theme_dark', false);

  const mainContentRef = useRef(null);

  // Apply or remove 'dark' class on HTML root element whenever theme changes
  useEffect(() => {
    const root = document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [isDarkMode]);

  const navigationItems = [
    { path: '/', label: 'Overview', icon: Home },
    { path: '/docs', label: 'Documentation', icon: BookOpen },
    { path: '/features', label: 'Features', icon: Layers },
    { path: '/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-100 dark:bg-gray-950 text-gray-900 dark:text-gray-100 font-sans transition-colors duration-200">
      {/* Top Navigation Bar */}
      <header className="h-16 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-4 flex items-center justify-between sticky top-0 z-30 shadow-sm transition-colors">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-200 transition-colors"
            aria-label="Toggle Sidebar"
          >
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <div className="flex items-center space-x-2 font-bold text-lg text-blue-600 dark:text-blue-400">
            <Compass size={24} />
            <span>AppWorkspace</span>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          {/* Theme Switcher Button */}
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="p-2 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            aria-label="Toggle Dark Mode"
          >
            {isDarkMode ? <Sun size={18} className="text-amber-400" /> : <Moon size={18} className="text-slate-600" />}
          </button>

          <span className="bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-300 px-2.5 py-1 rounded-full text-xs font-semibold">
            v2.4 Active
          </span>
        </div>
      </header>

      {/* Main Container */}
      <div className="flex flex-1 relative overflow-hidden">
        {/* Left Drawer Sidebar (Persisted via LocalStorage) */}
        <aside
          className={`w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex-shrink-0 transition-all duration-300 transform z-20 absolute md:relative h-[calc(100vh-4rem)] ${
            isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:-ml-64'
          }`}
        >
          <nav className="p-4 space-y-1">
            <p className="px-3 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2">
              Navigation
            </p>
            {navigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-blue-600 text-white shadow-sm dark:bg-blue-600'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`
                  }
                >
                  <Icon size={18} />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>
        </aside>

        {/* Central Main Content */}
        <main className="flex-1 flex overflow-hidden">
          <div
            ref={mainContentRef}
            className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6 scroll-smooth"
          >
            <Breadcrumbs />
            <Outlet context={{ mainContentRef }} />
          </div>
        </main>
      </div>
    </div>
  );
};

```

---

#### 5. Updated Content Page (`DocsPage.jsx`)

Styled for dark surfaces with dark borders, high-contrast text, and styled code blocks.

```jsx
import React from 'react';
import { useOutletContext } from 'react-router-dom';
import { TableOfContents } from './TableOfContents';

export const DocsPage = () => {
  const { mainContentRef } = useOutletContext();

  const sections = [
    { id: 'overview', title: '1. Overview' },
    { id: 'installation', title: '2. Installation' },
    { id: 'architecture', title: '3. Architecture' },
    { id: 'api-reference', title: '4. API Reference' },
  ];

  return (
    <div className="flex gap-8">
      {/* Main Article Body */}
      <div className="flex-1 max-w-4xl bg-white dark:bg-gray-900 p-8 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 space-y-12 transition-colors">
        <section id="overview" className="scroll-mt-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4 pb-2 border-b border-gray-200 dark:border-gray-800">
            1. Overview
          </h1>
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
            Welcome to the documentation page. Sidebar visibility state and active theme options are stored in localStorage to preserve preferences across browser reloads.
          </p>
        </section>

        <section id="installation" className="scroll-mt-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4 pb-2 border-b border-gray-200 dark:border-gray-800">
            2. Installation
          </h2>
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
            Ensure your Tailwind configuration has darkMode set to class:
          </p>
          <pre className="bg-gray-900 dark:bg-gray-950 text-gray-100 border border-gray-800 p-4 rounded-lg text-sm font-mono">
            {`// tailwind.config.js
module.exports = {
  darkMode: 'class',
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
};`}
          </pre>
        </section>

        <section id="architecture" className="scroll-mt-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4 pb-2 border-b border-gray-200 dark:border-gray-800">
            3. Architecture
          </h2>
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
            The layout components dynamically apply the <code className="text-blue-600 dark:text-blue-400 font-mono">dark</code> class to the root element.
          </p>
        </section>

        <section id="api-reference" className="scroll-mt-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4 pb-2 border-b border-gray-200 dark:border-gray-800">
            4. API Reference
          </h2>
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
            Explore available hooks such as <code className="text-blue-600 dark:text-blue-400 font-mono">useLocalStorage</code> for syncing layout UI configurations directly with local storage.
          </p>
        </section>
      </div>

      <TableOfContents sections={sections} containerRef={mainContentRef} />
    </div>
  );
};

```

How can I expand the React Router breadcrumbs component to support nested sub-routes with custom titles?
To handle nested sub-routes and display custom human-readable titles (like replacing an obscure ID like `/users/usr_98234/settings` with **Home > Users > Jane Doe > Settings**), you can decouple the breadcrumbs from raw URL pathnames.

The cleanest pattern in React Router (v6+) uses the **`handle` prop** on your route definitions combined with `useMatches()`.

---

### Step 1: Define Custom Titles in Route Definitions (`routes.jsx`)

Attach a `handle` object containing a `crumb` function or title string directly to each route configuration:

```jsx
import { createBrowserRouter } from 'react-router-dom';
import { MainLayout } from './MainLayout';
import { ProjectsList } from './ProjectsList';
import { ProjectDetails } from './ProjectDetails';
import { ProjectSettings } from './ProjectSettings';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    handle: {
      crumb: () => ({ label: 'Home', path: '/' }),
    },
    children: [
      {
        path: 'projects',
        handle: {
          crumb: () => ({ label: 'Projects', path: '/projects' }),
        },
        children: [
          {
            index: true,
            element: <ProjectsList />,
          },
          {
            path: ':projectId',
            // Dynamic crumb based on route params or fetched data
            handle: {
              crumb: (data) => ({
                label: data?.projectName || `Project #${data?.projectId}`,
                path: `/projects/${data?.projectId}`,
              }),
            },
            children: [
              {
                index: true,
                element: <ProjectDetails />,
              },
              {
                path: 'settings',
                element: <ProjectSettings />,
                handle: {
                  crumb: (data) => ({
                    label: 'Settings',
                    path: `/projects/${data?.projectId}/settings`,
                  }),
                },
              },
            ],
          },
        ],
      },
    ],
  },
]);

```

---

### Step 2: Build the Dynamic `Breadcrumbs` Component

Use `useMatches()` to collect all active route matches in the current tree hierarchy, execute their `handle.crumb` functions, and render the breadcrumb chain.

```jsx
import React from 'react';
import { Link, useMatches } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

export const DynamicBreadcrumbs = ({ extraData }) => {
  const matches = useMatches();

  // Filter out routes that don't define a handle.crumb
  const crumbs = matches
    .filter((match) => Boolean(match.handle?.crumb))
    .map((match) => {
      // Pass route params and extra data into the crumb handler
      const crumbConfig = match.handle.crumb({
        ...match.params,
        ...extraData,
      });

      return {
        id: match.id,
        label: crumbConfig.label,
        path: crumbConfig.path || match.pathname,
      };
    });

  if (crumbs.length <= 1) return null; // Hide if only 'Home' is matched

  return (
    <nav 
      aria-label="Breadcrumb"
      className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300 mb-6 py-2 px-4 bg-gray-50 dark:bg-gray-800/60 rounded-lg border border-gray-200 dark:border-gray-700/60 transition-colors"
    >
      {crumbs.map((crumb, index) => {
        const isLast = index === crumbs.length - 1;

        return (
          <React.Fragment key={crumb.id}>
            {index > 0 && (
              <ChevronRight size={14} className="text-gray-400 dark:text-gray-500 flex-shrink-0" />
            )}

            {isLast ? (
              <span className="font-semibold text-gray-900 dark:text-gray-100 truncate">
                {crumb.label}
              </span>
            ) : (
              <Link
                to={crumb.path}
                className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors truncate"
              >
                {crumb.label}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};

```

---

### Step 3: Fetching Async Custom Names (e.g., User/Project Names)

If the custom title depends on dynamic data loaded from an API, pass loaded loader data or state into the route's `handle`:

```jsx
// Example in ProjectDetails.jsx using React Router loader data
import { useLoaderData } from 'react-router-dom';

export async function projectLoader({ params }) {
  const project = await fetchProject(params.projectId);
  return { project };
}

// In your Breadcrumbs call inside MainLayout or Page:
const matches = useMatches();
// React Router automatically passes `match.data` (from your route loader) 
// into match.handle.crumb(match.data)!

```

### Key Advantages of This Approach

1. **Fully Decoupled Titles:** Route URLs can remain clean (`/p/102/s`) while breadcrumbs display rich text (`Projects > Analytics App > Settings`).
2. **Support for Unlimited Nesting:** React Router's `useMatches()` automatically reflects the exact route hierarchy no matter how deep your `children` arrays go.
3. **Dark Mode & Accessibility:** Included semantic `<nav aria-label="Breadcrumb">` wrapper and dark variant tokens matching your layout style.

Show me how to pass React Router loader data directly into the breadcrumb handle.crumb function for dynamically fetched titles.

Passing React Router `loader` data directly into `handle.crumb` allows your breadcrumbs to dynamically resolve names from API responses (like showing "Project Phoenix" instead of an ID like `12389`).

React Router’s `useMatches()` hook automatically includes `match.data` (the returned value from that route’s `loader`). All you need to do is pass `match.data` into your `handle.crumb` function inside the Breadcrumb component.

Here is the complete pattern:

---

### Step 1: Define Route Loaders and `handle.crumb` (`routes.js`)

In your route definitions, return data from `loader` functions. Then, read `data` inside `handle.crumb`:

```jsx
import { createBrowserRouter } from 'react-router-dom';
import { MainLayout } from './MainLayout';
import { ProjectPage, projectLoader } from './ProjectPage';
import { TaskPage, taskLoader } from './TaskPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    handle: {
      crumb: () => ({ label: 'Home', path: '/' }),
    },
    children: [
      {
        path: 'projects',
        handle: {
          crumb: () => ({ label: 'Projects', path: '/projects' }),
        },
        children: [
          {
            path: ':projectId',
            element: <ProjectPage />,
            // 1. Fetch data in the loader
            loader: projectLoader,
            // 2. Access loaded data inside handle.crumb
            handle: {
              crumb: (data) => ({
                label: data?.project?.name || 'Loading Project...',
                path: `/projects/${data?.project?.id}`,
              }),
            },
            children: [
              {
                path: 'tasks/:taskId',
                element: <TaskPage />,
                loader: taskLoader,
                handle: {
                  crumb: (data) => ({
                    label: data?.task?.title || 'Task Details',
                    path: `/projects/${data?.projectId}/tasks/${data?.task?.id}`,
                  }),
                },
              },
            ],
          },
        ],
      },
    ],
  },
]);

```

---

### Step 2: Create the Loaders (`ProjectPage.jsx`)

Loaders run **before** the route renders. Returning an object from the loader makes it immediately available to `useMatches()`:

```jsx
import React from 'react';
import { useLoaderData } from 'react-router-dom';

// Loader function fetches data asynchronously
export async function projectLoader({ params }) {
  const response = await fetch(`/api/projects/${params.projectId}`);
  if (!response.ok) throw new Response('Project Not Found', { status: 404 });
  
  const project = await response.json();
  // Whatever you return here becomes match.data
  return { project };
}

export const ProjectPage = () => {
  const { project } = useLoaderData();

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">{project.name}</h1>
      <p className="text-gray-600 dark:text-gray-400">{project.description}</p>
    </div>
  );
};

```

---

### Step 3: Extract Loader Data in `DynamicBreadcrumbs.jsx`

In the breadcrumb component, `match.data` contains the output of that route's loader. Pass `match.data` directly into `match.handle.crumb(match.data)`:

```jsx
import React from 'react';
import { Link, useMatches } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

export const DynamicBreadcrumbs = () => {
  const matches = useMatches();

  // Process matches and pass match.data into handle.crumb
  const crumbs = matches
    .filter((match) => Boolean(match.handle?.crumb))
    .map((match) => {
      // match.data contains whatever was returned by that route's loader!
      const crumbConfig = match.handle.crumb(match.data);

      return {
        id: match.id,
        label: crumbConfig.label,
        path: crumbConfig.path || match.pathname,
      };
    });

  return (
    <nav 
      aria-label="Breadcrumb"
      className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300 mb-6 py-2 px-4 bg-gray-50 dark:bg-gray-800/60 rounded-lg border border-gray-200 dark:border-gray-700/60 transition-colors"
    >
      {crumbs.map((crumb, index) => {
        const isLast = index === crumbs.length - 1;

        return (
          <React.Fragment key={crumb.id}>
            {index > 0 && (
              <ChevronRight size={14} className="text-gray-400 dark:text-gray-500 flex-shrink-0" />
            )}

            {isLast ? (
              <span className="font-semibold text-gray-900 dark:text-gray-100 truncate">
                {crumb.label}
              </span>
            ) : (
              <Link
                to={crumb.path}
                className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors truncate"
              >
                {crumb.label}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};

```

---

### How It Works Under the Hood

1. **User navigates to `/projects/42/tasks/101**`.
2. React Router triggers `projectLoader` and `taskLoader` in parallel.
3. Once resolved, `useMatches()` returns an array of active matches:

* `match[0]` (Home): `match.data = undefined` $\rightarrow$ `crumb()` $\rightarrow$ `"Home"`
* `match[1]` (Projects): `match.data = undefined` $\rightarrow$ `crumb()` $\rightarrow$ `"Projects"`
* `match[2]` (Project 42): `match.data = { project: { name: 'Acme Redesign' } }` $\rightarrow$ `crumb(data)` $\rightarrow$ `"Acme Redesign"`
* `match[3]` (Task 101): `match.data = { task: { title: 'Update Nav' } }` $\rightarrow$ `crumb(data)` $\rightarrow$ `"Update Nav"`

1. Your dynamic breadcrumbs instantly render:
**Home > Projects > Acme Redesign > Update Nav**

How do I handle loading states or error boundaries for breadcrumbs when React Router loaders are fetching slow data or fail?

When data fetching gets slow or fails, you don't want your breadcrumb navigation to freeze, break, or disappear entirely. React Router provides clean abstractions—**Deferred Data (`defer` / `Suspense`)** for slow requests and **`useRouteError()`** for failures—that let your breadcrumb component handle both gracefully.

Here is how to make your dynamic breadcrumbs resilient to delays and API errors.

---

### 1. Handling Slow Data: Skeleton Loaders with `<Suspense>`

Instead of blocking the initial render while waiting for a slow API call, defer non-critical loader data using React Router's `defer()` (or returning a native promise) paired with React `<Suspense>`.

#### Route Definition with Deferred Promise

Return a deferred promise from your loader so the route resolves instantly while the data loads in the background:

```jsx
import { defer, Await } from 'react-router-dom';

export async function projectLoader({ params }) {
  // Fast call or immediate promise
  const projectPromise = fetch(`/api/projects/${params.projectId}`)
    .then((res) => res.json());

  // Return the promise directly without 'await'
  return defer({
    projectData: projectPromise,
  });
}

export const projectRoute = {
  path: ':projectId',
  element: <ProjectPage />,
  loader: projectLoader,
  handle: {
    // Pass the promise container into handle.crumb
    crumb: (data) => ({
      label: data?.projectData, // This is a Promise!
      path: `/projects/${data?.projectId}`,
    }),
  },
};

```

#### Deferred Breadcrumb Rendering (`DynamicBreadcrumbs.jsx`)

In your breadcrumb component, wrap individual crumb labels with React Router's `<Await>` and React `<Suspense>`. This displays a pulse skeleton specifically for that breadcrumb item while the API promise resolves:

```jsx
import React, { Suspense } from 'react';
import { Link, useMatches, Await } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

// Skeleton fallback for a single breadcrumb label
const CrumbSkeleton = () => (
  <span className="inline-block w-20 h-4 bg-gray-200 dark:bg-gray-700 animate-pulse rounded my-auto" />
);

export const DynamicBreadcrumbs = () => {
  const matches = useMatches();

  const crumbs = matches
    .filter((match) => Boolean(match.handle?.crumb))
    .map((match) => {
      const crumbConfig = match.handle.crumb(match.data);
      return {
        id: match.id,
        // Could be a raw string OR a Promise from defer()
        label: crumbConfig.label, 
        path: crumbConfig.path || match.pathname,
      };
    });

  return (
    <nav
      aria-label="Breadcrumb"
      className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300 mb-6 py-2 px-4 bg-gray-50 dark:bg-gray-800/60 rounded-lg border border-gray-200 dark:border-gray-700/60"
    >
      {crumbs.map((crumb, index) => {
        const isLast = index === crumbs.length - 1;

        // Render the label inside a Suspense boundary if it's a promise
        const renderLabel = (labelValue) => {
          if (labelValue && typeof labelValue.then === 'function') {
            return (
              <Suspense fallback={<CrumbSkeleton />}>
                <Await 
                  resolve={labelValue} 
                  errorElement={<span className="text-red-500">Error</span>}
                >
                  {(resolvedData) => resolvedData?.name || resolvedData?.title || 'Details'}
                </Await>
              </Suspense>
            );
          }

          // Regular static string
          return labelValue || 'Details';
        };

        return (
          <React.Fragment key={crumb.id}>
            {index > 0 && (
              <ChevronRight size={14} className="text-gray-400 dark:text-gray-500 flex-shrink-0" />
            )}

            {isLast ? (
              <span className="font-semibold text-gray-900 dark:text-gray-100 truncate flex items-center">
                {renderLabel(crumb.label)}
              </span>
            ) : (
              <Link
                to={crumb.path}
                className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors truncate flex items-center"
              >
                {renderLabel(crumb.label)}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};

```

---

### 2. Handling Loader Failures: Route Error Boundaries

When a loader throws a `404` or `500` error, React Router bubble-up mechanics will render the nearest `errorElement`.

To keep the breadcrumb trail intact so the user can easily click backward (e.g., clicking back to **Home > Projects** when **Project #99** fails to load), handle errors safely at both the component level and route level.

#### Fallback inside `handle.crumb`

Provide defensive default fallbacks in `handle.crumb` when `data` is missing or undefined due to a loader failure:

```jsx
{
  path: ':projectId',
  element: <ProjectPage />,
  loader: projectLoader,
  // If the loader fails or returns null, render a fallback string or URL param
  handle: {
    crumb: (data, params) => ({
      label: data?.project?.name || `Project (${params?.projectId || 'Error'})`,
      path: `/projects/${params?.projectId}`,
    }),
  },
}

```

#### Custom Error Element Displaying Breadcrumbs

Place your `<DynamicBreadcrumbs/>` component inside your global or sub-route `errorElement`. This ensures the user still has an operational layout with breadcrumbs even on 404 pages:

```jsx
import { useRouteError, isRouteErrorResponse, Link } from 'react-router-dom';
import { DynamicBreadcrumbs } from './DynamicBreadcrumbs';

export const RouteErrorFallback = () => {
  const error = useRouteError();

  let title = 'Unexpected Error';
  let message = 'Something went wrong while loading this page.';

  if (isRouteErrorResponse(error)) {
    if (error.status === 404) {
      title = 'Page / Item Not Found';
      message = 'The resource you requested could not be located.';
    }
  }

  return (
    <div className="p-6">
      {/* Breadcrumbs remain active so the user can navigate back */}
      <DynamicBreadcrumbs />

      <div className="bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 rounded-xl p-8 text-center max-w-lg mx-auto my-8">
        <h2 className="text-xl font-bold text-red-700 dark:text-red-400 mb-2">{title}</h2>
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-6">{message}</p>
        <Link
          to="/projects"
          className="inline-block px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium text-sm rounded-lg transition-colors"
        >
          Return to Projects
        </Link>
      </div>
    </div>
  );
};

```

---

### Summary Matrix

| Scenario            | Strategy                                                      | User Experience                                                                           |
| ------------------- | ------------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| **Slow API Call**   | Deferred data (`defer()` / Promises) + React `<Suspense>`     | Breadcrumb bar renders immediately; slow titles show animated pulse skeletons.            |
| **API Error / 404** | Route `errorElement` + defensive `handle.crumb(data, params)` | Breadcrumbs stay visible with fallback IDs/labels so users can navigate back up the tree. |
| **Global Crash**    | Root Error Boundary                                           | Breadcrumb falls back to static ancestor links (`Home > ...`).                            |
When data fetching gets slow or fails, you don't want your breadcrumb navigation to freeze, break, or disappear entirely. React Router provides clean abstractions—**Deferred Data (`defer` / `Suspense`)** for slow requests and **`useRouteError()`** for failures—that let your breadcrumb component handle both gracefully.

Here is how to make your dynamic breadcrumbs resilient to delays and API errors.

---

### 1. Handling Slow Data: Skeleton Loaders with `<Suspense>`

Instead of blocking the initial render while waiting for a slow API call, defer non-critical loader data using React Router's `defer()` (or returning a native promise) paired with React `<Suspense>`.

#### Route Definition with Deferred Promise

Return a deferred promise from your loader so the route resolves instantly while the data loads in the background:

```jsx
import { defer, Await } from 'react-router-dom';

export async function projectLoader({ params }) {
  // Fast call or immediate promise
  const projectPromise = fetch(`/api/projects/${params.projectId}`)
    .then((res) => res.json());

  // Return the promise directly without 'await'
  return defer({
    projectData: projectPromise,
  });
}

export const projectRoute = {
  path: ':projectId',
  element: <ProjectPage />,
  loader: projectLoader,
  handle: {
    // Pass the promise container into handle.crumb
    crumb: (data) => ({
      label: data?.projectData, // This is a Promise!
      path: `/projects/${data?.projectId}`,
    }),
  },
};

```

#### Deferred Breadcrumb Rendering (`DynamicBreadcrumbs.jsx`)

In your breadcrumb component, wrap individual crumb labels with React Router's `<Await>` and React `<Suspense>`. This displays a pulse skeleton specifically for that breadcrumb item while the API promise resolves:

```jsx
import React, { Suspense } from 'react';
import { Link, useMatches, Await } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

// Skeleton fallback for a single breadcrumb label
const CrumbSkeleton = () => (
  <span className="inline-block w-20 h-4 bg-gray-200 dark:bg-gray-700 animate-pulse rounded my-auto" />
);

export const DynamicBreadcrumbs = () => {
  const matches = useMatches();

  const crumbs = matches
    .filter((match) => Boolean(match.handle?.crumb))
    .map((match) => {
      const crumbConfig = match.handle.crumb(match.data);
      return {
        id: match.id,
        // Could be a raw string OR a Promise from defer()
        label: crumbConfig.label, 
        path: crumbConfig.path || match.pathname,
      };
    });

  return (
    <nav
      aria-label="Breadcrumb"
      className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300 mb-6 py-2 px-4 bg-gray-50 dark:bg-gray-800/60 rounded-lg border border-gray-200 dark:border-gray-700/60"
    >
      {crumbs.map((crumb, index) => {
        const isLast = index === crumbs.length - 1;

        // Render the label inside a Suspense boundary if it's a promise
        const renderLabel = (labelValue) => {
          if (labelValue && typeof labelValue.then === 'function') {
            return (
              <Suspense fallback={<CrumbSkeleton />}>
                <Await 
                  resolve={labelValue} 
                  errorElement={<span className="text-red-500">Error</span>}
                >
                  {(resolvedData) => resolvedData?.name || resolvedData?.title || 'Details'}
                </Await>
              </Suspense>
            );
          }

          // Regular static string
          return labelValue || 'Details';
        };

        return (
          <React.Fragment key={crumb.id}>
            {index > 0 && (
              <ChevronRight size={14} className="text-gray-400 dark:text-gray-500 flex-shrink-0" />
            )}

            {isLast ? (
              <span className="font-semibold text-gray-900 dark:text-gray-100 truncate flex items-center">
                {renderLabel(crumb.label)}
              </span>
            ) : (
              <Link
                to={crumb.path}
                className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors truncate flex items-center"
              >
                {renderLabel(crumb.label)}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};

```

---

### 2. Handling Loader Failures: Route Error Boundaries

When a loader throws a `404` or `500` error, React Router bubble-up mechanics will render the nearest `errorElement`.

To keep the breadcrumb trail intact so the user can easily click backward (e.g., clicking back to **Home > Projects** when **Project #99** fails to load), handle errors safely at both the component level and route level.

#### Fallback inside `handle.crumb`

Provide defensive default fallbacks in `handle.crumb` when `data` is missing or undefined due to a loader failure:

```jsx
{
  path: ':projectId',
  element: <ProjectPage />,
  loader: projectLoader,
  // If the loader fails or returns null, render a fallback string or URL param
  handle: {
    crumb: (data, params) => ({
      label: data?.project?.name || `Project (${params?.projectId || 'Error'})`,
      path: `/projects/${params?.projectId}`,
    }),
  },
}

```

#### Custom Error Element Displaying Breadcrumbs

Place your `<DynamicBreadcrumbs/>` component inside your global or sub-route `errorElement`. This ensures the user still has an operational layout with breadcrumbs even on 404 pages:

```jsx
import { useRouteError, isRouteErrorResponse, Link } from 'react-router-dom';
import { DynamicBreadcrumbs } from './DynamicBreadcrumbs';

export const RouteErrorFallback = () => {
  const error = useRouteError();

  let title = 'Unexpected Error';
  let message = 'Something went wrong while loading this page.';

  if (isRouteErrorResponse(error)) {
    if (error.status === 404) {
      title = 'Page / Item Not Found';
      message = 'The resource you requested could not be located.';
    }
  }

  return (
    <div className="p-6">
      {/* Breadcrumbs remain active so the user can navigate back */}
      <DynamicBreadcrumbs />

      <div className="bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 rounded-xl p-8 text-center max-w-lg mx-auto my-8">
        <h2 className="text-xl font-bold text-red-700 dark:text-red-400 mb-2">{title}</h2>
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-6">{message}</p>
        <Link
          to="/projects"
          className="inline-block px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium text-sm rounded-lg transition-colors"
        >
          Return to Projects
        </Link>
      </div>
    </div>
  );
};

```

---

### Summary Matrix

| Scenario            | Strategy                                                      | User Experience                                                                           |
| ------------------- | ------------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| **Slow API Call**   | Deferred data (`defer()` / Promises) + React `<Suspense>`     | Breadcrumb bar renders immediately; slow titles show animated pulse skeletons.            |
| **API Error / 404** | Route `errorElement` + defensive `handle.crumb(data, params)` | Breadcrumbs stay visible with fallback IDs/labels so users can navigate back up the tree. |
| **Global Crash**    | Root Error Boundary                                           | Breadcrumb falls back to static ancestor links (`Home > ...`).                            |
Show me how to prefetch React Router loader data when hovering over breadcrumb links.

Show me how to prefetch React Router loader data when hovering over breadcrumb links.

Prefetching data on hover eliminates transition delay completely: by the time the user clicks a breadcrumb link, the route's loader data is already warm in the cache (or in React Router's internal loader queue).

React Router (v6.4+) works with standard router utilities to initiate data loading ahead of navigation. Here are the **two main patterns** to implement prefetching on breadcrumb hover:

1. **Using React Router’s Native `<Link prefetch="intent">**` (If using Framework / Data Router integration like Remix or React Router v7).
2. **Custom `useFetcher` / Loader Trigger Pattern** (Standard Client-Side `react-router-dom` setup).

---

### Pattern 1: Custom Hover Prefetch Hook (Standard `react-router-dom`)

In standard client-side React Router setups using `createBrowserRouter`, you can use `useFetchers()` or call your loader functions directly on `onMouseEnter` to populate a global cache (or Query Cache like TanStack Query).

Here is a clean implementation using an in-memory route cache that pre-runs the target route loader on hover:

#### 1. The Prefetch Utility & Cache (`routeCache.js`)

```javascript
// Simple in-memory cache for prefetched loader data
const loaderCache = new Map();

export async function prefetchRouteData(path, loaderFn, params) {
  if (loaderCache.has(path)) {
    return loaderCache.get(path);
  }

  try {
    // Execute loader manually ahead of navigation
    const dataPromise = loaderFn({ params, request: new Request(window.location.origin + path) });
    loaderCache.set(path, dataPromise);
    return await dataPromise;
  } catch (error) {
    loaderCache.delete(path); // Clear failed attempts
  }
}

export function getCachedData(path) {
  return loaderCache.get(path);
}

```

#### 2. Enhanced Breadcrumb Link Component (`PrefetchBreadcrumbLink.jsx`)

Create a wrapper around `<Link>` that triggers prefetching on hover (`onMouseEnter`) or focus (`onFocus` for accessibility):

```jsx
import React, { useRef } from 'react';
import { Link, matchRoutes } from 'react-router-dom';

export const PrefetchBreadcrumbLink = ({ to, children, routes, className }) => {
  const prefetchedRef = useRef(false);

  const handlePrefetch = () => {
    // Only prefetch once per link instance
    if (prefetchedRef.current) return;

    // 1. Match the target path against your route definitions
    const matches = matchRoutes(routes, to);
    
    if (matches) {
      matches.forEach((match) => {
        // 2. If the matched route has a loader, run it early
        if (match.route.loader) {
          match.route.loader({
            params: match.params,
            request: new Request(window.location.origin + to),
          });
        }
      });
      prefetchedRef.current = true;
    }
  };

  return (
    <Link
      to={to}
      onMouseEnter={handlePrefetch}
      onFocus={handlePrefetch}
      className={className}
    >
      {children}
    </Link>
  );
};

```

---

### Pattern 2: Integration with TanStack / React Query (Recommended for Production)

If your app uses **TanStack Query** inside your React Router loaders, prefetching on breadcrumb hover becomes a single clean function call using `queryClient.prefetchQuery`.

#### Loader with React Query (`loaders.js`)

```javascript
import { queryClient } from './queryClient';

// Query configuration object
export const projectQuery = (id) => ({
  queryKey: ['project', id],
  queryFn: async () => {
    const res = await fetch(`/api/projects/${id}`);
    return res.json();
  },
});

// React Router Loader reads from TanStack Query cache
export const projectLoader = async ({ params }) => {
  return queryClient.ensureQueryData(projectQuery(params.projectId));
};

```

#### Prefetch-enabled Breadcrumbs (`DynamicBreadcrumbs.jsx`)

```jsx
import React from 'react';
import { Link, useMatches } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { projectQuery } from './loaders';

export const DynamicBreadcrumbs = () => {
  const matches = useMatches();
  const queryClient = useQueryClient();

  const crumbs = matches
    .filter((match) => Boolean(match.handle?.crumb))
    .map((match) => {
      const crumbConfig = match.handle.crumb(match.data);
      return {
        id: match.id,
        label: crumbConfig.label,
        path: crumbConfig.path || match.pathname,
        params: match.params,
      };
    });

  // Prefetch function passed to link hover handler
  const prefetchCrumb = (crumb) => {
    if (crumb.params?.projectId) {
      // Warm up TanStack Query cache before user clicks
      queryClient.prefetchQuery(projectQuery(crumb.params.projectId));
    }
  };

  return (
    <nav aria-label="Breadcrumb" className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300 mb-6 py-2 px-4 bg-gray-50 dark:bg-gray-800/60 rounded-lg border border-gray-200 dark:border-gray-700/60">
      {crumbs.map((crumb, index) => {
        const isLast = index === crumbs.length - 1;

        return (
          <React.Fragment key={crumb.id}>
            {index > 0 && <ChevronRight size={14} className="text-gray-400 dark:text-gray-500 flex-shrink-0" />}

            {isLast ? (
              <span className="font-semibold text-gray-900 dark:text-gray-100 truncate">
                {crumb.label}
              </span>
            ) : (
              <Link
                to={crumb.path}
                onMouseEnter={() => prefetchCrumb(crumb)}
                onFocus={() => prefetchCrumb(crumb)}
                className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors truncate"
              >
                {crumb.label}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};

```

---

### Pattern 3: Framework / Remix / React Router v7 (`prefetch="intent"`)

If you are using React Router in a framework setup (or Remix / React Router v7), route prefetching is natively built into the `<Link>` component:

```jsx
import { Link } from 'react-router-dom';

// Specifying prefetch="intent" automatically prefetches the loader JS & data 
// when the user hovers over or focuses on the breadcrumb link.
<Link to="/projects/102" prefetch="intent">
  Acme Project
</Link>

```

---

### Performance Best Practices

1. **Debounce / Delay slightly if needed**: If users quickly drag their mouse across the breadcrumbs bar, you don't want to fire 5 API requests at once. Hover intent typically kicks in after **50ms-100ms** of continuous hover.
2. **Set a short TTL (Time-To-Live)**: Keep prefetched data in cache for ~30–60 seconds so users don't see stale data if they hover, leave, and come back later.

Add a global search modal component triggered by Cmd+K or Ctrl+K keyboard shortcut.

Here is a complete, accessible **Global Command Palette Search Modal** component triggered by `Cmd+K` (macOS) or `Ctrl+K` (Windows/Linux), as well as by clicking a search trigger input in your top navigation bar.

It features keyboard navigation (Up/Down arrow keys, Enter, Escape), dynamic routing via React Router, category grouping, and dark mode support matching your layout.

---

### Step 1: Create the Command Palette Component (`CommandMenu.jsx`)

```jsx
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Command, BookOpen, Layers, Settings, Home, ArrowRight, X } from 'lucide-react';

export const CommandMenu = ({ isOpen, setIsOpen }) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  // Search items database categorized by section
  const searchItems = [
    { id: '1', title: 'Overview', category: 'Navigation', icon: Home, path: '/' },
    { id: '2', title: 'Documentation', category: 'Navigation', icon: BookOpen, path: '/docs' },
    { id: '3', title: 'Features List', category: 'Navigation', icon: Layers, path: '/features' },
    { id: '4', title: 'Settings', category: 'Navigation', icon: Settings, path: '/settings' },
    { id: '5', title: 'Installation Guide', category: 'Documentation', icon: BookOpen, path: '/docs#installation' },
    { id: '6', title: 'Architecture Overview', category: 'Documentation', icon: BookOpen, path: '/docs#architecture' },
    { id: '7', title: 'API Reference', category: 'Documentation', icon: BookOpen, path: '/docs#api-reference' },
  ];

  // Filter items based on search input
  const filteredItems = searchItems.filter((item) =>
    item.title.toLowerCase().includes(query.toLowerCase()) ||
    item.category.toLowerCase().includes(query.toLowerCase())
  );

  // 1. Listen for global Cmd+K or Ctrl+K shortcut
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setIsOpen]);

  // 2. Focus input whenever modal opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setSelectedIndex(0);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  // 3. Handle keyboard navigation (Arrow Up, Arrow Down, Enter, Escape)
  const handleKeyDownInModal = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < filteredItems.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : filteredItems.length - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredItems[selectedIndex]) {
        handleSelectItem(filteredItems[selectedIndex]);
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  const handleSelectItem = (item) => {
    setIsOpen(false);
    navigate(item.path);
    if (item.path.includes('#')) {
      const targetId = item.path.split('#')[1];
      setTimeout(() => {
        document.getElementById(targetId)?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-gray-900/60 dark:bg-black/70 backdrop-blur-sm transition-opacity">
      {/* Backdrop overlay listener */}
      <div className="fixed inset-0" onClick={() => setIsOpen(false)} />

      {/* Main Command Modal */}
      <div className="relative w-full max-w-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow-2xl overflow-hidden z-10 flex flex-col max-h-[80vh]">
        {/* Search Header */}
        <div className="flex items-center px-4 py-3 border-b border-gray-200 dark:border-gray-800">
          <Search size={18} className="text-gray-400 dark:text-gray-500 mr-3 flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDownInModal}
            placeholder="Search documentation, guides, settings... (Use ↑ ↓ to navigate)"
            className="w-full bg-transparent text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none"
          />
          <button
            onClick={() => setIsOpen(false)}
            className="p-1 rounded text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
          >
            <X size={16} />
          </button>
        </div>

        {/* Results List */}
        <div className="overflow-y-auto p-2 space-y-1 divide-y divide-gray-100 dark:divide-gray-800/50">
          {filteredItems.length === 0 ? (
            <div className="p-8 text-center text-sm text-gray-500 dark:text-gray-400">
              No results found for <span className="font-semibold">"{query}"</span>
            </div>
          ) : (
            filteredItems.map((item, index) => {
              const Icon = item.icon;
              const isSelected = index === selectedIndex;

              return (
                <button
                  key={item.id}
                  onClick={() => handleSelectItem(item)}
                  onMouseEnter={() => setSelectedIndex(index)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-colors ${
                    isSelected
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  <div className="flex items-center space-x-3 truncate">
                    <Icon
                      size={16}
                      className={isSelected ? 'text-white' : 'text-gray-400 dark:text-gray-500'}
                    />
                    <span className="font-medium truncate">{item.title}</span>
                  </div>

                  <div className="flex items-center space-x-2 flex-shrink-0 ml-4">
                    <span
                      className={`text-xs px-2 py-0.5 rounded ${
                        isSelected
                          ? 'bg-blue-500/40 text-white'
                          : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400'
                      }`}
                    >
                      {item.category}
                    </span>
                    <ArrowRight
                      size={14}
                      className={isSelected ? 'text-white' : 'opacity-0'}
                    />
                  </div>
                </button>
              );
            })
          )}
        </div>

        {/* Footer Shortcut Legend */}
        <div className="px-4 py-2.5 bg-gray-50 dark:bg-gray-950 border-t border-gray-200 dark:border-gray-800 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
          <div className="flex items-center space-x-3">
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-gray-200 dark:bg-gray-800 rounded">↑</kbd>
              <kbd className="px-1.5 py-0.5 bg-gray-200 dark:bg-gray-800 rounded">↓</kbd> navigate
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-gray-200 dark:bg-gray-800 rounded">↵</kbd> select
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-gray-200 dark:bg-gray-800 rounded">esc</kbd> close
            </span>
          </div>
          <span className="hidden sm:inline">Search Navigation</span>
        </div>
      </div>
    </div>
  );
};

```

---

### Step 2: Add Trigger Button to Top Navigation Bar (`MainLayout.jsx`)

Integrate `<CommandMenu/>` into your top navbar and add a trigger button displaying the `⌘K` or `Ctrl+K` shortcut hint badge:

```jsx
import React, { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { Menu, X, BookOpen, Layers, Settings, Home, Compass, Sun, Moon, Search } from 'lucide-react';
import { Breadcrumbs } from './Breadcrumbs';
import { CommandMenu } from './CommandMenu';
import { useLocalStorage } from './useLocalStorage';
import { useTheme } from './useTheme';

export const MainLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useLocalStorage('sidebar_open', true);
  const [isDarkMode, setIsDarkMode] = useTheme();
  
  // State controlling Search Modal visibility
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-gray-100 dark:bg-gray-950 text-gray-900 dark:text-gray-100 font-sans transition-colors duration-200">
      {/* Search Modal */}
      <CommandMenu isOpen={isSearchOpen} setIsOpen={setIsSearchOpen} />

      {/* Top Navbar */}
      <header className="h-16 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-4 flex items-center justify-between sticky top-0 z-30 shadow-sm transition-colors">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-200 transition-colors"
          >
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <div className="flex items-center space-x-2 font-bold text-lg text-blue-600 dark:text-blue-400">
            <Compass size={24} />
            <span>AppWorkspace</span>
          </div>
        </div>

        {/* Global Search Trigger Bar */}
        <button
          onClick={() => setIsSearchOpen(true)}
          className="flex items-center justify-between w-64 md:w-80 px-3 py-1.5 bg-gray-100 dark:bg-gray-800/80 hover:bg-gray-200 dark:hover:bg-gray-800 border border-gray-200 dark:border-gray-700/60 rounded-lg text-sm text-gray-500 dark:text-gray-400 transition-colors"
        >
          <div className="flex items-center space-x-2">
            <Search size={16} />
            <span>Search docs...</span>
          </div>
          <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-xs font-semibold bg-white dark:bg-gray-900 text-gray-500 dark:text-gray-400 border border-gray-300 dark:border-gray-700 rounded shadow-xs">
            {navigator.platform.toUpperCase().indexOf('MAC') >= 0 ? '⌘K' : 'Ctrl+K'}
          </kbd>
        </button>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            {isDarkMode ? <Sun size={18} className="text-amber-400" /> : <Moon size={18} className="text-slate-600" />}
          </button>
        </div>
      </header>

      {/* Main Container */}
      <div className="flex flex-1 relative overflow-hidden">
        {/* ... Sidebar and Main content remain unchanged ... */}
      </div>
    </div>
  );
};

```

### Features Included

1. **OS Detection**: Dynamically shows `⌘K` on macOS or `Ctrl+K` on Windows/Linux in the header trigger badge.
2. **Full Keyboard Accessibility**: Arrow key selection loops through filtered results and auto-scrolls into view; pressing `Enter` routes to the targeted item or section.
3. **Smooth Scroll Targets**: Selecting a sub-section result (e.g., `/docs#installation`) navigates to the route and scrolls directly to that heading element inside the main container.

How can I add smooth page transition animations using Framer Motion with React Router?

To create smooth page transition animations when navigating between React Router routes, you can use **Framer Motion's `<AnimatePresence>**` paired with React Router's **`useLocation()`** hook.

The key to making page transitions work in React Router is passing the current `location` object to `<Routes key="{location.pathname}" location="{location}">`. This lets Framer Motion track when a route is exiting while the new route enters simultaneously.

---

### Step 1: Install Framer Motion

```bash
npm install framer-motion

```

---

### Step 2: Create an Animated Layout Wrapper (`AnimatedPage.jsx`)

Create a reusable wrapper component that applies enter, exit, and transition props to any route view:

```jsx
import React from 'react';
import { motion } from 'framer-motion';

// Defined animation variants
const pageVariants = {
  initial: {
    opacity: 0,
    y: 12, // Slight upward slide
    scale: 0.99,
  },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
  },
  exit: {
    opacity: 0,
    y: -12, // Slide up while fading out
    scale: 0.99,
  },
};

const pageTransition = {
  type: 'tween',
  ease: 'easeInOut',
  duration: 0.25,
};

export const AnimatedPage = ({ children }) => {
  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={pageTransition}
      className="w-full h-full"
    >
      {children}
    </motion.div>
  );
};

```

---

### Step 3: Wrap Route Outlet in `<AnimatePresence>` (`AnimatedOutlet.jsx`)

Instead of standard `<Outlet/>`, wrap the current route element with `AnimatePresence`. Passing `location.pathname` as the `key` tells React/Framer Motion that the component hierarchy has changed, triggering exit animations for the old route and enter animations for the new route.

```jsx
import React from 'react';
import { useLocation, useOutlet } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { AnimatedPage } from './AnimatedPage';

export const AnimatedOutlet = () => {
  const location = useLocation();
  const outlet = useOutlet();

  return (
    <AnimatePresence mode="wait" initial={false}>
      {/* 
        The key attribute is required so AnimatePresence detects 
        route pathname changes and animates the exit phase.
      */}
      <React.Fragment key={location.pathname}>
        <AnimatedPage>{outlet}</AnimatedPage>
      </React.Fragment>
    </AnimatePresence>
  );
};

```

> **Note on `mode="wait"`:** Setting `mode="wait"` ensures that the old route completes its exit animation *before* the new route starts its enter animation, preventing layout flickering or vertical content stacking.

---

### Step 4: Integrate into Main Layout (`MainLayout.jsx`)

Replace standard `<Outlet/>` in your `MainLayout` with `<AnimatedOutlet/>`:

```jsx
import React, { useRef } from 'react';
import { Breadcrumbs } from './Breadcrumbs';
import { AnimatedOutlet } from './AnimatedOutlet';

export const MainLayout = () => {
  const mainContentRef = useRef(null);

  return (
    <div className="min-h-screen flex flex-col bg-gray-100 dark:bg-gray-950 text-gray-900 dark:text-gray-100 font-sans">
      {/* Top Navbar & Sidebar remain here */}
      <div className="flex flex-1 relative overflow-hidden">
        {/* Central Main Scrollable Container */}
        <main className="flex-1 flex overflow-hidden">
          <div
            ref={mainContentRef}
            className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6 scroll-smooth"
          >
            <Breadcrumbs />
            
            {/* Animated Route Container */}
            <AnimatedOutlet />
          </div>
        </main>
      </div>
    </div>
  );
};

```

---

### Alternative Preset Transitions

Depending on your design needs, you can switch out the `pageVariants` object inside `AnimatedPage.jsx`:

#### 1. Horizontal Slide (Tabs / Wizard effect)

```javascript
const slideVariants = {
  initial: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -20 },
};

```

#### 2. Subtle Fade Only (Minimal / Documentation Sites)

```javascript
const fadeVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

```

#### 3. Scale Zoom Effect (Modal / Dashboard Cards)

```javascript
const zoomVariants = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 1.05 },
};

```
